'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface TimeSlot {
  id: string;
  time: string;
  status: 'AVAILABLE' | 'BOOKED';
}

interface DateOption {
  date: string;
  dayName: string;
  dayNameAr: string;
  slots: TimeSlot[];
}

const mockSchedule: DateOption[] = [
  {
    date: '2026-10-24',
    dayName: 'Saturday',
    dayNameAr: 'السبت',
    slots: [
      { id: 's1', time: '10:00 AM UTC', status: 'AVAILABLE' },
      { id: 's2', time: '02:00 PM UTC', status: 'BOOKED' },
      { id: 's3', time: '06:00 PM UTC', status: 'AVAILABLE' },
    ],
  },
  {
    date: '2026-10-25',
    dayName: 'Sunday',
    dayNameAr: 'الأحد',
    slots: [
      { id: 's4', time: '09:00 AM UTC', status: 'AVAILABLE' },
      { id: 's5', time: '01:00 PM UTC', status: 'AVAILABLE' },
      { id: 's6', time: '05:00 PM UTC', status: 'BOOKED' },
    ],
  },
  {
    date: '2026-10-26',
    dayName: 'Monday',
    dayNameAr: 'الإثنين',
    slots: [
      { id: 's7', time: '11:00 AM UTC', status: 'AVAILABLE' },
      { id: 's8', time: '03:00 PM UTC', status: 'AVAILABLE' },
      { id: 's9', time: '07:00 PM UTC', status: 'AVAILABLE' },
    ],
  },
];

interface PrivateLessonsTeaserProps {
  currentLocale: string;
}

export function PrivateLessonsTeaser({ currentLocale }: PrivateLessonsTeaserProps) {
  const tLessons = useTranslations('privateLessons');
  const tBrand = useTranslations('brand');
  const isRtl = currentLocale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('s1');

  const activeDate = mockSchedule[selectedDateIndex];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#FAF7F0] to-[#FDFBF7]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Details & Benefits */}
          <div className="lg:col-span-5 space-y-6">
            <span className="badge-gold">
              <Sparkles className="w-3.5 h-3.5" />
              {tLessons('badge')}
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
              {tLessons('title')}
            </h2>

            <p className="text-sm sm:text-base text-navy-600 leading-relaxed">
              {tLessons('subtitle')}
            </p>

            {/* Value checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-900">
                    {isRtl ? 'تعليم مباشر 1 على 1' : '100% Direct with Ustadha Abeer'}
                  </h4>
                  <p className="text-xs text-navy-600">
                    {isRtl
                      ? 'لا وسطاء ولا تسجيلات، الجلسة مخصصة لك بالكامل'
                      : 'No intermediaries or generic recordings; individualized coaching'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-900">
                    {isRtl ? '45 دقيقة مركزة لكل جلسة' : '45 Minutes Dedicated Focus'}
                  </h4>
                  <p className="text-xs text-navy-600">
                    {isRtl
                      ? 'وقت كافٍ لتصحيح الأحكام وتلاوة ورد كامل وتسميع الحفظ'
                      : 'Comprehensive phonetic correction, oral drills, and Hifz examination'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-quran-50 text-quran-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-900">
                    {isRtl ? 'حجز فوري وتأكيد بـ PayPal' : 'Instant Confirmation via PayPal'}
                  </h4>
                  <p className="text-xs text-navy-600">
                    {isRtl
                      ? 'تأكيد موعدك مباشرة عبر البريد الإلكتروني مع رابط Google Meet'
                      : 'Receive your secure meeting URL immediately upon confirmation'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Calendar & Slot Selector Card */}
          <div className="lg:col-span-7">
            <div className="academy-card p-6 sm:p-8 bg-white border border-surface-border shadow-card-hover space-y-6">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-surface-borderSubtle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                    <CalendarIcon className="w-5 h-5 text-brand-700" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-navy-900">
                      {tLessons('selectDate')}
                    </h3>
                    <span className="text-xs text-navy-500">
                      {tLessons('duration')} &bull; {tBrand('leadScholar')}
                    </span>
                  </div>
                </div>
                <div className="text-end">
                  <span className="text-xs text-navy-500 block">
                    {tLessons('pricePerSession')}
                  </span>
                  <span className="text-lg font-black text-brand-800">
                    {formatCurrency(45)}
                  </span>
                </div>
              </div>

              {/* Date Selector Tabs */}
              <div>
                <label className="text-xs font-bold text-navy-700 block mb-2">
                  {isRtl ? 'التاريخ المتاح' : 'Available Dates'}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {mockSchedule.map((item, idx) => {
                    const isSelected = idx === selectedDateIndex;
                    return (
                      <button
                        key={item.date}
                        type="button"
                        onClick={() => {
                          setSelectedDateIndex(idx);
                          // select first available slot
                          const firstAvail = item.slots.find((s) => s.status === 'AVAILABLE');
                          if (firstAvail) setSelectedSlotId(firstAvail.id);
                        }}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50 text-brand-900 ring-2 ring-brand-500/20 font-bold'
                            : 'border-surface-border bg-white text-navy-700 hover:bg-background-warm font-medium'
                        }`}
                      >
                        <span className="text-xs block text-navy-500">
                          {isRtl ? item.dayNameAr : item.dayName}
                        </span>
                        <span className="text-sm font-extrabold block mt-0.5">
                          {item.date.slice(5)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div>
                <label className="text-xs font-bold text-navy-700 block mb-2">
                  {isRtl ? 'الأوقات المتاحة لهذا اليوم' : 'Available Time Slots'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {activeDate.slots.map((slot) => {
                    const isBooked = slot.status === 'BOOKED';
                    const isSelected = slot.id === selectedSlotId;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                          isBooked
                            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'border-brand-600 bg-brand-700 text-white shadow-sm font-bold'
                            : 'border-surface-border bg-white text-navy-800 hover:border-brand-300 hover:bg-brand-50/50'
                        }`}
                      >
                        <span className="text-xs font-bold">{slot.time}</span>
                        <span
                          className={`text-[10px] uppercase font-semibold ${
                            isSelected
                              ? 'text-gold-200'
                              : isBooked
                              ? 'text-gray-400'
                              : 'text-brand-700'
                          }`}
                        >
                          {isBooked
                            ? tLessons('statusBooked')
                            : tLessons('statusAvailable')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Booking CTA Button */}
              <div className="pt-2">
                <Link
                  href={`/private-lessons?slotId=${selectedSlotId}&date=${activeDate.date}`}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-card-subtle hover:shadow-teal-glow transition-all"
                >
                  <Video className="w-4 h-4 text-gold-300" />
                  <span>
                    {isRtl
                      ? 'متابعة الحجز والانتقال للدفع عبر PayPal'
                      : 'Proceed with Selected Slot to PayPal Checkout'}
                  </span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-center text-navy-500 mt-2.5">
                  {isRtl
                    ? 'سيتم تزويدك برابط الجلسة عبر البريد الإلكتروني بعد إتمام الدفع فوراً'
                    : 'Meeting link is dispatched instantly upon payment confirmation.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
