"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleServiceActive } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { ServiceFormDialog } from "@/components/admin/service-form-dialog";
import { toast } from "sonner";
import { Pencil, Power } from "lucide-react";
import type { Service, ServiceCategory } from "@/types/database";

export function ServiceActions({
  service,
  categories,
}: {
  service: Service;
  categories: ServiceCategory[];
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const result = await toggleServiceActive(service.id, !service.is_active);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(service.is_active ? "Service deactivated" : "Service activated");
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditOpen(true)}
          className="gap-1 rounded-xl border-slate-200"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleToggle}
          disabled={loading}
          className="gap-1 rounded-xl border-slate-200"
        >
          <Power className="h-3.5 w-3.5" />
          {service.is_active ? "Deactivate" : "Activate"}
        </Button>
      </div>

      <ServiceFormDialog
        categories={categories}
        service={service}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
