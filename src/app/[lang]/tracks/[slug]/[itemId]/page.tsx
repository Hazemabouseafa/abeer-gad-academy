import { setRequestLocale } from 'next-intl/server';
import { locales, Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  Video,
  FileText,
  Download,
  GraduationCap,
  Clock,
  ShieldCheck,
  Play,
  ExternalLink,
} from 'lucide-react';
import {
  getTrackByHref,
  getTracks,
  getCourses,
  getSiteSettings,
} from '@/lib/data-store';
import { formatCurrency } from '@/lib/utils';
import { PayPalCheckoutButton } from '@/components/checkout/PayPalCheckoutButton';
import { FullInteractiveCalendar } from '@/components/lessons/FullInteractiveCalendar';
import { CourseCurriculumPlayer } from '@/components/courses/CourseCurriculumPlayer';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang, slug: 'learn-arabic', itemId: 'arabic-stage-1' }));
}

function getEmbedUrl(url: string): { type: 'iframe' | 'video'; src: string } | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();

  // Direct video files
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmed) || trimmed.startsWith('/uploads/')) {
    return { type: 'video', src: trimmed };
  }

  // YouTube
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return { type: 'iframe', src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0` };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  return { type: 'video', src: trimmed };
}

interface UnitPageProps {
  params: {
    lang: string;
    slug: string;
    itemId: string;
  };
}

export default async function TrackUnitDetailPage({
  params: { lang, slug, itemId },
}: UnitPageProps) {
  setRequestLocale(lang);
  const isRtl = lang === 'ar';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const decodedSlug = decodeURIComponent(slug);
  const decodedItemId = decodeURIComponent(itemId);

  let track = getTrackByHref(decodedSlug);
  const allTracks = getTracks();

  if (!track) {
    track = allTracks.find((t) =>
      (t.items || []).some((it, i) => it.id === decodedItemId || `stage-${i + 1}` === decodedItemId)
    );
  }

  if (!track) {
    notFound();
  }

  const items = track.items || [];
  const item = items.find(
    (it, idx) => it.id === decodedItemId || `stage-${idx + 1}` === decodedItemId
  );

  if (!item) {
    notFound();
  }

  const allCourses = getCourses();
  const settings = getSiteSettings();
  const actionType = item.actionType || 'PRIVATE_LESSON';

  const linkedCourse = item.linkedCourseSlug
    ? allCourses.find(
        (c) => c.slug === item.linkedCourseSlug || c.id === item.linkedCourseSlug
      )
    : undefined;

  const trackTitle = isRtl ? track.titleAr || track.titleEn : track.titleEn || track.titleAr;
  const unitTitle = isRtl ? item.titleAr || item.title : item.title || item.titleAr;
  const unitDesc = isRtl ? item.descAr || item.desc : item.desc || item.descAr;
  const detailedContent = isRtl
    ? item.detailedContentAr || item.detailedContentEn
    : item.detailedContentEn || item.detailedContentAr;
  const pointsList = (isRtl ? item.pointsAr : item.points) || [];

  const videoSource = item.videoUrl ? getEmbedUrl(item.videoUrl) : null;
  const effectivePrice =
    item.price && item.price > 0
      ? item.price
      : linkedCourse && linkedCourse.price > 0
      ? linkedCourse.price
      : 0;

  const dayPrice = settings.slotPricing?.dayPrice ?? 45;
  const nightPrice = settings.slotPricing?.nightPrice ?? 60;

  const trackBackHref = track.href.startsWith('/') ? track.href : `/${track.href}`;

  return (
    <div className="py-10 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 space-y-10">
        {/* Top Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-3.5 rounded-2xl border border-surface-border shadow-card-subtle">
          <div className="flex items-center gap-2 text-xs font-bold text-navy-600">
            <Link
              href={trackBackHref}
              className="inline-flex items-center gap-1.5 text-brand-700 hover:text-brand-900 transition-colors"
            >
              <BackArrow className="w-4 h-4" />
              <span>{trackTitle}</span>
            </Link>
            <span className="text-navy-300">/</span>
            <span className="text-navy-900 font-extrabold">{unitTitle}</span>
          </div>

          <span className="badge-gold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {item.levelAr || item.level
                ? isRtl
                  ? item.levelAr || item.level
                  : item.level || item.levelAr
                : isRtl
                ? 'وحدة منهجية معتمدة'
                : 'Certified Curriculum Module'}
            </span>
          </span>
        </div>

        {/* If Admin linked this Unit to a full Course, show the Course Player directly */}
        {actionType === 'COURSE' && linkedCourse && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs font-bold text-amber-900">
                <GraduationCap className="w-5 h-5 text-amber-700 shrink-0" />
                <span>
                  {isRtl
                    ? `هذه الوحدة مرتبطة بالدورة التدريبية المعتمدة: "${linkedCourse.titleAr || linkedCourse.title}"`
                    : `This module is linked to the full academic course: "${linkedCourse.title}"`}
                </span>
              </div>
              <Link
                href={`/courses/${linkedCourse.slug}`}
                className="text-xs font-extrabold text-brand-800 hover:underline flex items-center gap-1"
              >
                <span>{isRtl ? 'فتح صفحة الدورة المستقلة' : 'Open Standalone Course Page'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <CourseCurriculumPlayer course={linkedCourse} currentLocale={lang} />
          </div>
        )}

        {/* Main Unit Content & Action Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Columns: Unit Video, Detailed Content, Objectives, PDF */}
          <div className="lg:col-span-2 space-y-6">
            {/* Unit Header Card */}
            <div className="academy-card p-6 sm:p-8 bg-white space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                {item.levelAr || item.level ? (
                  <span className="badge-gold text-xs">
                    {isRtl ? item.levelAr || item.level : item.level || item.levelAr}
                  </span>
                ) : null}

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200 flex items-center gap-1.5">
                  {actionType === 'COURSE' ? (
                    <>
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'دورة تدريبية' : 'Academic Course'}</span>
                    </>
                  ) : actionType === 'DIRECT_CONTENT' ? (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'درس ومحتوى تعليمي مباشر' : 'Direct Lesson & Material'}</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'جلسة وحصة فردية مباشرة (1-on-1)' : '1-on-1 Private Lesson'}</span>
                    </>
                  )}
                </span>

                {(item.durationAr || item.duration) && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-muted text-navy-700 border border-surface-borderSubtle flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-700" />
                    <span>{isRtl ? item.durationAr || item.duration : item.duration || item.durationAr}</span>
                  </span>
                )}

                {item.lessonsCount && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-muted text-navy-700 border border-surface-borderSubtle">
                    📚 {item.lessonsCount} {isRtl ? 'درساً في هذه الوحدة' : 'Lessons'}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-navy-950 leading-tight">
                {unitTitle}
              </h1>

              {unitDesc && (
                <p className="text-sm sm:text-base text-navy-600 leading-relaxed">
                  {unitDesc}
                </p>
              )}

              {/* Embedded Unit Video Player (if videoUrl configured by Admin) */}
              {videoSource && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-800">
                    <Video className="w-4 h-4 text-brand-700" />
                    <span>{isRtl ? 'الفيديو التعليمي الخاص بهذه الوحدة:' : 'Unit Instructional Video:'}</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border-2 border-surface-border bg-navy-950 aspect-video shadow-card-subtle">
                    {videoSource.type === 'iframe' ? (
                      <iframe
                        src={videoSource.src}
                        title={unitTitle}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={videoSource.src}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Detailed Study Explanation (if added by Admin) */}
              {detailedContent && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F0] border border-gold-200 space-y-3">
                  <h3 className="text-sm sm:text-base font-extrabold text-navy-950 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-700" />
                    <span>
                      {isRtl
                        ? 'تفاصيل وشرح المحتوى العلمي للوحدة'
                        : 'Detailed Curriculum & Study Notes'}
                    </span>
                  </h3>
                  <div className="text-xs sm:text-sm text-navy-800 leading-relaxed whitespace-pre-line">
                    {detailedContent}
                  </div>
                </div>
              )}

              {/* Key Learning Objectives */}
              {pointsList.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-navy-950">
                    {isRtl
                      ? 'المحاور والمهارات التي سيتقنها الطالب في هذه الوحدة:'
                      : 'Key Learning Objectives in This Module:'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pointsList.map((pt, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-surface-muted/70 border border-surface-borderSubtle flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-navy-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attached File / PDF Download Card */}
              {item.fileUrl && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-gold-50 to-amber-50/60 border border-gold-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-gold-300 text-gold-700 flex items-center justify-center shrink-0 shadow-sm">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-navy-950">
                        {isRtl ? 'المادة العلمية والملف المرفق للوحدة' : 'Attached Study Guide & PDF'}
                      </h4>
                      <p className="text-xs text-navy-600">
                        {isRtl
                          ? 'ملف تعليمي معتمد من الأكاديمية للمراجعة والتطبيق العملي'
                          : 'Official instructional document for study and practice'}
                      </p>
                    </div>
                  </div>

                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all shrink-0"
                  >
                    <Download className="w-4 h-4 text-gold-300" />
                    <span>{isRtl ? 'تحميل الملف المرفق الآن' : 'Download Material PDF'}</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Action & Enrollment Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="academy-card p-6 bg-white border-2 border-brand-200 rounded-3xl space-y-5 shadow-card-hover sticky top-24">
              <div className="pb-4 border-b border-surface-borderSubtle space-y-2">
                <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider block">
                  {actionType === 'COURSE'
                    ? isRtl
                      ? 'التسجيل في دورة الوحدة'
                      : 'Course Module Enrollment'
                    : actionType === 'DIRECT_CONTENT'
                    ? isRtl
                      ? 'الوصول للمحتوى التعليمي'
                      : 'Direct Content Access'
                    : isRtl
                    ? 'حجز واشتراك الحصص لهذه الوحدة'
                    : 'Book 1-on-1 Session for This Unit'}
                </span>

                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-navy-600">
                    {isRtl ? 'رسوم الاشتراك:' : 'Enrollment Fee:'}
                  </span>
                  {item.isFree ? (
                    <span className="text-xl font-black text-emerald-700">
                      {isRtl ? 'مجاناً بالكامل' : 'Free Access'}
                    </span>
                  ) : effectivePrice > 0 ? (
                    <span className="text-2xl font-black text-navy-950">
                      {formatCurrency(effectivePrice)}
                    </span>
                  ) : (
                    <div className="text-end">
                      <span className="text-lg font-black text-brand-800 block">
                        {formatCurrency(dayPrice)} - {formatCurrency(nightPrice)}
                      </span>
                      <span className="text-[10px] text-navy-500">
                        {isRtl ? 'حسب توقيت الحصة المختارة' : 'Based on selected session time'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-navy-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>
                    {isRtl
                      ? 'إشراف وتوجيه مباشر من الأستاذة عبير جاد'
                      : 'Direct instruction by Ustadha Abeer Gad'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>
                    {isRtl
                      ? 'منهج معتمد ومؤهل للإجازة بالسند المتصل'
                      : 'Verified curriculum eligible for Sanad'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>
                    {isRtl
                      ? 'دفع آمن ومعتمد عبر بوابة PayPal العالمية'
                      : '100% Secure Checkout via PayPal'}
                  </span>
                </div>
              </div>

              {/* Direct PayPal Checkout if a fixed price is set on the unit */}
              {!item.isFree && effectivePrice > 0 && (
                <div className="pt-2">
                  <PayPalCheckoutButton
                    itemId={item.id}
                    itemType={actionType === 'COURSE' ? 'COURSE' : 'PRIVATE_LESSON'}
                    itemTitle={`${trackTitle} - ${unitTitle}`}
                    amount={effectivePrice}
                  />
                </div>
              )}

              {/* Scroll to Calendar button if Private Lesson */}
              {actionType === 'PRIVATE_LESSON' && (
                <a
                  href="#unit-booking-calendar"
                  className="w-full py-3 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Calendar className="w-4 h-4 text-gold-300" />
                  <span>
                    {isRtl
                      ? 'اختر موعد الحصة من التقويم بالأسفل ↓'
                      : 'Pick Session Time in Calendar Below ↓'}
                  </span>
                </a>
              )}

              {actionType === 'CUSTOM_LINK' && item.customUrl && (
                <a
                  href={item.customUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>
                    {isRtl
                      ? item.ctaTextAr || 'الانتقال إلى الرابط المخصص'
                      : item.ctaTextEn || 'Open Resource Link'}
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Calendar Section for Booking Private Sessions on this Unit */}
        {actionType === 'PRIVATE_LESSON' && (
          <div id="unit-booking-calendar" className="pt-6 scroll-mt-20 space-y-6">
            <div className="max-w-3xl mx-auto text-center space-y-2">
              <span className="badge-gold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{isRtl ? 'حجز موعد الحصة الخاصة لهذه الوحدة' : 'Book Your 1-on-1 Session'}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                {isRtl
                  ? `جدول المواعيد المتاحة لدراسة: ${unitTitle}`
                  : `Available Schedule for: ${unitTitle}`}
              </h2>
              <p className="text-xs sm:text-sm text-navy-600">
                {isRtl
                  ? 'اختر اليوم والساعة المناسبة لك من المواعيد المتاحة بالأسفل وأكمل الحجز مباشرة'
                  : 'Select your preferred date and time slot below to book your session'}
              </p>
            </div>

            <FullInteractiveCalendar currentLocale={lang} />
          </div>
        )}
      </div>
    </div>
  );
}
