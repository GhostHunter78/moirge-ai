-- Allow anyone (including anonymous and authenticated) to read store profiles.
-- Required for: Stores listing page and public store pages (/store/[sellerId]).
-- Without this policy, SELECT on store_profiles returns no rows when RLS is enabled.

ALTER TABLE public.store_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if you re-run this (avoid duplicate policy error)
DROP POLICY IF EXISTS "Allow public read store_profiles" ON public.store_profiles;

CREATE POLICY "Allow public read store_profiles"
  ON public.store_profiles
  FOR SELECT
  USING (true);
