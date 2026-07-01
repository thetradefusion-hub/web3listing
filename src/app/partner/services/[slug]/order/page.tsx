import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { ServiceOrderView } from "@/components/partner/services/service-order-view";
import { rel } from "@/components/partner/ui";

export default async function PartnerServiceOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ project?: string }>;
}) {
  const { slug } = await params;
  const { project: projectId } = await searchParams;
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("*, service_categories(name, slug)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!service) notFound();

  const category = rel(service.service_categories);

  const [{ data: projects }, { data: manager }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("agent_id", profile!.id)
      .in("status", ["submitted", "approved"]),
    profile?.account_manager_id
      ? supabase.from("account_managers").select("telegram_link").eq("id", profile.account_manager_id).single()
      : supabase.from("account_managers").select("telegram_link").eq("is_active", true).limit(1).single(),
  ]);

  return (
    <ServiceOrderView
      service={service}
      categoryName={category?.name || "Services"}
      categorySlug={category?.slug || ""}
      projects={projects || []}
      defaultProjectId={projectId}
      managerTelegramLink={manager?.telegram_link}
    />
  );
}
