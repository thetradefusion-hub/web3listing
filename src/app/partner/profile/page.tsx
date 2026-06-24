import { getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/partner/profile-form";
import { PartnerPageShell, PartnerPageHeader } from "@/components/partner/ui";

export default async function ProfilePage() {
  const profile = await getCurrentUser();
  return (
    <PartnerPageShell narrow>
      <PartnerPageHeader
        title="Profile Settings"
        description="Manage your account and contact information"
      />
      <ProfileForm profile={profile!} />
    </PartnerPageShell>
  );
}
