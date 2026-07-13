import Image from "next/image";
import Link from "next/link";
import { BRAND_LOGO_DARK_PATH, BRAND_LOGO_LIGHT_PATH, SITE_NAME } from "@/lib/constants";
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

function BrandLogoImages({
  size = "md",
  className,
  priority = false,
}: Pick<BrandLogoProps, "size" | "className" | "priority">) {
  const imageClass = cn(
    "w-auto object-contain object-left",
    sizeMap[size],
    maxWidthMap[size],
    className
  );

  return (
    <>
      {/* Only boost the light-mode logo on the critical path; dark loads lazily. */}
      <Image
        src={BRAND_LOGO_LIGHT_PATH}
        alt={SITE_NAME}
        width={240}
        height={48}
        priority={priority}
        sizes="(max-width: 640px) 160px, 200px"
        className={cn(imageClass, "dark:hidden")}
      />
      <Image
        src={BRAND_LOGO_DARK_PATH}
        alt=""
        aria-hidden
        width={240}
        height={48}
        priority={false}
        loading="lazy"
        sizes="(max-width: 640px) 160px, 200px"
        className={cn(imageClass, "hidden dark:block")}
      />
    </>
  );
}

export function BrandLogo({
  size = "md",
  className,
  href,
  priority = false,
}: BrandLogoProps) {
  const logo = <BrandLogoImages size={size} className={className} priority={priority} />;

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

export function SidebarBrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={BRAND_LOGO_DARK_PATH}
      alt={SITE_NAME}
      width={220}
      height={48}
      priority={priority}
      sizes="210px"
      className={cn("h-9 w-auto max-w-[210px] object-contain object-left", className)}
    />
  );
}
