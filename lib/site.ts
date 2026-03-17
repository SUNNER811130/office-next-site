export const brandEntity = {
  name: "OFFICE NEXT",
  legalName: "OFFICE NEXT",
  shortName: "OFFICE NEXT",
  url: "https://office-next-site.vercel.app",
  contactEmail: "hello@officenext.tw",
  positioning: "白領工作與 AI 策略顧問品牌",
  proposition:
    "協助團隊把 AI 導入、品牌敘事與工作流程整理成可執行的策略、訓練與內容資產。",
  shortDescription:
    "OFFICE NEXT 是聚焦白領工作、品牌溝通與 AI 導入策略的顧問品牌。",
  standardDescription:
    "OFFICE NEXT 是聚焦白領工作、品牌溝通與 AI 導入策略的顧問品牌，協助團隊把抽象的 AI 趨勢轉成可執行的工作流程、服務設計、企業訓練與內容資產。",
  leadershipNote:
    "OFFICE NEXT 由具品牌策略、服務設計與白領工作升級視角的主理人策劃，對外以方法論、內容品質與長期可執行性作為核心判斷標準。",
  founder: {
    name: "",
    role: "Founder"
  },
  sameAs: [] as string[],
  ogImage: "/og-image.png"
} as const;

export const siteConfig = {
  name: brandEntity.name,
  legalName: brandEntity.legalName,
  shortName: brandEntity.shortName,
  description: brandEntity.standardDescription,
  url: brandEntity.url,
  ogImage: brandEntity.ogImage,
  contactEmail: brandEntity.contactEmail,
  navItems: [
    { href: "/", label: "首頁" },
    { href: "/about", label: "關於 OFFICE NEXT" },
    { href: "/services", label: "服務項目" },
    { href: "/insights", label: "Insights" },
    { href: "/corporate-training", label: "企業內訓" },
    { href: "/contact", label: "聯絡我們" }
  ]
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
