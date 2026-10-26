import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getCourses, getCourseBySlug } from '@/lib/data-store';
import { CourseCurriculumPlayer } from '@/components/courses/CourseCurriculumPlayer';

export const dynamicParams = true;

export function generateStaticParams() {
  const allCourses = getCourses();
  const slugs = allCourses.map((c) => c.slug);
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

interface CourseSlugPageProps {
  params: {
    lang: string;
    slug: string;
  };
}

export default async function CourseSlugPage({
  params: { lang, slug },
}: CourseSlugPageProps) {
  setRequestLocale(lang);

  const course = getCourseBySlug(slug);
  if (!course) {
    notFound();
  }

  return (
    <div className="py-10 lg:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <CourseCurriculumPlayer course={course} currentLocale={lang} />
      </div>
    </div>
  );
}
