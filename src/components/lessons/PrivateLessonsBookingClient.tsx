'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  ShieldCheck,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { PayPalCheckoutButton } from '@/components/checkout/PayPalCheckoutButton';
import { formatCurrency } from '@/lib/utils';

interface TimeSlot {
  id: string;
  time: string;
  status: 'AVAILABLE' | 'BOOKED';
}

interface DaySchedule {
  date: string;
  dayName: string;
  dayNameAr: string;
  slots: TimeSlot[];
}

const mockSchedule: DaySchedule[] = [
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
  {
    date: '2026-10-27',
    dayName: 'Tuesday',
    dayNameAr: 'الثلاثاء',
    slots: [
      { id: 's10', time: '10:30 AM UTC', status: 'AVAILABLE' },
      { id: 's11', time: '02:30 PM UTC', status: 'AVAILABLE' },
      { id: 's12', time: '06:30 PM UTC', status: 'AVAILABLE' },
    ],
  },
];

interface PrivateLessonsBookingClientProps {
  currentLocale: string;
  initialSlotId?: string;
  initialDate?: string;
}

export function PrivateLessonsBookingClient({
  currentLocale,
  initialSlotId,
  initialDate,
}: PrivateLessonsBookingClientProps) {
  const tLessons = useTranslations('privateLessons');
  const tBrand = useTranslations('brand');
  const isRtl = currentLocale === 'ar';

  const initialDateIdx = Math.max(
    0,
    mockSchedule.findIndex((s) => s.date === initialDate)
  );

  const [selectedDateIdx, setSelectedDateIdx] = useState(initialDateIdx);
  const [selectedSlotId, setSelectedSlotId] = useState(initialSlotId || 's1');

  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [focusArea, setFocusArea] = useState('Quran Recitation Correction');
  const [notes, setNotes] = useState('');
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);

  const activeDate = mockSchedule[selectedDateIdx];
  const activeSlot = activeDate.slots.find((s) => s.id === selectedSlotId) || activeDate.slots[0];

  const sessionFee = 45;

  return (
    <div className="max-w-5xl mx-auto">
      {isBookedSuccess ? (
        <div className="academy-card p-8 sm:p-12 text-center bg-white space-y-4 max-w-lg mx-auto animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-quran-50 text-quran-600 border border-quran-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-navy-950">
            {isRtl ? 'تم تأكيد حجزك بنجاح!' : 'Private Lesson Confirmed!'}
          </h2>
          <p className="text-sm text-navy-600">
            {isRtl
              ? `تم حجز موعدك مع الأستاذة عبير جاد يوم ${activeDate.dayNameAr} (${activeDate.date}) في تمام الساعة ${activeSlot.time}. تم إرسال رابط الاجتماع إلى ${studentEmail}.`
              : `Your session with Ustadha Abeer Gad is confirmed for ${activeDate.dayName} (${activeDate.date}) at ${activeSlot.time}. The Google Meet link has been sent to ${studentEmail}.`}
          </p>
          <div className="pt-4">
            <span className="badge-light text-xs">
              Status: Verified &bull; Calendar Invitation Dispatched
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar & Slot Picker */}
          <div className="lg:col-span-7 space-y-6">
            <div className="academy-card p-6 sm:p-7 bg-white space-y-6">
              <div>
                <h3 className="font-bold text-base text-navy-900 flex items-center gap-2 mb-1">
                  <CalendarIcon className="w-4 h-4 text-brand-700" />
                  <span>{tLessons('selectDate')}</span>
                </h3>
                <p className="text-xs text-navy-500">
                  Select your preferred day with {tBrand('leadScholar')}
                </p>
              </div>

              {/* Date options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {mockSchedule.map((item, idx) => {
                  const isSelected = idx === selectedDateIdx;
                  return (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => {
                        setSelectedDateIdx(idx);
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

              {/* Time Slots */}
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

              {/* Student Details Form */}
              <div className="space-y-4 pt-4 border-t border-surface-borderSubtle">
                <h4 className="font-bold text-sm text-navy-900">
                  {isRtl ? 'بيانات الطالب وأهداف الجلسة' : 'Student Information & Lesson Goals'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-navy-700 block mb-1">
                      {tLessons('studentName')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-navy-400 absolute start-3 top-3" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Fatima Zahra"
                        className="w-full ps-9 pe-3 py-2 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-navy-700 block mb-1">
                      {tLessons('studentEmail')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-navy-400 absolute start-3 top-3" />
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="fatima@example.com"
                        className="w-full ps-9 pe-3 py-2 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-navy-700 block mb-1">
                      {tLessons('studentPhone')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-navy-400 absolute start-3 top-3" />
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="+20 100 000 0000"
                        className="w-full ps-9 pe-3 py-2 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-navy-700 block mb-1">
                    {isRtl ? 'مجال التركيز' : 'Primary Focus Topic'}
                  </label>
                  <select
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                  >
                    <option value="Quran Recitation Correction">Quran Recitation & Makhaarij Correction</option>
                    <option value="Quran Memorization Examination">Quran Memorization (Hifz) Examination</option>
                    <option value="Tajweed Rules Application">Tajweed Rules Application (Ahkam)</option>
                    <option value="Classical Arabic Conversation">Classical Arabic Conversation & Syntax</option>
                    <option value="Specialized Academic Shariah Arabic">Specialized Shariah / Legal Arabic</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-navy-700 block mb-1">
                    {tLessons('notes')}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      isRtl
                        ? 'اكتب السور أو الآيات التي تود تسميعها أو موضوع الدرس بالتحديد...'
                        : 'Mention specific Surahs, Ayahs, or topics you want Ustadha Abeer to review...'
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & PayPal Checkout */}
          <div className="lg:col-span-5 space-y-6 sticky top-20">
            <div className="academy-card p-6 sm:p-7 bg-white space-y-5 border border-surface-border shadow-card-hover">
              <div className="flex items-center justify-between border-b border-surface-borderSubtle pb-4">
                <span className="font-extrabold text-base text-navy-950">
                  {isRtl ? 'ملخص الحجز' : 'Lesson Booking Summary'}
                </span>
                <span className="text-xl font-black text-brand-800">
                  {formatCurrency(sessionFee)}
                </span>
              </div>

              <div className="space-y-3 text-xs text-navy-700">
                <div className="flex items-center justify-between">
                  <span className="text-navy-500">Instructor:</span>
                  <strong className="text-navy-900">{tBrand('leadScholar')}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy-500">Duration:</span>
                  <strong className="text-navy-900">45 Minutes (Dedicated 1-on-1)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy-500">Date:</span>
                  <strong className="text-navy-900 font-mono">{activeDate.date}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy-500">Time:</span>
                  <strong className="text-navy-900 font-mono">{activeSlot.time}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy-500">Platform:</span>
                  <strong className="text-navy-900">Google Meet HD Video</strong>
                </div>
              </div>

              {/* PayPal Checkout Button Integration */}
              <div className="pt-2">
                <PayPalCheckoutButton
                  itemId={activeSlot.id}
                  itemType="PRIVATE_LESSON"
                  itemTitle={`Private Lesson with Ustadha Abeer Gad (${activeDate.date} ${activeSlot.time})`}
                  amount={sessionFee}
                  currency="USD"
                  studentName={studentName}
                  studentEmail={studentEmail}
                  studentPhone={studentPhone}
                  onSuccess={() => setIsBookedSuccess(true)}
                />
              </div>

              <div className="text-[11px] text-center text-navy-500 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                <span>Instant Confirmation &bull; Rescheduling Allowed</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
