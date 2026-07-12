import type { SectionField } from "@/components/admin/section-editor";

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
