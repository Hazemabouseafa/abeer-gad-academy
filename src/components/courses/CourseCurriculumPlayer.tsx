'use client';

import React, { useState } from 'react';
import {
  Play,
  Lock,
  Clock,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Video,
} from 'lucide-react';
import { PayPalCheckoutButton } from '@/components/checkout/PayPalCheckoutButton';
import { formatCurrency } from '@/lib/utils';
import type { CourseData, LessonData } from '@/lib/data-store';

interface CourseCurriculumPlayerProps {
  course: CourseData;
  currentLocale: string;
}

export function CourseCurriculumPlayer({
  course,
  currentLocale,
}: CourseCurriculumPlayerProps) {
  const isRtl = currentLocale === 'ar';

  const title = isRtl && course.titleAr ? course.titleAr : course.title;
  const subtitle = isRtl && course.subtitleAr ? course.subtitleAr : course.subtitle;
  const description = isRtl && course.descriptionAr ? course.descriptionAr : course.description;
  const category = isRtl && course.categoryAr ? course.categoryAr : course.category;
  const totalLessons = course.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 12;

  // Find all free preview lessons
  const freeLessons: { lesson: LessonData; chapterTitle: string }[] = [];
  course.chapters?.forEach((ch) => {
    ch.lessons?.forEach((l) => {
      if (l.isFree) {
        freeLessons.push({ lesson: l, chapterTitle: isRtl && ch.titleAr ? ch.titleAr : ch.title });
      }
    });
  });

  // Active playing lesson (null means promo video)
  const [activeLesson, setActiveLesson] = useState<LessonData | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [freeEnrolledSuccess, setFreeEnrolledSuccess] = useState(false);

  // Compute video URL
  let currentVideoUrl = activeLesson ? activeLesson.videoUrl : course.promoVideoUrl;
  if (!currentVideoUrl) {
    currentVideoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  }
  if (currentVideoUrl.includes('watch?v=')) {
    currentVideoUrl = currentVideoUrl.replace('watch?v=', 'embed/');
  }

  const isCourseFree = course.isFree || course.price === 0;

  const handleSelectLesson = (lesson: LessonData) => {
    if (lesson.isFree || isCourseFree || freeEnrolledSuccess) {
      setActiveLesson(lesson);
      setLockedNotice(null);
      // Smooth scroll to player
      document.getElementById('main-course-player')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setLockedNotice(
        isRtl
          ? `درس "${lesson.titleAr || lesson.title}" خاص بالمشتركين. يرجى الاشتراك في الدورة الكاملة لفتحه.`
          : `Lesson "${lesson.title}" requires full enrollment to watch.`
      );
      setTimeout(() => setLockedNotice(null), 5000);
    }
  };

  const handleFreeEnroll = () => {
    setFreeEnrolledSuccess(true);
    // Automatically open first lesson
    const firstLesson = course.chapters?.[0]?.lessons?.[0];
    if (firstLesson) {
      setActiveLesson(firstLesson);
    }
    document.getElementById('main-course-player')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* ============================================================== */}
      {/* LEFT: Main Video Player & Interactive Curriculum */}
      {/* ============================================================== */}
      <div className="lg:col-span-8 space-y-6">
        {/* Badges & Header */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="badge-light text-xs">{category}</span>
          <span className="text-xs font-semibold text-navy-600 bg-background-warm px-3 py-1 rounded-full border border-surface-borderSubtle">
            {isRtl && course.levelAr ? course.levelAr : course.level}
          </span>
          {isCourseFree ? (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'دورة مجانية بالكامل' : '100% Free Course'}</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-gold-900 border border-gold-300">
              {formatCurrency(course.price)}
            </span>
          )}
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

        {/* ============================================================== */}
        {/* VIDEO PLAYER (Updates when free preview is clicked) */}
        {/* ============================================================== */}
        <div id="main-course-player" className="academy-card overflow-hidden bg-white shadow-card-hover rounded-3xl border border-surface-border">
          <div className="aspect-video w-full bg-navy-950 relative flex items-center justify-center">
            {currentVideoUrl.startsWith('/uploads/') ? (
              <video
                src={currentVideoUrl}
                controls
                className="w-full h-full object-cover"
                poster={course.thumbnail}
              />
            ) : (
              <iframe
                src={currentVideoUrl}
                title={activeLesson ? activeLesson.title : title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
          </div>

          <div className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-surface-borderSubtle">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-navy-400 block tracking-wider">
                {activeLesson
                  ? (isRtl ? 'أنت تشاهد الآن درس:' : 'Now Playing Lesson:')
                  : (isRtl ? 'الفيديو التعريفي للدورة:' : 'Course Preview & Intro:')}
              </span>
              <h4 className="font-extrabold text-sm text-navy-950 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-brand-700 fill-current" />
                <span>
                  {activeLesson
                    ? (isRtl && activeLesson.titleAr ? activeLesson.titleAr : activeLesson.title)
                    : title}
                </span>
              </h4>
            </div>

            <div className="flex items-center gap-2">
              {activeLesson ? (
                <button
                  type="button"
                  onClick={() => setActiveLesson(null)}
                  className="px-3 py-1.5 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-elevated text-navy-700 font-bold transition-colors"
                >
                  {isRtl ? 'العودة للفيديو التعريفي' : 'Back to Intro'}
                </button>
              ) : freeLessons.length > 0 ? (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>
                    {isRtl
                      ? `${freeLessons.length} دروس مجانية متاحة للمعاينة أدناه`
                      : `${freeLessons.length} Free Preview Lessons Available`}
                  </span>
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Locked Notice Alert */}
        {lockedNotice && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
            <div className="flex-1 font-semibold">{lockedNotice}</div>
            <a
              href="#enrollment-box"
              className="px-3 py-1 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 text-[11px]"
            >
              {isRtl ? 'الاشتراك الآن' : 'Enroll Now'}
            </a>
          </div>
        )}

        {/* Free Enrollment Success Banner */}
        {freeEnrolledSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <div>
              <span className="font-extrabold block text-sm">
                {isRtl ? 'مبارك! تم تسجيلك بنجاح في هذه الدورة المجانية' : 'Congratulations! Enrolled in Free Course'}
              </span>
              <span className="text-emerald-800 text-[11px]">
                {isRtl
                  ? 'تم فتح جميع دروس الدورة لك الآن. انقر على أي درس بالأسفل للبدء مباشرة.'
                  : 'All lessons are unlocked. Click any lesson below to begin learning.'}
              </span>
            </div>
          </div>
        )}

        {/* Program Description */}
        <div className="academy-card p-6 sm:p-8 bg-white space-y-4 rounded-3xl border border-surface-border">
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
                {isRtl ? 'نوع الاشتراك' : 'Access Type'}
              </span>
              <span className={`text-sm font-black mt-0.5 block ${isCourseFree ? 'text-emerald-700' : 'text-brand-800'}`}>
                {isCourseFree ? (isRtl ? 'مجاني مدى الحياة' : 'Lifetime Free') : (isRtl ? 'مدفوع مدى الحياة' : 'Lifetime Paid')}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CURRICULUM MODULES & LESSONS (With Free Preview Highlights) */}
        {/* ============================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-navy-950">
                {isRtl ? 'المنهج الدراسي والدروس' : 'Curriculum Structure & Lessons'}
              </h2>
              <p className="text-xs text-navy-500">
                {isRtl
                  ? 'انقر على أي درس يحمل شارة "معاينة مجانية" لمشاهدته فوراً في المشغل أعلاه'
                  : 'Click any lesson with "Free Preview" to watch instantly above'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {course.chapters &&
              course.chapters.map((chapter, cIdx) => (
                <div
                  key={chapter.id || cIdx}
                  className="academy-card overflow-hidden bg-white border border-surface-border rounded-2xl"
                >
                  <div className="p-4 bg-surface-muted/60 flex items-center justify-between border-b border-surface-borderSubtle">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center">
                        {cIdx + 1}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-navy-900">
                        {isRtl && chapter.titleAr ? chapter.titleAr : chapter.title}
                      </h3>
                    </div>
                    <span className="text-xs text-navy-500 font-semibold font-mono">
                      {chapter.lessons ? chapter.lessons.length : 0} {isRtl ? 'دروس' : 'Lessons'}
                    </span>
                  </div>

                  <div className="divide-y divide-surface-borderSubtle bg-white">
                    {chapter.lessons &&
                      chapter.lessons.map((lesson, lIdx) => {
                        const isUnlocked = lesson.isFree || isCourseFree || freeEnrolledSuccess;
                        const isCurrentlyPlaying = activeLesson?.id === lesson.id;

                        return (
                          <div
                            key={lesson.id || lIdx}
                            onClick={() => handleSelectLesson(lesson)}
                            className={`p-3.5 px-4 flex items-center justify-between text-xs sm:text-sm cursor-pointer transition-all ${
                              isCurrentlyPlaying
                                ? 'bg-brand-50/80 border-s-4 border-brand-700'
                                : isUnlocked
                                ? 'hover:bg-emerald-50/40'
                                : 'hover:bg-surface-muted opacity-80'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {isCurrentlyPlaying ? (
                                <div className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center shrink-0">
                                  <Play className="w-3 h-3 fill-current" />
                                </div>
                              ) : isUnlocked ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                  <Play className="w-3 h-3 fill-current ps-0.5" />
                                </div>
                              ) : (
                                <Lock className="w-4 h-4 text-navy-400 shrink-0" />
                              )}

                              <div>
                                <span
                                  className={`font-semibold block ${
                                    isCurrentlyPlaying
                                      ? 'text-brand-900 font-bold'
                                      : isUnlocked
                                      ? 'text-navy-900'
                                      : 'text-navy-700'
                                  }`}
                                >
                                  {isRtl && lesson.titleAr ? lesson.titleAr : lesson.title}
                                </span>
                                {lesson.notes && (
                                  <span className="text-[11px] text-navy-500 line-clamp-1">
                                    {lesson.notes}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {lesson.isFree ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-emerald-600" />
                                  <span>{isRtl ? 'معاينة مجانية' : 'Free Preview'}</span>
                                </span>
                              ) : isCourseFree || freeEnrolledSuccess ? (
                                <span className="badge-light text-[10px] py-0.5 px-2">
                                  {isRtl ? 'متاح مجاناً' : 'Free'}
                                </span>
                              ) : (
                                <span className="text-[10px] text-navy-400 bg-surface-muted px-2 py-0.5 rounded-full">
                                  {isRtl ? 'يتطلب الشراء' : 'Enrolled'}
                                </span>
                              )}
                              <span className="text-xs text-navy-500 font-mono">
                                {lesson.duration}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT: Sticky Checkout or Free Enrollment Card */}
      {/* ============================================================== */}
      <div id="enrollment-box" className="lg:col-span-4 space-y-6 sticky top-20">
        <div className="academy-card p-6 bg-white border border-surface-border shadow-card-hover space-y-5 rounded-3xl">
          <div className="flex items-baseline justify-between border-b border-surface-borderSubtle pb-4">
            <span className="text-xs font-bold text-navy-500 uppercase tracking-wider">
              {isRtl ? 'الاشتراك في الدورة' : 'Course Enrollment'}
            </span>
            {isCourseFree ? (
              <span className="text-2xl font-black text-emerald-700">
                {isRtl ? 'مجاناً 100%' : '100% Free'}
              </span>
            ) : (
              <span className="text-2xl font-black text-brand-800">
                {formatCurrency(course.price)}
              </span>
            )}
          </div>

          {/* Checklist */}
          <ul className="space-y-2.5 text-xs text-navy-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{course.durationHours} {isRtl ? 'ساعات فيديو بدقة فائقة' : 'Hours High-Definition Video'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{totalLessons} {isRtl ? 'درساً تعليمياً متسلسلاً' : 'Structured Lessons'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{isRtl ? 'شهادة إتمام معتمدة بالسند المتصل' : 'Continuous Sanad Certificate'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{isRtl ? 'متابعة مباشرة مع الأستاذة عبير جاد' : 'Supervised by Ustadha Abeer Gad'}</span>
            </li>
          </ul>

          {/* ACTION BUTTON (Free Enrollment OR PayPal Checkout) */}
          <div className="pt-2">
            {isCourseFree ? (
              <button
                type="button"
                onClick={handleFreeEnroll}
                disabled={freeEnrolledSuccess}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {freeEnrolledSuccess
                    ? (isRtl ? 'تم التسجيل! يمكنك بدء المشاهدة' : 'Enrolled! Watching Now')
                    : (isRtl ? 'ابدأ الدورة الآن مجاناً (Enroll Free)' : 'Start Course Now for Free')}
                </span>
              </button>
            ) : (
              <PayPalCheckoutButton
                itemId={course.slug}
                itemType="COURSE"
                itemTitle={title}
                amount={course.price}
                currency="USD"
              />
            )}
          </div>

          {!isCourseFree && freeLessons.length > 0 && (
            <div className="p-3 rounded-xl bg-gold-50/70 border border-gold-200 text-xs text-gold-900 text-center font-medium">
              💡 {isRtl ? 'تتوفر دروس مجانية تجريبية في المنهج يمكنك مشاهدتها قبل إتمام الدفع.' : 'Free preview lessons available to watch before purchase.'}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-navy-500 pt-2 text-center">
            <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
            <span>
              {isRtl ? 'ضمان استرداد كامل خلال 14 يوماً' : '14-Day 100% Satisfaction Guarantee'}
            </span>
          </div>
        </div>

        {/* Scholar Card */}
        <div className="academy-card p-6 bg-white border border-surface-border space-y-4 rounded-3xl">
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
  );
}
