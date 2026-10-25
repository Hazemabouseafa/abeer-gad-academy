import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { GraduationCap, Play, FileText, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface PageProps {
  params: { lang: string };
}

export default async function TajweedPage({ params: { lang } }: PageProps) {
  setRequestLocale(lang);
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const tajweedRules = [
    {
      title: 'Ahkam An-Noon As-Sakinah & Tanween',
      titleAr: 'أحكام النون الساكنة والتنوين',
      desc: 'The four fundamental branches: Izhar Halqi (6 letters), Idgham with/without Ghunnah (Yarmaloon), Iqlab (Baa), and Ikhfa Haqiqi (15 letters).',
      descAr: 'الأحكام الأربعة: الإظهار الحلقي (أخي هاك علماً)، الإدغام بغنة وبغير غنة (يرملون)، الإقلاب، والإخفاء الحقيقي (15 حرفاً).',
      rules: ['Izhar Halqi', 'Idgham', 'Iqlab', 'Ikhfa Haqiqi'],
      rulesAr: ['الإظهار الحلقي', 'الإدغام بغنة وبغير غنة', 'الإقلاب عند الباء', 'الإخفاء الحقيقي'],
    },
    {
      title: 'Ahkam Al-Meem As-Sakinah & Mushaddadah',
      titleAr: 'أحكام الميم الساكنة والنون والميم المشددتين',
      desc: 'Mastering Ikhfa Shafawi, Idgham Muthlayn Sagheer, Izhar Shafawi, and the exact two-count duration of Ghunnah.',
      descAr: 'الإخفاء الشفوي مع الباء، إدغام المتماثلين، الإظهار الشفوي مع باقي الحروف، ومقدار الغنة الحركتين.',
      rules: ['Ikhfa Shafawi', 'Idgham Muthlayn', 'Izhar Shafawi', 'Ghunnah Duration'],
      rulesAr: ['الإخفاء الشفوي', 'إدغام المتماثلين الصغير', 'الإظهار الشفوي', 'زمن الغنة الأكمل'],
    },
    {
      title: 'The Science of Madd (Elongation)',
      titleAr: 'علم المدود وأحكامه',
      desc: 'Natural elongation (Madd Tabee\'i 2 harakat) vs secondary elongation (Muttasil 4-5, Munfasil 2-4-5, Lazim 6 harakat).',
      descAr: 'المد الأصلي الطبيعي، والمد الفرعي بسبب الهمز أو السكون (المتصل، المنفصل، العارض، واللازم 6 حركات).',
      rules: ['Madd Tabee\'i', 'Madd Muttasil', 'Madd Munfasil', 'Madd Lazim (Kalimi & Harfi)'],
      rulesAr: ['المد الطبيعي', 'المد المتصل', 'المد المنفصل', 'المد اللازم الكلمي والحرفي'],
    },
    {
      title: 'Makhaarij & Acoustic Sifaat',
      titleAr: 'مخارج الحروف والصفات الصوتية اللازمة والعارضة',
      desc: 'Precision exploration of Hams vs Jahr, Shiddah vs Rakhawah, Isti\'la (Tafkheem) vs Istifal (Tarqeeq), and Qalqalah.',
      descAr: 'صفات الحروف ذوات الضد والتي لا ضد لها: الهمس، الجهر، الشدة، الرخاوة، الاستعلاء، الاستفال، والقلقلة.',
      rules: ['Qalqalah Degrees', 'Heavy Letters (Khussa Daghtin Qiz)', 'Raa & Laam Rules', 'Safir & Tafash-shi'],
      rulesAr: ['مراتب القلقلة', 'حروف الاستعلاء والتفخيم', 'أحكام الراء ولام الجلالة', 'الصفات التي لا ضد لها'],
    },
  ];

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-light">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{isRtl ? 'علم التجويد وأصول الأداء' : 'Tajweed Science & Articulation'}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {isRtl ? 'أحكام التجويد وضبط القراءة' : 'Mastering Tajweed Rules'}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {isRtl
              ? 'دراسة متكاملة تجمع بين الدليل النظري من متون التجويد والتطبيق العملي الدقيق بالصوت والصورة.'
              : 'Complete audio-visual breakdowns bridging classical poem treatises with applied oral mastery.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {tajweedRules.map((item, idx) => {
            const rulesList = isRtl ? item.rulesAr : item.rules;
            return (
              <div
                key={idx}
                className="academy-card p-6 sm:p-8 flex flex-col justify-between hover:border-brand-400 group"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                    <GraduationCap className="w-5 h-5 text-brand-700" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand-800 transition-colors">
                    {isRtl ? item.titleAr : item.title}
                  </h3>
                  <p className="text-sm text-navy-600 leading-relaxed">
                    {isRtl ? item.descAr : item.desc}
                  </p>

                  <div className="pt-3 border-t border-surface-borderSubtle grid grid-cols-2 gap-2">
                    {rulesList.map((rule, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center gap-1.5 text-xs text-navy-700 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-surface-borderSubtle flex items-center justify-between">
                  <Link
                    href="/resources"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تحميل جدول الأحكام PDF' : 'Download Chart PDF'}</span>
                  </Link>

                  <Link
                    href="/courses/tajweed-and-makharij-masterclass"
                    className="inline-flex items-center gap-1 text-xs font-bold text-navy-800 hover:text-brand-800"
                  >
                    <span>{isRtl ? 'الدورة التدريبية' : 'View Course'}</span>
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
