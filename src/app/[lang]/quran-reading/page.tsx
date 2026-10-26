import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { ScrollText, Play, CheckCircle2, Award, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTrackByHref } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

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

  const track = getTrackByHref('/quran-reading');
  const modules = track?.items && track.items.length > 0 ? track.items : [
    {
      id: 'quran-read-mod-1',
      title: 'Noorani Qaida Master Track',
      titleAr: 'دورة القاعدة النورانية الشاملة',
      desc: 'Phonetic drill system training your tongue and vocal cords to pronounce each letter in isolations and combinations.',
      descAr: 'منهجية صوتية دقيقة لتدريب اللسان على نطق الحروف مفردة ومركبة وضبط الحركات.',
      points: ['Single Letters & Sounds', 'Connecting Letters', 'Tanween & Sukoon', 'Rules of Madd'],
      pointsAr: ['الحروف المفردة والأصوات', 'الحروف المركبة', 'التنوين والسكون', 'حروف المد واللين'],
    },
    {
      id: 'quran-read-mod-2',
      title: 'Makhaarij & Sifaat Precision',
      titleAr: 'ضبط المخارج والصفات الصوتية',
      desc: 'Eliminating non-Arabic accents and mispronunciations through acoustic diagrams and scholar feedback.',
      descAr: 'التخلص من اللحن الجلي والخفي وضبط الترقيق والتفخيم والهمس والجهر.',
      points: ['Throat Letters (Halq)', 'Tongue Positions (Lisaan)', 'Lips (Shafatayn)', 'Nasal Cavity (Khayshoom)'],
      pointsAr: ['حروف الحلق', 'مخارج اللسان', 'مخارج الشفتين', 'الخيشوم والغنة'],
    },
    {
      id: 'quran-read-mod-3',
      title: 'Mus\'haf Guided Recitation',
      titleAr: 'التلاوة المباشرة من المصحف الشريف',
      desc: 'Transitioning to full continuous reading directly from the Uthmani script with stopping and starting rules (Waqf & Ibtida).',
      descAr: 'الانتقال للتلاوة المسترسلة من رسم المصحف العثماني مع تعلم أحكام الوقف والابتداء.',
      points: ['Juz Amma Practice', 'Stopping Signs (Waqf)', 'Fluent Transitioning', 'Oral Examination'],
      pointsAr: ['تطبيقات جزء عم', 'علامات الوقف في المصحف', 'التلاوة المسترسلة', 'الاختبار الشفهي'],
    },
  ];

  const pageTitle = track ? (isRtl ? track.titleAr : track.titleEn) : (isRtl ? 'قراءة القرآن الكريم وتصحيح التلاوة' : 'Quran Reading & Recitation Mastery');
  const pageSubtitle = track?.subtitleAr ? (isRtl ? track.subtitleAr : track.subtitleEn) : (isRtl
    ? 'تأسيس متين ينقلك من التهجئة المترددة إلى التلاوة الواثقة المتقنة مباشرة من المصحف.'
    : 'Move from hesitant spelling to fluent, beautiful recitation directly from the Mus\'haf.');

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-light">
            <ScrollText className="w-3.5 h-3.5" />
            <span>{track?.badgeAr ? (isRtl ? track.badgeAr : track.badgeEn) : (isRtl ? 'التلاوة الصحيحة بالسند' : 'Authentic Recitation')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((mod, idx) => {
            const stepsList = isRtl ? (mod.pointsAr || (mod as any).stepsAr) : (mod.points || (mod as any).steps);
            return (
              <div
                key={mod.id || idx}
                className="academy-card p-6 sm:p-7 flex flex-col justify-between hover:border-gold-300"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-navy-950">
                    {isRtl ? mod.titleAr : mod.title}
                  </h3>
                  <p className="text-xs text-navy-600 leading-relaxed">
                    {isRtl ? mod.descAr : mod.desc}
                  </p>

                  {Array.isArray(stepsList) && stepsList.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-surface-borderSubtle">
                      <span className="text-[11px] font-extrabold text-navy-500 uppercase tracking-wider block">
                        {isRtl ? 'المحاور والمهارات:' : 'Key Competencies:'}
                      </span>
                      <ul className="space-y-1.5 text-xs text-navy-700">
                        {stepsList.map((st: string, sIdx: number) => (
                          <li key={sIdx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-4 border-t border-surface-borderSubtle">
                  <Link
                    href="/courses"
                    className="btn-primary w-full text-xs text-center justify-center py-2.5"
                  >
                    <span>{isRtl ? 'التسجيل في هذا المستوى' : 'Join This Module'}</span>
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
