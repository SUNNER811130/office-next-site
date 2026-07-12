"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { getPageBlockAttributes, getPageBlockClassConfig } from "@/lib/page-block-settings";
import type { PageBlockConfig } from "@/types/content";

export function PageBlockFrame({ config, children, page }: { config: PageBlockConfig; children: ReactNode; page?: "home" | "services" | "about" }) {
  const reducedMotion = useReducedMotion();
  const preset = config.motion;
  const disabled = reducedMotion || preset === "inherit" || preset === "none";
  const offset = 24;
  const initial = preset === "fade" ? { opacity: 0 } : preset === "fly-left" ? { opacity: 0, x: -offset } : preset === "fly-right" ? { opacity: 0, x: offset } : { opacity: 0, y: offset };
  return <motion.div {...getPageBlockAttributes(config)} data-page-block-page={page} className={getPageBlockClassConfig(config)} initial={disabled ? false : initial} whileInView={disabled ? undefined : { opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: "-48px" }} transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;
}
