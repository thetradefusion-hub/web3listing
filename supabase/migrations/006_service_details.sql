-- Extended service fields for catalog UI and detail pages

ALTER TABLE services
  ADD COLUMN IF NOT EXISTS badge TEXT CHECK (badge IN ('hot', 'popular', 'new')),
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS overview TEXT,
  ADD COLUMN IF NOT EXISTS whats_included JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS supported_platforms JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS process_steps JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS proof_of_work_url TEXT,
  ADD COLUMN IF NOT EXISTS listing_type TEXT,
  ADD COLUMN IF NOT EXISTS networks TEXT,
  ADD COLUMN IF NOT EXISTS refund_policy TEXT;

COMMENT ON COLUMN services.badge IS 'Display badge: hot, popular, or new';
COMMENT ON COLUMN services.whats_included IS 'Array of included feature strings';
COMMENT ON COLUMN services.supported_platforms IS 'Array of platform names';
COMMENT ON COLUMN services.process_steps IS 'Array of {title, description} objects';
