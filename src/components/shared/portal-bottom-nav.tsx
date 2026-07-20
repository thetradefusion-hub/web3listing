"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { MoreHorizontal, type LucideIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type PortalBottomNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

function parseHref(href: string) {
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  return { path, params };
}

function isItemActive(
  pathname: string,
  searchParams: URLSearchParams,
  href: string,
  exact?: boolean
) {
  const { path, params } = parseHref(href);
  if (exact) {
    if (pathname !== path) return false;
    if ([...params.keys()].length === 0) return true;
    return [...params.entries()].every(([k, v]) => searchParams.get(k) === v);
  }
  if (pathname !== path && !pathname.startsWith(`${path}/`)) return false;
  if ([...params.keys()].length === 0) return true;
  return [...params.entries()].every(([k, v]) => searchParams.get(k) === v);
}

export function PortalBottomNav({
  items,
  moreItems = [],
}: {
  items: PortalBottomNavItem[];
  moreItems?: PortalBottomNavItem[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const moreActive = moreItems.some((item) =>
    isItemActive(pathname, searchParams, item.href, item.exact)
  );

  return (
    <>
      <nav
        className="portal-bottom-nav fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-card/95 backdrop-blur-xl md:hidden"
        aria-label="Primary"
      >
        <ul className="mx-auto flex h-14 max-w-lg items-stretch justify-between px-1">
          {items.map((item) => {
            const active = isItemActive(pathname, searchParams, item.href, item.exact);
            const Icon = item.icon;
            return (
              <li key={item.href + item.label} className="flex min-w-0 flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-semibold transition-colors",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-xl transition-colors",
                      active && "bg-primary/12"
                    )}
                  >
                    <Icon className="size-[1.15rem]" strokeWidth={active ? 2.35 : 2} />
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}

          {moreItems.length > 0 ? (
            <li className="flex min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-semibold transition-colors",
                  moreActive || moreOpen
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-expanded={moreOpen}
                aria-haspopup="dialog"
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-xl transition-colors",
                    (moreActive || moreOpen) && "bg-primary/12"
                  )}
                >
                  <MoreHorizontal
                    className="size-[1.15rem]"
                    strokeWidth={moreActive || moreOpen ? 2.35 : 2}
                  />
                </span>
                <span className="truncate">More</span>
              </button>
            </li>
          ) : null}
        </ul>
      </nav>

      {moreItems.length > 0 ? (
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetContent
            side="bottom"
            showCloseButton
            className="portal-more-sheet gap-0 rounded-t-2xl border-border/70 bg-card p-0 pb-[env(safe-area-inset-bottom)] md:hidden"
          >
            <SheetHeader className="border-b border-border/60 px-4 py-3 text-left">
              <SheetTitle className="text-base font-bold">More</SheetTitle>
            </SheetHeader>
            <ul className="grid gap-1 p-3">
              {moreItems.map((item) => {
                const active = isItemActive(pathname, searchParams, item.href, item.exact);
                const Icon = item.icon;
                return (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted/60"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-xl",
                          active ? "bg-primary/15 text-primary" : "bg-muted/50 text-muted-foreground"
                        )}
                      >
                        <Icon className="size-4" strokeWidth={2} />
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </SheetContent>
        </Sheet>
      ) : null}
    </>
  );
}
