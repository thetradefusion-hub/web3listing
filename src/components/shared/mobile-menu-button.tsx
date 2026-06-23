"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileNav } from "@/components/shared/mobile-nav-context";

export function MobileMenuButton({ className }: { className?: string }) {
  const { open, setOpen } = useMobileNav();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setOpen(!open)}
      className={className}
      aria-label={open ? "Close menu" : "Open menu"}
    >
      {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );
}
