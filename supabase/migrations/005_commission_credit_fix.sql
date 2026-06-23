-- Fix commission credit for quote-based orders (quotation may stay "sent" until paid)
CREATE OR REPLACE FUNCTION credit_commission_on_order_complete()
RETURNS TRIGGER AS $$
DECLARE
  v_commission DECIMAL(12,2);
  v_service services%ROWTYPE;
  v_payment_amount DECIMAL(12,2);
BEGIN
  IF NEW.status IN ('completed', 'delivered', 'closed')
     AND OLD.status NOT IN ('completed', 'delivered', 'closed') THEN

    IF EXISTS (
      SELECT 1 FROM commission_ledger
      WHERE order_id = NEW.id AND type = 'credit'
    ) THEN
      RETURN NEW;
    END IF;

    SELECT * INTO v_service FROM services WHERE id = NEW.service_id;

    SELECT commission_amount INTO v_commission
    FROM quotations
    WHERE order_id = NEW.id AND status IN ('sent', 'accepted')
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_commission IS NULL OR v_commission = 0 THEN
      IF v_service.commission_type = 'percentage' AND v_service.price IS NOT NULL THEN
        v_commission := v_service.price * v_service.commission_value / 100;
      ELSIF v_service.commission_type = 'fixed' THEN
        v_commission := v_service.commission_value;
      END IF;
    END IF;

    IF (v_commission IS NULL OR v_commission = 0) AND v_service.commission_type = 'percentage' THEN
      SELECT amount INTO v_payment_amount
      FROM payments
      WHERE order_id = NEW.id AND status = 'confirmed'
      ORDER BY created_at DESC
      LIMIT 1;

      IF v_payment_amount IS NOT NULL THEN
        v_commission := v_payment_amount * v_service.commission_value / 100;
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

-- Backfill commissions for completed orders that never credited the agent
DO $$
DECLARE
  r RECORD;
  v_commission DECIMAL(12,2);
  v_service services%ROWTYPE;
  v_payment_amount DECIMAL(12,2);
BEGIN
  FOR r IN
    SELECT o.id, o.agent_id, o.order_number, o.service_id
    FROM orders o
    WHERE o.status IN ('completed', 'delivered', 'closed')
      AND NOT EXISTS (
        SELECT 1 FROM commission_ledger cl
        WHERE cl.order_id = o.id AND cl.type = 'credit'
      )
  LOOP
    v_commission := 0;
    SELECT * INTO v_service FROM services WHERE id = r.service_id;

    SELECT commission_amount INTO v_commission
    FROM quotations
    WHERE order_id = r.id AND status IN ('sent', 'accepted')
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_commission IS NULL OR v_commission = 0 THEN
      IF v_service.commission_type = 'percentage' AND v_service.price IS NOT NULL THEN
        v_commission := v_service.price * v_service.commission_value / 100;
      ELSIF v_service.commission_type = 'fixed' THEN
        v_commission := v_service.commission_value;
      END IF;
    END IF;

    IF (v_commission IS NULL OR v_commission = 0) AND v_service.commission_type = 'percentage' THEN
      SELECT amount INTO v_payment_amount
      FROM payments
      WHERE order_id = r.id AND status = 'confirmed'
      ORDER BY created_at DESC
      LIMIT 1;

      IF v_payment_amount IS NOT NULL THEN
        v_commission := v_payment_amount * v_service.commission_value / 100;
      END IF;
    END IF;

    IF v_commission > 0 THEN
      UPDATE wallets SET
        available_balance = available_balance + v_commission,
        lifetime_earnings = lifetime_earnings + v_commission,
        updated_at = NOW()
      WHERE user_id = r.agent_id;

      INSERT INTO commission_ledger (user_id, order_id, amount, type, description)
      VALUES (r.agent_id, r.id, v_commission, 'credit', 'Commission for order ' || r.order_number);
    END IF;
  END LOOP;
END $$;
