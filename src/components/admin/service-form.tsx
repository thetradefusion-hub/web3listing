"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { upsertService } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import {
  arrayToLines,
  faqsToLines,
  linesToArray,
  linesToFaqs,
  linesToProcessSteps,
  processStepsToLines,
} from "@/components/admin/service-form-utils";
import type { CommissionType, PricingModel, Service, ServiceCategory } from "@/types/database";

const inputClass = "h-11 rounded-xl";
const textareaClass = "rounded-xl";

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card size="sm" className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  htmlFor,
  className,
  children,
  required,
}: {
  label: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-2 block">
        {label}
        {required ? " *" : ""}
      </Label>
      {children}
    </div>
  );
}

export function ServiceForm({
  categories,
  service,
  cancelHref = "/admin/services",
}: {
  categories: ServiceCategory[];
  service?: Service;
  cancelHref?: string;
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

    toast.success(service ? "Service updated" : "Service created");
    router.push("/admin/services");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-24">
      <FormSection title="Basic information" description="Name, category, and catalog card details">
        <Field label="Service name" htmlFor="name" className="sm:col-span-2 xl:col-span-2" required>
          <Input id="name" name="name" className={inputClass} defaultValue={service?.name} required />
        </Field>
        <Field label="Slug" htmlFor="slug">
          <Input
            id="slug"
            name="slug"
            className={inputClass}
            defaultValue={service?.slug}
            placeholder="auto-generated from name"
          />
        </Field>
        <Field label="Category" required>
          <Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)}>
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Select category">
                {categories.find((c) => c.id === categoryId)?.name ?? "Select category"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Short description" htmlFor="description" className="sm:col-span-2 xl:col-span-3">
          <Textarea
            id="description"
            name="description"
            rows={3}
            className={textareaClass}
            defaultValue={service?.description || ""}
            placeholder="Shown on catalog cards"
          />
        </Field>
        <Field label="Display badge">
          <Select value={badge} onValueChange={(v) => v && setBadge(v as typeof badge)}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="new">New</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Logo URL" htmlFor="logo_url">
          <Input
            id="logo_url"
            name="logo_url"
            className={inputClass}
            defaultValue={service?.logo_url || ""}
            placeholder="https://..."
          />
        </Field>
      </FormSection>

      <FormSection title="Detail page content" description="Overview, deliverables, and process">
        <Field label="Overview" htmlFor="overview" className="sm:col-span-2 xl:col-span-3">
          <Textarea id="overview" name="overview" rows={5} className={textareaClass} defaultValue={service?.overview || ""} />
        </Field>
        <Field label="What's included" htmlFor="whats_included" className="sm:col-span-2 xl:col-span-3">
          <Textarea
            id="whats_included"
            name="whats_included"
            rows={4}
            className={textareaClass}
            defaultValue={arrayToLines(service?.whats_included)}
            placeholder="One item per line"
          />
        </Field>
        <Field label="Process steps" htmlFor="process_steps" className="sm:col-span-2 xl:col-span-3">
          <Textarea
            id="process_steps"
            name="process_steps"
            rows={4}
            className={textareaClass}
            defaultValue={processStepsToLines(service?.process_steps)}
            placeholder="Title | description (one per line)"
          />
        </Field>
        <Field label="Supported platforms" htmlFor="supported_platforms" className="sm:col-span-2 xl:col-span-3">
          <Textarea
            id="supported_platforms"
            name="supported_platforms"
            rows={3}
            className={textareaClass}
            defaultValue={arrayToLines(service?.supported_platforms)}
            placeholder="One platform per line"
          />
        </Field>
        <Field label="FAQs" htmlFor="faqs" className="sm:col-span-2 xl:col-span-3">
          <Textarea
            id="faqs"
            name="faqs"
            rows={4}
            className={textareaClass}
            defaultValue={faqsToLines(service?.faqs)}
            placeholder="Question | answer (one per line)"
          />
        </Field>
      </FormSection>

      <FormSection title="Links & metadata" description="Demo, proof of work, and listing details">
        <Field label="Demo link" htmlFor="demo_link">
          <Input id="demo_link" name="demo_link" className={inputClass} defaultValue={service?.demo_link || ""} />
        </Field>
        <Field label="Proof of work URL" htmlFor="proof_of_work_url">
          <Input
            id="proof_of_work_url"
            name="proof_of_work_url"
            className={inputClass}
            defaultValue={service?.proof_of_work_url || ""}
          />
        </Field>
        <Field label="Proof of work text" htmlFor="proof_of_work" className="sm:col-span-2 xl:col-span-3">
          <Textarea
            id="proof_of_work"
            name="proof_of_work"
            rows={3}
            className={textareaClass}
            defaultValue={service?.proof_of_work || ""}
          />
        </Field>
        <Field label="Listing type" htmlFor="listing_type">
          <Input
            id="listing_type"
            name="listing_type"
            className={inputClass}
            defaultValue={service?.listing_type || ""}
            placeholder="e.g. CEX Listing"
          />
        </Field>
        <Field label="Networks" htmlFor="networks">
          <Textarea
            id="networks"
            name="networks"
            className="min-h-[88px] rounded-xl"
            defaultValue={service?.networks || ""}
            placeholder={"One network per line, or comma-separated\ne.g. Ethereum (ERC-20), BSC, Polygon"}
          />
        </Field>
      </FormSection>

      <FormSection title="Pricing & commission" description="How this service is priced and credited">
        <Field label="Pricing model" required>
          <Select value={pricingModel} onValueChange={(v) => v && setPricingModel(v as PricingModel)}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="fixed">Fixed price</SelectItem>
                <SelectItem value="quote">Custom quote</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        {pricingModel === "fixed" ? (
          <Field label="Price (USD)" htmlFor="price" required>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              className={inputClass}
              defaultValue={service?.price ?? ""}
              required
            />
          </Field>
        ) : (
          <div className="hidden sm:block" />
        )}
        <Field label="Platform fee (USD)" htmlFor="service_fee">
          <Input
            id="service_fee"
            name="service_fee"
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            defaultValue={service?.service_fee ?? 0}
          />
        </Field>
        <Field label="Third-party fee note" htmlFor="third_party_fee_note" className="sm:col-span-2 xl:col-span-3">
          <Input
            id="third_party_fee_note"
            name="third_party_fee_note"
            className={inputClass}
            defaultValue={service?.third_party_fee_note || ""}
          />
        </Field>
        <Field label="Commission type" required>
          <Select value={commissionType} onValueChange={(v) => v && setCommissionType(v as CommissionType)}>
            <SelectTrigger className={inputClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed amount</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Commission value" htmlFor="commission_value" required>
          <Input
            id="commission_value"
            name="commission_value"
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            defaultValue={service?.commission_value ?? 10}
            required
          />
        </Field>
        <Field label="Estimated TAT" htmlFor="estimated_tat">
          <Input
            id="estimated_tat"
            name="estimated_tat"
            className={inputClass}
            defaultValue={service?.estimated_tat || ""}
            placeholder="e.g. 3-5 business days"
          />
        </Field>
        <Field label="Payment terms" htmlFor="payment_terms">
          <Input
            id="payment_terms"
            name="payment_terms"
            className={inputClass}
            defaultValue={service?.payment_terms || "100% Advance"}
          />
        </Field>
        <Field label="Sort order" htmlFor="sort_order">
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            className={inputClass}
            defaultValue={service?.sort_order ?? 0}
          />
        </Field>
      </FormSection>

      <FormSection title="Policies & requirements" description="Terms, refunds, and documents">
        <Field label="Requirements" htmlFor="required_documents" className="sm:col-span-2 xl:col-span-3">
          <Textarea
            id="required_documents"
            name="required_documents"
            rows={3}
            className={textareaClass}
            defaultValue={(service?.required_documents || []).join("\n")}
            placeholder="One requirement per line"
          />
        </Field>
        <Field label="Terms & conditions" htmlFor="terms_conditions" className="sm:col-span-2 xl:col-span-3">
          <Textarea
            id="terms_conditions"
            name="terms_conditions"
            rows={4}
            className={textareaClass}
            defaultValue={service?.terms_conditions || ""}
          />
        </Field>
        <Field label="Refund policy" htmlFor="refund_policy" className="sm:col-span-2 xl:col-span-3">
          <Input id="refund_policy" name="refund_policy" className={inputClass} defaultValue={service?.refund_policy || ""} />
        </Field>
      </FormSection>

      <Card size="sm">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-base">Visibility</CardTitle>
          <CardDescription>Control catalog availability and order flow</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-6">
          <label className="flex items-center gap-3 text-sm">
            <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(v === true)} />
            Active — visible in partner and user catalogs
          </label>
          <Separator />
          <label className="flex items-center gap-3 text-sm">
            <Checkbox checked={requiresAck} onCheckedChange={(v) => setRequiresAck(v === true)} />
            Requires third-party acknowledgment before order
          </label>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 z-10 mt-2 border-t border-border bg-background/95 px-1 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button type="button" variant="outline" className="rounded-xl" asChild>
            <Link href={cancelHref}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading || !categoryId} className="min-w-[160px] rounded-xl">
            {loading ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                Saving...
              </>
            ) : service ? (
              "Update service"
            ) : (
              "Create service"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function AddServiceButton() {
  return (
    <Button asChild className="h-11 rounded-xl shadow-sm">
      <Link href="/admin/services/new">
        <Plus data-icon="inline-start" />
        Add Service
      </Link>
    </Button>
  );
}
