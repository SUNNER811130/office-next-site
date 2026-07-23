import { NextRequest, NextResponse } from "next/server";

import { rejectIfNotAdmin } from "@/lib/admin-auth";
import {
  assertWorkflowContentMutationsEnabled,
  workflowErrorResponse
} from "@/lib/content-workflow-api";
import { readContent, updateContentSection, updatePageBlockPage } from "@/lib/content-store";
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

  try {
    const content = await readContent();
    return NextResponse.json({ data: content[section as ContentSection] });
  } catch (error: unknown) {
    return workflowErrorResponse(error);
  }
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

  try {
    const payload = await request.json();
    if (section === "pageBlocks" && payload && typeof payload === "object" && "page" in payload && "blocks" in payload) {
      const page = (payload as { page?: unknown }).page;
      if (page !== "home" && page !== "services" && page !== "about" && page !== "contact") return NextResponse.json({ error: "Unknown page" }, { status: 400 });
      assertWorkflowContentMutationsEnabled();
      const content = await updatePageBlockPage(page, (payload as { blocks: unknown }).blocks);
      return NextResponse.json({ ok: true, data: content.pageBlocks });
    }
    assertWorkflowContentMutationsEnabled();
    const content = await updateContentSection(section as ContentSection, payload);
    return NextResponse.json({ ok: true, data: content[section as ContentSection] });
  } catch (error: unknown) {
    return workflowErrorResponse(error);
  }
}
