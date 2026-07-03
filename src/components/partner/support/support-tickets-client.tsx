"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ChevronDown, Loader2, MessageSquarePlus, Plus, Send, Ticket } from "lucide-react";
import { createTicket, replyTicket } from "@/lib/actions";
import { TICKET_STATUS_LABELS } from "@/lib/constants";
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
import type { Profile, Ticket as SupportTicket, TicketMessage, UserRole } from "@/types/database";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TicketMessageRow = TicketMessage & {
  profiles: Pick<Profile, "full_name" | "role"> | Pick<Profile, "full_name" | "role">[] | null;
};

export type SupportTicketRow = SupportTicket & {
  ticket_messages?: TicketMessageRow[];
};

function rel<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function ticketVariant(status: string): "success" | "warning" | "info" | "muted" {
  if (status === "closed") return "muted";
  if (status === "in_progress") return "info";
  return "warning";
}

function isStaffRole(role: UserRole | undefined) {
  return role === "super_admin" || role === "operations_manager" || role === "service_team";
}

const inputClass = "rounded-xl border-input bg-background shadow-sm";

function TicketThread({
  ticket,
  onReplied,
}: {
  ticket: SupportTicketRow;
  onReplied: () => void;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messages = useMemo(
    () =>
      [...(ticket.ticket_messages || [])].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    [ticket.ticket_messages]
  );

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    const result = await replyTicket(ticket.id, message);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Reply sent");
    setMessage("");
    onReplied();
  }

  return (
    <div className="space-y-4 border-t border-border bg-muted/10 px-4 py-4">
      <div className="flex max-h-72 flex-col gap-2.5 overflow-y-auto">
        {messages.map((msg) => {
          const sender = rel(msg.profiles);
          const staff = isStaffRole(sender?.role);
          return (
            <div key={msg.id} className={cn("flex", staff ? "justify-start" : "justify-end")}>
              <div
                className={cn(
                  "max-w-[90%] rounded-2xl px-3 py-2.5 text-sm",
                  staff
                    ? "rounded-bl-md border border-border bg-card text-foreground"
                    : "rounded-br-md bg-primary text-primary-foreground"
                )}
              >
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide opacity-75">
                  {staff ? "Support" : "You"} · {format(new Date(msg.created_at), "MMM d, h:mm a")}
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      {ticket.status !== "closed" ? (
        <form onSubmit={handleReply} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder="Write a follow-up message..."
            className={cn(inputClass, "min-h-[72px] flex-1")}
          />
          <Button type="submit" disabled={loading} className="h-10 shrink-0 rounded-xl font-semibold sm:px-5">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send data-icon="inline-start" />}
            Reply
          </Button>
        </form>
      ) : (
        <p className="text-xs text-muted-foreground">This ticket is closed. Open a new ticket if you need more help.</p>
      )}
    </div>
  );
}

export function SupportTicketsClient({ tickets }: { tickets: SupportTicketRow[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
          <p className="text-sm text-muted-foreground">Open a ticket to view the conversation and support replies</p>
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
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => {
                    const expanded = expandedId === ticket.id;
                    const messageCount = ticket.ticket_messages?.length || 0;
                    return (
                      <Fragment key={ticket.id}>
                        <TableRow
                          className="cursor-pointer"
                          onClick={() => setExpandedId(expanded ? null : ticket.id)}
                        >
                          <TableCell className="max-w-[280px]">
                            <p className="truncate font-medium text-foreground">{ticket.subject}</p>
                            <p className="text-xs text-muted-foreground">{messageCount} messages</p>
                          </TableCell>
                          <TableCell>
                            <PartnerBadge variant={ticketVariant(ticket.status)}>
                              {TICKET_STATUS_LABELS[ticket.status]}
                            </PartnerBadge>
                          </TableCell>
                          <TableCell className="hidden text-right text-muted-foreground sm:table-cell">
                            {format(new Date(ticket.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <ChevronDown
                              className={cn(
                                "ml-auto size-4 text-muted-foreground transition-transform",
                                expanded && "rotate-180"
                              )}
                            />
                          </TableCell>
                        </TableRow>
                        {expanded ? (
                          <TableRow key={`${ticket.id}-thread`} className="hover:bg-transparent">
                            <TableCell colSpan={4} className="p-0">
                              <TicketThread ticket={ticket} onReplied={() => router.refresh()} />
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            }
            mobile={tickets.map((ticket) => {
              const expanded = expandedId === ticket.id;
              return (
                <MobileDataCard key={ticket.id}>
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setExpandedId(expanded ? null : ticket.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 font-semibold text-foreground">{ticket.subject}</p>
                      <PartnerBadge variant={ticketVariant(ticket.status)}>
                        {TICKET_STATUS_LABELS[ticket.status]}
                      </PartnerBadge>
                    </div>
                    <div className="mt-3 border-t pt-3">
                      <MobileDataRow label="Created">
                        {format(new Date(ticket.created_at), "MMM d, yyyy")}
                      </MobileDataRow>
                      <MobileDataRow label="Messages">{ticket.ticket_messages?.length || 0}</MobileDataRow>
                    </div>
                  </button>
                  {expanded ? (
                    <TicketThread ticket={ticket} onReplied={() => router.refresh()} />
                  ) : null}
                </MobileDataCard>
              );
            })}
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
