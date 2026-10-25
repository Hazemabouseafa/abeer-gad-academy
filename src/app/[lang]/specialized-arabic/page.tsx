import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { Briefcase, Landmark, BookOpen, Scroll, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

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

  const tracks = [
    {
      title: 'Arabic for Islamic Jurisprudence & Usul',
      titleAr: 'لغة الفقه والعلوم الشرعية وأصولها',
      desc: 'Terminology of classical Fuqaha, legal maxims (Qawa\'id Fiqhiyyah), Hadith gradings, and Quranic exegesis syntax.',
      descAr: 'مصطلحات الفقهاء والقواعد الفقهية وتحليل ألفاظ نصوص السنة الشريفة ودلالات الألفاظ الأصولية.',
      icon: Scroll,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Arabic for Diplomacy & International Affairs',
      titleAr: 'العربية الدبلوماسية والشؤون الدولية',
      desc: 'High-register geopolitical rhetoric, diplomatic communiques, UN resolution formats, and treaty linguistics.',
      descAr: 'المصطلحات السياسية والدبلوماسية، وتحليل الخطابات الرسمية، وصياغة البيانات والاتفاقيات الدولية.',
      icon: Landmark,
      color: 'bg-brand-50 text-brand-700 border-brand-200',
    },
    {
      title: 'Arabic for Business & Islamic Finance',
      titleAr: 'العربية للأعمال والمعاملات المالية',
      desc: 'Commercial correspondence, corporate arbitration contracts, banking terminology, and Islamic financial instruments (Sukuk, Murabaha).',
      descAr: 'المراسلات التجارية، عقود الشركات، التحكيم التجاري، ومصطلحات الصيرفة الإسلامية وعقود المرابحة والمضاربة.',
      icon: Briefcase,
      color: 'bg-gold-50 text-gold-700 border-gold-200',
    },
    {
      title: 'Academic Research & Manuscript Editing (Tahqeeq)',
      titleAr: 'البحث الأكاديمي وتحقيق المخطوطات',
      desc: 'Paleography, reading handwritten Arabic manuscripts, critical apparatus creation, and scholarly publishing conventions.',
      descAr: 'قراءة خطوط المخطوطات القديمة، وأصول التحقيق والتوثيق، واستخراج الفروق وصياغة الهوامش العلمية.',
      icon: BookOpen,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  ];

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-gold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{isRtl ? 'برامج مخصصة للمهنيين والباحثين' : 'Professional & Academic Specialization'}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {isRtl ? 'العربية لأغراض خاصة' : 'Arabic for Specific Purposes'}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {isRtl
              ? 'مناهج مصممة خصيصاً للباحثين الأكاديميين، والدبلوماسيين، ورجال الأعمال، وطلاب العلوم الإسلامية.'
              : 'Targeted curricula tailored for academic scholars, diplomats, international lawyers, and researchers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {tracks.map((track, idx) => {
            const Icon = track.icon;
            return (
              <div
                key={idx}
                className="academy-card p-6 sm:p-8 flex flex-col justify-between hover:border-brand-400 group"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl ${track.color} border flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand-800 transition-colors">
                    {isRtl ? track.titleAr : track.title}
                  </h3>
                  <p className="text-sm text-navy-600 leading-relaxed">
                    {isRtl ? track.descAr : track.desc}
                  </p>
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
