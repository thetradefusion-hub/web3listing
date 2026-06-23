import { formatCurrency } from "@/lib/commission";
import { PRICING_CTA, PRICING_PACKAGE, getServicePriceHeadline } from "@/lib/pricing";
import { PricingBadge } from "@/components/shared/pricing-badge";
import type { PricingModel, Service } from "@/types/database";
import type { ReactNode } from "react";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F1F5F9] py-2.5 text-sm last:border-0">
      <span className="text-[#64748B]">{label}</span>
      <span className="text-right font-medium text-[#0F172A]">{value}</span>
    </div>
  );
}

export function ServicePricingCard({
  service,
  children,
  className,
}: {
  service: Pick<
    Service,
    | "pricing_model"
    | "price"
    | "service_fee"
    | "estimated_tat"
    | "payment_terms"
    | "third_party_fee_note"
    | "requires_third_party_ack"
  >;
  children?: ReactNode;
  className?: string;
}) {
  const model = service.pricing_model as PricingModel;

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <PricingBadge model={model} />
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#94A3B8]">
          {PRICING_PACKAGE[model]}
        </span>
      </div>

      <p className="text-[28px] font-bold leading-none tracking-tight text-[#0F172A]">
        {getServicePriceHeadline(service)}
      </p>

      <div className="mt-5 space-y-0">
        {model === "fixed" && (
          <>
            <DetailRow label="Price" value={formatCurrency(service.price || 0)} />
            <DetailRow label="TAT" value={service.estimated_tat || "—"} />
            <DetailRow label="Payment" value={service.payment_terms || "100% Advance"} />
          </>
        )}

        {model === "quote" && (
          <>
            <DetailRow label="Price" value="Custom Quote" />
            <DetailRow label="TAT" value={service.estimated_tat || "Depends on Scope"} />
            <DetailRow label="Payment" value={service.payment_terms || "100% Advance"} />
          </>
        )}

        {model === "enterprise" && (
          <>
            <DetailRow
              label="Service Fee"
              value={formatCurrency(service.service_fee || 0)}
            />
            <DetailRow
              label="Third Party Fee"
              value={service.third_party_fee_note || "As Per Provider"}
            />
            <DetailRow label="Approval" value="Not Guaranteed" />
            <DetailRow
              label="TAT"
              value={service.estimated_tat || "Depends on Third Party"}
            />
          </>
        )}
      </div>

      {model === "quote" && (
        <p className="mt-4 rounded-xl bg-[#FFFBEB] px-3 py-2 text-xs leading-relaxed text-[#92400E]">
          Submit requirements first. Admin will review, get vendor pricing, add margin, and send you a quote.
        </p>
      )}

      {model === "enterprise" && (
        <p className="mt-4 rounded-xl bg-[#FEF2F2] px-3 py-2 text-xs leading-relaxed text-[#991B1B]">
          Consultation required. Third-party approval is not guaranteed. Service fee covers platform coordination only.
        </p>
      )}

      {children && <div className="mt-5">{children}</div>}

      {!children && (
        <p className="mt-4 text-center text-xs text-[#94A3B8]">
          CTA: {PRICING_CTA[model]}
        </p>
      )}
    </div>
  );
}
