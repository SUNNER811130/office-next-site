import type { PageBlockConfig, PageBlockId, PageBlockSettings } from "@/types/content";
import type { PageBlockEditorPage } from "./page-block-editor-types";

export function updatePageBlock<TId extends PageBlockId>(
  blocks: readonly PageBlockConfig<TId>[],
  index: number,
  patch: Partial<PageBlockConfig<TId>>
): PageBlockConfig<TId>[] {
  return blocks.map((block, position) => position === index ? { ...block, ...patch, id: block.id } : block);
}

export function movePageBlock<TId extends PageBlockId>(
  blocks: readonly PageBlockConfig<TId>[],
  index: number,
  direction: -1 | 1
): PageBlockConfig<TId>[] {
  const target = index + direction;
  if (index === 0 || target < 1 || target >= blocks.length) return [...blocks];
  const reordered = [...blocks];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
  return reordered.map((block, order) => ({ ...block, order }));
}

export function createPageBlockSavePayload<TPage extends PageBlockEditorPage>(
  page: TPage,
  blocks: PageBlockSettings[TPage]
) {
  return { page, blocks };
}

export async function requestPageBlockSave<TPage extends PageBlockEditorPage>(
  page: TPage,
  blocks: PageBlockSettings[TPage],
  request: typeof fetch = fetch
): Promise<PageBlockSettings> {
  const response = await request("/api/admin/content/pageBlocks", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createPageBlockSavePayload(page, blocks))
  });
  const result = await response.json() as { data?: PageBlockSettings; error?: string };
  if (!response.ok || !result.data) throw new Error(result.error || "儲存失敗");
  return result.data;
}
