import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface AdminPageProps {
  params: { lang: string };
}

export default function AdminPage({ params: { lang } }: AdminPageProps) {
  setRequestLocale(lang);

  return <AdminDashboardClient currentLocale={lang} />;
}
