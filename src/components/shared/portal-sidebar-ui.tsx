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
}: {
  children: ReactNode;
  className?: string;
  collapsed?: boolean;
  collapsible?: boolean;
}) {
  return (
    <aside
      className={cn(
        "portal-sidebar relative flex h-full shrink-0 flex-col overflow-hidden border-r border-white/[0.06] bg-[#0B1020] text-white transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#635BFF]/8 via-transparent to-transparent" />
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
      className="relative hidden shrink-0 items-center justify-center border-t border-white/[0.06] py-3 text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300 md:flex"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
    </button>
  );
}

export function PortalSidebarBrand({
  href,
  badge,
  collapsed,
}: {
  href: string;
  badge: string;
  collapsed?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-b border-white/[0.06]",
        collapsed ? "flex justify-center px-2 py-4" : "px-5 py-5"
      )}
    >
      <Link href={href} onClick={(e) => e.stopPropagation()} className="group block">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF007A] via-[#7C3AED] to-[#0070F3] text-sm font-bold text-white">
                  T
                </span>
              }
            />
            <TooltipContent side="right">TokenWeb3Listing</TooltipContent>
          </Tooltip>
        ) : (
          <>
            <BrandLogo size="sm" className="max-w-[200px]" />
            <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
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
        "flex-1 overflow-y-auto py-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]",
        collapsed ? "space-y-2 px-2" : "space-y-6 px-3",
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
        <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
      )}
      <div className={cn("flex flex-col", collapsed ? "gap-1" : "gap-1")}>{children}</div>
    </div>
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
  const link = (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center rounded-full text-[13px] font-medium transition-all duration-200",
        collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2",
        isActive
          ? "border border-[rgba(99,91,255,0.2)] bg-[rgba(99,91,255,0.15)] text-white shadow-[0_0_20px_rgba(99,91,255,0.35)]"
          : "border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          isActive ? "text-[#A5A0FF]" : "text-slate-500 group-hover:text-slate-300"
        )}
        strokeWidth={isActive ? 2.25 : 2}
      />
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={href}
              onClick={onClick}
              className={cn(
                "group flex items-center justify-center rounded-full px-2 py-2.5 text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "border border-[rgba(99,91,255,0.2)] bg-[rgba(99,91,255,0.15)] text-white shadow-[0_0_20px_rgba(99,91,255,0.35)]"
                  : "border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-[#A5A0FF]" : "text-slate-500 group-hover:text-slate-300"
                )}
                strokeWidth={isActive ? 2.25 : 2}
              />
            </Link>
          }
        />
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
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
    <div className={cn("border-t border-white/[0.06]", collapsed ? "p-2" : "p-4", className)}>
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
        "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4",
        className
      )}
    >
      {children}
    </div>
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
        "flex w-full items-center rounded-xl text-[13px] font-medium text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300",
        collapsed ? "justify-center px-2 py-2.5" : "gap-2 px-3 py-2.5"
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" />
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
              className="flex w-full items-center justify-center rounded-xl px-2 py-2.5 text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300"
            >
              <LogOut className="h-4 w-4 shrink-0" />
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
            className="flex w-full items-center justify-center rounded-xl border border-[rgba(99,91,255,0.25)] bg-[rgba(99,91,255,0.12)] py-2.5 text-white transition hover:bg-[rgba(99,91,255,0.18)]"
          >
            <Icon className="h-4 w-4" />
          </Link>
        }
      />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
