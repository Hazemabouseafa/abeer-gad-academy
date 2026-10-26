import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { BookOpen, CheckCircle2, ArrowRight, ArrowLeft, Calendar, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTrackByHref, getTracks } from '@/lib/data-store';
import { notFound } from 'next/navigation';

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
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const tracks = getTracks();
  const track = tracks.find(
    (t) =>
      t.href === `/tracks/${slug}` ||
      t.href === `/${slug}` ||
      t.id === slug ||
      t.id.endsWith(slug)
  );

  if (!track) {
    // If not found, check if there's any track matching
    notFound();
  }

  const items = track.items || [];
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

        {/* Track Items / Stages */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
            {items.map((item, idx) => {
              const pointsList = isRtl ? item.pointsAr : item.points;
              return (
                <div
                  key={item.id || idx}
                  className="academy-card p-6 sm:p-8 flex flex-col justify-between hover:border-brand-400 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {item.level && (
                        <span className="badge-gold text-xs">
                          {isRtl ? item.levelAr : item.level}
                        </span>
                      )}
                      {(item.duration || item.lessonsCount) && (
                        <span className="text-xs text-navy-500 font-semibold font-mono">
                          {item.duration && (isRtl ? item.durationAr : item.duration)}
                          {item.lessonsCount ? ` • ${item.lessonsCount} ${isRtl ? 'درساً' : 'Lessons'}` : ''}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand-800 transition-colors">
                      {isRtl ? item.titleAr : item.title}
                    </h3>
                    <p className="text-sm text-navy-600 leading-relaxed">
                      {isRtl ? item.descAr : item.desc}
                    </p>

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

                  <div className="pt-6 mt-4 border-t border-surface-borderSubtle flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-700">
                      {isRtl ? 'ضمن خطة المسار' : 'Curriculum Stage'}
                    </span>
                    <Link
                      href="/private-lessons"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-brand-800 transition-colors"
                    >
                      <span>{isRtl ? 'حجز جلسة للمسار' : 'Book Session'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 max-w-md mx-auto text-navy-500 text-sm">
            {isRtl ? 'سيتم إضافة مراحل ووحدات هذا المسار قريباً.' : 'Track stages and modules will be added soon.'}
          </div>
        )}

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
