import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { Bookmark, Sparkles, Award, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Calendar } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface PageProps {
  params: { lang: string };
}

export default async function QuranMemorizationPage({ params: { lang } }: PageProps) {
  setRequestLocale(lang);
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const hifzPillars = [
    {
      title: 'The 3-Tier Retention System',
      titleAr: 'المنظومة الثلاثية لتثبيت الحفظ',
      desc: 'Mastering the daily triad: Al-Jadeed (New Memorization), Al-Sabqi (Recent Surahs), and Al-Manzil (Continuous Long-term Revision).',
      descAr: 'ضبط الثلاثية اليومية الأصيلة: المحفوظ الجديد، والماضي القريب (السبقي)، والورد اليومي الدائم (المنزل).',
      points: ['Daily New Ayahs (1-2 Pages)', 'Cumulative 7-Day Review', 'Monthly Complete Hatma Cycle'],
      pointsAr: ['المحفوظ الجديد اليومي (صفحة إلى صفحتين)', 'مراجعة أسبوعية تراكمية', 'ختمة مراجعة شهرية مستمرة'],
    },
    {
      title: 'Mutashabihat (Similar Verses) Mastery',
      titleAr: 'تثبيت الآيات المتشابهات وضبط الروابط',
      desc: 'Eliminating hesitation in similar Quranic verses across different Surahs using classical mnemonic and context analysis.',
      descAr: 'القضاء على التردد في المتشابهات اللفظية بين السور عبر التحليل السياقي وضوابط الحفظ المعتمدة.',
      points: ['Cross-Surah Comparison Tables', 'Contextual Linguistic Cues', 'Targeted Oral Examinations'],
      pointsAr: ['جداول المقارنة بين السور', 'الروابط المعنوية والسياقية', 'اختبارات تسميع شفهية دقيقة'],
    },
    {
      title: 'Preparation for Ijazah with Continuous Sanad',
      titleAr: 'التأهيل للإجازة بالسند المتصل إلى رسول الله ﷺ',
      desc: 'Graduating to full recitation from memory in front of Ustadha Abeer Gad according to the recitations of Hafs and Shu\'bah.',
      descAr: 'التسميع الكامل للقرآن الكريم غيباً على الأستاذة عبير جاد ونيل الإجازة بروايتي حفص وشعبة عن عاصم.',
      points: ['Full Mus\'haf Recitation from Memory', 'Rigorous Tajweed Verification', 'Verified Written Sanad Document'],
      pointsAr: ['ختم القرآن الكريم كاملاً عن ظهر قلب', 'التدقيق الصارم في الأحكام', 'شهادة الإجازة بالسند المتصل'],
    },
  ];

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-gold">
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isRtl ? 'منظومة الحفظ المتقن' : 'Hifz Precision System'}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {isRtl ? 'حفظ القرآن الكريم وتثبيت المتشابهات' : 'Holy Quran Memorization (Hifz)'}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {isRtl
              ? 'نظام حفظ منهجي يجمع بين الطرق النبوية الأصيلة ومنظومات التكرار المعرفي بإشراف الأستاذة عبير جاد.'
              : 'A systematic Hifz methodology combining classical prophetic memorization traditions with modern cognitive retention systems.'}
          </p>
        </div>

        {/* Hifz Methodology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12">
          {hifzPillars.map((item, idx) => {
            const pointsList = isRtl ? item.pointsAr : item.points;
            return (
              <div
                key={idx}
                className="academy-card p-6 sm:p-7 flex flex-col justify-between hover:border-gold-300 group"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center border border-gold-200">
                    <Bookmark className="w-5 h-5 text-gold-700" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-800 transition-colors">
                    {isRtl ? item.titleAr : item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
                    {isRtl ? item.descAr : item.desc}
                  </p>

                  <div className="pt-3 border-t border-surface-borderSubtle space-y-2">
                    {pointsList.map((pt, pIdx) => (
                      <div
                        key={pIdx}
                        className="flex items-center gap-2 text-xs text-navy-700 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-surface-borderSubtle">
                  <Link
                    href="/courses/quran-memorization-hifz-methodology"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900"
                  >
                    <span>{isRtl ? 'عرض منهج الدورة' : 'View Course Curriculum'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

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
