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
      company: (form.get("company") as string) || undefined,
      telegram: (form.get("telegram") as string) || undefined,
      message: form.get("message") as string,
    });
    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Message sent!");
      setSubmitted(true);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">Contact Us</h1>
      <p className="mt-2 text-muted-foreground">Get in touch for consultations and project inquiries</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>Telegram Support (Primary)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For fastest response, contact us on Telegram.
            </p>
            <Button className="lh-btn-cta w-full" asChild>
              <a href={TELEGRAM_SUPPORT} target="_blank" rel="noopener noreferrer">
                Open Telegram Support
              </a>
            </Button>
            <p className="text-xs text-muted-foreground">
              Business Hours: Monday - Saturday · 24/7 Ticket Support
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <p className="text-center text-muted-foreground">Thank you! We will get back to you soon.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input id="telegram" name="telegram" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" name="message" rows={4} required />
                </div>
                <Button type="submit" disabled={loading} className="lh-btn-cta w-full">
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
