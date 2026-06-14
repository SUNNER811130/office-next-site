import Link from "next/link";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "border border-midnight bg-midnight text-white shadow-[0_14px_36px_rgba(26,39,68,0.18),inset_0_1px_0_rgba(255,255,255,0.14)] hover:-translate-y-1 hover:border-champagne/45 hover:bg-[#0B2440] hover:shadow-[0_20px_48px_rgba(7,26,47,0.28),0_0_0_1px_rgba(110,167,191,0.28),0_0_32px_rgba(110,167,191,0.18)] focus-visible:outline-midnight",
  secondary:
    "border border-midnight/10 bg-white/76 text-midnight backdrop-blur-md shadow-glass hover:-translate-y-1 hover:border-champagne/55 hover:bg-white/95 hover:shadow-[0_14px_38px_rgba(7,26,47,0.1),0_0_0_1px_rgba(110,167,191,0.22),0_0_26px_rgba(110,167,191,0.12)] focus-visible:outline-midnight",
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
