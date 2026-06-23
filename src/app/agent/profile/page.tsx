import { getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/agent/profile-form";
import { AgentPageShell, AgentPageHeader } from "@/components/agent/ui";

export default async function ProfilePage() {
  const profile = await getCurrentUser();
  return (
    <AgentPageShell narrow>
      <AgentPageHeader
        title="Profile Settings"
        description="Manage your account and contact information"
      />
      <ProfileForm profile={profile!} />
    </AgentPageShell>
  );
}
