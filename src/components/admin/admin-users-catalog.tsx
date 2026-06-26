"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import { AdminPageShell, AdminPanel, AdminStatCard } from "@/components/admin/ui";
import { MobileDataCard, MobileDataRow, ResponsiveTableShell } from "@/components/shared/responsive-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
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

type UserRow = Pick<
  Profile,
  "id" | "full_name" | "email" | "company_name" | "country" | "kyc_status" | "created_at" | "telegram_username"
>;

function kycBadgeVariant(status: KycStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "approved") return "default";
  if (status === "rejected") return "destructive";
  return "outline";
}

function UserIdentity({ user }: { user: UserRow }) {
  const initials = (user.full_name || user.email)
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-10 rounded-xl">
        <AvatarFallback className="rounded-xl bg-emerald-600 text-xs font-bold text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">{user.full_name || "Unnamed user"}</p>
        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        {user.telegram_username ? (
          <p className="truncate text-xs text-muted-foreground">@{user.telegram_username.replace(/^@/, "")}</p>
        ) : null}
      </div>
    </div>
  );
}

function UsersToolbar({
  query,
  onQueryChange,
  kycFilter,
  onKycChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  kycFilter: "all" | KycStatus;
  onKycChange: (value: "all" | KycStatus) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name, email, or company..."
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
    </div>
  );
}

function ResultsBar({ shown, total }: { shown: number; total: number }) {
  return (
    <div className="border-b border-border bg-gradient-to-r from-muted/40 via-card to-muted/30 px-4 py-2.5 text-xs sm:px-5 sm:text-sm">
      <p className="text-muted-foreground">
        {shown === 0 ? (
          "No users match your filters"
        ) : (
          <>
            Showing <span className="font-semibold text-foreground">{shown}</span> of{" "}
            <span className="font-semibold text-foreground">{total}</span> users
          </>
        )}
      </p>
    </div>
  );
}

export function AdminUsersCatalog({
  users,
  projectCounts,
  orderCounts,
}: {
  users: UserRow[];
  projectCounts: Record<string, number>;
  orderCounts: Record<string, number>;
}) {
  const [query, setQuery] = useState("");
  const [kycFilter, setKycFilter] = useState<"all" | KycStatus>("all");

  const stats = useMemo(() => {
    const kycApproved = users.filter((u) => u.kyc_status === "approved").length;
    const withOrders = users.filter((u) => (orderCounts[u.id] || 0) > 0).length;
    const totalOrders = users.reduce((sum, u) => sum + (orderCounts[u.id] || 0), 0);
    return { total: users.length, kycApproved, withOrders, totalOrders };
  }, [users, orderCounts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      if (kycFilter !== "all" && user.kyc_status !== kycFilter) return false;
      if (!q) return true;
      return (
        user.full_name?.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.company_name?.toLowerCase().includes(q) ||
        user.country?.toLowerCase().includes(q)
      );
    });
  }, [users, query, kycFilter]);

  return (
    <AdminPageShell compact fullWidth className="w-full gap-4 sm:gap-5">
      <div className="min-w-0">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/admin" className="transition hover:text-primary">
            Admin
          </Link>
          <span aria-hidden>›</span>
          <span className="font-medium text-foreground">Users</span>
        </nav>
        <h1 className="mt-1.5 text-xl font-bold text-foreground sm:text-2xl">Client Users</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Self-service accounts that browse and order without partner commission.
        </p>
      </div>

      <section aria-label="User stats" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <AdminStatCard title="Total Users" value={stats.total} icon={Users} color="blue" />
        <AdminStatCard title="KYC Approved" value={stats.kycApproved} icon={CheckCircle2} color="green" />
        <AdminStatCard title="With Orders" value={stats.withOrders} icon={UserRound} color="purple" />
        <AdminStatCard title="Total Orders" value={stats.totalOrders} icon={ClipboardList} color="orange" />
      </section>

      <AdminPanel className="overflow-hidden">
        <UsersToolbar query={query} onQueryChange={setQuery} kycFilter={kycFilter} onKycChange={setKycFilter} />
        <ResultsBar shown={filtered.length} total={users.length} />

        {filtered.length > 0 ? (
          <ResponsiveTableShell
            table={
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[220px] px-4">User</TableHead>
                    <TableHead className="hidden px-4 md:table-cell">Company / Country</TableHead>
                    <TableHead className="px-4">KYC</TableHead>
                    <TableHead className="hidden px-4 sm:table-cell">Projects</TableHead>
                    <TableHead className="px-4">Orders</TableHead>
                    <TableHead className="hidden px-4 lg:table-cell">Joined</TableHead>
                    <TableHead className="px-4 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="whitespace-normal px-4 py-3">
                        <UserIdentity user={user} />
                      </TableCell>
                      <TableCell className="hidden px-4 text-muted-foreground md:table-cell">
                        <p className="truncate">{user.company_name || "—"}</p>
                        <p className="text-xs">{user.country || "—"}</p>
                      </TableCell>
                      <TableCell className="px-4">
                        <Badge variant={kycBadgeVariant(user.kyc_status)} className="capitalize">
                          {user.kyc_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden px-4 sm:table-cell">
                        <Badge variant="outline">
                          <FolderKanban data-icon="inline-start" />
                          {projectCounts[user.id] || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4">
                        <Badge variant={(orderCounts[user.id] || 0) > 0 ? "secondary" : "outline"}>
                          {orderCounts[user.id] || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden px-4 text-muted-foreground lg:table-cell">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 text-right">
                        <Button variant="outline" size="sm" className="rounded-xl" asChild>
                          <Link href={`/admin/orders?owner=${user.id}`}>
                            Orders
                            <ArrowRight data-icon="inline-end" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }
            mobile={
              <div className="flex flex-col gap-3">
                {filtered.map((user) => (
                  <MobileDataCard key={user.id}>
                    <UserIdentity user={user} />
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                      <Badge variant={kycBadgeVariant(user.kyc_status)} className="capitalize">
                        KYC: {user.kyc_status}
                      </Badge>
                      <Badge variant="outline">{projectCounts[user.id] || 0} projects</Badge>
                      <Badge variant="secondary">{orderCounts[user.id] || 0} orders</Badge>
                    </div>
                    <div className="mt-3 border-t border-border pt-3">
                      <MobileDataRow label="Company">{user.company_name || "—"}</MobileDataRow>
                      <MobileDataRow label="Country">{user.country || "—"}</MobileDataRow>
                      <MobileDataRow label="Joined">
                        {new Date(user.created_at).toLocaleDateString()}
                      </MobileDataRow>
                    </div>
                    <div className="mt-3 border-t border-border pt-3">
                      <Button variant="outline" size="sm" className="w-full rounded-xl" asChild>
                        <Link href={`/admin/orders?owner=${user.id}`}>
                          View orders
                          <ArrowRight data-icon="inline-end" />
                        </Link>
                      </Button>
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
              <EmptyTitle>No users found</EmptyTitle>
              <EmptyDescription>
                {users.length === 0
                  ? "Users will appear here after self-service signup."
                  : "Try a different search or KYC filter."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </AdminPanel>
    </AdminPageShell>
  );
}
