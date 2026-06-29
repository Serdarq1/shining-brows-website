import { supabaseServer } from '@/lib/supabase/server';

/* ---------------------------------------------------------------------------
 * Reads against the `experts` table. Maps the DB row shape (snake_case
 * fields, full_name, photo_url, …) onto the camelCase shape every section
 * component already speaks.
 *
 * Ranks: snake_case in the DB. The trainer scatter + workshop calendar
 * only feature ranks in `MASTER_RANKS`.
 * ------------------------------------------------------------------------- */

// Single-line select to avoid PostgREST complaining about whitespace in
// the request URL on some setups.
const FIELDS =
  'id,full_name,email,phone,address,city,country,district,latitude,longitude,instagram,rank,photo_url,is_active,created_at';

const CITY_COORDS = {
  adana: { lat: 37.0, lng: 35.32 },
  amersfoort: { lat: 52.1561, lng: 5.3878 },
  ankara: { lat: 39.9334, lng: 32.8597 },
  antalya: { lat: 36.8969, lng: 30.7133 },
  aydin: { lat: 37.856, lng: 27.8416 },
  balikesir: { lat: 39.6484, lng: 27.8826 },
  bartin: { lat: 41.6358, lng: 32.3375 },
  bonn: { lat: 50.7374, lng: 7.0982 },
  canakkale: { lat: 40.1553, lng: 26.4142 },
  denizli: { lat: 37.7765, lng: 29.0864 },
  gaziantep: { lat: 37.0662, lng: 37.3833 },
  hatay: { lat: 36.2021, lng: 36.1603 },
  istanbul: { lat: 41.0082, lng: 28.9784 },
  izmir: { lat: 38.4237, lng: 27.1428 },
  kocaeli: { lat: 40.7654, lng: 29.9408 },
  kktc: { lat: 35.19, lng: 33.38 },
  lefkosa: { lat: 35.19, lng: 33.36 },
  linz: { lat: 48.3069, lng: 14.2858 },
  magusa: { lat: 35.125, lng: 33.95 },
  manisa: { lat: 38.614, lng: 27.4296 },
  mersin: { lat: 36.8121, lng: 34.6415 },
  mugla: { lat: 37.2153, lng: 28.3636 },
  nigde: { lat: 37.9667, lng: 34.6833 },
  peterborough: { lat: 52.5695, lng: -0.2405 },
  tokat: { lat: 40.3167, lng: 36.55 },
  van: { lat: 38.5012, lng: 43.3729 },
  yalova: { lat: 40.6549, lng: 29.2842 },
  'zonguldak eregli': { lat: 41.2821, lng: 31.4181 },
};

