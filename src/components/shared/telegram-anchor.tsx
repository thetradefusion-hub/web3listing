import { buildTelegramLink } from "@/lib/telegram";
import { cn } from "@/lib/utils";

export function TelegramAnchor({
  href,
  className,
  children,
  ...props
}: React.ComponentProps<"a"> & { href?: string | null }) {
  return (
    <a
      href={buildTelegramLink(href)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
      {...props}
    >
      {children}
    </a>
  );
}
