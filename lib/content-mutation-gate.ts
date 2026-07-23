import type {
  ContentMutationPolicy,
  ContentPersistenceConfig,
  ContentPersistenceDriver,
  ContentRuntimeEnvironment
} from "@/lib/content-persistence-config";
import { ContentMutationDisabledError } from "@/lib/content-workflow-errors";
import type {
  ContentScope,
  ContentWorkflowRepository,
  DiscardDraftInput,
  EditorSnapshot,
  PublishDraftInput,
  SaveDraftInput
} from "@/types/content-workflow";

export function assertContentMutationsEnabled(
  policy: ContentMutationPolicy,
  context: {
    environment: ContentRuntimeEnvironment;
    driver: ContentPersistenceDriver;
  }
): void {
  if (!policy.enabled) {
    throw new ContentMutationDisabledError({ ...context, reason: policy.reason });
  }
}

export function assertLegacyContentMutationsEnabled(config: ContentPersistenceConfig): void {
  assertContentMutationsEnabled(config.mutationPolicy, config);
  if (config.driver !== "local") {
    throw new ContentMutationDisabledError({
      environment: config.environment,
      driver: config.driver,
      reason: "LEGACY_MUTATIONS_REQUIRE_LOCAL_DRIVER"
    });
  }
}

export class ReadOnlyContentWorkflowRepository implements ContentWorkflowRepository {
  constructor(
    private readonly inner: ContentWorkflowRepository,
    private readonly context: {
      environment: ContentRuntimeEnvironment;
      driver: ContentPersistenceDriver;
      reason: ContentMutationDisabledError["reason"];
    }
  ) {}

  readPublished() {
    return this.inner.readPublished();
  }

  readEditor<TScope extends ContentScope>(scope: TScope): Promise<EditorSnapshot<TScope>> {
    return this.inner.readEditor(scope);
  }

  readPreview(scope: ContentScope) {
    return this.inner.readPreview(scope);
  }

  hasDrafts() {
    return this.inner.hasDrafts();
  }

  saveDraft<TScope extends ContentScope>(
    _input: SaveDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    return Promise.reject(new ContentMutationDisabledError(this.context));
  }

  publishDraft<TScope extends ContentScope>(
    _input: PublishDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    return Promise.reject(new ContentMutationDisabledError(this.context));
  }

  discardDraft<TScope extends ContentScope>(
    _input: DiscardDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    return Promise.reject(new ContentMutationDisabledError(this.context));
  }
}

export function applyContentMutationPolicy(
  repository: ContentWorkflowRepository,
  config: ContentPersistenceConfig
): ContentWorkflowRepository {
  if (config.mutationPolicy.enabled) return repository;
  return new ReadOnlyContentWorkflowRepository(repository, {
    environment: config.environment,
    driver: config.driver,
    reason: config.mutationPolicy.reason
  });
}
