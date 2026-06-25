"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MessageSquarePlus, Plus, Ticket } from "lucide-react";
import { createTicket } from "@/lib/actions";
import { DashboardPanel } from "@/components/partner/dashboard/dashboard-premium";
import { PartnerBadge } from "@/components/partner/ui";
import { MobileDataCard, MobileDataRow, ResponsiveTableShell } from "@/components/shared/responsive-table";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Ticket as SupportTicket } from "@/types/database";
import { toast } from "sonner";

function ticketVariant(status: string): "success" | "warning" | "info" | "muted" {
  if (status === "closed") return "muted";
  if (status === "in_progress") return "info";
  return "warning";
}

function ticketStatusLabel(status: SupportTicket["status"]) {
  const labels: Record<SupportTicket["status"], string> = {
    open: "Open",
    in_progress: "In Progress",
    closed: "Closed",
  };
  return labels[status] || status;
}

const inputClass = "rounded-xl border-input bg-background shadow-sm";

export function SupportTicketsClient({ tickets }: { tickets: SupportTicket[] }) {
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
      e.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Your Tickets</h2>
          <p className="text-sm text-muted-foreground">Track support requests submitted through the portal</p>
        </div>
        <Button
          size="sm"
          variant={showForm ? "outline" : "default"}
          className="h-9 rounded-xl font-semibold"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus data-icon="inline-start" />
              New Ticket
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <DashboardPanel
          title="Create Support Ticket"
          description="Describe your issue — we'll get back to you soon"
          icon={MessageSquarePlus}
          iconColor="blue"
        >
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-subject" className="text-xs font-semibold text-muted-foreground">
                Subject
              </Label>
              <Input
                id="ticket-subject"
                name="subject"
                required
                className={`h-10 ${inputClass}`}
                placeholder="Brief summary of your issue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-message" className="text-xs font-semibold text-muted-foreground">
                Message
              </Label>
              <Textarea
                id="ticket-message"
                name="message"
                rows={5}
                required
                className={inputClass}
                placeholder="Include order numbers or project names if relevant..."
              />
            </div>
            <Button type="submit" disabled={loading} className="h-10 w-full rounded-xl font-semibold sm:w-auto sm:px-8">
              {loading ? "Creating..." : "Submit Ticket"}
            </Button>
          </form>
        </DashboardPanel>
      )}

      {tickets.length > 0 ? (
        <DashboardPanel title="Ticket History" icon={Ticket} iconColor="teal" contentClassName="p-0">
          <ResponsiveTableShell
            className="flex-1"
            table={
              <Table className="portal-table">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">Created</TableHead>
                    <TableHead className="hidden text-right lg:table-cell">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="max-w-[280px]">
                        <p className="truncate font-medium text-foreground">{ticket.subject}</p>
                      </TableCell>
                      <TableCell>
                        <PartnerBadge variant={ticketVariant(ticket.status)}>
                          {ticketStatusLabel(ticket.status)}
                        </PartnerBadge>
                      </TableCell>
                      <TableCell className="hidden text-right text-muted-foreground sm:table-cell">
                        {format(new Date(ticket.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="hidden text-right text-muted-foreground lg:table-cell">
                        {format(new Date(ticket.updated_at), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }
            mobile={tickets.map((ticket) => (
              <MobileDataCard key={ticket.id}>
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 font-semibold text-foreground">{ticket.subject}</p>
                  <PartnerBadge variant={ticketVariant(ticket.status)}>
                    {ticketStatusLabel(ticket.status)}
                  </PartnerBadge>
                </div>
                <div className="mt-3 border-t pt-3">
                  <MobileDataRow label="Created">
                    {format(new Date(ticket.created_at), "MMM d, yyyy")}
                  </MobileDataRow>
                  <MobileDataRow label="Updated">
                    {format(new Date(ticket.updated_at), "MMM d, yyyy")}
                  </MobileDataRow>
                </div>
              </MobileDataCard>
            ))}
          />
        </DashboardPanel>
      ) : (
        !showForm && (
          <Empty className="rounded-2xl border-dashed py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-12 bg-primary/10 text-primary">
                <Ticket />
              </EmptyMedia>
              <EmptyTitle>No tickets yet</EmptyTitle>
              <EmptyDescription>
                For urgent help, use Telegram. Create a ticket for issues that need a written record.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button className="rounded-xl font-semibold" onClick={() => setShowForm(true)}>
                <Plus data-icon="inline-start" />
                Create Ticket
              </Button>
            </EmptyContent>
          </Empty>
        )
      )}
    </div>
  );
}
