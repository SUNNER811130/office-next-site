import { siteContentSeed } from "@/data/site-content.seed";
import { readContent } from "@/lib/content-store";

function buildBrandEntity(content = siteContentSeed) {
  return {
    name: content.brand.name,
    legalName: content.brand.legalName,
    shortName: content.brand.shortName,
    url: content.siteUrl,
    contactEmail: content.contact.email,
    positioning: content.brand.positioning,
    proposition: content.brand.proposition,
    shortDescription: content.brand.summary,
    standardDescription: `${content.brand.summary} ${content.brand.proposition}`,
    leadershipNote: content.founder.tagline,
    founder: {
      name: content.founder.name,
      role: content.founder.role
    },
    sameAs: [
      content.social.linkedin,
      content.social.facebook,
      content.social.instagram,
      content.social.threads,
      content.social.youtube,
      content.social.x,
      ...content.social.other.map((item) => item.url)
    ].filter(Boolean),
    ogImage: content.brand.ogImageUrl
  };
}

function buildSiteConfig(content = siteContentSeed) {
  const brandEntity = buildBrandEntity(content);

  return {
    name: content.brand.name,
    legalName: content.brand.legalName,
    shortName: content.brand.shortName,
    description: `${content.brand.summary} ${content.brand.proposition}`,
    url: content.siteUrl,
    ogImage: content.brand.ogImageUrl,
    contactEmail: content.contact.email,
    navItems: content.navigation.navItems,
    footerLinks: content.navigation.footerLinks,
    tagline: content.navigation.headerTagline,
    brandEntity
  };
}

export const brandEntity = buildBrandEntity();
export const siteConfig = buildSiteConfig();

export async function getDynamicSiteConfig() {
  const content = await readContent();
  return buildSiteConfig(content);
}

export async function getDynamicBrandEntity() {
  const content = await readContent();
  return buildBrandEntity(content);
}

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, siteConfig.url).toString();
}
