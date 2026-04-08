export type NavItem = {
  label: string;
  href: string;
};

export type MediaCategory = "brand" | "people" | "sections" | "logos" | "og";

export type MediaLink = {
  label: string;
  url: string;
};

export type BrandContent = {
  name: string;
  legalName: string;
  shortName: string;
  summary: string;
  positioning: string;
  proposition: string;
  logoWordmarkUrl: string;
  logoWordmarkHeaderUrl?: string;
  logoMarkUrl: string;
  ogImageUrl: string;
};

export type HomeHeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
};

export type PropositionCard = {
  title: string;
  description: string;
};

export type FlagshipModule = {
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  imageUrl: string;
};

export type HomeContent = {
  hero: HomeHeroContent;
  painPoints: string[];
  propositionCards: PropositionCard[];
  flagshipModules: FlagshipModule[];
};

export type FounderContent = {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  heroImageUrl: string;
  portraitImageUrl: string;
};

export type ServiceItem = {
  title: string;
  audience: string;
  description: string;
  imageUrl?: string;
};

export type ServicesContent = {
  items: ServiceItem[];
};

export type CaseStudy = {
  category: string;
  title: string;
  problem: string;
  approach: string;
  result: string;
  imageUrl: string;
};

export type CasesContent = {
  items: CaseStudy[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  logoUrl?: string;
};

export type TestimonialsContent = {
  items: Testimonial[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqContent = {
  items: FaqItem[];
};

export type ContactContent = {
  email: string;
  intro: string;
  responseExpectation: string;
  inquiryOptions: string[];
  mailtoLabel: string;
};

export type SocialContent = {
  linkedin: string;
  facebook: string;
  instagram: string;
  threads: string;
  youtube: string;
  x: string;
  other: MediaLink[];
};

export type ClientLogo = {
  name: string;
  url: string;
  href?: string;
};

export type SiteContent = {
  siteUrl: string;
  navigation: {
    headerTagline: string;
    navItems: NavItem[];
    footerLinks: NavItem[];
  };
  brand: BrandContent;
  home: HomeContent;
  founder: FounderContent;
  services: ServicesContent;
  cases: CasesContent;
  testimonials: TestimonialsContent;
  faq: FaqContent;
  contact: ContactContent;
  social: SocialContent;
  clientLogos: ClientLogo[];
};

export type ContentSection = Exclude<keyof SiteContent, "siteUrl" | "navigation" | "clientLogos"> | "social";

export type ContentSectionMap = {
  brand: BrandContent;
  home: HomeContent;
  founder: FounderContent;
  services: ServicesContent;
  cases: CasesContent;
  testimonials: TestimonialsContent;
  faq: FaqContent;
  contact: ContactContent;
  social: SocialContent;
};
