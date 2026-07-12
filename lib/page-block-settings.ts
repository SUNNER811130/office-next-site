import type {
  HomeBlockId,
  PageBlockBackground,
  PageBlockConfig,
  PageBlockLayout,
  PageBlockMotion,
  PageBlockSettings
} from "@/types/content";

export type HomeBlockDefinition = {
  id: HomeBlockId;
  label: string;
  description: string;
  canDisable: boolean;
  supportedLayouts: readonly PageBlockLayout[];
  defaultConfig: PageBlockConfig;
};

const backgrounds = ["default", "clean", "soft-grid", "soft-blue", "deep-panel"] as const;
const motions = ["inherit", "none", "fade", "fly-up", "fly-left", "fly-right"] as const;

function define(
  id: HomeBlockId,
  label: string,
  description: string,
  supportedLayouts: readonly PageBlockLayout[],
  canDisable = true
): HomeBlockDefinition {
  return {
    id,
    label,
    description,
    canDisable,
    supportedLayouts,
    defaultConfig: { id, enabled: true, order: 0, background: "default", motion: "inherit", layout: "default" }
  };
}

export const homeBlockDefinitions = [
  define("hero", "首頁主視覺", "首頁標題、品牌摘要、主要行動按鈕與工作流程視覺。", ["default", "wide", "two-column"], false),
  define("work-upgrade", "工作升級主張", "品牌主張與三張工作升級卡片。", ["default", "contained", "wide", "two-column"]),
  define("pain-points", "白領工作痛點", "三個高頻重複工作痛點。", ["default", "wide", "two-column"]),
  define("services", "服務方向", "首頁服務與課程卡片。", ["default", "wide"]),
  define("flagship-modules", "核心模組", "提示詞、GAS 與 Agent 工作流。", ["default", "contained", "wide"]),
  define("cases", "應用案例", "辦公 AI 提效案例。", ["default", "wide"]),
  define("client-logos", "合作團隊", "客戶與合作團隊 Logo。", ["default", "contained", "wide"]),
  define("testimonials", "學員與團隊見證", "使用者見證與成果。", ["default", "contained", "wide", "two-column"]),
  define("faq", "常見問題", "首頁 FAQ 與回覆說明。", ["default", "contained", "wide", "single-column", "two-column"])
] as const satisfies readonly HomeBlockDefinition[];

export const pageBlockSettingsDefaults: PageBlockSettings = {
  home: homeBlockDefinitions.map((definition, order) => ({ ...definition.defaultConfig, order }))
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function allowed<T extends readonly string[]>(values: T, value: unknown, fallback: T[number]): T[number] {
  return typeof value === "string" && values.includes(value as T[number]) ? value as T[number] : fallback;
}

export function normalizeHomeBlocks(input: unknown): PageBlockConfig[] {
  const rows = Array.isArray(input) ? input : [];
  const firstById = new Map<HomeBlockId, Record<string, unknown>>();
  for (const value of rows) {
    const row = record(value);
    const definition = homeBlockDefinitions.find((item) => item.id === row.id);
    if (definition && !firstById.has(definition.id)) firstById.set(definition.id, row);
  }

  const normalized = homeBlockDefinitions.map((definition, defaultOrder) => {
    const row = firstById.get(definition.id) ?? {};
    const fallback = definition.defaultConfig;
    return {
      id: definition.id,
      enabled: definition.canDisable && typeof row.enabled === "boolean" ? row.enabled : true,
      order: Number.isInteger(row.order) && Number(row.order) >= 0 ? Number(row.order) : defaultOrder,
      background: allowed(backgrounds, row.background, fallback.background) as PageBlockBackground,
      motion: allowed(motions, row.motion, fallback.motion) as PageBlockMotion,
      layout: allowed(definition.supportedLayouts, row.layout, fallback.layout) as PageBlockLayout
    };
  });

  const hero = normalized.find((block) => block.id === "hero")!;
  const rest = normalized
    .filter((block) => block.id !== "hero")
    .sort((a, b) => a.order - b.order || homeBlockDefinitions.findIndex((item) => item.id === a.id) - homeBlockDefinitions.findIndex((item) => item.id === b.id));
  return [hero, ...rest].map((block, order) => ({ ...block, order, enabled: block.id === "hero" ? true : block.enabled }));
}

export function normalizePageBlockSettings(input: unknown): PageBlockSettings {
  return { home: normalizeHomeBlocks(record(input).home) };
}

export function getOrderedEnabledHomeBlocks(settings: PageBlockSettings): PageBlockConfig[] {
  return normalizeHomeBlocks(settings.home).filter((block) => block.enabled);
}

export function getPageBlockAttributes(config: PageBlockConfig) {
  return {
    "data-page-block": config.id,
    "data-page-block-background": config.background,
    "data-page-block-layout": config.layout,
    "data-page-block-motion": config.motion
  } as const;
}

export function getPageBlockClassConfig(config: PageBlockConfig): string {
  return `page-block page-block--${config.background} page-block-layout--${config.layout}`;
}
