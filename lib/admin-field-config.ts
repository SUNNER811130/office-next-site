import type { SectionField, SectionFieldGroup } from "@/components/admin/section-editor";

export const brandFields: SectionField[] = [
  { type: "text", path: "name", label: "品牌名稱" },
  { type: "richtext", path: "summary", label: "品牌摘要" },
  { type: "richtext", path: "positioning", label: "品牌定位" },
  { type: "richtext", path: "proposition", label: "品牌主張" },
  { type: "media", path: "logoWordmarkUrl", label: "Logo Wordmark", category: "brand", suggestedPath: "brand/logo-wordmark.svg", description: "建議尺寸：不限寬高，請使用純色高反差或去背 SVG 以維持銳利度。" },
  { type: "media", path: "logoMarkUrl", label: "Logo Mark", category: "brand", suggestedPath: "brand/logo-mark.svg", description: "建議尺寸：至少 512x512px，建議為正方形 SVG 或 PNG。" },
  { type: "media", path: "ogImageUrl", label: "OG Image", category: "og", suggestedPath: "og/og-default.png", description: "建議尺寸：1200x630px，比例為 16:9，確保社群分享畫面最佳化。" }
];

export const homeFields: SectionField[] = [
  { type: "text", path: "hero.eyebrow", label: "Hero Eyebrow" },
  { type: "text", path: "hero.title", label: "Hero Title" },
  { type: "richtext", path: "hero.description", label: "Hero Description" },
  { type: "media", path: "hero.imageUrl", label: "Hero Image", category: "sections", suggestedPath: "sections/advisory-01.webp", description: "建議尺寸：最少1920x1080px (16:9)，或更高解析度作為滿版背景用。" },
  { type: "text", path: "hero.ctaPrimaryLabel", label: "Primary CTA Label" },
  { type: "text", path: "hero.ctaPrimaryHref", label: "Primary CTA Href" },
  { type: "text", path: "hero.ctaSecondaryLabel", label: "Secondary CTA Label" },
  { type: "text", path: "hero.ctaSecondaryHref", label: "Secondary CTA Href" },
  { type: "string-list", path: "painPoints", label: "Pain Points", itemLabel: "痛點", placeholder: "輸入首頁痛點文案" },
  {
    type: "object-list",
    path: "propositionCards",
    label: "Proposition Cards",
    itemLabel: "卡片",
    fields: [
      { name: "title", label: "Title" },
      { name: "description", label: "Description", type: "textarea" }
    ]
  },
  {
    type: "object-list",
    path: "flagshipModules",
    label: "Flagship Modules",
    itemLabel: "模組",
    fields: [
      { name: "eyebrow", label: "Eyebrow" },
      { name: "title", label: "Title" },
      { name: "summary", label: "Summary" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "imageUrl", label: "Image URL", type: "url" }
    ]
  }
];

export const founderFields: SectionField[] = [
  { type: "text", path: "name", label: "主理人姓名" },
  { type: "text", path: "role", label: "主理人角色" },
  { type: "text", path: "tagline", label: "一句定位" },
  { type: "richtext", path: "bio", label: "主理人簡介" },
  { type: "string-list", path: "pastExperience", label: "過去經歷", itemLabel: "經歷", placeholder: "輸入過去經歷" },
  { type: "string-list", path: "currentRoles", label: "現任與專業", itemLabel: "經歷", placeholder: "輸入現任角色或專業" },
  { type: "string-list", path: "representativeClients", label: "代表性客戶與培訓經歷", itemLabel: "經歷", placeholder: "輸入代表性客戶或培訓經歷" },
  { type: "media", path: "heroImageUrl", label: "Founder Hero", category: "people", suggestedPath: "people/founder-hero.webp", description: "建議尺寸：1200x800px 橫圖，請確保視覺重心良好。" },
  { type: "media", path: "portraitImageUrl", label: "Founder Portrait", category: "people", suggestedPath: "people/founder-portrait.webp", description: "建議尺寸：800x1000px 直式人像，臉部置中。" }
];

