'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { VideoModal } from '@/components/ui/VideoModal';
import {
  Play,
  Clock,
  BookOpen,
  Star,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { CourseData } from '@/lib/data-store';

interface CourseCardData {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  category: string;
  categoryAr: string;
  level: string;
  levelAr: string;
  durationMinutes: number;
  lessonCount: number;
  price: number;
  isFree: boolean;
  rating: number;
  reviewCount: number;
  videoPreviewUrl: string;
}

const fallbackCourses: CourseCardData[] = [
  {
    id: 'course-1',
    slug: 'foundational-arabic-alphabet-grammar',
    title: 'Foundational Arabic: Phonetics to Sentence Mastery',
    titleAr: 'تأسيس اللغة العربية: من مخارج الحروف إلى إعراب الجمل',
    subtitle: 'Step-by-step masterclass covering reading, writing, and essential Sarf and Nahw principles.',
    subtitleAr: 'دورة شاملة لتأسيس القراءة والكتابة وقواعد النحو والصرف من البداية وحتى الإتقان.',
    category: 'Learn Arabic',
    categoryAr: 'تعلم العربية',
    level: 'Beginner',
    levelAr: 'مبتدئ',
    durationMinutes: 720,
    lessonCount: 24,
    price: 0,
    isFree: true,
    rating: 5.0,
    reviewCount: 142,
    videoPreviewUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'course-2',
    slug: 'tajweed-and-makharij-masterclass',
    title: 'Tajweed Rules & Accurate Articulation (Makhaarij)',
    titleAr: 'أحكام التجويد وضبط مخارج الحروف والصفات',
    subtitle: 'Master the rules of Noon Sakinah, Meem, Madd, and phonetic characteristics with continuous Sanad guidance.',
    subtitleAr: 'دراسة تطبيقية لأحكام النون والميم والمدود وصفات الحروف مع توجيهات السند المتصل.',
    category: 'Tajweed',
    categoryAr: 'علم التجويد',
    level: 'All Levels',
    levelAr: 'جميع المستويات',
    durationMinutes: 960,
    lessonCount: 32,
    price: 110,
    isFree: false,
    rating: 5.0,
    reviewCount: 218,
    videoPreviewUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'course-3',
    slug: 'quran-memorization-hifz-methodology',
    title: 'Hifz Acceleration: Structured Memorization System',
    titleAr: 'منهجية الحفظ المتقن للقرآن الكريم وتثبيت المتشابهات',
    subtitle: 'A scientific, cognitive-based curriculum for permanent retention, spaced repetition, and Mutashabihat mastery.',
    subtitleAr: 'منهج علمي راسخ يجمع بين التكرار المتباعد، ضبط المتشابهات، وجداول المراجعة الدقيقة.',
    category: 'Quran Memorization',
    categoryAr: 'حفظ القرآن',
    level: 'Intermediate',
    levelAr: 'متوسط',
    durationMinutes: 840,
    lessonCount: 28,
    price: 125,
    isFree: false,
    rating: 5.0,
    reviewCount: 96,
    videoPreviewUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];

interface FeaturedCoursesProps {
  currentLocale: string;
}

export function FeaturedCourses({ currentLocale }: FeaturedCoursesProps) {
  const tCourses = useTranslations('courses');
  const isRtl = currentLocale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [courseList, setCourseList] = useState<CourseCardData[]>(fallbackCourses);
  const [activeModalCourse, setActiveModalCourse] = useState<CourseCardData | null>(null);
  const [priceFilter, setPriceFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
          const mapped: CourseCardData[] = data.courses.map((c: CourseData) => {
            const totalLessons = c.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 12;
            const isFree = Boolean(c.isFree || c.price === 0);
            return {
              id: c.id,
              slug: c.slug,
              title: c.title,
              titleAr: c.titleAr || c.title,
              subtitle: c.subtitle || '',
              subtitleAr: c.subtitleAr || '',
              category: c.category,
              categoryAr: c.categoryAr || c.category,
              level: c.level,
              levelAr: c.levelAr || c.level,
              durationMinutes: (c.durationHours || 10) * 60,
              lessonCount: totalLessons,
              price: isFree ? 0 : c.price,
              isFree,
              rating: c.rating || 5.0,
              reviewCount: c.reviewsCount || 100,
              videoPreviewUrl: c.promoVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            };
          });
          setCourseList(mapped);
        }
      })
      .catch((err) => {
        console.error('Error fetching live courses:', err);
      });
  }, []);

  const filteredCourses = courseList.filter((course) => {
    if (priceFilter === 'FREE') return course.isFree || course.price === 0;
    if (priceFilter === 'PAID') return !course.isFree && course.price > 0;
    return true;
  });

  return (
    <section className="py-16 sm:py-20 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-3 max-w-2xl">
            <span className="badge-light">
              <Sparkles className="w-3.5 h-3.5" />
              {tCourses('badge')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
              {tCourses('title')}
            </h2>
            <p className="text-sm sm:text-base text-navy-600">
              {tCourses('subtitle')}
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900 transition-colors"
          >
            <span>{isRtl ? 'عرض كافة البرامج الدراسية' : 'View All Academic Programs'}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Pills (All / Free / Paid) */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-navy-500 flex items-center gap-1.5 me-2">
            <Filter className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تصنيف الدورات:' : 'Filter:'}</span>
          </span>

          <button
            type="button"
            onClick={() => setPriceFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              priceFilter === 'ALL'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-white border border-surface-border text-navy-700 hover:bg-surface-muted'
            }`}
          >
            {isRtl ? 'جميع الدورات' : 'All Courses'} ({courseList.length})
          </button>

          <button
            type="button"
            onClick={() => setPriceFilter('FREE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              priceFilter === 'FREE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-surface-border text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'دورات مجانية بالكامل' : 'Free Courses'}</span>
          </button>

          <button
            type="button"
            onClick={() => setPriceFilter('PAID')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              priceFilter === 'PAID'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-white border border-surface-border text-navy-700 hover:bg-surface-muted'
            }`}
          >
            {isRtl ? 'دورات متقدمة مدفوعة' : 'Paid Masterclasses'}
          </button>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((course) => {
            const title = isRtl ? course.titleAr : course.title;
            const subtitle = isRtl ? course.subtitleAr : course.subtitle;
            const category = isRtl ? course.categoryAr : course.category;
            const level = isRtl ? course.levelAr : course.level;
            const isFree = course.isFree || course.price === 0;

            return (
              <div
                key={course.id}
                className="academy-card flex flex-col justify-between overflow-hidden bg-white border border-surface-border rounded-3xl group hover:border-brand-200 transition-all duration-300 shadow-card-subtle hover:shadow-card-hover"
              >
                {/* Visual Header / Media Preview */}
                <div>
                  <div className="relative aspect-video w-full bg-navy-950 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/60 to-transparent z-10" />

                    {/* Category, Level & FREE Badges */}
                    <div className="absolute top-4 start-4 z-20 flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-navy-900 backdrop-blur-md shadow-sm">
                        {category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-900/80 text-gold-300 backdrop-blur-md border border-gold-500/20">
                        {level}
                      </span>
                      {isFree && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-600 text-white shadow-sm flex items-center gap-1 animate-pulse">
                          <Sparkles className="w-3 h-3" />
                          <span>{isRtl ? 'مجاني' : 'FREE'}</span>
                        </span>
                      )}
                    </div>

                    {/* Interactive Play Video Trigger */}
                    <button
                      type="button"
                      onClick={() => setActiveModalCourse(course)}
                      className="relative z-20 w-14 h-14 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-400/40"
                      aria-label={`Watch preview for ${title}`}
                    >
                      <Play className="w-6 h-6 fill-current ps-0.5" />
                    </button>

                    {/* Decorative Bottom Bar */}
                    <div className="absolute bottom-3 start-4 end-4 z-20 flex items-center justify-between text-xs text-white/90">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gold-400" />
                        <span>{Math.round(course.durationMinutes / 60)} {isRtl ? 'ساعة' : 'hours'}</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-gold-400" />
                        <span>{course.lessonCount} {isRtl ? 'درساً' : 'lessons'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Course Details Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Rating & Scholar Trust */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gold-600 font-bold">
                        <Star className="w-4 h-4 fill-current text-gold-500" />
                        <span>{course.rating.toFixed(1)}</span>
                        <span className="text-navy-400 font-normal">
                          ({course.reviewCount})
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-brand-600" />
                        <span>{isRtl ? 'إشراف الأستاذة عبير' : 'Supervised'}</span>
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-navy-950 group-hover:text-brand-800 transition-colors line-clamp-2">
                        <Link href={`/courses/${course.slug}`}>
                          {title}
                        </Link>
                      </h3>
                      <p className="text-xs text-navy-600 line-clamp-2 leading-relaxed">
                        {subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="px-6 py-4 bg-surface-muted/60 border-t border-surface-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-navy-400 block tracking-wider">
                      {isRtl ? 'الرسوم' : 'Investment'}
                    </span>
                    {isFree ? (
                      <span className="text-lg font-black text-emerald-700">
                        {isRtl ? 'مجاناً 100%' : '100% Free'}
                      </span>
                    ) : (
                      <span className="text-xl font-extrabold text-navy-950">
                        {formatCurrency(course.price)}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/courses/${course.slug}`}
                    className={`text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 font-bold transition-all shadow-sm ${
                      isFree
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'btn-primary'
                    }`}
                  >
                    <span>{isFree ? (isRtl ? 'ابدأ مجاناً' : 'Enroll Free') : (isRtl ? 'عرض المنهج' : 'Enroll Now')}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Video Modal */}
      {activeModalCourse && (
        <VideoModal
          isOpen={!!activeModalCourse}
          onClose={() => setActiveModalCourse(null)}
          title={isRtl ? activeModalCourse.titleAr : activeModalCourse.title}
          videoUrl={activeModalCourse.videoPreviewUrl}
        />
      )}
    </section>
  );
}
