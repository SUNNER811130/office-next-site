export const siteConfig = {
  name: "OFFICE NEXT 辦公進化所",
  shortName: "OFFICE NEXT",
  description:
    "OFFICE NEXT 辦公進化所專注白領 AI 提效、自動化與工作流程升級，協助個人與團隊把重複工作交給 AI，把時間留給更有價值的事。",
  url: "https://office-next-site.vercel.app",
  ogImage: "/og-image.png",
  navItems: [
    { href: "/", label: "首頁" },
    { href: "/about", label: "品牌理念" },
    { href: "/services", label: "服務方案" },
    { href: "/corporate-training", label: "企業內訓" },
    { href: "/contact", label: "聯絡我們" }
  ]
} as const;
