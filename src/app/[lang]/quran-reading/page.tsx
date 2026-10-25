import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { ScrollText, Play, CheckCircle2, Award, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface PageProps {
  params: { lang: string };
}

export default async function QuranReadingPage({ params: { lang } }: PageProps) {
  setRequestLocale(lang);
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const modules = [
    {
      title: 'Noorani Qaida Master Track',
      titleAr: 'دورة القاعدة النورانية الشاملة',
      desc: 'Phonetic drill system training your tongue and vocal cords to pronounce each letter in isolations and combinations.',
      descAr: 'منهجية صوتية دقيقة لتدريب اللسان على نطق الحروف مفردة ومركبة وضبط الحركات.',
      steps: ['Single Letters & Sounds', 'Connecting Letters', 'Tanween & Sukoon', 'Rules of Madd'],
      stepsAr: ['الحروف المفردة والأصوات', 'الحروف المركبة', 'التنوين والسكون', 'حروف المد واللين'],
    },
    {
      title: 'Makhaarij & Sifaat Precision',
      titleAr: 'ضبط المخارج والصفات الصوتية',
      desc: 'Eliminating non-Arabic accents and mispronunciations through acoustic diagrams and scholar feedback.',
      descAr: 'التخلص من اللحن الجلي والخفي وضبط الترقيق والتفخيم والهمس والجهر.',
      steps: ['Throat Letters (Halq)', 'Tongue Positions (Lisaan)', 'Lips (Shafatayn)', 'Nasal Cavity (Khayshoom)'],
      stepsAr: ['حروف الحلق', 'مخارج اللسان', 'مخارج الشفتين', 'الخيشوم والغنة'],
    },
    {
      title: 'Mus\'haf Guided Recitation',
      titleAr: 'التلاوة المباشرة من المصحف الشريف',
      desc: 'Transitioning to full continuous reading directly from the Uthmani script with stopping and starting rules (Waqf & Ibtida).',
      descAr: 'الانتقال للتلاوة المسترسلة من رسم المصحف العثماني مع تعلم أحكام الوقف والابتداء.',
      steps: ['Juz Amma Practice', 'Stopping Signs (Waqf)', 'Fluent Transitioning', 'Oral Examination'],
      stepsAr: ['تطبيقات جزء عم', 'علامات الوقف في المصحف', 'التلاوة المسترسلة', 'الاختبار الشفهي'],
    },
  ];

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-light">
            <ScrollText className="w-3.5 h-3.5" />
            <span>{isRtl ? 'التلاوة الصحيحة بالسند' : 'Authentic Recitation'}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {isRtl ? 'قراءة القرآن الكريم وتصحيح التلاوة' : 'Quran Reading & Recitation Mastery'}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {isRtl
              ? 'تأسيس متين ينقلك من التهجئة المترددة إلى التلاوة الواثقة المتقنة مباشرة من المصحف.'
              : 'Move from hesitant spelling to fluent, beautiful recitation directly from the Mus\'haf.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((mod, idx) => {
            const stepsList = isRtl ? mod.stepsAr : mod.steps;
            return (
              <div
                key={idx}
                className="academy-card p-6 sm:p-7 flex flex-col justify-between hover:border-gold-300"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center border border-gold-200">
                    <ScrollText className="w-5 h-5 text-gold-700" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900">
                    {isRtl ? mod.titleAr : mod.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
                    {isRtl ? mod.descAr : mod.desc}
                  </p>

                  <div className="pt-3 border-t border-surface-borderSubtle space-y-2">
                    <span className="text-[11px] font-bold text-navy-500 uppercase tracking-wider block">
                      {isRtl ? 'محاور التدريب' : 'Curriculum Milestones'}
                    </span>
                    {stepsList.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center gap-2 text-xs text-navy-700 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4">
                  <Link
                    href="/private-lessons"
                    className="w-full py-2.5 px-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>{isRtl ? 'حجز جلسة تقييم تلاوة' : 'Book Recitation Evaluation'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
