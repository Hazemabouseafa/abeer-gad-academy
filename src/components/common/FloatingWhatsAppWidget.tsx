'use client';

import { useState, useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import { formatTelegramUrl, formatWhatsAppNumber } from '@/lib/utils';

interface FloatingWhatsAppWidgetProps {
  currentLocale: string;
  initialWhatsappNumber?: string;
  initialTelegramLink?: string;
  initialShowWhatsapp?: boolean;
  initialShowTelegram?: boolean;
}

export function FloatingWhatsAppWidget({
  currentLocale,
  initialWhatsappNumber = '+201000000000',
  initialTelegramLink = 'https://t.me/AbeerGadAcademy',
  initialShowWhatsapp = true,
  initialShowTelegram = true,
}: FloatingWhatsAppWidgetProps) {
  const pathname = usePathname();
  const isRtl = currentLocale === 'ar';

  const [whatsappNumber, setWhatsappNumber] = useState(
    formatWhatsAppNumber(initialWhatsappNumber)
  );
  const [telegramLink, setTelegramLink] = useState(initialTelegramLink || '');
  const [showWhatsapp, setShowWhatsapp] = useState(initialShowWhatsapp !== false);
  const [showTelegram, setShowTelegram] = useState(initialShowTelegram !== false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Fetch updated settings from Admin CMS (real-time reflection across deploys & updates)
  useEffect(() => {
    let isMounted = true;
    const syncSettings = () => {
      fetch('/api/admin/settings', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!isMounted || !data?.settings) return;
          const s = data.settings;
          if (typeof s.whatsappNumber === 'string') {
            setWhatsappNumber(s.whatsappNumber.trim() ? formatWhatsAppNumber(s.whatsappNumber) : '');
          }
          if (typeof s.telegramLink === 'string') {
            setTelegramLink(s.telegramLink);
          }
          if (typeof s.showFloatingWhatsapp === 'boolean') {
            setShowWhatsapp(s.showFloatingWhatsapp);
          }
          if (typeof s.showFloatingTelegram === 'boolean') {
            setShowTelegram(s.showFloatingTelegram);
          }
        })
        .catch(() => {});
    };

    syncSettings();
    window.addEventListener('focus', syncSettings);
    return () => {
      isMounted = false;
      window.removeEventListener('focus', syncSettings);
    };
  }, []);

  // Show a welcoming hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Never display floating widget inside Admin Control Panel
  if (pathname && (pathname.includes('/admin') || pathname.endsWith('/admin'))) {
    return null;
  }

  const defaultGreeting = encodeURIComponent(
    isRtl
      ? 'السلام عليكم أستاذة عبير، أود الاستفسار والتسجيل في برامج الأكاديمية.'
      : 'Hello Ustadha Abeer, I would like to inquire and enroll in the academy programs.'
  );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${defaultGreeting}`
    : '';
  const telegramUrl = formatTelegramUrl(telegramLink);

  const isWhatsappVisible = showWhatsapp && Boolean(whatsappUrl);
  const isTelegramVisible = showTelegram && Boolean(telegramUrl);

  // If admin hid both floating icons (or both links are empty), render nothing
  if (!isWhatsappVisible && !isTelegramVisible) {
    return null;
  }

  return (
    <aside
      aria-label={isRtl ? 'قنوات التواصل الفوري' : 'Direct Chat Channels'}
      className="fixed bottom-6 end-6 z-50 flex items-end gap-3 select-none"
    >
      {/* Interactive Speech Bubble Hint */}
      {showTooltip && (
        <div
          className="relative hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white text-navy-950 shadow-2xl border border-surface-border text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-300"
          role="status"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div>
            <span className="block text-navy-900 leading-tight">
              {isRtl ? 'تحدث مباشرة مع الأستاذة عبير جاد' : 'Chat directly with Ustadha Abeer'}
            </span>
            <span className="block text-[10px] text-emerald-600 font-medium">
              {isWhatsappVisible && isTelegramVisible
                ? isRtl
                  ? 'عبر واتساب أو تيليجرام مباشرة'
                  : 'Available on WhatsApp & Telegram'
                : isTelegramVisible
                ? isRtl
                  ? 'متاح الآن عبر تيليجرام'
                  : 'Online on Telegram'
                : isRtl
                ? 'متاح الآن للاستفسارات السريعة'
                : 'Online for quick inquiries'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-navy-400 hover:text-navy-700 ms-1 p-0.5"
            aria-label={isRtl ? 'إغلاق التنبيه' : 'Dismiss'}
          >
            &times;
          </button>
        </div>
      )}

      {/* Floating Stack (Telegram + WhatsApp) */}
      <div className="flex flex-col items-center gap-3">
        {/* Telegram Floating Button */}
        {isTelegramVisible && (
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setShowTooltip(true)}
            title={isRtl ? 'تواصل عبر تيليجرام' : 'Chat on Telegram'}
            className="group relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-[#2AABEE] to-[#229ED9] hover:from-[#229ED9] hover:to-[#1986bd] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sky-400/40"
            aria-label={isRtl ? 'محادثة أو متابعة عبر تيليجرام' : 'Direct Telegram Contact'}
          >
            {/* Hover Pill Label */}
            <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute end-full me-3 whitespace-nowrap px-2.5 py-1 rounded-lg bg-navy-950 text-white text-[11px] font-bold shadow-lg">
              {isRtl ? 'تيليجرام' : 'Telegram'}
            </span>

            {/* Subtle pulsing ring */}
            <span className="absolute -inset-1 rounded-full bg-[#2AABEE] opacity-25 group-hover:opacity-50 animate-ping pointer-events-none" />

            {/* Authentic Telegram Paper-Plane SVG Icon */}
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10 -translate-x-0.5 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </a>
        )}

        {/* WhatsApp Floating Button */}
        {isWhatsappVisible && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setShowTooltip(true)}
            title={isRtl ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
            className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
            aria-label={isRtl ? 'محادثة فورية عبر واتساب' : 'Direct WhatsApp Chat'}
          >
            {/* Hover Pill Label */}
            <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute end-full me-3 whitespace-nowrap px-2.5 py-1 rounded-lg bg-navy-950 text-white text-[11px] font-bold shadow-lg">
              {isRtl ? 'واتساب' : 'WhatsApp'}
            </span>

            {/* Pulsing ring around the button */}
            <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-ping pointer-events-none" />

            {/* Authentic WhatsApp SVG Icon */}
            <svg
              className="w-8 h-8 sm:w-9 sm:h-9 fill-current relative z-10 transition-transform duration-300 group-hover:rotate-12"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>

            {/* Small Online Green Dot */}
            <span className="absolute top-1 end-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm" />
          </a>
        )}
      </div>
    </aside>
  );
}
