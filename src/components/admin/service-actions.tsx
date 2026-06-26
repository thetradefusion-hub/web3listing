"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteService } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import type { Service, ServiceCategory } from "@/types/database";

export function ServiceActions({
  service,
  categories: _categories,
  orderCount = 0,
}: {
  service: Service;
  categories: ServiceCategory[];
  orderCount?: number;
}) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const canDelete = orderCount === 0;

  async function handleDelete() {
    if (!canDelete) return;
    setLoading(true);
    const result = await deleteService(service.id);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(`"${service.name}" deleted`);
    setDeleteOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="outline" className="rounded-xl" asChild>
          <Link href={`/admin/services/${service.id}/edit`}>
            <Pencil data-icon="inline-start" />
            Edit
          </Link>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDeleteOpen(true)}
          className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 data-icon="inline-start" />
          Delete
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete service?</DialogTitle>
            <DialogDescription>
              {canDelete ? (
                <>
                  <span className="font-medium text-foreground">&ldquo;{service.name}&rdquo;</span> will be
                  permanently removed from the catalog. This cannot be undone.
                </>
              ) : (
                <>
                  <span className="font-medium text-foreground">&ldquo;{service.name}&rdquo;</span> has{" "}
                  {orderCount} existing order{orderCount === 1 ? "" : "s"} and cannot be deleted. Deactivate it
                  from the edit page instead, or reassign those orders first.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            {canDelete ? (
              <Button variant="destructive" onClick={handleDelete} disabled={loading} className="rounded-xl">
                {loading ? (
                  <>
                    <Loader2 data-icon="inline-start" className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete permanently"
                )}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-xl">
                Understood
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
