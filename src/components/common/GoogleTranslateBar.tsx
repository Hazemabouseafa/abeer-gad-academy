'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from '@/i18n/routing';
import { Globe, Languages, RotateCcw, X, Check, Sparkles } from 'lucide-react';

interface GoogleTranslateBarProps {
  currentLocale: string;
}

// Comprehensive international languages with Google Translate codes & flags
const POPULAR_LANGUAGES = [
  { code: 'ar', label: 'العربية', nativeName: 'Arabic', flag: '🇪🇬' },
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', nativeName: 'French', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', nativeName: 'German', flag: '🇩🇪' },
  { code: 'es', label: 'Español', nativeName: 'Spanish', flag: '🇪🇸' },
  { code: 'tr', label: 'Türkçe', nativeName: 'Turkish', flag: '🇹🇷' },
  { code: 'id', label: 'Bahasa Indonesia', nativeName: 'Indonesian', flag: '🇮🇩' },
  { code: 'ur', label: 'اردو', nativeName: 'Urdu', flag: '🇵🇰' },
  { code: 'ru', label: 'Русский', nativeName: 'Russian', flag: '🇷🇺' },
  { code: 'zh-CN', label: '中文 (简体)', nativeName: 'Chinese', flag: '🇨🇳' },
  { code: 'ms', label: 'Bahasa Melayu', nativeName: 'Malay', flag: '🇲🇾' },
  { code: 'fa', label: 'فارسی', nativeName: 'Persian', flag: '🇮🇷' },
  { code: 'bn', label: 'বাংলা', nativeName: 'Bengali', flag: '🇧🇩' },
  { code: 'it', label: 'Italiano', nativeName: 'Italian', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', nativeName: 'Portuguese', flag: '🇵🇹' },
  { code: 'nl', label: 'Nederlands', nativeName: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', label: 'Svenska', nativeName: 'Swedish', flag: '🇸🇪' },
  { code: 'ja', label: '日本語', nativeName: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', nativeName: 'Korean', flag: '🇰🇷' },
  { code: 'hi', label: 'हिन्दी', nativeName: 'Hindi', flag: '🇮🇳' },
  { code: 'sw', label: 'Kiswahili', nativeName: 'Swahili', flag: '🇰🇪' },
  { code: 'so', label: 'Soomaali', nativeName: 'Somali', flag: '🇸🇴' },
  { code: 'sq', label: 'Shqip', nativeName: 'Albanian', flag: '🇦🇱' },
  { code: 'bs', label: 'Bosanski', nativeName: 'Bosnian', flag: '🇧🇦' },
];

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            autoDisplay?: boolean;
            layout?: number;
            includedLanguages?: string;
          },
          elementId: string
        ) => void;
        InlineLayout?: {
          SIMPLE: number;
          HORIZONTAL: number;
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export function GoogleTranslateBar({ currentLocale }: GoogleTranslateBarProps) {
  const pathname = usePathname();
  const isRtl = currentLocale === 'ar';

  const [selectedLang, setSelectedLang] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState<boolean>(false);

  // Check if admin page (never show on admin dashboard)
  const isAdmin = pathname && (pathname.includes('/admin') || pathname.endsWith('/admin'));

  // Read active Google Translate cookie if any
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const match = document.cookie.match(/(^|;\s*)googtrans=([^;]+)/);
    if (match && match[2]) {
      // Format is e.g. /auto/fr or /ar/fr
      const parts = match[2].split('/');
      const code = parts[parts.length - 1];
      if (code && code !== 'auto' && code !== currentLocale) {
        setSelectedLang(code);
      }
    }
  }, [currentLocale]);

  // Load Google Translate script safely
  useEffect(() => {
    if (isAdmin) return;

    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: currentLocale || 'ar',
              autoDisplay: false,
            },
            'google_translate_hidden_element'
          );
          setIsGoogleLoaded(true);
        }
      } catch (e) {
        console.error('Google Translate init error:', e);
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    }
  }, [currentLocale, isAdmin]);

  const handleTranslateChange = (targetLang: string) => {
    if (!targetLang) return;
    setIsTranslating(true);
    setSelectedLang(targetLang);

    // If user selected current native language, reset
    if (targetLang === currentLocale) {
      handleReset();
      return;
    }

    const domain = window.location.hostname;
    // Set googtrans cookie for root and domain
    document.cookie = `googtrans=/auto/${targetLang}; path=/;`;
    document.cookie = `googtrans=/auto/${targetLang}; path=/; domain=${domain};`;
    if (domain.includes('.')) {
      document.cookie = `googtrans=/auto/${targetLang}; path=/; domain=.${domain};`;
    }

    // Trigger on the native Google Translate select element if loaded
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = targetLang;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      setTimeout(() => setIsTranslating(false), 600);
    } else {
      // If select element not ready yet, reload so Google Translate kicks in with the cookie
      window.location.reload();
    }
  };

  const handleReset = () => {
    setIsTranslating(true);
    setSelectedLang('');

    const domain = window.location.hostname;
    // Clear cookies
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    if (domain.includes('.')) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
    }

    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = currentLocale;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    window.location.reload();
  };

  if (isAdmin || isDismissed) {
    return (
      <div id="google_translate_hidden_element" className="hidden" aria-hidden="true" />
    );
  }

  const activeLangObj = POPULAR_LANGUAGES.find((l) => l.code === selectedLang);

  return (
    <>
      {/* Hidden container for Google Translate widget */}
      <div id="google_translate_hidden_element" className="hidden" aria-hidden="true" />

      {/* Top Google Translate Bar */}
      <div
        role="region"
        aria-label="Google Translate Toolbar"
        className="w-full bg-navy-950 text-white border-b border-gold-500/30 text-xs py-2 px-3 sm:px-6 relative z-50 shadow-md transition-all duration-200"
      >
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Google Translate Title & Badge */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-900 border border-gold-400/40 text-gold-300 font-bold">
              <Languages className="w-3.5 h-3.5 text-gold-400" />
              <span className="tracking-wide">Google Translate</span>
            </div>

            <span className="text-slate-200 font-medium hidden md:inline">
              {isRtl
                ? 'الترجمة الفورية التلقائية لأكثر من 50 لغة حول العالم:'
                : 'Instant automatic translation to 50+ languages:'}
            </span>

            {selectedLang && activeLangObj && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>
                  {isRtl ? 'الموقع مترجم إلى:' : 'Translated to:'} {activeLangObj.flag} {activeLangObj.label}
                </span>
              </span>
            )}
          </div>

          {/* Right: Language Selector & Reset Button */}
          <div className="flex items-center gap-2 ms-auto">
            <div className="relative inline-flex items-center">
              <Globe className="w-3.5 h-3.5 text-gold-400 absolute start-2.5 pointer-events-none" />
              <select
                aria-label="اختر لغة الترجمة / Select Translation Language"
                value={selectedLang || currentLocale}
                onChange={(e) => handleTranslateChange(e.target.value)}
                disabled={isTranslating}
                className="bg-navy-900 text-white border border-slate-700 hover:border-gold-400 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 text-xs font-semibold py-1.5 ps-8 pe-6 rounded-lg cursor-pointer transition-colors shadow-inner"
              >
                <option value="" disabled>
                  {isRtl ? '🌐 اختر لغة الترجمة...' : '🌐 Select Language...'}
                </option>
                <optgroup label={isRtl ? 'اللغات المعتمدة للموقع' : 'Platform Native'}>
                  <option value="ar">🇪🇬 العربية (الأصلية / Native)</option>
                  <option value="en">🇬🇧 English (Native)</option>
                </optgroup>
                <optgroup label={isRtl ? 'الترجمة الفورية (Google)' : 'Instant Translation (Google)'}>
                  {POPULAR_LANGUAGES.filter((l) => l.code !== 'ar' && l.code !== 'en').map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.label} ({lang.nativeName})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Reset Button (only shown when translated) */}
            {selectedLang && selectedLang !== currentLocale && (
              <button
                type="button"
                onClick={handleReset}
                title={isRtl ? 'العودة للغة الأصلية' : 'Reset to Original Language'}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-gold-300 hover:text-white border border-slate-700 text-xs font-bold transition-all shadow-sm"
              >
                <RotateCcw className="w-3 h-3 text-gold-400" />
                <span className="hidden sm:inline">{isRtl ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            )}

            {/* Dismiss Bar Button */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              aria-label={isRtl ? 'إخفاء شريط الترجمة' : 'Close translation bar'}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-navy-900 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
