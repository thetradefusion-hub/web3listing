"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTicket } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { TELEGRAM_SUPPORT } from "@/lib/constants";
import type { Ticket } from "@/types/database";
import { PartnerPanel, PartnerPanelBody, PartnerPanelHeader, PartnerBadge, PartnerEmptyState } from "@/components/partner/ui";

function ticketVariant(status: string): "success" | "warning" | "info" | "muted" {
  if (status === "closed") return "muted";
  if (status === "in_progress") return "info";
  return "warning";
}

export function SupportClient({ tickets }: { tickets: Ticket[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await createTicket(form.get("subject") as string, form.get("message") as string);
    setLoading(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Ticket created");
      setShowForm(false);
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <PartnerPanel className="border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50">
        <PartnerPanelBody className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-900">Primary Support: Telegram</p>
            <p className="text-sm text-slate-600">For fastest response, contact us on Telegram</p>
          </div>
          <a
            href={TELEGRAM_SUPPORT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:opacity-90"
          >
            <Send className="h-4 w-4" />
            Open Telegram
          </a>
        </PartnerPanelBody>
      </PartnerPanel>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Your Tickets</h2>
        <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Ticket"}
        </Button>
      </div>

      {showForm && (
        <PartnerPanel>
          <PartnerPanelHeader title="Create Support Ticket" />
          <PartnerPanelBody>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input name="subject" required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea name="message" rows={4} required className="rounded-xl" />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
              >
                {loading ? "Creating..." : "Create Ticket"}
              </Button>
            </form>
          </PartnerPanelBody>
        </PartnerPanel>
      )}

      {tickets.length > 0 ? (
        tickets.map((ticket) => (
          <PartnerPanel key={ticket.id}>
            <PartnerPanelBody>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{ticket.subject}</p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(ticket.created_at).toLocaleString()}</p>
                </div>
                <PartnerBadge variant={ticketVariant(ticket.status)}>{ticket.status.replace(/_/g, " ")}</PartnerBadge>
              </div>
            </PartnerPanelBody>
          </PartnerPanel>
        ))
      ) : (
        !showForm && <PartnerEmptyState title="No tickets yet" description="Create a ticket or contact us on Telegram." />
      )}
    </div>
  );
}
