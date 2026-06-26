import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageShell } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/service-form";
import { Button } from "@/components/ui/button";
import type { Service, ServiceCategory } from "@/types/database";

export function ServiceFormPage({
  mode,
  categories,
  service,
}: {
  mode: "create" | "edit";
  categories: ServiceCategory[];
  service?: Service;
}) {
  const isEdit = mode === "edit";

  return (
    <AdminPageShell compact fullWidth className="w-full">
      <div className="flex w-full flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit rounded-xl px-0 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/admin/services">
            <ArrowLeft data-icon="inline-start" />
            Back to services
          </Link>
        </Button>

        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/admin" className="transition hover:text-primary">
              Admin
            </Link>
            <span aria-hidden>›</span>
            <Link href="/admin/services" className="transition hover:text-primary">
              Services
            </Link>
            <span aria-hidden>›</span>
            <span className="font-medium text-foreground">{isEdit ? "Edit" : "New"}</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {isEdit ? `Edit — ${service?.name}` : "Add new service"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEdit
              ? "Update catalog details, pricing, and visibility."
              : "Create a new listing for partner and user marketplaces."}
          </p>
        </div>

        <ServiceForm categories={categories} service={service} />
      </div>
    </AdminPageShell>
  );
}
