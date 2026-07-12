import type { CSSProperties } from "react";

import type { DesignSettings } from "@/types/content";

export const designSettingsDefaults: DesignSettings = {
  typography: {
    heroTitleScale: "balanced",
    sectionTitleScale: "balanced",
    cardTitleScale: "balanced",
    bodySize: "standard",
    lineHeight: "comfortable"
  },
  layout: {
    density: "balanced",
    mobileGutter: 20,
    desktopContainer: 1400,
    sectionSpacing: "balanced",
    cardPadding: "balanced",
    cardGap: "balanced",
    headerDensity: "balanced"
  },
  cards: { style: "tech-cut", hoverEffect: "edge-glow" },
  motion: {
    preset: "fly-up",
    speed: "balanced",
    distance: "subtle",
    stagger: "subtle",
    playOnce: true
  },
  floatingCta: { enabled: true, density: "compact" }
};

const allowed = {
  scale: ["compact", "balanced", "large"],
  bodySize: ["small", "standard", "large"],
  lineHeight: ["compact", "comfortable", "relaxed"],
  density: ["compact", "balanced", "spacious"],
  mobileGutter: [16, 20, 24],
  desktopContainer: [1200, 1280, 1400, 1520],
  headerDensity: ["compact", "balanced"],
  cardStyle: ["tech-cut", "minimal-line", "glass-panel", "soft-premium"],
  cardHover: ["none", "lift", "edge-glow"],
  motionPreset: ["none", "fade", "fly-up", "fly-alternate"],
  motionSpeed: ["fast", "balanced", "slow"],
  motionDistance: ["subtle", "balanced", "strong"],
  stagger: ["none", "subtle", "balanced"],
  ctaDensity: ["compact", "balanced"]
} as const;

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function pick<T extends readonly unknown[]>(values: T, value: unknown, fallback: T[number]): T[number] {
  return values.includes(value as never) ? value as T[number] : fallback;
}

export function normalizeDesignSettings(input: unknown): DesignSettings {
  const root = record(input);
  const typography = record(root.typography);
  const layout = record(root.layout);
  const cards = record(root.cards);
  const motion = record(root.motion);
  const floatingCta = record(root.floatingCta);
  const defaults = designSettingsDefaults;

  return {
    typography: {
      heroTitleScale: pick(allowed.scale, typography.heroTitleScale, defaults.typography.heroTitleScale),
      sectionTitleScale: pick(allowed.scale, typography.sectionTitleScale, defaults.typography.sectionTitleScale),
      cardTitleScale: pick(allowed.scale, typography.cardTitleScale, defaults.typography.cardTitleScale),
      bodySize: pick(allowed.bodySize, typography.bodySize, defaults.typography.bodySize),
      lineHeight: pick(allowed.lineHeight, typography.lineHeight, defaults.typography.lineHeight)
    },
    layout: {
      density: pick(allowed.density, layout.density, defaults.layout.density),
      mobileGutter: pick(allowed.mobileGutter, layout.mobileGutter, defaults.layout.mobileGutter),
      desktopContainer: pick(allowed.desktopContainer, layout.desktopContainer, defaults.layout.desktopContainer),
      sectionSpacing: pick(allowed.density, layout.sectionSpacing, defaults.layout.sectionSpacing),
      cardPadding: pick(allowed.density, layout.cardPadding, defaults.layout.cardPadding),
      cardGap: pick(allowed.density, layout.cardGap, defaults.layout.cardGap),
      headerDensity: pick(allowed.headerDensity, layout.headerDensity, defaults.layout.headerDensity)
    },
    cards: {
      style: pick(allowed.cardStyle, cards.style, defaults.cards.style),
      hoverEffect: pick(allowed.cardHover, cards.hoverEffect, defaults.cards.hoverEffect)
    },
    motion: {
      preset: pick(allowed.motionPreset, motion.preset, defaults.motion.preset),
      speed: pick(allowed.motionSpeed, motion.speed, defaults.motion.speed),
      distance: pick(allowed.motionDistance, motion.distance, defaults.motion.distance),
      stagger: pick(allowed.stagger, motion.stagger, defaults.motion.stagger),
      playOnce: typeof motion.playOnce === "boolean" ? motion.playOnce : defaults.motion.playOnce
    },
    floatingCta: {
      enabled: typeof floatingCta.enabled === "boolean" ? floatingCta.enabled : defaults.floatingCta.enabled,
      density: pick(allowed.ctaDensity, floatingCta.density, defaults.floatingCta.density)
    }
  };
}

