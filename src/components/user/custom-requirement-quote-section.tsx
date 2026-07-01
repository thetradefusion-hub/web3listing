"use client";

import { useRouter } from "next/navigation";
import { respondToCustomRequirementQuote } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CustomRequirement } from "@/types/database";

export function CustomRequirementQuoteSection({ requirement }: { requirement: CustomRequirement }) {
  const router = useRouter();

  if (requirement.quote_status !== "sent" || requirement.quoted_price == null) return null;

  async function handleResponse(response: "accepted" | "rejected") {
    const result = await respondToCustomRequirementQuote(requirement.id, response);
    if (result.error) toast.error(result.error);
    else {
      toast.success(response === "accepted" ? "Quote accepted" : "Quote declined");
      router.refresh();
    }
  }

  return (
    <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-card to-chart-2/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Quotation from our team</p>
      <p className="mt-2 text-3xl font-bold text-foreground">${Number(requirement.quoted_price).toFixed(2)}</p>
      {requirement.quote_notes ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{requirement.quote_notes}</p>
      ) : null}
      {requirement.quoted_at ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Sent {new Date(requirement.quoted_at).toLocaleDateString()}
        </p>
      ) : null}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button className="flex-1 rounded-xl font-semibold" onClick={() => handleResponse("accepted")}>
          Accept quote
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-xl"
          onClick={() => handleResponse("rejected")}
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
