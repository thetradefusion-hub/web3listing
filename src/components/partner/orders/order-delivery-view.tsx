"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link2,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeliveryTimeline } from "@/components/shared/delivery-timeline";
import { OrderReviewForm } from "@/components/partner/orders/order-review-form";
import { calculateOrderCommission, formatCurrency, isCommissionEligibleStatus } from "@/lib/commission";
import type {
  AccountManager,
  Deliverable,
  Order,
  OrderProof,
  OrderReview,
  OrderStatus,
  OrderStatusHistory,
  Payment,
  Project,
  Service,
} from "@/types/database";
import { cn } from "@/lib/utils";

function ProofCard({ proof }: { proof: OrderProof }) {
  const Icon = proof.proof_type === "screenshot" ? ImageIcon : proof.proof_type === "document" ? FileText : Link2;
  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      <div className="flex h-20 items-center justify-center bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] sm:h-24">
        {proof.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={proof.thumbnail_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon className="h-7 w-7 text-[#635BFF] sm:h-8 sm:w-8" strokeWidth={1.75} />
        )}
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-xs font-semibold leading-snug text-[#0F172A]">{proof.title}</p>
        <a
          href={proof.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#635BFF] hover:underline"
        >
          {proof.proof_type === "link" ? "Open Link" : "View"}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

export function OrderDeliveryView({
  order,
  service,
  project,
  categoryName,
  payment,
  proofs,
  deliverables,
  history,
  review,
  manager,
  relatedServices,
  quotationCommission,
}: {
  order: Order;
  service: Service;
  project: Project;
  categoryName: string;
  payment: Payment | null;
  proofs: OrderProof[];
  deliverables: Deliverable[];
  history: OrderStatusHistory[];
  review: OrderReview | null;
  manager: AccountManager | null;
  relatedServices: { name: string; slug: string; price: number | null }[];
  quotationCommission?: number | null;
}) {
  const commission = calculateOrderCommission(service, {
    quotationCommission,
    paymentAmount: payment?.amount,
  });

  const servicePrice = payment?.amount ?? service.price ?? 0;
  const completedDate = order.completed_at || order.delivery_date || order.updated_at;
  const isComplete = isCommissionEligibleStatus(order.status);

  const downloadUrls = deliverables
    .map((d) => d.file_url)
    .filter(Boolean) as string[];

  const sidebarSummary = (
    <>
      {manager && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF]">
              <User className="h-5 w-5 text-[#635BFF]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#0F172A]">{manager.name}</p>
              <p className="text-xs text-[#94A3B8]">Account Manager</p>
            </div>
          </div>
          {manager.telegram_link && (
            <a
              href={manager.telegram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex h-10 w-full items-center justify-center rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] text-sm font-semibold text-[#2563EB] hover:bg-[#DBEAFE]"
            >
              Message on Telegram
            </a>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <h3 className="text-sm font-bold text-[#0F172A]">Order Summary</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-3 text-[#64748B]">
            <dt>Service Price</dt>
            <dd className="font-semibold text-[#0F172A]">{formatCurrency(servicePrice)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-[#F1F5F9] pt-2 font-bold">
            <dt className="text-[#0F172A]">Total Amount</dt>
            <dd className="text-[#635BFF]">{formatCurrency(servicePrice)}</dd>
          </div>
        </dl>
        {commission > 0 && (
          <div className="mt-3 rounded-xl bg-[#ECFDF5] px-3 py-2.5 text-center text-sm">
            Your Earnings ({service.commission_value}%):{" "}
            <span className="font-bold text-[#059669]">{formatCurrency(commission)}</span>
          </div>
        )}
      </div>

      {relatedServices.length > 0 && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#0F172A]">Recommended Next Steps</h3>
          <div className="mt-3 space-y-2">
            {relatedServices.map((s) => (
              <div
                key={s.slug}
                className="flex items-center justify-between gap-2 rounded-xl border border-[#F1F5F9] px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#0F172A]">{s.name}</p>
                  {s.price != null && (
                    <p className="text-[11px] text-[#94A3B8]">{formatCurrency(s.price)}</p>
                  )}
                </div>
                <Button size="sm" className="h-7 shrink-0 rounded-lg bg-[#635BFF] px-2.5 text-[10px]" asChild>
                  <Link href={`/partner/services/${s.slug}`}>Order</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start gap-2.5 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
        <p className="text-xs leading-relaxed text-[#475569]">
          <span className="font-semibold text-[#2563EB]">Safe & Secure:</span> Your payment and
          data are 100% secure with us.
        </p>
      </div>
    </>
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-lg" asChild>
            <Link href={`/partner/orders/${order.id}`} aria-label="Back to order">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#0F172A] sm:text-2xl">Service Delivery</h1>
            <nav className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[#94A3B8] sm:text-sm">
              <Link href="/partner/orders" className="hover:text-[#635BFF]">My Orders</Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <Link href={`/partner/orders/${order.id}`} className="truncate hover:text-[#635BFF]">
                #{order.order_number}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[#64748B]">Delivery</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Order overview */}
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] lg:items-start lg:gap-5">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-sm font-bold text-[#635BFF] sm:h-14 sm:w-14">
              {(project.token_symbol || project.project_name).slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-[#0F172A] sm:text-lg">{project.project_name}</p>
              <p className="text-xs text-[#64748B] sm:text-sm">{project.blockchain_network}</p>
              <Button variant="outline" size="sm" className="mt-2 h-8 rounded-lg text-xs" asChild>
                <Link href={`/partner/projects/${project.id}`}>View Project</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#F1F5F9] pt-4 text-sm sm:grid-cols-3 lg:border-t-0 lg:pt-0">
            {[
              ["Order ID", order.order_number],
              ["Service", service.name],
              ["Category", categoryName],
              ["Order Date", new Date(order.created_at).toLocaleDateString()],
              ["Completed", new Date(completedDate).toLocaleDateString()],
              ["Payment", payment ? `${formatCurrency(payment.amount)}` : "—"],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8] sm:text-[11px]">
                  {label}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold text-[#0F172A] sm:text-sm" title={String(value)}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {isComplete && (
            <div className="flex items-center justify-center gap-3 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 lg:flex-col lg:px-5 lg:py-4">
              <CheckCircle2 className="h-8 w-8 shrink-0 text-[#059669] sm:h-10 sm:w-10" strokeWidth={2} />
              <p className="text-sm font-bold tracking-wide text-[#059669]">COMPLETED</p>
            </div>
          )}
        </div>
      </section>

      {/* Mobile summary strip — earnings quick view */}
      {commission > 0 && (
        <div className="rounded-xl bg-[#ECFDF5] px-4 py-3 text-center text-sm lg:hidden">
          Your Earnings ({service.commission_value}%):{" "}
          <span className="font-bold text-[#059669]">{formatCurrency(commission)}</span>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_272px] lg:items-start lg:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4 sm:space-y-5">
          {isComplete && (
            <div className="flex flex-col gap-3 rounded-2xl border border-[#A7F3D0] bg-gradient-to-r from-[#ECFDF5] to-[#F0FDF4] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="min-w-0">
                <p className="font-bold text-[#065F46]">Great news!</p>
                <p className="mt-1 text-sm text-[#047857]">
                  The requested service has been completed successfully.
                </p>
              </div>
              {order.completion_report_url && (
                <Button className="w-full shrink-0 rounded-xl bg-[#059669] hover:bg-[#047857] sm:w-auto" asChild>
                  <a href={order.completion_report_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Download Completion Report</span>
                    <span className="sm:hidden">Download Report</span>
                  </a>
                </Button>
              )}
            </div>
          )}

          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-base font-bold text-[#0F172A]">Delivery Summary</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {[
                ["Service Name", service.name],
                ["Start Date", order.started_at ? new Date(order.started_at).toLocaleDateString() : "—"],
                ["Completion Date", new Date(completedDate).toLocaleDateString()],
                ["Estimated TAT", service.estimated_tat || "—"],
                ["Actual TAT", order.actual_tat || "—"],
                ["Account Manager", manager?.name || "Dedicated Manager"],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 rounded-xl border border-[#F1F5F9] bg-[#FAFBFC] px-3.5 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8] sm:text-[11px]">
                    {label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 truncate text-sm font-semibold",
                      label === "Actual TAT" && order.actual_tat
                        ? "text-[#059669]"
                        : "text-[#0F172A]"
                    )}
                    title={String(value)}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {proofs.length > 0 && (
            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5">
              <h3 className="text-base font-bold text-[#0F172A]">Proof of Work</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {proofs.map((p) => (
                  <ProofCard key={p.id} proof={p} />
                ))}
              </div>
            </section>
          )}

          {deliverables.length > 0 && (
            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-[#0F172A]">Deliverable Files</h3>
                {downloadUrls.length > 1 && (
                  <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs" asChild>
                    <a href={downloadUrls[0]} target="_blank" rel="noopener noreferrer">
                      Download All
                    </a>
                  </Button>
                )}
              </div>
              <div className="mt-4 space-y-2">
                {deliverables.map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-col gap-3 rounded-xl border border-[#F1F5F9] bg-[#FAFBFC] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#635BFF]">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0F172A]">{d.title}</p>
                        <p className="text-[11px] text-[#94A3B8]">
                          {[d.file_type, d.file_size].filter(Boolean).join(" · ") ||
                            new Date(d.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:shrink-0">
                      {d.file_url && (
                        <Button size="sm" variant="outline" className="h-8 flex-1 rounded-lg text-xs sm:flex-none" asChild>
                          <a href={d.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-1 h-3.5 w-3.5" />
                            Download
                          </a>
                        </Button>
                      )}
                      {d.external_link && (
                        <Button size="sm" variant="outline" className="h-8 flex-1 rounded-lg text-xs sm:flex-none" asChild>
                          <a href={d.external_link} target="_blank" rel="noopener noreferrer">
                            Open Link
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-base font-bold text-[#0F172A]">Order Timeline</h3>
            <div className="mt-4 min-w-0">
              <DeliveryTimeline
                history={history}
                orderCreatedAt={order.created_at}
                paymentVerifiedAt={payment?.verified_at}
                startedAt={order.started_at}
                completedAt={order.completed_at}
                currentStatus={order.status as OrderStatus}
              />
            </div>
          </section>

          {order.team_notes && (
            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5">
              <h3 className="text-base font-bold text-[#0F172A]">Notes from Our Team</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{order.team_notes}</p>
            </section>
          )}

          {isComplete && <OrderReviewForm orderId={order.id} existingReview={review} />}
        </div>

        {/* Sidebar — desktop */}
        <aside className="hidden space-y-4 lg:block">{sidebarSummary}</aside>
      </div>

      {/* Sidebar — mobile/tablet below main content */}
      <aside className="space-y-4 lg:hidden">{sidebarSummary}</aside>
    </div>
  );
}
