"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  User,
} from "lucide-react";
import { submitLead } from "@/lib/actions";
import { HOME_COLLAB_SERVICES } from "@/lib/home-content";
import { TELEGRAM_SUPPORT } from "@/lib/constants";
import { TelegramAnchor } from "@/components/shared/telegram-anchor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const inputClass = "h-11 rounded-xl border-border/80 bg-background/80 pl-10 shadow-sm";

export function ContactForm({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const service = (form.get("service") as string) || "";
    const baseMessage = String(form.get("message") || "").trim();
    const message = service
      ? `Requested service: ${service}\n\n${baseMessage}`
      : baseMessage;

    const result = await submitLead({
      name: form.get("name") as string,
      email: form.get("email") as string,
      company: (form.get("company") as string) || undefined,
      telegram: (form.get("telegram") as string) || undefined,
      message,
    });

    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Message sent — we'll reply shortly.");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/80 bg-card p-8 text-center shadow-xl sm:p-10",
          className
        )}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-chart-2/15 blur-3xl"
          aria-hidden
        />
        <CheckCircle2 className="relative mx-auto size-14 text-chart-2" />
        <h3 className="relative mt-5 text-xl font-bold text-foreground">Message received</h3>
        <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
          Thanks for reaching out. Our team typically responds within 24 hours on business days.
          For urgent listing questions, message us on Telegram.
        </p>
        <div className="relative mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button className="lh-btn-cta h-11 rounded-xl font-semibold" asChild>
            <TelegramAnchor href={TELEGRAM_SUPPORT}>Open Telegram</TelegramAnchor>
          </Button>
          <Button variant="outline" className="h-11 rounded-xl" asChild>
            <Link href="/services">Browse services</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_24px_80px_-32px_color-mix(in_srgb,var(--primary)_45%,transparent)]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 size-44 rounded-full bg-chart-2/15 blur-3xl"
        aria-hidden
      />

      <div className="relative border-b border-border/60 px-6 py-5 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Send a message
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Request a free consultation
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us about your project — listing, liquidity, marketing, or custom scope.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-4 px-6 py-6 sm:px-8 sm:py-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-name" className="text-xs font-semibold text-muted-foreground">
              Full name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email" className="text-xs font-semibold text-muted-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@project.com"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-company" className="text-xs font-semibold text-muted-foreground">
              Company / Project
            </Label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="contact-company"
                name="company"
                placeholder="Token or company name"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-telegram" className="text-xs font-semibold text-muted-foreground">
              Telegram ID
            </Label>
            <div className="relative">
              <Send className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="contact-telegram"
                name="telegram"
                placeholder="@yourusername"
                autoComplete="username"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-service" className="text-xs font-semibold text-muted-foreground">
            Service interest
          </Label>
          <select
            id="contact-service"
            name="service"
            defaultValue=""
            className="flex h-11 w-full rounded-xl border border-border/80 bg-background/80 px-3 text-sm text-foreground shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">— Select a service (optional) —</option>
            {HOME_COLLAB_SERVICES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-message" className="text-xs font-semibold text-muted-foreground">
            Message <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
            <Textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              placeholder="Share your token stage, target exchanges, timeline, and any links..."
              className="min-h-[120px] resize-y rounded-xl border-border/80 bg-background/80 py-3 pl-10 shadow-sm"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="lh-btn-cta h-12 w-full rounded-xl text-sm font-bold uppercase tracking-wide"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send message
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By submitting, you agree to our{" "}
          <Link href="/legal/privacy" className="font-semibold text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
