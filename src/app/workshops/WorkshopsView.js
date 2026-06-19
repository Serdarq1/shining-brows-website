'use client';
import { useState } from 'react';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FindCourseSection from '@/components/FindCourseSection';
import Footer from '@/components/Footer';

export default function WorkshopsView({ workshops = [] }) {
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
        <FindCourseSection locale={locale} workshops={workshops} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
