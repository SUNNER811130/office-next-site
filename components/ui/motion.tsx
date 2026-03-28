"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

/* ── Fade-up entrance for sections & cards ───────────────────────── */

type FadeUpProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
};

export function FadeUp({ children, delay = 0, ...props }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
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
  return (
    <motion.div
      whileHover={{ y: -3 }}
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
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
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
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