export const servicesFields: SectionField[] = [
  {
    type: "object-list",
    path: "items",
    label: "服務方向",
    itemLabel: "服務",
    fields: [
      { name: "title", label: "Title" },
      { name: "audience", label: "Audience", type: "textarea" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "imageUrl", label: "Image URL", type: "url" },
      { name: "ctaLabel", label: "CTA Label" },
      { name: "ctaHref", label: "CTA Href", type: "url" }
    ]
  }
];

export const caseFields: SectionField[] = [
  {
    type: "object-list",
    path: "items",
    label: "案例摘要",
    itemLabel: "案例",
    fields: [
      { name: "category", label: "Category" },
      { name: "title", label: "Title" },
      { name: "problem", label: "Problem", type: "textarea" },
      { name: "approach", label: "Approach", type: "textarea" },
      { name: "result", label: "Result", type: "textarea" },
      { name: "imageUrl", label: "Image URL", type: "url" }
    ]
  }
];

export const testimonialFields: SectionField[] = [
  {
    type: "object-list",
    path: "items",
    label: "見證",
    itemLabel: "見證",
    fields: [
      { name: "quote", label: "Quote", type: "textarea" },
      { name: "name", label: "Name" },
      { name: "role", label: "Role" },
      { name: "company", label: "Company" },
      { name: "avatarUrl", label: "Avatar URL", type: "url" },
      { name: "logoUrl", label: "Logo URL", type: "url" }
    ]
  }
];

export const faqFields: SectionField[] = [
  {
    type: "object-list",
    path: "items",
    label: "FAQ",
    itemLabel: "問題",
    fields: [
      { name: "question", label: "Question" },
      { name: "answer", label: "Answer", type: "textarea" }
    ]
  }
];

export const contactFields: SectionField[] = [
  { type: "text", path: "email", label: "正式聯絡信箱" },
  { type: "textarea", path: "intro", label: "Contact Intro" },
  { type: "textarea", path: "responseExpectation", label: "Response Expectation" },
  { type: "string-list", path: "inquiryOptions", label: "Inquiry Options", itemLabel: "選項" },
  { type: "text", path: "mailtoLabel", label: "Mailto Label" }
];

export const socialFields: SectionField[] = [
  { type: "text", path: "linkedin", label: "LinkedIn URL" },
  { type: "text", path: "facebook", label: "Facebook URL" },
  { type: "text", path: "instagram", label: "Instagram URL" },
  { type: "text", path: "threads", label: "Threads URL" },
  { type: "text", path: "youtube", label: "YouTube URL" },
  { type: "text", path: "x", label: "X URL" },
  {
    type: "object-list",
    path: "other",
    label: "Other Social Links",
    itemLabel: "連結",
    fields: [
      { name: "label", label: "Label" },
      { name: "url", label: "URL", type: "url" }
    ]
  }
];

const scaleOptions = [
  { label: "緊湊", value: "compact" }, { label: "標準", value: "balanced" }, { label: "放大", value: "large" }
];
const densityOptions = [
  { label: "緊湊", value: "compact" }, { label: "標準", value: "balanced" }, { label: "寬鬆", value: "spacious" }
];

