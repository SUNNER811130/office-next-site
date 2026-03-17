import Link from "next/link";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "bg-ink text-paper shadow-[0_18px_40px_rgba(17,17,17,0.16)] hover:-translate-y-0.5 hover:bg-[#1f1f1f] focus-visible:outline-ink",
  secondary:
    "border border-ink/12 bg-white/78 text-ink shadow-[0_10px_24px_rgba(17,17,17,0.06)] hover:-translate-y-0.5 hover:border-ink/20 hover:bg-white focus-visible:outline-ink",
  ghost: "text-ink hover:bg-ink/5 focus-visible:outline-ink"
} as const;

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-medium tracking-[0.18em] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

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
