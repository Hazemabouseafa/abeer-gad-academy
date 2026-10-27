import React from 'react';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  BookOpen,
  Video,
  FileText,
  Sparkles,
  ExternalLink,
  Play,
  GraduationCap,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { ServiceCardItem, TrackItem, CourseData } from '@/lib/data-store';
import { formatCurrency } from '@/lib/utils';

interface TrackUnitsGridProps {
  track?: ServiceCardItem;
  fallbackItems?: TrackItem[];
  trackSlug: string;
  lang: string;
  courses?: CourseData[];
}

export function TrackUnitsGrid({
  track,
  fallbackItems = [],
  trackSlug,
  lang,
  courses = [],
}: TrackUnitsGridProps) {
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const items: TrackItem[] =
    track?.items && track.items.length > 0 ? track.items : fallbackItems;

  const cleanTrackSlug = trackSlug.replace(/^\/+|\/+$/g, '').replace(/^tracks\//, '');

  if (items.length === 0) {
    return (
      <div className="text-center py-12 max-w-md mx-auto text-navy-500 text-sm">
        {isRtl
          ? 'سيتم إضافة مراحل ووحدات هذا المسار قريباً من قِبل الإدارة.'
          : 'Track stages and modules will be added soon.'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
      {items.map((item, idx) => {
        const pointsList = (isRtl ? item.pointsAr : item.points) || [];
        const actionType = item.actionType || 'PRIVATE_LESSON';
        const linkedCourse = item.linkedCourseSlug
          ? courses.find((c) => c.slug === item.linkedCourseSlug || c.id === item.linkedCourseSlug)
          : undefined;

        const unitHref =
          actionType === 'CUSTOM_LINK' && item.customUrl
            ? item.customUrl
            : `/tracks/${cleanTrackSlug}/${item.id || `stage-${idx + 1}`}`;

        // Type Badge Label & Style
        let typeLabel = isRtl ? 'حصة خاصة / جلسة فردية' : '1-on-1 Private Session';
        let TypeIcon = Calendar;
        let typeBadgeClass = 'bg-brand-50 text-brand-800 border-brand-200';

        if (actionType === 'COURSE') {
          typeLabel = isRtl ? 'دورة تدريبية متكاملة' : 'Full Academic Course';
          TypeIcon = GraduationCap;
          typeBadgeClass = 'bg-amber-50 text-amber-900 border-amber-200';
        } else if (actionType === 'DIRECT_CONTENT') {
          typeLabel = isRtl ? 'درس مرئي ومحتوى علمي' : 'Video & Study Material';
          TypeIcon = Play;
          typeBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        } else if (actionType === 'CUSTOM_LINK') {
          typeLabel = isRtl ? 'مورد / محتوى مخصص' : 'Custom Resource';
          TypeIcon = ExternalLink;
          typeBadgeClass = 'bg-purple-50 text-purple-800 border-purple-200';
        }

        // Default CTA Button Label based on actionType if not customized by Admin
        const defaultCtaAr =
          actionType === 'COURSE'
            ? 'دخول الوحدة وعرض الدورة'
            : actionType === 'DIRECT_CONTENT'
            ? 'دخول الوحدة ومشاهدة الدرس'
            : actionType === 'CUSTOM_LINK'
            ? 'فتح المحتوى الآن'
            : 'دخول الوحدة وحجز الحصة';

        const defaultCtaEn =
          actionType === 'COURSE'
            ? 'Enter Unit & View Course'
            : actionType === 'DIRECT_CONTENT'
            ? 'Enter Unit & Watch Lesson'
            : actionType === 'CUSTOM_LINK'
            ? 'Open Resource'
            : 'Enter Unit & Book Session';

        const ctaLabel = isRtl
          ? item.ctaTextAr || defaultCtaAr
          : item.ctaTextEn || item.ctaTextAr || defaultCtaEn;

        const effectivePrice =
          item.price && item.price > 0
            ? item.price
            : linkedCourse && linkedCourse.price > 0
            ? linkedCourse.price
            : 0;

        return (
          <div
            key={item.id || idx}
            className="academy-card p-6 sm:p-8 flex flex-col justify-between hover:border-brand-400 group transition-all"
          >
            <div className="space-y-4">
              {/* Top Badges Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-gold text-xs">
                    {item.levelAr || item.level
                      ? isRtl
                        ? item.levelAr || item.level
                        : item.level || item.levelAr
                      : isRtl
                      ? `الوحدة ${idx + 1}`
                      : `Unit ${idx + 1}`}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${typeBadgeClass}`}
                  >
                    <TypeIcon className="w-3 h-3" />
                    <span>{typeLabel}</span>
                  </span>
                </div>

                {(item.duration || item.durationAr || item.lessonsCount) && (
                  <span className="text-xs text-navy-500 font-semibold font-mono">
                    {(item.durationAr || item.duration) &&
                      (isRtl ? item.durationAr || item.duration : item.duration || item.durationAr)}
                    {item.lessonsCount
                      ? ` • ${item.lessonsCount} ${isRtl ? 'درساً' : 'Lessons'}`
                      : ''}
                  </span>
                )}
              </div>

              {/* Title (Clickable) */}
              <Link href={unitHref} className="block">
                <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand-800 transition-colors">
                  {isRtl ? item.titleAr || item.title : item.title || item.titleAr}
                </h3>
              </Link>

              {/* Description */}
              <p className="text-sm text-navy-600 leading-relaxed">
                {isRtl ? item.descAr || item.desc : item.desc || item.descAr}
              </p>

              {/* Media & Price Indicators */}
              {(item.videoUrl || item.fileUrl || linkedCourse || item.isFree || effectivePrice > 0) && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {item.isFree ? (
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                      {isRtl ? '🎁 متاح مجاناً' : '🎁 Free Access'}
                    </span>
                  ) : effectivePrice > 0 ? (
                    <span className="px-2.5 py-0.5 rounded-lg bg-gold-100 text-navy-950 border border-gold-300 text-xs font-extrabold">
                      {formatCurrency(effectivePrice)}
                    </span>
                  ) : null}

                  {(item.videoUrl || linkedCourse?.promoVideoUrl) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-muted border border-surface-borderSubtle text-[11px] font-semibold text-navy-700">
                      <Video className="w-3 h-3 text-brand-700" />
                      <span>{isRtl ? 'يتضمن شرح فيديو' : 'Includes Video'}</span>
                    </span>
                  )}

                  {item.fileUrl && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-muted border border-surface-borderSubtle text-[11px] font-semibold text-navy-700">
                      <FileText className="w-3 h-3 text-gold-700" />
                      <span>{isRtl ? 'ملف / كتاب PDF مرفق' : 'PDF Attached'}</span>
                    </span>
                  )}

                  {linkedCourse && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-brand-50 border border-brand-200 text-[11px] font-bold text-brand-800">
                      <BookOpen className="w-3 h-3" />
                      <span>
                        {isRtl ? linkedCourse.titleAr || linkedCourse.title : linkedCourse.title}
                      </span>
                    </span>
                  )}
                </div>
              )}

              {/* Learning Points */}
              {Array.isArray(pointsList) && pointsList.length > 0 && (
                <div className="pt-3 border-t border-surface-borderSubtle space-y-1.5">
                  {pointsList.map((pt, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-center gap-1.5 text-xs text-navy-700 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-5 mt-5 border-t border-surface-borderSubtle flex items-center justify-between gap-3">
              {item.fileUrl ? (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-800 hover:text-gold-900 bg-gold-50 px-3 py-2 rounded-xl border border-gold-200 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تحميل المرفق PDF' : 'Download PDF'}</span>
                </a>
              ) : (
                <span className="text-xs font-semibold text-brand-700">
                  {actionType === 'COURSE'
                    ? isRtl
                      ? 'منهج ودروس مسجلة'
                      : 'Course Curriculum'
                    : actionType === 'DIRECT_CONTENT'
                    ? isRtl
                      ? 'محتوى تعليمي تفاعلي'
                      : 'Direct Study Content'
                    : isRtl
                    ? 'متابعة وإشراف فردي مباشر'
                    : '1-on-1 Live Supervision'}
                </span>
              )}

              <Link
                href={unitHref}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>{ctaLabel}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
