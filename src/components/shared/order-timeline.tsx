import { ORDER_STATUS_LABELS } from "@/lib/constants";
import type { OrderStatus } from "@/types/database";
import { CheckCircle2, Circle } from "lucide-react";

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

export function OrderTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="space-y-3">
      {STATUS_ORDER.map((status, index) => {
        const isComplete = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={status} className="flex items-center gap-3">
            {isComplete ? (
              <CheckCircle2 className={`h-5 w-5 shrink-0 ${isCurrent ? "text-cyan-400" : "text-emerald-500"}`} />
            ) : (
              <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
            )}
            <span className={`text-sm ${isCurrent ? "font-medium text-cyan-400" : isComplete ? "text-foreground" : "text-muted-foreground"}`}>
              {ORDER_STATUS_LABELS[status]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
