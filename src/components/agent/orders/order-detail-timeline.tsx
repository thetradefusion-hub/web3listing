import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus, OrderStatusHistory } from "@/types/database";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_ORDER: OrderStatus[] = [
  "submitted",
  "under_review",
  "waiting_payment",
  "payment_confirmed",
  "in_progress",
  "third_party_review",
  "completed",
  "delivered",
  "closed",
];

export function OrderDetailTimeline({
  currentStatus,
  history = [],
}: {
  currentStatus: OrderStatus;
  history?: OrderStatusHistory[];
}) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  function getStepDate(status: OrderStatus) {
    const entry = history.find((h) => h.status === status);
    if (!entry) return null;
    return new Date(entry.created_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="relative">
      {STATUS_ORDER.map((status, index) => {
        const isComplete = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === STATUS_ORDER.length - 1;
        const date = getStepDate(status);

        return (
          <div key={status} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && (
              <div
                className={cn(
                  "absolute left-[13px] top-7 h-[calc(100%-12px)] w-0.5",
                  isComplete && index < currentIndex ? "bg-[#10B981]" : "bg-[#E2E8F0]"
                )}
                aria-hidden
              />
            )}

            <span
              className={cn(
                "relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
                isCurrent
                  ? "border-[#635BFF] bg-[#EEF2FF] text-[#635BFF] shadow-sm shadow-indigo-100"
                  : isComplete
                    ? "border-[#10B981] bg-[#ECFDF5] text-[#059669]"
                    : "border-[#E2E8F0] bg-white text-[#CBD5E1]"
              )}
            >
              {isComplete ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                <Circle className="h-2 w-2 fill-current" />
              )}
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <p
                className={cn(
                  "text-sm font-semibold leading-tight",
                  isCurrent
                    ? "text-[#635BFF]"
                    : isComplete
                      ? "text-[#0F172A]"
                      : "text-[#94A3B8]"
                )}
              >
                {ORDER_STATUS_LABELS[status]}
              </p>
              {date && (
                <p className="mt-0.5 text-[11px] text-[#94A3B8]">{date}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
