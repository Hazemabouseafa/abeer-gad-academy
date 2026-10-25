import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { FeaturedCourses } from '@/components/home/FeaturedCourses';
import { Sparkles, BookOpen, Layers, Award } from 'lucide-react';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface CoursesPageProps {
  params: {
    lang: string;
  };
}

export default async function CoursesPage({ params: { lang } }: CoursesPageProps) {
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: 'courses' });
  const isRtl = lang === 'ar';

  return (
    <div className="py-12 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Page Banner Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
          <span className="badge-light">
            <Layers className="w-3.5 h-3.5" />
            <span>{t('badge')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Courses Component Grid */}
        <FeaturedCourses currentLocale={lang} />
      </div>
    </div>
  );
}
