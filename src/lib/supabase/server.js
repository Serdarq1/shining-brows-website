import { createClient } from '@supabase/supabase-js';

/* ---------------------------------------------------------------------------
 * Server-side Supabase client. Used inside Server Components and route
 * handlers to do public reads (experts, workshops). Public anon key is
 * fine here because RLS gates access — see `supabase/policies.sql`.
 *
 * Returns `null` if the env vars are missing so pages can render an empty
 * state during local dev before the project is wired up.
 * ------------------------------------------------------------------------- */

function normalizeSupabaseUrl(rawUrl) {
  if (!rawUrl) return null;
  try {
    const parsed = new URL(rawUrl);
    if (!/^https?:$/i.test(parsed.protocol)) return null;
    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return null;
  }
}

export function supabaseServer() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const url = normalizeSupabaseUrl(rawUrl);
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!rawUrl || !key) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        '[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing — server pages will render empty data.'
      );
    }
    return null;
  }
  // Validate the URL shape ourselves so a malformed env var (e.g. a
  // `postgres://` DB connection string by accident) degrades to an
  // empty-state render instead of crashing the page.
  if (!url) {
    // eslint-disable-next-line no-console
    console.warn(
      `[supabase] NEXT_PUBLIC_SUPABASE_URL must be an http(s) project URL — got "${rawUrl.slice(0, 40)}…". Pages will render empty data.`
    );
    return null;
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
