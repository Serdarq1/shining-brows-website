import tr from './tr';
import en from './en';

export const LOCALES = ['tr', 'en'];
export const DEFAULT_LOCALE = 'tr';

const dictionaries = { tr, en };

export function getDictionary(locale) {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}
