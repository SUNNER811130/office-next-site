"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";

type MotionSettings = {
  preset: "none" | "fade" | "fly-up" | "fly-alternate";
  duration: number;
  distance: number;
  stagger: number;
  once: boolean;
};

const defaultMotion: MotionSettings = { preset: "fly-up", duration: 0.7, distance: 20, stagger: 0.06, once: true };

function useDesignMotion() {
  const [settings, setSettings] = useState(defaultMotion);
  useEffect(() => {
    const data = document.body.dataset;
    setSettings({
      preset: (["none", "fade", "fly-up", "fly-alternate"].includes(data.motionPreset ?? "") ? data.motionPreset : defaultMotion.preset) as MotionSettings["preset"],
      duration: { fast: 0.42, balanced: 0.7, slow: 0.95 }[data.motionSpeed ?? ""] ?? defaultMotion.duration,
      distance: { subtle: 20, balanced: 34, strong: 52 }[data.motionDistance ?? ""] ?? defaultMotion.distance,
      stagger: { none: 0, subtle: 0.06, balanced: 0.12 }[data.motionStagger ?? ""] ?? defaultMotion.stagger,
      once: data.motionOnce !== "false"
    });
  }, []);
  return settings;
}

/* ── Fade-up entrance for sections & cards ───────────────────────── */

type FadeUpProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
};

export function FadeUp({ children, delay = 0, ...props }: FadeUpProps) {
  const prefersReducedMotion = useReducedMotion();
  const settings = useDesignMotion();
  const disabled = prefersReducedMotion || settings.preset === "none";
  const initial = settings.preset === "fade" ? { opacity: 0 } : { opacity: 0, y: settings.distance, scale: 0.985, filter: "blur(6px)" };

  return (
    <motion.div
      initial={disabled ? false : initial}
      whileInView={disabled ? undefined : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: settings.once, margin: "-60px" }}
      transition={{ duration: settings.duration, ease: [0.16, 1, 0.3, 1], delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ── Hover-lift for interactive cards ────────────────────────────── */

type HoverLiftProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

export function HoverLift({ children, className, ...props }: HoverLiftProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ── Staggered container for card grids ─────────────────────────── */

type StaggerContainerProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  stagger?: number;
};

export function StaggerContainer({
  children,
  stagger = 0.08,
  ...props
}: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion();
  const settings = useDesignMotion();

  return (
    <motion.div
      initial={prefersReducedMotion || settings.preset === "none" ? false : "hidden"}
      whileInView={prefersReducedMotion || settings.preset === "none" ? undefined : "visible"}
      viewport={{ once: settings.once, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger === 0.08 ? settings.stagger : stagger } }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ── Staggered item (child of StaggerContainer) ─────────────────── */

type StaggerItemProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

export function StaggerItem({ children, ...props }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const settings = useDesignMotion();

  return (
    <motion.div
      initial={prefersReducedMotion || settings.preset === "none" ? false : undefined}
      variants={{
        hidden: settings.preset === "fade" ? { opacity: 0 } : { opacity: 0, y: settings.distance, filter: "blur(6px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: settings.duration, ease: [0.16, 1, 0.3, 1] } }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type DepthRevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
};

export function DepthReveal({ children, delay = 0, ...props }: DepthRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const settings = useDesignMotion();

  return (
    <motion.div
      initial={prefersReducedMotion || settings.preset === "none" ? false : { opacity: 0, y: settings.preset === "fade" ? 0 : settings.distance, scale: 0.92, rotateX: 10, filter: "blur(12px)" }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once: settings.once, margin: "-80px" }}
      transition={{ duration: settings.duration, ease: [0.16, 1, 0.3, 1], delay }}
      style={{ transformPerspective: 1200, transformOrigin: "50% 55%" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type FlyInPanelProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
};

export function FlyInPanel({ children, delay = 0, ...props }: FlyInPanelProps) {
  const prefersReducedMotion = useReducedMotion();
  const settings = useDesignMotion();

  return (
    <motion.div
      initial={prefersReducedMotion || settings.preset === "none" ? false : { opacity: 0, x: settings.preset === "fly-alternate" ? settings.distance : 0, y: settings.preset === "fade" ? 0 : settings.distance, scale: 0.9, rotateY: -9, filter: "blur(12px)" }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, filter: "blur(0px)" }}
      viewport={{ once: settings.once, margin: "-70px" }}
      transition={{ duration: settings.duration, ease: [0.16, 1, 0.3, 1], delay }}
      style={{ transformPerspective: 1200, transformOrigin: "50% 50%" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
