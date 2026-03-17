import type { Metadata } from "next";

import { absoluteUrl, brandEntity, siteConfig } from "@/lib/site";

type MetadataInput = {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

type ServiceSchemaInput = {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  audience?: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type ArticleMetadataInput = {
  path: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  keywords?: string[];
};

export function createPageMetadata({
  path,
  title,
  description,
  keywords = []
}: MetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} | ${siteConfig.shortName}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path
    },
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
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
      title: fullTitle,
      description,
      images: [siteConfig.ogImage]
    }
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    email: siteConfig.contactEmail,
    description: siteConfig.description,
    slogan: brandEntity.proposition,
    sameAs: brandEntity.sameAs.length > 0 ? brandEntity.sameAs : undefined,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: siteConfig.contactEmail,
        url: absoluteUrl("/contact")
      }
    ],
    founder: brandEntity.founder.name
      ? {
          "@type": "Person",
          name: brandEntity.founder.name,
          jobTitle: brandEntity.founder.role
        }
      : undefined
  };
}

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "zh-Hant"
  };
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function createServiceSchema(input: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    url: absoluteUrl(input.path),
    audience: input.audience
      ? {
          "@type": "Audience",
          audienceType: input.audience
        }
      : undefined,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    }
  };
}

export function createFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function createArticleMetadata({
  path,
  title,
  description,
  publishedAt,
  updatedAt,
  author,
  keywords = []
}: ArticleMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} | ${siteConfig.shortName}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path
    },
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: "zh_TW",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      authors: [author],
      images: [
        {
          url: siteConfig.ogImage,
          alt: `${title} Open Graph Image`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [siteConfig.ogImage]
    }
  };
}

export function createArticleSchema({
  path,
  title,
  description,
  publishedAt,
  updatedAt,
  author
}: ArticleMetadataInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      "@type": "Organization",
      name: author
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    mainEntityOfPage: absoluteUrl(path),
    url: absoluteUrl(path),
    image: [absoluteUrl(siteConfig.ogImage)]
  };
}
