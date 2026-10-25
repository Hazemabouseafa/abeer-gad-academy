import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesCardsSection } from '@/components/home/ServicesCardsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { QuickConsultationBanner } from '@/components/home/QuickConsultationBanner';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface HomePageProps {
  params: {
    lang: string;
  };
}

export default async function HomePage({ params: { lang } }: HomePageProps) {
  // Enable static rendering for next-intl
  setRequestLocale(lang);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Concise, Elegant Hero Section with Live Metrics */}
      <HeroSection currentLocale={lang} />

      {/* 2. Unified Interactive Services Cards Section (وجوا الكارد التفاصيل) */}
      <ServicesCardsSection currentLocale={lang} />

      {/* 3. Global Student & Scholar Endorsements */}
      <TestimonialsSection currentLocale={lang} />

      {/* 4. Quick WhatsApp Placement & Consultation Banner */}
      <QuickConsultationBanner currentLocale={lang} />
    </div>
  );
}
