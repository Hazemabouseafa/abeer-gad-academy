import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import {
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Play,
  Lock,
  Download,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { PayPalCheckoutButton } from '@/components/checkout/PayPalCheckoutButton';
import { formatCurrency } from '@/lib/utils';
import { getCourses, getCourseBySlug, CourseData } from '@/lib/data-store';

export function generateStaticParams() {
  const allCourses = getCourses();
  const slugs = allCourses.map((c) => c.slug);
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

interface CourseSlugPageProps {
  params: {
    lang: string;
    slug: string;
  };
}

export default async function CourseSlugPage({
  params: { lang, slug },
}: CourseSlugPageProps) {
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: 'courses' });
  const tBrand = await getTranslations({ locale: lang, namespace: 'brand' });
  const isRtl = lang === 'ar';

  const course = getCourseBySlug(slug);
  if (!course) {
    notFound();
  }

  const title = isRtl && course.titleAr ? course.titleAr : course.title;
  const subtitle = isRtl && course.subtitleAr ? course.subtitleAr : course.subtitle;
  const description = isRtl && course.descriptionAr ? course.descriptionAr : course.description;
  const category = isRtl && course.categoryAr ? course.categoryAr : course.category;
  const totalLessons = course.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 12;

  // Video embed URL format
  let videoEmbedUrl = course.promoVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  if (videoEmbedUrl.includes('watch?v=')) {
    videoEmbedUrl = videoEmbedUrl.replace('watch?v=', 'embed/');
  }

  return (
    <div className="py-10 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Course Header Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge-light text-xs">{category}</span>
              <span className="text-xs font-semibold text-navy-600 bg-background-warm px-3 py-1 rounded-full border border-surface-borderSubtle">
                {isRtl && course.levelAr ? course.levelAr : course.level}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>5.0 (Verified Reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-navy-600 leading-relaxed font-normal">
              {subtitle}
            </p>

            {/* Video Player Box */}
            <div className="academy-card overflow-hidden">
              <div className="aspect-video w-full bg-navy-950 relative flex items-center justify-center">
                <iframe
                  src={videoEmbedUrl}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
              <div className="p-4 bg-white flex items-center justify-between text-xs text-navy-600">
                <span className="font-semibold text-brand-800">
                  {isRtl ? 'المعاينة المباشرة للمنهج • دقة استوديو' : 'Interactive Curriculum Stream • HD Studio Master'}
                </span>
                <span className="badge-light text-[11px]">{course.instructorName || 'Ustadha Abeer Gad'}</span>
              </div>
            </div>

            {/* Description Tab */}
            <div className="academy-card p-6 sm:p-8 bg-white space-y-4">
              <h2 className="text-xl font-bold text-navy-950">
                {isRtl ? 'عن هذا البرنامج التعليمي' : 'About This Academic Program'}
              </h2>
              <p className="text-sm sm:text-base text-navy-700 leading-relaxed font-normal">
                {description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-surface-borderSubtle">
                <div>
                  <span className="text-[11px] text-navy-400 uppercase font-semibold block">
                    {isRtl ? 'المدة الإجمالية' : 'Duration'}
                  </span>
                  <span className="text-sm font-bold text-navy-900 mt-0.5 block">
                    {course.durationHours} {isRtl ? 'ساعة' : 'Hours'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-navy-400 uppercase font-semibold block">
                    {isRtl ? 'عدد الدروس' : 'Lessons'}
                  </span>
                  <span className="text-sm font-bold text-navy-900 mt-0.5 block">
                    {totalLessons} {isRtl ? 'درساً' : 'Lessons'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-navy-400 uppercase font-semibold block">
                    {isRtl ? 'الشهادة' : 'Credential'}
                  </span>
                  <span className="text-sm font-bold text-navy-900 mt-0.5 block">
                    {isRtl ? 'إجازة وسند' : 'Ijazah Certificate'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-navy-400 uppercase font-semibold block">
                    {isRtl ? 'الإشراف' : 'Instruction'}
                  </span>
                  <span className="text-sm font-bold text-navy-900 mt-0.5 block">
                    {course.instructorName || 'Ustadha Abeer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Curriculum Modules Accordion View */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy-950">
                {isRtl ? 'المنهج الدراسي والوحدات' : 'Curriculum Structure & Modules'}
              </h2>

              <div className="space-y-3">
                {course.chapters && course.chapters.map((chapter, idx) => (
                  <div
                    key={chapter.id || idx}
                    className="academy-card overflow-hidden bg-white border border-surface-border"
                  >
                    <div className="p-4 bg-surface-muted/60 flex items-center justify-between border-b border-surface-borderSubtle">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-navy-900">
                          {isRtl && chapter.titleAr ? chapter.titleAr : chapter.title}
                        </h3>
                      </div>
                      <span className="text-xs text-navy-500 font-semibold">
                        {chapter.lessons ? chapter.lessons.length : 0} {isRtl ? 'دروس' : 'Lessons'}
                      </span>
                    </div>

                    <div className="divide-y divide-surface-borderSubtle bg-white">
                      {chapter.lessons && chapter.lessons.map((lesson, lIdx) => (
                        <div
                          key={lesson.id || lIdx}
                          className="p-3.5 px-4 flex items-center justify-between text-xs sm:text-sm hover:bg-surface-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {lesson.isFree ? (
                              <Play className="w-4 h-4 text-brand-600 shrink-0 fill-current" />
                            ) : (
                              <Lock className="w-4 h-4 text-navy-400 shrink-0" />
                            )}
                            <span className="font-medium text-navy-800">
                              {isRtl && lesson.titleAr ? lesson.titleAr : lesson.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {lesson.isFree && (
                              <span className="badge-light text-[10px] py-0.5 px-2">
                                {isRtl ? 'معاينة مجانية' : 'Free Preview'}
                              </span>
                            )}
                            <span className="text-xs text-navy-500 font-mono">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Sticky Checkout & Scholar Card */}
          <div className="lg:col-span-4 space-y-6 sticky top-20">
            {/* Checkout Card */}
            <div className="academy-card p-6 bg-white border border-surface-border shadow-card-hover space-y-5">
              <div className="flex items-baseline justify-between border-b border-surface-borderSubtle pb-4">
                <span className="text-xs font-bold text-navy-500 uppercase tracking-wider">
                  {isRtl ? 'الاشتراك مدى الحياة' : 'Full Lifetime Enrollment'}
                </span>
                <span className="text-2xl font-black text-brand-800">
                  {formatCurrency(course.price)}
                </span>
              </div>

              {/* Course Checklist */}
              <ul className="space-y-2.5 text-xs text-navy-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{course.durationHours} {isRtl ? 'ساعات فيديو عالية الدقة' : 'Hours High-Definition Video'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRtl ? 'ملفات ونصوص تلخيصية قابلة للتحميل' : 'Downloadable PDF Cheatsheets & Transcripts'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRtl ? 'شهادة إتمام معتمدة بالسند المتصل' : 'Continuous Sanad Certificate of Completion'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRtl ? 'تواصل مباشر مع الأستاذة عبير جاد' : 'Direct Feedback Channel with Ustadha Abeer Gad'}</span>
                </li>
              </ul>

              {/* PayPal Checkout Button */}
              <div className="pt-2">
                <PayPalCheckoutButton
                  itemId={course.slug}
                  itemType="COURSE"
                  itemTitle={title}
                  amount={course.price}
                  currency="USD"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-navy-500 pt-2 text-center">
                <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
                <span>
                  {isRtl ? 'ضمان استرداد كامل خلال 14 يوماً' : '14-Day 100% Satisfaction Guarantee'}
                </span>
              </div>
            </div>

            {/* Scholar Card */}
            <div className="academy-card p-6 bg-white border border-surface-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-800 font-bold text-lg">
                  ع.ج
                </div>
                <div>
                  <h4 className="font-extrabold text-navy-950 text-sm">
                    {course.instructorName || 'Ustadha Abeer Gad'}
                  </h4>
                  <span className="text-xs text-navy-500 block">
                    {isRtl ? 'أكاديمية عبير جاد • إشراف مباشر' : 'Lead Quran & Arabic Scholar'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-navy-600 leading-relaxed">
                {isRtl
                  ? 'مجازة بالقراءات العشر الصغرى والكبرى بالسند المتصل إلى رسول الله ﷺ، ولديها خبرة تمتد لأكثر من 15 عاماً في تدريس القرآن والعربية لغير الناطقين بها حول العالم.'
                  : 'Authorized with the 10 Minor and Major Quranic Recitations with continuous Sanad linked to the Prophet ﷺ, possessing over 15 years of specialized instruction worldwide.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
