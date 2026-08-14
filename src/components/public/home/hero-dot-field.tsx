"use client";

import { useMemo } from "react";
import DotField from "@/components/ui/dot-field";
import { useTheme } from "@/components/shared/theme-provider";

export function HeroDotField() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const dotProps = useMemo(
    () =>
      isDark
        ? {
            dotRadius: 1.5,
            dotSpacing: 14,
            gradientFrom: "rgba(139, 44, 245, 0.35)",
            gradientTo: "rgba(163, 230, 53, 0.2)",
            glowColor: "#120F17",
          }
        : {
            dotRadius: 1.5,
            dotSpacing: 14,
            gradientFrom: "rgba(139, 44, 245, 0.42)",
            gradientTo: "rgba(139, 44, 245, 0.28)",
            glowColor: "rgba(139, 44, 245, 0.1)",
          },
    [isDark]
  );

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <DotField
        {...dotProps}
        bulgeStrength={isDark ? 67 : 60}
        glowRadius={160}
        sparkle={false}
        waveAmplitude={0}
      />
    </div>
  );
}
