import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { GraduationCap } from 'lucide-react';
import { getTrackByHref, getCourses } from '@/lib/data-store';
import { TrackUnitsGrid } from '@/components/tracks/TrackUnitsGrid';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface PageProps {
  params: { lang: string };
}

export default async function TajweedPage({ params: { lang } }: PageProps) {
  setRequestLocale(lang);
  const isRtl = lang === 'ar';

  const track = getTrackByHref('/tajweed');
  const courses = getCourses();
  const fallbackItems = [
    {
      id: 'tajweed-1',
      title: 'Ahkam An-Noon As-Sakinah & Tanween',
      titleAr: 'أحكام النون الساكنة والتنوين',
      desc: 'The four fundamental branches: Izhar Halqi (6 letters), Idgham with/without Ghunnah (Yarmaloon), Iqlab (Baa), and Ikhfa Haqiqi (15 letters).',
      descAr: 'الأحكام الأربعة: الإظهار الحلقي (أخي هاك علماً)، الإدغام بغنة وبغير غنة (يرملون)، الإقلاب، والإخفاء الحقيقي (15 حرفاً).',
      points: ['Izhar Halqi', 'Idgham', 'Iqlab', 'Ikhfa Haqiqi'],
      pointsAr: ['الإظهار الحلقي', 'الإدغام بغنة وبغير غنة', 'الإقلاب عند الباء', 'الإخفاء الحقيقي'],
    },
    {
      id: 'tajweed-2',
      title: 'Ahkam Al-Meem As-Sakinah & Mushaddadah',
      titleAr: 'أحكام الميم الساكنة والنون والميم المشددتين',
      desc: 'Mastering Ikhfa Shafawi, Idgham Muthlayn Sagheer, Izhar Shafawi, and the exact two-count duration of Ghunnah.',
      descAr: 'الإخفاء الشفوي مع الباء، إدغام المتماثلين، الإظهار الشفوي مع باقي الحروف، ومقدار الغنة الحركتين.',
      points: ['Ikhfa Shafawi', 'Idgham Muthlayn', 'Izhar Shafawi', 'Ghunnah Duration'],
      pointsAr: ['الإخفاء الشفوي', 'إدغام المتماثلين الصغير', 'الإظهار الشفوي', 'زمن الغنة الأكمل'],
    },
    {
      id: 'tajweed-3',
      title: 'The Science of Madd (Elongation)',
      titleAr: 'علم المدود وأحكامه',
      desc: 'Natural elongation (Madd Tabee\'i 2 harakat) vs secondary elongation (Muttasil 4-5, Munfasil 2-4-5, Lazim 6 harakat).',
      descAr: 'المد الأصلي الطبيعي، والمد الفرعي بسبب الهمز أو السكون (المتصل، المنفصل، العارض، واللازم 6 حركات).',
      points: ['Madd Tabee\'i', 'Madd Muttasil', 'Madd Munfasil', 'Madd Lazim (Kalimi & Harfi)'],
      pointsAr: ['المد الطبيعي', 'المد المتصل', 'المد المنفصل', 'المد اللازم الكلمي والحرفي'],
    },
    {
      id: 'tajweed-4',
      title: 'Makhaarij & Acoustic Sifaat',
      titleAr: 'مخارج الحروف والصفات الصوتية اللازمة والعارضة',
      desc: 'Precision exploration of Hams vs Jahr, Shiddah vs Rakhawah, Isti\'la (Tafkheem) vs Istifal (Tarqeeq), and Qalqalah.',
      descAr: 'صفات الحروف ذوات الضد والتي لا ضد لها: الهمس، الجهر، الشدة، الرخاوة، الاستعلاء، الاستفال، والقلقلة.',
      points: ['Qalqalah Degrees', 'Heavy Letters (Khussa Daghtin Qiz)', 'Raa & Laam Rules', 'Safir & Tafash-shi'],
      pointsAr: ['مراتب القلقلة', 'حروف الاستعلاء والتفخيم', 'أحكام الراء ولام الجلالة', 'الصفات التي لا ضد لها'],
    },
  ];

  const pageTitle = track ? (isRtl ? track.titleAr : track.titleEn) : (isRtl ? 'أحكام التجويد وضبط القراءة' : 'Mastering Tajweed Rules');
  const pageSubtitle = track?.subtitleAr ? (isRtl ? track.subtitleAr : track.subtitleEn) : (isRtl
    ? 'دراسة متكاملة تجمع بين الدليل النظري من متون التجويد والتطبيق العملي الدقيق بالصوت والصورة.'
    : 'Complete audio-visual breakdowns bridging classical poem treatises with applied oral mastery.');

  return (
    <div className="py-12 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="badge-light">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{track?.badgeAr ? (isRtl ? track.badgeAr : track.badgeEn) : (isRtl ? 'علم التجويد وأصول الأداء' : 'Tajweed Science & Articulation')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-base text-navy-600 leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        <TrackUnitsGrid
          track={track}
          fallbackItems={fallbackItems}
          trackSlug="tajweed"
          lang={lang}
          courses={courses}
        />
      </div>
    </div>
  );
}
