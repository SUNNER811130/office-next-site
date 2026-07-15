import { promises as fs } from "fs";
import path from "path";

import { atomicReplaceJson, type AtomicContentFileOptions } from "@/lib/atomic-content-file";
import {
  contentEnvelopeHasDrafts,
  createEditorSnapshot,
  createPreviewContent,
  parseContentEnvelope,
  readPublishedSnapshot
} from "@/lib/content-envelope";
import { runSerializedContentMutation } from "@/lib/content-mutation-coordinator";
import { getScopeValue, mergeScopeValue, normalizeScopeValue } from "@/lib/content-scopes";
import {
  ContentDraftNotFoundError,
  ContentRevisionConflictError,
  ContentStorageMutationError,
  LegacyContentWriteBlockedError
} from "@/lib/content-workflow-errors";
import type { SiteContent } from "@/types/content";
import type {
  ContentDrafts,
  ContentEnvelopeV1,
  ContentScope,
  ContentWorkflowRepository,
  DiscardDraftInput,
  DraftRecord,
  EditorSnapshot,
  PublishDraftInput,
  PublishedSnapshot,
  SaveDraftInput,
  ScopeValue
} from "@/types/content-workflow";

export interface ContentPersistenceReader {
  readFile(filePath: string, encoding: "utf8"): Promise<string>;
}

type AtomicJsonWriter = (filePath: string, value: unknown) => Promise<void>;

export type LocalFileContentWorkflowRepositoryOptions = {
  persistencePath: string;
  seed: SiteContent;
  clock?: () => string;
  reader?: ContentPersistenceReader;
  atomicWriter?: AtomicJsonWriter;
  atomicFileOptions?: AtomicContentFileOptions;
};

type PersistenceState = {
  envelope: ContentEnvelopeV1;
  format: "missing" | "legacy" | "envelope";
};

function isMissingFileError(error: unknown): boolean {
  return typeof error === "object"
    && error !== null
    && "code" in error
    && (error as { code?: unknown }).code === "ENOENT";
}

function getDraft<TScope extends ContentScope>(
  drafts: ContentDrafts,
  scope: TScope
): DraftRecord<ScopeValue<TScope>> | undefined {
  return drafts[scope] as DraftRecord<ScopeValue<TScope>> | undefined;
}

function setDraft<TScope extends ContentScope>(
  drafts: ContentDrafts,
  scope: TScope,
  draft: DraftRecord<ScopeValue<TScope>>
): ContentDrafts {
  return { ...drafts, [scope]: draft } as ContentDrafts;
}

function removeDraft(drafts: ContentDrafts, scope: ContentScope): ContentDrafts {
  const next = { ...drafts };
  delete next[scope];
  return next;
}

export class LocalFileContentWorkflowRepository implements ContentWorkflowRepository {
  readonly persistencePath: string;
  private readonly seed: SiteContent;
  private readonly clock: () => string;
  private readonly reader: ContentPersistenceReader;
  private readonly atomicWriter: AtomicJsonWriter;

  constructor(options: LocalFileContentWorkflowRepositoryOptions) {
    this.persistencePath = path.resolve(options.persistencePath);
    this.seed = options.seed;
    this.clock = options.clock ?? (() => new Date().toISOString());
    this.reader = options.reader ?? fs;
    this.atomicWriter = options.atomicWriter
      ?? ((filePath, value) => atomicReplaceJson(filePath, value, options.atomicFileOptions));
  }

  private async readState(timestamp: string): Promise<PersistenceState> {
    let parsed: unknown;
    try {
      const raw = await this.reader.readFile(this.persistencePath, "utf8");
      try {
        parsed = JSON.parse(raw);
      } catch (error: unknown) {
        throw new ContentStorageMutationError(path.basename(this.persistencePath), error);
      }
    } catch (error: unknown) {
      if (isMissingFileError(error)) {
        return {
          envelope: parseContentEnvelope(this.seed, { migrationBaseline: timestamp }),
          format: "missing"
        };
      }
      if (error instanceof ContentStorageMutationError) throw error;
      throw new ContentStorageMutationError(path.basename(this.persistencePath), error);
    }

    const envelope = parseContentEnvelope(parsed, { migrationBaseline: timestamp });
    const format = typeof parsed === "object"
      && parsed !== null
      && "schemaVersion" in parsed
      ? "envelope"
      : "legacy";
    return { envelope, format };
  }

  private conflict<TScope extends ContentScope>(
    input: {
      scope: TScope;
      expectedDraftRevision: number | null;
      expectedPublishedRevision: number | null;
    },
    envelope: ContentEnvelopeV1
  ): ContentRevisionConflictError {
    return new ContentRevisionConflictError({
      scope: input.scope,
      expectedDraftRevision: input.expectedDraftRevision,
      currentDraftRevision: getDraft(envelope.drafts, input.scope)?.revision ?? null,
      expectedPublishedRevision: input.expectedPublishedRevision,
      currentPublishedRevision: envelope.published.scopeRevisions[input.scope]
    });
  }

