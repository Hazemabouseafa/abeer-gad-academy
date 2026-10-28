// ==============================================================================
// Sha7nawy Gate - Payment API v2.0 Client-Safe Constants & Types
// Conforms directly to the official Sha7nawy Gate API v2.0 Collection
// ==============================================================================

export type Sha7nawyMethod = 'vf_cash' | 'or_cash' | 'et_cash' | 'instapay' | 'we_pay';

export interface WalletProviderOption {
  id: string;
  sha7nawyMethod: Sha7nawyMethod;
  nameAr: string;
  nameEn: string;
  badge: string;
  color: string;
  promptInstructionsAr: string;
  promptInstructionsEn: string;
  ussdCode?: string;
  iconName: string;
}

export const SUPPORTED_WALLETS: WalletProviderOption[] = [
  {
    id: 'VODAFONE_CASH',
    sha7nawyMethod: 'vf_cash',
    nameAr: 'فودافون كاش (Vodafone Cash)',
    nameEn: 'Vodafone Cash',
    badge: 'كاش 010',
    color: 'bg-red-600 text-white border-red-700',
    promptInstructionsAr: 'اطلب #1*9* على هاتفك فوراً (خلال 60 ثانية) واكتب الرقم السري للموافقة على السحب.',
    promptInstructionsEn: 'Dial *9*1# on your phone within 60 seconds and enter your PIN to confirm the payment.',
    ussdCode: '*9*1#',
    iconName: 'vodafone',
  },
  {
    id: 'INSTAPAY',
    sha7nawyMethod: 'instapay',
    nameAr: 'إنستاباي (InstaPay IPN)',
    nameEn: 'InstaPay (IPN Egypt)',
    badge: 'لحظي IPN',
    color: 'bg-purple-700 text-white border-purple-800',
    promptInstructionsAr: 'قم بالتحويل اللحظي المباشر عبر تطبيق إنستاباي إلى العنوان الرسمي للأكاديمية.',
    promptInstructionsEn: 'Perform an instant transfer via the InstaPay app to our official academy handle.',
    iconName: 'instapay',
  },
  {
    id: 'ORANGE_CASH',
    sha7nawyMethod: 'or_cash',
    nameAr: 'أورنج كاش (Orange Cash)',
    nameEn: 'Orange Cash',
    badge: 'كاش 012',
    color: 'bg-orange-600 text-white border-orange-700',
    promptInstructionsAr: 'افتح تطبيق Orange Cash على هاتفك ووافق على طلب السحب والإشعار المعلق.',
    promptInstructionsEn: 'Open the Orange Cash app and approve the pending payment request notification.',
    iconName: 'orange',
  },
  {
    id: 'ETISALAT_CASH',
    sha7nawyMethod: 'et_cash',
    nameAr: 'اتصالات كاش (Etisalat Cash)',
    nameEn: 'Etisalat Cash',
    badge: 'كاش 011',
    color: 'bg-emerald-600 text-white border-emerald-700',
    promptInstructionsAr: 'اطلب #11*777* على هاتفك أو افتح تطبيق e& Money ووافق على طلب الدفع.',
    promptInstructionsEn: 'Dial *777*11# on your phone or approve via the e& Money app.',
    ussdCode: '*777*11#',
    iconName: 'etisalat',
  },
  {
    id: 'WE_PAY',
    sha7nawyMethod: 'we_pay',
    nameAr: 'وي باي (WE Pay)',
    nameEn: 'WE Pay',
    badge: 'كاش 015',
    color: 'bg-indigo-700 text-white border-indigo-800',
    promptInstructionsAr: 'افتح تطبيق WE Pay أو اطلب #322* لتأكيد عملية الخصم.',
    promptInstructionsEn: 'Open the WE Pay app or dial *322# to approve the payment.',
    ussdCode: '*322#',
    iconName: 'we',
  },
];

export const SHA7NAWY_ERROR_CODES: Record<string, { ar: string; en: string }> = {
  'SH-4001': { ar: 'المفتاح غير مصرح به (Unauthorized)', en: 'Invalid API key or unauthorized request' },
  'SH-4002': { ar: 'مفتاح التحقق غير صالح', en: 'Invalid authentication credentials' },
  'SH-4010': { ar: 'حقل order_id أو بيانات إجبارية مفقودة', en: 'Missing required fields (such as order_id)' },
  'SH-4021': { ar: 'رقم هاتف المحفظة غير صحيح (يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقماً)', en: 'Invalid Egyptian wallet phone number' },
  'SH-4022': { ar: 'قيمة المبلغ غير مقبولة (يجب أن تكون أكبر من 2 جنيه مصري)', en: 'Invalid amount (must be greater than 2 EGP)' },
  'SH-5000': { ar: 'خطأ داخلي في خادم بوابة شحناوي', en: 'Sha7nawy internal gateway server error' },
};

/**
 * Format Egyptian Pounds nicely
 */
export function formatEgp(amountEgp: number, locale: 'ar' | 'en' = 'ar'): string {
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(amountEgp);

  return locale === 'ar' ? `${formatted} ج.م` : `${formatted} EGP`;
}
