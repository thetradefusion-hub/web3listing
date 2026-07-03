"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteOrder, reassignOrderService } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRightLeft, Loader2, Trash2 } from "lucide-react";
import type { Service } from "@/types/database";

export function OrderServiceReassign({
  orderId,
  currentServiceId,
  services,
}: {
  orderId: string;
  currentServiceId: string;
  services: Pick<Service, "id" | "name">[];
}) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState("");
  const [loading, setLoading] = useState(false);

  const options = services.filter((s) => s.id !== currentServiceId);

  async function handleReassign() {
    if (!serviceId) {
      toast.error("Select a service first");
      return;
    }
    setLoading(true);
    const result = await reassignOrderService(orderId, serviceId);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Order reassigned to new service");
    setServiceId("");
    router.refresh();
  }

  if (options.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No other services available to reassign. Add another service or delete this order instead.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="reassign-service">Move order to another service</Label>
        <Select value={serviceId} onValueChange={(v) => v && setServiceId(v)}>
          <SelectTrigger id="reassign-service" className="rounded-xl">
            <SelectValue placeholder="Select service..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={handleReassign}
        disabled={loading || !serviceId}
        className="rounded-xl"
      >
        {loading ? (
          <>
            <Loader2 data-icon="inline-start" className="animate-spin" />
            Reassigning...
          </>
        ) : (
          <>
            <ArrowRightLeft data-icon="inline-start" />
            Reassign service
          </>
        )}
      </Button>
    </div>
  );
}

export function OrderDeleter({
  orderId,
  orderNumber,
  serviceName,
}: {
  orderId: string;
  orderNumber: string;
  serviceName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteOrder(orderId);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(`Order #${orderNumber} deleted`);
    setOpen(false);
    router.push("/admin/orders");
    router.refresh();
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 data-icon="inline-start" />
        Delete order
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete order permanently?</DialogTitle>
            <DialogDescription>
              Order <span className="font-medium text-foreground">#{orderNumber}</span> for{" "}
              <span className="font-medium text-foreground">{serviceName}</span> will be removed along
              with its payments, quotations, and delivery records. Commission credited for this order
              will be reversed from the partner wallet. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
              Cancel
            </Button>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
