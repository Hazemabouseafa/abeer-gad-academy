import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { BookOpen, CheckCircle2, ArrowRight, ArrowLeft, Star, Sparkles, GraduationCap } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTrackByHref } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface PageProps {
  params: { lang: string };
}

export default async function LearnArabicPage({ params: { lang } }: PageProps) {
  setRequestLocale(lang);
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const track = getTrackByHref('/learn-arabic');
  const pathways = track?.items && track.items.length > 0 ? track.items : [
    {
      id: 'arabic-stage-1',
      level: 'Stage 1',
      levelAr: 'المرحلة الأولى',
      title: 'Alphabet & Phonetic Foundations',
      titleAr: 'تأسيس الحروف والأصوات العربية',
      desc: 'Master the 28 Arabic letters, articulation points, letter connections, and initial reading.',
      descAr: 'إتقان الحروف الثمانية والعشرين ومخارجها وأشكال كتابتها والتهجئة الصحيحة.',
      lessonsCount: 12,
      duration: '4 Weeks',
      durationAr: '4 أسابيع',
      pointsAr: ['إتقان الحروف الثمانية والعشرين', 'المخارج الصوتية الدقيقة', 'أشكال اتصال الحروف في الكلمات'],
      points: ['28 Alphabet Letters', 'Accurate Articulation', 'Connecting Letters & Script'],
    },
    {
      id: 'arabic-stage-2',
      level: 'Stage 2',
      levelAr: 'المرحلة الثانية',
      title: 'Basic Morphology & Vocabulary',
      titleAr: 'مبادئ الصرف وبناء المفردات',
      desc: 'Learn root systems, verb conjugations in past/present/imperative, and everyday conversation.',
      descAr: 'دراسة نظام الجذور وتصريف الأفعال في الماضي والمضارع والأمر ومحادثات الحياة اليومية.',
      lessonsCount: 18,
      duration: '6 Weeks',
      durationAr: '6 أسابيع',
      pointsAr: ['نظام الميزان الصرفي والجذور', 'تصريف الأفعال الثلاثية', 'بناء المعجم والمفردات'],
      points: ['Root & Pattern System', 'Past & Present Verbs', 'Core Vocabulary Expansion'],
    },
    {
      id: 'arabic-stage-3',
      level: 'Stage 3',
      levelAr: 'المرحلة الثالثة',
      title: 'Classical Syntax (Nahw) & Parsing',
      titleAr: 'قواعد النحو العربي والإعراب التطبيقي',
      desc: 'Deep study of sentence types, I\'rab, particles, and reading classical Arabic literature.',
      descAr: 'دراسة معمقة للجمل وأصول الإعراب والحروف وتحليل نصوص الأدب العربي الفصيح.',
      lessonsCount: 24,
      duration: '8 Weeks',
      durationAr: '8 أسابيع',
      pointsAr: ['الجملة الاسمية والفعلية', 'أصول الإعراب والعلامات', 'تحليل نصوص الأدب الفصيح'],
      points: ['Nominal & Verbal Sentences', 'Applied I\'rab Parsing', 'Literature Text Analysis'],
    },
    {
      id: 'arabic-stage-4',
      level: 'Stage 4',
      levelAr: 'المرحلة الرابعة',
      title: 'Balaghah & Advanced Eloquence',
      titleAr: 'البلاغة العربية والفصاحة العالية',
      desc: 'Metaphor, eloquence, Quranic stylistic miracles, and advanced academic discourse.',
      descAr: 'علم البيان والبديع والمعاني وبلاغة النظم القرآني والأساليب البيانية الرفيعة.',
      lessonsCount: 16,
      duration: '6 Weeks',
      durationAr: '6 أسابيع',
      pointsAr: ['علم البيان: التشبيه والاستعارة', 'علم المعاني وأسرار التراكيب', 'إعجاز النظم القرآني'],
      points: ['Bayan: Metaphor & Simile', 'Ma\'ani: Rhetorical Context', 'Quranic Stylistic Miracles'],
    },
  ];

  const pageTitle = track ? (isRtl ? track.titleAr : track.titleEn) : (isRtl ? 'مسارات تعلم اللغة العربية' : 'Learn Arabic Language Pathways');
  const pageSubtitle = track?.subtitleAr ? (isRtl ? track.subtitleAr : track.subtitleEn) : (isRtl
    ? 'تدرج علمي مدروس ينقلك من الأحرف الهجائية وحتى أعلى درجات البلاغة العربية والفصاحة.'
    : 'Structured pedagogical tracks guiding you from foundational phonetics to classical eloquence.');

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-light">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{track?.badgeAr ? (isRtl ? track.badgeAr : track.badgeEn) : (isRtl ? 'المسار الأكاديمي الشامل' : 'Comprehensive Curriculum')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        {/* Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {pathways.map((item, idx) => {
            const pointsList = isRtl ? item.pointsAr : item.points;
            const lessons = item.lessonsCount || (item as any).lessons || 12;

            return (
              <div
                key={item.id || idx}
                className="academy-card p-6 sm:p-8 flex flex-col justify-between hover:border-brand-400 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="badge-gold text-xs">
                      {isRtl ? item.levelAr : item.level}
                    </span>
                    <span className="text-xs text-navy-500 font-semibold font-mono">
                      {isRtl ? item.durationAr : item.duration} &bull; {lessons} {isRtl ? 'درساً' : 'Lessons'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand-800 transition-colors">
                    {isRtl ? item.titleAr : item.title}
                  </h3>
                  <p className="text-sm text-navy-600 leading-relaxed">
                    {isRtl ? item.descAr : item.desc}
                  </p>

                  {/* Highlights / Learning Points */}
                  {Array.isArray(pointsList) && pointsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {pointsList.map((pt, pIdx) => (
                        <span key={pIdx} className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-muted border border-surface-borderSubtle text-navy-700 font-medium">
                          ✓ {pt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-4 border-t border-surface-borderSubtle flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-700">
                    {isRtl ? 'يشمل تمارين واختبارات دورية' : 'Interactive Quizzes Included'}
                  </span>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-brand-800 transition-colors"
                  >
                    <span>{isRtl ? 'التفاصيل والتسجيل' : 'Enroll in Track'}</span>
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
