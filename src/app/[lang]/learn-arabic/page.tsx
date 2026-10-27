import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { BookOpen } from 'lucide-react';
import { getTrackByHref, getCourses } from '@/lib/data-store';
import { TrackUnitsGrid } from '@/components/tracks/TrackUnitsGrid';

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

  const track = getTrackByHref('/learn-arabic');
  const courses = getCourses();
  const fallbackItems = [
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

        <TrackUnitsGrid
          track={track}
          fallbackItems={fallbackItems}
          trackSlug="learn-arabic"
          lang={lang}
          courses={courses}
        />
      </div>
    </div>
  );
}
