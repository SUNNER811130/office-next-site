export const siteConfig = {
  name: "OFFICE NEXT 辦公進化所",
  shortName: "OFFICE NEXT",
  description:
    "OFFICE NEXT 辦公進化所，專注白領 AI 提效、自動化與工作流程升級，幫助個人與團隊把重複工作交給 AI，把時間留給更有價值的事。",
  url: "https://office-next-site.vercel.app",
  ogImage: "/og-image.png",
  navItems: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/corporate-training", label: "Corporate Training" },
    { href: "/contact", label: "Contact" }
  ]
} as const;