export function getDesignDataAttributes(design: DesignSettings) {
  return {
    "data-design-density": design.layout.density,
    "data-hero-scale": design.typography.heroTitleScale,
    "data-section-scale": design.typography.sectionTitleScale,
    "data-card-title-scale": design.typography.cardTitleScale,
    "data-body-size": design.typography.bodySize,
    "data-line-height": design.typography.lineHeight,
    "data-card-style": design.cards.style,
    "data-card-hover": design.cards.hoverEffect,
    "data-motion-preset": design.motion.preset,
    "data-motion-speed": design.motion.speed,
    "data-motion-distance": design.motion.distance,
    "data-motion-stagger": design.motion.stagger,
    "data-motion-once": String(design.motion.playOnce),
    "data-header-density": design.layout.headerDensity,
    "data-floating-cta-density": design.floatingCta.density
  } as const;
}

const cssMap = {
  bodySize: { small: "0.9375rem", standard: "1rem", large: "1.0625rem" },
  lineHeight: { compact: "1.55", comfortable: "1.75", relaxed: "1.9" },
  hero: {
    compact: "clamp(2.15rem, 4.5vw, 4.8rem)",
    balanced: "clamp(2.4rem, 5vw, 6.2rem)",
    large: "clamp(2.7rem, 5.8vw, 7rem)"
  },
  sectionTitle: {
    compact: "clamp(1.7rem, 3.4vw, 2.75rem)",
    balanced: "clamp(1.9rem, 4vw, 3.25rem)",
    large: "clamp(2.1rem, 4.5vw, 3.75rem)"
  },
  cardTitle: { compact: "1.05rem", balanced: "1.2rem", large: "1.35rem" },
  sectionSpace: { compact: "4rem", balanced: "5rem", spacious: "6.5rem" },
  cardPadding: { compact: "1.25rem", balanced: "1.75rem", spacious: "2.25rem" },
  cardGap: { compact: "1rem", balanced: "1.25rem", spacious: "1.75rem" }
} as const;

export type DesignCssProperties = CSSProperties & Record<`--site-${string}`, string>;

export function getDesignCssVariables(design: DesignSettings): DesignCssProperties {
  return {
    "--site-mobile-gutter": `${design.layout.mobileGutter}px`,
    "--site-container-max": `${design.layout.desktopContainer}px`,
    "--site-section-space": cssMap.sectionSpace[design.layout.sectionSpacing],
    "--site-card-padding": cssMap.cardPadding[design.layout.cardPadding],
    "--site-card-gap": cssMap.cardGap[design.layout.cardGap],
    "--site-body-size": cssMap.bodySize[design.typography.bodySize],
    "--site-body-leading": cssMap.lineHeight[design.typography.lineHeight],
    "--site-hero-size": cssMap.hero[design.typography.heroTitleScale],
    "--site-section-title-size": cssMap.sectionTitle[design.typography.sectionTitleScale],
    "--site-card-title-size": cssMap.cardTitle[design.typography.cardTitleScale]
  };
}

export function getMotionConfig(design: DesignSettings) {
  return {
    preset: design.motion.preset,
    duration: { fast: 0.42, balanced: 0.7, slow: 0.95 }[design.motion.speed],
    distance: { subtle: 20, balanced: 34, strong: 52 }[design.motion.distance],
    stagger: { none: 0, subtle: 0.06, balanced: 0.12 }[design.motion.stagger],
    once: design.motion.playOnce
  };
}

export function getCardStyleConfig(design: DesignSettings) {
  return { style: design.cards.style, hoverEffect: design.cards.hoverEffect };
}
