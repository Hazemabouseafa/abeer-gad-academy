import { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { getCourses } from '@/lib/data-store';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abeergadacademy.com';
  const lastModified = new Date();

  const staticPages = [
    '',
    '/courses',
    '/resources',
    '/private-lessons',
    '/learn-arabic',
    '/quran-reading',
    '/quran-memorization',
    '/tajweed',
    '/specialized-arabic',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Add static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  // Add all published courses
  const courses = getCourses().filter((c) => c.isPublished);
  for (const course of courses) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/courses/${course.slug}`,
        lastModified: new Date(course.updatedAt || course.createdAt || lastModified),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  return entries;
}
