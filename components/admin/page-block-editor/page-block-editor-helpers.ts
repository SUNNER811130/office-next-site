import type { PageBlockConfig, PageBlockId } from "@/types/content";

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
