"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { upsertService } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { Service, ServiceCategory, PricingModel, CommissionType } from "@/types/database";

type ServiceFormDialogProps = {
  categories: ServiceCategory[];
  service?: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ServiceFormFields({
  categories,
  service,
  onClose,
}: {
  categories: ServiceCategory[];
  service?: Service;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(service?.category_id || categories[0]?.id || "");
  const [pricingModel, setPricingModel] = useState<PricingModel>(service?.pricing_model || "fixed");
  const [commissionType, setCommissionType] = useState<CommissionType>(
    service?.commission_type || "percentage"
  );
  const [isActive, setIsActive] = useState(service?.is_active ?? true);
  const [requiresAck, setRequiresAck] = useState(service?.requires_third_party_ack ?? false);

  useEffect(() => {
    if (service) {
      setCategoryId(service.category_id);
      setPricingModel(service.pricing_model);
      setCommissionType(service.commission_type);
      setIsActive(service.is_active);
      setRequiresAck(service.requires_third_party_ack);
    }
  }, [service]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const result = await upsertService(
      {
        category_id: categoryId,
        name: form.get("name") as string,
        slug: (form.get("slug") as string) || undefined,
        description: (form.get("description") as string) || null,
        pricing_model: pricingModel,
        price: pricingModel === "fixed" ? Number(form.get("price")) || null : null,
        commission_type: commissionType,
        commission_value: Number(form.get("commission_value")),
        estimated_tat: (form.get("estimated_tat") as string) || null,
        payment_terms: (form.get("payment_terms") as string) || null,
        sort_order: Number(form.get("sort_order")) || 0,
        is_active: isActive,
        requires_third_party_ack: requiresAck,
      },
      service?.id
    );

    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(service ? "Service updated!" : "Service created!");
    onClose();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Service Name *</Label>
          <Input id="name" name="name" defaultValue={service?.name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={service?.slug}
            placeholder="auto-generated from name"
          />
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={service?.description || ""}
          />
        </div>

        <div className="space-y-2">
          <Label>Pricing Model *</Label>
          <Select
            value={pricingModel}
            onValueChange={(v) => v && setPricingModel(v as PricingModel)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Price</SelectItem>
              <SelectItem value="quote">Custom Quote</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {pricingModel === "fixed" && (
          <div className="space-y-2">
            <Label htmlFor="price">Price (USD) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={service?.price ?? ""}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Commission Type *</Label>
          <Select
            value={commissionType}
            onValueChange={(v) => v && setCommissionType(v as CommissionType)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="commission_value">Commission Value *</Label>
          <Input
            id="commission_value"
            name="commission_value"
            type="number"
            min="0"
            step="0.01"
            defaultValue={service?.commission_value ?? 10}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimated_tat">Estimated TAT</Label>
          <Input
            id="estimated_tat"
            name="estimated_tat"
            defaultValue={service?.estimated_tat || ""}
            placeholder="e.g. 3-5 business days"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_terms">Payment Terms</Label>
          <Input
            id="payment_terms"
            name="payment_terms"
            defaultValue={service?.payment_terms || "100% Advance"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={service?.sort_order ?? 0}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(v === true)} />
          Active (visible to agents)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={requiresAck} onCheckedChange={(v) => setRequiresAck(v === true)} />
          Requires third-party acknowledgment
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={loading || !categoryId}
          className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
        >
          {loading ? "Saving..." : service ? "Update Service" : "Create Service"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function ServiceFormDialog({
  categories,
  service,
  open,
  onOpenChange,
}: ServiceFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <DialogContent className="max-h-[min(92vh,880px)] w-full max-w-[calc(100%-1.5rem)] overflow-y-auto p-6 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
          </DialogHeader>
          <ServiceFormFields
            categories={categories}
            service={service}
            onClose={() => onOpenChange(false)}
          />
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

export function AddServiceButton({ categories }: { categories: ServiceCategory[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg hover:opacity-90"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Service
      </Button>
      <ServiceFormDialog categories={categories} open={open} onOpenChange={setOpen} />
    </>
  );
}
