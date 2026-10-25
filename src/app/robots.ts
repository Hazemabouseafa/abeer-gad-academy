import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abeergadacademy.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/*/admin', '/api/', '/uploads/temp/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
