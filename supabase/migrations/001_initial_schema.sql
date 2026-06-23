-- TokenWeb3Listing Initial Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('super_admin', 'operations_manager', 'agent', 'service_team');
CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE project_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');
CREATE TYPE pricing_model AS ENUM ('fixed', 'quote', 'enterprise');
CREATE TYPE commission_type AS ENUM ('fixed', 'percentage');
CREATE TYPE order_status AS ENUM (
  'submitted', 'under_review', 'waiting_payment', 'payment_confirmed',
  'in_progress', 'third_party_review', 'completed', 'delivered', 'closed'
);
CREATE TYPE payment_status AS ENUM ('pending', 'awaiting_verification', 'confirmed', 'failed');
CREATE TYPE payment_method AS ENUM ('usdt', 'bank_transfer', 'crypto_wallet');
CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'closed');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
CREATE TYPE quotation_status AS ENUM ('draft', 'sent', 'accepted', 'rejected');
CREATE TYPE ledger_type AS ENUM ('credit', 'debit');

-- Account Managers
CREATE TABLE account_managers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  telegram_id TEXT NOT NULL,
  telegram_link TEXT,
  support_hours TEXT DEFAULT 'Monday - Saturday, 9AM - 6PM UTC',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  telegram_username TEXT,
  mobile TEXT,
  country TEXT,
  wallet_address TEXT,
  role user_role NOT NULL DEFAULT 'agent',
  kyc_status kyc_status NOT NULL DEFAULT 'pending',
  account_manager_id UUID REFERENCES account_managers(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC Submissions
CREATE TABLE kyc_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  passport_url TEXT,
  company_registration_url TEXT,
  selfie_url TEXT,
  tax_document_url TEXT,
  status kyc_status NOT NULL DEFAULT 'pending',
  review_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Service Categories
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES service_categories(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  demo_link TEXT,
  demo_files TEXT[],
  proof_of_work TEXT,
  pricing_model pricing_model NOT NULL DEFAULT 'fixed',
  price DECIMAL(12,2),
  service_fee DECIMAL(12,2),
  third_party_fee_note TEXT,
  commission_type commission_type NOT NULL DEFAULT 'percentage',
  commission_value DECIMAL(12,2) NOT NULL DEFAULT 10,
  estimated_tat TEXT,
  payment_terms TEXT DEFAULT '100% Advance',
  required_documents TEXT[],
  faqs JSONB,
  terms_conditions TEXT,
  requires_third_party_ack BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  token_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  blockchain_network TEXT NOT NULL,
  website_url TEXT,
  contract_address TEXT,
  whitepaper_url TEXT,
  tokenomics_url TEXT,
  official_email TEXT,
  logo_url TEXT,
  social_telegram TEXT,
  social_twitter TEXT,
  social_discord TEXT,
  social_medium TEXT,
  social_github TEXT,
  founder_kyc_url TEXT,
  team_info TEXT,
  status project_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  agent_id UUID NOT NULL REFERENCES profiles(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  service_id UUID NOT NULL REFERENCES services(id),
  status order_status NOT NULL DEFAULT 'submitted',
  assigned_manager_id UUID REFERENCES profiles(id),
  requirements TEXT,
  progress_notes TEXT,
  delivery_date DATE,
  third_party_ack BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE order_number_seq START 1000;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'TWL-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- Order Status History
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotations
CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  vendor_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  company_margin DECIMAL(12,2) NOT NULL DEFAULT 0,
  client_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  commission_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  company_profit DECIMAL(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  status quotation_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  method payment_method NOT NULL DEFAULT 'usdt',
  status payment_status NOT NULL DEFAULT 'pending',
  payment_link TEXT,
  payment_instructions TEXT,
  proof_url TEXT,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deliverables
CREATE TABLE deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  external_link TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Download Logs
CREATE TABLE download_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deliverable_id UUID NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallets
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  available_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  pending_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  lifetime_earnings DECIMAL(12,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commission Ledger
CREATE TABLE commission_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  order_id UUID REFERENCES orders(id),
  amount DECIMAL(12,2) NOT NULL,
  type ledger_type NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Withdrawals
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(12,2) NOT NULL,
  method payment_method NOT NULL,
  wallet_address TEXT,
  bank_info TEXT,
  status withdrawal_status NOT NULL DEFAULT 'pending',
  admin_proof_url TEXT,
  review_notes TEXT,
  processed_by UUID REFERENCES profiles(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  subject TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  telegram TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status lead_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legal Pages
CREATE TABLE legal_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'agent');
  INSERT INTO wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER kyc_updated_at BEFORE UPDATE ON kyc_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Commission credit on order completion
CREATE OR REPLACE FUNCTION credit_commission_on_order_complete()
RETURNS TRIGGER AS $$
DECLARE
  v_commission DECIMAL(12,2);
  v_service services%ROWTYPE;
BEGIN
  IF NEW.status IN ('completed', 'delivered', 'closed') AND OLD.status NOT IN ('completed', 'delivered', 'closed') THEN
    SELECT * INTO v_service FROM services WHERE id = NEW.service_id;
    SELECT commission_amount INTO v_commission FROM quotations WHERE order_id = NEW.id AND status = 'accepted' ORDER BY created_at DESC LIMIT 1;
    IF v_commission IS NULL OR v_commission = 0 THEN
      IF v_service.commission_type = 'percentage' AND v_service.price IS NOT NULL THEN
        v_commission := v_service.price * v_service.commission_value / 100;
      ELSIF v_service.commission_type = 'fixed' THEN
        v_commission := v_service.commission_value;
      END IF;
    END IF;
    IF v_commission > 0 THEN
      UPDATE wallets SET
        available_balance = available_balance + v_commission,
        lifetime_earnings = lifetime_earnings + v_commission,
        updated_at = NOW()
      WHERE user_id = NEW.agent_id;
      INSERT INTO commission_ledger (user_id, order_id, amount, type, description)
      VALUES (NEW.agent_id, NEW.id, v_commission, 'credit', 'Commission for order ' || NEW.order_number);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER order_commission_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION credit_commission_on_order_complete();

-- Order status history trigger
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER order_status_history_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_kyc ON profiles(kyc_status);
CREATE INDEX idx_projects_agent ON projects(agent_id);
CREATE INDEX idx_orders_agent ON orders(agent_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_manager ON orders(assigned_manager_id);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_commission_ledger_user ON commission_ledger(user_id);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_managers ENABLE ROW LEVEL SECURITY;

-- Helper function for role check
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'operations_manager')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_service_team_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'operations_manager', 'service_team')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL USING (is_admin());

-- Public read for service catalog
CREATE POLICY "Anyone can view categories" ON service_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage categories" ON service_categories FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage services" ON services FOR ALL USING (is_admin());

-- KYC policies
CREATE POLICY "Users manage own KYC" ON kyc_submissions FOR ALL USING (auth.uid() = user_id OR is_admin());

-- Projects policies
CREATE POLICY "Agents manage own projects" ON projects FOR ALL USING (auth.uid() = agent_id OR is_admin());

-- Orders policies
CREATE POLICY "Agents view own orders" ON orders FOR SELECT USING (
  auth.uid() = agent_id OR is_admin() OR
  (assigned_manager_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'service_team' AND assigned_manager_id = auth.uid())
);
CREATE POLICY "Agents create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = agent_id);
CREATE POLICY "Admins and team update orders" ON orders FOR UPDATE USING (is_service_team_or_admin() OR auth.uid() = agent_id);

-- Quotations
CREATE POLICY "View quotations for own orders" ON quotations FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = quotations.order_id AND (orders.agent_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Admins manage quotations" ON quotations FOR ALL USING (is_admin());

-- Payments
CREATE POLICY "View own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND (orders.agent_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Agents upload payment proof" ON payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND orders.agent_id = auth.uid())
);
CREATE POLICY "Admins manage payments" ON payments FOR ALL USING (is_admin());

-- Deliverables
CREATE POLICY "View deliverables for own orders" ON deliverables FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = deliverables.order_id AND (orders.agent_id = auth.uid() OR is_service_team_or_admin()))
);
CREATE POLICY "Team uploads deliverables" ON deliverables FOR INSERT WITH CHECK (is_service_team_or_admin());

-- Wallets
CREATE POLICY "Users view own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admins manage wallets" ON wallets FOR UPDATE USING (is_admin());

-- Commission ledger
CREATE POLICY "Users view own ledger" ON commission_ledger FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- Withdrawals
CREATE POLICY "Users manage own withdrawals" ON withdrawals FOR ALL USING (auth.uid() = user_id OR is_admin());

-- Tickets
CREATE POLICY "Users manage own tickets" ON tickets FOR ALL USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users manage ticket messages" ON ticket_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM tickets WHERE tickets.id = ticket_messages.ticket_id AND (tickets.user_id = auth.uid() OR is_admin()))
);

-- Leads - public insert, admin read
CREATE POLICY "Anyone can submit leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage leads" ON leads FOR ALL USING (is_admin());

-- Notifications
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System creates notifications" ON notifications FOR INSERT WITH CHECK (is_admin() OR auth.uid() = user_id);

-- Blog & Legal - public read
CREATE POLICY "Public read blog" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage blog" ON blog_posts FOR ALL USING (is_admin());
CREATE POLICY "Public read legal" ON legal_pages FOR SELECT USING (true);
CREATE POLICY "Admins manage legal" ON legal_pages FOR ALL USING (is_admin());

-- Account managers - public read active
CREATE POLICY "Public read managers" ON account_managers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage managers" ON account_managers FOR ALL USING (is_admin());

-- Order status history
CREATE POLICY "View order history" ON order_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND (orders.agent_id = auth.uid() OR is_service_team_or_admin()))
);

-- Download logs
CREATE POLICY "Users log downloads" ON download_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "View download logs" ON download_logs FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- Storage buckets (run in Supabase dashboard or via API)
-- kyc-documents, project-assets, deliverables, payment-proofs, withdrawal-proofs
