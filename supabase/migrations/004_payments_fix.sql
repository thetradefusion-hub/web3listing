-- Allow agents to create payment rows for their own orders
CREATE POLICY "Agents create payments for own orders" ON payments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id
        AND orders.agent_id = auth.uid()
    )
  );

-- Backfill missing payments for fixed-price orders already in the system
INSERT INTO payments (order_id, amount, method, status, payment_instructions)
SELECT
  o.id,
  s.price,
  'usdt',
  CASE
    WHEN o.status = 'payment_confirmed' THEN 'confirmed'::payment_status
    WHEN o.status IN ('in_progress', 'third_party_review', 'completed', 'delivered', 'closed') THEN 'confirmed'::payment_status
    ELSE 'pending'::payment_status
  END,
  'Please send USDT (TRC20) to our wallet. Contact support for payment details.'
FROM orders o
JOIN services s ON s.id = o.service_id
WHERE s.pricing_model = 'fixed'
  AND s.price IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.order_id = o.id);

-- Backfill missing payments for quoted orders with a sent/accepted quotation
INSERT INTO payments (order_id, amount, method, status, payment_instructions)
SELECT
  q.order_id,
  q.client_price,
  'usdt',
  CASE
    WHEN o.status = 'payment_confirmed' THEN 'confirmed'::payment_status
    WHEN o.status IN ('in_progress', 'third_party_review', 'completed', 'delivered', 'closed') THEN 'confirmed'::payment_status
    ELSE 'pending'::payment_status
  END,
  'Please send USDT (TRC20). Contact your account manager for payment details.'
FROM quotations q
JOIN orders o ON o.id = q.order_id
WHERE q.status IN ('sent', 'accepted')
  AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.order_id = q.order_id);
