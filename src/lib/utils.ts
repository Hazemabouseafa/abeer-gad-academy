import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names cleanly
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amounts in USD
 */
export function formatCurrency(amount: number | string, currency = 'USD'): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Format minutes into readable hour/min format
 */
export function formatDuration(minutes: number, locale = 'en'): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Convert Arabic-Indic / Persian numerals to standard ASCII digits (0-9)
 */
export function normalizeDigits(value?: string | null): string {
  if (!value) return '';
  return String(value)
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/**
 * Clean and normalize a phone number for proper LTR display across Arabic/RTL & LTR layouts
 */
export function formatPhoneDisplay(phone?: string | null): string {
  if (!phone) return '';
  let cleaned = normalizeDigits(phone)
    .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return '';
  // Fix accidental trailing '+' caused by prior RTL typing (e.g. "201000000000+" -> "+201000000000")
  if (cleaned.endsWith('+') && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned.slice(0, -1).trim();
  }
  return cleaned;
}

/**
 * Build an RFC-safe `tel:` href value
 */
export function formatTelHref(phone?: string | null): string {
  const display = formatPhoneDisplay(phone);
  if (!display) return '';
  const hasPlus = display.startsWith('+');
  const digits = display.replace(/[^0-9]/g, '');
  if (!digits) return '';
  return `tel:${hasPlus ? '+' : ''}${digits}`;
}

/**
 * Normalize a phone number to clean international digits for https://wa.me/<digits>
 */
export function formatWhatsAppNumber(phone?: string | null, fallback = '201000000000'): string {
  const normalized = normalizeDigits(phone);
  let digits = normalized.replace(/[^0-9]/g, '');
  if (!digits) return fallback;
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }
  // Convert 11-digit Egyptian mobile (010/011/012/015...) to international format 201...
  if (/^01[0125][0-9]{8}$/.test(digits)) {
    digits = '20' + digits.slice(1);
  }
  return digits || fallback;
}

/**
 * Normalize any Telegram link, @username, or phone number into a valid https://t.me/... URL
 */
export function formatTelegramUrl(input?: string | null): string {
  if (!input) return '';
  const trimmed = normalizeDigits(input)
    .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
    .trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(t\.me|telegram\.me)\//i.test(trimmed)) return `https://${trimmed}`;
  if (trimmed.startsWith('@')) return `https://t.me/${trimmed.slice(1).trim()}`;
  const digits = trimmed.replace(/[^0-9]/g, '');
  if (/^\+?[0-9\s\-()]+$/.test(trimmed) && digits.length >= 8) {
    const cleanWaDigits = formatWhatsAppNumber(trimmed, digits);
    return `https://t.me/+${cleanWaDigits}`;
  }
  return `https://t.me/${trimmed.replace(/^\/+/, '')}`;
}
