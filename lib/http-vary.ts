export function mergeVaryHeader(existing: string | null | undefined, token: string): string {
  const tokens = (existing ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (!tokens.some((value) => value.toLowerCase() === token.toLowerCase())) {
    tokens.push(token);
  }
  return tokens.join(", ");
}

export function isAdminPreviewRequestUrl(url: string | undefined): boolean {
  if (!url) return false;

  const pathname = url.split("?", 1)[0];
  return pathname.startsWith("/admin/preview/");
}
