import { Resend } from "resend";

function isConfiguredResendKey(key: string | undefined): key is string {
  if (!key) return false;
  const trimmed = key.trim();
  if (!trimmed) return false;
  if (/^your[_-]?resend/i.test(trimmed)) return false;
  if (trimmed.includes("your_resend_api_key")) return false;
  return true;
}

const resendApiKey = process.env.RESEND_API_KEY;
const resend = isConfiguredResendKey(resendApiKey) ? new Resend(resendApiKey) : null;

/** Prefer verified domain in prod; Resend test sender works without a custom domain. */
const FROM_EMAIL =
  process.env.EMAIL_FROM?.trim() ||
  process.env.RESEND_FROM_EMAIL?.trim() ||
  "Web3Listing <onboarding@resend.dev>";

export function isEmailDeliveryConfigured() {
  return Boolean(resend);
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.log(`[Email stub] To: ${to}, Subject: ${subject}`);
    console.log(`[Email stub] HTML:\n${html}`);
    return { success: true as const, stub: true as const };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email send failed:", error);
      return {
        success: false as const,
        error: error.message || "Failed to send email",
      };
    }

    return { success: true as const, id: data?.id };
  } catch (error) {
    console.error("Email send failed:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

export function credentialsEmail(email: string, password: string) {
  return {
    subject: "Your Web3Listing Partner Account",
    html: `
      <h2>Welcome to Web3Listing Partner Portal</h2>
      <p>Your account has been created. Use these credentials to login:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/login">Login to Dashboard</a></p>
      <p>Please change your password after first login.</p>
    `,
  };
}

export function kycStatusEmail(status: string, notes?: string) {
  return {
    subject: `KYC ${status.charAt(0).toUpperCase() + status.slice(1)} — Web3Listing`,
    html: `
      <h2>KYC Status Update</h2>
      <p>Your KYC verification has been <strong>${status}</strong>.</p>
      ${notes ? `<p>Notes: ${notes}</p>` : ""}
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/partner/kyc">View KYC Status</a></p>
    `,
  };
}

export function orderUpdateEmail(orderNumber: string, status: string) {
  return {
    subject: `Order ${orderNumber} — Status Update`,
    html: `
      <h2>Order Update</h2>
      <p>Order <strong>${orderNumber}</strong> status changed to <strong>${status}</strong>.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/partner/orders">View Orders</a></p>
    `,
  };
}

export function quoteReadyEmail(orderNumber: string, amount: number) {
  return {
    subject: `Quotation Ready — Order ${orderNumber}`,
    html: `
      <h2>Quotation Ready</h2>
      <p>A quotation of <strong>$${amount}</strong> is ready for order <strong>${orderNumber}</strong>.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/partner/orders">Review & Pay</a></p>
    `,
  };
}

export function withdrawalStatusEmail(amount: number, status: string) {
  return {
    subject: `Withdrawal ${status} — $${amount}`,
    html: `
      <h2>Withdrawal Update</h2>
      <p>Your withdrawal request of <strong>$${amount}</strong> has been <strong>${status}</strong>.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/partner/wallet">View Wallet</a></p>
    `,
  };
}
