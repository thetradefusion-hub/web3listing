-- Custom requirements: user portal submissions reviewed by admin with quotations

CREATE TYPE custom_requirement_status AS ENUM (
  'submitted',
  'under_review',
  'quoted',
  'accepted',
  'rejected',
  'closed'
);

CREATE TYPE custom_requirement_quote_status AS ENUM (
  'draft',
  'sent',
  'accepted',
  'rejected'
);

CREATE TABLE custom_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_range TEXT,
  timeline TEXT,
  telegram TEXT,
  status custom_requirement_status NOT NULL DEFAULT 'submitted',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  quoted_price NUMERIC(12, 2),
  quote_notes TEXT,
  quote_status custom_requirement_quote_status,
  quoted_at TIMESTAMPTZ,
  quoted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_requirements_user_id ON custom_requirements(user_id);
CREATE INDEX idx_custom_requirements_status ON custom_requirements(status);
CREATE INDEX idx_custom_requirements_created_at ON custom_requirements(created_at DESC);

ALTER TABLE custom_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own custom requirements"
  ON custom_requirements FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users create own custom requirements"
  ON custom_requirements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and admins update custom requirements"
  ON custom_requirements FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins delete custom requirements"
  ON custom_requirements FOR DELETE
  USING (is_admin());
