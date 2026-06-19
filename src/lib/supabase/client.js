'use client';
import { createClient } from '@supabase/supabase-js';

/* ---------------------------------------------------------------------------
 * Browser-side Supabase client. Used from `'use client'` components for
 * inserts the user kicks off — currently the workshop registration form
 * which writes to `potential_leads`.
 *
 * The instance is cached at module scope so we don't open a fresh client
 * on every render.
 * ------------------------------------------------------------------------- */

let cached = null;

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

export function supabaseBrowser() {
  if (cached) return cached;
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn(
        '[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing — client writes will throw.'
      );
    }
    return null;
  }
  cached = createClient(url, key);
  return cached;
}
