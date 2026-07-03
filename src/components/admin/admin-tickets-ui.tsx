"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  CheckCircle2,
  Clock,
  Headphones,
  Loader2,
  MessageSquare,
  Search,
  Send,
  Ticket,
  UserRound,
} from "lucide-react";
import { replyTicket, updateTicketStatus } from "@/lib/actions";
import { TICKET_STATUS_LABELS } from "@/lib/constants";
import {
  AdminBadge,
  AdminEmptyState,
  AdminPageHeader,
  AdminPageShell,
  AdminPanel,
  AdminPanelBody,
  AdminStatCard,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Profile, Ticket as SupportTicket, TicketMessage, TicketStatus, UserRole } from "@/types/database";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TicketMessageRow = TicketMessage & {
  profiles: Pick<Profile, "full_name" | "role"> | Pick<Profile, "full_name" | "role">[] | null;
};

export type AdminTicketRow = SupportTicket & {
  profiles: Pick<Profile, "full_name" | "email" | "role" | "company_name"> | Pick<Profile, "full_name" | "email" | "role" | "company_name">[] | null;
  ticket_messages: TicketMessageRow[];
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

function ownerTypeLabel(role: UserRole | undefined) {
  if (role === "user") return "User";
  if (role === "agent") return "Partner";
  return "Account";
}

function isStaffRole(role: UserRole | undefined) {
  return role === "super_admin" || role === "operations_manager" || role === "service_team";
}

function TicketReplyForm({ ticketId, disabled }: { ticketId: string; disabled?: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Write a reply first");
      return;
    }
    setLoading(true);
    const result = await replyTicket(ticketId, message);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Reply sent");
    setMessage("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-border bg-muted/15 p-4">
      <Label htmlFor={`reply-${ticketId}`} className="text-xs font-semibold text-muted-foreground">
        Admin reply
      </Label>
      <Textarea
        id={`reply-${ticketId}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        disabled={disabled || loading}
        placeholder="Type your response to the user or partner..."
        className="rounded-xl"
      />
      <Button type="submit" size="sm" disabled={disabled || loading} className="rounded-xl font-semibold">
        {loading ? (
          <>
            <Loader2 data-icon="inline-start" className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send data-icon="inline-start" />
            Send reply
          </>
        )}
      </Button>
    </form>
  );
}

function TicketStatusUpdater({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
  currentStatus: TicketStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<TicketStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    const result = await updateTicketStatus(ticketId, status);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Ticket status updated");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="min-w-[160px] flex-1 space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">Status</Label>
        <Select value={status} onValueChange={(v) => v && setStatus(v as TicketStatus)}>
          <SelectTrigger className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TICKET_STATUS_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="rounded-xl"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Update status"}
      </Button>
    </div>
  );
}

function TicketConversation({ messages }: { messages: TicketMessageRow[] }) {
  if (messages.length === 0) {
    return <p className="text-sm text-muted-foreground">No messages yet.</p>;
  }

  return (
    <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
      {messages.map((msg) => {
        const sender = rel(msg.profiles);
        const staff = isStaffRole(sender?.role);
        return (
          <div
            key={msg.id}
            className={cn("flex", staff ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[92%] rounded-2xl px-3.5 py-2.5 sm:max-w-[80%]",
                staff
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md border border-border bg-card text-foreground"
              )}
            >
              <div className="mb-1 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide opacity-80">
                <span>{sender?.full_name || "User"}</span>
                <span>·</span>
                <span>{staff ? "Support" : ownerTypeLabel(sender?.role)}</span>
                <span>·</span>
                <span>{format(new Date(msg.created_at), "MMM d, h:mm a")}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AdminTicketsUI({ tickets }: { tickets: AdminTicketRow[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TicketStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(tickets[0]?.id ?? null);

  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in_progress").length,
      closed: tickets.filter((t) => t.status === "closed").length,
    }),
    [tickets]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      if (statusFilter !== "all" && ticket.status !== statusFilter) return false;
      if (!q) return true;
      const profile = rel(ticket.profiles);
      return (
        ticket.subject.toLowerCase().includes(q) ||
        profile?.full_name?.toLowerCase().includes(q) ||
        profile?.email?.toLowerCase().includes(q) ||
        profile?.company_name?.toLowerCase().includes(q)
      );
    });
  }, [tickets, query, statusFilter]);

  const selected =
    filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? null;

  const selectedProfile = selected ? rel(selected.profiles) : null;
  const selectedMessages = selected
    ? [...(selected.ticket_messages || [])].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    : [];

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Support Tickets"
        description="Reply to partner and user tickets, update status, and track conversations"
      />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <AdminStatCard title="Total" value={stats.total} subtitle="All tickets" icon={Ticket} color="blue" />
        <AdminStatCard title="Open" value={stats.open} subtitle="Needs first response" icon={MessageSquare} color="orange" />
        <AdminStatCard title="In progress" value={stats.inProgress} subtitle="Awaiting follow-up" icon={Clock} color="purple" />
        <AdminStatCard title="Closed" value={stats.closed} subtitle="Resolved" icon={CheckCircle2} color="green" />
      </section>

      {tickets.length === 0 ? (
        <AdminEmptyState
          title="No tickets yet"
          description="When partners or users submit support tickets, they will appear here for you to reply."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <AdminPanel className="overflow-hidden">
            <AdminPanelBody className="space-y-4 p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subject, name, email..."
                  className="rounded-xl pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {Object.entries(TICKET_STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto pr-1">
                {filtered.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No tickets match your filters.</p>
                ) : (
                  filtered.map((ticket) => {
                    const profile = rel(ticket.profiles);
                    const active = selected?.id === ticket.id;
                    const messageCount = ticket.ticket_messages?.length || 0;
                    return (
                      <button
                        key={ticket.id}
                        type="button"
                        onClick={() => setSelectedId(ticket.id)}
                        className={cn(
                          "rounded-xl border px-3 py-3 text-left transition-colors",
                          active
                            ? "border-primary/40 bg-primary/8 shadow-sm"
                            : "border-border bg-card hover:border-primary/20 hover:bg-muted/30"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-2 text-sm font-semibold text-foreground">{ticket.subject}</p>
                          <AdminBadge variant={ticketVariant(ticket.status)}>
                            {TICKET_STATUS_LABELS[ticket.status]}
                          </AdminBadge>
                        </div>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {profile?.full_name || profile?.email || "Unknown user"}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                          <span>{ownerTypeLabel(profile?.role)}</span>
                          <span>{messageCount} msg · {format(new Date(ticket.updated_at), "MMM d")}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </AdminPanelBody>
          </AdminPanel>

          <AdminPanel className="overflow-hidden">
            {selected ? (
              <AdminPanelBody className="space-y-5 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Headphones className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold text-foreground">{selected.subject}</h2>
                        <p className="text-xs text-muted-foreground">
                          Created {format(new Date(selected.created_at), "MMM d, yyyy · h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <AdminBadge variant={ticketVariant(selected.status)}>
                    {TICKET_STATUS_LABELS[selected.status]}
                  </AdminBadge>
                </div>

                <div className="grid gap-3 rounded-xl border border-border bg-muted/10 p-3 sm:grid-cols-2">
                  <div className="flex items-start gap-2.5">
                    <UserRound className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 text-sm">
                      <p className="font-semibold text-foreground">{selectedProfile?.full_name || "—"}</p>
                      <p className="truncate text-muted-foreground">{selectedProfile?.email}</p>
                      {selectedProfile?.company_name ? (
                        <p className="truncate text-xs text-muted-foreground">{selectedProfile.company_name}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Account type</p>
                    <p className="mt-1 font-medium text-foreground">{ownerTypeLabel(selectedProfile?.role)}</p>
                  </div>
                </div>

                <TicketStatusUpdater ticketId={selected.id} currentStatus={selected.status} />

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">Conversation</p>
                  <TicketConversation messages={selectedMessages} />
                </div>

                <TicketReplyForm ticketId={selected.id} disabled={selected.status === "closed"} />

                {selected.status === "closed" ? (
                  <p className="text-xs text-muted-foreground">
                    This ticket is closed. Reopen it from the status dropdown to send another reply.
                  </p>
                ) : null}
              </AdminPanelBody>
            ) : (
              <AdminPanelBody className="flex min-h-[320px] items-center justify-center p-6 text-sm text-muted-foreground">
                Select a ticket from the list to view the conversation.
              </AdminPanelBody>
            )}
          </AdminPanel>
        </div>
      )}
    </AdminPageShell>
  );
}
