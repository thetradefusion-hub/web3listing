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
import { cn } from "@/lib/utils";

export function OrderForm({
  service,
  projects,
  defaultProjectId,
  basePath = "/partner",
  comfortable = false,
}: {
  service: Service;
  projects: Project[];
  defaultProjectId?: string;
  basePath?: string;
  comfortable?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(defaultProjectId || "");
  const [requirements, setRequirements] = useState("");
  const [thirdPartyAck, setThirdPartyAck] = useState(false);

  const needsRequirements = service.pricing_model === "quote" || service.pricing_model === "enterprise";

  function projectLabel(project: Project) {
    return `${project.project_name} (${project.token_symbol})`;
  }

  const selectedProject = projects.find((p) => p.id === projectId);

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
    router.push(`${basePath}/orders/${result.order?.id}`);
  }

  const inputClass = comfortable ? "h-11 rounded-xl" : "h-10 rounded-xl";
  const buttonClass = comfortable ? "h-11 w-full rounded-xl text-sm font-semibold shadow-sm" : "h-10 w-full rounded-xl font-semibold";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Select Project *</Label>
        <Select value={projectId} onValueChange={(v) => setProjectId(v || "")}>
          <SelectTrigger className={cn("w-full", inputClass)}>
            <SelectValue placeholder="Choose a project">
              {selectedProject ? projectLabel(selectedProject) : null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {projectLabel(p)}
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
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
          <Checkbox
            id="ack"
            checked={thirdPartyAck}
            onCheckedChange={(v) => setThirdPartyAck(!!v)}
            className="mt-0.5"
          />
          <label htmlFor="ack" className="text-sm leading-relaxed text-muted-foreground">
            I understand approval depends on third-party review and is not guaranteed.
          </label>
        </div>
      )}

      <Button
        className={buttonClass}
        onClick={handleOrder}
        disabled={loading || (service.requires_third_party_ack && !thirdPartyAck)}
      >
        {loading ? "Processing..." : PRICING_CTA[service.pricing_model]}
      </Button>
    </div>
  );
}
