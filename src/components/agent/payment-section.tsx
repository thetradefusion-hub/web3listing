"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadPaymentProof, acceptQuotation } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Payment, Quotation } from "@/types/database";
import { AgentPanel, AgentPanelBody, AgentPanelHeader } from "@/components/agent/ui";

export function PaymentSection({ payment, orderId }: { payment: Payment; orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [proofUrl, setProofUrl] = useState("");

  async function handleUpload() {
    if (!proofUrl) {
      toast.error("Please enter proof URL");
      return;
    }
    setLoading(true);
    const result = await uploadPaymentProof(payment.id, proofUrl);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Payment proof uploaded");
    router.refresh();
  }

  return (
    <AgentPanel>
      <AgentPanelHeader title="Payment" />
      <AgentPanelBody className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Amount</span>
          <span className="font-semibold text-slate-900">${payment.amount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Status</span>
          <span className="font-medium capitalize text-slate-800">{payment.status.replace(/_/g, " ")}</span>
        </div>
        {payment.payment_instructions && (
          <p className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {payment.payment_instructions}
          </p>
        )}
        {payment.status === "pending" && (
          <div className="space-y-2 pt-2">
            <Label>Payment Proof URL</Label>
            <Input
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="Upload screenshot and paste URL"
              className="rounded-xl"
            />
            <Button
              onClick={handleUpload}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
            >
              {loading ? "Uploading..." : "Submit Payment Proof"}
            </Button>
          </div>
        )}
      </AgentPanelBody>
    </AgentPanel>
  );
}

export function QuotationSection({ quotation }: { quotation: Quotation }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);
    const result = await acceptQuotation(quotation.id);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Quotation accepted");
    router.refresh();
  }

  if (quotation.status === "accepted") return null;

  return (
    <AgentPanel className="border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50">
      <AgentPanelHeader title="Quotation" />
      <AgentPanelBody className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Client Price</span>
          <span className="font-semibold text-slate-900">${quotation.client_price}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Your Commission</span>
          <span className="font-semibold text-emerald-600">${quotation.commission_amount}</span>
        </div>
        {quotation.status === "sent" && (
          <Button
            onClick={handleAccept}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
          >
            Accept Quotation & Proceed to Payment
          </Button>
        )}
      </AgentPanelBody>
    </AgentPanel>
  );
}
