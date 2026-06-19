/* ---------------------------------------------------------------------------
 * Workshop data — mocked for now; swap to a CMS or API later.
 * Shared between FindCourseSection (the calendar grid) and the workshop
 * registration page so a single source of truth drives both.
 *
 * Trainer identities here mirror the roster in `src/lib/trainers.js`.
 * Only Dilek Ceyhan is a Gold Master (and runs the online workshops from
 * Ankara); every other instructor on the calendar is a Master Trainer.
 * ------------------------------------------------------------------------- */

export const WORKSHOPS = [
  {
    id: 'w-01',
    href: '/workshops/w-01',
    master: { name: 'Güzide Korkmaz', photo: '/images/guzidekorkmaz.png', status: 'founder' },
    type: 'face-to-face',
    location: 'İzmir',
    locationKey: 'izmir',
    country: 'Turkey',
    day: 27,
    monthIndex: 6, // July
    year: 2026,
    durationDays: 2,
  },
  {
    id: 'w-02',
    href: '/workshops/w-02',
    master: { name: 'Dilek Ceyhan', photo: '/images/dilekceyhan.png', status: 'gold_master' },
    type: 'online',
    day: 14,
    monthIndex: 7, // August
    year: 2026,
    durationDays: 2,
  },
  {
    id: 'w-03',
    href: '/workshops/w-03',
    master: { name: 'Dilek Ceyhan', photo: '/images/dilekceyhan.png', status: 'gold_master' },
    type: 'face-to-face',
    location: 'Ankara',
    locationKey: 'ankara',
    country: 'Turkey',
    day: 22,
    monthIndex: 7, // August
    year: 2026,
    durationDays: 3,
  },
  {
    id: 'w-04',
    href: '/workshops/w-04',
    master: { name: 'Ebru Aydoğan', photo: '/images/ebruaydogan.png', status: 'master_trainer' },
    type: 'face-to-face',
    location: 'Balıkesir',
    locationKey: 'balikesir',
    country: 'Turkey',
    day: 9,
    monthIndex: 8, // September
    year: 2026,
    durationDays: 2,
  },
  {
    id: 'w-05',
    href: '/workshops/w-05',
    master: { name: 'Azize Eren', photo: '/images/azizeeren.png', status: 'master_trainer' },
    type: 'face-to-face',
    location: 'Antalya',
    locationKey: 'antalya',
    country: 'Turkey',
    day: 23,
    monthIndex: 8, // September
    year: 2026,
    durationDays: 2,
  },
  {
    id: 'w-06',
    href: '/workshops/w-06',
    master: { name: 'Zeynep Yiğit', photo: '/images/zeynepyigit.png', status: 'master_trainer' },
    type: 'face-to-face',
    location: 'KKTC',
    locationKey: 'kktc',
    country: '',
    day: 5,
    monthIndex: 9, // October
    year: 2026,
    durationDays: 2,
  },
  {
    id: 'w-07',
    href: '/workshops/w-07',
    master: { name: 'Gözde Şenkal', photo: '/images/gozdeşenkal.png', status: 'master_trainer' },
    type: 'face-to-face',
    location: 'İstanbul',
    locationKey: 'istanbul',
    country: 'Turkey',
    day: 12,
    monthIndex: 10, // November
    year: 2026,
    durationDays: 2,
  },
  {
    id: 'w-08',
    href: '/workshops/w-08',
    master: { name: 'Feride Özlem Gürkan', photo: '/images/ferideozlemgurkan.png', status: 'master_trainer' },
    type: 'face-to-face',
    location: 'Adana',
    locationKey: 'adana',
    country: 'Turkey',
    day: 4,
    monthIndex: 11, // December
    year: 2026,
    durationDays: 2,
  },
];

export const LOCATION_LABELS = {
  izmir: 'İzmir',
  ankara: 'Ankara',
  balikesir: 'Balıkesir',
  antalya: 'Antalya',
  istanbul: 'İstanbul',
  adana: 'Adana',
  kktc: 'KKTC',
};

export const RANK_LOGOS = {
  founder: '/images/logo_black.png.png',
  gold_master: '/images/goldmaster_logo.png',
  master_trainer: '/images/mastertrainer_logo.png',
};

export function findWorkshop(id) {
  return WORKSHOPS.find((w) => w.id === id);
}
