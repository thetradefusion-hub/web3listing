import { z } from "zod";
import { MIN_WITHDRAWAL } from "@/lib/constants";

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const projectSchema = z.object({
  project_name: z.string().min(2, "Project name required"),
  token_name: z.string().min(1, "Token name required"),
  token_symbol: z.string().min(1, "Token symbol required").max(10),
  blockchain_network: z.string().min(1, "Blockchain required"),
  website_url: z.string().url().optional().or(z.literal("")),
  contract_address: z.string().optional(),
  whitepaper_url: z.string().optional(),
  tokenomics_url: z.string().optional(),
  official_email: z.string().email().optional().or(z.literal("")),
  social_telegram: z.string().optional(),
  social_twitter: z.string().optional(),
  social_discord: z.string().optional(),
  social_medium: z.string().optional(),
  social_github: z.string().optional(),
  team_info: z.string().optional(),
});

export const kycSchema = z.object({
  full_name: z.string().min(2),
  company_name: z.string().optional(),
  mobile: z.string().min(8),
  telegram_username: z.string().min(2),
  country: z.string().min(2),
});

export const orderSchema = z.object({
  project_id: z.string().uuid(),
  service_id: z.string().uuid(),
  requirements: z.string().optional(),
  third_party_ack: z.boolean().optional(),
});

export const quotationSchema = z.object({
  order_id: z.string().uuid(),
  vendor_cost: z.number().min(0),
  company_margin: z.number().min(0),
  notes: z.string().optional(),
});

export const withdrawalSchema = z.object({
  amount: z.number().min(MIN_WITHDRAWAL, `Minimum withdrawal is $${MIN_WITHDRAWAL}`),
  method: z.enum(["usdt", "bank_transfer", "crypto_wallet"]),
  wallet_address: z.string().optional(),
  bank_info: z.string().optional(),
});

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  telegram: z.string().optional(),
  message: z.string().min(10),
});

export const ticketSchema = z.object({
  subject: z.string().min(5),
  message: z.string().min(10),
});

export const createAgentSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  company_name: z.string().optional(),
  telegram_username: z.string().optional(),
  country: z.string().optional(),
});

export const serviceSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  pricing_model: z.enum(["fixed", "quote", "enterprise"]),
  price: z.number().optional(),
  service_fee: z.number().optional(),
  commission_type: z.enum(["fixed", "percentage"]),
  commission_value: z.number().min(0),
  estimated_tat: z.string().optional(),
  payment_terms: z.string().optional(),
  requires_third_party_ack: z.boolean().optional(),
});
