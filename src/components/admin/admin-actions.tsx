"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus, verifyPayment, uploadDeliverable, reviewKyc, reviewProject, processWithdrawal } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus } from "@/types/database";

export function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState("");

  async function handleUpdate() {
    await updateOrderStatus(orderId, status, notes);
    toast.success("Status updated");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <Select value={status} onValueChange={(v) => v && setStatus(v as OrderStatus)}>
        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
        <SelectContent>
          {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
            <SelectItem key={k} value={k}>{v}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Textarea placeholder="Progress notes..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="rounded-xl" />
      <Button onClick={handleUpdate} size="sm" className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90">
        Update Status
      </Button>
    </div>
  );
}

export function PaymentVerifier({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <Button size="sm" className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" onClick={async () => { await verifyPayment(paymentId, true); toast.success("Payment confirmed"); router.refresh(); }}>
        Confirm Payment
      </Button>
      <Button size="sm" variant="destructive" className="rounded-xl" onClick={async () => { await verifyPayment(paymentId, false); toast.error("Payment rejected"); router.refresh(); }}>
        Reject
      </Button>
    </div>
  );
}

export function DeliverableUploader({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [link, setLink] = useState("");

  async function handleUpload() {
    if (!title) { toast.error("Title required"); return; }
    const result = await uploadDeliverable({ order_id: orderId, title, file_url: fileUrl, external_link: link });
    if (result.error) toast.error(result.error);
    else { toast.success("Deliverable uploaded"); router.refresh(); }
  }

  return (
    <div className="space-y-3">
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" />
      <Input placeholder="File URL" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} className="rounded-xl" />
      <Input placeholder="External Link" value={link} onChange={(e) => setLink(e.target.value)} className="rounded-xl" />
      <Button size="sm" onClick={handleUpload} className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90">
        Upload
      </Button>
    </div>
  );
}

export function KycReviewer({ userId }: { userId: string }) {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <Button size="sm" className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" onClick={async () => { await reviewKyc(userId, "approved"); toast.success("KYC approved"); router.refresh(); }}>Approve</Button>
      <Button size="sm" variant="destructive" className="rounded-xl" onClick={async () => { await reviewKyc(userId, "rejected", "Documents insufficient"); toast.error("KYC rejected"); router.refresh(); }}>Reject</Button>
    </div>
  );
}

export function ProjectReviewer({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [showReject, setShowReject] = useState(false);

  async function handleApprove() {
    setLoading(true);
    const result = await reviewProject(projectId, "approved");
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Project approved");
    router.refresh();
  }

  async function handleReject() {
    setLoading(true);
    const result = await reviewProject(projectId, "rejected", rejectNotes.trim() || undefined);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Project rejected");
    setShowReject(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          disabled={loading}
          className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={handleApprove}
        >
          Approve Project
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={loading}
          className="rounded-xl"
          onClick={() => setShowReject((v) => !v)}
        >
          Reject
        </Button>
      </div>
      {showReject && (
        <div className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-3">
          <Label htmlFor="reject-notes" className="text-red-900">Rejection reason (optional)</Label>
          <Textarea
            id="reject-notes"
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            placeholder="Explain what the agent should fix..."
            rows={2}
            className="rounded-xl bg-white"
          />
          <Button size="sm" variant="destructive" disabled={loading} className="rounded-xl" onClick={handleReject}>
            Confirm Reject
          </Button>
        </div>
      )}
    </div>
  );
}

export function WithdrawalProcessor({ withdrawalId }: { withdrawalId: string }) {
  const router = useRouter();
  const [proofUrl, setProofUrl] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <Input placeholder="Payment proof URL" value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} className="rounded-xl" />
      <div className="flex gap-2">
        <Button size="sm" className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" onClick={async () => { await processWithdrawal(withdrawalId, "paid", proofUrl); toast.success("Marked as paid"); router.refresh(); }}>Mark Paid</Button>
        <Button size="sm" variant="destructive" className="rounded-xl" onClick={async () => { await processWithdrawal(withdrawalId, "rejected", undefined, "Rejected"); router.refresh(); }}>Reject</Button>
      </div>
    </div>
  );
}
