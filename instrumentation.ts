import type { ServerResponse } from "http";

import { isAdminPreviewRequestUrl, mergeVaryHeader } from "@/lib/http-vary";

const previewVaryPatch = Symbol.for("office-next.preview-vary-patch");

type PatchedServerResponse = typeof ServerResponse.prototype & {
  [previewVaryPatch]?: boolean;
};

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { ServerResponse } = process.getBuiltinModule("http") as typeof import("http");
  const prototype = ServerResponse.prototype as PatchedServerResponse;
  if (prototype[previewVaryPatch]) return;

  const setHeader = prototype.setHeader;
  prototype.setHeader = function setPreviewSafeHeader(name, value) {
    if (name.toLowerCase() === "vary" && isAdminPreviewRequestUrl(this.req?.url)) {
      const serialized = Array.isArray(value) ? value.join(", ") : String(value);
      return setHeader.call(this, name, mergeVaryHeader(serialized, "Cookie"));
    }

    return setHeader.call(this, name, value);
  };
  prototype[previewVaryPatch] = true;
}