const DISTRICT_COORDS = {
  'ankara-cankaya': { lat: 39.9179, lng: 32.8627 },
  'antalya-alanya': { lat: 36.5438, lng: 31.9998 },
  'antalya-konyaalti': { lat: 36.8656, lng: 30.636 },
  'antalya-kepez': { lat: 36.934, lng: 30.7133 },
  'antalya-manavgat': { lat: 36.7867, lng: 31.4431 },
  'antalya-muratpasa': { lat: 36.885, lng: 30.711 },
  'aydin-didim': { lat: 37.3756, lng: 27.2678 },
  'aydin-efeler': { lat: 37.852, lng: 27.845 },
  'aydin-germencik': { lat: 37.8703, lng: 27.6028 },
  'aydin-incirliova': { lat: 37.8522, lng: 27.7236 },
  'aydin-kusadasi': { lat: 37.8579, lng: 27.261 },
  'aydin-nazilli': { lat: 37.9125, lng: 28.3206 },
  'aydin-soke': { lat: 37.7508, lng: 27.4066 },
  'balikesir-burhaniye': { lat: 39.5004, lng: 26.9727 },
  'balikesir-edremit': { lat: 39.592, lng: 27.024 },
  'balikesir-karesi': { lat: 39.6484, lng: 27.8826 },
  'bartin-merkez': { lat: 41.6358, lng: 32.3375 },
  'bonn-bonn': { lat: 50.7374, lng: 7.0982 },
  'canakkale-merkez': { lat: 40.1553, lng: 26.4142 },
  'denizli-merkez': { lat: 37.7765, lng: 29.0864 },
  'denizli-merkezefendi': { lat: 37.7733, lng: 29.0795 },
  'denizli-pamukkale': { lat: 37.7386, lng: 29.1026 },
  'gaziantep-sahinbey': { lat: 37.058, lng: 37.379 },
  'hatay-defne': { lat: 36.235, lng: 36.145 },
  'istanbul-atakoy': { lat: 40.982, lng: 28.857 },
  'istanbul-beylikduzu': { lat: 41.001, lng: 28.641 },
  'istanbul-catalca': { lat: 41.1432, lng: 28.4615 },
  'istanbul-esenyurt': { lat: 41.034, lng: 28.68 },
  'istanbul-eyup': { lat: 41.0478, lng: 28.9339 },
  'istanbul-pendik': { lat: 40.8797, lng: 29.2581 },
  'istanbul-sancaktepe': { lat: 41.0024, lng: 29.2319 },
  'izmir-aliaga': { lat: 38.7996, lng: 26.9707 },
  'izmir-bayrakli': { lat: 38.4622, lng: 27.1664 },
  'izmir-bornova': { lat: 38.4697, lng: 27.2167 },
  'izmir-buca': { lat: 38.3841, lng: 27.1665 },
  'izmir-cesme': { lat: 38.3236, lng: 26.302 },
  'izmir-cigli': { lat: 38.4926, lng: 27.0569 },
  'izmir-gaziemir': { lat: 38.3189, lng: 27.132 },
  'izmir-karabaglar': { lat: 38.3735, lng: 27.1351 },
  'izmir-karsiyaka': { lat: 38.4593, lng: 27.115 },
  'izmir-konak': { lat: 38.4192, lng: 27.1287 },
  'izmir-menderes': { lat: 38.2496, lng: 27.1346 },
  'izmir-menemen': { lat: 38.6075, lng: 27.0694 },
  'izmir-narlidere': { lat: 38.3928, lng: 27.0053 },
  'izmir-torbali': { lat: 38.1519, lng: 27.3622 },
  'izmir-turgutlu': { lat: 38.4957, lng: 27.6997 },
  'izmir-ucyol': { lat: 38.4058, lng: 27.1239 },
  'izmir-urla': { lat: 38.3229, lng: 26.764 },
  'kocaeli-kartepe': { lat: 40.753, lng: 30.023 },
  'linz-linzland': { lat: 48.188, lng: 14.188 },
  'magusa-magusa': { lat: 35.125, lng: 33.95 },
  'manisa-akhisar': { lat: 38.9185, lng: 27.8401 },
  'manisa-merkez': { lat: 38.614, lng: 27.4296 },
  'manisa-salihli': { lat: 38.4826, lng: 28.1477 },
  'manisa-sariuhanli': { lat: 38.7345, lng: 27.5681 },
  'manisa-turgutlu': { lat: 38.4957, lng: 27.6997 },
  'manisa-yunusemre': { lat: 38.62, lng: 27.41 },
  'mersin-yenisehir': { lat: 36.787, lng: 34.584 },
  'mugla-bodrum': { lat: 37.0344, lng: 27.4305 },
  'mugla-mentese': { lat: 37.214, lng: 28.363 },
  'nigde-bor': { lat: 37.89, lng: 34.56 },
  'peterborough-peterborough': { lat: 52.5695, lng: -0.2405 },
  'tokat-merkez': { lat: 40.3167, lng: 36.55 },
  'van-ipekyolu': { lat: 38.5, lng: 43.39 },
  'van-tusba': { lat: 38.58, lng: 43.37 },
  'yalova-merkez': { lat: 40.6549, lng: 29.2842 },
  'zonguldak eregli-eregli': { lat: 41.2821, lng: 31.4181 },
};

function normalizeText(value) {
  return (value || '')
    .toString()
    .trim()
    .toLocaleLowerCase('tr-TR');
}

