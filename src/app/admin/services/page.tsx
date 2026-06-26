import { createClient } from "@/lib/supabase/server";
import {
  AdminServicesCatalog,
  AdminServicesEmpty,
} from "@/components/admin/admin-services-catalog";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const [{ data: services }, { data: categories }, { data: orderRows }] = await Promise.all([
    supabase.from("services").select("*, service_categories(name, slug)").order("sort_order"),
    supabase.from("service_categories").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("orders").select("service_id"),
  ]);

  const orderCounts: Record<string, number> = {};
  for (const row of orderRows || []) {
    orderCounts[row.service_id] = (orderCounts[row.service_id] || 0) + 1;
  }

  const categoryList = categories || [];

  if (!services || services.length === 0) {
    return <AdminServicesEmpty categories={categoryList} />;
  }

  return (
    <AdminServicesCatalog
      services={services}
      categories={categoryList}
      orderCounts={orderCounts}
    />
  );
}
