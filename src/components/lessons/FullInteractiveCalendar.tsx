'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  calculateSlotPrice,
  DEFAULT_SLOT_PRICING,
  generateDayTimeSlots,
  generateNightTimeSlots,
  getPeriodWindows,
  type SlotPricingSettings,
} from '@/lib/slot-pricing';
import type { SlotData } from '@/lib/data-store';
import { PayPalCheckoutButton } from '@/components/checkout/PayPalCheckoutButton';
import { ShehnawiCheckoutButton } from '@/components/checkout/ShehnawiCheckoutButton';

interface FullInteractiveCalendarProps {
  currentLocale: string;
  initialSlotId?: string;
}

const DEFAULT_DAY_TIMES = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM',
];

const DEFAULT_NIGHT_TIMES = [
  '10:00 PM',
  '11:00 PM',
  '12:00 AM',
  '01:00 AM',
  '02:00 AM',
  '06:00 AM',
  '07:00 AM',
  '08:00 AM',
  '09:00 AM',
];

function format24hTo12h(hhmm: string): string {
  if (!hhmm || !hhmm.includes(':')) return '10:00 AM';
  const [hStr, mStr] = hhmm.split(':');
  let h = parseInt(hStr, 10);
  const m = (mStr || '00').padStart(2, '0');
  if (isNaN(h)) return '10:00 AM';
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
}

