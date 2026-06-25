import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Headphones,
  MessageCircle,
  Send,
  Shield,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { panelIconStyles } from "@/lib/theme-tokens";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { AccountManager } from "@/types/database";

function HelpListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-muted-foreground">
      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-chart-2" strokeWidth={2.5} />
      <span>{children}</span>
    </li>
  );
}

export function DashboardSupportSection({
  manager,
  kycRequired,
}: {
  manager: AccountManager | null;
  kycRequired: boolean;
}) {
  const managerInitials = manager?.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section
      aria-label="Support and security"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {/* Support */}
      <Card size="sm" className="flex h-full flex-col overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                panelIconStyles.blue
              )}
            >
              <Headphones className="size-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <CardTitle>Support</CardTitle>
              <CardDescription>Help with orders, listings & payments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <ul className="flex flex-col gap-2.5">
            <HelpListItem>Order status & delivery updates</HelpListItem>
            <HelpListItem>Service recommendations for your project</HelpListItem>
            <HelpListItem>Payment and withdrawal questions</HelpListItem>
          </ul>
          {manager?.support_hours ? (
            <p className="mt-auto flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <Clock className="size-3.5 shrink-0 text-primary" />
              {manager.support_hours}
            </p>
          ) : (
            <p className="mt-auto flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <Clock className="size-3.5 shrink-0 text-primary" />
              Typical response within a few hours
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t bg-muted/20 sm:flex-row">
          {manager?.telegram_link ? (
            <Button asChild className="h-9 flex-1 rounded-xl font-semibold">
              <a href={manager.telegram_link} target="_blank" rel="noopener noreferrer">
                <Send data-icon="inline-start" />
                Telegram
              </a>
            </Button>
          ) : null}
          <Button asChild variant="outline" className="h-9 flex-1 rounded-xl">
            <Link href="/partner/support">Support Center</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Account Manager */}
      <Card size="sm" className="flex h-full flex-col overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                panelIconStyles.green
              )}
            >
              <UserRound className="size-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <CardTitle>Account Manager</CardTitle>
              <CardDescription>Your dedicated partner contact</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-center">
          {manager ? (
            <div className="rounded-xl border border-border bg-gradient-to-br from-card to-muted/30 p-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-12 bg-primary shadow-sm">
                  <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                    {managerInitials}
                  </AvatarFallback>
                  <AvatarBadge className="bg-chart-2 ring-2 ring-card" />
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-foreground">{manager.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{manager.telegram_id}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-chart-2/10 px-2 py-0.5 text-[10px] font-semibold text-chart-2">
                    <span className="size-1.5 rounded-full bg-chart-2" />
                    Available on Telegram
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Message your manager for tailored service advice, quotes, and priority handling on active orders.
              </p>
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              A manager will be assigned to your account soon.
            </p>
          )}
        </CardContent>
        {manager?.telegram_link ? (
          <CardFooter className="border-t bg-muted/20">
            <Button asChild className="h-9 w-full rounded-xl font-semibold">
              <a href={manager.telegram_link} target="_blank" rel="noopener noreferrer">
                <MessageCircle data-icon="inline-start" />
                Message Manager
              </a>
            </Button>
          </CardFooter>
        ) : null}
      </Card>

      {/* Security */}
      <Card size="sm" className="flex h-full flex-col overflow-hidden sm:col-span-2 xl:col-span-1">
        <CardHeader className="border-b">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                panelIconStyles.amber
              )}
            >
              <Shield className="size-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <CardTitle>Security</CardTitle>
              <CardDescription>Keep your partner account safe</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3.5 py-3",
              kycRequired
                ? "border-chart-3/30 bg-chart-3/10"
                : "border-chart-2/30 bg-chart-2/10"
            )}
          >
            <ShieldCheck
              className={cn("size-5 shrink-0", kycRequired ? "text-chart-3" : "text-chart-2")}
              strokeWidth={2}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {kycRequired ? "KYC verification pending" : "Identity verified"}
              </p>
              <p className="text-xs text-muted-foreground">
                {kycRequired
                  ? "Complete KYC to unlock orders and withdrawals"
                  : "Your account passed partner verification"}
              </p>
            </div>
          </div>
          <ul className="flex flex-col gap-2.5">
            <HelpListItem>Only trust messages from official Telegram contacts</HelpListItem>
            <HelpListItem>Never share passwords or private keys with staff</HelpListItem>
            <HelpListItem>Confirm payment details in the portal before sending funds</HelpListItem>
          </ul>
        </CardContent>
        <CardFooter className="border-t bg-muted/20">
          {kycRequired ? (
            <Button asChild className="h-9 w-full rounded-xl font-semibold">
              <Link href="/partner/kyc">Complete KYC</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="h-9 w-full rounded-xl">
              <Link href="/partner/profile">Profile & Security</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </section>
  );
}
