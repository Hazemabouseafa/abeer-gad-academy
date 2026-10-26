'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import {
  BookOpen,
  Award,
  ShieldCheck,
  HeartHandshake,
  Mail,
  Phone,
  MessageCircle,
  GraduationCap,
  Sparkles,
  Send,
  Video,
} from 'lucide-react';
import type { SiteSettingsData } from '@/lib/data-store';

interface FooterProps {
  currentLocale: string;
}

export function Footer({ currentLocale }: FooterProps) {
  const tFooter = useTranslations('footer');
  const tBrand = useTranslations('brand');
  const tNav = useTranslations('nav');
  const pathname = usePathname();
  const isRtl = currentLocale === 'ar';

  const [settings, setSettings] = useState<Partial<SiteSettingsData>>({});

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
      })
      .catch(() => {});
  }, []);

  // Hide Footer completely on Admin pages
  if (pathname && (pathname.includes('/admin') || pathname.endsWith('/admin'))) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const contactEmail = settings.contactEmail || 'contact@abeergadacademy.com';
  const contactPhone = settings.contactPhone || '+20 100 000 0000';
  const whatsappNum = settings.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '201000000000';
  const aboutText = isRtl
    ? (settings.footerAboutAr || tFooter('about'))
    : (settings.footerAboutEn || tFooter('about'));

  return (
    <footer className="bg-[#FAF7F0] border-t border-surface-border text-navy-800 transition-colors">
      {/* Top Banner / Accreditation Ribbon */}
      <div className="border-b border-surface-borderSubtle bg-white/70 py-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-start">
          <div className="flex items-center justify-center md:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
              <Award className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-900">
                {currentLocale === 'ar' ? 'سند متصل معتمد' : 'Verified Continuous Sanad'}
              </h4>
              <p className="text-xs text-navy-600">
                {currentLocale === 'ar' ? 'إجازة في القراءات العشر وتصحيح مخارج الحروف' : 'Certified Ijazah in Quranic recitations'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center border border-gold-200">
              <GraduationCap className="w-5 h-5 text-gold-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-900">
                {currentLocale === 'ar' ? 'إشراف الأستاذة عبير جاد' : 'Guided by Ustadha Abeer Gad'}
              </h4>
              <p className="text-xs text-navy-600">
                {currentLocale === 'ar' ? 'خبرة عريقة في التدريس لغير الناطقين بالعربية' : 'Expert pedagogical instruction for global students'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-quran-50 text-quran-700 flex items-center justify-center border border-quran-100">
              <ShieldCheck className="w-5 h-5 text-quran-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-900">
                {currentLocale === 'ar' ? 'دفع آمن وضمان التميز' : 'Secure PayPal Checkout'}
              </h4>
              <p className="text-xs text-navy-600">
                {currentLocale === 'ar' ? 'معاملات بنكية مشفرة وتأكيد فوري للحجوزات' : '256-bit encrypted transactions & instant booking'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Biography */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-icon.png"
                  alt="Abeer Gad Academy"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex flex-col text-start">
                <span className="font-extrabold text-lg tracking-tight text-navy-900 leading-tight">
                  {currentLocale === 'ar' ? tBrand('nameNative') : tBrand('name')}
                </span>
                <span className="text-[11px] text-brand-700 font-semibold">
                  {currentLocale === 'ar' ? 'أكاديمية تعليم العربية والقرآن الكريم' : 'Learn Arabic, Read & Memorize Quran'}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
              {aboutText}
            </p>
            <div className="pt-1">
              <span className="badge-gold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-gold-700" />
                {tBrand('leadScholar')}
              </span>
            </div>
          </div>

          {/* Col 2: Core Programs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
              {tFooter('programs')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/learn-arabic"
                  className="text-navy-600 hover:text-brand-700 hover:underline transition-colors"
                >
                  {tNav('learnArabic')}
                </Link>
              </li>
              <li>
                <Link
                  href="/quran-reading"
                  className="text-navy-600 hover:text-brand-700 hover:underline transition-colors"
                >
                  {tNav('quranReading')}
                </Link>
              </li>
              <li>
                <Link
                  href="/quran-memorization"
                  className="text-navy-600 hover:text-brand-700 hover:underline transition-colors"
                >
                  {tNav('quranMemorization')}
                </Link>
              </li>
              <li>
                <Link
                  href="/tajweed"
                  className="text-navy-600 hover:text-brand-700 hover:underline transition-colors"
                >
                  {tNav('tajweed')}
                </Link>
              </li>
              <li>
                <Link
                  href="/specialized-arabic"
                  className="text-navy-600 hover:text-brand-700 hover:underline transition-colors"
                >
                  {tNav('specializedArabic')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Hub & Resources */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
              {tFooter('quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/courses"
                  className="text-navy-600 hover:text-brand-700 hover:underline transition-colors"
                >
                  {tNav('courses')}
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-navy-600 hover:text-brand-700 hover:underline transition-colors"
                >
                  {tNav('resources')}
                </Link>
              </li>
              <li>
                <Link
                  href="/private-lessons"
                  className="text-navy-600 hover:text-brand-700 hover:underline transition-colors"
                >
                  {tNav('privateLessons')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Consultation & Inquiries */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
              {tFooter('contact')}
            </h3>
            <p className="text-xs sm:text-sm text-navy-600">
              {currentLocale === 'ar'
                ? 'تواصل معنا لحجز الاستشارات الخاصة بالبرامج أو تقييم مستوى الحفظ.'
                : 'Direct inquiries for personalized recitation evaluation and custom study curricula.'}
            </p>
            <div className="space-y-2">
              <a
                href={`mailto:${contactEmail}`}
                className="p-3 bg-white hover:bg-surface-muted rounded-xl border border-surface-border shadow-card-subtle flex items-center gap-3 transition-colors text-xs font-semibold text-navy-800"
              >
                <Mail className="w-4 h-4 text-brand-700 shrink-0" />
                <span className="truncate">{contactEmail}</span>
              </a>

              {contactPhone && (
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                  className="p-3 bg-white hover:bg-surface-muted rounded-xl border border-surface-border shadow-card-subtle flex items-center gap-3 transition-colors text-xs font-semibold text-navy-800 font-mono"
                >
                  <Phone className="w-4 h-4 text-brand-700 shrink-0" />
                  <span>{contactPhone}</span>
                </a>
              )}

              {/* Social Channels */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isRtl ? 'واتساب' : 'WhatsApp'}</span>
                </a>

                {settings.telegramLink && (
                  <a
                    href={settings.telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Telegram"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-600" />
                    <span>{isRtl ? 'تيليجرام' : 'Telegram'}</span>
                  </a>
                )}

                {settings.youtubeLink && (
                  <a
                    href={settings.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="YouTube"
                  >
                    <Video className="w-3.5 h-3.5 text-red-600" />
                    <span>{isRtl ? 'يوتيوب' : 'YouTube'}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-surface-borderSubtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy-500">
          <p>{tFooter('rights')} &copy; {currentYear}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-navy-600">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
              <span>PayPal REST Verified</span>
            </span>
            <span>&bull;</span>
            <span>English &bull; العربية &bull; Français &bull; Deutsch &bull; 中文</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
