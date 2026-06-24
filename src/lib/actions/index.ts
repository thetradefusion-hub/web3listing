"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, credentialsEmail, kycStatusEmail, orderUpdateEmail, quoteReadyEmail, withdrawalStatusEmail } from "@/lib/email";
import { calculateQuotation, calculateOrderCommission, isCommissionEligibleStatus } from "@/lib/commission";
import { MIN_WITHDRAWAL } from "@/lib/constants";
import { requireAuth, isAdminRole } from "@/lib/auth";
import type { OrderStatus, PaymentMethod, WithdrawalStatus } from "@/types/database";

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

export async function createAgentAccount(data: {
  email: string;
  full_name: string;
  company_name?: string;
  telegram_username?: string;
  country?: string;
}) {
  await requireAuth(["super_admin", "operations_manager"]);

  const password = Math.random().toString(36).slice(-10) + "A1!";
  const admin = createAdminClient();

  const { data: authUser, error } = await admin.auth.admin.createUser({
    email: data.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: data.full_name },
  });

  if (error) return { error: error.message };

  await admin.from("profiles").update({
    full_name: data.full_name,
    company_name: data.company_name,
    telegram_username: data.telegram_username,
    country: data.country,
    role: "agent",
    kyc_status: "approved",
  }).eq("id", authUser.user.id);

  const emailContent = credentialsEmail(data.email, password);
  await sendEmail({ to: data.email, ...emailContent });

  revalidatePath("/admin/agents");
  return { success: true, userId: authUser.user.id, password, email: data.email };
}

export async function resetAgentPassword(userId: string) {
  await requireAuth(["super_admin", "operations_manager"]);
  const admin = createAdminClient();

  const password = Math.random().toString(36).slice(-8) + "A1!";
  const { data: profile } = await admin.from("profiles").select("email").eq("id", userId).single();
  if (!profile) return { error: "Agent not found" };

  const { error } = await admin.auth.admin.updateUserById(userId, { password });
  if (error) return { error: error.message };

  const emailContent = credentialsEmail(profile.email, password);
  await sendEmail({ to: profile.email, ...emailContent });

  revalidatePath("/admin/agents");
  return { success: true, password, email: profile.email };
}

export async function approveAgentKyc(userId: string) {
  await requireAuth(["super_admin", "operations_manager"]);
  const admin = createAdminClient();

  await admin.from("profiles").update({ kyc_status: "approved" }).eq("id", userId);
  await admin.from("kyc_submissions").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("user_id", userId);

  revalidatePath("/admin/agents");
  revalidatePath("/admin/kyc");
  return { success: true };
}

export async function updateProfile(data: Record<string, string>) {
  const profile = await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase.from("profiles").update({
    full_name: data.full_name,
    company_name: data.company_name,
    telegram_username: data.telegram_username,
    mobile: data.mobile,
    country: data.country,
    wallet_address: data.wallet_address,
  }).eq("id", profile.id);

  if (error) return { error: error.message };
  revalidatePath("/agent/profile");
  return { success: true };
}

export async function submitKyc(data: Record<string, string>) {
  const profile = await requireAuth();
  const supabase = await createClient();

  await supabase.from("profiles").update({
    full_name: data.full_name,
    company_name: data.company_name,
    mobile: data.mobile,
    telegram_username: data.telegram_username,
    country: data.country,
  }).eq("id", profile.id);

  const { error } = await supabase.from("kyc_submissions").upsert({
    user_id: profile.id,
    passport_url: data.passport_url,
    company_registration_url: data.company_registration_url,
    selfie_url: data.selfie_url,
    tax_document_url: data.tax_document_url,
    status: "pending",
  }, { onConflict: "user_id" });

  if (error) return { error: error.message };
  revalidatePath("/agent/kyc");
  return { success: true };
}

export async function reviewKyc(userId: string, status: "approved" | "rejected", notes?: string) {
  await requireAuth(["super_admin", "operations_manager"]);
  const supabase = await createClient();
  const admin = createAdminClient();

  await admin.from("kyc_submissions").update({
    status,
    review_notes: notes,
    reviewed_at: new Date().toISOString(),
  }).eq("user_id", userId);

  await admin.from("profiles").update({ kyc_status: status }).eq("id", userId);

  const { data: profile } = await admin.from("profiles").select("email").eq("id", userId).single();
  if (profile?.email) {
    const email = kycStatusEmail(status, notes);
    await sendEmail({ to: profile.email, ...email });
  }

  revalidatePath("/admin/kyc");
  return { success: true };
}

