import type { Metadata } from "next";
import { Instrument_Serif, Noto_Sans_TC } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { FloatingCta } from "@/components/layout/floating-cta";
import { Header } from "@/components/layout/header";
import { JsonLd, createOrganizationSchema, createWebsiteSchema } from "@/lib/seo";
import { getDynamicSiteConfig } from "@/lib/site";

import "./globals.css";

const brandKeywords = [
  "OFFICE NEXT 辦公進化所",
  "白領 AI 提效",
  "辦公自動化",
  "工作流程升級",
  "ChatGPT 工作應用",
  "AI 工作流",
  "GAS 辦公降載",
  "AI 企業內訓",
  "準時下班",
  "會議紀錄自動化",
  "提案摘要",
  "資料整理",
  "報表彙整",
  "工作思維升級"
];

const bodyFont = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
  display: "swap"
});

const displayFont = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  display: "swap"
});

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getDynamicSiteConfig();
  const defaultTitle = "OFFICE NEXT 辦公進化所｜白領 AI 提效與辦公自動化";
  const description =
    "OFFICE NEXT 辦公進化所協助白領把 AI 用進日常辦公，讓會議紀錄、資料整理、提案摘要、報表彙整等重複事務降載，升級工作流程並準時下班。";

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: defaultTitle,
      template: `%s | ${siteConfig.shortName}`
    },
    description,
    keywords: brandKeywords,
    alternates: {
      canonical: "/"
    },
    icons: {
      icon: "/icon",
      apple: "/apple-icon"
    },
    manifest: "/manifest.webmanifest",
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      title: defaultTitle,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      locale: "zh_TW",
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          alt: `${siteConfig.shortName} Open Graph Image`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: [siteConfig.ogImage]
    }
  };
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" data-scroll-behavior="smooth" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <div className="relative flex min-h-screen flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
          >
            跳到主要內容
          </a>
          <JsonLd data={[createOrganizationSchema(), createWebsiteSchema()]} />
          <Header />
          <main id="main-content" className="flex-1 pb-24 lg:pb-0">
            {children}
          </main>
          <FloatingCta />
          <Footer />
        </div>
      </body>
    </html>
  );
}
