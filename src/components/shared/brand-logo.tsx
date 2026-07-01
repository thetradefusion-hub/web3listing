"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND_LOGO_PATH, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const sizeMap = {
  xs: "h-5",
  sm: "h-7",
  md: "h-8",
  lg: "h-10",
  xl: "h-12",
} as const;

const maxWidthMap = {
  xs: "max-w-[120px]",
  sm: "max-w-[150px]",
  md: "max-w-[180px]",
  lg: "max-w-[210px]",
  xl: "max-w-[240px]",
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
  priority = false,
}: BrandLogoProps) {
  const logo = (
    <Image
      src={BRAND_LOGO_PATH}
      alt={SITE_NAME}
      width={240}
      height={48}
      priority={priority}
      className={cn(
        "w-auto object-contain object-left",
        sizeMap[size],
        maxWidthMap[size],
        className
      )}
    />
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
