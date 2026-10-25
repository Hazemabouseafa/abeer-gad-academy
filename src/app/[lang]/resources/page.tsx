import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, Link } from '@/i18n/routing';
import {
  FileText,
  Download,
  BookOpen,
  Headphones,
  CheckCircle2,
  Sparkles,
  ArrowDownToLine,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { getResources } from '@/lib/data-store';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface ResourcesPageProps {
  params: {
    lang: string;
  };
}

export default async function ResourcesPage({ params: { lang } }: ResourcesPageProps) {
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: 'resources' });
  const isRtl = lang === 'ar';

  const dynamicResources = getResources();

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-light">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('badge')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {dynamicResources.map((res) => {
            const title = isRtl ? res.titleAr || res.title : res.title;
            const isAudio = res.fileType?.toLowerCase().includes('mp3') || res.category?.toLowerCase().includes('audio');

            return (
              <div
                key={res.id}
                className="academy-card p-6 flex flex-col justify-between hover:border-brand-400 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                      {isAudio ? (
                        <Headphones className="w-5 h-5 text-brand-700" />
                      ) : (
                        <FileText className="w-5 h-5 text-brand-700" />
                      )}
                    </div>
                    {res.isPremium ? (
                      <span className="badge-gold text-xs">
                        <Lock className="w-3 h-3 text-gold-700" />
                        <span>{t('premium')}</span>
                      </span>
                    ) : (
                      <span className="badge-light text-xs">
                        {t('free')}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider block mb-1">
                      {res.category || 'General'}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-navy-900 line-clamp-2 group-hover:text-brand-800 transition-colors">
                      {title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-surface-borderSubtle flex items-center justify-between text-xs text-navy-500">
                    <span>
                      {t('fileSize')}: <strong className="text-navy-800">{res.fileSizeMb || 2.5} MB</strong>
                    </span>
                    <span>
                      Format: <strong className="text-navy-800">{res.fileType || 'PDF'}</strong>
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-4">
                  {res.isPremium ? (
                    <Link
                      href="/courses"
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-navy-900 hover:bg-brand-800 text-white flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5 text-gold-400" />
                      <span>{isRtl ? 'متاح لطلاب الدورات' : 'Included in Courses'}</span>
                    </Link>
                  ) : (
                    <a
                      href={res.fileUrl || '/downloads/resource.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-brand-700 hover:bg-brand-800 text-white flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <ArrowDownToLine className="w-4 h-4 text-gold-300" />
                      <span>{t('downloadPdf')}</span>
                    </a>
                  )}
                  <span className="text-[11px] text-center text-navy-500 block mt-2">
                    {isRtl ? 'تحميل مباشر وسريع' : `Downloaded ${(res.downloads || 0).toLocaleString()} times`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
