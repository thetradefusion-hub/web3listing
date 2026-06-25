import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function HomeSectionHeader({
  label,
  title,
  description,
  align = "center",
  className,
}: {
  label: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="lh-label lh-accent">{label}</p>
      <h2 className="lh-display mt-3 text-foreground sm:mt-4">{title}</h2>
      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base lg:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
