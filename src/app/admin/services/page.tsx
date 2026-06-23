import { createClient } from "@/lib/supabase/server";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { formatCurrency } from "@/lib/commission";
import type { PricingModel } from "@/types/database";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminBadge,
  AdminEmptyState,
  rel,
} from "@/components/admin/ui";
import {
  MobileDataCard,
  MobileDataRow,
  ResponsiveTableShell,
} from "@/components/shared/responsive-table";
import { AddServiceButton } from "@/components/admin/service-form-dialog";
import { ServiceActions } from "@/components/admin/service-actions";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const [{ data: services }, { data: categories }] = await Promise.all([
    supabase.from("services").select("*, service_categories(name)").order("sort_order"),
    supabase.from("service_categories").select("*").eq("is_active", true).order("sort_order"),
  ]);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Service Management"
        description="Add, edit, and manage the service catalog, pricing, and commissions"
        action={categories && categories.length > 0 ? <AddServiceButton categories={categories} /> : undefined}
      />

      {services && services.length > 0 ? (
        <AdminPanel className="overflow-hidden">
          <ResponsiveTableShell
            table={
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3 font-medium">Service</th>
                    <th className="hidden px-3 py-3 font-medium md:table-cell">Category</th>
                    <th className="px-3 py-3 font-medium">Pricing</th>
                    <th className="hidden px-3 py-3 font-medium lg:table-cell">Commission</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => {
                    const category = rel(service.service_categories);
                    const price =
                      service.pricing_model === "fixed" && service.price
                        ? formatCurrency(service.price)
                        : "Custom";
                    return (
                      <tr key={service.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-slate-900">{service.name}</span>
                            <PricingBadge model={service.pricing_model as PricingModel} />
                          </div>
                        </td>
                        <td className="hidden px-3 py-3.5 text-slate-600 md:table-cell">{category?.name || "—"}</td>
                        <td className="px-3 py-3.5 font-medium text-slate-800">{price}</td>
                        <td className="hidden px-3 py-3.5 text-slate-600 lg:table-cell">
                          {service.commission_value}
                          {service.commission_type === "percentage" ? "%" : " fixed"}
                        </td>
                        <td className="px-3 py-3.5">
                          <AdminBadge variant={service.is_active ? "success" : "muted"}>
                            {service.is_active ? "Active" : "Inactive"}
                          </AdminBadge>
                        </td>
                        <td className="px-5 py-3.5">
                          {categories && (
                            <ServiceActions service={service} categories={categories} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            }
            mobile={
              <>
                {services.map((service) => {
                  const category = rel(service.service_categories);
                  const price =
                    service.pricing_model === "fixed" && service.price
                      ? formatCurrency(service.price)
                      : "Custom";
                  return (
                    <MobileDataCard key={service.id}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900">{service.name}</p>
                          <div className="mt-1">
                            <PricingBadge model={service.pricing_model as PricingModel} />
                          </div>
                        </div>
                        <AdminBadge variant={service.is_active ? "success" : "muted"}>
                          {service.is_active ? "Active" : "Inactive"}
                        </AdminBadge>
                      </div>
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <MobileDataRow label="Category">{category?.name || "—"}</MobileDataRow>
                        <MobileDataRow label="Pricing">{price}</MobileDataRow>
                        <MobileDataRow label="Commission">
                          {service.commission_value}
                          {service.commission_type === "percentage" ? "%" : " fixed"}
                        </MobileDataRow>
                      </div>
                      {categories && (
                        <div className="mt-3 border-t border-slate-100 pt-3">
                          <ServiceActions service={service} categories={categories} />
                        </div>
                      )}
                    </MobileDataCard>
                  );
                })}
              </>
            }
          />
        </AdminPanel>
      ) : (
        <AdminEmptyState
          title="No services"
          description="Click Add Service to create your first catalog entry."
          action={categories && categories.length > 0 ? <AddServiceButton categories={categories} /> : undefined}
        />
      )}
    </AdminPageShell>
  );
}
