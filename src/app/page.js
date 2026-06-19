'use client';
import { useState } from 'react';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import HybridRemoverSection from '@/components/HybridRemoverSection';
import ArchiveGallerySection from '@/components/ArchiveGallerySection';
import CoursesSection from '@/components/CoursesSection';
import MasterSection from '@/components/MasterSection';
import ExpertsSection from '@/components/ExpertsSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [locale, setLocale] = useState('tr');
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

  return (
    <>
      <PromoBar hidden={menuOpen || navHidden} locale={locale} />
      <Nav
        locale={locale}
        onLocaleChange={setLocale}
        onMenuChange={setMenuOpen}
        forceHidden={navHidden}
      />
      <main>
        <Hero locale={locale} />
        <AboutSection locale={locale} />
        <HybridRemoverSection
          locale={locale}
          onNavVisibilityChange={setNavHidden}
        />
        <CoursesSection locale={locale} />
        <MasterSection locale={locale} />
        <ExpertsSection locale={locale} />
        <ArchiveGallerySection locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
