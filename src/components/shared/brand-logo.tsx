import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

const sizeMap = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
} as const;

type BrandLogoProps = {
  size?: keyof typeof sizeMap;
  className?: string;
  href?: string;
  priority?: boolean;
};

export function BrandLogo({
  size = "md",
  className,
  href,
}: BrandLogoProps) {
  const logo = (
    <span
      className={cn(
        "inline-block bg-gradient-to-r from-[#FF007A] via-[#7C3AED] to-[#0070F3] bg-clip-text font-semibold tracking-tight text-transparent",
        sizeMap[size],
        className
      )}
      aria-label={SITE_NAME}
    >
      TokenWeb3Listing
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90"
      >
        {logo}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{logo}</span>;
}
