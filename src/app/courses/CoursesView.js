'use client';
import { useState } from 'react';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import CoursesHero from '@/components/CoursesHero';
import CoursesSection from '@/components/CoursesSection';
import MasterSection from '@/components/MasterSection';
import TrainingFlowSection from '@/components/TrainingFlowSection';
import CertificatesSection from '@/components/CertificatesSection';
import JoinIndustrySection from '@/components/JoinIndustrySection';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/i18n';

export default function CoursesView({ trainers = [] }) {
  const [locale, setLocale] = useState('tr');
  const [menuOpen, setMenuOpen] = useState(false);
  const dict = getDictionary(locale).coursesPage;

  return (
    <>
      <PromoBar hidden={menuOpen} locale={locale} />
      <Nav
        locale={locale}
        onLocaleChange={setLocale}
        onMenuChange={setMenuOpen}
      />
      <main>
        <CoursesHero locale={locale} trainers={trainers} />
        <CoursesSection locale={locale} showSeeAll={false} />
        <TrainingFlowSection locale={locale} />
        <CertificatesSection locale={locale} />
        <MasterSection
          locale={locale}
          variant="plan"
          title={dict.planTitle}
          body={dict.planBody}
          ctaLabel={dict.joinCta}
          ctaHref="/workshops"
        />
        <JoinIndustrySection locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