  private async mutate<TResult>(
    mutation: (state: PersistenceState, timestamp: string) => { envelope: ContentEnvelopeV1; result: TResult }
  ): Promise<TResult> {
    return runSerializedContentMutation(this.persistencePath, async () => {
      const timestamp = this.clock();
      const state = await this.readState(timestamp);
      const next = mutation(state, timestamp);
      try {
        await this.atomicWriter(this.persistencePath, next.envelope);
      } catch (error: unknown) {
        if (error instanceof ContentStorageMutationError) throw error;
        throw new ContentStorageMutationError(path.basename(this.persistencePath), error);
      }
      return next.result;
    });
  }

  private async readEnvelope(): Promise<ContentEnvelopeV1> {
    return (await this.readState(this.clock())).envelope;
  }

  async readPublished(): Promise<PublishedSnapshot> {
    return readPublishedSnapshot(await this.readEnvelope());
  }

  async readEditor<TScope extends ContentScope>(scope: TScope): Promise<EditorSnapshot<TScope>> {
    return createEditorSnapshot(await this.readEnvelope(), scope);
  }

  async readPreview(scope: ContentScope): Promise<SiteContent> {
    return createPreviewContent(await this.readEnvelope(), scope);
  }

  async hasDrafts(): Promise<boolean> {
    return contentEnvelopeHasDrafts(await this.readEnvelope());
  }

  async saveDraft<TScope extends ContentScope>(
    input: SaveDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    return this.mutate((state, timestamp) => {
      const currentDraft = getDraft(state.envelope.drafts, input.scope);
      const currentPublishedRevision = state.envelope.published.scopeRevisions[input.scope];
      if (
        (currentDraft?.revision ?? null) !== input.expectedDraftRevision
        || currentPublishedRevision !== input.expectedPublishedRevision
        || (currentDraft !== undefined
          && currentDraft.basedOnPublishedRevision !== currentPublishedRevision)
      ) {
        throw this.conflict(input, state.envelope);
      }

      const draft: DraftRecord<ScopeValue<TScope>> = {
        value: normalizeScopeValue(input.scope, input.value),
        revision: (currentDraft?.revision ?? 0) + 1,
        basedOnPublishedRevision: currentDraft?.basedOnPublishedRevision ?? currentPublishedRevision,
        updatedAt: timestamp
      };
      const envelope: ContentEnvelopeV1 = {
        ...state.envelope,
        drafts: setDraft(state.envelope.drafts, input.scope, draft)
      };
      return { envelope, result: createEditorSnapshot(envelope, input.scope) };
    });
  }

  async publishDraft<TScope extends ContentScope>(
    input: PublishDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    return this.mutate((state, timestamp) => {
      const draft = getDraft(state.envelope.drafts, input.scope);
      if (!draft) throw new ContentDraftNotFoundError(input.scope);
      const currentPublishedRevision = state.envelope.published.scopeRevisions[input.scope];
      if (
        draft.revision !== input.expectedDraftRevision
        || currentPublishedRevision !== input.expectedPublishedRevision
        || draft.basedOnPublishedRevision !== currentPublishedRevision
      ) {
        throw this.conflict(input, state.envelope);
      }

      const normalized = normalizeScopeValue(input.scope, draft.value);
      const published = {
        ...state.envelope.published,
        content: mergeScopeValue(state.envelope.published.content, input.scope, normalized),
        revision: state.envelope.published.revision + 1,
        updatedAt: timestamp,
        scopeRevisions: {
          ...state.envelope.published.scopeRevisions,
          [input.scope]: currentPublishedRevision + 1
        },
        scopeUpdatedAt: {
          ...state.envelope.published.scopeUpdatedAt,
          [input.scope]: timestamp
        }
      };
      const envelope: ContentEnvelopeV1 = {
        ...state.envelope,
        published,
        drafts: removeDraft(state.envelope.drafts, input.scope)
      };
      return { envelope, result: createEditorSnapshot(envelope, input.scope) };
    });
  }

  async discardDraft<TScope extends ContentScope>(
    input: DiscardDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    return this.mutate((state) => {
      const draft = getDraft(state.envelope.drafts, input.scope);
      if (!draft) throw new ContentDraftNotFoundError(input.scope);
      if (draft.revision !== input.expectedDraftRevision) {
        throw this.conflict({ ...input, expectedPublishedRevision: null }, state.envelope);
      }
      const envelope: ContentEnvelopeV1 = {
        ...state.envelope,
        drafts: removeDraft(state.envelope.drafts, input.scope)
      };
      return { envelope, result: createEditorSnapshot(envelope, input.scope) };
    });
  }

  async replaceLegacyPublished(content: SiteContent): Promise<void> {
    await this.mutateLegacy(() => content);
  }

  async mutateLegacyPublished(
    update: (latest: SiteContent) => SiteContent
  ): Promise<SiteContent> {
    return this.mutateLegacy(update);
  }

  private async mutateLegacy(
    update: (latest: SiteContent) => SiteContent
  ): Promise<SiteContent> {
    return runSerializedContentMutation(this.persistencePath, async () => {
      const timestamp = this.clock();
      const state = await this.readState(timestamp);
      if (state.format === "envelope") throw new LegacyContentWriteBlockedError();
      const next = parseContentEnvelope(update(state.envelope.published.content), {
        migrationBaseline: timestamp
      }).published.content;
      try {
        await this.atomicWriter(this.persistencePath, next);
      } catch (error: unknown) {
        if (error instanceof ContentStorageMutationError) throw error;
        throw new ContentStorageMutationError(path.basename(this.persistencePath), error);
      }
      return next;
    });
  }
}
