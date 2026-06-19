/* ---------------------------------------------------------------------------
 * Certified expert roster — mocked for now; will be backed by Supabase.
 *
 * Each entry carries:
 *   • id, name, photo, rank        (matches the i18n status labels)
 *   • city, country, locationKey   (for grouping / search)
 *   • mapX, mapY                   (percentage coords on `/images/worldmap.png`,
 *                                   roughly equirectangular)
 *   • lat, lng                     (real coordinates — handy for the real
 *                                   Mapbox/Supabase wiring later)
 *   • contact: { instagram, phone }
 *
 * For the demo we extend the trainer roster with a handful of additional
 * Shining Artists / Master Assistants so the cluster markers have
 * meaningful counts in some cities.
 * ------------------------------------------------------------------------- */

import { TRAINERS } from './trainers';

const LOCATION_COORDS = {
  izmir:     { city: 'İzmir',     country: 'Turkey',  lat: 38.42, lng: 27.13, mapX: 57.7, mapY: 32.0 },
  ankara:    { city: 'Ankara',    country: 'Turkey',  lat: 39.93, lng: 32.85, mapX: 59.2, mapY: 31.5 },
  balikesir: { city: 'Balıkesir', country: 'Turkey',  lat: 39.65, lng: 27.89, mapX: 57.9, mapY: 31.5 },
  antalya:   { city: 'Antalya',   country: 'Turkey',  lat: 36.90, lng: 30.71, mapX: 58.5, mapY: 32.7 },
  istanbul:  { city: 'İstanbul',  country: 'Turkey',  lat: 41.01, lng: 28.98, mapX: 58.1, mapY: 30.8 },
  adana:     { city: 'Adana',     country: 'Turkey',  lat: 37.00, lng: 35.32, mapX: 59.8, mapY: 32.6 },
  kktc:      { city: 'KKTC',      country: 'Cyprus',  lat: 35.19, lng: 33.38, mapX: 59.3, mapY: 33.3 },
};

const TRAINER_CONTACTS = {
  guzide:  { instagram: '@guzidekorkmaz',     phone: '+90 232 000 00 00' },
  dilek:   { instagram: '@dilekceyhan',       phone: '+90 312 000 00 00' },
  ebru:    { instagram: '@ebruaydogan',       phone: '+90 266 000 00 00' },
  azize:   { instagram: '@azizeeren',         phone: '+90 242 000 00 00' },
  zeynep:  { instagram: '@zeynepyigit',       phone: '+90 392 000 00 00' },
  gozde:   { instagram: '@gozdesenkal',       phone: '+90 212 000 00 00' },
  feride:  { instagram: '@feride.ozlem',      phone: '+90 322 000 00 00' },
};

// Trainers are the headline of the expert list. Spread their location +
// contact info onto the base trainer record so consumers only need one
// source of truth.
const TRAINER_EXPERTS = TRAINERS.map((t) => {
  const loc = LOCATION_COORDS[t.locationKey] || {};
  return {
    ...t,
    ...loc,
    contact: TRAINER_CONTACTS[t.id] || {},
  };
});

// A handful of additional certified artists at lower ranks so the city
// counts are interesting on the map. Drop in / replace freely.
const EXTRA_EXPERTS = [
  {
    id: 'artist-melike',
    name: 'Melike Sönmez',
    photo: '/images/1.png',
    rank: 'shining_artist',
    flag: '🇹🇷',
    countryKey: 'turkey',
    ...LOCATION_COORDS.istanbul,
    contact: { instagram: '@melike.sonmez', phone: '+90 212 000 11 11' },
  },
  {
    id: 'artist-yagmur',
    name: 'Yağmur Karadeniz',
    photo: '/images/3.png',
    rank: 'master_assistant',
    flag: '🇹🇷',
    countryKey: 'turkey',
    ...LOCATION_COORDS.istanbul,
    contact: { instagram: '@yagmur.karadeniz', phone: '+90 212 000 22 22' },
  },
  {
    id: 'artist-irem',
    name: 'İrem Yıldırım',
    photo: '/images/6.png',
    rank: 'shining_artist',
    flag: '🇹🇷',
    countryKey: 'turkey',
    ...LOCATION_COORDS.izmir,
    contact: { instagram: '@iremyildirim', phone: '+90 232 000 33 33' },
  },
  {
    id: 'artist-pinar',
    name: 'Pınar Çetin',
    photo: '/images/10.png',
    rank: 'master_assistant',
    flag: '🇹🇷',
    countryKey: 'turkey',
    ...LOCATION_COORDS.ankara,
    contact: { instagram: '@pinarcetin', phone: '+90 312 000 44 44' },
  },
  {
    id: 'artist-derya',
    name: 'Derya Şahin',
    photo: '/images/12.png',
    rank: 'shining_artist',
    flag: '🇹🇷',
    countryKey: 'turkey',
    ...LOCATION_COORDS.antalya,
    contact: { instagram: '@deryasahin', phone: '+90 242 000 55 55' },
  },
];

export const EXPERTS = [...TRAINER_EXPERTS, ...EXTRA_EXPERTS];

// Group experts by city → { cityKey: { city, country, mapX, mapY, experts[] } }
export function clusterByCity() {
  const groups = new Map();
  EXPERTS.forEach((e) => {
    if (!e.locationKey) return;
    const key = e.locationKey;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        city: e.city,
        country: e.country,
        mapX: e.mapX,
        mapY: e.mapY,
        experts: [],
      });
    }
    groups.get(key).experts.push(e);
  });
  return Array.from(groups.values());
}
