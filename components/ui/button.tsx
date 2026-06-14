import Link from "next/link";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "border border-midnight bg-midnight text-white shadow-[0_14px_36px_rgba(26,39,68,0.18)] hover:-translate-y-0.5 hover:bg-[#0B2440] hover:shadow-[0_18px_44px_rgba(26,39,68,0.24),0_0_0_1px_rgba(110,167,191,0.22)] focus-visible:outline-midnight",
  secondary:
    "border border-midnight/10 bg-white/72 text-midnight backdrop-blur-md shadow-glass hover:-translate-y-0.5 hover:border-champagne/45 hover:bg-white/92 hover:shadow-[0_12px_34px_rgba(7,26,47,0.08),0_0_0_1px_rgba(110,167,191,0.16)] focus-visible:outline-midnight",
  ghost: "text-midnight hover:bg-midnight/5 focus-visible:outline-midnight"
} as const;

const baseClasses =
  "tech-button inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium tracking-[0.16em] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none";

type Variant = keyof typeof buttonVariants;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(baseClasses, buttonVariants[variant], className)}
      {...props}
    />
  );
});

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
};

export function ButtonLink({
  className,
  href,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(baseClasses, buttonVariants[variant], className)}
      {...props}
    />
  );
}
