import { getPublicServicesCatalog } from "@/lib/public-catalog-cache";
import { ServicesMarketplace } from "@/components/public/services/services-marketplace";

export const metadata = { title: "Services" };
export const revalidate = 300;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const { categories, services } = await getPublicServicesCatalog();

  return (
    <ServicesMarketplace
      categories={categories}
      services={services}
      selectedCategorySlug={params.category}
      searchQuery={params.q}
    />
  );
}
