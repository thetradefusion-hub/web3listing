import { createClient } from "@/lib/supabase/server";
import { CreatePartnerDialog } from "@/components/admin/create-partner-dialog";
import { PartnerActions } from "@/components/admin/partner-actions";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelBody,
  AdminBadge,
  kycStatusVariant,
  AdminEmptyState,
} from "@/components/admin/ui";

export default async function AdminPartnersPage() {
  const supabase = await createClient();
  const { data: partners } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "agent")
    .order("created_at", { ascending: false });

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Partner Management"
        description="Create and manage B2B partner accounts"
        action={<CreatePartnerDialog />}
      />

      {partners && partners.length > 0 ? (
        <div className="space-y-3">
          {partners.map((partner) => (
            <AdminPanel key={partner.id}>
              <AdminPanelBody>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
                      {(partner.full_name || partner.email).slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{partner.full_name || partner.email}</p>
                      <p className="text-sm text-slate-500">
                        {partner.email} · {partner.company_name || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <AdminBadge variant={kycStatusVariant(partner.kyc_status)}>
                      KYC: {partner.kyc_status}
                    </AdminBadge>
                    {partner.telegram_username && (
                      <AdminBadge variant="info">{partner.telegram_username}</AdminBadge>
                    )}
                    <PartnerActions partnerId={partner.id} email={partner.email} kycStatus={partner.kyc_status} />
                  </div>
                </div>
              </AdminPanelBody>
            </AdminPanel>
          ))}
        </div>
      ) : (
        <AdminEmptyState title="No partners yet" description="Create your first partner account to get started." />
      )}
    </AdminPageShell>
  );
}
