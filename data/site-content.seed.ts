import type { SiteContent } from "@/types/content";
import { designSettingsDefaults } from "@/lib/design-settings";

export const siteContentSeed: SiteContent = {
  design: designSettingsDefaults,
  siteUrl: "https://office-next-site.vercel.app",
  navigation: {
    headerTagline: "White-Collar AI Productivity and Office Automation",
    navItems: [
      { label: "首頁", href: "/" },
      { label: "關於", href: "/about" },
      { label: "服務", href: "/services" },
      { label: "企業內訓", href: "/corporate-training" },
      { label: "聯絡", href: "/contact" }
    ],
    footerLinks: [
      { label: "首頁", href: "/" },
      { label: "品牌與主理人", href: "/about" },
      { label: "課程與服務", href: "/services" },
      { label: "企業 AI 內訓", href: "/corporate-training" },
      { label: "聯絡 OFFICE NEXT", href: "/contact" }
    ]
  },
  brand: {
    name: "OFFICE NEXT 辦公進化所",
    legalName: "OFFICE NEXT",
    shortName: "OFFICE NEXT",
    summary:
      "OFFICE NEXT 辦公進化所專注白領 AI 提效、自動化與工作流程升級，協助個人與團隊把 AI 用進日常辦公，讓重複事務降載，準時下班。",
    positioning: "白領 AI 提效、辦公自動化與工作流程升級品牌",
    proposition: "讓 AI 成為你的私人萬能助理，你準時下班。",
    logoWordmarkUrl: "/brand/logo-wordmark.svg",
    logoWordmarkHeaderUrl: "/brand/logo-wordmark-header.svg",
    logoMarkUrl: "/brand/logo-mark.svg",
    ogImageUrl: "/og/og-default.svg"
  },
  home: {
    hero: {
      eyebrow: "OFFICE NEXT 辦公進化所",
      title: "把重複工作交給 AI，讓你準時下班。",
      description:
        "專為白領打造的 AI 提效與辦公自動化品牌。從 ChatGPT 工作應用、AI 工作流程設計，到會議紀錄、資料整理、提案摘要與報表彙整，OFFICE NEXT 協助你把重複工作交給 AI，升級日常辦公流程，把時間留給更有價值的判斷與準時下班。",
      imageUrl: "/sections/advisory-01.svg",
      ctaPrimaryLabel: "開始辦公進化",
      ctaPrimaryHref: "/contact",
      ctaSecondaryLabel: "查看課程與服務",
      ctaSecondaryHref: "/services"
    },
    painPoints: [
      "每天都在整理會議紀錄、訊息重點、待辦追蹤與跨部門回覆，時間被零碎工作切碎。",
      "資料整理、提案摘要、報表彙整與格式重整看起來不難，卻反覆消耗專注力。",
      "用過 ChatGPT，卻不知道怎麼把它放進真實工作流程，最後還是自己加班收尾。"
    ],
    propositionCards: [
      {
        title: "不是你效率差，是流程沒有升級",
        description:
          "很多白領累，不是能力不夠，而是一直用人工方式處理 AI 可以協作的重複環節。"
      },
      {
        title: "先做半自動，再做全自動",
        description:
          "從提示詞、文件模板、表格整理與審稿流程開始，先讓 AI 接手一段，再逐步串成穩定流程。"
      },
      {
        title: "讓 AI 成為工作協作員",
        description:
          "把 ChatGPT、GAS 與 Agent 放回會議、提案、資料與報表場景，讓 AI 真的幫你完成工作。"
      }
    ],
    flagshipModules: [
      {
        eyebrow: "Module 01",
        title: "GPT 智慧工作模組",
        summary: "提示詞工坊與白領工作模板",
        description:
          "從會議紀錄、提案摘要、資料整理、文案修稿到報表說明，建立能反覆使用的 ChatGPT 工作方法。",
        imageUrl: "/sections/advisory-01.svg"
      },
      {
        eyebrow: "Module 02",
        title: "GAS 辦公降載",
        summary: "表單、試算表、信件與排程自動化",
        description:
          "把日常辦公中最耗時的複製、整理、通知與彙整工作，轉成可維護的半自動化流程。",
        imageUrl: "/sections/workshop-01.svg"
      },
      {
        eyebrow: "Module 03",
        title: "Agent 高效槓桿",
        summary: "讓 AI 協助追蹤、彙整與跨工具執行",
        description:
          "為高頻工作設計更清楚的任務分工、輸入輸出與檢查節點，讓 AI 從聊天工具變成協作員。",
        imageUrl: "/sections/strategy-session-01.svg"
      }
    ]
  },
  founder: {
    name: "蘇彥宇 Sun",
    role: "OFFICE NEXT 辦公進化所創辦人",
    tagline: "從醫療現場到企業數位轉型，把複雜的 AI 與自動化工具，轉化為白領真正用得上的工作方法。",
    bio:
      "擁有 7 年護理經驗，曾任台東區域醫院開刀房護理師與台南嘉南療養院急性精神科病房護理人員，累積服務超過 6,000 人。轉入講師產業後累積 6 年教學與培訓經驗，現專注 GPT 智慧工作模組、GAS 辦公降載與企業數位轉型培訓，協助個人與組織建立可落地、可維護的 AI 工作流程。",
    heroImageUrl: "/people/founder-hero.svg",
    portraitImageUrl: "/people/founder-portrait.svg",
    pastExperience: [
      "曾任台東區域醫院開刀房護理師",
      "曾任台南嘉南療養院急性精神科病房護理人員",
      "7 年護理經驗，累積服務超過 6,000 人"
    ],
    currentRoles: [
      "講師行業經驗 6 年",
      "INCA 國際生命數字協會－高級論碼諮詢師",
      "OFFICE NEXT 辦公進化所創辦人",
      "沐樂關係成長事務所專責講師"
    ],
    representativeClients: [
      "中鋼碳素、中石化、河見泵浦、國防部新訓單位",
      "凱基、富邦、三商美邦、南山、公勝、巨鼎等保險與保經公司",
      "安麗、賀寶芙、美商婕斯等組織行銷團隊",
      "沐樂 MORe LOVE、慕約會、337 同居聯誼、微 Micro Club",
      "各大扶輪社、醫美診所、長照中心等組織",
      "經濟部數位轉型企業包班超過 40 場"
    ]
  },
  services: {
    items: [
      {
        title: "GPT 智慧工作模組－提示詞工坊",
        audience: "行政、企劃、行銷、業務、PM、人資與需要大量文件輸出的白領工作者",
        description:
          "學會把 ChatGPT 用在會議紀錄、提案摘要、資料整理、文案修稿與報表說明，建立可複製的提示詞與工作模板。",
        imageUrl: "/sections/advisory-01.svg",
        ctaLabel: "立即報名",
        ctaHref: "https://forms.gle/iQAEYyhY8HSzmG1J6"
      },
      {
        title: "GPT 智慧工作模組－GAS 辦公降載",
        audience: "需要處理表單、試算表、信件通知、名單整理與例行彙整的個人與團隊",
        description:
          "用 Google Apps Script 串起表單、試算表、文件與信件，先做半自動，再把高重複流程逐步變成穩定自動化。",
        imageUrl: "/sections/workshop-01.svg",
        ctaLabel: "立即報名",
        ctaHref: "https://forms.gle/ERUFKXzHgN3uo2id9"
      },
      {
        title: "GPT 智慧工作模組－Agent 高效槓桿",
        audience: "小主管、Team Lead、營運與需要跨工具追蹤任務的知識工作團隊",
        description:
          "設計 AI Agent 可協作的任務邏輯、資料輸入、檢查節點與交付格式，讓 AI 協助追蹤、彙整與初步執行。",
        imageUrl: "/sections/strategy-session-01.svg"
      },
      {
        title: "企業 AI 內訓與辦公流程導入",
        audience: "HR、培訓窗口、部門主管與想建立 AI 共識的企業白領團隊",
        description:
          "依照團隊角色與日常流程客製內訓內容，建立 ChatGPT 工作應用、辦公自動化與 AI 協作語言。",
        imageUrl: "/sections/workshop-01.svg"
      }
    ]
  },
  cases: {
    items: [
      {
        category: "Meeting Workflow",
        title: "會議紀錄與摘要流程降載",
        problem: "每次會後都要重聽錄音、整理重點、補待辦與追進度，會議越多越難準時收尾。",
        approach:
          "建立會議輸入格式、ChatGPT 摘要提示詞、決議與待辦欄位，並設計會後檢查與分派流程。",
        result: "會議整理時間明顯下降，主管與成員更快取得摘要、決議、負責人與下一步。",
        imageUrl: "/sections/advisory-01.svg"
      },
      {
        category: "Office Automation",
        title: "表單 / 試算表 / 信件流程自動化",
        problem: "名單、回覆、通知與彙整都靠人工複製貼上，容易漏信、漏欄位與重複確認。",
        approach:
          "用 GAS 串接表單、試算表與信件模板，讓資料進來後自動整理、標記、通知與產出摘要。",
        result: "例行行政作業降載，團隊把時間轉回確認品質、客戶回覆與重要判斷。",
        imageUrl: "/sections/workshop-01.svg"
      },
      {
        category: "Team Enablement",
        title: "企業團隊建立 AI 協作語言",
        problem: "每個人都在用 AI，但提示詞、審稿標準、資料邊界與交付格式不一致。",
        approach:
          "透過企業內訓整理共同用語、工作場景、範本與檢查清單，讓 AI 應用回到真實流程。",
        result: "團隊不再各自摸索，能用一致方法處理會議、提案、資料與跨部門協作。",
        imageUrl: "/sections/strategy-session-01.svg"
      }
    ]
  },
  testimonials: {
    items: [
      {
        quote: "以前會議後最怕整理紀錄，現在有固定提示詞和檢查流程，待辦整理快很多，也比較不會漏。",
        name: "Ariel Chen",
        role: "Project Manager",
        company: "B2B Service Team",
        logoUrl: "/logos/client-01.svg"
      },
      {
        quote: "GAS 辦公降載讓我們把表單、試算表和通知串起來，行政同仁不用一直複製貼上。",
        name: "Marcus Lin",
        role: "Operations Lead",
        company: "Growth Team",
        logoUrl: "/logos/client-02.svg"
      },
      {
        quote: "內訓後大家終於用同一套語言討論 AI，不是比誰知道更多工具，而是回到流程怎麼升級。",
        name: "Ivy Wu",
        role: "HR Business Partner",
        company: "Enterprise Team",
        logoUrl: "/logos/client-03.svg"
      }
    ]
  },
  faq: {
    items: [
      {
        question: "OFFICE NEXT 辦公進化所是什麼？",
        answer:
          "OFFICE NEXT 辦公進化所是專為白領打造的 AI 工作升級品牌，專注 ChatGPT 工作應用、辦公自動化、AI 工作流程與準時下班的實戰方法。"
      },
      {
        question: "OFFICE NEXT 適合誰？",
        answer:
          "適合行政、企劃、行銷、業務、PM、人資、營運、助理、小主管、Team Lead，以及想導入 AI 內訓的 HR 與企業部門主管。"
      },
      {
        question: "不會寫程式也能學辦公自動化嗎？",
        answer:
          "可以。OFFICE NEXT 會先從白領能理解的工作流程、提示詞、表格邏輯與半自動化開始，再逐步銜接 GAS 或 Agent。"
      },
      {
        question: "ChatGPT 可以怎麼幫助白領工作？",
        answer:
          "ChatGPT 可以協助整理會議紀錄、摘要提案、重寫文案、歸納資料、產生報表說明、建立檢查清單，並把重複文字工作變成可複製流程。"
      },
      {
        question: "GAS 辦公降載適合哪些工作？",
        answer:
          "GAS 適合表單回覆整理、試算表資料清理、Email 通知、名單彙整、排程提醒、報表更新等高重複、規則明確的辦公流程。"
      },
      {
        question: "企業內訓可以客製化嗎？",
        answer:
          "可以。企業 AI 內訓會依照部門角色、工作流程、AI 使用成熟度與資料安全邊界，客製課程範例、實作任務與導入建議。"
      }
    ]
  },
  contact: {
    email: "sunner811130gas@gmail.com",
    intro:
      "如果你想把 ChatGPT、辦公自動化或 AI 工作流程導入日常工作，歡迎告訴我們目前最耗時的重複任務。",
    responseExpectation: "通常會在 2 個工作天內回覆，必要時再安排需求訪談或企業內訓討論。",
    inquiryOptions: [
      "GPT 提示詞工坊",
      "GAS 辦公降載",
      "Agent 高效槓桿",
      "企業 AI 內訓",
      "一對一 AI 辦公導入"
    ],
    mailtoLabel: "開始辦公進化"
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
