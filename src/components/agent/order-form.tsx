"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PRICING_CTA } from "@/lib/pricing";
import type { Service, Project } from "@/types/database";

export function OrderForm({
  service,
  projects,
  defaultProjectId,
}: {
  service: Service;
  projects: Project[];
  defaultProjectId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(defaultProjectId || "");
  const [requirements, setRequirements] = useState("");
  const [thirdPartyAck, setThirdPartyAck] = useState(false);

  const needsRequirements = service.pricing_model === "quote" || service.pricing_model === "enterprise";

  async function handleOrder() {
    if (!projectId) {
      toast.error("Please select a project");
      return;
    }
    if (needsRequirements && !requirements.trim()) {
      toast.error("Please submit your requirements before continuing");
      return;
    }
    if (service.requires_third_party_ack && !thirdPartyAck) {
      toast.error("You must acknowledge third-party approval terms");
      return;
    }

    setLoading(true);
    const result = await createOrder({
      project_id: projectId,
      service_id: service.id,
      requirements: requirements.trim() || undefined,
      third_party_ack: thirdPartyAck,
    });
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(
      service.pricing_model === "fixed"
        ? "Order created — proceed to payment"
        : service.pricing_model === "quote"
          ? "Quote request submitted for admin review"
          : "Consultation request submitted"
    );
    router.push(`/agent/orders/${result.order?.id}`);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Project *</Label>
        <Select value={projectId} onValueChange={(v) => setProjectId(v || "")}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Choose a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.project_name} ({p.token_symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {needsRequirements && (
        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements / Scope *</Label>
          <Textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder={
              service.pricing_model === "quote"
                ? "Describe scope, budget range, timeline, and any vendor preferences..."
                : "Describe your project, goals, and consultation needs..."
            }
            rows={4}
            className="rounded-xl"
          />
        </div>
      )}

      {service.pricing_model === "fixed" && (
        <div className="space-y-2">
          <Label htmlFor="requirements">Additional Notes (optional)</Label>
          <Textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Any specific instructions for this order..."
            rows={3}
            className="rounded-xl"
          />
        </div>
      )}

      {service.requires_third_party_ack && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3">
          <Checkbox
            id="ack"
            checked={thirdPartyAck}
            onCheckedChange={(v) => setThirdPartyAck(!!v)}
            className="mt-0.5"
          />
          <label htmlFor="ack" className="text-sm leading-relaxed text-red-900">
            I understand approval depends on third-party review and is not guaranteed.
          </label>
        </div>
      )}

      <Button
        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:opacity-90"
        onClick={handleOrder}
        disabled={loading || (service.requires_third_party_ack && !thirdPartyAck)}
      >
        {loading ? "Processing..." : PRICING_CTA[service.pricing_model]}
      </Button>
    </div>
  );
}
