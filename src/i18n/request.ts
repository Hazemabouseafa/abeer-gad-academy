import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[lang]` segment
  let locale = await requestLocale;

  // Fallback to default locale if not provided or unsupported
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
