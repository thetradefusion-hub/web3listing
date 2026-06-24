import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = "TokenWeb3Listing <noreply@tokenweb3listing.com>";

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
    return { success: true, stub: true };
  }

  try {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error };
  }
}

export function credentialsEmail(email: string, password: string) {
  return {
    subject: "Your TokenWeb3Listing Partner Account",
    html: `
      <h2>Welcome to TokenWeb3Listing Partner Portal</h2>
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
    subject: `KYC ${status.charAt(0).toUpperCase() + status.slice(1)} — TokenWeb3Listing`,
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
