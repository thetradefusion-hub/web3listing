"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { usePortalShell } from "@/components/shared/mobile-nav-context";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PortalSidebarShell({
  children,
  className,
  collapsed,
  collapsible = true,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  collapsed?: boolean;
  collapsible?: boolean;
  variant?: "default" | "partner";
}) {
  return (
    <aside
      className={cn(
        "portal-sidebar relative flex h-full shrink-0 flex-col overflow-hidden border-r border-white/[0.06] bg-[#0B1020] text-white transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]",
        variant === "partner" && "partner-sidebar",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-80" />
      <div
        className="pointer-events-none absolute -right-16 top-24 size-48 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
      {collapsible && <PortalSidebarCollapseToggle collapsed={collapsed} />}
    </aside>
  );
}

function PortalSidebarCollapseToggle({ collapsed }: { collapsed?: boolean }) {
  const { toggleCollapsed } = usePortalShell();

  return (
    <button
      type="button"
      onClick={toggleCollapsed}
      className="relative mx-3 mb-3 hidden shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 text-xs font-medium text-slate-500 transition hover:border-white/10 hover:bg-white/[0.06] hover:text-slate-300 md:flex"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      {!collapsed && <span>Collapse</span>}
    </button>
  );
}

export function PortalSidebarBrand({
  href,
  badge,
  collapsed,
  variant = "default",
}: {
  href: string;
  badge: string;
  collapsed?: boolean;
  variant?: "default" | "partner";
}) {
  return (
    <div
      className={cn(
        "border-b border-white/[0.06]",
        collapsed ? "flex justify-center px-2 py-4" : "px-4 py-4 sm:px-5 sm:py-5"
      )}
    >
      <Link href={href} onClick={(e) => e.stopPropagation()} className="group block min-w-0">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF007A] via-[#7C3AED] to-[#0070F3] text-sm font-bold text-white shadow-lg shadow-primary/20">
                  T
                </span>
              }
            />
            <TooltipContent side="right">TokenWeb3Listing</TooltipContent>
          </Tooltip>
        ) : (
          <>
            <BrandLogo size="sm" className="max-w-[200px]" />
            <span
              className={cn(
                "mt-2.5 inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                variant === "partner"
                  ? "border-primary/25 bg-primary/10 text-primary-foreground/90"
                  : "border-white/10 bg-white/[0.04] text-slate-400"
              )}
            >
              {badge}
            </span>
          </>
        )}
      </Link>
    </div>
  );
}

export function PortalSidebarNav({
  children,
  className,
  collapsed,
}: {
  children: ReactNode;
  className?: string;
  collapsed?: boolean;
}) {
  return (
    <nav
      className={cn(
        "flex-1 overflow-y-auto py-3 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.12)_transparent]",
        collapsed ? "space-y-2 px-2" : "space-y-5 px-2.5",
        className
      )}
    >
      {children}
    </nav>
  );
}

export function PortalSidebarSection({
  label,
  children,
  collapsed,
}: {
  label: string;
  children: ReactNode;
  collapsed?: boolean;
}) {
  return (
    <div>
      {!collapsed && (
        <div className="mb-2 flex items-center gap-2 px-2.5">
          <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function navItemClasses(isActive: boolean, collapsed?: boolean) {
  return cn(
    "group relative flex items-center rounded-xl transition-all duration-200",
    collapsed ? "justify-center p-2" : "gap-2.5 px-2 py-1.5",
    isActive
      ? "bg-primary/12 text-white"
      : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
  );
}

function navIconClasses(isActive: boolean) {
  return cn(
    "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
    isActive
      ? "bg-primary/25 text-white shadow-sm shadow-primary/20"
      : "bg-white/[0.04] text-slate-500 group-hover:bg-white/[0.08] group-hover:text-slate-300"
  );
}

export function PortalSidebarNavItem({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
  collapsed,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}) {
  const content = (
    <>
      {isActive && !collapsed ? (
        <span
          className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary"
          aria-hidden
        />
      ) : null}
      <span className={navIconClasses(isActive)}>
        <Icon className="size-4" strokeWidth={isActive ? 2.25 : 2} />
      </span>
      {!collapsed && <span className="flex-1 truncate text-[13px] font-medium">{label}</span>}
    </>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={href}
              onClick={onClick}
              className={cn(navItemClasses(isActive, true), isActive && "ring-1 ring-primary/25")}
            >
              <span className={navIconClasses(isActive)}>
                <Icon className="size-4" strokeWidth={isActive ? 2.25 : 2} />
              </span>
            </Link>
          }
        />
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={navItemClasses(isActive, false)}>
      {content}
    </Link>
  );
}

export function PortalSidebarFooter({
  children,
  className,
  collapsed,
}: {
  children: ReactNode;
  className?: string;
  collapsed?: boolean;
}) {
  return (
    <div className={cn("border-t border-white/[0.06] bg-black/10", collapsed ? "p-2" : "p-3", className)}>
      {children}
    </div>
  );
}

export function PortalSidebarCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PortalSidebarUserCard({
  name,
  subtitle,
  initials,
  badge,
  collapsed,
}: {
  name: string;
  subtitle?: string;
  initials: string;
  badge?: ReactNode;
  collapsed?: boolean;
}) {
  if (collapsed) return null;

  return (
    <PortalSidebarCard className="mb-2">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-sm">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{name}</p>
          {subtitle ? <p className="truncate text-[11px] text-slate-500">{subtitle}</p> : null}
        </div>
        {badge}
      </div>
    </PortalSidebarCard>
  );
}

export function PortalSidebarQuickAction({
  href,
  label,
  icon: Icon,
  onClick,
  collapsed,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  collapsed?: boolean;
}) {
  if (collapsed) {
    return (
      <PortalSidebarIconAction href={href} label={label} icon={Icon} onClick={onClick} />
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="mb-2 flex items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/15 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/22"
    >
      <Icon className="size-4" strokeWidth={2.25} />
      {label}
    </Link>
  );
}

export function PortalSidebarLogout({
  onLogout,
  collapsed,
}: {
  onLogout: () => void | Promise<void>;
  collapsed?: boolean;
}) {
  const button = (
    <button
      type="button"
      onClick={onLogout}
      className={cn(
        "flex w-full items-center rounded-xl border border-transparent text-[13px] font-medium text-slate-500 transition hover:border-white/[0.06] hover:bg-white/[0.04] hover:text-slate-300",
        collapsed ? "justify-center px-2 py-2.5" : "gap-2.5 px-2.5 py-2"
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
        <LogOut className="size-4 shrink-0" />
      </span>
      {!collapsed && "Sign out"}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center justify-center rounded-xl p-2 text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-white/[0.04]">
                <LogOut className="size-4 shrink-0" />
              </span>
            </button>
          }
        />
        <TooltipContent side="right">Sign out</TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

export function PortalSidebarIconAction({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={href}
            onClick={onClick}
            className="mb-2 flex w-full items-center justify-center rounded-xl border border-primary/25 bg-primary/15 py-2.5 text-white transition hover:bg-primary/22"
          >
            <Icon className="size-4" />
          </Link>
        }
      />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
