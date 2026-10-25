import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { PrivateLessonsBookingClient } from '@/components/lessons/PrivateLessonsBookingClient';
import { Calendar, Sparkles } from 'lucide-react';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface PageProps {
  params: { lang: string };
  searchParams?: { slotId?: string; date?: string };
}

export default async function PrivateLessonsPage({
  params: { lang },
  searchParams,
}: PageProps) {
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: 'privateLessons' });
  const isRtl = lang === 'ar';

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-gold">
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('badge')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Client Booking Calendar & PayPal Checkout Form */}
        <PrivateLessonsBookingClient
          currentLocale={lang}
          initialSlotId={searchParams?.slotId}
          initialDate={searchParams?.date}
        />
      </div>
    </div>
  );
}
