import { formatCurrency } from "@/lib/commission";
import type { PricingModel, Service } from "@/types/database";

export const PRICING_CTA: Record<PricingModel, string> = {
  fixed: "Order Now",
  quote: "Request Quote",
  enterprise: "Book Consultation",
};

export const PRICING_PACKAGE: Record<PricingModel, string> = {
  fixed: "Package A — Self Service",
  quote: "Package B — Managed Service",
  enterprise: "Package C — Enterprise Service",
};

export function getServicePriceLabel(service: Pick<Service, "pricing_model" | "price" | "service_fee">) {
  if (service.pricing_model === "fixed" && service.price != null) {
    return formatCurrency(service.price);
  }
  if (service.pricing_model === "enterprise") {
    if (service.service_fee != null) return `From ${formatCurrency(service.service_fee)}`;
    return "Consultation Required";
  }
  return "Custom Quote";
}

export function getServicePriceHeadline(service: Pick<Service, "pricing_model" | "price" | "service_fee">) {
  if (service.pricing_model === "fixed" && service.price != null) {
    return formatCurrency(service.price);
  }
  if (service.pricing_model === "enterprise" && service.service_fee != null) {
    return `Service Fee: ${formatCurrency(service.service_fee)}`;
  }
  if (service.pricing_model === "enterprise") {
    return "Consultation Required";
  }
  return "Custom Quote";
}

export function getServiceCommissionPreview(
  service: Pick<Service, "pricing_model" | "price" | "commission_type" | "commission_value">
) {
  if (service.pricing_model !== "fixed" || service.price == null) {
    return null;
  }
  if (service.commission_type === "percentage") {
    return (service.price * service.commission_value) / 100;
  }
  return service.commission_value;
}
