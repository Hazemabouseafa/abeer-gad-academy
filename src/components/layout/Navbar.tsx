'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  BookOpen,
  Calendar,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ScrollText,
  Bookmark,
  Layers,
  ChevronDown,
  Briefcase,
  FileText,
} from 'lucide-react';

interface NavbarProps {
  currentLocale: string;
  initialSettings?: {
    announcementEnabled: boolean;
    announcementTextEn: string;
    announcementTextAr: string;
    announcementLink: string;
  };
}

interface DropdownItem {
  href: string;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Navbar({ currentLocale, initialSettings }: NavbarProps) {
  const tNav = useTranslations('nav');
  const tBrand = useTranslations('brand');
  const pathname = usePathname();
  const isRtl = currentLocale === 'ar';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Desktop active dropdown state (null or dropdown key)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile accordion state for submenus
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({
    quran: true,
    arabic: false,
    hub: false,
  });

  const [siteSettings, setSiteSettings] = useState<{
    announcementEnabled: boolean;
    announcementTextEn: string;
    announcementTextAr: string;
    announcementLink: string;
  } | null>(initialSettings || null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSiteSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Dropdown hover handlers with slight delay for silky smooth UX
  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // Structured menu groups
  const menuGroups = [
    {
      key: 'quran',
      label: tNav('quranMenu'),
      items: [
        {
          href: '/quran-reading',
          label: tNav('quranReading'),
          subtitle: isRtl
            ? 'تصحيح التلاوة وأصول القاعدة النورانية'
            : 'Phonetic Articulation & Noorani Qaida',
          icon: ScrollText,
        },
        {
          href: '/quran-memorization',
          label: tNav('quranMemorization'),
          subtitle: isRtl
            ? 'بطاقات متابعة الحفظ والمراجعة المتباعدة'
            : 'Hifz Milestones & Spaced Revision System',
          icon: Bookmark,
        },
        {
          href: '/tajweed',
          label: tNav('tajweed'),
          subtitle: isRtl
            ? 'المخارج والصفات وأحكام المدود بالصوت'
            : 'Theoretical & Applied Audio Rules',
          icon: GraduationCap,
        },
      ],
    },
    {
      key: 'arabic',
      label: tNav('arabicMenu'),
      items: [
        {
          href: '/learn-arabic',
          label: tNav('learnArabic'),
          subtitle: isRtl
            ? 'المسار المتكامل من التأسيس إلى الفصاحة'
            : 'Foundations to Classical Fluency & Nahw',
          icon: BookOpen,
        },
        {
          href: '/specialized-arabic',
          label: tNav('specializedArabic'),
          subtitle: isRtl
            ? 'العلوم الشرعية، الدبلوماسية، والبحث الأكاديمي'
            : 'Islamic Jurisprudence, Diplomacy & Business',
          icon: Briefcase,
        },
      ],
    },
    {
      key: 'hub',
      label: tNav('coursesMenu'),
      items: [
        {
          href: '/courses',
          label: tNav('courses'),
          subtitle: isRtl
            ? 'دورات مرئية مسجلة وتفاعلية بجودة HD'
            : 'Structured High-Definition Video Programs',
          icon: Layers,
        },
        {
          href: '/resources',
          label: tNav('resources'),
          subtitle: isRtl
            ? 'لوحات التجويد وملفات القواعد القابلة للتحميل'
            : 'Downloadable PDF Charts & Audio Practice',
          icon: FileText,
        },
      ],
    },
  ];

  // Hide Navbar completely on Admin pages to keep Admin CMS separate
  if (pathname && (pathname.includes('/admin') || pathname.endsWith('/admin'))) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* Dynamic Announcement Bar controlled via Admin Dashboard */}
      {siteSettings?.announcementEnabled && (
        <div className="bg-brand-900 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-bold flex items-center justify-center gap-2 border-b border-brand-800">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span>{isRtl ? siteSettings.announcementTextAr : siteSettings.announcementTextEn}</span>
          {siteSettings.announcementLink && (
            <Link
              href={siteSettings.announcementLink}
              className="underline text-gold-300 hover:text-white ms-1 font-extrabold"
            >
              {isRtl ? 'احجز الآن ←' : 'Learn more →'}
            </Link>
          )}
        </div>
      )}

      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-card-subtle border-b border-surface-borderSubtle py-2.5'
            : 'bg-[#FDFBF7]/90 backdrop-blur-sm border-b border-surface-borderSubtle py-3.5'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo with Official Emblem */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none shrink-0"
        >
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-icon.png"
              alt="Abeer Gad Academy"
              className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col text-start">
            <span className="font-extrabold text-base sm:text-lg leading-tight tracking-tight text-navy-900 group-hover:text-brand-700 transition-colors">
              {currentLocale === 'ar' ? tBrand('nameNative') : tBrand('name')}
            </span>
            <span className="text-[11px] font-medium text-navy-500 line-clamp-1">
              {tBrand('leadScholarTitle')}
            </span>
          </div>
        </Link>

        {/* Streamlined Desktop Navigation with Elegant Dropdowns */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Direct Home Link */}
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              pathname === '/'
                ? 'bg-brand-50 text-brand-800 font-bold'
                : 'text-navy-700 hover:text-navy-950 hover:bg-surface-muted'
            }`}
          >
            {tNav('home')}
          </Link>

          {/* Grouped Dropdown Menus */}
          {menuGroups.map((group) => {
            const isGroupActive = group.items.some((item) =>
              pathname.startsWith(item.href)
            );
            const isOpen = activeDropdown === group.key;

            return (
              <div
                key={group.key}
                className="relative"
                onMouseEnter={() => handleMouseEnter(group.key)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(isOpen ? null : group.key)
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none ${
                    isGroupActive
                      ? 'bg-brand-50 text-brand-800 font-bold'
                      : isOpen
                      ? 'bg-surface-muted text-navy-950'
                      : 'text-navy-700 hover:text-navy-950 hover:bg-surface-muted'
                  }`}
                  aria-expanded={isOpen}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-700' : 'text-navy-400'
                    }`}
                  />
                </button>

                {/* Dropdown Menu Container */}
                {isOpen && (
                  <div className="absolute top-full start-0 mt-1.5 w-72 sm:w-80 rounded-2xl bg-white border border-surface-border shadow-card-hover p-2 z-50 animate-fadeIn">
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isItemActive = pathname.startsWith(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 ${
                              isItemActive
                                ? 'bg-brand-50/80 text-brand-900 border border-brand-100'
                                : 'hover:bg-background-warm text-navy-800 hover:text-navy-950'
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                                isItemActive
                                  ? 'bg-brand-700 text-white border-brand-800'
                                  : 'bg-surface-muted text-brand-700 border-surface-borderSubtle'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex flex-col text-start">
                              <span className="text-xs sm:text-sm font-bold leading-snug">
                                {item.label}
                              </span>
                              <span className="text-[11px] text-navy-500 mt-0.5 line-clamp-1">
                                {item.subtitle}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Side Actions: Admin, Language Switcher, CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/admin"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-navy-600 hover:text-brand-800 hover:bg-surface-muted transition-colors border border-transparent hover:border-surface-border"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>{tNav('admin')}</span>
          </Link>

          <LanguageSwitcher currentLocale={currentLocale} />

          <Link
            href="/private-lessons"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-700 text-white hover:bg-brand-800 shadow-card-subtle hover:shadow-teal-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Calendar className="w-4 h-4 text-gold-300" />
            <span>{tNav('bookLesson')}</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-surface-border bg-white text-navy-700 hover:bg-surface-muted hover:text-navy-950 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-navy-900" />
            ) : (
              <Menu className="w-5 h-5 text-navy-900" />
            )}
          </button>
        </div>
      </div>
    </div>

      {/* Mobile Drawer Navigation (Accordion Style) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-surface-border shadow-card-hover animate-fadeIn max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto py-4 px-4 space-y-2">
            {/* Mobile Home */}
            <Link
              href="/"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-brand-50 text-brand-800 font-bold'
                  : 'text-navy-800 hover:bg-background-warm'
              }`}
            >
              <Sparkles className="w-4 h-4 text-brand-700" />
              <span>{tNav('home')}</span>
            </Link>

            {/* Mobile Accordion Menu Groups */}
            {menuGroups.map((group) => {
              const isExpanded = mobileExpanded[group.key];
              const isGroupActive = group.items.some((item) =>
                pathname.startsWith(item.href)
              );

              return (
                <div
                  key={group.key}
                  className="rounded-xl border border-surface-borderSubtle overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpanded({
                        ...mobileExpanded,
                        [group.key]: !isExpanded,
                      })
                    }
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-start font-bold text-sm transition-colors ${
                      isGroupActive
                        ? 'bg-brand-50 text-brand-900'
                        : 'bg-background-warm/60 text-navy-800 hover:bg-background-warm'
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-navy-500 transition-transform ${
                        isExpanded ? 'rotate-180 text-brand-700' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="p-2 space-y-1 bg-white">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isItemActive = pathname.startsWith(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              isItemActive
                                ? 'bg-brand-50 text-brand-800 font-bold'
                                : 'text-navy-700 hover:bg-surface-muted'
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${
                                isItemActive ? 'text-brand-700' : 'text-navy-400'
                              }`}
                            />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-3 border-t border-surface-borderSubtle flex flex-col gap-2">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-navy-600 bg-background-warm"
              >
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>{tNav('admin')}</span>
              </Link>

              <Link
                href="/private-lessons"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-brand-700 text-white shadow-card-subtle"
              >
                <Calendar className="w-4 h-4 text-gold-300" />
                <span>{tNav('bookLesson')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
