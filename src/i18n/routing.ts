import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'ar',
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
  ar: { label: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇪🇬' },
  en: { label: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
};
