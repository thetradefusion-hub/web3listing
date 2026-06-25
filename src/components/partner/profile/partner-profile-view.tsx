import Link from "next/link";
import { format } from "date-fns";
import {
  CheckCircle2,
  FolderKanban,
  Package,
  Send,
  ShieldCheck,
  UserCog,
  Wallet,
} from "lucide-react";
import { ProfileForm } from "@/components/partner/profile-form";
import { PartnerStatCard } from "@/components/partner/dashboard/dashboard-premium";
import { PartnerBadge, PartnerPageShell, kycStatusVariant } from "@/components/partner/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getServiceAccent } from "@/lib/service-catalog";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

function kycLabel(status: Profile["kyc_status"]) {
  const labels: Record<Profile["kyc_status"], string> = {
    approved: "Verified",
    pending: "KYC Pending",
    rejected: "KYC Rejected",
  };
  return labels[status] || status;
}

export function PartnerProfileView({
  profile,
  projectCount,
  orderCount,
}: {
  profile: Profile;
  projectCount: number;
  orderCount: number;
}) {
  const displayName = profile.company_name || profile.full_name || profile.email;
  const initials = (profile.full_name || profile.email)
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "P";
  const kycRequired = profile.kyc_status !== "approved";
  const walletConfigured = Boolean(profile.wallet_address?.trim());
  const accent = getServiceAccent(displayName);

  return (
    <PartnerPageShell compact fullWidth className="gap-4 sm:gap-5">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/partner" className="transition hover:text-primary">
          Dashboard
        </Link>
        <span aria-hidden>›</span>
        <span className="font-medium text-foreground">Profile</span>
      </nav>

      <Card size="sm" className="relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 py-0">
        <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b", accent)} aria-hidden />
        <CardContent className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-center sm:justify-between sm:p-5 sm:pl-6">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="size-14 shadow-md ring-2 ring-border/60 sm:size-16">
              {profile.avatar_url ? <AvatarImage src={profile.avatar_url} alt="" /> : null}
              <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-bold text-foreground sm:text-xl">{displayName}</h1>
                <PartnerBadge variant={kycStatusVariant(profile.kyc_status)}>
                  {kycLabel(profile.kyc_status)}
                </PartnerBadge>
              </div>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{profile.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1">
                  <UserCog className="size-3 shrink-0" />
                  Partner since {format(new Date(profile.created_at), "MMM yyyy")}
                </span>
                {profile.telegram_username ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-medium text-primary">
                    <Send className="size-3 shrink-0" />
                    {profile.telegram_username}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {kycRequired ? (
            <Button asChild className="h-9 shrink-0 rounded-xl font-semibold sm:self-center">
              <Link href="/partner/kyc">
                <ShieldCheck data-icon="inline-start" />
                Complete KYC
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <section aria-label="Account overview" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <PartnerStatCard
          title="KYC Status"
          value={kycLabel(profile.kyc_status)}
          subtitle={kycRequired ? "Action required" : "Account verified"}
          icon={ShieldCheck}
          color={
            profile.kyc_status === "approved"
              ? "green"
              : profile.kyc_status === "rejected"
                ? "purple"
                : "orange"
          }
        />
        <PartnerStatCard
          title="My Projects"
          value={projectCount}
          subtitle="Token projects"
          icon={FolderKanban}
          color="blue"
        />
        <PartnerStatCard
          title="My Orders"
          value={orderCount}
          subtitle="Service orders"
          icon={Package}
          color="purple"
        />
        <PartnerStatCard
          title="Payout Wallet"
          value={walletConfigured ? "Set" : "Not set"}
          subtitle={walletConfigured ? "Ready for payouts" : "Add wallet below"}
          icon={Wallet}
          color={walletConfigured ? "green" : "orange"}
        />
      </section>

      <ProfileForm profile={profile} kycRequired={kycRequired} />
    </PartnerPageShell>
  );
}
