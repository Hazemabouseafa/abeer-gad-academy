'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  BookOpen,
  ScrollText,
  Bookmark,
  GraduationCap,
  Briefcase,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
} from 'lucide-react';

interface AcademyPillarsProps {
  currentLocale: string;
}

export function AcademyPillars({ currentLocale }: AcademyPillarsProps) {
  const tPillars = useTranslations('pillars');
  const isRtl = currentLocale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const pillarsData = [
    {
      id: 'arabic',
      href: '/learn-arabic',
      title: tPillars('arabic.title'),
      desc: tPillars('arabic.desc'),
      tag: tPillars('arabic.tag'),
      icon: BookOpen,
      iconColor: 'text-brand-700',
      bgColor: 'bg-brand-50',
      borderColor: 'border-brand-200',
      features: ['Foundational Alphabet', 'Syntax & Sarf', 'Conversational Fluency'],
      featuresAr: ['تأسيس الحروف والأصوات', 'قواعد النحو والصرف', 'المحادثة والفصاحة'],
    },
    {
      id: 'reading',
      href: '/quran-reading',
      title: tPillars('reading.title'),
      desc: tPillars('reading.desc'),
      tag: tPillars('reading.tag'),
      icon: ScrollText,
      iconColor: 'text-gold-700',
      bgColor: 'bg-gold-50',
      borderColor: 'border-gold-200',
      features: ['Noorani Qaida', 'Letter Articulation', 'Mus\'haf Recitation'],
      featuresAr: ['القاعدة النورانية', 'تصحيح المخارج', 'القراءة المباشرة من المصحف'],
    },
    {
      id: 'memorization',
      href: '/quran-memorization',
      title: tPillars('memorization.title'),
      desc: tPillars('memorization.desc'),
      tag: tPillars('memorization.tag'),
      icon: Bookmark,
      iconColor: 'text-quran-700',
      bgColor: 'bg-quran-50',
      borderColor: 'border-quran-200',
      features: ['Individualized Hifz Plan', 'Spaced Revisions', 'Sanad Verification'],
      featuresAr: ['خطة حفظ فردية', 'مراجعة دورية متباعدة', 'اختبارات إتقان معتمدة'],
    },
    {
      id: 'tajweed',
      href: '/tajweed',
      title: tPillars('tajweed.title'),
      desc: tPillars('tajweed.desc'),
      tag: tPillars('tajweed.tag'),
      icon: GraduationCap,
      iconColor: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      features: ['Ahkam An-Noon & Meem', 'Madd Rules', 'Audio Practice Files'],
      featuresAr: ['أحكام النون والميم', 'أحكام المدود', 'نماذج صوتية مسجلة'],
    },
    {
      id: 'specialized',
      href: '/specialized-arabic',
      title: tPillars('specialized.title'),
      desc: tPillars('specialized.desc'),
      tag: tPillars('specialized.tag'),
      icon: Briefcase,
      iconColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      features: ['Islamic Jurisprudence', 'Diplomatic Arabic', 'Academic Research'],
      featuresAr: ['لغة العلوم الشرعية', 'العربية الدبلوماسية', 'البحث الأكاديمي'],
    },
    {
      id: 'lessons',
      href: '/private-lessons',
      title: tPillars('lessons.title'),
      desc: tPillars('lessons.desc'),
      tag: tPillars('lessons.tag'),
      icon: Calendar,
      iconColor: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      features: ['Direct with Ustadha Abeer', '45-Min Dedicated Session', 'Personalized Pacing'],
      featuresAr: ['مع الأستاذة عبير جاد', 'جلسة مخصصة 45 دقيقة', 'جدول مرن يناسبك'],
    },
  ];

  return (
    <section id="pillars" className="py-16 sm:py-20 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <span className="badge-light">
            <Sparkles className="w-3.5 h-3.5" />
            {tPillars('badge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            {tPillars('title')}
          </h2>
          <p className="text-sm sm:text-base text-navy-600">
            {tPillars('subtitle')}
          </p>
        </div>

        {/* 6 Pillars Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillarsData.map((item) => {
            const Icon = item.icon;
            const featuresList = isRtl ? item.featuresAr : item.features;

            return (
              <div
                key={item.id}
                className="academy-card p-6 sm:p-7 flex flex-col justify-between group hover:border-brand-300"
              >
                <div className="space-y-4">
                  {/* Top Bar with Icon & Tag */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl ${item.bgColor} ${item.borderColor} border flex items-center justify-center transition-transform group-hover:scale-105 duration-200`}
                    >
                      <Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-background-warm text-navy-700 border border-surface-borderSubtle">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-navy-900 group-hover:text-brand-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-navy-600 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Highlights checklist */}
                  <ul className="space-y-2 pt-2 border-t border-surface-borderSubtle">
                    {featuresList.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs font-medium text-navy-700"
                      >
                        <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-6 mt-4">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-900 transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <span>
                      {isRtl ? 'استكشف المسار الكامل' : 'Explore Learning Path'}
                    </span>
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
