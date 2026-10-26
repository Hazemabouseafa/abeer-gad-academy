import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { Briefcase, Landmark, BookOpen, Scroll, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTrackByHref } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface PageProps {
  params: { lang: string };
}

export default async function SpecializedArabicPage({ params: { lang } }: PageProps) {
  setRequestLocale(lang);
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const track = getTrackByHref('/specialized-arabic');
  const items = track?.items && track.items.length > 0 ? track.items : [
    {
      id: 'specialized-1',
      title: 'Arabic for Islamic Jurisprudence & Usul',
      titleAr: 'لغة الفقه والعلوم الشرعية وأصولها',
      desc: 'Terminology of classical Fuqaha, legal maxims (Qawa\'id Fiqhiyyah), Hadith gradings, and Quranic exegesis syntax.',
      descAr: 'مصطلحات الفقهاء والقواعد الفقهية وتحليل ألفاظ نصوص السنة الشريفة ودلالات الألفاظ الأصولية.',
      points: ['Fiqh Terminology', 'Legal Maxims (Qawa\'id)', 'Usul Al-Fiqh Syntax'],
      pointsAr: ['مصطلحات الفقهاء المعتمدة', 'القواعد الفقهية والأصولية', 'دلالات الألفاظ الشرعية'],
    },
    {
      id: 'specialized-2',
      title: 'Arabic for Diplomacy & International Affairs',
      titleAr: 'العربية الدبلوماسية والشؤون الدولية',
      desc: 'High-register geopolitical rhetoric, diplomatic communiques, UN resolution formats, and treaty linguistics.',
      descAr: 'المصطلحات السياسية والدبلوماسية، وتحليل الخطابات الرسمية، وصياغة البيانات والاتفاقيات الدولية.',
      points: ['Diplomatic Lexicon', 'Official Speech Analysis', 'Treaty & Accord Drafting'],
      pointsAr: ['المصطلحات الدبلوماسية', 'تحليل الخطابات الرسمية', 'صياغة البيانات والمعاهدات'],
    },
    {
      id: 'specialized-3',
      title: 'Arabic for Business & Islamic Finance',
      titleAr: 'العربية للأعمال والمعاملات المالية',
      desc: 'Commercial correspondence, corporate arbitration contracts, banking terminology, and Islamic financial instruments (Sukuk, Murabaha).',
      descAr: 'المراسلات التجارية، عقود الشركات، التحكيم التجاري، ومصطلحات الصيرفة الإسلامية وعقود المرابحة والمضاربة.',
      points: ['Commercial Contracts', 'Islamic Banking Tools', 'Corporate Arbitration'],
      pointsAr: ['عقود الشركات والتحكيم', 'المعاملات المالية الإسلامية', 'المراسلات التجارية الرسمية'],
    },
    {
      id: 'specialized-4',
      title: 'Academic Research & Manuscript Editing (Tahqeeq)',
      titleAr: 'البحث الأكاديمي وتحقيق المخطوطات',
      desc: 'Paleography, reading handwritten Arabic manuscripts, critical apparatus creation, and scholarly publishing conventions.',
      descAr: 'قراءة خطوط المخطوطات القديمة، وأصول التحقيق والتوثيق، واستخراج الفروق وصياغة الهوامش العلمية.',
      points: ['Manuscript Paleography', 'Scholarly Critical Apparatus', 'Verification & Citation'],
      pointsAr: ['قراءة الخطوط القديمة للمخطوطات', 'أصول التحقيق والتوثيق', 'إعداد النسخ المحققة المعيارية'],
    },
  ];

  const pageTitle = track ? (isRtl ? track.titleAr : track.titleEn) : (isRtl ? 'العربية لأغراض خاصة' : 'Arabic for Specific Purposes');
  const pageSubtitle = track?.subtitleAr ? (isRtl ? track.subtitleAr : track.subtitleEn) : (isRtl
    ? 'مناهج مصممة خصيصاً للباحثين الأكاديميين، والدبلوماسيين، ورجال الأعمال، وطلاب العلوم الإسلامية.'
    : 'Targeted curricula tailored for academic scholars, diplomats, international lawyers, and researchers.');

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-gold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{track?.badgeAr ? (isRtl ? track.badgeAr : track.badgeEn) : (isRtl ? 'برامج مخصصة للمهنيين والباحثين' : 'Professional & Academic Specialization')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {items.map((item, idx) => {
            const pointsList = isRtl ? item.pointsAr : item.points;
            return (
              <div
                key={item.id || idx}
                className="academy-card p-6 sm:p-8 flex flex-col justify-between hover:border-brand-400 group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 border border-gold-200 flex items-center justify-center">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  {item.level && (
                    <span className="badge-gold text-xs">
                      {isRtl ? item.levelAr : item.level}
                    </span>
                  )}
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
                  <span className="text-xs font-semibold text-navy-500">
                    {isRtl ? 'إشراف أكاديمي مباشر' : '1-on-1 Mentorship Available'}
                  </span>
                  <Link
                    href="/private-lessons"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900"
                  >
                    <span>{isRtl ? 'طلب منهج مخصص' : 'Request Consultation'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
