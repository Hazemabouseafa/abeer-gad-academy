// ==============================================================================
// Time-Based Slot Pricing Helper for ABEER GAD Academy
// Day & Night slot periods are fully customizable by the Admin
// ==============================================================================

export interface SlotPricingSettings {
  dayPrice: number;        // Default: 45 ($ USD)
  nightPrice: number;      // Default: 60 ($ USD)
  dayStartHour: number;    // Default: 10 (10:00 AM, 0..23)
  dayEndHour: number;      // Default: 22 (10:00 PM, 0..23)
  currency: string;        // Default: 'USD'
  autoApply: boolean;      // Default: true
}

export const DEFAULT_SLOT_PRICING: SlotPricingSettings = {
  dayPrice: 45,
  nightPrice: 60,
  dayStartHour: 10,
  dayEndHour: 22,
  currency: 'USD',
  autoApply: true,
};

/**
 * Format a 24-hour integer (0..23) into 12-hour AM/PM string with localization
 */
export function formatHour12(hour: number, locale: 'ar' | 'en' = 'en'): string {
  const normalizedHour = ((hour % 24) + 24) % 24;
  const isPm = normalizedHour >= 12;
  let h12 = normalizedHour % 12;
  if (h12 === 0) h12 = 12;

  const hStr = h12.toString().padStart(2, '0');
  if (locale === 'ar') {
    return `${hStr}:00 ${isPm ? 'م' : 'ص'}`;
  }
  return `${hStr}:00 ${isPm ? 'PM' : 'AM'}`;
}

/**
 * Robust parser extracting the 24-hour hour integer (0..23)
 * Handles:
 * - "10:00 AM", "10:00 AM UTC", "09:30 PM", "11:00 PM UTC"
 * - "14:00", "22:00", "09:15"
 */
export function parseHourFromTimeString(timeStr: string): number {
  if (!timeStr) return 12;
  const clean = timeStr.trim().toUpperCase();

  // 12-hour AM/PM: e.g. "10:00 AM", "09:30 PM UTC"
  const ampmMatch = clean.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (ampmMatch) {
    let hour = parseInt(ampmMatch[1], 10);
    const period = ampmMatch[3].toUpperCase();
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return ((hour % 24) + 24) % 24;
  }

  // 24-hour format: e.g. "14:30", "22:00"
  const match24 = clean.match(/(\d{1,2}):(\d{2})/);
  if (match24) {
    return ((parseInt(match24[1], 10) % 24) + 24) % 24;
  }

  // Fallback to first integer
  const numMatch = clean.match(/\d{1,2}/);
  if (numMatch) {
    return ((parseInt(numMatch[0], 10) % 24) + 24) % 24;
  }

  return 12;
}

/**
 * Checks if the given time string falls in daytime window
 */
export function isDayTimeSlot(
  timeStr: string,
  dayStartHour = 10,
  dayEndHour = 22
): boolean {
  const hour = parseHourFromTimeString(timeStr);
  if (dayStartHour === dayEndHour) return true;
  if (dayStartHour < dayEndHour) {
    return hour >= dayStartHour && hour < dayEndHour;
  }
  // Spanning midnight
  return hour >= dayStartHour || hour < dayEndHour;
}

/**
 * Get period window details and duration in hours
 */
export function getPeriodWindows(pricing: SlotPricingSettings = DEFAULT_SLOT_PRICING) {
  const startHour = pricing?.dayStartHour ?? 10;
  const endHour = pricing?.dayEndHour ?? 22;

  let dayHours = endHour >= startHour ? endHour - startHour : 24 - startHour + endHour;
  if (dayHours <= 0) dayHours = 12;
  const nightHours = 24 - dayHours;

  const dayStartAr = formatHour12(startHour, 'ar');
  const dayEndAr = formatHour12(endHour, 'ar');
  const dayStartEn = formatHour12(startHour, 'en');
  const dayEndEn = formatHour12(endHour, 'en');

  return {
    startHour,
    endHour,
    dayHours,
    nightHours,
    dayWindowAr: `${dayStartAr} - ${dayEndAr}`,
    dayWindowEn: `${dayStartEn} - ${dayEndEn}`,
    nightWindowAr: `${dayEndAr} - ${dayStartAr}`,
    nightWindowEn: `${dayEndEn} - ${dayStartEn}`,
  };
}

/**
 * Returns calculated price, period type, and dynamic bilingual labels
 */
export function calculateSlotPrice(
  timeStr: string,
  pricing: SlotPricingSettings = DEFAULT_SLOT_PRICING
): {
  price: number;
  isDay: boolean;
  periodType: 'DAY' | 'NIGHT';
  periodLabelAr: string;
  periodLabelEn: string;
  icon: string;
  windowLabelAr: string;
  windowLabelEn: string;
} {
  const startHour = pricing?.dayStartHour ?? 10;
  const endHour = pricing?.dayEndHour ?? 22;
  const isDay = isDayTimeSlot(timeStr, startHour, endHour);

  const dayPrice = typeof pricing?.dayPrice === 'number' && pricing.dayPrice >= 0 ? pricing.dayPrice : 45;
  const nightPrice = typeof pricing?.nightPrice === 'number' && pricing.nightPrice >= 0 ? pricing.nightPrice : 60;

  const windows = getPeriodWindows(pricing);
  const activeWindowAr = isDay ? windows.dayWindowAr : windows.nightWindowAr;
  const activeWindowEn = isDay ? windows.dayWindowEn : windows.nightWindowEn;

  return {
    price: isDay ? dayPrice : nightPrice,
    isDay,
    periodType: isDay ? 'DAY' : 'NIGHT',
    periodLabelAr: isDay
      ? `فترة نهارية (${activeWindowAr})`
      : `فترة مسائية/ليلية (${activeWindowAr})`,
    periodLabelEn: isDay
      ? `Daytime (${activeWindowEn})`
      : `Nighttime (${activeWindowEn})`,
    icon: isDay ? '☀️' : '🌙',
    windowLabelAr: activeWindowAr,
    windowLabelEn: activeWindowEn,
  };
}

/**
 * Generate hourly slot options for the daytime window
 */
export function generateDayTimeSlots(dayStartHour = 10, dayEndHour = 22): string[] {
  const slots: string[] = [];
  let curr = dayStartHour;
  let count = 0;
  while (curr !== dayEndHour && count < 24) {
    slots.push(formatHour12(curr, 'en'));
    curr = (curr + 1) % 24;
    count++;
  }
  return slots.length > 0 ? slots : ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'];
}

/**
 * Generate hourly slot options for the nighttime window
 */
export function generateNightTimeSlots(dayStartHour = 10, dayEndHour = 22): string[] {
  const slots: string[] = [];
  let curr = dayEndHour;
  let count = 0;
  while (curr !== dayStartHour && count < 24) {
    slots.push(formatHour12(curr, 'en'));
    curr = (curr + 1) % 24;
    count++;
  }
  return slots.length > 0 ? slots : ['10:00 PM', '11:00 PM', '12:00 AM', '01:00 AM', '02:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM'];
}