export const designFieldGroups: SectionFieldGroup[] = [
  {
    title: "字體與排版",
    description: "調整全站標題、內文大小與閱讀密度。",
    fields: [
      { type: "select", path: "typography.heroTitleScale", label: "Hero 標題大小", description: "控制首頁與主要頁面第一屏標題尺寸。", options: scaleOptions },
      { type: "select", path: "typography.sectionTitleScale", label: "區塊標題大小", description: "控制各內容區塊的主標題尺寸。", options: scaleOptions },
      { type: "select", path: "typography.cardTitleScale", label: "卡片標題大小", description: "控制共用卡片內的標題尺寸。", options: scaleOptions },
      { type: "select", path: "typography.bodySize", label: "內文字級", description: "控制一般內文的基準字級。", options: [{ label: "小", value: "small" }, { label: "標準", value: "standard" }, { label: "大", value: "large" }] },
      { type: "select", path: "typography.lineHeight", label: "內文行距", description: "控制一般內文的閱讀密度。", options: [{ label: "緊湊", value: "compact" }, { label: "舒適", value: "comfortable" }, { label: "寬鬆", value: "relaxed" }] }
    ]
  },
  {
    title: "版面與留白",
    description: "控制內容寬度、區塊留白與卡片間距。",
    fields: [
      { type: "select", path: "layout.density", label: "整體排版密度", description: "同步微調頁面整體的視覺密度。", options: densityOptions },
      { type: "select", path: "layout.mobileGutter", label: "手機左右留白", description: "控制窄螢幕內容與畫面邊緣的距離。", options: [16, 20, 24].map((value) => ({ label: `${value}px`, value })) },
      { type: "select", path: "layout.desktopContainer", label: "桌機內容寬度", description: "控制主要頁面在大螢幕的最大寬度。", options: [1200, 1280, 1400, 1520].map((value) => ({ label: `${value}px`, value })) },
      { type: "select", path: "layout.sectionSpacing", label: "區塊上下留白", options: densityOptions },
      { type: "select", path: "layout.cardPadding", label: "卡片內距", options: densityOptions },
      { type: "select", path: "layout.cardGap", label: "卡片間距", options: densityOptions },
      { type: "select", path: "layout.headerDensity", label: "Header 高度", options: [{ label: "緊湊", value: "compact" }, { label: "標準", value: "balanced" }] }
    ]
  },
  {
    title: "卡片風格",
    description: "切換服務卡片與重點內容卡片的安全視覺預設。",
    fields: [
      { type: "select", path: "cards.style", label: "卡片風格", description: "不改變內容結構或 CTA 功能。", options: [{ label: "科技切角", value: "tech-cut" }, { label: "極簡細框", value: "minimal-line" }, { label: "清透玻璃", value: "glass-panel" }, { label: "柔和精品", value: "soft-premium" }] },
      { type: "select", path: "cards.hoverEffect", label: "滑鼠互動", options: [{ label: "無", value: "none" }, { label: "輕微上浮", value: "lift" }, { label: "邊緣光暈", value: "edge-glow" }] }
    ]
  },
  {
    title: "動畫與互動",
    description: "系統開啟減少動態效果時，動畫永遠自動停用。",
    fields: [
      { type: "select", path: "motion.preset", label: "動畫模式", description: "控制區塊進場方式。", options: [{ label: "關閉", value: "none" }, { label: "淡入", value: "fade" }, { label: "向上進場", value: "fly-up" }, { label: "左右交錯", value: "fly-alternate" }] },
      { type: "select", path: "motion.speed", label: "動畫速度", options: [{ label: "快速", value: "fast" }, { label: "標準", value: "balanced" }, { label: "緩慢", value: "slow" }] },
      { type: "select", path: "motion.distance", label: "移動距離", options: [{ label: "輕微", value: "subtle" }, { label: "標準", value: "balanced" }, { label: "明顯", value: "strong" }] },
      { type: "select", path: "motion.stagger", label: "交錯間隔", options: [{ label: "無", value: "none" }, { label: "輕微", value: "subtle" }, { label: "標準", value: "balanced" }] },
      { type: "toggle", path: "motion.playOnce", label: "動畫只播放一次", description: "開啟後，同一內容捲動回來時不重播。" }
    ]
  },
  {
    title: "手機浮動操作列",
    description: "控制訪客在手機底部看到的快速操作列。",
    fields: [
      { type: "toggle", path: "floatingCta.enabled", label: "顯示浮動操作列", description: "關閉後不渲染浮動操作列，也不保留多餘底部空白。" },
      { type: "select", path: "floatingCta.density", label: "操作列密度", options: [{ label: "精簡", value: "compact" }, { label: "標準", value: "balanced" }] }
    ]
  }
];

export const designFields = designFieldGroups.flatMap((group) => group.fields);
