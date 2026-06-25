"use client";

import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortalShell } from "@/components/shared/mobile-nav-context";
import { cn } from "@/lib/utils";

export function SidebarToggleButton({ className }: { className?: string }) {
  const { toggleCollapsed } = usePortalShell();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleCollapsed}
      className={cn(
        "hidden h-9 w-9 shrink-0 rounded-xl border border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground md:inline-flex",
        className
      )}
      aria-label="Toggle sidebar"
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  );
}
