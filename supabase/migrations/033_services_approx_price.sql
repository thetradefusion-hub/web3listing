ALTER TABLE services
  ADD COLUMN IF NOT EXISTS approx_price TEXT;

COMMENT ON COLUMN services.approx_price IS 'Display-only approximate price for custom quote / enterprise services';
