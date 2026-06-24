"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuotation } from "@/lib/actions";
import { calculateQuotation } from "@/lib/commission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function QuotationBuilder({
  orderId,
  commissionType,
  commissionValue,
}: {
  orderId: string;
  commissionType: "fixed" | "percentage";
  commissionValue: number;
}) {
  const router = useRouter();
  const [vendorCost, setVendorCost] = useState(0);
  const [margin, setMargin] = useState(0);
  const [loading, setLoading] = useState(false);

  const calc = calculateQuotation(vendorCost, margin, commissionType, commissionValue);

  async function handleSubmit() {
    setLoading(true);
    const result = await createQuotation({ order_id: orderId, vendor_cost: vendorCost, company_margin: margin });
    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Quotation sent");
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Vendor Cost ($)</Label>
          <Input type="number" value={vendorCost} onChange={(e) => setVendorCost(Number(e.target.value))} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Company Margin ($)</Label>
          <Input type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="rounded-xl" />
        </div>
      </div>
      <div className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-sm">
        <div className="flex justify-between"><span className="text-slate-500">Client Price</span><span className="font-semibold text-slate-900">${calc.client_price.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Partner Commission</span><span className="font-semibold text-emerald-600">${calc.commission_amount.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Company Profit</span><span className="font-semibold text-violet-600">${calc.company_profit.toFixed(2)}</span></div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={loading || calc.client_price <= 0}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
      >
        {loading ? "Sending..." : "Generate & Send Quotation"}
      </Button>
    </div>
  );
}
