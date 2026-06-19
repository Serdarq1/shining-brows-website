import { supabaseServer } from '@/lib/supabase/server';

/* ---------------------------------------------------------------------------
 * Reads against the `workshops` table.
 *
 * Workshops carry a `master_id` foreign key into `experts`. We pull the
 * relevant master fields inline via a relational select so the calendar
 * cards and the registration page get the master's photo/name/rank in
 * one round trip.
 *
 * Frontend shape (matches the existing mock):
 *   id, slug, href, type, location (city), country, day, monthIndex,
 *   year, durationDays, locationKey, description, image, locationName,
 *   address, master: { id, name, photo, status, city, district }
 * ------------------------------------------------------------------------- */

const FIELDS = `
  id, title, slug, city, country, district,
  start_date, end_date, start_time, end_time,
  location_name, address, latitude, longitude,
  description, image_url, capacity, available_seats,
  is_active, is_featured, sort_order, format,
  master:experts!master_id (
    id, full_name, photo_url, rank, city, district
  )
`;

function daysBetween(a, b) {
  const ms = b.getTime() - a.getTime();
  return Math.max(1, Math.round(ms / 86400000) + 1);
}

function mapWorkshop(row) {
  // start_date is YYYY-MM-DD — parse as local-midnight to avoid TZ slip.
  const start = row.start_date
    ? new Date(`${row.start_date}T00:00:00`)
    : null;
  const end = row.end_date
    ? new Date(`${row.end_date}T00:00:00`)
    : start;

  return {
    id: row.id,
    slug: row.slug,
    href: `/workshops/${row.id}`,
    title: row.title,
    type: row.format || (row.city ? 'face-to-face' : 'online'),
    location: row.city,
    locationKey: row.city ? row.city.toLocaleLowerCase('tr-TR') : null,
    country: row.country,
    district: row.district,
    day: start ? start.getDate() : null,
    monthIndex: start ? start.getMonth() : null,
    year: start ? start.getFullYear() : null,
    durationDays: start && end ? daysBetween(start, end) : 1,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
    image: row.image_url,
    locationName: row.location_name,
    address: row.address,
    capacity: row.capacity,
    availableSeats: row.available_seats,
    isFeatured: row.is_featured,
    master: row.master
      ? {
          id: row.master.id,
          name: row.master.full_name,
          photo: row.master.photo_url,
          status: row.master.rank,
          city: row.master.city,
          district: row.master.district,
        }
      : null,
  };
}

export async function getWorkshops() {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data, error } = await sb
    .from('workshops')
    .select(FIELDS)
    .eq('is_active', true)
    .order('start_date', { ascending: true });
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[db.getWorkshops]', error);
    return [];
  }
  return (data || []).map(mapWorkshop);
}

export async function getWorkshopById(id) {
  const sb = supabaseServer();
  if (!sb) return null;
  const { data, error } = await sb
    .from('workshops')
    .select(FIELDS)
    .eq('id', id)
    .maybeSingle();
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[db.getWorkshopById]', error);
    return null;
  }
  return data ? mapWorkshop(data) : null;
}
