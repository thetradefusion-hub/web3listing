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
import { parseJsonArray } from "@/lib/service-catalog";
import type { Service, ServiceCategory, PricingModel, CommissionType } from "@/types/database";

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function linesToProcessSteps(value: string) {
  return linesToArray(value).map((line) => {
    const [title, ...rest] = line.split("|");
    return { title: title.trim(), description: rest.join("|").trim() || undefined };
  });
}

function linesToFaqs(value: string) {
  return linesToArray(value)
    .map((line) => {
      const [question, ...rest] = line.split("|");
      return { question: question.trim(), answer: rest.join("|").trim() };
    })
    .filter((f) => f.question && f.answer);
}

function arrayToLines(value: unknown) {
  return parseJsonArray<string>(value).join("\n");
}

function processStepsToLines(value: unknown) {
  return parseJsonArray<{ title: string; description?: string }>(value)
    .map((s) => (s.description ? `${s.title} | ${s.description}` : s.title))
    .join("\n");
}

function faqsToLines(value: unknown) {
  return parseJsonArray<{ question: string; answer: string }>(value)
    .map((f) => `${f.question} | ${f.answer}`)
    .join("\n");
}

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
  const [badge, setBadge] = useState<"hot" | "popular" | "new" | "none">(service?.badge || "none");

  useEffect(() => {
    if (service) {
      setCategoryId(service.category_id);
      setPricingModel(service.pricing_model);
      setCommissionType(service.commission_type);
      setIsActive(service.is_active);
      setRequiresAck(service.requires_third_party_ack);
      setBadge(service.badge || "none");
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
        overview: (form.get("overview") as string) || null,
        demo_link: (form.get("demo_link") as string) || null,
        proof_of_work: (form.get("proof_of_work") as string) || null,
        proof_of_work_url: (form.get("proof_of_work_url") as string) || null,
        logo_url: (form.get("logo_url") as string) || null,
        listing_type: (form.get("listing_type") as string) || null,
        networks: (form.get("networks") as string) || null,
        refund_policy: (form.get("refund_policy") as string) || null,
        terms_conditions: (form.get("terms_conditions") as string) || null,
        third_party_fee_note: (form.get("third_party_fee_note") as string) || null,
        whats_included: linesToArray((form.get("whats_included") as string) || ""),
        supported_platforms: linesToArray((form.get("supported_platforms") as string) || ""),
        process_steps: linesToProcessSteps((form.get("process_steps") as string) || ""),
        required_documents: linesToArray((form.get("required_documents") as string) || ""),
        faqs: linesToFaqs((form.get("faqs") as string) || ""),
        pricing_model: pricingModel,
        price: pricingModel === "fixed" ? Number(form.get("price")) || null : null,
        service_fee: Number(form.get("service_fee")) || null,
        commission_type: commissionType,
        commission_value: Number(form.get("commission_value")),
        estimated_tat: (form.get("estimated_tat") as string) || null,
        payment_terms: (form.get("payment_terms") as string) || null,
        sort_order: Number(form.get("sort_order")) || 0,
        is_active: isActive,
        requires_third_party_ack: requiresAck,
        badge: badge === "none" ? null : badge,
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
          <Label htmlFor="description">Short Description (catalog card)</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={service?.description || ""}
          />
        </div>

        <div className="space-y-2">
          <Label>Display Badge</Label>
          <Select value={badge} onValueChange={(v) => v && setBadge(v as typeof badge)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="new">New</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input id="logo_url" name="logo_url" defaultValue={service?.logo_url || ""} placeholder="https://..." />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="overview">Overview (detail page)</Label>
          <Textarea id="overview" name="overview" rows={4} defaultValue={service?.overview || ""} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="whats_included">What&apos;s Included (one per line)</Label>
          <Textarea id="whats_included" name="whats_included" rows={4} defaultValue={arrayToLines(service?.whats_included)} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="process_steps">Process Steps (title | description per line)</Label>
          <Textarea id="process_steps" name="process_steps" rows={4} defaultValue={processStepsToLines(service?.process_steps)} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="supported_platforms">Supported Platforms (one per line)</Label>
          <Textarea id="supported_platforms" name="supported_platforms" rows={3} defaultValue={arrayToLines(service?.supported_platforms)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="demo_link">Demo Link</Label>
          <Input id="demo_link" name="demo_link" defaultValue={service?.demo_link || ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proof_of_work_url">Proof of Work URL</Label>
          <Input id="proof_of_work_url" name="proof_of_work_url" defaultValue={service?.proof_of_work_url || ""} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="proof_of_work">Proof of Work Text</Label>
          <Textarea id="proof_of_work" name="proof_of_work" rows={3} defaultValue={service?.proof_of_work || ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="listing_type">Listing Type</Label>
          <Input id="listing_type" name="listing_type" defaultValue={service?.listing_type || ""} placeholder="e.g. CEX Listing" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="networks">Networks</Label>
          <Input id="networks" name="networks" defaultValue={service?.networks || ""} placeholder="e.g. BSC, ETH" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="required_documents">Requirements (one per line)</Label>
          <Textarea id="required_documents" name="required_documents" rows={3} defaultValue={(service?.required_documents || []).join("\n")} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="faqs">FAQs (question | answer per line)</Label>
          <Textarea id="faqs" name="faqs" rows={4} defaultValue={faqsToLines(service?.faqs)} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="terms_conditions">Terms & Conditions</Label>
          <Textarea id="terms_conditions" name="terms_conditions" rows={3} defaultValue={service?.terms_conditions || ""} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="refund_policy">Refund Policy</Label>
          <Input id="refund_policy" name="refund_policy" defaultValue={service?.refund_policy || ""} />
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
          <Label htmlFor="service_fee">Platform Fee (USD)</Label>
          <Input
            id="service_fee"
            name="service_fee"
            type="number"
            min="0"
            step="0.01"
            defaultValue={service?.service_fee ?? 0}
          />
        </div>

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
          Active (visible to partners)
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
        <DialogContent className="max-h-[min(92vh,900px)] w-full max-w-[calc(100%-1.5rem)] overflow-y-auto p-6 sm:max-w-3xl">
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
