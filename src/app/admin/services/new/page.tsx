import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ServiceFormPage } from "@/components/admin/service-form-page";

export default async function NewServicePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("service_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (!categories?.length) {
    redirect("/admin/services");
  }

  return <ServiceFormPage mode="create" categories={categories} />;
}
