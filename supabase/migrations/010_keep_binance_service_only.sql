-- Keep only Binance Ecosystem Support; remove all other catalog services.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM services WHERE slug = 'binance-ecosystem-support') THEN
    RAISE EXCEPTION 'Service binance-ecosystem-support not found — aborting.';
  END IF;
END $$;

-- Remove commission ledger rows tied to orders on other services.
DELETE FROM commission_ledger
WHERE order_id IN (
  SELECT o.id
  FROM orders o
  JOIN services s ON s.id = o.service_id
  WHERE s.slug <> 'binance-ecosystem-support'
);

-- Child order tables cascade on delete.
DELETE FROM orders
WHERE service_id IN (
  SELECT id FROM services WHERE slug <> 'binance-ecosystem-support'
);

DELETE FROM services
WHERE slug <> 'binance-ecosystem-support';
