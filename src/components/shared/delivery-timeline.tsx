import { Check, CheckCircle2 } from "lucide-react";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus, OrderStatusHistory } from "@/types/database";
import { cn } from "@/lib/utils";

const DELIVERY_STEPS: { label: string; shortLabel: string; statuses: OrderStatus[] }[] = [
  { label: "Order Created", shortLabel: "Created", statuses: ["submitted", "under_review"] },
  { label: "Payment Confirmed", shortLabel: "Payment", statuses: ["waiting_payment", "payment_confirmed"] },
  { label: "Work Started", shortLabel: "Started", statuses: ["in_progress"] },
  { label: "Application Submitted", shortLabel: "Submitted", statuses: ["third_party_review"] },
  { label: "Approved", shortLabel: "Approved", statuses: ["completed"] },
  { label: "Completed", shortLabel: "Done", statuses: ["delivered", "closed"] },
];

function formatStepDate(iso: string, compact = false) {
  const d = new Date(iso);
  if (compact) {
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  }
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DeliveryTimeline({
  history,
  orderCreatedAt,
  paymentVerifiedAt,
  startedAt,
  completedAt,
  currentStatus,
}: {
  history: OrderStatusHistory[];
  orderCreatedAt: string;
  paymentVerifiedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  currentStatus: OrderStatus;
}) {
  const statusIndex = DELIVERY_STEPS.findIndex((step) =>
    step.statuses.includes(currentStatus)
  );
  const activeIndex = statusIndex >= 0 ? statusIndex : DELIVERY_STEPS.length - 1;

  function getStepDate(stepIndex: number): string | null {
    const step = DELIVERY_STEPS[stepIndex];
    const match = history.find((h) => step.statuses.includes(h.status));
    if (match) return match.created_at;
    if (stepIndex === 0) return orderCreatedAt;
    if (stepIndex === 1 && paymentVerifiedAt) return paymentVerifiedAt;
    if (stepIndex === 2 && startedAt) return startedAt;
    if (stepIndex >= 4 && completedAt) return completedAt;
    return null;
  }

  return (
    <div>
      {/* Mobile & tablet — vertical */}
      <div className="space-y-0 lg:hidden">
        {DELIVERY_STEPS.map((step, index) => {
          const done = index <= activeIndex;
          const isCurrent = index === activeIndex;
          const isLast = index === DELIVERY_STEPS.length - 1;
          const date = getStepDate(index);

          return (
            <div key={step.label} className="relative flex gap-3 pb-4 last:pb-0">
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-[13px] top-7 h-[calc(100%-8px)] w-0.5",
                    done && index < activeIndex ? "bg-[#10B981]" : "bg-[#E2E8F0]"
                  )}
                  aria-hidden
                />
              )}
              <span
                className={cn(
                  "relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
                  isCurrent
                    ? "border-[#635BFF] bg-[#EEF2FF] text-[#635BFF]"
                    : done
                      ? "border-[#10B981] bg-[#ECFDF5] text-[#059669]"
                      : "border-[#E2E8F0] bg-white text-[#CBD5E1]"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isCurrent ? "text-[#635BFF]" : done ? "text-[#0F172A]" : "text-[#94A3B8]"
                  )}
                >
                  {step.label}
                </p>
                {date && (
                  <p className="mt-0.5 text-[11px] text-[#94A3B8]">{formatStepDate(date)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Laptop+ — horizontal, fits container width */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-6 gap-1 xl:gap-2">
          {DELIVERY_STEPS.map((step, index) => {
            const done = index <= activeIndex;
            const date = getStepDate(index);
            return (
              <div key={step.label} className="relative min-w-0 text-center">
                <div className="flex items-center">
                  {index > 0 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1",
                        index <= activeIndex ? "bg-[#10B981]" : "bg-[#E2E8F0]"
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "mx-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 xl:h-8 xl:w-8",
                      done
                        ? "border-[#10B981] bg-[#ECFDF5] text-[#059669]"
                        : "border-[#E2E8F0] bg-white text-[#CBD5E1]"
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#CBD5E1]" />
                    )}
                  </span>
                  {index < DELIVERY_STEPS.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1",
                        index < activeIndex ? "bg-[#10B981]" : "bg-[#E2E8F0]"
                      )}
                    />
                  )}
                </div>
                <p
                  className={cn(
                    "mt-2 text-[10px] font-semibold leading-tight xl:text-[11px]",
                    done ? "text-[#0F172A]" : "text-[#94A3B8]"
                  )}
                >
                  <span className="xl:hidden">{step.shortLabel}</span>
                  <span className="hidden xl:inline">{step.label}</span>
                </p>
                {date && (
                  <p className="mt-0.5 text-[9px] leading-tight text-[#94A3B8] xl:text-[10px]">
                    <span className="lg:inline xl:hidden">{formatStepDate(date, true)}</span>
                    <span className="hidden xl:inline">{formatStepDate(date)}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-[#94A3B8]">
        Current status:{" "}
        <span className="font-medium text-[#635BFF]">
          {ORDER_STATUS_LABELS[currentStatus] || currentStatus}
        </span>
      </p>
    </div>
  );
}
