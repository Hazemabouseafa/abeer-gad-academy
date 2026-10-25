import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { BookOpen, CheckCircle2, ArrowRight, ArrowLeft, Star, Sparkles, GraduationCap } from 'lucide-react';
import { Link } from '@/i18n/routing';

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

  const pathways = [
    {
      level: 'Stage 1',
      levelAr: 'المرحلة الأولى',
      title: 'Alphabet & Phonetic Foundations',
      titleAr: 'تأسيس الحروف والأصوات العربية',
      desc: 'Master the 28 Arabic letters, articulation points, letter connections, and initial reading.',
      descAr: 'إتقان الحروف الثمانية والعشرين ومخارجها وأشكال كتابتها والتهجئة الصحيحة.',
      lessons: 12,
      duration: '4 Weeks',
      durationAr: '4 أسابيع',
    },
    {
      level: 'Stage 2',
      levelAr: 'المرحلة الثانية',
      title: 'Basic Morphology & Vocabulary',
      titleAr: 'مبادئ الصرف وبناء المفردات',
      desc: 'Learn root systems, verb conjugations in past/present/imperative, and everyday conversation.',
      descAr: 'دراسة نظام الجذور وتصريف الأفعال في الماضي والمضارع والأمر ومحادثات الحياة اليومية.',
      lessons: 18,
      duration: '6 Weeks',
      durationAr: '6 أسابيع',
    },
    {
      level: 'Stage 3',
      levelAr: 'المرحلة الثالثة',
      title: 'Classical Syntax (Nahw) & Parsing',
      titleAr: 'قواعد النحو العربي والإعراب التطبيقي',
      desc: 'Deep study of sentence types, I\'rab, particles, and reading classical Arabic literature.',
      descAr: 'دراسة معمقة للجمل وأصول الإعراب والحروف وتحليل نصوص الأدب العربي الفصيح.',
      lessons: 24,
      duration: '8 Weeks',
      durationAr: '8 أسابيع',
    },
    {
      level: 'Stage 4',
      levelAr: 'المرحلة الرابعة',
      title: 'Balaghah & Advanced Eloquence',
      titleAr: 'البلاغة العربية والفصاحة العالية',
      desc: 'Metaphor, eloquence, Quranic stylistic miracles, and advanced academic discourse.',
      descAr: 'علم البيان والبديع والمعاني وبلاغة النظم القرآني والأساليب البيانية الرفيعة.',
      lessons: 16,
      duration: '6 Weeks',
      durationAr: '6 أسابيع',
    },
  ];

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-light">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المسار الأكاديمي الشامل' : 'Comprehensive Curriculum'}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {isRtl ? 'مسارات تعلم اللغة العربية' : 'Learn Arabic Language Pathways'}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {isRtl
              ? 'تدرج علمي مدروس ينقلك من الأحرف الهجائية وحتى أعلى درجات البلاغة العربية والفصاحة.'
              : 'Structured pedagogical tracks guiding you from foundational phonetics to classical eloquence.'}
          </p>
        </div>

        {/* Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {pathways.map((item, idx) => (
            <div
              key={idx}
              className="academy-card p-6 sm:p-8 flex flex-col justify-between hover:border-brand-400 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="badge-gold text-xs">
                    {isRtl ? item.levelAr : item.level}
                  </span>
                  <span className="text-xs text-navy-500 font-semibold">
                    {isRtl ? item.durationAr : item.duration} &bull; {item.lessons} {isRtl ? 'درساً' : 'Lessons'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand-800 transition-colors">
                  {isRtl ? item.titleAr : item.title}
                </h3>
                <p className="text-sm text-navy-600 leading-relaxed">
                  {isRtl ? item.descAr : item.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-surface-borderSubtle flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-700">
                  {isRtl ? 'يشمل تمارين واختبارات دورية' : 'Interactive Quizzes Included'}
                </span>
                <Link
                  href="/courses/foundational-arabic-alphabet-grammar"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-brand-800 transition-colors"
                >
                  <span>{isRtl ? 'التفاصيل والتسجيل' : 'Enroll in Track'}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
