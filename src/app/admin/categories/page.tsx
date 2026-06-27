import { createClient } from "@/lib/supabase/server";
import {
  AdminCategoriesCatalog,
  AdminCategoriesEmpty,
} from "@/components/admin/admin-categories-catalog";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("service_categories")
    .select("*, services(count)")
    .order("sort_order");

  if (!categories?.length) {
    return <AdminCategoriesEmpty />;
  }

  return <AdminCategoriesCatalog categories={categories} />;
}