async function notifyAdmins(title: string, message: string, link: string, type = "project") {
  const admin = createAdminClient();
  const { data: admins } = await admin
    .from("profiles")
    .select("id")
    .in("role", ["super_admin", "operations_manager", "service_team"]);

  if (!admins?.length) return;

  await admin.from("notifications").insert(
    admins.map((a) => ({ user_id: a.id, title, message, type, link }))
  );
}

async function creditAgentCommission(orderId: string) {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("commission_ledger")
    .select("id")
    .eq("order_id", orderId)
    .eq("type", "credit")
    .maybeSingle();

  if (existing) return;

  const { data: order } = await supabase
    .from("orders")
    .select("id, agent_id, order_number, status, service_id, services(*)")
    .eq("id", orderId)
    .single();

  if (!order || !isCommissionEligibleStatus(order.status)) return;

  const service = Array.isArray(order.services) ? order.services[0] : order.services;
  if (!service) return;

  const [{ data: quotation }, { data: payment }] = await Promise.all([
    supabase
      .from("quotations")
      .select("commission_amount")
      .eq("order_id", orderId)
      .in("status", ["sent", "accepted"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("payments")
      .select("amount")
      .eq("order_id", orderId)
      .eq("status", "confirmed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const commission = calculateOrderCommission(service, {
    quotationCommission: quotation?.commission_amount,
    paymentAmount: payment?.amount,
  });

  if (commission <= 0) return;

  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", order.agent_id)
    .maybeSingle();

  if (!wallet) {
    await supabase.from("wallets").insert({ user_id: order.agent_id });
  }

  const available = Number(wallet?.available_balance || 0);
  const lifetime = Number(wallet?.lifetime_earnings || 0);

  await supabase
    .from("wallets")
    .update({
      available_balance: available + commission,
      lifetime_earnings: lifetime + commission,
    })
    .eq("user_id", order.agent_id);

  await supabase.from("commission_ledger").insert({
    user_id: order.agent_id,
    order_id: orderId,
    amount: commission,
    type: "credit",
    description: `Commission for order ${order.order_number}`,
  });

  await supabase.from("notifications").insert({
    user_id: order.agent_id,
    title: "Commission Credited",
    message: `$${commission.toFixed(2)} added to your wallet for order ${order.order_number}.`,
    type: "commission",
    link: "/agent/wallet",
  });

  revalidatePath("/agent/wallet");
  revalidatePath("/agent");
}

export async function createProject(data: Record<string, string>) {
  const profile = await requireAuth(["agent"]);
  const supabase = await createClient();

  const status = data.status || "draft";
  const { data: project, error } = await supabase.from("projects").insert({
    agent_id: profile.id,
    ...data,
    status,
  }).select().single();

  if (error) return { error: error.message };

  if (status === "submitted") {
    await notifyAdmins(
      "New Project Submitted",
      `${profile.full_name || profile.email} submitted project "${data.project_name}" for review.`,
      `/admin/projects/${project.id}`
    );
  }

  revalidatePath("/agent/projects");
  revalidatePath("/admin/projects");
  return { success: true, project };
}

export async function updateProject(id: string, data: Record<string, string>) {
  const profile = await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase.from("projects").update(data).eq("id", id).eq("agent_id", profile.id);
  if (error) return { error: error.message };

  if (data.status === "submitted") {
    await notifyAdmins(
      "Project Resubmitted",
      `${profile.full_name || profile.email} submitted project "${data.project_name || "a project"}" for review.`,
      `/admin/projects/${id}`
    );
  }

  revalidatePath("/agent/projects");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function reviewProject(projectId: string, status: "approved" | "rejected", notes?: string) {
  await requireAuth(["super_admin", "operations_manager"]);
  const admin = createAdminClient();

  const { data: project } = await admin
    .from("projects")
    .select("agent_id, project_name, status")
    .eq("id", projectId)
    .single();

  if (!project) return { error: "Project not found" };
  if (project.status !== "submitted") return { error: "Only submitted projects can be reviewed" };

  const { error } = await admin.from("projects").update({ status }).eq("id", projectId);
  if (error) return { error: error.message };

  await admin.from("notifications").insert({
    user_id: project.agent_id,
    title: status === "approved" ? "Project Approved" : "Project Rejected",
    message:
      status === "approved"
        ? `Your project "${project.project_name}" has been approved. You can now place orders for this project.`
        : `Your project "${project.project_name}" was rejected.${notes ? ` Reason: ${notes}` : ""}`,
    type: "project",
    link: `/agent/projects/${projectId}`,
  });

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/agent/projects");
  revalidatePath("/admin");
  return { success: true };
}

export async function createOrder(data: {
  project_id: string;
  service_id: string;
  requirements?: string;
  third_party_ack?: boolean;
}) {
  const profile = await requireAuth(["agent"]);
  if (profile.kyc_status !== "approved") {
    return { error: "KYC approval required before placing orders" };
  }

  const supabase = await createClient();
  const { data: service } = await supabase.from("services").select("*").eq("id", data.service_id).single();
  if (!service) return { error: "Service not found" };

  if (service.requires_third_party_ack && !data.third_party_ack) {
    return { error: "You must acknowledge third-party approval terms" };
  }

  if (
    (service.pricing_model === "quote" || service.pricing_model === "enterprise") &&
    !data.requirements?.trim()
  ) {
    return { error: "Requirements are required for this service" };
  }

  const initialStatus: OrderStatus =
    service.pricing_model === "fixed" ? "waiting_payment" : "submitted";

  const { data: order, error } = await supabase.from("orders").insert({
    agent_id: profile.id,
    project_id: data.project_id,
    service_id: data.service_id,
    requirements: data.requirements,
    third_party_ack: data.third_party_ack || false,
    status: initialStatus,
    order_number: "",
  }).select().single();

  if (error) return { error: error.message };

  if (service.pricing_model === "fixed" && service.price) {
    const admin = createAdminClient();
    const { error: paymentError } = await admin.from("payments").insert({
      order_id: order.id,
      amount: service.price,
      method: "usdt",
      status: "pending",
      payment_instructions: "Please send USDT (TRC20) to our wallet. Contact support for payment details.",
    });
    if (paymentError) return { error: paymentError.message };
  }

  await supabase.from("notifications").insert({
    user_id: profile.id,
    title: "Order Created",
    message: `Order ${order.order_number} has been created.`,
    type: "order",
    link: `/agent/orders/${order.id}`,
  });

  revalidatePath("/agent/orders");
  return { success: true, order };
}

export async function createQuotation(data: {
  order_id: string;
  vendor_cost: number;
  company_margin: number;
  notes?: string;
}) {
  const admin = await requireAuth(["super_admin", "operations_manager"]);
  const supabase = createAdminClient();

  const { data: order } = await supabase.from("orders").select("*, services(*)").eq("id", data.order_id).single();
  if (!order) return { error: "Order not found" };

  const service = order.services;
  const calc = calculateQuotation(
    data.vendor_cost,
    data.company_margin,
    service.commission_type,
    service.commission_value
  );

  const { error } = await supabase.from("quotations").insert({
    order_id: data.order_id,
    ...calc,
    notes: data.notes,
    status: "sent",
    created_by: admin.id,
  });

  if (error) return { error: error.message };

  await supabase.from("orders").update({ status: "waiting_payment" }).eq("id", data.order_id);

  await supabase.from("payments").insert({
    order_id: data.order_id,
    amount: calc.client_price,
    method: "usdt",
    status: "pending",
    payment_instructions: "Please send USDT (TRC20). Contact your account manager for payment details.",
  });

  const { data: agent } = await supabase.from("profiles").select("email").eq("id", order.agent_id).single();
  if (agent?.email) {
    const email = quoteReadyEmail(order.order_number, calc.client_price);
    await sendEmail({ to: agent.email, ...email });
  }

  await supabase.from("notifications").insert({
    user_id: order.agent_id,
    title: "Quotation Ready",
    message: `Quotation of $${calc.client_price} ready for order ${order.order_number}`,
    type: "quote",
    link: `/agent/orders/${data.order_id}`,
  });

  revalidatePath("/admin/orders");
  return { success: true, ...calc };
}

export async function acceptQuotation(quotationId: string) {
  const profile = await requireAuth(["agent"]);
  const supabase = await createClient();

  const { data: quote } = await supabase.from("quotations").select("*, orders(*)").eq("id", quotationId).single();
  if (!quote || quote.orders.agent_id !== profile.id) return { error: "Not found" };

  await supabase.from("quotations").update({ status: "accepted" }).eq("id", quotationId);
  await supabase.from("orders").update({ status: "waiting_payment" }).eq("id", quote.order_id);

  revalidatePath("/agent/orders");
  return { success: true };
}

export async function uploadPaymentProof(paymentId: string, proofUrl: string) {
  const profile = await requireAuth();
  const supabase = await createClient();

  const { data: payment } = await supabase.from("payments").select("*, orders(*)").eq("id", paymentId).single();
  if (!payment) return { error: "Payment not found" };

  const { error } = await supabase.from("payments").update({
    proof_url: proofUrl,
    status: "awaiting_verification",
  }).eq("id", paymentId);

  if (error) return { error: error.message };

  await notifyAdmins(
    "Payment Proof Uploaded",
    "An agent submitted payment proof for verification.",
    `/admin/payments`
  );

  revalidatePath("/admin");
  revalidatePath("/admin/payments");
  revalidatePath("/agent/orders");
  if (payment.order_id) {
    revalidatePath(`/agent/orders/${payment.order_id}`);
    revalidatePath(`/admin/orders/${payment.order_id}`);
  }
  return { success: true };
}

export async function verifyPayment(paymentId: string, confirmed: boolean) {
  await requireAuth(["super_admin", "operations_manager"]);
  const supabase = createAdminClient();

  const status = confirmed ? "confirmed" : "failed";
  const { data: payment } = await supabase.from("payments").update({
    status,
    verified_at: confirmed ? new Date().toISOString() : null,
  }).eq("id", paymentId).select("*, orders(*)").single();

  if (confirmed && payment) {
    await supabase.from("orders").update({ status: "payment_confirmed" }).eq("id", payment.order_id);

    const order = Array.isArray(payment.orders) ? payment.orders[0] : payment.orders;
    if (order) {
      const { data: agent } = await supabase.from("profiles").select("email").eq("id", order.agent_id).single();
      if (agent?.email) {
        const email = orderUpdateEmail(order.order_number, "Payment Confirmed");
        await sendEmail({ to: agent.email, ...email });
      }

      await supabase.from("notifications").insert({
        user_id: order.agent_id,
        title: "Payment Confirmed",
        message: `Payment for order ${order.order_number} has been confirmed.`,
        type: "payment",
        link: `/agent/orders/${payment.order_id}`,
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/payments");
  revalidatePath("/admin/orders");
  if (payment?.order_id) {
    revalidatePath(`/admin/orders/${payment.order_id}`);
  }
  revalidatePath("/agent");
  revalidatePath("/agent/orders");
  if (payment?.order_id) {
    revalidatePath(`/agent/orders/${payment.order_id}`);
  }
  return { success: true };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, notes?: string) {
  await requireAuth(["super_admin", "operations_manager", "service_team"]);
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("orders")
    .select("started_at")
    .eq("id", orderId)
    .single();

  const updates: Record<string, unknown> = {
    status,
    progress_notes: notes,
  };

  if (status === "in_progress" && !existing?.started_at) {
    updates.started_at = new Date().toISOString();
  }
  if (isCommissionEligibleStatus(status)) {
    updates.completed_at = new Date().toISOString();
    updates.delivery_date = new Date().toISOString().slice(0, 10);
  }

  const { data: order } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId)
    .select("*, profiles!orders_agent_id_fkey(email)")
    .single();

  if (order?.profiles?.email) {
    const email = orderUpdateEmail(order.order_number, status.replace(/_/g, " "));
    await sendEmail({ to: order.profiles.email, ...email });
  }

  await supabase.from("notifications").insert({
    user_id: order.agent_id,
    title: "Order Updated",
    message: `Order ${order.order_number} is now ${status.replace(/_/g, " ")}`,
    type: "order",
    link: `/agent/orders/${orderId}`,
  });

  if (isCommissionEligibleStatus(status)) {
    await creditAgentCommission(orderId);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/agent");
  revalidatePath("/agent/orders");
  revalidatePath(`/agent/orders/${orderId}`);
  revalidatePath(`/agent/orders/${orderId}/delivery`);
  revalidatePath("/agent/delivery");
  return { success: true };
}

export async function saveOrderDelivery(data: {
  order_id: string;
  team_notes?: string;
  completion_report_url?: string;
  actual_tat?: string;
  started_at?: string;
  completed_at?: string;
}) {
  await requireAuth(["super_admin", "operations_manager", "service_team"]);
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("orders")
    .update({
      team_notes: data.team_notes?.trim() || null,
      completion_report_url: data.completion_report_url?.trim() || null,
      actual_tat: data.actual_tat?.trim() || null,
      started_at: data.started_at || null,
      completed_at: data.completed_at || null,
      delivery_date: data.completed_at ? data.completed_at.slice(0, 10) : undefined,
    })
    .eq("id", data.order_id);

  if (error) return { error: error.message };

  revalidatePath(`/admin/orders/${data.order_id}`);
  revalidatePath(`/agent/orders/${data.order_id}/delivery`);
  revalidatePath("/agent/delivery");
  return { success: true };
}

export async function addOrderProof(data: {
  order_id: string;
  title: string;
  proof_type?: "screenshot" | "document" | "link";
  url: string;
  thumbnail_url?: string;
  sort_order?: number;
}) {
  await requireAuth(["super_admin", "operations_manager", "service_team"]);
  const supabase = createAdminClient();

  const { error } = await supabase.from("order_proofs").insert({
    order_id: data.order_id,
    title: data.title.trim(),
    proof_type: data.proof_type || "link",
    url: data.url.trim(),
    thumbnail_url: data.thumbnail_url?.trim() || null,
    sort_order: data.sort_order ?? 0,
  });

  if (error) return { error: error.message };

  revalidatePath(`/admin/orders/${data.order_id}`);
  revalidatePath(`/agent/orders/${data.order_id}/delivery`);
  return { success: true };
}

export async function deleteOrderProof(proofId: string, orderId: string) {
  await requireAuth(["super_admin", "operations_manager", "service_team"]);
  const supabase = createAdminClient();
  const { error } = await supabase.from("order_proofs").delete().eq("id", proofId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/agent/orders/${orderId}/delivery`);
  return { success: true };
}

export async function submitOrderReview(data: {
  order_id: string;
  rating: number;
  review_text?: string;
}) {
  const profile = await requireAuth(["agent"]);
  const supabase = createAdminClient();

  if (data.rating < 1 || data.rating > 5) {
    return { error: "Rating must be between 1 and 5" };
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, agent_id, status")
    .eq("id", data.order_id)
    .eq("agent_id", profile.id)
    .single();

  if (!order) return { error: "Order not found" };
  if (!isCommissionEligibleStatus(order.status)) {
    return { error: "Reviews are available after order completion" };
  }

  const { error } = await supabase.from("order_reviews").upsert(
    {
      order_id: data.order_id,
      agent_id: profile.id,
      rating: data.rating,
      review_text: data.review_text?.trim() || null,
    },
    { onConflict: "order_id" }
  );

  if (error) return { error: error.message };

  revalidatePath(`/agent/orders/${data.order_id}/delivery`);
  return { success: true };
}

export async function uploadDeliverable(data: {
  order_id: string;
  title: string;
  description?: string;
  file_url?: string;
  external_link?: string;
  file_size?: string;
  file_type?: string;
  sort_order?: number;
}) {
  const admin = await requireAuth(["super_admin", "operations_manager", "service_team"]);
  const supabase = createAdminClient();

  const { error } = await supabase.from("deliverables").insert({
    ...data,
    uploaded_by: admin.id,
  });

  if (error) return { error: error.message };

  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", data.order_id)
    .single();

  if (order && !isCommissionEligibleStatus(order.status)) {
    await supabase
      .from("orders")
      .update({
        status: "delivered",
        completed_at: new Date().toISOString(),
        delivery_date: new Date().toISOString().slice(0, 10),
      })
      .eq("id", data.order_id);
    await creditAgentCommission(data.order_id);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${data.order_id}`);
  revalidatePath("/agent");
  revalidatePath("/agent/orders");
  revalidatePath(`/agent/orders/${data.order_id}`);
  revalidatePath(`/agent/orders/${data.order_id}/delivery`);
  revalidatePath("/agent/delivery");
  revalidatePath("/agent/wallet");
  return { success: true };
}

export async function requestWithdrawal(data: {
  amount: number;
  method: PaymentMethod;
  wallet_address?: string;
  bank_info?: string;
}) {
  const profile = await requireAuth(["agent"]);
  const supabase = createAdminClient();

  const amount = Number(data.amount);
  if (!Number.isFinite(amount) || amount < MIN_WITHDRAWAL) {
    return { error: `Minimum withdrawal is $${MIN_WITHDRAWAL}` };
  }

  if (data.method === "bank_transfer" && !data.bank_info?.trim()) {
    return { error: "Bank information is required" };
  }
  if (data.method !== "bank_transfer" && !data.wallet_address?.trim()) {
    return { error: "Wallet address is required" };
  }

  const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", profile.id).single();
  if (!wallet) return { error: "Wallet not found" };

  const available = Number(wallet.available_balance);
  const pending = Number(wallet.pending_balance);

  if (available < amount) return { error: "Insufficient balance" };

  const { error: walletError } = await supabase.from("wallets").update({
    available_balance: available - amount,
    pending_balance: pending + amount,
  }).eq("user_id", profile.id);

  if (walletError) return { error: walletError.message };

  const { error: withdrawalError } = await supabase.from("withdrawals").insert({
    user_id: profile.id,
    amount,
    method: data.method,
    wallet_address: data.wallet_address?.trim() || null,
    bank_info: data.bank_info?.trim() || null,
    status: "pending",
  });

  if (withdrawalError) {
    await supabase.from("wallets").update({
      available_balance: available,
      pending_balance: pending,
    }).eq("user_id", profile.id);
    return { error: withdrawalError.message };
  }

  await notifyAdmins(
    "New Withdrawal Request",
    `${profile.full_name || profile.email} requested a withdrawal of $${amount.toFixed(2)}.`,
    "/admin/withdrawals"
  );

  revalidatePath("/agent/wallet");
  revalidatePath("/agent");
  revalidatePath("/admin/withdrawals");
  return { success: true };
}

export async function processWithdrawal(
  withdrawalId: string,
  status: WithdrawalStatus,
  proofUrl?: string,
  notes?: string
) {
  await requireAuth(["super_admin", "operations_manager"]);
  const supabase = createAdminClient();

  const { data: withdrawal } = await supabase.from("withdrawals").select("*").eq("id", withdrawalId).single();
  if (!withdrawal) return { error: "Not found" };

  await supabase.from("withdrawals").update({
    status,
    admin_proof_url: proofUrl,
    review_notes: notes,
    processed_at: new Date().toISOString(),
  }).eq("id", withdrawalId);

  const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", withdrawal.user_id).single();

  if (status === "paid" && wallet) {
    await supabase.from("wallets").update({
      pending_balance: wallet.pending_balance - withdrawal.amount,
    }).eq("user_id", withdrawal.user_id);

    await supabase.from("commission_ledger").insert({
      user_id: withdrawal.user_id,
      amount: withdrawal.amount,
      type: "debit",
      description: "Withdrawal processed",
    });
  } else if (status === "rejected" && wallet) {
    await supabase.from("wallets").update({
      available_balance: wallet.available_balance + withdrawal.amount,
      pending_balance: wallet.pending_balance - withdrawal.amount,
    }).eq("user_id", withdrawal.user_id);
  }

  const { data: agent } = await supabase.from("profiles").select("email").eq("id", withdrawal.user_id).single();
  if (agent?.email) {
    const email = withdrawalStatusEmail(withdrawal.amount, status);
    await sendEmail({ to: agent.email, ...email });
  }

  revalidatePath("/admin/withdrawals");
  return { success: true };
}

export async function createTicket(subject: string, message: string) {
  const profile = await requireAuth();
  const supabase = await createClient();

  const { data: ticket, error } = await supabase.from("tickets").insert({
    user_id: profile.id,
    subject,
  }).select().single();

  if (error) return { error: error.message };

  await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    user_id: profile.id,
    message,
  });

  revalidatePath("/agent/support");
  return { success: true, ticket };
}

export async function replyTicket(ticketId: string, message: string) {
  const profile = await requireAuth();
  const supabase = await createClient();

  await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    user_id: profile.id,
    message,
  });

  if (isAdminRole(profile.role)) {
    await supabase.from("tickets").update({ status: "in_progress" }).eq("id", ticketId);
  }

  revalidatePath("/agent/support");
  revalidatePath("/admin/tickets");
  return { success: true };
}

export async function submitLead(data: {
  name: string;
  email: string;
  company?: string;
  telegram?: string;
  message: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({ ...data, source: "website" });
  if (error) return { error: error.message };
  return { success: true };
}

export async function markNotificationRead(id: string) {
  const profile = await requireAuth();
  const supabase = await createClient();
  await supabase.from("notifications").update({ is_read: true }).eq("id", id).eq("user_id", profile.id);
  return { success: true };
}

export async function updateLeadStatus(id: string, status: string) {
  await requireAuth(["super_admin", "operations_manager"]);
  const supabase = createAdminClient();
  await supabase.from("leads").update({ status }).eq("id", id);
  revalidatePath("/admin/leads");
  return { success: true };
}

export async function upsertService(
  data: {
    category_id: string;
    name: string;
    slug?: string;
    description?: string | null;
    overview?: string | null;
    demo_link?: string | null;
    proof_of_work?: string | null;
    proof_of_work_url?: string | null;
    pricing_model: "fixed" | "quote" | "enterprise";
    price?: number | null;
    service_fee?: number | null;
    commission_type: "fixed" | "percentage";
    commission_value: number;
    estimated_tat?: string | null;
    payment_terms?: string | null;
    is_active?: boolean;
    sort_order?: number;
    requires_third_party_ack?: boolean;
    badge?: "hot" | "popular" | "new" | null;
    logo_url?: string | null;
    whats_included?: string[] | null;
    supported_platforms?: string[] | null;
    process_steps?: { title: string; description?: string }[] | null;
    listing_type?: string | null;
    networks?: string | null;
    refund_policy?: string | null;
    required_documents?: string[] | null;
    faqs?: { question: string; answer: string }[] | null;
    terms_conditions?: string | null;
    third_party_fee_note?: string | null;
  },
  id?: string
) {
  await requireAuth(["super_admin", "operations_manager"]);
  const supabase = createAdminClient();

  const slug =
    data.slug?.trim() ||
    data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const payload = {
    category_id: data.category_id,
    name: data.name.trim(),
    slug,
    description: data.description?.trim() || null,
    overview: data.overview?.trim() || null,
    demo_link: data.demo_link?.trim() || null,
    proof_of_work: data.proof_of_work?.trim() || null,
    proof_of_work_url: data.proof_of_work_url?.trim() || null,
    pricing_model: data.pricing_model,
    price: data.pricing_model === "fixed" ? data.price ?? null : null,
    service_fee: data.service_fee ?? null,
    commission_type: data.commission_type,
    commission_value: data.commission_value,
    estimated_tat: data.estimated_tat?.trim() || null,
    payment_terms: data.payment_terms?.trim() || "100% Advance",
    is_active: data.is_active ?? true,
    sort_order: data.sort_order ?? 0,
    requires_third_party_ack: data.requires_third_party_ack ?? false,
    badge: data.badge || null,
    logo_url: data.logo_url?.trim() || null,
    whats_included: data.whats_included ?? [],
    supported_platforms: data.supported_platforms ?? [],
    process_steps: data.process_steps ?? [],
    listing_type: data.listing_type?.trim() || null,
    networks: data.networks?.trim() || null,
    refund_policy: data.refund_policy?.trim() || null,
    required_documents: data.required_documents ?? null,
    faqs: data.faqs ?? null,
    terms_conditions: data.terms_conditions?.trim() || null,
    third_party_fee_note: data.third_party_fee_note?.trim() || null,
  };

  const query = id
    ? supabase.from("services").update(payload).eq("id", id)
    : supabase.from("services").insert(payload);

  const { error } = await query;
  if (error) return { error: error.message };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/agent/services");
  return { success: true };
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  await requireAuth(["super_admin", "operations_manager"]);
  const supabase = createAdminClient();
  const { error } = await supabase.from("services").update({ is_active: isActive }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/agent/services");
  return { success: true };
}

export async function changePassword(newPassword: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { success: true };
}
