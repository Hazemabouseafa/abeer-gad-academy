// ==============================================================================
// Shehnawi (شحناوي) Client-Safe Constants & Types
// Pure constants and formatting functions safe for both Server and Client Components
// ==============================================================================

export interface WalletProviderOption {
  id: string;
  nameAr: string;
  nameEn: string;
  badge: string;
  color: string;
  descriptionAr: string;
  descriptionEn: string;
}

export const SUPPORTED_WALLETS: WalletProviderOption[] = [
  {
    id: 'VODAFONE_CASH',
    nameAr: 'فودافون كاش',
    nameEn: 'Vodafone Cash',
    badge: 'كاش 010',
    color: 'bg-red-600 text-white border-red-700',
    descriptionAr: 'تحويل مباشر لمحفظة فودافون كاش عبر كود #7*9*',
    descriptionEn: 'Direct transfer to Vodafone Cash wallet via *9*7#',
  },
  {
    id: 'INSTAPAY',
    nameAr: 'إنستاباي (InstaPay IPN)',
    nameEn: 'InstaPay (IPN Egypt)',
    badge: 'لحظي IPN',
    color: 'bg-purple-700 text-white border-purple-800',
    descriptionAr: 'تحويل فوري لحظي من أي بنك أو محفظة عبر تطبيق إنستاباي',
    descriptionEn: 'Instant real-time transfer from any Egyptian bank/wallet via InstaPay',
  },
  {
    id: 'ORANGE_CASH',
    nameAr: 'أورنج كاش',
    nameEn: 'Orange Cash',
    badge: 'كاش 012',
    color: 'bg-orange-600 text-white border-orange-700',
    descriptionAr: 'تحويل مباشر لمحفظة أورنج كاش عبر كود #115#',
    descriptionEn: 'Direct transfer to Orange Cash wallet via #115#',
  },
  {
    id: 'ETISALAT_CASH',
    nameAr: 'اتصالات كاش',
    nameEn: 'Etisalat Cash',
    badge: 'كاش 011',
    color: 'bg-emerald-600 text-white border-emerald-700',
    descriptionAr: 'تحويل مباشر لمحفظة اتصالات كاش عبر كود #777*',
    descriptionEn: 'Direct transfer to Etisalat Cash wallet via *777#',
  },
  {
    id: 'WE_PAY',
    nameAr: 'وي باي (WE Pay)',
    nameEn: 'WE Pay',
    badge: 'كاش 015',
    color: 'bg-indigo-700 text-white border-indigo-800',
    descriptionAr: 'تحويل مباشر لمحفظة WE Pay عبر تطبيق وي باي أو كود #322*',
    descriptionEn: 'Direct transfer to WE Pay wallet via app or #322*',
  },
  {
    id: 'SMART_WALLET',
    nameAr: 'محفظة بنكية ذكية',
    nameEn: 'Smart Bank Wallet',
    badge: 'بنوك مصر',
    color: 'bg-cyan-700 text-white border-cyan-800',
    descriptionAr: 'المحافظ الإلكترونية للبنوك المصرية (الأهلي، مصر، CIB، الإسكندرية)',
    descriptionEn: 'Egyptian smart bank wallets (NBE Phone Cash, BM Wallet, CIB, AlexBank)',
  },
];

/**
 * Format Egyptian Pounds nicely
 */
export function formatEgp(amountEgp: number, locale: 'ar' | 'en' = 'ar'): string {
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(amountEgp);

  return locale === 'ar' ? `${formatted} ج.م` : `${formatted} EGP`;
}
