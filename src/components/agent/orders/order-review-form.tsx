"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { submitOrderReview } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { OrderReview } from "@/types/database";
import { cn } from "@/lib/utils";

export function OrderReviewForm({
  orderId,
  existingReview,
}: {
  orderId: string;
  existingReview?: OrderReview | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState(existingReview?.review_text || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (rating < 1) {
      toast.error("Please select a rating");
      return;
    }
    setLoading(true);
    const result = await submitOrderReview({
      order_id: orderId,
      rating,
      review_text: text,
    });
    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Thank you for your feedback!");
      router.refresh();
    }
  }

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-[#0F172A]">Rate Your Experience</h3>
      <p className="mt-1 text-sm text-[#64748B]">How was your experience with this service delivery?</p>

      <div className="mt-4 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            className="rounded p-0.5"
          >
            <Star
              className={cn(
                "h-7 w-7",
                (hover || rating) >= n
                  ? "fill-[#F59E0B] text-[#F59E0B]"
                  : "text-[#CBD5E1]"
              )}
            />
          </button>
        ))}
      </div>

      <Textarea
        className="mt-4 rounded-xl"
        rows={3}
        placeholder="Share your feedback (optional)..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 rounded-xl bg-[#635BFF] hover:bg-[#5248E6]"
      >
        {loading ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
      </Button>
    </div>
  );
}
