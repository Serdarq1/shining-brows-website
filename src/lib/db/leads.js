'use client';
import { supabaseBrowser } from '@/lib/supabase/client';

/* ---------------------------------------------------------------------------
 * Writes the workshop registration form into `potential_leads` from the
 * browser. Inserts only — no read-back. Supabase RLS ensures anonymous
 * clients cannot list existing leads.
 *
 * Columns intentionally written:
 *   full_name, phone, workshop_id, workshop_title, workshop_city,
 *   workshop_date, consent_accepted, referral_source ('site:workshop-form')
 * ------------------------------------------------------------------------- */

export async function submitWorkshopLead({ name, surname, phone, workshop, consent }) {
  const sb = supabaseBrowser();
  if (!sb) throw new Error('Supabase client unavailable — env vars missing.');

  const payload = {
    full_name: `${name || ''} ${surname || ''}`.trim(),
    phone: phone || null,
    workshop_id: workshop?.id || null,
    workshop_title: workshop?.title || workshop?.master?.name || null,
    workshop_city: workshop?.location || null,
    workshop_date: workshop?.startDate || null,
    consent_accepted: !!consent,
    referral_source: 'site:workshop-form',
    status: 'new',
  };

  const { error } = await sb.from('potential_leads').insert(payload);
  if (error) throw error;
}
