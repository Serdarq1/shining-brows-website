'use client';
import { useState } from 'react';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import ArchiveGallerySection from '@/components/ArchiveGallerySection';
import ProductsValuesSection from '@/components/ProductsValuesSection';
import ProductShowcaseSection from '@/components/ProductShowcaseSection';
import ExpertsSection from '@/components/ExpertsSection';
import Footer from '@/components/Footer';

export default function ProductsPage() {
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
        {/* The 3D archive gallery is the page hero — text rendered centred. */}
        <ArchiveGallerySection locale={locale} centered />
        <ProductsValuesSection locale={locale} />
        <ProductShowcaseSection locale={locale} />
        <ExpertsSection locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
