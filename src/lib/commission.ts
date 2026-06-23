export function calculateQuotation(
  vendorCost: number,
  companyMargin: number,
  commissionType: "fixed" | "percentage",
  commissionValue: number
) {
  const clientPrice = vendorCost + companyMargin;
  const commissionAmount =
    commissionType === "percentage"
      ? (clientPrice * commissionValue) / 100
      : commissionValue;
  const companyProfit = clientPrice - vendorCost - commissionAmount;

  return {
    vendor_cost: vendorCost,
    company_margin: companyMargin,
    client_price: clientPrice,
    commission_amount: Math.max(0, commissionAmount),
    company_profit: Math.max(0, companyProfit),
  };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateOrderCommission(
  service: {
    commission_type: "fixed" | "percentage";
    commission_value: number;
    price: number | null;
  },
  options: {
    quotationCommission?: number | null;
    paymentAmount?: number | null;
  } = {}
): number {
  if (options.quotationCommission != null && options.quotationCommission > 0) {
    return options.quotationCommission;
  }

  if (service.commission_type === "percentage") {
    const base = options.paymentAmount ?? service.price;
    if (base != null && base > 0) {
      return (base * service.commission_value) / 100;
    }
  }

  if (service.commission_type === "fixed") {
    return service.commission_value;
  }

  return 0;
}

const COMMISSION_STATUSES = ["completed", "delivered", "closed"] as const;
export function isCommissionEligibleStatus(status: string) {
  return COMMISSION_STATUSES.includes(status as (typeof COMMISSION_STATUSES)[number]);
}
