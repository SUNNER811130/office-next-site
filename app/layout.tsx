import type { Metadata } from "next";
import { Instrument_Serif, Noto_Sans_TC } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { FloatingCta } from "@/components/layout/floating-cta";
import { Header } from "@/components/layout/header";
import { JsonLd, createOrganizationSchema, createWebsiteSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

import "./globals.css";

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

const defaultTitle = `${siteConfig.shortName} | 白領工作與 AI 策略顧問`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.shortName}`
  },
  description: siteConfig.description,
  keywords: ["AI 顧問", "白領工作設計", "企業內訓", "品牌策略"],
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
    description: siteConfig.description,
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
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={`${bodyFont.variable} ${displayFont.variable}`}>
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
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <FloatingCta />
          <Footer />
        </div>
      </body>
    </html>
  );
}