function normalizeLookup(value) {
  return normalizeText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeCountry(value) {
  const country = normalizeLookup(value).replace(/\s+/g, '');
  if (['turkey', 'turkiye', 'türkiye', 'tükiye', 'turkıye'].includes(country)) {
    return 'turkey';
  }
  return country;
}

function parseCoordinate(value) {
  if (value == null || value === '') return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

function hashString(value) {
  const input = (value || '').toString();
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function offsetCoordinate(coords, seed, radiusKm) {
  const hashA = hashString(`${seed}:a`) / 0xffffffff;
  const hashB = hashString(`${seed}:b`) / 0xffffffff;
  const angle = hashA * Math.PI * 2;
  const distanceKm = Math.sqrt(hashB) * radiusKm;
  const latOffset = (Math.sin(angle) * distanceKm) / 111;
  const lngScale = Math.cos((coords.lat * Math.PI) / 180) || 1;
  const lngOffset = (Math.cos(angle) * distanceKm) / (111 * lngScale);
  return {
    lat: coords.lat + latOffset,
    lng: coords.lng + lngOffset,
  };
}

function coordsForDistrict(city, district) {
  if (!city || !district) return null;
  const direct = DISTRICT_COORDS[`${city}-${district}`];
  if (direct) return direct;

  const prefix = `${city}-`;
  const match = Object.entries(DISTRICT_COORDS).find(([key]) => {
    if (!key.startsWith(prefix)) return false;
    const knownDistrict = key.slice(prefix.length);
    return district.includes(knownDistrict) || knownDistrict.includes(district);
  });
  return match?.[1] || null;
}

function coordinatesFor(row) {
  const lat = parseCoordinate(row.latitude);
  const lng = parseCoordinate(row.longitude);
  if (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(Math.abs(lat) < 0.00001 && Math.abs(lng) < 0.00001)
  ) {
    return { lat, lng };
  }

  const city = normalizeLookup(row.city);
  const district = normalizeLookup(row.district);
  const districtCoords = coordsForDistrict(city, district);
  if (districtCoords) return offsetCoordinate(districtCoords, row.id, 1.2);

  const cityCoords = CITY_COORDS[city];
  if (cityCoords) return offsetCoordinate(cityCoords, row.id, 4.5);

  return { lat: null, lng: null };
}

export const MASTER_RANKS = [
  'founder',
  'gold_master',
  'master_trainer',
  'distributor',
];

function mapExpert(row) {
  const coords = coordinatesFor(row);
  return {
    id: row.id,
    name: row.full_name,
    photo: row.photo_url,
    rank: row.rank,
    city: row.city,
    district: row.district || null,
    country: row.country,
    locationKey: row.city
      ? `${normalizeCountry(row.country)}-${normalizeLookup(row.city)}`
      : null,
    countryKey: row.country ? normalizeCountry(row.country) : null,
    lat: coords.lat,
    lng: coords.lng,
    contact: {
      phone: row.phone || null,
      instagram: row.instagram || null,
      address: row.address || null,
    },
  };
}

export async function getExperts() {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data, error } = await sb
    .from('experts')
    .select(FIELDS)
    .eq('is_active', true);
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[db.getExperts]', error);
    return [];
  }
  return (data || []).map(mapExpert);
}

// Ranks shown in the courses-page trainer scatter, in display order. The
// scatter is hand-positioned (CoursesHero POSITIONS), so order is
// deterministic to keep the founder on the anchor slot and stop the layout
// from reshuffling on every deploy.
// ponytail: CoursesHero must define at least as many POSITIONS as there are
// scatter trainers, or the surplus wraps onto slot 0 and overlaps.
const SCATTER_RANK_ORDER = ['founder', 'gold_master', 'master_trainer', 'distributor'];

export async function getTrainers() {
  const sb = supabaseServer();
  if (!sb) return [];
  const { data, error } = await sb
    .from('experts')
    .select(FIELDS)
    .eq('is_active', true)
    .in('rank', SCATTER_RANK_ORDER);
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[db.getTrainers]', error);
    return [];
  }
  return (data || [])
    .map(mapExpert)
    .sort(
      (a, b) =>
        SCATTER_RANK_ORDER.indexOf(a.rank) - SCATTER_RANK_ORDER.indexOf(b.rank) ||
        (a.name || '').localeCompare(b.name || '', 'tr')
    );
}
