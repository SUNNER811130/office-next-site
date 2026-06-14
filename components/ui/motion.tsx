"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

/* ── Fade-up entrance for sections & cards ───────────────────────── */

type FadeUpProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
};

export function FadeUp({ children, delay = 0, ...props }: FadeUpProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.985, filter: "blur(6px)" }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
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

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } }
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

  return (
    <motion.div
      initial={prefersReducedMotion ? false : undefined}
      variants={{
        hidden: { opacity: 0, y: 42, scale: 0.94, rotateX: 8, filter: "blur(10px)" },
        visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)", transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] } }
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

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 64, scale: 0.92, rotateX: 10, filter: "blur(12px)" }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
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

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, x: 46, y: 24, scale: 0.9, rotateY: -9, filter: "blur(12px)" }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.92, ease: [0.16, 1, 0.3, 1], delay }}
      style={{ transformPerspective: 1200, transformOrigin: "50% 50%" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
