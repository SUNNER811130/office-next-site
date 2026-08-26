import type {
  ContentMutationOperation,
  ContentMutationPolicy,
  ContentPersistenceConfig,
  ContentPersistenceDriver,
  ContentRuntimeEnvironment
} from "@/lib/content-persistence-config";
import { resolveScopedContentMutationPolicy } from "@/lib/content-persistence-config";
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

export function assertLegacyContentMutationsEnabled(config: ContentPersistenceConfig): never {
  assertContentMutationsEnabled(config.mutationPolicy, config);
  throw new ContentMutationDisabledError({
    environment: config.environment,
    driver: config.driver,
    reason: "SCOPED_MUTATION_CAPABILITY_REQUIRED"
  });
}

const authorizedMutationTokens = new WeakSet<object>();

export type AuthorizedContentMutation = Readonly<{
  operation: ContentMutationOperation;
  scope: ContentScope;
}>;

type AuthorizedContentMutationDetails = AuthorizedContentMutation & {
  config: ContentPersistenceConfig;
};

export function authorizeContentMutation(
  config: ContentPersistenceConfig,
  operation: ContentMutationOperation,
  scope: ContentScope
): AuthorizedContentMutation {
  const policy = resolveScopedContentMutationPolicy(config, operation, scope);
  assertContentMutationsEnabled(policy, config);
  const authorization = Object.freeze({ operation, scope, config });
  authorizedMutationTokens.add(authorization);
  return authorization;
}

export function getAuthorizedContentMutationDetails(
  authorization: AuthorizedContentMutation
): AuthorizedContentMutationDetails {
  if (!authorizedMutationTokens.has(authorization)) {
    throw new Error("Invalid content mutation authorization");
  }
  return authorization as AuthorizedContentMutationDetails;
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

export class ScopedContentMutationRepositoryCapability implements ContentWorkflowRepository {
  readonly operation: ContentMutationOperation;
  readonly scope: ContentScope;

  constructor(
    private readonly inner: ContentWorkflowRepository,
    private readonly authorization: AuthorizedContentMutation
  ) {
    const details = getAuthorizedContentMutationDetails(authorization);
    this.operation = details.operation;
    this.scope = details.scope;
  }

  private reject(reason: ContentMutationDisabledError["reason"]): never {
    const { config } = getAuthorizedContentMutationDetails(this.authorization);
    throw new ContentMutationDisabledError({
      environment: config.environment,
      driver: config.driver,
      reason
    });
  }

  private assert(operation: ContentMutationOperation, scope: ContentScope): void {
    if (operation !== this.operation) this.reject("SCOPED_MUTATION_CAPABILITY_REQUIRED");
    if (scope !== this.scope) this.reject("MUTATION_SCOPE_NOT_ALLOWED");
  }

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
    input: SaveDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    this.assert("save-draft", input.scope);
    return this.inner.saveDraft(input);
  }

  publishDraft<TScope extends ContentScope>(
    input: PublishDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    this.assert("publish", input.scope);
    return this.inner.publishDraft(input);
  }

  discardDraft<TScope extends ContentScope>(
    input: DiscardDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    this.assert("discard-draft", input.scope);
    return this.inner.discardDraft(input);
  }

  resetDraft<TScope extends ContentScope>(
    input: SaveDraftInput<TScope>
  ): Promise<EditorSnapshot<TScope>> {
    this.assert("reset-draft", input.scope);
    return this.inner.saveDraft(input);
  }
}

export function createScopedContentMutationRepositoryCapability(
  repository: ContentWorkflowRepository,
  authorization: AuthorizedContentMutation
): ScopedContentMutationRepositoryCapability {
  return new ScopedContentMutationRepositoryCapability(repository, authorization);
}

export function applyContentMutationPolicy(
  repository: ContentWorkflowRepository,
  config: ContentPersistenceConfig
): ContentWorkflowRepository {
  return new ReadOnlyContentWorkflowRepository(repository, {
    environment: config.environment,
    driver: config.driver,
    reason: config.mutationPolicy.enabled
      ? "SCOPED_MUTATION_CAPABILITY_REQUIRED"
      : config.mutationPolicy.reason
  });
}
