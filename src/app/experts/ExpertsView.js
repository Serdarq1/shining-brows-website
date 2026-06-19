'use client';
import { useState } from 'react';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import ExpertMapSection from '@/components/ExpertMapSection';
import Footer from '@/components/Footer';

export default function ExpertsView({ experts = [] }) {
  const [locale, setLocale] = useState('tr');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <PromoBar hidden={menuOpen} locale={locale} />
      <Nav
        locale={locale}
        onLocaleChange={setLocale}
        onMenuChange={setMenuOpen}
      />
      <main>
        <ExpertMapSection locale={locale} experts={experts} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
