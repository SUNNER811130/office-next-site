import { NextRequest, NextResponse } from "next/server";

import { rejectIfNotAdmin } from "@/lib/admin-auth";
import { readContent, updateContentSection } from "@/lib/content-store";
import type { ContentSection } from "@/types/content";

const sections = new Set<ContentSection>([
  "brand",
  "home",
  "founder",
  "services",
  "cases",
  "testimonials",
  "faq",
  "contact",
  "social",
  "design",
  "pageBlocks"
]);

export async function GET(_request: NextRequest, context: { params: Promise<{ section: string }> }) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const { section } = await context.params;
  if (!sections.has(section as ContentSection)) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }

  const content = await readContent();
  return NextResponse.json({ data: content[section as ContentSection] });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ section: string }> }) {
  const unauthorized = await rejectIfNotAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const { section } = await context.params;
  if (!sections.has(section as ContentSection)) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }

  const payload = await request.json();
  const content = await updateContentSection(section as ContentSection, payload);
  return NextResponse.json({ ok: true, data: content[section as ContentSection] });
}
