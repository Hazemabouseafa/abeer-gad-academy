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
  FileText,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Video,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { calculateSlotPrice } from '@/lib/slot-pricing';
import type { SlotData } from '@/lib/data-store';
import { PayPalCheckoutButton } from '@/components/checkout/PayPalCheckoutButton';

interface FullInteractiveCalendarProps {
  currentLocale: string;
  initialSlotId?: string;
}

export function FullInteractiveCalendar({
  currentLocale,
  initialSlotId,
}: FullInteractiveCalendarProps) {
  const isRtl = currentLocale === 'ar';

  // Current view date (year & month)
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [slots, setSlots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);

  // Form states
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [focusArea, setFocusArea] = useState('Quran Recitation & Tajweed');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<SlotData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch slots from API
  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/slots');
      const data = await res.json();
      if (data.success && Array.isArray(data.slots)) {
        setSlots(data.slots);

        // Pre-select first available slot if matching initialSlotId or today
        const available = data.slots.filter((s: SlotData) => s.status === 'AVAILABLE');
        if (available.length > 0) {
          const match = initialSlotId
            ? available.find((s: SlotData) => s.id === initialSlotId)
            : available[0];
          const chosen = match || available[0];
          setSelectedDate(chosen.date);
          setSelectedSlot(chosen);
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
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

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

  // Available slots on currently selected day
  const activeDaySlots = useMemo(() => {
    if (!selectedDate) return [];
    return slotsByDate.get(selectedDate) || [];
  }, [selectedDate, slotsByDate]);

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Booking submit handler
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMessage(isRtl ? 'يرجى اختيار موعد متاح من التقويم' : 'Please select an available slot');
      return;
    }
    if (!studentName || !studentEmail || !studentPhone) {
      setErrorMessage(isRtl ? 'يرجى كتابة الاسم، البريد، ورقم الهاتف' : 'Name, email, and phone are required');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/slots/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          studentName,
          studentEmail,
          studentPhone,
          notes: `[Focus: ${focusArea}] ${notes}`.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.slot) {
        setBookingSuccess(data.slot);
        fetchSlots(); // Refresh slot status
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
            ? `تم إرسال دعوة التقويم ورابط Google Meet المباشر إلى بريدك الإلكتروني (${bookingSuccess.studentEmail}). كما تم إخطار الأستاذة عبير جاد بموعدك.`
            : `Calendar invitation and Google Meet link have been dispatched to ${bookingSuccess.studentEmail}. Ustadha Abeer Gad has also been notified.`}
        </div>

        <button
          type="button"
          onClick={() => {
            setBookingSuccess(null);
            setSelectedSlot(null);
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
      {/* LEFT: Full Interactive Month Calendar */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 space-y-6">
        <div className="academy-card p-6 sm:p-7 bg-white rounded-3xl border border-surface-border shadow-card-subtle space-y-6">
          {/* Calendar Header with Month Navigation */}
          <div className="flex items-center justify-between">
            <div>
              <span className="badge-light text-[11px] mb-1 inline-flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-brand-700" />
                <span>{isRtl ? 'التقويم الشهري للمواعيد الشاغرة' : 'Available Monthly Schedule'}</span>
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
            {(isRtl ? daysOfWeekAr : daysOfWeekEn).map((dayName, idx) => (
              <div
                key={dayName}
                className="py-1.5 text-[11px] font-extrabold text-navy-500 uppercase tracking-wider"
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Empty offset days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-gray-50/50 opacity-40" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayStr = dayNum.toString().padStart(2, '0');
              const monthStr = (month + 1).toString().padStart(2, '0');
              const dateStr = `${year}-${monthStr}-${dayStr}`;

              const daySlots = slotsByDate.get(dateStr) || [];
              const availableCount = daySlots.filter((s) => s.status === 'AVAILABLE').length;
              const hasAvailable = availableCount > 0;
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={!hasAvailable}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    const firstAvail = daySlots.find((s) => s.status === 'AVAILABLE');
                    if (firstAvail) setSelectedSlot(firstAvail);
                  }}
                  className={`aspect-square p-1.5 sm:p-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-between relative group ${
                    isSelected
                      ? 'border-brand-700 bg-brand-700 text-white shadow-md ring-2 ring-brand-500/30 font-bold scale-[1.03]'
                      : hasAvailable
                      ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-navy-950 font-bold hover:scale-[1.02] cursor-pointer'
                      : 'border-surface-borderSubtle bg-white/40 text-gray-300 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className={`text-xs sm:text-sm font-extrabold block ${isSelected ? 'text-white' : hasAvailable ? 'text-navy-900' : 'text-gray-300'}`}>
                    {dayNum}
                  </span>

                  {hasAvailable && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded-full font-extrabold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                      title={`${availableCount} ${isRtl ? 'مواعيد متاحة' : 'slots'}`}
                    >
                      {availableCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Status Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-borderSubtle text-[11px] text-navy-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300 inline-block" />
              <span>{isRtl ? 'يوم متاح للحجز' : 'Available for Booking'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-brand-700 inline-block" />
              <span>{isRtl ? 'اليوم المختار' : 'Selected Day'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-gray-100 border border-gray-200 inline-block opacity-60" />
              <span>{isRtl ? 'غير متاح / مكتمل' : 'Unavailable'}</span>
            </div>
          </div>
        </div>

        {/* Available Times on Selected Day */}
        <div className="academy-card p-6 bg-white rounded-3xl border border-surface-border space-y-4 shadow-card-subtle">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-navy-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-700" />
                <span>
                  {isRtl
                    ? `المواعيد المتاحة ليوم (${selectedDate}):`
                    : `Available Time Slots for (${selectedDate}):`}
                </span>
              </h4>
              <p className="text-xs text-navy-500">
                {isRtl ? 'انقر على الساعة المفضلة لتأكيد حجزها' : 'Click preferred time slot to select'}
              </p>
            </div>
            <span className="badge-light text-xs font-mono font-bold">
              {activeDaySlots.filter((s) => s.status === 'AVAILABLE').length} {isRtl ? 'مواعيد' : 'slots'}
            </span>
          </div>

          {activeDaySlots.length === 0 ? (
            <div className="p-6 text-center text-xs text-navy-400 bg-surface-muted rounded-2xl">
              {isRtl ? 'لا توجد مواعيد مفتوحة في هذا اليوم' : 'No available slots for this day.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {activeDaySlots.map((slot) => {
                const isBooked = slot.status === 'BOOKED';
                const isSelected = selectedSlot?.id === slot.id;
                const priceInfo = calculateSlotPrice(slot.time);

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl border text-center transition-all flex items-center justify-between gap-2 ${
                      isBooked
                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                        : isSelected
                        ? 'border-brand-700 bg-brand-700 text-white font-bold shadow-sm'
                        : 'border-surface-border bg-white text-navy-800 hover:border-brand-300 hover:bg-brand-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span>{priceInfo.icon}</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot.time}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-brand-800'}`}>
                        ${slot.price}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : isBooked
                            ? 'bg-gray-200 text-gray-600'
                            : priceInfo.isDay
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {isBooked ? (isRtl ? 'محجوز' : 'Booked') : (priceInfo.isDay ? (isRtl ? 'نهاري' : 'Day') : (isRtl ? 'ليلي' : 'Night'))}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT: Booking Checkout & Mandatory Phone Form */}
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

          {/* Selected Session Preview Banner */}
          {selectedSlot ? (() => {
            const selectedPriceInfo = calculateSlotPrice(selectedSlot.time);
            return (
              <div className="p-3.5 rounded-2xl bg-brand-50/70 border border-brand-200 text-xs text-brand-900 space-y-1.5">
                <div className="font-extrabold flex items-center justify-between">
                  <span>{isRtl ? 'الموعد المختار:' : 'Selected Session:'}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      selectedPriceInfo.isDay ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                    }`}>
                      {selectedPriceInfo.icon} {isRtl ? (selectedPriceInfo.isDay ? 'فترة نهارية' : 'فترة مسائية/ليلية') : (selectedPriceInfo.isDay ? 'Daytime' : 'Nighttime')}
                    </span>
                    <span className="text-brand-700 font-mono font-bold text-sm">
                      {formatCurrency(selectedSlot.price)}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-navy-700 flex items-center gap-2">
                  <span>📅 {selectedSlot.date}</span>
                  <span>⏰ {selectedSlot.time}</span>
                </div>
              </div>
            );
          })() : (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              {isRtl ? 'يرجى النقر على موعد متاح من التقويم بالأعلى' : 'Please select an available slot from the calendar'}
            </div>
          )}

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
              disabled={submitting || !selectedSlot}
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
                      ? `تأكيد حجز الموعد الفردي (${selectedSlot ? formatCurrency(selectedSlot.price) : ''})`
                      : `Confirm 1-on-1 Session (${selectedSlot ? formatCurrency(selectedSlot.price) : ''})`}
                  </span>
                </>
              )}
            </button>

            {selectedSlot && (
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-surface-borderSubtle"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-navy-400 font-bold uppercase">
                    {isRtl ? 'أو الدفع والتأكيد المباشر عبر PayPal' : 'Or pay securely with PayPal'}
                  </span>
                  <div className="flex-grow border-t border-surface-borderSubtle"></div>
                </div>
                <PayPalCheckoutButton
                  itemId={selectedSlot.id}
                  itemType="PRIVATE_LESSON"
                  itemTitle={`${isRtl ? 'جلسة فردية خاصة' : 'Private Lesson'} (${selectedSlot.date} - ${selectedSlot.time})`}
                  amount={selectedSlot.price}
                  currency={selectedSlot.currency || 'USD'}
                  studentName={studentName}
                  studentEmail={studentEmail}
                  studentPhone={studentPhone}
                  onSuccess={() => {
                    handleBookingSubmit(new Event('submit') as any);
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
