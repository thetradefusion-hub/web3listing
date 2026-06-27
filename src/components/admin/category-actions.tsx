"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteServiceCategory } from "@/lib/actions";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
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
import type { ServiceCategory } from "@/types/database";

export function CategoryActions({
  category,
  serviceCount = 0,
}: {
  category: ServiceCategory;
  serviceCount?: number;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const canDelete = serviceCount === 0;

  async function handleDelete() {
    if (!canDelete) return;
    setLoading(true);
    const result = await deleteServiceCategory(category.id);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(`"${category.name}" deleted`);
    setDeleteOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="outline" className="rounded-xl" onClick={() => setEditOpen(true)}>
          <Pencil data-icon="inline-start" />
          Edit
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

      <CategoryFormDialog open={editOpen} onOpenChange={setEditOpen} category={category} />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>
              {canDelete ? (
                <>
                  <span className="font-medium text-foreground">&ldquo;{category.name}&rdquo;</span> will be
                  permanently removed. This cannot be undone.
                </>
              ) : (
                <>
                  <span className="font-medium text-foreground">&ldquo;{category.name}&rdquo;</span> has{" "}
                  {serviceCount} service{serviceCount === 1 ? "" : "s"} and cannot be deleted. Deactivate it
                  instead, or move those services to another category first.
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
