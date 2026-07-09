"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { uploadPaymentProof, acceptQuotation } from "@/lib/actions";
import { CopyTextButton } from "@/components/partner/projects/copy-text-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { Payment, Quotation } from "@/types/database";
import {
  USDT_PAYMENT_METHODS,
  type UsdtNetwork,
  formatUsdtNetworkLabel,
} from "@/lib/usdt-payment";
import { PartnerPanel, PartnerPanelBody, PartnerPanelHeader } from "@/components/partner/ui";

function isUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export function PaymentSection({ payment, orderId }: { payment: Payment; orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState<UsdtNetwork>("trc20");
  const [txHash, setTxHash] = useState("");

  const selected = USDT_PAYMENT_METHODS.find((m) => m.id === network) ?? USDT_PAYMENT_METHODS[2];
  const submittedHash = payment.proof_url?.trim() || "";
  const submittedNetwork = payment.payment_instructions?.match(/USDT \((BEP20|ERC20|TRC20)\)/i)?.[1];

  async function handleSubmit() {
    const hash = txHash.trim();
    if (!hash) {
      toast.error("Please enter your transaction hash");
      return;
    }
    if (hash.length < 8) {
      toast.error("Transaction hash looks too short");
      return;
    }

    setLoading(true);
    const result = await uploadPaymentProof(payment.id, {
      txHash: hash,
      network,
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Payment hash submitted for verification");
    router.refresh();
  }

  return (
    <PartnerPanel>
      <PartnerPanelHeader title="Payment" />
      <PartnerPanelBody className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-semibold text-foreground">${payment.amount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className="font-medium capitalize text-foreground">{payment.status.replace(/_/g, " ")}</span>
        </div>

        {payment.status === "pending" && (
          <div className="space-y-4 border-t border-border pt-4">
            <div className="rounded-xl border border-chart-3/30 bg-chart-3/10 px-3 py-2.5 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-chart-3" />
                <p>
                  Send exactly <span className="font-semibold text-foreground">${payment.amount} USDT</span> using
                  one of the networks below, then submit your transaction hash.
                </p>
              </div>
            </div>

            <Tabs value={network} onValueChange={(v) => setNetwork(v as UsdtNetwork)}>
              <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-muted/50 p-1">
                {USDT_PAYMENT_METHODS.map((method) => (
                  <TabsTrigger
                    key={method.id}
                    value={method.id}
                    className="rounded-lg px-2 py-2 text-[11px] font-semibold sm:text-xs"
                  >
                    {method.label.replace("USDT ", "")}
                  </TabsTrigger>
                ))}
              </TabsList>

              {USDT_PAYMENT_METHODS.map((method) => (
                <TabsContent key={method.id} value={method.id} className="mt-4 space-y-4">
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <div className="relative size-40 shrink-0 overflow-hidden rounded-xl border border-border bg-white p-2 shadow-sm sm:size-44">
                      <Image
                        src={encodeURI(method.qrImagePath)}
                        alt={`${method.label} QR code`}
                        fill
                        className="object-contain"
                        sizes="176px"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Network</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{method.network}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Wallet address
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                          <code className="min-w-0 flex-1 break-all text-xs font-medium text-foreground">
                            {method.address}
                          </code>
                          <CopyTextButton text={method.address} label={`Copy ${method.label} address`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor={`tx-hash-${orderId}`}>Transaction hash</Label>
              <Input
                id={`tx-hash-${orderId}`}
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Paste your on-chain transaction hash / TX ID"
                className="rounded-xl font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Pay via {selected.label}, then paste the blockchain transaction ID here.
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-xl font-semibold"
            >
              {loading ? "Submitting..." : "Submit Payment Hash"}
            </Button>
          </div>
        )}

        {payment.status === "awaiting_verification" && submittedHash && (
          <div className="space-y-2 rounded-xl border border-chart-3/30 bg-chart-3/10 px-3 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CheckCircle2 className="size-4 text-chart-3" />
              Payment hash submitted — awaiting verification
            </div>
            {submittedNetwork ? (
              <p className="text-xs text-muted-foreground">
                Network: USDT ({submittedNetwork.toUpperCase()})
              </p>
            ) : null}
            <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2">
              <code className="min-w-0 flex-1 break-all text-xs text-foreground">{submittedHash}</code>
              {!isUrl(submittedHash) ? (
                <CopyTextButton text={submittedHash} label="Copy transaction hash" />
              ) : null}
            </div>
          </div>
        )}

        {payment.status === "confirmed" && submittedHash && (
          <div className="rounded-xl border border-chart-2/30 bg-chart-2/10 px-3 py-3 text-sm">
            <p className="font-medium text-foreground">Payment confirmed</p>
            {submittedNetwork ? (
              <p className="mt-1 text-xs text-muted-foreground">
                USDT ({submittedNetwork.toUpperCase()})
              </p>
            ) : null}
            <code className="mt-2 block break-all text-xs text-muted-foreground">{submittedHash}</code>
          </div>
        )}
      </PartnerPanelBody>
    </PartnerPanel>
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
    <PartnerPanel className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-chart-2/5">
      <PartnerPanelHeader title="Quotation" />
      <PartnerPanelBody className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Client Price</span>
          <span className="font-semibold text-foreground">${quotation.client_price}</span>
        </div>
        {quotation.commission_amount > 0 ? (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Your Commission</span>
            <span className="font-semibold text-chart-2">${quotation.commission_amount}</span>
          </div>
        ) : null}
        {quotation.status === "sent" && (
          <Button onClick={handleAccept} disabled={loading} className="w-full rounded-xl font-semibold">
            Accept Quotation & Proceed to Payment
          </Button>
        )}
      </PartnerPanelBody>
    </PartnerPanel>
  );
}
