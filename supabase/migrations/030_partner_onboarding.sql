-- Partner onboarding (Phase 1): apply → email OTP → business profile → KYC → agreements
-- Keep admin Create Partner as fast-track (onboarding_status = active)

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS partner_onboarding_status TEXT NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS partner_website TEXT,
  ADD COLUMN IF NOT EXISTS years_of_experience TEXT,
  ADD COLUMN IF NOT EXISTS monthly_client_volume TEXT,
  ADD COLUMN IF NOT EXISTS services_offered TEXT,
  ADD COLUMN IF NOT EXISTS company_description TEXT,
  ADD COLUMN IF NOT EXISTS business_type TEXT,
  ADD COLUMN IF NOT EXISTS target_market TEXT,
  ADD COLUMN IF NOT EXISTS existing_client_base TEXT,
  ADD COLUMN IF NOT EXISTS monthly_leads TEXT,
  ADD COLUMN IF NOT EXISTS preferred_services TEXT,
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS partner_agreements_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS partner_activated_at TIMESTAMPTZ;

COMMENT ON COLUMN profiles.partner_onboarding_status IS
  'none | applied | email_verified | profile_complete | kyc_pending | kyc_rejected | agreements_pending | active';

-- Existing admin-created / already approved partners stay fully active
UPDATE profiles
SET
  partner_onboarding_status = 'active',
  email_verified_at = COALESCE(email_verified_at, NOW()),
  partner_activated_at = COALESCE(partner_activated_at, NOW())
WHERE role = 'agent'
  AND kyc_status = 'approved'
  AND partner_onboarding_status = 'none';

ALTER TABLE kyc_submissions
  ADD COLUMN IF NOT EXISTS address_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS authorized_rep_id_url TEXT;

CREATE TABLE IF NOT EXISTS partner_email_otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_email_otps_user ON partner_email_otps(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_email_otps_email ON partner_email_otps(email);

CREATE TABLE IF NOT EXISTS partner_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agreement_version TEXT NOT NULL,
  accepted_policies JSONB NOT NULL DEFAULT '[]'::jsonb,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, agreement_version)
);

CREATE INDEX IF NOT EXISTS idx_partner_agreements_user ON partner_agreements(user_id);

ALTER TABLE partner_email_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_agreements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS partner_email_otps_own ON partner_email_otps;
CREATE POLICY partner_email_otps_own ON partner_email_otps
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS partner_agreements_own_select ON partner_agreements;
CREATE POLICY partner_agreements_own_select ON partner_agreements
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS partner_agreements_own_insert ON partner_agreements;
CREATE POLICY partner_agreements_own_insert ON partner_agreements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS partner_agreements_admin ON partner_agreements;
CREATE POLICY partner_agreements_admin ON partner_agreements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'operations_manager', 'service_team')
    )
  );
