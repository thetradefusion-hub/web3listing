-- Order delivery page: proofs, completion metadata, reviews

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS team_notes TEXT,
  ADD COLUMN IF NOT EXISTS completion_report_url TEXT,
  ADD COLUMN IF NOT EXISTS actual_tat TEXT,
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

ALTER TABLE deliverables
  ADD COLUMN IF NOT EXISTS file_size TEXT,
  ADD COLUMN IF NOT EXISTS file_type TEXT,
  ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

CREATE TABLE IF NOT EXISTS order_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  proof_type TEXT NOT NULL DEFAULT 'link' CHECK (proof_type IN ('screenshot', 'document', 'link')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_proofs_order ON order_proofs(order_id);
CREATE INDEX IF NOT EXISTS idx_order_reviews_order ON order_reviews(order_id);

ALTER TABLE order_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View proofs for own orders" ON order_proofs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_proofs.order_id
      AND (orders.agent_id = auth.uid() OR is_service_team_or_admin())
  )
);

CREATE POLICY "Team manages proofs" ON order_proofs FOR ALL USING (is_service_team_or_admin());

CREATE POLICY "Agents view own reviews" ON order_reviews FOR SELECT USING (
  agent_id = auth.uid() OR is_service_team_or_admin()
);

CREATE POLICY "Agents submit own reviews" ON order_reviews FOR INSERT WITH CHECK (
  agent_id = auth.uid()
);

CREATE POLICY "Team views all reviews" ON order_reviews FOR SELECT USING (is_service_team_or_admin());
