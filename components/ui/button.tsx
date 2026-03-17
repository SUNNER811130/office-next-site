import Link from "next/link";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "bg-ink text-paper hover:-translate-y-0.5 hover:bg-[#222222] focus-visible:outline-ink",
  secondary:
    "border border-ink/15 bg-white/70 text-ink hover:-translate-y-0.5 hover:border-ink/40 hover:bg-white focus-visible:outline-ink",
  ghost: "text-ink hover:bg-ink/5 focus-visible:outline-ink"
} as const;

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium tracking-[0.14em] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

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
