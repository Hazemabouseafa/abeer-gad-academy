'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Users,
  Globe2,
  CheckCircle2,
  Star,
  ArrowRight,
  ArrowLeft,
  Award,
} from 'lucide-react';
import type { SiteSettingsData } from '@/lib/data-store';

interface HeroSectionProps {
  currentLocale: string;
  initialSettings?: Partial<SiteSettingsData>;
}

export function HeroSection({ currentLocale, initialSettings }: HeroSectionProps) {
  const tHero = useTranslations('hero');
  const tBrand = useTranslations('brand');
  const isRtl = currentLocale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [settings, setSettings] = useState<Partial<SiteSettingsData>>(initialSettings || {});

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
      })
      .catch(() => {});
  }, []);

  const badgeText = isRtl
    ? settings.heroBadgeAr || tHero('badge')
    : settings.heroBadgeEn || tHero('badge');

  const titleText = isRtl
    ? settings.heroTitleAr || tHero('title')
    : settings.heroTitleEn || tHero('title');

  const titleHighlight = isRtl
    ? settings.heroTitleHighlightAr || tHero('titleHighlight')
    : settings.heroTitleHighlightEn || tHero('titleHighlight');

  const subtitleText = isRtl
    ? settings.heroSubtitleAr || tHero('subtitle')
    : settings.heroSubtitleEn || tHero('subtitle');

  const ctaPrimaryText = isRtl
    ? settings.heroCtaPrimaryTextAr || tHero('ctaExplore')
    : settings.heroCtaPrimaryTextEn || tHero('ctaExplore');

  const ctaPrimaryLink = settings.heroCtaPrimaryLink || '#services-section';

  const ctaSecondaryText = isRtl
    ? settings.heroCtaSecondaryTextAr || tHero('ctaBook')
    : settings.heroCtaSecondaryTextEn || tHero('ctaBook');

  const ctaSecondaryLink = settings.heroCtaSecondaryLink || '/private-lessons';

  const statStudents = settings.heroStudentsCount || '1,250+';
  const statCountries = settings.heroCountriesCount || '34+';
  const statMilestones = settings.heroLessonsCompleted || '850+';
  const statRating = settings.heroSatisfactionRate || '5.0';

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-[#FDFBF7] via-[#FAF7F0] to-[#FDFBF7]">
      {/* Geometric ambient elements (Light Mode) */}
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-brand-100/40 via-gold-100/30 to-brand-100/20 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Top Focus & Sanad Accreditation Badge (No Logo in Hero) */}
          <div className="inline-flex items-center justify-center mb-2 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-surface-border shadow-card-subtle text-xs sm:text-sm font-semibold text-brand-800">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span>{badgeText}</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-950 leading-[1.15]">
            <span>{titleText} </span>
            <span className="relative inline-block text-brand-700 underline decoration-gold-400 decoration-wavy decoration-2 underline-offset-8">
              {titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-navy-600 font-normal leading-relaxed max-w-2xl mx-auto">
            {subtitleText}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            {ctaPrimaryLink.startsWith('#') ? (
              <a
                href={ctaPrimaryLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-brand-700 text-white hover:bg-brand-800 shadow-card-subtle hover:shadow-teal-glow hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-gold-300" />
                <span>{ctaPrimaryText}</span>
                <ArrowIcon className="w-4 h-4" />
              </a>
            ) : (
              <Link
                href={ctaPrimaryLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-brand-700 text-white hover:bg-brand-800 shadow-card-subtle hover:shadow-teal-glow hover:-translate-y-0.5 transition-all duration-200"
              >
                <BookOpen className="w-4 h-4 text-gold-300" />
                <span>{ctaPrimaryText}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            )}

            <Link
              href={ctaSecondaryLink}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-navy-800 border border-surface-border hover:border-brand-500 hover:text-brand-800 hover:bg-surface-muted shadow-card-subtle hover:-translate-y-0.5 transition-all duration-200"
            >
              <Calendar className="w-4 h-4 text-gold-600" />
              <span>{ctaSecondaryText}</span>
            </Link>
          </div>

          {/* Lead Scholar Endorsement Pill */}
          <div className="pt-3 inline-flex items-center gap-2 text-xs font-semibold text-navy-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-surface-borderSubtle">
            <Award className="w-4 h-4 text-gold-600" />
            <span>
              {tBrand('leadScholar')} &bull; {tBrand('leadScholarTitle')}
            </span>
          </div>
        </div>

        {/* 4 Statistics Cards Grid (Directly Controlled via Admin CMS) */}
        {settings.heroStatsEnabled !== false && (
          <div className="mt-14 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
            <div className="academy-card p-5 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-2.5">
                <Users className="w-5 h-5 text-brand-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                {statStudents}
              </div>
              <div className="text-xs text-navy-500 font-medium mt-1">
                {tHero('statStudents')}
              </div>
            </div>

            <div className="academy-card p-5 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center mb-2.5">
                <Globe2 className="w-5 h-5 text-gold-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                {statCountries}
              </div>
              <div className="text-xs text-navy-500 font-medium mt-1">
                {tHero('statCountries')}
              </div>
            </div>

            <div className="academy-card p-5 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-quran-50 text-quran-700 flex items-center justify-center mb-2.5">
                <CheckCircle2 className="w-5 h-5 text-quran-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                {statMilestones}
              </div>
              <div className="text-xs text-navy-500 font-medium mt-1">
                {tHero('statCompletion')}
              </div>
            </div>

            <div className="academy-card p-5 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                {statRating}
              </div>
              <div className="text-xs text-navy-500 font-medium mt-1">
                {tHero('statRating')}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
