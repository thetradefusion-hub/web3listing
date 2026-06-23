"use client";

import { useRouter } from "next/navigation";
import { updateLeadStatus } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Lead, LeadStatus } from "@/types/database";

export function LeadActions({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const router = useRouter();
  const statuses: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];

  return (
    <div className="flex gap-1">
      {statuses.filter((s) => s !== status).map((s) => (
        <Button key={s} size="sm" variant="outline" onClick={async () => {
          await updateLeadStatus(leadId, s);
          toast.success(`Lead marked as ${s}`);
          router.refresh();
        }}>
          {s}
        </Button>
      ))}
    </div>
  );
}
