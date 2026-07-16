import { readFile } from "fs/promises";
import path from "path";

import postcss from "postcss";
import tailwindcss from "tailwindcss";

import tailwindConfig from "@/tailwind.config";

describe("Page Block generated CSS", () => {
  let css: string;

  beforeAll(async () => {
    const globalsPath = path.join(process.cwd(), "app/globals.css");
    const globals = await readFile(globalsPath, "utf8");
    const result = await postcss([tailwindcss(tailwindConfig)]).process(globals, {
      from: globalsPath
    });
    css = result.css;
  });

  it.each([
    /\.page-block--clean\s*>\s*section/,
    /\.page-block--soft-grid\s*>\s*section/,
    /\.page-block--soft-blue\s*>\s*section/,
    /\.page-block--deep-panel\s*>\s*section/,
    /\.page-block-layout--contained\s+\.site-container/,
    /\.page-block-layout--wide\s+\.site-container/,
    /\.page-block-layout--single-column/,
    /\.page-block-layout--two-column/
  ])("preserves the selector %s in Tailwind output", (selector) => {
    expect(css).toMatch(selector);
  });

  it("preserves the Page Block visual declarations", () => {
    expect(css).toMatch(
      /\.page-block--soft-grid\s*>\s*section\s*{[^}]*background-color:[^}]*background-image:[^}]*background-size:/
    );
    expect(css).toMatch(/\.page-block--soft-blue\s*>\s*section\s*{[^}]*background:/);
    expect(css).toMatch(/\.page-block--deep-panel\s*>\s*section\s*{[^}]*background:/);
  });

  it("does not rebuild Page Block class names with runtime interpolation", async () => {
    const helperSource = await readFile(
      path.join(process.cwd(), "lib/page-block-settings.ts"),
      "utf8"
    );
    expect(helperSource).not.toContain("page-block--${config.background}");
    expect(helperSource).not.toContain("page-block-layout--${config.layout}");
    expect(helperSource).toContain("satisfies Record<PageBlockBackground, string>");
    expect(helperSource).toContain("satisfies Record<PageBlockLayout, string>");
  });
});
