ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS legal_consent_accepted BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS legal_consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS legal_consent_ip TEXT,
  ADD COLUMN IF NOT EXISTS legal_agreement_version TEXT;
