-- ============================================================================
-- Shining Brows — RLS policies for public-facing reads + lead inserts.
-- Apply once in the Supabase SQL editor. RLS must already be enabled on
-- every table (it is).
-- ============================================================================

-- ── experts ────────────────────────────────────────────────────────────────
-- Anyone can read active experts (the directory + map use this).
DROP POLICY IF EXISTS "Public can view active experts" ON public.experts;
CREATE POLICY "Public can view active experts" ON public.experts
  FOR SELECT
  USING (is_active = true);

-- ── workshops ──────────────────────────────────────────────────────────────
-- Anyone can read active workshops (the calendar + registration pages).
DROP POLICY IF EXISTS "Public can view active workshops" ON public.workshops;
CREATE POLICY "Public can view active workshops" ON public.workshops
  FOR SELECT
  USING (is_active = true);

-- ── potential_leads ────────────────────────────────────────────────────────
-- Anyone can submit a lead via the workshop registration form. No SELECT
-- policy → anonymous clients cannot read back any rows.
GRANT INSERT ON public.potential_leads TO anon, authenticated;
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.potential_leads;
CREATE POLICY "Anyone can submit a lead" ON public.potential_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
