import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import {
  FileText,
  Download,
  BookOpen,
  Headphones,
  CheckCircle2,
  Sparkles,
  ArrowDownToLine,
  Lock,
} from 'lucide-react';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface ResourceItem {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: 'TAJWEED_CHART' | 'ARABIC_GRAMMAR' | 'VOCABULARY_SHEET' | 'AUDIO_PRACTICE' | 'WORKBOOK';
  categoryLabel: string;
  categoryLabelAr: string;
  fileSizeMb: number;
  fileType: string;
  isPremium: boolean;
  downloadCount: number;
}

const resourcesData: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Comprehensive Tajweed Rules & Articulation Chart',
    titleAr: 'لوحة أحكام التجويد الشاملة ومخارج الحروف',
    description: 'High-resolution full color poster showing letter origins (Makhaarij), Noon Sakinah, and Madd branches.',
    descriptionAr: 'لوحة ملونة عالية الدقة توضح مخارج الحروف وأحكام النون الساكنة والمدود مع الأمثلة القرآنية.',
    category: 'TAJWEED_CHART',
    categoryLabel: 'Tajweed Chart',
    categoryLabelAr: 'لوحات التجويد',
    fileSizeMb: 4.2,
    fileType: 'PDF',
    isPremium: false,
    downloadCount: 3820,
  },
  {
    id: 'res-2',
    title: 'Classical Arabic Grammar (Nahw) Quick Reference Table',
    titleAr: 'جدول الإعراب وقواعد النحو المبسط لطلاب الفصحى',
    description: 'Condensed 8-page cheatsheet detailing noun cases (Marfoo\', Mansoob, Majroor) and verb conjugations.',
    descriptionAr: 'ملزمة ميسرة من 8 صفحات توجز علامات الإعراب وحالات الرفع والنصب والجر وتصريف الأفعال.',
    category: 'ARABIC_GRAMMAR',
    categoryLabel: 'Arabic Grammar',
    categoryLabelAr: 'قواعد النحو',
    fileSizeMb: 2.8,
    fileType: 'PDF',
    isPremium: false,
    downloadCount: 2490,
  },
  {
    id: 'res-3',
    title: '1,000 Essential Quranic Words & Root Meanings',
    titleAr: 'معجم الـ 1000 كلمة الأكثر تكراراً في القرآن الكريم',
    description: 'Frequency workbook covering 80% of Quranic vocabulary with root analysis and example Ayahs.',
    descriptionAr: 'كراسة الكلمات الأكثر شيوعاً والتي تمثل 80% من ألفاظ التنزيل الحكيم مع الأمثلة وتحليل الجذور.',
    category: 'VOCABULARY_SHEET',
    categoryLabel: 'Vocabulary Sheet',
    categoryLabelAr: 'المفردات القرآنية',
    fileSizeMb: 6.5,
    fileType: 'PDF',
    isPremium: false,
    downloadCount: 4100,
  },
  {
    id: 'res-4',
    title: 'Letter Articulation Audio Drills (High-Definition MP3)',
    titleAr: 'تسجيلات صوتية نموذجية لنطق الحروف والصفات',
    description: 'Studio-recorded audio files by Ustadha Abeer demonstrating subtle differences in heavy and light letters.',
    descriptionAr: 'ملفات صوتية مسجلة بصوت الأستاذة عبير لتوضيح مخارج الحروف وتدريب الأذن على الترقيق والتفخيم.',
    category: 'AUDIO_PRACTICE',
    categoryLabel: 'Audio Practice',
    categoryLabelAr: 'تسجيلات صوتية',
    fileSizeMb: 18.4,
    fileType: 'ZIP / MP3',
    isPremium: true,
    downloadCount: 1850,
  },
  {
    id: 'res-5',
    title: 'Noorani Qaida Visual Guide with Pronunciation Symbols',
    titleAr: 'دليل القاعدة النورانية الملون لتصحيح التلاوة',
    description: 'Complete pedagogical guide for beginners with color-coded phonetics and graduated exercises.',
    descriptionAr: 'الدليل المصور الشامل للمبتدئين في قراءة القرآن بالترميز اللوني وضبط الحركات.',
    category: 'WORKBOOK',
    categoryLabel: 'Workbook',
    categoryLabelAr: 'كراسات تدريبية',
    fileSizeMb: 8.1,
    fileType: 'PDF',
    isPremium: false,
    downloadCount: 5200,
  },
];

interface ResourcesPageProps {
  params: {
    lang: string;
  };
}

export default async function ResourcesPage({ params: { lang } }: ResourcesPageProps) {
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: 'resources' });
  const isRtl = lang === 'ar';

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
          {resourcesData.map((res) => {
            const title = isRtl ? res.titleAr : res.title;
            const description = isRtl ? res.descriptionAr : res.description;
            const categoryLabel = isRtl ? res.categoryLabelAr : res.categoryLabel;

            return (
              <div
                key={res.id}
                className="academy-card p-6 flex flex-col justify-between hover:border-brand-400"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                      {res.category === 'AUDIO_PRACTICE' ? (
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
                      {categoryLabel}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-navy-900 line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-navy-600 mt-2 line-clamp-3 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-surface-borderSubtle flex items-center justify-between text-xs text-navy-500">
                    <span>
                      {t('fileSize')}: <strong className="text-navy-800">{res.fileSizeMb} MB</strong>
                    </span>
                    <span>
                      Format: <strong className="text-navy-800">{res.fileType}</strong>
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-4">
                  <a
                    href="#download"
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-brand-700 hover:bg-brand-800 text-white flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <ArrowDownToLine className="w-4 h-4 text-gold-300" />
                    <span>{t('downloadPdf')}</span>
                  </a>
                  <span className="text-[11px] text-center text-navy-500 block mt-2">
                    Downloaded {res.downloadCount.toLocaleString()} times
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
