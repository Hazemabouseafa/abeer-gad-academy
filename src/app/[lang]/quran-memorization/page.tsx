import { setRequestLocale } from 'next-intl/server';
import { locales, Link } from '@/i18n/routing';
import { Bookmark, Calendar } from 'lucide-react';
import { getTrackByHref, getCourses } from '@/lib/data-store';
import { TrackUnitsGrid } from '@/components/tracks/TrackUnitsGrid';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface PageProps {
  params: { lang: string };
}

export default async function QuranMemorizationPage({ params: { lang } }: PageProps) {
  setRequestLocale(lang);
  const isRtl = lang === 'ar';

  const track = getTrackByHref('/quran-memorization');
  const courses = getCourses();
  const fallbackItems = [
    {
      id: 'hifz-pillar-1',
      title: 'The 3-Tier Retention System',
      titleAr: 'المنظومة الثلاثية لتثبيت الحفظ',
      desc: 'Mastering the daily triad: Al-Jadeed (New Memorization), Al-Sabqi (Recent Surahs), and Al-Manzil (Continuous Long-term Revision).',
      descAr: 'ضبط الثلاثية اليومية الأصيلة: المحفوظ الجديد، والماضي القريب (السبقي)، والورد اليومي الدائم (المنزل).',
      points: ['Daily New Ayahs (1-2 Pages)', 'Cumulative 7-Day Review', 'Monthly Complete Hatma Cycle'],
      pointsAr: ['المحفوظ الجديد اليومي (صفحة إلى صفحتين)', 'مراجعة أسبوعية تراكمية', 'ختمة مراجعة شهرية مستمرة'],
    },
    {
      id: 'hifz-pillar-2',
      title: 'Mutashabihat (Similar Verses) Mastery',
      titleAr: 'تثبيت الآيات المتشابهات وضبط الروابط',
      desc: 'Eliminating hesitation in similar Quranic verses across different Surahs using classical mnemonic and context analysis.',
      descAr: 'القضاء على التردد في المتشابهات اللفظية بين السور عبر التحليل السياقي وضوابط الحفظ المعتمدة.',
      points: ['Cross-Surah Comparison Tables', 'Contextual Linguistic Cues', 'Targeted Oral Examinations'],
      pointsAr: ['جداول المقارنة بين السور', 'الروابط المعنوية والسياقية', 'اختبارات تسميع شفهية دقيقة'],
    },
    {
      id: 'hifz-pillar-3',
      title: 'Preparation for Ijazah with Continuous Sanad',
      titleAr: 'التأهيل للإجازة بالسند المتصل إلى رسول الله ﷺ',
      desc: 'Graduating to full recitation from memory in front of Ustadha Abeer Gad according to the recitations of Hafs and Shu\'bah.',
      descAr: 'التسميع الكامل للقرآن الكريم غيباً على الأستاذة عبير جاد ونيل الإجازة بروايتي حفص وشعبة عن عاصم.',
      points: ['Full Mus\'haf Recitation from Memory', 'Rigorous Tajweed Verification', 'Verified Written Sanad Document'],
      pointsAr: ['ختم القرآن الكريم كاملاً عن ظهر قلب', 'التدقيق الصارم في الأحكام', 'شهادة الإجازة بالسند المتصل'],
    },
  ];

  const pageTitle = track ? (isRtl ? track.titleAr : track.titleEn) : (isRtl ? 'حفظ القرآن الكريم وتثبيت المتشابهات' : 'Holy Quran Memorization (Hifz)');
  const pageSubtitle = track?.subtitleAr ? (isRtl ? track.subtitleAr : track.subtitleEn) : (isRtl
    ? 'نظام حفظ منهجي يجمع بين الطرق النبوية الأصيلة ومنظومات التكرار المعرفي بإشراف الأستاذة عبير جاد.'
    : 'A systematic Hifz methodology combining classical prophetic memorization traditions with modern cognitive retention systems.');

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-gold">
            <Bookmark className="w-3.5 h-3.5" />
            <span>{track?.badgeAr ? (isRtl ? track.badgeAr : track.badgeEn) : (isRtl ? 'منظومة الحفظ المتقن' : 'Hifz Precision System')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        <TrackUnitsGrid
          track={track}
          fallbackItems={fallbackItems}
          trackSlug="quran-memorization"
          lang={lang}
          courses={courses}
        />

        {/* Bottom CTA Box */}
        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-900 text-white text-center sm:text-start flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card-hover">
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-white">
              {isRtl ? 'جاهز لبدء رحلة الحفظ مع الأستاذة عبير جاد؟' : 'Ready to Start Your Hifz Journey?'}
            </h3>
            <p className="text-xs sm:text-sm text-brand-100 max-w-lg">
              {isRtl
                ? 'احجز جلسة تسميع وتقييم فردية لتحديد الخطة المناسبة لقدراتك ووقتك.'
                : 'Book a one-on-one consultation to establish a personalized Hifz schedule suited to your routine.'}
            </p>
          </div>

          <Link
            href="/private-lessons"
            className="shrink-0 px-6 py-3 rounded-xl bg-white text-brand-900 font-bold text-sm hover:bg-gold-50 shadow-sm transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-brand-700" />
            <span>{isRtl ? 'احجز موعد تقييم' : 'Book Hifz Assessment'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
