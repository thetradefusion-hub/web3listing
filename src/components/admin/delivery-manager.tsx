"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addOrderProof,
  deleteOrderProof,
  saveOrderDelivery,
  uploadDeliverable,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Deliverable, Order, OrderProof } from "@/types/database";

export function DeliveryManager({
  order,
  proofs,
  deliverables,
}: {
  order: Order;
  proofs: OrderProof[];
  deliverables: Deliverable[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [teamNotes, setTeamNotes] = useState(order.team_notes || "");
  const [reportUrl, setReportUrl] = useState(order.completion_report_url || "");
  const [actualTat, setActualTat] = useState(order.actual_tat || "");
  const [startedAt, setStartedAt] = useState(
    order.started_at ? order.started_at.slice(0, 16) : ""
  );
  const [completedAt, setCompletedAt] = useState(
    order.completed_at ? order.completed_at.slice(0, 16) : ""
  );

  const [proofTitle, setProofTitle] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [proofType, setProofType] = useState<"screenshot" | "document" | "link">("link");

  const [delTitle, setDelTitle] = useState("");
  const [delFileUrl, setDelFileUrl] = useState("");
  const [delLink, setDelLink] = useState("");
  const [delSize, setDelSize] = useState("");
  const [delType, setDelType] = useState("");

  async function handleSaveDelivery() {
    setSaving(true);
    const result = await saveOrderDelivery({
      order_id: order.id,
      team_notes: teamNotes,
      completion_report_url: reportUrl,
      actual_tat: actualTat,
      started_at: startedAt ? new Date(startedAt).toISOString() : undefined,
      completed_at: completedAt ? new Date(completedAt).toISOString() : undefined,
    });
    setSaving(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Delivery details saved");
      router.refresh();
    }
  }

  async function handleAddProof() {
    if (!proofTitle || !proofUrl) {
      toast.error("Proof title and URL required");
      return;
    }
    const result = await addOrderProof({
      order_id: order.id,
      title: proofTitle,
      url: proofUrl,
      proof_type: proofType,
      sort_order: proofs.length,
    });
    if (result.error) toast.error(result.error);
    else {
      toast.success("Proof added");
      setProofTitle("");
      setProofUrl("");
      router.refresh();
    }
  }

  async function handleAddDeliverable() {
    if (!delTitle) {
      toast.error("Title required");
      return;
    }
    const result = await uploadDeliverable({
      order_id: order.id,
      title: delTitle,
      file_url: delFileUrl || undefined,
      external_link: delLink || undefined,
      file_size: delSize || undefined,
      file_type: delType || undefined,
      sort_order: deliverables.length,
    });
    if (result.error) toast.error(result.error);
    else {
      toast.success("Deliverable added");
      setDelTitle("");
      setDelFileUrl("");
      setDelLink("");
      setDelSize("");
      setDelType("");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] p-4">
        <h4 className="text-sm font-bold text-[#0F172A]">Delivery Metadata</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Actual TAT</Label>
            <Input
              placeholder="e.g. 4 Days"
              value={actualTat}
              onChange={(e) => setActualTat(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Completion Report URL</Label>
            <Input
              placeholder="https://..."
              value={reportUrl}
              onChange={(e) => setReportUrl(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Work Started At</Label>
            <Input
              type="datetime-local"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Completed At</Label>
            <Input
              type="datetime-local"
              value={completedAt}
              onChange={(e) => setCompletedAt(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Notes from Our Team (visible to partner)</Label>
          <Textarea
            rows={4}
            placeholder="Personalized completion message for the partner..."
            value={teamNotes}
            onChange={(e) => setTeamNotes(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <Button
          onClick={handleSaveDelivery}
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white"
        >
          {saving ? "Saving..." : "Save Delivery Details"}
        </Button>
      </div>

      <div className="space-y-3 rounded-xl border border-[#E2E8F0] p-4">
        <h4 className="text-sm font-bold text-[#0F172A]">Proof of Work Items</h4>
        {proofs.length > 0 && (
          <div className="space-y-2">
            {proofs.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="font-medium">{p.title}</span>
                <div className="flex gap-2">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                    Open
                  </a>
                  <button
                    type="button"
                    className="text-red-500 hover:underline"
                    onClick={async () => {
                      await deleteOrderProof(p.id, order.id);
                      toast.success("Proof removed");
                      router.refresh();
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="grid gap-2 sm:grid-cols-2">
          <Input placeholder="Title (e.g. Listing Confirmation)" value={proofTitle} onChange={(e) => setProofTitle(e.target.value)} className="rounded-xl" />
          <Select value={proofType} onValueChange={(v) => v && setProofType(v as typeof proofType)}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="screenshot">Screenshot</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input placeholder="Proof URL" value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} className="rounded-xl" />
        <Button size="sm" onClick={handleAddProof} className="rounded-xl">
          Add Proof Item
        </Button>
      </div>

      <div className="space-y-3 rounded-xl border border-[#E2E8F0] p-4">
        <h4 className="text-sm font-bold text-[#0F172A]">Deliverable Files</h4>
        <Input placeholder="File title" value={delTitle} onChange={(e) => setDelTitle(e.target.value)} className="rounded-xl" />
        <div className="grid gap-2 sm:grid-cols-2">
          <Input placeholder="File URL (PDF/ZIP)" value={delFileUrl} onChange={(e) => setDelFileUrl(e.target.value)} className="rounded-xl" />
          <Input placeholder="External link (optional)" value={delLink} onChange={(e) => setDelLink(e.target.value)} className="rounded-xl" />
          <Input placeholder="File size (e.g. 2.4 MB)" value={delSize} onChange={(e) => setDelSize(e.target.value)} className="rounded-xl" />
          <Input placeholder="File type (PDF, ZIP)" value={delType} onChange={(e) => setDelType(e.target.value)} className="rounded-xl" />
        </div>
        <Button size="sm" onClick={handleAddDeliverable} className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white">
          Add Deliverable
        </Button>
      </div>
    </div>
  );
}
