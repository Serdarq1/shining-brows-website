/* ---------------------------------------------------------------------------
 * Trainer roster — shared between the Courses hero and the workshop
 * registration data. Names are proper nouns so they stay outside i18n;
 * country *labels* are looked up per-locale via `dict.coursesPage.countries`.
 *
 * Rank keys map straight to the labels in `dict.findCourse.statuses` and
 * to the existing monogram PNGs (`/images/<rank>_logo.png`). The founder
 * uses the brand monogram instead.
 * ------------------------------------------------------------------------- */

export const TRAINERS = [
  {
    id: 'guzide',
    name: 'Güzide Korkmaz',
    photo: '/images/guzidekorkmaz.png',
    flag: '🇹🇷',
    countryKey: 'turkey',
    location: 'İzmir',
    locationKey: 'izmir',
    rank: 'founder',
  },
  {
    id: 'dilek',
    name: 'Dilek Ceyhan',
    photo: '/images/dilekceyhan.png',
    flag: '🇹🇷',
    countryKey: 'turkey',
    location: 'Ankara',
    locationKey: 'ankara',
    rank: 'gold_master',
  },
  {
    id: 'ebru',
    name: 'Ebru Aydoğan',
    photo: '/images/ebruaydogan.png',
    flag: '🇹🇷',
    countryKey: 'turkey',
    location: 'Balıkesir',
    locationKey: 'balikesir',
    rank: 'master_trainer',
  },
  {
    id: 'azize',
    name: 'Azize Eren',
    photo: '/images/azizeeren.png',
    flag: '🇹🇷',
    countryKey: 'turkey',
    location: 'Antalya',
    locationKey: 'antalya',
    rank: 'master_trainer',
  },
  {
    id: 'zeynep',
    name: 'Zeynep Yiğit',
    photo: '/images/zeynepyigit.png',
    flag: '🇨🇾',
    countryKey: 'kktc',
    location: 'KKTC',
    locationKey: 'kktc',
    rank: 'master_trainer',
  },
  {
    id: 'gozde',
    name: 'Gözde Şenkal',
    photo: '/images/gozdeşenkal.png',
    flag: '🇹🇷',
    countryKey: 'turkey',
    location: 'İstanbul',
    locationKey: 'istanbul',
    rank: 'master_trainer',
  },
  {
    id: 'feride',
    name: 'Feride Özlem Gürkan',
    photo: '/images/ferideozlemgurkan.png',
    flag: '🇹🇷',
    countryKey: 'turkey',
    location: 'Adana',
    locationKey: 'adana',
    rank: 'master_trainer',
  },
];

export const RANK_LOGOS = {
  founder: '/images/logo_white.png',
  gold_master: '/images/goldmaster_logo.png',
  master_trainer: '/images/mastertrainer_logo.png',
};

export function getTrainer(id) {
  return TRAINERS.find((t) => t.id === id);
}