export function FullInteractiveCalendar({
  currentLocale,
  initialSlotId,
}: FullInteractiveCalendarProps) {
  const isRtl = currentLocale === 'ar';

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Current view date (year & month)
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [slots, setSlots] = useState<SlotData[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [slotPricing, setSlotPricing] = useState<SlotPricingSettings>(DEFAULT_SLOT_PRICING);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [customTime24, setCustomTime24] = useState<string>('10:00');
  const [periodTab, setPeriodTab] = useState<'DAY' | 'NIGHT'>('DAY');

  // Form states
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [focusArea, setFocusArea] = useState('Quran Recitation & Tajweed');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<SlotData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch slots, blockedDates, and dynamic slotPricing from API
  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/slots');
      const data = await res.json();
      if (data.success) {
        const fetchedSlots: SlotData[] = Array.isArray(data.slots) ? data.slots : [];
        const fetchedBlocked: string[] = Array.isArray(data.blockedDates) ? data.blockedDates : [];
        setSlots(fetchedSlots);
        setBlockedDates(fetchedBlocked);
        if (data.slotPricing) {
          setSlotPricing({
            ...DEFAULT_SLOT_PRICING,
            ...data.slotPricing,
          });
        }

        // If initialSlotId matches an available slot, select it
        if (initialSlotId) {
          const match = fetchedSlots.find((s) => s.id === initialSlotId && s.status === 'AVAILABLE');
          if (match) {
            setSelectedDate(match.date);
            setSelectedTime(match.time);
            return;
          }
        }

        // Otherwise pick the first non-blocked date starting from today
        const cursor = new Date();
        for (let i = 0; i < 60; i++) {
          const dStr = cursor.toISOString().split('T')[0];
          if (!fetchedBlocked.includes(dStr)) {
            setSelectedDate(dStr);
            setCurrentMonthDate(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
            break;
          }
          cursor.setDate(cursor.getDate() + 1);
        }
      }
    } catch (err) {
      console.error('Error fetching calendar slots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeekAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const daysOfWeekEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Map slots by date string: 'YYYY-MM-DD'
  const slotsByDate = useMemo(() => {
    const map = new Map<string, SlotData[]>();
    slots.forEach((s) => {
      const arr = map.get(s.date) || [];
      arr.push(s);
      map.set(s.date, arr);
    });
    return map;
  }, [slots]);

  // Check if a specific time on selectedDate is already booked
  const isTimeBookedOnSelectedDate = (timeLabel: string): boolean => {
    const daySlots = slotsByDate.get(selectedDate) || [];
    const normalized = timeLabel.replace(/\s*UTC$/i, '').trim().toLowerCase();
    return daySlots.some(
      (s) =>
        s.status === 'BOOKED' &&
        s.time.replace(/\s*UTC$/i, '').trim().toLowerCase() === normalized
    );
  };

  const isSelectedDateBlocked = blockedDates.includes(selectedDate);

  // Dynamically calculate the price for the currently selected time!
  const currentPriceInfo = useMemo(
    () => calculateSlotPrice(selectedTime, slotPricing),
    [selectedTime, slotPricing]
  );

  const dayTimeSlots = useMemo(
    () => generateDayTimeSlots(slotPricing.dayStartHour, slotPricing.dayEndHour),
    [slotPricing.dayStartHour, slotPricing.dayEndHour]
  );

  const nightTimeSlots = useMemo(
    () => generateNightTimeSlots(slotPricing.dayStartHour, slotPricing.dayEndHour),
    [slotPricing.dayStartHour, slotPricing.dayEndHour]
  );

  const periodWindows = useMemo(
    () => getPeriodWindows(slotPricing),
    [slotPricing]
  );

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Booking submit handler
  const handleBookingSubmit = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedDate || isSelectedDateBlocked) {
      setErrorMessage(
        isRtl
          ? 'هذا اليوم محجوز بالكامل، يرجى اختيار يوم آخر متاح من التقويم'
          : 'This day is fully booked. Please choose another available day.'
      );
      return;
    }
    if (!selectedTime || isTimeBookedOnSelectedDate(selectedTime)) {
      setErrorMessage(
        isRtl
          ? 'هذا التوقيت محجوز بالفعل، يرجى اختيار ساعة أخرى'
          : 'This time is already booked. Please choose another hour.'
      );
      return;
    }
    if (!studentName || !studentEmail || !studentPhone) {
      setErrorMessage(
        isRtl ? 'يرجى كتابة الاسم، البريد، ورقم الهاتف' : 'Name, email, and phone are required'
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/slots/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          studentName,
          studentEmail,
          studentPhone,
          notes: `[Focus: ${focusArea}] ${notes}`.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.slot) {
        setBookingSuccess(data.slot);
        fetchSlots();
      } else {
        setErrorMessage(data.error || (isRtl ? 'فشل حجز الموعد' : 'Failed to book slot'));
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      setErrorMessage(isRtl ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="academy-card p-8 sm:p-12 text-center bg-white space-y-6 max-w-xl mx-auto shadow-card-hover animate-fadeIn rounded-3xl border border-brand-200">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="badge-gold mb-2 inline-flex items-center gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تم تأكيد موعد الدرس بنجاح' : 'Session Successfully Confirmed'}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2">
            {isRtl ? 'أهلاً بك في أكاديمية عبير جاد' : 'Welcome to Abeer Gad Academy'}
          </h2>
        </div>

        <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-surface-border text-start space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-surface-borderSubtle">
            <span className="text-navy-500">{isRtl ? 'المعلمة:' : 'Instructor:'}</span>
            <span className="font-bold text-navy-900">{bookingSuccess.instructor}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-surface-borderSubtle">
            <span className="text-navy-500">{isRtl ? 'التاريخ واليوم:' : 'Date:'}</span>
            <span className="font-bold text-navy-900 font-mono">{bookingSuccess.date}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-surface-borderSubtle">
            <span className="text-navy-500">{isRtl ? 'الوقت والتوقيت:' : 'Time:'}</span>
            <span className="font-bold text-brand-800 font-mono">{bookingSuccess.time}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-surface-borderSubtle">
            <span className="text-navy-500">{isRtl ? 'التكلفة المحسوبة حسب التوقيت:' : 'Calculated Rate:'}</span>
            <span className="font-extrabold text-emerald-700 font-mono">
              {formatCurrency(bookingSuccess.price)}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-surface-borderSubtle">
            <span className="text-navy-500">{isRtl ? 'اسم الطالب:' : 'Student:'}</span>
            <span className="font-bold text-navy-900">{bookingSuccess.studentName}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-navy-500">{isRtl ? 'رقم الهاتف المسجل:' : 'Phone:'}</span>
            <span className="font-bold text-navy-900 font-mono">{bookingSuccess.studentPhone}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
          {isRtl
            ? `تم تسجيل حجزك وإرسال تفاصيل الموعد ورابط الجلسة المباشرة إلى بريدك الإلكتروني (${bookingSuccess.studentEmail}).`
            : `Your booking has been recorded and session details have been sent to ${bookingSuccess.studentEmail}.`}
        </div>

        <button
          type="button"
          onClick={() => {
            setBookingSuccess(null);
          }}
          className="btn-primary text-xs px-6 py-2.5 inline-flex items-center gap-2"
        >
          <span>{isRtl ? 'حجز موعد إضافي' : 'Book Another Session'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ============================================================== */}
      {/* LEFT: Full Interactive Month Calendar & Time Selector */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 space-y-6">
        <div className="academy-card p-6 sm:p-7 bg-white rounded-3xl border border-surface-border shadow-card-subtle space-y-6">
          {/* Calendar Header with Month Navigation */}
          <div className="flex items-center justify-between">
            <div>
              <span className="badge-light text-[11px] mb-1 inline-flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-brand-700" />
                <span>{isRtl ? 'التقويم الشهري للمواعيد المتاحة' : 'Available Monthly Schedule'}</span>
              </span>
              <h3 className="text-xl font-extrabold text-navy-950">
                {isRtl ? monthNamesAr[month] : monthNamesEn[month]} {year}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-xl border border-surface-border hover:bg-surface-muted text-navy-700 flex items-center justify-center transition-colors"
                title={isRtl ? 'الشهر السابق' : 'Previous Month'}
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-xl border border-surface-border hover:bg-surface-muted text-navy-700 flex items-center justify-center transition-colors"
                title={isRtl ? 'الشهر التالي' : 'Next Month'}
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {(isRtl ? daysOfWeekAr : daysOfWeekEn).map((dayName) => (
              <div
                key={dayName}
                className="py-1.5 text-[11px] font-extrabold text-navy-500 uppercase tracking-wider"
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Month Days Grid: All non-past days are AVAILABLE except blockedDates */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-gray-50/50 opacity-40" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayStr = dayNum.toString().padStart(2, '0');
              const monthStr = (month + 1).toString().padStart(2, '0');
              const dateStr = `${year}-${monthStr}-${dayStr}`;

              const isPast = dateStr < todayStr;
              const isBlocked = blockedDates.includes(dateStr);
              const isAvailable = !isPast && !isBlocked;
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square p-1.5 sm:p-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-between relative group ${
                    isSelected
                      ? 'border-brand-700 bg-brand-700 text-white shadow-md ring-2 ring-brand-500/30 font-bold scale-[1.03]'
                      : isBlocked
                      ? 'border-red-200 bg-red-50/70 text-red-400 cursor-not-allowed'
                      : isPast
                      ? 'border-surface-borderSubtle bg-gray-50/60 text-gray-300 cursor-not-allowed opacity-50'
                      : 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-navy-950 font-bold hover:scale-[1.02] cursor-pointer'
                  }`}
                >
                  <span
                    className={`text-xs sm:text-sm font-extrabold block ${
                      isSelected
                        ? 'text-white'
                        : isBlocked
                        ? 'text-red-500 line-through'
                        : isAvailable
                        ? 'text-navy-900'
                        : 'text-gray-300'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {isBlocked ? (
                    <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded-full font-extrabold bg-red-100 text-red-700">
                      {isRtl ? 'محجوز' : 'Busy'}
                    </span>
                  ) : isAvailable ? (
                    <span
                      className={`text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isSelected ? 'bg-white/25 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isRtl ? 'متاح' : 'Open'}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Calendar Status Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-borderSubtle text-[11px] text-navy-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
              <span className="font-bold">{isRtl ? 'يوم متاح للحجز' : 'Available Day'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-brand-700 inline-block" />
              <span className="font-bold">{isRtl ? 'اليوم المختار' : 'Selected Day'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-red-100 border border-red-300 inline-block" />
              <span className="font-bold text-red-700">{isRtl ? 'يوم محجوز / مغلق' : 'Fully Booked Day'}</span>
            </div>
          </div>
        </div>

        {/* Time Selection & Automatic Time-Based Pricing */}
        <div className="academy-card p-6 bg-white rounded-3xl border border-surface-border space-y-5 shadow-card-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-sm text-navy-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-700" />
                <span>
                  {isRtl
                    ? `اختر توقيت الحصة ليوم (${selectedDate}):`
                    : `Choose Session Time for (${selectedDate}):`}
                </span>
              </h4>
              <p className="text-xs text-navy-500 mt-0.5">
                {isRtl
                  ? 'يتم احتساب تكلفة الحصة تلقائياً حسب التوقيت المختار (فترة صباحية أو مسائية)'
                  : 'Lesson rate is calculated automatically based on your chosen time window'}
              </p>
            </div>

            {/* Live Pricing Legend Pills */}
            <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
                ☀️ {isRtl ? `${periodWindows.dayWindowAr}:` : `${periodWindows.dayWindowEn}:`}{' '}
                <strong className="font-mono">${slotPricing.dayPrice}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200">
                🌙 {isRtl ? `${periodWindows.nightWindowAr}:` : `${periodWindows.nightWindowEn}:`}{' '}
                <strong className="font-mono">${slotPricing.nightPrice}</strong>
              </span>
            </div>
          </div>

          {/* Period Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface-muted border border-surface-border">
            <button
              type="button"
              onClick={() => setPeriodTab('DAY')}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                periodTab === 'DAY'
                  ? 'bg-amber-500 text-navy-950 shadow-sm'
                  : 'text-navy-700 hover:bg-white/60'
              }`}
            >
              <span>☀️</span>
              <span>
                {isRtl
                  ? `الفترة الصباحية (${periodWindows.dayWindowAr}) • $${slotPricing.dayPrice}`
                  : `Daytime (${periodWindows.dayWindowEn}) • $${slotPricing.dayPrice}`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPeriodTab('NIGHT')}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                periodTab === 'NIGHT'
                  ? 'bg-indigo-900 text-white shadow-sm'
                  : 'text-navy-700 hover:bg-white/60'
              }`}
            >
              <span>🌙</span>
              <span>
                {isRtl
                  ? `الفترة المسائية (${periodWindows.nightWindowAr}) • $${slotPricing.nightPrice}`
                  : `Nighttime (${periodWindows.nightWindowEn}) • $${slotPricing.nightPrice}`}
              </span>
            </button>
          </div>

          {/* Time Slots Grid for Active Period */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {(periodTab === 'DAY' ? dayTimeSlots : nightTimeSlots).map((timeStr) => {
              const booked = isTimeBookedOnSelectedDate(timeStr);
              const isSelected =
                selectedTime.replace(/\s*UTC$/i, '').trim().toLowerCase() ===
                timeStr.toLowerCase();
              const priceInfo = calculateSlotPrice(timeStr, slotPricing);

              return (
                <button
                  key={timeStr}
                  type="button"
                  disabled={booked || isSelectedDateBlocked}
                  onClick={() => setSelectedTime(timeStr)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    booked
                      ? 'bg-red-50/60 border-red-200 text-red-400 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'border-brand-700 bg-brand-700 text-white font-bold shadow-md scale-[1.02]'
                      : 'border-surface-border bg-white text-navy-900 hover:border-brand-300 hover:bg-brand-50/40'
                  }`}
                >
                  <div className="flex items-center gap-1 font-mono text-xs font-extrabold">
                    <span>{priceInfo.icon}</span>
                    <span>{timeStr}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      booked
                        ? 'bg-red-100 text-red-700'
                        : isSelected
                        ? 'bg-white/20 text-white'
                        : priceInfo.isDay
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-indigo-100 text-indigo-900'
                    }`}
                  >
                    {booked
                      ? isRtl
                        ? 'محجوز'
                        : 'Booked'
                      : `${formatCurrency(priceInfo.price)}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Exact Time Picker */}
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <label className="font-extrabold text-xs text-navy-900 block">
                {isRtl ? 'أو حدد أي وقت آخر يناسبك بالدقيقة:' : 'Or pick any custom time:'}
              </label>
              <span className="text-[11px] text-navy-500">
                {isRtl
                  ? 'سيتم حساب السعر تلقائياً حسب وقتك المختار'
                  : 'Price will be calculated automatically based on your chosen hour'}
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="time"
                value={customTime24}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomTime24(val);
                  if (val) {
                    const formatted = format24hTo12h(val);
                    setSelectedTime(formatted);
                    const info = calculateSlotPrice(formatted, slotPricing);
                    setPeriodTab(info.isDay ? 'DAY' : 'NIGHT');
                  }
                }}
                className="px-3 py-2 rounded-xl border border-surface-border bg-white font-mono text-xs font-bold text-navy-900"
              />
              <span className="px-3 py-2 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 font-mono text-xs font-extrabold">
                {selectedTime} ({formatCurrency(currentPriceInfo.price)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT: Booking Checkout & Automatic Rate Summary */}
      {/* ============================================================== */}
      <div className="lg:col-span-5 space-y-6">
        <div className="academy-card p-6 sm:p-7 bg-white rounded-3xl border border-surface-border shadow-card-hover space-y-5">
          <div className="border-b border-surface-borderSubtle pb-4">
            <span className="badge-gold text-xs mb-1.5 inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'جلسة فردية مباشرة 1-on-1' : '1-on-1 Private Session'}</span>
            </span>
            <h3 className="text-xl font-extrabold text-navy-950">
              {isRtl ? 'بيانات حجز المتدرب' : 'Trainee Booking Details'}
            </h3>
            <p className="text-xs text-navy-500">
              {isRtl
                ? 'يرجى كتابة الاسم ورقم الهاتف للتواصل المباشر وإرسال رابط الجلسة'
                : 'Enter your details and phone number for session confirmation'}
            </p>
          </div>

          {/* Selected Session & Auto-Calculated Price Preview Banner */}
          <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200 text-xs text-brand-900 space-y-2">
            <div className="font-extrabold flex items-center justify-between">
              <span>{isRtl ? 'الموعد والتسعير التلقائي:' : 'Selected Session & Rate:'}</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    currentPriceInfo.isDay
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                  }`}
                >
                  {currentPriceInfo.icon}{' '}
                  {isRtl ? currentPriceInfo.periodLabelAr : currentPriceInfo.periodLabelEn}
                </span>
                <span className="text-brand-800 font-mono font-black text-base">
                  {formatCurrency(currentPriceInfo.price)}
                </span>
              </div>
            </div>
            <div className="text-xs font-mono text-navy-800 flex items-center justify-between pt-1 border-t border-brand-200/60">
              <span>📅 {selectedDate}</span>
              <span>⏰ {selectedTime}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-navy-700 block mb-1">
                {isRtl ? 'الاسم بالكامل' : 'Full Name'} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder={isRtl ? 'مثال: فاطمة أحمد' : 'e.g. Fatima Ahmed'}
                  className="w-full px-3 py-2 ps-9 rounded-xl border border-surface-border text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <User className="w-4 h-4 text-navy-400 absolute start-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="font-bold text-navy-700 block mb-1">
                {isRtl ? 'البريد الإلكتروني' : 'Email Address'} *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@email.com"
                  className="w-full px-3 py-2 ps-9 rounded-xl border border-surface-border text-xs font-mono focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <Mail className="w-4 h-4 text-navy-400 absolute start-3 top-2.5" />
              </div>
            </div>

            {/* MANDATORY PHONE INPUT */}
            <div>
              <label className="font-bold text-navy-700 block mb-1">
                {isRtl ? 'رقم الهاتف / الواتساب (إلزامي)' : 'Phone / WhatsApp (Required)'} *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+20 100 000 0000 / +966 50 000 0000"
                  className="w-full px-3 py-2 ps-9 rounded-xl border border-surface-border text-xs font-mono focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <Phone className="w-4 h-4 text-navy-400 absolute start-3 top-2.5" />
              </div>
              <span className="text-[10px] text-navy-400 mt-0.5 block">
                {isRtl ? 'ضروري لإرسال تفاصيل الجلسة والتواصل المباشر' : 'Needed for instant calendar confirmation'}
              </span>
            </div>

            <div>
              <label className="font-bold text-navy-700 block mb-1">
                {isRtl ? 'المجال الدراسي المطلوب' : 'Focus Area'}
              </label>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-xs"
              >
                <option value="Quran Recitation & Tajweed">
                  {isRtl ? 'تصحيح التلاوة وضبط أحكام التجويد' : 'Quran Recitation & Tajweed'}
                </option>
                <option value="Quran Memorization & Revision">
                  {isRtl ? 'تثبيت الحفظ والمراجعة مع الإجازة' : 'Quran Memorization & Revision'}
                </option>
                <option value="Arabic Grammar & Morphology">
                  {isRtl ? 'قواعد النحو العربي والصرف' : 'Arabic Grammar & Morphology'}
                </option>
                <option value="Specialized Sanad Preparation">
                  {isRtl ? 'الإعداد لختمة الإجازة بالسند المتصل' : 'Specialized Sanad Preparation'}
                </option>
              </select>
            </div>

            <div>
              <label className="font-bold text-navy-700 block mb-1">
                {isRtl ? 'ملاحظات إضافية للمعلمة' : 'Notes for Ustadha Abeer'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isRtl ? 'اكتب ما تود التركيز عليه في هذه الجلسة...' : 'Any specific focus or requests...'}
                className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
              />
            </div>

            {errorMessage && (
              <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || isSelectedDateBlocked}
              className="w-full py-3 rounded-2xl bg-brand-700 text-white font-extrabold text-xs hover:bg-brand-800 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isRtl ? 'جاري تأكيد الحجز...' : 'Confirming Booking...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isRtl
                      ? `تأكيد حجز الموعد الفردي (${formatCurrency(currentPriceInfo.price)})`
                      : `Confirm 1-on-1 Session (${formatCurrency(currentPriceInfo.price)})`}
                  </span>
                </>
              )}
            </button>

            {!isSelectedDateBlocked && (
              <div className="pt-2 space-y-2">
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-surface-borderSubtle"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-navy-400 font-bold uppercase">
                    {isRtl ? 'أو الدفع الإلكتروني المباشر' : 'Or pay instantly online'}
                  </span>
                  <div className="flex-grow border-t border-surface-borderSubtle"></div>
                </div>

                {/* Shehnawi Egyptian E-Wallets Gateway */}
                <ShehnawiCheckoutButton
                  itemId={`slot-${selectedDate}-${selectedTime}`}
                  itemType="PRIVATE_LESSON"
                  itemTitle={`${isRtl ? 'جلسة فردية خاصة' : 'Private Lesson'} (${selectedDate} - ${selectedTime})`}
                  amount={currentPriceInfo.price}
                  slotDate={selectedDate}
                  slotTime={selectedTime}
                  studentName={studentName}
                  studentEmail={studentEmail}
                  studentPhone={studentPhone}
                  locale={currentLocale}
                  onSuccess={() => {
                    handleBookingSubmit();
                  }}
                />

                {/* PayPal International Checkout */}
                <PayPalCheckoutButton
                  itemId={`slot-${selectedDate}-${selectedTime}`}
                  itemType="PRIVATE_LESSON"
                  itemTitle={`${isRtl ? 'جلسة فردية خاصة' : 'Private Lesson'} (${selectedDate} - ${selectedTime})`}
                  amount={currentPriceInfo.price}
                  currency={slotPricing.currency || 'USD'}
                  studentName={studentName}
                  studentEmail={studentEmail}
                  studentPhone={studentPhone}
                  onSuccess={() => {
                    handleBookingSubmit();
                  }}
                />
              </div>
            )}
          </form>

          <div className="pt-2 text-center border-t border-surface-borderSubtle">
            <span className="text-[11px] text-navy-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
              <span>{isRtl ? 'حجز رسمي مباشر معتمد من الأكاديمية' : 'Official Academy Supervised Booking'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
