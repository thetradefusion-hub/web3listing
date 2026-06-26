import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ServiceFormPage } from "@/components/admin/service-form-page";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: service }, { data: categories }] = await Promise.all([
    supabase.from("services").select("*").eq("id", id).single(),
    supabase.from("service_categories").select("*").eq("is_active", true).order("sort_order"),
  ]);

  if (!service || !categories?.length) {
    notFound();
  }

  return <ServiceFormPage mode="edit" categories={categories} service={service} />;
}
