import { createClient } from "@/lib/supabase/server";

import { getCurrentUser } from "@/lib/auth";

import {

  filterServices,

  getCategoryCounts,

  getUniquePaymentOptions,

  getUniqueTatOptions,

} from "@/lib/service-catalog";

import { ServiceCatalogView } from "@/components/partner/services/service-catalog-view";

import { rel } from "@/components/partner/ui";



const PAGE_SIZE = 10;



export default async function PartnerServicesPage({

  searchParams,

}: {

  searchParams: Promise<{

    project?: string;

    category?: string;

    q?: string;

    minPrice?: string;

    maxPrice?: string;

    tat?: string;

    payment?: string;

    page?: string;

  }>;

}) {

  const params = await searchParams;

  const profile = await getCurrentUser();

  const supabase = await createClient();



  const [{ data: allServices }, { data: categories }, { data: manager }, projectResult] = await Promise.all([

    supabase.from("services").select("*, service_categories(name, slug)").eq("is_active", true).order("sort_order"),

    supabase.from("service_categories").select("*").eq("is_active", true).order("sort_order"),

    profile?.account_manager_id

      ? supabase.from("account_managers").select("telegram_link").eq("id", profile.account_manager_id).single()

      : supabase.from("account_managers").select("telegram_link").eq("is_active", true).limit(1).single(),

    params.project

      ? supabase

          .from("projects")

          .select("id, project_name, token_symbol, logo_url, blockchain_network")

          .eq("id", params.project)

          .single()

      : Promise.resolve({ data: null }),

  ]);



  const servicesWithCategory = (allServices || []).map((s) => ({

    ...s,

    service_categories: rel(s.service_categories),

  }));



  const filtered = filterServices(servicesWithCategory, {

    q: params.q,

    category: params.category,

    categories: categories || [],

    minPrice: params.minPrice,

    maxPrice: params.maxPrice,

    tat: params.tat,

    payment: params.payment,

  });



  const page = Math.max(1, Number(params.page) || 1);

  const total = filtered.length;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);



  const projectQuery = params.project ? `?project=${params.project}` : "";

  const emptyHref = `/partner/services${projectQuery}`;

  const baseQuery = new URLSearchParams();

  if (params.project) baseQuery.set("project", params.project);

  if (params.category) baseQuery.set("category", params.category);

  if (params.q) baseQuery.set("q", params.q);

  if (params.minPrice) baseQuery.set("minPrice", params.minPrice);

  if (params.maxPrice) baseQuery.set("maxPrice", params.maxPrice);

  if (params.tat) baseQuery.set("tat", params.tat);

  if (params.payment) baseQuery.set("payment", params.payment);

  if (page > 1) baseQuery.set("page", String(page));



  const categoryCounts = getCategoryCounts(servicesWithCategory);

  const featuredCount = servicesWithCategory.filter((s) => s.badge === "hot" || s.badge === "popular").length;

  const activeCategoryName = params.category

    ? categories?.find((c) => c.slug === params.category)?.name

    : undefined;



  return (

    <ServiceCatalogView

      paged={paged}

      total={total}

      totalAll={servicesWithCategory.length}

      totalPages={totalPages}

      page={page}

      pageSize={PAGE_SIZE}

      baseQuery={`?${baseQuery.toString()}`}

      projectQuery={projectQuery}

      emptyHref={emptyHref}

      categories={categories || []}

      categoryCounts={categoryCounts}

      tatOptions={getUniqueTatOptions(servicesWithCategory)}

      paymentOptions={getUniquePaymentOptions(servicesWithCategory)}

      managerTelegramLink={manager?.telegram_link}

      project={projectResult.data}

      featuredCount={featuredCount}

      activeCategoryName={activeCategoryName}

    />

  );

}

