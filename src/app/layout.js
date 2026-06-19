import './globals.css';
import { jost } from './fonts';
import LenisProvider from '@/components/LenisProvider';
import PageLoader from '@/components/PageLoader';

// To load freight-big-pro from Adobe Fonts, add:
//   <link rel="stylesheet" href="https://use.typekit.net/YOUR_KIT_ID.css" />
// inside <body> below — React 18 will hoist it into <head>.

export const metadata = {
  title: 'SHINING BROWS Academy — Doğal Kaş Bakım Akademisi',
  description:
    "Türkiye, KKTC ve Hollanda'daki uzmanlarımızdan doğal kaş tasarımı, vitamin, kına ve hybrid silme eğitimleri.",
};

export const viewport = {
  themeColor: '#faf7f2',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={jost.variable}>
      <body className="font-body bg-ivory text-charcoal antialiased">
        <link rel="stylesheet" href="https://use.typekit.net/jbn4cly.css" />
        <PageLoader />
        <div className="grain" aria-hidden />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
