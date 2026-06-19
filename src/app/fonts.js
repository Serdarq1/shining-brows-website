import { Jost } from 'next/font/google';

export const jost = Jost({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-jost',
});
