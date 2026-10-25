'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter, locales, localeNames, type Locale } from '@/i18n/routing';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLocale = (locales.includes(currentLocale as Locale)
    ? currentLocale
    : 'en') as Locale;
  const activeInfo = localeNames[activeLocale];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectLocale = (nextLocale: Locale) => {
    setIsOpen(false);
    if (nextLocale === activeLocale) return;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="relative inline-block text-start" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-surface-border bg-white text-navy-800 text-sm font-medium hover:border-brand-500 hover:text-brand-700 hover:shadow-card-subtle transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <span className="text-base leading-none">{activeInfo.flag}</span>
        <span className="hidden sm:inline-block font-medium">
          {activeInfo.nativeName}
        </span>
        <span className="sm:hidden font-medium uppercase text-xs">
          {activeLocale}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-navy-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brand-700' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-56 rounded-xl bg-white border border-surface-border shadow-card-hover py-1.5 z-50 animate-fadeIn">
          <div className="px-3 py-1.5 text-xs font-semibold text-navy-500 uppercase tracking-wider border-b border-surface-borderSubtle">
            Select Language / اختر اللغة
          </div>
          <div className="py-1">
            {locales.map((loc) => {
              const info = localeNames[loc];
              const isSelected = loc === activeLocale;
              return (
                <button
                  key={loc}
                  onClick={() => handleSelectLocale(loc)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-start transition-colors ${
                    isSelected
                      ? 'bg-brand-50 text-brand-800 font-semibold'
                      : 'text-navy-700 hover:bg-background-warm hover:text-navy-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{info.flag}</span>
                    <div className="flex flex-col text-start">
                      <span className="font-medium">{info.nativeName}</span>
                      <span className="text-xs text-navy-500">{info.label}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-brand-700 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
