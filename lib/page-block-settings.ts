import type {
  HomeBlockId,
  AboutBlockId,
  PageBlockBackground,
  PageBlockConfig,
  PageBlockLayout,
  PageBlockMotion,
  PageBlockSettings
} from "@/types/content";
import type { ServicesBlockId } from "@/types/content";

export type HomeBlockDefinition = {
  id: HomeBlockId;
  label: string;
  description: string;
  canDisable: boolean;
  supportedLayouts: readonly PageBlockLayout[];
  defaultConfig: PageBlockConfig<HomeBlockId>;
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

export type ServicesBlockDefinition = {
  id: ServicesBlockId;
  label: string;
  description: string;
  canDisable: boolean;
  supportedLayouts: readonly PageBlockLayout[];
  defaultConfig: PageBlockConfig<ServicesBlockId>;
};

function defineServices(
  id: ServicesBlockId,
  label: string,
  description: string,
  supportedLayouts: readonly PageBlockLayout[],
  canDisable = true
): ServicesBlockDefinition {
  return { id, label, description, canDisable, supportedLayouts, defaultConfig: { id, enabled: true, order: 0, background: "default", motion: "inherit", layout: "default" } };
}

export const servicesBlockDefinitions = [
  defineServices("hero", "服務頁主視覺", "服務頁標題、品牌主張、行動按鈕與 Service Snapshot。", ["default", "wide", "two-column"], false),
  defineServices("service-cards", "服務與課程卡片", "四項服務內容、適合對象與報名按鈕。", ["default", "wide"]),
  defineServices("case-snapshots", "服務案例快照", "服務對應的真實辦公應用案例。", ["default", "contained", "wide"]),
  defineServices("faq", "服務合作常見問題", "服務頁常見問題與回答。", ["default", "contained", "wide", "single-column", "two-column"])
] as const satisfies readonly ServicesBlockDefinition[];

export type AboutBlockDefinition = {
  id: AboutBlockId;
  label: string;
  description: string;
  canDisable: boolean;
  supportedLayouts: readonly PageBlockLayout[];
  defaultConfig: PageBlockConfig<AboutBlockId>;
};

function defineAbout(id: AboutBlockId, label: string, description: string, supportedLayouts: readonly PageBlockLayout[], canDisable = true): AboutBlockDefinition {
  return { id, label, description, canDisable, supportedLayouts, defaultConfig: { id, enabled: true, order: 0, background: "default", motion: "inherit", layout: "default" } };
}

export const aboutBlockDefinitions = [
  defineAbout("hero", "關於頁主視覺", "Founder 姓名、角色、定位、Bio、CTA 與主視覺圖片。", ["default", "wide", "two-column"], false),
  defineAbout("brand-positioning", "品牌定位", "品牌摘要、定位、主張與 Founder 摘要卡片。", ["default", "contained", "wide", "two-column"]),
  defineAbout("founder-experience", "Founder 經歷", "過去經歷、現任與專業、代表性客戶及培訓經歷。", ["default", "contained", "wide", "single-column", "two-column"]),
  defineAbout("testimonials", "真實回饋", "白領工作流程升級後的見證。", ["default", "contained", "wide", "two-column"]),
  defineAbout("faq", "關於頁常見問題", "關於 OFFICE NEXT 的常見問題。", ["default", "contained", "wide", "single-column", "two-column"])
] as const satisfies readonly AboutBlockDefinition[];

export const pageBlockSettingsDefaults: PageBlockSettings = {
  home: homeBlockDefinitions.map((definition, order) => ({ ...definition.defaultConfig, order })),
  services: servicesBlockDefinitions.map((definition, order) => ({ ...definition.defaultConfig, order })),
  about: aboutBlockDefinitions.map((definition, order) => ({ ...definition.defaultConfig, order }))
};

export const servicesPageBlockDefaults = pageBlockSettingsDefaults.services;
export const aboutPageBlockDefaults = pageBlockSettingsDefaults.about;

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function allowed<T extends readonly string[]>(values: T, value: unknown, fallback: T[number]): T[number] {
  return typeof value === "string" && values.includes(value as T[number]) ? value as T[number] : fallback;
}

export function normalizeHomeBlocks(input: unknown): PageBlockConfig<HomeBlockId>[] {
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

export function normalizeServicesBlocks(input: unknown): PageBlockConfig<ServicesBlockId>[] {
  const rows = Array.isArray(input) ? input : [];
  const firstById = new Map<ServicesBlockId, Record<string, unknown>>();
  for (const value of rows) {
    const row = record(value);
    const definition = servicesBlockDefinitions.find((item) => item.id === row.id);
    if (definition && !firstById.has(definition.id)) firstById.set(definition.id, row);
  }
  const normalized = servicesBlockDefinitions.map((definition, defaultOrder) => {
    const row = firstById.get(definition.id) ?? {};
    return {
      id: definition.id,
      enabled: definition.canDisable && typeof row.enabled === "boolean" ? row.enabled : true,
      order: Number.isInteger(row.order) && Number(row.order) >= 0 ? Number(row.order) : defaultOrder,
      background: allowed(backgrounds, row.background, definition.defaultConfig.background) as PageBlockBackground,
      motion: allowed(motions, row.motion, definition.defaultConfig.motion) as PageBlockMotion,
      layout: allowed(definition.supportedLayouts, row.layout, definition.defaultConfig.layout) as PageBlockLayout
    };
  });
  const hero = normalized.find((block) => block.id === "hero")!;
  const rest = normalized.filter((block) => block.id !== "hero").sort((a, b) => a.order - b.order || servicesBlockDefinitions.findIndex((item) => item.id === a.id) - servicesBlockDefinitions.findIndex((item) => item.id === b.id));
  return [hero, ...rest].map((block, order) => ({ ...block, order, enabled: block.id === "hero" ? true : block.enabled }));
}

export function normalizeAboutBlocks(input: unknown): PageBlockConfig<AboutBlockId>[] {
  const rows = Array.isArray(input) ? input : [];
  const firstById = new Map<AboutBlockId, Record<string, unknown>>();
  for (const value of rows) {
    const row = record(value);
    const definition = aboutBlockDefinitions.find((item) => item.id === row.id);
    if (definition && !firstById.has(definition.id)) firstById.set(definition.id, row);
  }
  const normalized = aboutBlockDefinitions.map((definition, defaultOrder) => {
    const row = firstById.get(definition.id) ?? {};
    return {
      id: definition.id,
      enabled: definition.canDisable && typeof row.enabled === "boolean" ? row.enabled : true,
      order: Number.isInteger(row.order) && Number(row.order) >= 0 ? Number(row.order) : defaultOrder,
      background: allowed(backgrounds, row.background, definition.defaultConfig.background) as PageBlockBackground,
      motion: allowed(motions, row.motion, definition.defaultConfig.motion) as PageBlockMotion,
      layout: allowed(definition.supportedLayouts, row.layout, definition.defaultConfig.layout) as PageBlockLayout
    };
  });
  const hero = normalized.find((block) => block.id === "hero")!;
  const rest = normalized.filter((block) => block.id !== "hero").sort((a, b) => a.order - b.order || aboutBlockDefinitions.findIndex((item) => item.id === a.id) - aboutBlockDefinitions.findIndex((item) => item.id === b.id));
  return [hero, ...rest].map((block, order) => ({ ...block, order, enabled: block.id === "hero" ? true : block.enabled }));
}

export function normalizePageBlockSettings(input: unknown): PageBlockSettings {
  const root = record(input);
  return { home: normalizeHomeBlocks(root.home), services: normalizeServicesBlocks(root.services), about: normalizeAboutBlocks(root.about) };
}

export function getOrderedEnabledHomeBlocks(settings: PageBlockSettings): PageBlockConfig<HomeBlockId>[] {
  return normalizeHomeBlocks(settings.home).filter((block) => block.enabled);
}

export function getOrderedEnabledServicesBlocks(settings: PageBlockSettings): PageBlockConfig<ServicesBlockId>[] {
  return normalizeServicesBlocks(settings.services).filter((block) => block.enabled);
}

export function getOrderedEnabledAboutBlocks(settings: PageBlockSettings): PageBlockConfig<AboutBlockId>[] {
  return normalizeAboutBlocks(settings.about).filter((block) => block.enabled);
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
