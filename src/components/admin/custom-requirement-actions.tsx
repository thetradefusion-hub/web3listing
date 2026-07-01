"use client";

import { useRouter } from "next/navigation";
import { updateCustomRequirementStatus } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CustomRequirementStatus } from "@/types/database";

const STATUS_FLOW: CustomRequirementStatus[] = [
  "submitted",
  "under_review",
  "quoted",
  "accepted",
  "rejected",
  "closed",
];

export function CustomRequirementActions({
  requirementId,
  status,
}: {
  requirementId: string;
  status: CustomRequirementStatus;
}) {
  const router = useRouter();

  async function setStatus(next: CustomRequirementStatus) {
    const result = await updateCustomRequirementStatus(requirementId, next);
    if (result.error) toast.error(result.error);
    else {
      toast.success(`Marked as ${next.replace("_", " ")}`);
      router.refresh();
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_FLOW.filter((s) => s !== status).map((s) => (
        <Button key={s} size="sm" variant="outline" className="rounded-lg capitalize" onClick={() => setStatus(s)}>
          {s.replace("_", " ")}
        </Button>
      ))}
    </div>
  );
}
