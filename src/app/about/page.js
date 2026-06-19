'use client';
import { useState } from 'react';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import AboutHero from '@/components/AboutHero';
import BiggestAcademySection from '@/components/BiggestAcademySection';
import MosaicGallerySection from '@/components/MosaicGallerySection';
import FeedbacksSection from '@/components/FeedbacksSection';
import JoinIndustrySection from '@/components/JoinIndustrySection';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const [locale, setLocale] = useState('tr');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <PromoBar hidden={menuOpen} locale={locale} />
      <Nav locale={locale} onLocaleChange={setLocale} onMenuChange={setMenuOpen} />
      <main>
        <AboutHero locale={locale} />
        <BiggestAcademySection locale={locale} />
        <MosaicGallerySection locale={locale} />
        <FeedbacksSection locale={locale} />
        <JoinIndustrySection locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
