import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Headphones,
  MessageCircle,
  Send,
  Ticket,
  UserRound,
} from "lucide-react";
import { SupportTicketsClient } from "@/components/partner/support/support-tickets-client";
import { DashboardPanel, PartnerStatCard } from "@/components/partner/dashboard/dashboard-premium";
import { PartnerPageShell } from "@/components/partner/ui";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TELEGRAM_SUPPORT } from "@/lib/constants";
import { panelIconStyles } from "@/lib/theme-tokens";
import { cn } from "@/lib/utils";
import type { AccountManager, Ticket as SupportTicket } from "@/types/database";

export function PartnerSupportView({
  tickets,
  manager,
}: {
  tickets: SupportTicket[];
  manager: AccountManager | null;
}) {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const closed = tickets.filter((t) => t.status === "closed").length;
  const telegramLink = manager?.telegram_link || TELEGRAM_SUPPORT;

  const managerInitials = manager?.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <PartnerPageShell compact fullWidth className="gap-4 sm:gap-5">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/partner" className="transition hover:text-primary">
          Dashboard
        </Link>
        <span aria-hidden>›</span>
        <span className="font-medium text-foreground">Support</span>
      </nav>

      {total > 0 && (
        <section aria-label="Ticket stats" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <PartnerStatCard title="Total Tickets" value={total} subtitle="All time" icon={Ticket} color="blue" />
          <PartnerStatCard title="Open" value={open} subtitle="Awaiting response" icon={Clock} color="orange" />
          <PartnerStatCard
            title="In Progress"
            value={inProgress}
            subtitle="Being handled"
            icon={Headphones}
            color="purple"
          />
          <PartnerStatCard
            title="Closed"
            value={closed}
            subtitle="Resolved"
            icon={CheckCircle2}
            color="green"
          />
        </section>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:items-start">
        <div className="flex flex-col gap-4 xl:col-span-1">
          <Card size="sm" className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
            <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl",
                    panelIconStyles.blue
                  )}
                >
                  <Send className="size-5" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Fastest: Telegram</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get quick help with orders, listings, and payments.
                  </p>
                </div>
              </div>
              <Button asChild className="h-10 w-full rounded-xl font-semibold">
                <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                  <Send data-icon="inline-start" />
                  Open Telegram
                </a>
              </Button>
              {manager?.support_hours ? (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5 shrink-0 text-primary" />
                  {manager.support_hours}
                </p>
              ) : (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5 shrink-0 text-primary" />
                  Typical response within a few hours
                </p>
              )}
            </CardContent>
          </Card>

          <DashboardPanel title="Account Manager" icon={UserRound} iconColor="green">
            {manager ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-border bg-gradient-to-br from-card to-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11 bg-primary shadow-sm">
                      <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                        {managerInitials}
                      </AvatarFallback>
                      <AvatarBadge className="bg-chart-2 ring-2 ring-card" />
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{manager.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{manager.telegram_id}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Your dedicated contact for service advice and order updates.
                  </p>
                </div>
                {manager.telegram_link ? (
                  <Button asChild variant="outline" className="h-9 w-full rounded-xl font-semibold">
                    <a href={manager.telegram_link} target="_blank" rel="noopener noreferrer">
                      <MessageCircle data-icon="inline-start" />
                      Message Manager
                    </a>
                  </Button>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">A manager will be assigned to your account soon.</p>
            )}
          </DashboardPanel>

          <DashboardPanel title="When to use tickets" icon={Ticket} iconColor="purple">
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-chart-2" />
                Non-urgent issues that need a written record
              </li>
              <li className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-chart-2" />
                Billing or account questions
              </li>
              <li className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-chart-2" />
                Technical problems on the portal
              </li>
            </ul>
          </DashboardPanel>
        </div>

        <div className="xl:col-span-2">
          <SupportTicketsClient tickets={tickets} />
        </div>
      </div>
    </PartnerPageShell>
  );
}
