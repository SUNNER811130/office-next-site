import type { SiteContent } from "@/types/content";

export const siteContentSeed: SiteContent = {
  siteUrl: "https://office-next-site.vercel.app",
  navigation: {
    headerTagline: "White-Collar Strategy and AI Advisory",
    navItems: [
      { label: "首頁", href: "/" },
      { label: "關於", href: "/about" },
      { label: "服務", href: "/services" },
      { label: "聯絡", href: "/contact" }
    ],
    footerLinks: [
      { label: "首頁", href: "/" },
      { label: "品牌與主理人", href: "/about" },
      { label: "服務方向", href: "/services" },
      { label: "聯絡 OFFICE NEXT", href: "/contact" }
    ]
  },
  brand: {
    name: "OFFICE NEXT",
    legalName: "OFFICE NEXT",
    shortName: "OFFICE NEXT",
    summary: "給白領工作者與決策者的品牌、服務與 AI 顧問工作室。",
    positioning: "品牌策略、服務設計與 AI 導入顧問",
    proposition: "把抽象方向整理成可執行的決策、內容與提案節奏。",
    logoWordmarkUrl: "/brand/logo-wordmark.svg",
    logoWordmarkHeaderUrl: "/brand/logo-wordmark-header.svg",
    logoMarkUrl: "/brand/logo-mark.svg",
    ogImageUrl: "/og/og-default.svg"
  },
  home: {
    hero: {
      eyebrow: "OFFICE NEXT",
      title: "把品牌、服務與 AI 導入整理成下一步",
      description:
        "OFFICE NEXT 協助品牌主理人、專業服務團隊與企業內部單位，釐清定位、重整服務模組，並把 AI 真正接到既有工作流。",
      imageUrl: "/sections/advisory-01.svg",
      ctaPrimaryLabel: "查看服務方向",
      ctaPrimaryHref: "/services",
      ctaSecondaryLabel: "直接談需求",
      ctaSecondaryHref: "/contact"
    },
    painPoints: [
      "品牌說法很多，但外部看不出真正的價值主張。",
      "知道 AI 很重要，卻不知道該先落在哪個工作環節。",
      "服務內容與案例分散，無法快速整理成提案與銷售節奏。"
    ],
    propositionCards: [
      {
        title: "先整理決策，再放大產出",
        description: "先把定位、受眾與優先順序整理清楚，再設計內容與執行節奏。"
      },
      {
        title: "AI 不只是工具清單",
        description: "把 AI 放進實際流程，而不是停留在展示與口號。"
      },
      {
        title: "讓前台敘事與後台運作對齊",
        description: "品牌話語、服務設計與內部工作流同步更新，減少斷裂。"
      }
    ],
    flagshipModules: [
      {
        eyebrow: "Module 01",
        title: "Brand Advisory",
        summary: "釐清品牌定位與市場敘事",
        description: "適合正在重整品牌說法、服務結構與對外提案節奏的主理人與團隊。",
        imageUrl: "/sections/advisory-01.svg"
      },
      {
        eyebrow: "Module 02",
        title: "Workshop Design",
        summary: "把複雜議題整理成能推動共識的工作坊",
        description: "適合需要跨部門對焦、建立共同語言與下一步行動的案型。",
        imageUrl: "/sections/workshop-01.svg"
      },
      {
        eyebrow: "Module 03",
        title: "Strategy Session",
        summary: "把想法變成可交付的行動清單",
        description: "適合需要短時間整理決策、案例與執行優先序的專案啟動階段。",
        imageUrl: "/sections/strategy-session-01.svg"
      }
    ]
  },
  founder: {
    name: "OFFICE NEXT 主理人",
    role: "Founder & Strategic Advisor",
    tagline: "擅長把品牌語言、服務設計與 AI 導入整理成能落地的決策。",
    bio: "長期協助專業服務、顧問型品牌與企業團隊處理定位、內容、提案與工作流程重整，重視清楚、節制與可持續的執行方式。",
    heroImageUrl: "/people/founder-hero.svg",
    portraitImageUrl: "/people/founder-portrait.svg"
  },
  services: {
    items: [
      {
        title: "品牌與定位整理",
        audience: "主理人品牌、顧問型服務、正在調整市場說法的團隊",
        description: "整理品牌核心、受眾與服務主張，讓首頁、簡介與提案說法一致。",
        imageUrl: "/sections/advisory-01.svg"
      },
      {
        title: "AI 導入策略",
        audience: "想把 AI 接進實際工作流程的專業服務團隊",
        description: "盤點高重複、高摩擦的工作節點，安排 AI 在內容、分析與協作中的位置。",
        imageUrl: "/sections/strategy-session-01.svg"
      },
      {
        title: "工作坊與內訓設計",
        audience: "企業內部專案、跨部門協作與轉型溝通場景",
        description: "設計能產出共識與下一步任務的工作坊、培訓與管理層對焦節奏。",
        imageUrl: "/sections/workshop-01.svg"
      }
    ]
  },
  cases: {
    items: [
      {
        category: "Brand Refresh",
        title: "重整顧問型品牌首頁與服務結構",
        problem: "網站內容分散，潛在客戶看不懂差異與強項。",
        approach: "整理品牌定位、首頁模組與案例摘要，建立一致的服務主線。",
        result: "首頁訊息更聚焦，提案時可直接引用同一套敘事與案例。",
        imageUrl: "/sections/advisory-01.svg"
      },
      {
        category: "AI Enablement",
        title: "把 AI 接進提案與內容產線",
        problem: "團隊知道要導入 AI，但每個人用法分散、難以複製。",
        approach: "先定義流程節點，再建立範本、提示與審稿節奏。",
        result: "重複性工作下降，內容產出速度與一致性同步提升。",
        imageUrl: "/sections/strategy-session-01.svg"
      },
      {
        category: "Workshop",
        title: "企業內部共識工作坊",
        problem: "跨部門對品牌與 AI 專案的期待不一致，決策常延誤。",
        approach: "設計會前材料、現場工作坊與會後行動清單。",
        result: "建立共同語言與優先順序，後續執行成本更低。",
        imageUrl: "/sections/workshop-01.svg"
      }
    ]
  },
  testimonials: {
    items: [
      {
        quote: "OFFICE NEXT 不是只給靈感，而是幫我們把說法與下一步整理出來。",
        name: "Ariel Chen",
        role: "Founder",
        company: "Consulting Studio",
        logoUrl: "/logos/client-01.svg"
      },
      {
        quote: "最有價值的是把 AI 放回流程，而不是額外增加一套負擔。",
        name: "Marcus Lin",
        role: "Head of Strategy",
        company: "Growth Team",
        logoUrl: "/logos/client-02.svg"
      },
      {
        quote: "工作坊後不只共識更清楚，連提案與內容也一起被整理好了。",
        name: "Ivy Wu",
        role: "Brand Lead",
        company: "Service Business",
        logoUrl: "/logos/client-03.svg"
      }
    ]
  },
  faq: {
    items: [
      {
        question: "OFFICE NEXT 適合哪一類合作？",
        answer: "適合正在整理品牌定位、服務敘事、提案節奏，或需要把 AI 接進既有工作流的團隊與主理人。"
      },
      {
        question: "可以只做短期策略討論嗎？",
        answer: "可以。可從單次策略 session、首頁內容整理或工作坊開始，再決定是否延伸。"
      },
      {
        question: "AI 顧問會只談工具嗎？",
        answer: "不會。重點是流程、角色、審核與交付品質，不是單純列出工具清單。"
      }
    ]
  },
  contact: {
    email: "hello@officenext.tw",
    intro: "如果你正在整理品牌方向、服務內容或 AI 導入節奏，這裡可以直接開始。",
    responseExpectation: "通常會在 2 個工作天內回覆，必要時再安排進一步討論。",
    inquiryOptions: ["品牌與定位整理", "AI 導入策略", "工作坊 / 內訓", "其他合作"],
    mailtoLabel: "直接寄信提出需求"
  },
  social: {
    linkedin: "",
    facebook: "",
    instagram: "",
    threads: "",
    youtube: "",
    x: "",
    other: []
  },
  clientLogos: [
    { name: "Client 01", url: "/logos/client-01.svg" },
    { name: "Client 02", url: "/logos/client-02.svg" },
    { name: "Client 03", url: "/logos/client-03.svg" }
  ]
};
