// ==============================================================================
// Time-Based Slot Pricing Helper for ABEER GAD Academy
// Day Window: 10:00 AM (10) to 10:00 PM (22)
// Night Window: 10:00 PM (22) to 10:00 AM (10)
// ==============================================================================

export interface SlotPricingSettings {
  dayPrice: number;        // Default: 45 ($ USD)
  nightPrice: number;      // Default: 60 ($ USD)
  dayStartHour: number;    // Default: 10 (10:00 AM)
  dayEndHour: number;      // Default: 22 (10:00 PM)
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
    return hour;
  }

  // 24-hour format: e.g. "14:30", "22:00"
  const match24 = clean.match(/(\d{1,2}):(\d{2})/);
  if (match24) {
    return parseInt(match24[1], 10);
  }

  // Fallback to first integer
  const numMatch = clean.match(/\d{1,2}/);
  if (numMatch) {
    return parseInt(numMatch[0], 10);
  }

  return 12;
}

/**
 * Checks if the given time string falls in daytime (default 10:00 AM - 10:00 PM)
 */
export function isDayTimeSlot(
  timeStr: string,
  dayStartHour = 10,
  dayEndHour = 22
): boolean {
  const hour = parseHourFromTimeString(timeStr);
  return hour >= dayStartHour && hour < dayEndHour;
}

/**
 * Returns calculated price, period type, and bilingual labels
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
} {
  const startHour = pricing?.dayStartHour ?? 10;
  const endHour = pricing?.dayEndHour ?? 22;
  const isDay = isDayTimeSlot(timeStr, startHour, endHour);

  const dayPrice = typeof pricing?.dayPrice === 'number' && pricing.dayPrice >= 0 ? pricing.dayPrice : 45;
  const nightPrice = typeof pricing?.nightPrice === 'number' && pricing.nightPrice >= 0 ? pricing.nightPrice : 60;

  return {
    price: isDay ? dayPrice : nightPrice,
    isDay,
    periodType: isDay ? 'DAY' : 'NIGHT',
    periodLabelAr: isDay ? 'فترة نهارية (10:00 ص - 10:00 م)' : 'فترة مسائية/ليلية (10:00 م - 10:00 ص)',
    periodLabelEn: isDay ? 'Daytime (10:00 AM - 10:00 PM)' : 'Nighttime (10:00 PM - 10:00 AM)',
    icon: isDay ? '☀️' : '🌙',
  };
}
