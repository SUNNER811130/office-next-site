import { AdminPreviewFrame } from "@/components/admin/preview/admin-preview-frame";
import type { AdminPreviewTarget } from "@/lib/admin-preview-types";

export function PageBlockPreview({
  target,
  pageLabel,
  previewPath,
  previewKey,
  hasDraft
}: {
  target: AdminPreviewTarget;
  pageLabel: string;
  previewPath: string;
  previewKey: number;
  hasDraft: boolean;
}) {
  return <AdminPreviewFrame target={target} pageLabel={pageLabel} publicPath={previewPath} hasDraft={hasDraft} refreshKey={previewKey} />;
}
