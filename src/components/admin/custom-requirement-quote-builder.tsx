"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendCustomRequirementQuote } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function CustomRequirementQuoteBuilder({
  requirementId,
  existingPrice,
  existingNotes,
}: {
  requirementId: string;
  existingPrice?: number | null;
  existingNotes?: string | null;
}) {
  const router = useRouter();
  const [quotedPrice, setQuotedPrice] = useState(existingPrice ?? 0);
  const [quoteNotes, setQuoteNotes] = useState(existingNotes ?? "");
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (quotedPrice <= 0) {
      toast.error("Enter a valid quote price");
      return;
    }
    setLoading(true);
    const result = await sendCustomRequirementQuote({
      requirement_id: requirementId,
      quoted_price: quotedPrice,
      quote_notes: quoteNotes || undefined,
      admin_notes: adminNotes || undefined,
    });
    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Quotation sent to user");
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Client price (USD)</Label>
        <Input
          type="number"
          min={0}
          step="0.01"
          value={quotedPrice}
          onChange={(e) => setQuotedPrice(Number(e.target.value))}
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label>Quote notes (visible to user)</Label>
        <Textarea
          value={quoteNotes}
          onChange={(e) => setQuoteNotes(e.target.value)}
          rows={4}
          placeholder="Scope, deliverables, payment terms..."
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label>Internal admin notes</Label>
        <Textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={2}
          placeholder="Vendor cost, margin notes (internal only)"
          className="rounded-xl"
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={loading || quotedPrice <= 0}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
      >
        {loading ? "Sending..." : "Send quotation to user"}
      </Button>
    </div>
  );
}
