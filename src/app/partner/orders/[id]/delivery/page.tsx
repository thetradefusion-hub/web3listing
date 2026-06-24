import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { OrderDeliveryView } from "@/components/partner/orders/order-delivery-view";
import { PartnerPageShell } from "@/components/partner/ui";
import { rel } from "@/components/partner/ui";
import { isCommissionEligibleStatus } from "@/lib/commission";

export default async function PartnerOrderDeliveryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, services(*, service_categories(name)), projects(*)")
    .eq("id", id)
    .eq("agent_id", profile!.id)
    .single();

  if (!order) notFound();

  if (!isCommissionEligibleStatus(order.status)) {
    redirect(`/partner/orders/${id}`);
  }

  const service = rel(order.services);
  const project = rel(order.projects);
  const category = service?.service_categories
    ? rel(service.service_categories as { name: string } | { name: string }[])
    : null;

  if (!service || !project) notFound();

  const [
    { data: payment },
    { data: proofs },
    { data: deliverables },
    { data: history },
    { data: review },
    { data: manager },
    { data: related },
    { data: quotation },
  ] = await Promise.all([
    supabase.from("payments").select("*").eq("order_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("order_proofs").select("*").eq("order_id", id).order("sort_order"),
    supabase.from("deliverables").select("*").eq("order_id", id).order("sort_order"),
    supabase.from("order_status_history").select("*").eq("order_id", id).order("created_at"),
    supabase.from("order_reviews").select("*").eq("order_id", id).maybeSingle(),
    profile?.account_manager_id
      ? supabase.from("account_managers").select("*").eq("id", profile.account_manager_id).single()
      : supabase.from("account_managers").select("*").eq("is_active", true).limit(1).single(),
    service.category_id
      ? supabase
          .from("services")
          .select("name, slug, price")
          .eq("category_id", service.category_id)
          .eq("is_active", true)
          .neq("id", service.id)
          .limit(3)
      : Promise.resolve({ data: [] }),
    supabase.from("quotations").select("commission_amount").eq("order_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  return (
    <PartnerPageShell>
      <OrderDeliveryView
        order={order}
        service={service}
        project={project}
        categoryName={category?.name || "Services"}
        payment={payment}
        proofs={proofs || []}
        deliverables={deliverables || []}
        history={history || []}
        review={review}
        manager={manager}
        relatedServices={related || []}
        quotationCommission={quotation?.commission_amount}
      />
    </PartnerPageShell>
  );
}
