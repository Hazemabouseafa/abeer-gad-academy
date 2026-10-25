import type { Metadata, Viewport } from 'next';
import { Inter, Cairo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, isRtlLocale, type Locale } from '@/i18n/routing';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsAppWidget } from '@/components/common/FloatingWhatsAppWidget';
import { GoogleTranslateBar } from '@/components/common/GoogleTranslateBar';
import { getSiteSettings } from '@/lib/data-store';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ABEER GAD Academy | أكاديمية عبير جاد',
  description:
    'Excellence in Arabic Language, Quran Reading, and Quran Memorization with authentic scholarly guidance by Ustadha Abeer Gad.',
  keywords: [
    'Learn Arabic',
    'Quran Reading',
    'Quran Memorization',
    'Tajweed Rules',
    'Ustadha Abeer Gad',
    'أكاديمية عبير جاد',
    'حفظ القرآن',
    'تعليم العربية',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

export default async function RootLayout({
  children,
  params: { lang },
}: RootLayoutProps) {
  // Validate that the incoming `lang` parameter is a valid locale
  if (!locales.includes(lang as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(lang);

  // Providing all messages to the client
  const messages = await getMessages();
  const dir = isRtlLocale(lang) ? 'rtl' : 'ltr';

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${inter.variable} ${cairo.variable} light`}
      style={{ colorScheme: 'light' }}
    >
      <body className="min-h-screen bg-[#FDFBF7] text-navy-900 antialiased selection:bg-brand-100 selection:text-brand-900">
        <NextIntlClientProvider messages={messages} locale={lang}>
          <div className="flex min-h-screen flex-col bg-[#FDFBF7]">
            <GoogleTranslateBar currentLocale={lang} />
            <Navbar currentLocale={lang} initialSettings={getSiteSettings()} />
            <div className="flex-1">
              {children}
            </div>
            <FloatingWhatsAppWidget
              currentLocale={lang}
              initialWhatsappNumber={getSiteSettings().whatsappNumber}
            />
            <Footer currentLocale={lang} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
