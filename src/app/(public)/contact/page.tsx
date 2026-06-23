"use client";

import { useState } from "react";
import { submitLead } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { TELEGRAM_SUPPORT } from "@/lib/constants";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await submitLead({
      name: form.get("name") as string,
      email: form.get("email") as string,
      company: form.get("company") as string,
      telegram: form.get("telegram") as string,
      message: form.get("message") as string,
    });
    setLoading(false);
    if (result.error) toast.error(result.error);
    else { toast.success("Message sent!"); setSubmitted(true); }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-4 text-muted-foreground">Get in touch for consultations and project inquiries</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-cyan-500/30 bg-cyan-500/5">
          <CardHeader><CardTitle>Telegram Support (Primary)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">For fastest response, contact us on Telegram.</p>
            <Button asChild className="w-full">
              <a href={TELEGRAM_SUPPORT} target="_blank" rel="noopener noreferrer">Open Telegram Support</a>
            </Button>
            <p className="text-xs text-muted-foreground">Business Hours: Monday - Saturday · 24/7 Ticket Support</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Form</CardTitle></CardHeader>
          <CardContent>
            {submitted ? (
              <p className="text-center text-emerald-400">Thank you! We will get back to you soon.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label>Name *</Label><Input name="name" required /></div>
                <div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" required /></div>
                <div className="space-y-2"><Label>Company</Label><Input name="company" /></div>
                <div className="space-y-2"><Label>Telegram</Label><Input name="telegram" placeholder="@username" /></div>
                <div className="space-y-2"><Label>Message *</Label><Textarea name="message" rows={4} required /></div>
                <Button type="submit" disabled={loading} className="w-full bg-cyan-500 text-black hover:bg-cyan-400">
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
