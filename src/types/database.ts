export type UserRole =
  | "super_admin"
  | "operations_manager"
  | "agent"
  | "service_team"
  | "user";

export type KycStatus = "pending" | "approved" | "rejected";

export type ProjectStatus = "draft" | "submitted" | "approved" | "rejected";

export type PricingModel = "fixed" | "quote" | "enterprise";

export type CommissionType = "fixed" | "percentage";

export type OrderStatus =
  | "submitted"
  | "under_review"
  | "waiting_payment"
  | "payment_confirmed"
  | "in_progress"
  | "third_party_review"
  | "completed"
  | "delivered"
  | "closed";

export type PaymentStatus =
  | "pending"
  | "awaiting_verification"
  | "confirmed"
  | "failed";

export type PaymentMethod = "usdt" | "bank_transfer" | "crypto_wallet";

export type WithdrawalStatus = "pending" | "approved" | "rejected" | "paid";

export type TicketStatus = "open" | "in_progress" | "closed";

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  telegram_username: string | null;
  mobile: string | null;
  country: string | null;
  wallet_address: string | null;
  role: UserRole;
  kyc_status: KycStatus;
  account_manager_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AccountManager {
  id: string;
  name: string;
  telegram_id: string;
  telegram_link: string | null;
  support_hours: string | null;
  is_active: boolean;
  created_at: string;
}

export interface KycSubmission {
  id: string;
  user_id: string;
  passport_url: string | null;
  company_registration_url: string | null;
  selfie_url: string | null;
  tax_document_url: string | null;
  status: KycStatus;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  agent_id: string;
  project_name: string;
  token_name: string;
  token_symbol: string;
  blockchain_network: string;
  website_url: string | null;
  contract_address: string | null;
  whitepaper_url: string | null;
  tokenomics_url: string | null;
  official_email: string | null;
  logo_url: string | null;
  social_telegram: string | null;
  social_twitter: string | null;
  social_discord: string | null;
  social_medium: string | null;
  social_github: string | null;
  founder_kyc_url: string | null;
  team_info: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  demo_link: string | null;
  demo_files: string[] | null;
  proof_of_work: string | null;
  proof_of_work_url: string | null;
  pricing_model: PricingModel;
  price: number | null;
  service_fee: number | null;
  third_party_fee_note: string | null;
  commission_type: CommissionType;
  commission_value: number;
  estimated_tat: string | null;
  payment_terms: string | null;
  required_documents: string[] | null;
  faqs: { question: string; answer: string }[] | null;
  terms_conditions: string | null;
  requires_third_party_ack: boolean;
  requires_kyc?: boolean;
  is_active: boolean;
  sort_order: number;
  badge: "hot" | "popular" | "new" | null;
  logo_url: string | null;
  overview: string | null;
  whats_included: string[] | null;
  supported_platforms: string[] | null;
  process_steps: { title: string; description?: string }[] | null;
  listing_type: string | null;
  networks: string | null;
  refund_policy: string | null;
  service_categories?: ServiceCategory;
}

export interface Order {
  id: string;
  order_number: string;
  agent_id: string;
  project_id: string;
  service_id: string;
  status: OrderStatus;
  assigned_manager_id: string | null;
  requirements: string | null;
  progress_notes: string | null;
  delivery_date: string | null;
  team_notes: string | null;
  completion_report_url: string | null;
  actual_tat: string | null;
  started_at: string | null;
  completed_at: string | null;
  third_party_ack: boolean;
  created_at: string;
  updated_at: string;
  projects?: Project;
  services?: Service;
  profiles?: Profile;
}

export interface Quotation {
  id: string;
  order_id: string;
  vendor_cost: number;
  company_margin: number;
  client_price: number;
  commission_amount: number;
  company_profit: number;
  notes: string | null;
  status: "draft" | "sent" | "accepted" | "rejected";
  created_by: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  payment_link: string | null;
  payment_instructions: string | null;
  proof_url: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface Deliverable {
  id: string;
  order_id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  external_link: string | null;
  file_size: string | null;
  file_type: string | null;
  sort_order: number;
  uploaded_by: string | null;
  created_at: string;
}

export interface OrderProof {
  id: string;
  order_id: string;
  title: string;
  proof_type: "screenshot" | "document" | "link";
  url: string;
  thumbnail_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface OrderReview {
  id: string;
  order_id: string;
  agent_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  available_balance: number;
  pending_balance: number;
  lifetime_earnings: number;
  updated_at: string;
}

export interface CommissionLedger {
  id: string;
  user_id: string;
  order_id: string | null;
  amount: number;
  type: "credit" | "debit";
  description: string | null;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  method: PaymentMethod;
  wallet_address: string | null;
  bank_info: string | null;
  status: WithdrawalStatus;
  admin_proof_url: string | null;
  review_notes: string | null;
  processed_by: string | null;
  processed_at: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  attachment_url: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  telegram: string | null;
  message: string | null;
  source: string;
  status: LeadStatus;
  assigned_to: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface LegalPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface DownloadLog {
  id: string;
  deliverable_id: string;
  user_id: string;
  created_at: string;
}
