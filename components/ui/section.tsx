import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import { Container } from "./container";

type SectionProps = HTMLAttributes<HTMLElement> & {
  surface?: "default" | "muted";
};

export function Section({
  className,
  children,
  surface = "default",
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-16 md:py-20 lg:py-24",
        surface === "muted" && "bg-oat/60 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}
