import { NextRequest, NextResponse } from "next/server";

import { rejectIfNotAdmin } from "@/lib/admin-auth";
import { deleteAsset, listAssets, uploadAsset } from "@/lib/media-store";
import type { MediaCategory } from "@/types/content";

export async function GET(request: NextRequest) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const prefix = request.nextUrl.searchParams.get("prefix") ?? "";
  const assets = await listAssets(prefix);
  return NextResponse.json({ assets });
}

export async function POST(request: NextRequest) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const pathname = formData.get("pathname");
    const category = formData.get("category");
    const suggestedUsage = formData.get("suggestedUsage");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const asset = await uploadAsset(file, {
      pathname: typeof pathname === "string" && pathname ? pathname : undefined,
      category: typeof category === "string" ? (category as MediaCategory) : undefined,
      suggestedUsage: typeof suggestedUsage === "string" ? suggestedUsage : undefined
    });

    return NextResponse.json(asset);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing asset key" }, { status: 400 });
  }

  try {
    await deleteAsset(key);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
