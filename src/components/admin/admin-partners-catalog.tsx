"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Handshake,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import { AdminPageShell, AdminPanel, AdminStatCard } from "@/components/admin/ui";
import { CreatePartnerDialog } from "@/components/admin/create-partner-dialog";
import { PartnerActions } from "@/components/admin/partner-actions";
import { MobileDataCard, MobileDataRow, ResponsiveTableShell } from "@/components/shared/responsive-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { KycStatus, Profile } from "@/types/database";

type PartnerRow = Pick<
  Profile,
  "id" | "full_name" | "email" | "company_name" | "country" | "kyc_status" | "created_at" | "telegram_username"
>;

function kycBadgeVariant(status: KycStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "approved") return "default";
  if (status === "rejected") return "destructive";
  return "outline";
}

function PartnerIdentity({ partner }: { partner: PartnerRow }) {
  const initials = (partner.full_name || partner.email)
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-10 rounded-xl">
        <AvatarFallback className="rounded-xl bg-primary text-xs font-bold text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">{partner.full_name || "Unnamed partner"}</p>
        <p className="truncate text-sm text-muted-foreground">{partner.email}</p>
      </div>
    </div>
  );
}

function PartnersToolbar({
  query,
  onQueryChange,
  kycFilter,
  onKycChange,
  action,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  kycFilter: "all" | KycStatus;
  onKycChange: (value: "all" | KycStatus) => void;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-muted/20 px-4 py-3 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search partners..."
            className="h-11 rounded-xl border-input bg-background pl-10 shadow-sm"
          />
        </div>
        <Select value={kycFilter} onValueChange={(v) => v && onKycChange(v as typeof kycFilter)}>
          <SelectTrigger className="h-11 w-full rounded-xl sm:w-[180px]">
            <SelectValue placeholder="KYC status">
              {kycFilter === "all"
                ? "KYC status"
                : kycFilter.charAt(0).toUpperCase() + kycFilter.slice(1)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}

function ResultsBar({ shown, total }: { shown: number; total: number }) {
  return (
    <div className="border-b border-border bg-gradient-to-r from-muted/40 via-card to-muted/30 px-4 py-2.5 text-xs sm:px-5 sm:text-sm">
      <p className="text-muted-foreground">
        {shown === 0 ? (
          "No partners match your filters"
        ) : (
          <>
            Showing <span className="font-semibold text-foreground">{shown}</span> of{" "}
            <span className="font-semibold text-foreground">{total}</span> partners
          </>
        )}
      </p>
    </div>
  );
}

export function AdminPartnersCatalog({
  partners,
  orderCounts,
}: {
  partners: PartnerRow[];
  orderCounts: Record<string, number>;
}) {
  const [query, setQuery] = useState("");
  const [kycFilter, setKycFilter] = useState<"all" | KycStatus>("all");

  const stats = useMemo(() => {
    const kycApproved = partners.filter((p) => p.kyc_status === "approved").length;
    const kycPending = partners.filter((p) => p.kyc_status === "pending").length;
    const withOrders = partners.filter((p) => (orderCounts[p.id] || 0) > 0).length;
    const totalOrders = partners.reduce((sum, p) => sum + (orderCounts[p.id] || 0), 0);
    return { total: partners.length, kycApproved, kycPending, withOrders, totalOrders };
  }, [partners, orderCounts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return partners.filter((partner) => {
      if (kycFilter !== "all" && partner.kyc_status !== kycFilter) return false;
      if (!q) return true;
      return (
        partner.full_name?.toLowerCase().includes(q) ||
        partner.email.toLowerCase().includes(q) ||
        partner.company_name?.toLowerCase().includes(q) ||
        partner.country?.toLowerCase().includes(q) ||
        partner.telegram_username?.toLowerCase().includes(q)
      );
    });
  }, [partners, query, kycFilter]);

  return (
    <AdminPageShell compact fullWidth className="w-full gap-4 sm:gap-5">
      <div className="min-w-0">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/admin" className="transition hover:text-primary">
            Admin
          </Link>
          <span aria-hidden>›</span>
          <span className="font-medium text-foreground">Partners</span>
        </nav>
        <h1 className="mt-1.5 text-xl font-bold text-foreground sm:text-2xl">Partner Management</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Create and manage B2B partner accounts with commission and wallet access.
        </p>
      </div>

      <section aria-label="Partner stats" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <AdminStatCard title="Total Partners" value={stats.total} icon={Handshake} color="blue" />
        <AdminStatCard title="KYC Approved" value={stats.kycApproved} icon={CheckCircle2} color="green" />
        <AdminStatCard title="KYC Pending" value={stats.kycPending} icon={UserCheck} color="orange" />
        <AdminStatCard title="Total Orders" value={stats.totalOrders} icon={ClipboardList} color="purple" />
      </section>

      <AdminPanel className="overflow-hidden">
        <PartnersToolbar
          query={query}
          onQueryChange={setQuery}
          kycFilter={kycFilter}
          onKycChange={setKycFilter}
          action={<CreatePartnerDialog />}
        />
        <ResultsBar shown={filtered.length} total={partners.length} />

        {filtered.length > 0 ? (
          <ResponsiveTableShell
            table={
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[220px] px-4">Partner</TableHead>
                    <TableHead className="hidden px-4 md:table-cell">Company</TableHead>
                    <TableHead className="hidden px-4 lg:table-cell">Telegram</TableHead>
                    <TableHead className="px-4">KYC</TableHead>
                    <TableHead className="hidden px-4 sm:table-cell">Orders</TableHead>
                    <TableHead className="hidden px-4 xl:table-cell">Joined</TableHead>
                    <TableHead className="px-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="whitespace-normal px-4 py-3">
                        <PartnerIdentity partner={partner} />
                      </TableCell>
                      <TableCell className="hidden px-4 text-muted-foreground md:table-cell">
                        <div className="flex items-center gap-2">
                          <Building2 className="size-4 shrink-0 text-muted-foreground" />
                          <span className="truncate">{partner.company_name || "—"}</span>
                        </div>
                        <p className="mt-0.5 pl-6 text-xs">{partner.country || "—"}</p>
                      </TableCell>
                      <TableCell className="hidden px-4 text-muted-foreground lg:table-cell">
                        {partner.telegram_username
                          ? `@${partner.telegram_username.replace(/^@/, "")}`
                          : "—"}
                      </TableCell>
                      <TableCell className="px-4">
                        <Badge variant={kycBadgeVariant(partner.kyc_status)} className="capitalize">
                          {partner.kyc_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden px-4 sm:table-cell">
                        <Badge variant={(orderCounts[partner.id] || 0) > 0 ? "secondary" : "outline"}>
                          {orderCounts[partner.id] || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden px-4 text-muted-foreground xl:table-cell">
                        {new Date(partner.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 text-right">
                        <PartnerActions
                          partnerId={partner.id}
                          email={partner.email}
                          kycStatus={partner.kyc_status}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }
            mobile={
              <div className="flex flex-col gap-3">
                {filtered.map((partner) => (
                  <MobileDataCard key={partner.id}>
                    <PartnerIdentity partner={partner} />
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                      <Badge variant={kycBadgeVariant(partner.kyc_status)} className="capitalize">
                        KYC: {partner.kyc_status}
                      </Badge>
                      <Badge variant="outline">{orderCounts[partner.id] || 0} orders</Badge>
                    </div>
                    <div className="mt-3 border-t border-border pt-3">
                      <MobileDataRow label="Company">{partner.company_name || "—"}</MobileDataRow>
                      <MobileDataRow label="Country">{partner.country || "—"}</MobileDataRow>
                      <MobileDataRow label="Telegram">
                        {partner.telegram_username
                          ? `@${partner.telegram_username.replace(/^@/, "")}`
                          : "—"}
                      </MobileDataRow>
                      <MobileDataRow label="Joined">
                        {new Date(partner.created_at).toLocaleDateString()}
                      </MobileDataRow>
                    </div>
                    <div className="mt-3 border-t border-border pt-3">
                      <PartnerActions
                        partnerId={partner.id}
                        email={partner.email}
                        kycStatus={partner.kyc_status}
                      />
                    </div>
                  </MobileDataCard>
                ))}
              </div>
            }
          />
        ) : (
          <Empty className="m-4 rounded-2xl border-dashed py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-11 bg-primary/10 text-primary">
                <Users />
              </EmptyMedia>
              <EmptyTitle>{partners.length === 0 ? "No partners yet" : "No partners found"}</EmptyTitle>
              <EmptyDescription>
                {partners.length === 0
                  ? "Create your first B2B partner account to get started."
                  : "Try a different search or KYC filter."}
              </EmptyDescription>
            </EmptyHeader>
            {partners.length === 0 ? (
              <EmptyContent>
                <CreatePartnerDialog />
              </EmptyContent>
            ) : null}
          </Empty>
        )}
      </AdminPanel>
    </AdminPageShell>
  );
}
