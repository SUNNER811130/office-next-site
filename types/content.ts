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
  pastExperience?: string[];
  currentRoles?: string[];
  representativeClients?: string[];
};

export type ServiceItem = {
  title: string;
  audience: string;
  description: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
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

export type DesignSettings = {
  typography: {
    heroTitleScale: "compact" | "balanced" | "large";
    sectionTitleScale: "compact" | "balanced" | "large";
    cardTitleScale: "compact" | "balanced" | "large";
    bodySize: "small" | "standard" | "large";
    lineHeight: "compact" | "comfortable" | "relaxed";
  };
  layout: {
    density: "compact" | "balanced" | "spacious";
    mobileGutter: 16 | 20 | 24;
    desktopContainer: 1200 | 1280 | 1400 | 1520;
    sectionSpacing: "compact" | "balanced" | "spacious";
    cardPadding: "compact" | "balanced" | "spacious";
    cardGap: "compact" | "balanced" | "spacious";
    headerDensity: "compact" | "balanced";
  };
  cards: {
    style: "tech-cut" | "minimal-line" | "glass-panel" | "soft-premium";
    hoverEffect: "none" | "lift" | "edge-glow";
  };
  motion: {
    preset: "none" | "fade" | "fly-up" | "fly-alternate";
    speed: "fast" | "balanced" | "slow";
    distance: "subtle" | "balanced" | "strong";
    stagger: "none" | "subtle" | "balanced";
    playOnce: boolean;
  };
  floatingCta: {
    enabled: boolean;
    density: "compact" | "balanced";
  };
};

export type HomeBlockId =
  | "hero"
  | "work-upgrade"
  | "pain-points"
  | "services"
  | "flagship-modules"
  | "cases"
  | "client-logos"
  | "testimonials"
  | "faq";
export type ServicesBlockId = "hero" | "service-cards" | "case-snapshots" | "faq";
export type AboutBlockId = "hero" | "brand-positioning" | "founder-experience" | "testimonials" | "faq";
export type PageBlockId = HomeBlockId | ServicesBlockId | AboutBlockId;

export type PageBlockBackground = "default" | "clean" | "soft-grid" | "soft-blue" | "deep-panel";
export type PageBlockMotion = "inherit" | "none" | "fade" | "fly-up" | "fly-left" | "fly-right";
export type PageBlockLayout = "default" | "contained" | "wide" | "single-column" | "two-column";

export type PageBlockConfig<TId extends PageBlockId = PageBlockId> = {
  id: TId;
  enabled: boolean;
  order: number;
  background: PageBlockBackground;
  motion: PageBlockMotion;
  layout: PageBlockLayout;
};

export type PageBlockSettings = {
  home: PageBlockConfig<HomeBlockId>[];
  services: PageBlockConfig<ServicesBlockId>[];
  about: PageBlockConfig<AboutBlockId>[];
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
  design: DesignSettings;
  pageBlocks: PageBlockSettings;
};

export type ContentSection = Exclude<keyof SiteContent, "siteUrl" | "navigation" | "clientLogos">;

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
  design: DesignSettings;
  pageBlocks: PageBlockSettings;
};
