import { setRequestLocale } from 'next-intl/server';
import { locales, Link } from '@/i18n/routing';
import { Calendar, Sparkles } from 'lucide-react';
import { getTrackByHref, getTracks, getCourses } from '@/lib/data-store';
import { notFound } from 'next/navigation';
import { TrackUnitsGrid } from '@/components/tracks/TrackUnitsGrid';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang, slug: 'default' }));
}

interface PageProps {
  params: { lang: string; slug: string };
}

export default async function DynamicTrackPage({ params: { lang, slug } }: PageProps) {
  setRequestLocale(lang);
  const isRtl = lang === 'ar';

  const track =
    getTrackByHref(slug) ||
    getTracks().find(
      (t) =>
        t.href === `/tracks/${slug}` ||
        t.href === `/${slug}` ||
        t.id === slug ||
        t.id.endsWith(slug)
    );

  if (!track) {
    notFound();
  }

  const courses = getCourses();
  const pageTitle = isRtl ? track.titleAr : track.titleEn;
  const pageSubtitle = track.subtitleAr
    ? isRtl ? track.subtitleAr : track.subtitleEn
    : (isRtl ? 'منهج تعليمي أكاديمي متخصص بإشراف الأستاذة عبير جاد' : 'Specialized academic curriculum guided by Ustadha Abeer Gad');

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-gold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{track.badgeAr ? (isRtl ? track.badgeAr : track.badgeEn) : (isRtl ? 'المسار التعليمي' : 'Academic Track')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed max-w-2xl mx-auto">
            {pageSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-navy-600">
            {track.durationAr && (
              <span className="px-3 py-1 rounded-full bg-surface-muted border border-surface-borderSubtle">
                ⏱ {isRtl ? track.durationAr : track.durationEn}
              </span>
            )}
            {track.formatAr && (
              <span className="px-3 py-1 rounded-full bg-surface-muted border border-surface-borderSubtle">
                💻 {isRtl ? track.formatAr : track.formatEn}
              </span>
            )}
            {(track.sanadAr || track.sanadEn) && (
              <span className="px-3 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-800">
                📜 {isRtl ? (track.sanadAr || 'مؤهل لإجازة بالسند') : (track.sanadEn || 'Sanad Eligible')}
              </span>
            )}
          </div>
        </div>

        {/* Track Items / Units Grid */}
        <TrackUnitsGrid
          track={track}
          trackSlug={slug}
          lang={lang}
          courses={courses}
        />

        {/* CTA Card */}
        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-900 text-white text-center sm:text-start flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card-hover">
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-white">
              {isRtl ? 'هل ترغب في الانضمام لهذا المسار؟' : 'Ready to Join This Academic Track?'}
            </h3>
            <p className="text-xs sm:text-sm text-brand-100 max-w-lg">
              {isRtl
                ? 'احجز موعد تقييم واستشارة لمعرفة المستوى ومناسبة الخطة لك.'
                : 'Book an assessment session with Ustadha Abeer Gad to personalize your learning track.'}
            </p>
          </div>

          <Link
            href="/private-lessons"
            className="shrink-0 px-6 py-3 rounded-xl bg-white text-brand-900 font-bold text-sm hover:bg-gold-50 shadow-sm transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-brand-700" />
            <span>{isRtl ? 'احجز موعد تقييم' : 'Book Assessment'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
