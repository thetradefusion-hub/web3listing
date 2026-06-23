-- Fix: "Database error saving new user" when creating users in Supabase Auth
-- Cause: handle_new_user trigger blocked by RLS / missing grants on profiles & wallets

-- 1. Recreate trigger function with safe search_path and email fallback
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', ''),
    'agent'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user failed for %: %', NEW.id, SQLERRM;
    RAISE;
END;
$$;

-- 2. Grants for Supabase Auth admin role (runs signup triggers)
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.profiles TO supabase_auth_admin;
GRANT ALL ON public.wallets TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

-- 3. RLS: allow profile + wallet creation during auth signup
DROP POLICY IF EXISTS "Allow signup profile insert" ON profiles;
CREATE POLICY "Allow signup profile insert"
  ON profiles FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow signup wallet insert" ON wallets;
CREATE POLICY "Allow signup wallet insert"
  ON wallets FOR INSERT
  WITH CHECK (true);

-- 4. Service role full access (admin API / server actions)
DROP POLICY IF EXISTS "Service role manages profiles" ON profiles;
CREATE POLICY "Service role manages profiles"
  ON profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages wallets" ON wallets;
CREATE POLICY "Service role manages wallets"
  ON wallets FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
