-- Demo delivery data for first Binance Ecosystem completed order (agent preview)
-- Run: npm run db:seed-delivery-demo

DO $$
DECLARE
  v_order_id UUID;
  v_service_id UUID;
BEGIN
  SELECT id INTO v_service_id FROM services WHERE slug = 'binance-ecosystem-support';
  IF v_service_id IS NULL THEN
    RAISE NOTICE 'Binance service not found — run db:seed-binance first';
    RETURN;
  END IF;

  SELECT o.id INTO v_order_id
  FROM orders o
  WHERE o.service_id = v_service_id
    AND o.status = 'completed'
    AND o.requirements = '__seed_binance_demo__'
  ORDER BY o.created_at
  LIMIT 1;

  IF v_order_id IS NULL THEN
    RAISE NOTICE 'No demo completed order found';
    RETURN;
  END IF;

  IF EXISTS (SELECT 1 FROM order_proofs WHERE order_id = v_order_id LIMIT 1) THEN
    RAISE NOTICE 'Delivery demo already seeded';
    RETURN;
  END IF;

  UPDATE orders SET
    team_notes = 'Congratulations! Your Binance Ecosystem listing has been completed successfully. All deliverables are attached below. We recommend proceeding with CoinGecko listing next for maximum visibility.',
    completion_report_url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    actual_tat = '4 Days',
    started_at = '2026-06-20T09:00:00Z',
    completed_at = '2026-06-24T14:30:00Z',
    delivery_date = '2026-06-24',
    status = 'delivered'
  WHERE id = v_order_id;

  INSERT INTO order_proofs (order_id, title, proof_type, url, sort_order) VALUES
    (v_order_id, 'Listing Confirmation Screenshot', 'screenshot', 'https://example.com/proof/listing-screenshot', 0),
    (v_order_id, 'Approval Email Screenshot', 'screenshot', 'https://example.com/proof/approval-email', 1),
    (v_order_id, 'Submission Evidence Document', 'document', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 2),
    (v_order_id, 'Live Listing Link', 'link', 'https://pancakeswap.finance', 3);

  INSERT INTO deliverables (order_id, title, file_url, file_size, file_type, sort_order) VALUES
    (v_order_id, 'Completion Report.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '2.4 MB', 'PDF', 0),
    (v_order_id, 'Listing Assets.zip', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '8.1 MB', 'ZIP', 1),
    (v_order_id, 'Submission Checklist.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '1.2 MB', 'PDF', 2);

  -- Ensure timeline history exists for key steps
  INSERT INTO order_status_history (order_id, status, created_at)
  SELECT v_order_id, s.status, s.at
  FROM (VALUES
    ('submitted'::order_status, '2026-06-20T08:00:00Z'::timestamptz),
    ('payment_confirmed'::order_status, '2026-06-20T10:30:00Z'::timestamptz),
    ('in_progress'::order_status, '2026-06-20T14:00:00Z'::timestamptz),
    ('third_party_review'::order_status, '2026-06-22T11:00:00Z'::timestamptz),
    ('completed'::order_status, '2026-06-24T12:00:00Z'::timestamptz),
    ('delivered'::order_status, '2026-06-24T14:30:00Z'::timestamptz)
  ) AS s(status, at)
  WHERE NOT EXISTS (
    SELECT 1 FROM order_status_history h
    WHERE h.order_id = v_order_id AND h.status = s.status
  );

  RAISE NOTICE 'Demo delivery seeded for order %', v_order_id;
END $$;
