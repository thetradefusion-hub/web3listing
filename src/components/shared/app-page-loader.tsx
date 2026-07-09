import Image from "next/image";
import { cn } from "@/lib/utils";

type AppPageLoaderProps = {
  /** Full-screen overlay during client-side navigation */
  variant?: "overlay" | "page" | "inline";
  label?: string;
  className?: string;
};

export function AppPageLoader({
  variant = "page",
  label = "Loading",
  className,
}: AppPageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        variant === "overlay" &&
          "pointer-events-auto fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm",
        variant === "page" && "min-h-screen w-full",
        variant === "inline" && "min-h-[min(70vh,32rem)] w-full flex-1 py-16",
        className
      )}
    >
      <div className="relative flex size-24 items-center justify-center">
        <div className="app-loader-ring absolute inset-0 rounded-full" aria-hidden />
        <div className="app-loader-ring app-loader-ring--reverse absolute inset-1.5 rounded-full opacity-70" aria-hidden />
        <div className="relative flex size-14 items-center justify-center rounded-2xl bg-card/90 shadow-lg ring-1 ring-border/60">
          <Image
            src="/web3_exact_colors.svg"
            alt=""
            width={40}
            height={28}
            className="h-7 w-auto object-contain"
            priority
          />
        </div>
      </div>
      {label ? (
        <p className="text-sm font-medium tracking-wide text-muted-foreground">{label}</p>
      ) : null}
    </div>
  );
}
