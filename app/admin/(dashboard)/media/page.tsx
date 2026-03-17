import { MediaBrowser } from "@/components/admin/media-browser";
import { isBlobConfigured } from "@/lib/media-store";

export default function AdminMediaPage() {
  const blobReady = isBlobConfigured();

  return (
    <div className="grid gap-5">
      <section className="rounded-[1.8rem] border border-ink/8 bg-white/86 p-5">
        <p className="text-[11px] uppercase tracking-[0.28em] text-bronze">Media Manager</p>
        <p className="mt-3 text-base text-slate">
          上傳成功後會取得可直接渲染的 URL。Brand / Founder / Home / Cases / Testimonials 表單中的 media picker 可直接回填這些 URL。
        </p>
        {!blobReady ? (
          <div className="mt-4 rounded-[1.4rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
            目前未設定 <code>BLOB_READ_WRITE_TOKEN</code>，可瀏覽 fallback 資產，但無法正式上傳或刪除 Blob 檔案。
          </div>
        ) : null}
      </section>

      <MediaBrowser blobReady={blobReady} />
    </div>
  );
}
