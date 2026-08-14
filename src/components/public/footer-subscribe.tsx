"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { submitLead } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function FooterSubscribe() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (new FormData(form).get("email") as string)?.trim();
    if (!email) return;

    setLoading(true);
    const result = await submitLead({
      name: "Newsletter",
      email,
      message: "Footer newsletter signup — Web3 listing & growth updates",
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("You're on the list.");
    setSubmitted(true);
    form.reset();
  }

  if (submitted) {
    return (
      <p className="mt-4 text-sm leading-relaxed text-white/70">
        Thanks — we&apos;ll send listing and growth updates to your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <Input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Work email"
        aria-label="Email for updates"
        className="h-11 flex-1 rounded-xl border-white/15 bg-white/5 text-sm text-white placeholder:text-white/40"
      />
      <Button
        type="submit"
        disabled={loading}
        className="lh-btn-cta h-11 shrink-0 rounded-xl px-4 text-xs font-bold uppercase tracking-wide"
      >
        {loading ? "..." : "Subscribe"}
        <ArrowRight data-icon="inline-end" className="size-3.5" />
      </Button>
    </form>
  );
}
