import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Download,
  ExternalLink,
  FileArchive,
  FileText,
  FolderKanban,
  Package,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentSection, QuotationSection } from "@/components/partner/payment-section";
import { OrderDetailTimeline } from "@/components/partner/orders/order-detail-timeline";
import { OrderStatusBadge } from "@/components/partner/dashboard/ui";
import { calculateOrderCommission, formatCurrency, isCommissionEligibleStatus } from "@/lib/commission";
import type {
  Deliverable,
  Order,
  OrderStatus,
  OrderStatusHistory,
  Payment,
  Project,
  Quotation,
  Service,
} from "@/types/database";
import { cn } from "@/lib/utils";

function DeliverableIcon({ type }: { type: string | null }) {
  const t = (type || "").toUpperCase();
  if (t.includes("ZIP")) return FileArchive;
  return FileText;
}

export function PartnerOrderDetailView({
  order,
  service,
  project,
  payment,
  quotation,
  deliverables,
  history,
}: {
  order: Order;
  service: Service | null;
  project: Project | null;
  payment: Payment | null;
  quotation: Quotation | null;
  deliverables: Deliverable[];
  history: OrderStatusHistory[];
}) {
  const showDelivery = isCommissionEligibleStatus(order.status);
  const commission = service
    ? calculateOrderCommission(service, {
        quotationCommission: quotation?.commission_amount,
        paymentAmount: payment?.amount,
      })
    : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-lg" asChild>
            <Link href="/partner/orders" aria-label="Back to orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-[#0F172A] sm:text-[28px]">
                #{order.order_number}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-sm text-[#64748B]">
              {service?.name || "Service"} · {project?.project_name || "Project"}
            </p>
            <nav className="mt-2 flex items-center gap-1 text-xs text-[#94A3B8]">
              <Link href="/partner/orders" className="hover:text-[#635BFF]">My Orders</Link>
              <ChevronRight className="h-3 w-3" />
              <span>#{order.order_number}</span>
            </nav>
          </div>
        </div>

        {showDelivery && (
          <Button
            className="h-10 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-5 text-sm font-semibold shadow-md shadow-indigo-200/50 hover:from-[#4F46E5] hover:to-[#7C3AED]"
            asChild
          >
            <Link href={`/partner/orders/${order.id}/delivery`}>View Delivery</Link>
          </Button>
        )}
      </div>

      {/* Summary card */}
      <section className="rounded-2xl border border-[#E0E7FF]/80 bg-gradient-to-br from-white via-white to-[#F8FAFF] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF2FF] text-sm font-bold text-[#635BFF] shadow-sm">
              {(project?.token_symbol || project?.project_name || "??").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-[#0F172A]">{project?.project_name || "Project"}</p>
              <p className="text-xs text-[#64748B]">{project?.blockchain_network || "—"}</p>
            </div>
            {project && (
              <Button variant="outline" size="sm" className="ml-1 h-8 rounded-lg text-xs" asChild>
                <Link href={`/partner/projects/${project.id}`}>
                  <FolderKanban className="mr-1.5 h-3.5 w-3.5" />
                  Project
                </Link>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 sm:gap-6">
            {[
              ["Ordered", new Date(order.created_at).toLocaleDateString()],
              ["TAT", service?.estimated_tat || "—"],
              ["Payment", payment ? formatCurrency(payment.amount) : "—"],
              ["Earnings", commission > 0 ? formatCurrency(commission) : "—"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                  {label}
                </p>
                <p
                  className={cn(
                    "mt-0.5 font-bold",
                    label === "Earnings" && commission > 0 ? "text-[#059669]" : "text-[#0F172A]"
                  )}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showDelivery && (
        <div className="flex flex-col gap-3 rounded-2xl border border-[#A7F3D0] bg-gradient-to-r from-[#ECFDF5] to-[#F0FDF4] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-[#059669]" />
            <p className="text-sm font-medium text-[#065F46]">
              Service delivered — view proofs, files, and completion report.
            </p>
          </div>
          <Button size="sm" className="rounded-lg bg-[#059669] hover:bg-[#047857]" asChild>
            <Link href={`/partner/orders/${order.id}/delivery`}>Open Delivery Page</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_1fr]">
        {/* Timeline */}
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF]">
              <Calendar className="h-4 w-4 text-[#635BFF]" />
            </span>
            <h2 className="text-base font-bold text-[#0F172A]">Order Timeline</h2>
          </div>
          <OrderDetailTimeline
            currentStatus={order.status as OrderStatus}
            history={history}
          />
        </section>

        {/* Right column */}
        <div className="space-y-5">
          {quotation && <QuotationSection quotation={quotation} />}
          {payment && <PaymentSection payment={payment} orderId={order.id} />}

          {!quotation && !payment && (
            <section className="rounded-2xl border border-dashed border-[#E2E8F0] bg-[#FAFBFC] p-6 text-center">
              <Package className="mx-auto h-8 w-8 text-[#CBD5E1]" />
              <p className="mt-2 text-sm font-medium text-[#64748B]">Payment details pending</p>
            </section>
          )}

          {order.progress_notes && (
            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#0F172A]">Progress Notes</h2>
              <p className="mt-3 rounded-xl bg-[#FAFBFC] p-4 text-sm leading-relaxed text-[#64748B]">
                {order.progress_notes}
              </p>
            </section>
          )}
        </div>
      </div>

      {/* Deliverables */}
      {deliverables.length > 0 && (
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF]">
                <FileText className="h-4 w-4 text-[#635BFF]" />
              </span>
              <h2 className="text-base font-bold text-[#0F172A]">Deliverables</h2>
            </div>
            {showDelivery && (
              <Link
                href={`/partner/orders/${order.id}/delivery`}
                className="text-xs font-semibold text-[#635BFF] hover:underline"
              >
                View all on Delivery page →
              </Link>
            )}
          </div>

          <div className="space-y-2">
            {deliverables.map((d) => {
              const Icon = DeliverableIcon({ type: d.file_type });
              return (
                <div
                  key={d.id}
                  className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#F1F5F9] bg-gradient-to-r from-[#FAFBFC] to-white px-4 py-3.5 transition-colors hover:border-[#E0E7FF] hover:bg-[#F8FAFF]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#635BFF]">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#0F172A]">{d.title}</p>
                      <p className="text-[11px] text-[#94A3B8]">
                        {[d.file_type, d.file_size].filter(Boolean).join(" · ") ||
                          new Date(d.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {d.file_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg border-[#C7D2FE] text-xs font-semibold text-[#635BFF] hover:bg-[#EEF2FF]"
                        asChild
                      >
                        <a href={d.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-1.5 h-3.5 w-3.5" />
                          Download
                        </a>
                      </Button>
                    )}
                    {d.external_link && (
                      <Button size="sm" variant="ghost" className="h-8 rounded-lg text-xs" asChild>
                        <a href={d.external_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                          Open
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
