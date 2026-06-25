-- User role: self-service clients who order without commission

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'user';

ALTER TABLE services ADD COLUMN IF NOT EXISTS requires_kyc BOOLEAN NOT NULL DEFAULT false;

-- Signup: role from metadata (default user); wallet only for agents
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role user_role;
BEGIN
  v_role := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'role', '')::user_role,
    'user'::user_role
  );

  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', ''),
    v_role,
    NULLIF(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;

  IF v_role = 'agent' THEN
    INSERT INTO public.wallets (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user failed for %: %', NEW.id, SQLERRM;
    RAISE;
END;
$$;

-- Skip commission for end-user orders
CREATE OR REPLACE FUNCTION credit_commission_on_order_complete()
RETURNS TRIGGER AS $$
DECLARE
  v_commission DECIMAL(12,2);
  v_service services%ROWTYPE;
  v_payment_amount DECIMAL(12,2);
  v_owner_role user_role;
BEGIN
  IF NEW.status IN ('completed', 'delivered', 'closed')
     AND OLD.status NOT IN ('completed', 'delivered', 'closed') THEN

    SELECT role INTO v_owner_role FROM profiles WHERE id = NEW.agent_id;
    IF v_owner_role = 'user' THEN
      RETURN NEW;
    END IF;

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
