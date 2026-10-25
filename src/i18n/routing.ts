import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'ar', 'fr', 'de', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);

/**
 * Returns true if the locale is an RTL language (Arabic).
 */
export function isRtlLocale(locale: string): boolean {
  return locale === 'ar';
}

/**
 * Display names for language switcher
 */
export const localeNames: Record<Locale, { label: string; nativeName: string; dir: 'ltr' | 'rtl'; flag: string }> = {
  en: { label: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
  ar: { label: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇪🇬' },
  fr: { label: 'French', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷' },
  de: { label: 'German', nativeName: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
  zh: { label: 'Chinese', nativeName: '中文', dir: 'ltr', flag: '🇨🇳' },
};
