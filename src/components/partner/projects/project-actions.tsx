"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { deleteProject } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Project } from "@/types/database";

export function ProjectActions({
  project,
  orderCount = 0,
  basePath,
  variant = "inline",
  className,
}: {
  project: Project;
  orderCount?: number;
  basePath: string;
  variant?: "inline" | "card";
  className?: string;
}) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const canDelete = orderCount === 0;

  async function handleDelete() {
    if (!canDelete) return;
    setLoading(true);
    const result = await deleteProject(project.id);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(`"${project.project_name}" deleted`);
    setDeleteOpen(false);
    router.push(`${basePath}/projects`);
    router.refresh();
  }

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2",
          variant === "card" && "shrink-0",
          className
        )}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg px-2.5 text-xs font-semibold"
          asChild
        >
          <Link href={`${basePath}/projects/${project.id}/edit`}>
            <Pencil data-icon="inline-start" />
            Edit
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-lg px-2.5 text-xs font-semibold text-destructive hover:text-destructive"
          disabled={!canDelete}
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 data-icon="inline-start" />
          Delete
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>
              {canDelete
                ? `"${project.project_name}" will be permanently removed. This cannot be undone.`
                : "This project has orders linked to it and cannot be deleted."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-xl" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={handleDelete}
              disabled={!canDelete || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
