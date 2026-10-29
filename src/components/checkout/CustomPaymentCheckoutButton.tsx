'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Send,
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  X,
  FileCheck,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import type { CustomPaymentMethod } from '@/lib/data-store';

interface CustomPaymentCheckoutButtonProps {
  itemId: string;
  itemType: 'COURSE' | 'PRIVATE_LESSON' | 'RESOURCE';
  itemTitle: string;
  amount: number; // in USD
  currency?: string;
  slotDate?: string;
  slotTime?: string;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  locale?: string;
  onSuccess?: () => void;
  className?: string;
}

export function CustomPaymentCheckoutButton({
  itemId,
  itemType,
  itemTitle,
  amount,
  currency = 'USD',
  slotDate,
  slotTime,
  studentName = '',
  studentEmail = '',
  studentPhone = '',
  locale = 'ar',
  onSuccess,
  className = '',
}: CustomPaymentCheckoutButtonProps) {
  const isRtl = locale === 'ar';

  const [methods, setMethods] = useState<CustomPaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<CustomPaymentMethod | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states inside modal
  const [name, setName] = useState(studentName);
  const [email, setEmail] = useState(studentEmail);
  const [phone, setPhone] = useState(studentPhone);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    orderId: string;
    transactionId: string;
    contactPhone?: string;
  } | null>(null);

  // Synchronize initial props
  useEffect(() => {
    if (studentName) setName(studentName);
    if (studentEmail) setEmail(studentEmail);
    if (studentPhone) setPhone(studentPhone);
  }, [studentName, studentEmail, studentPhone]);

  // Fetch active custom payment methods from API
  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setLoadingMethods(true);
        const res = await fetch('/api/admin/payment-methods');
        const data = await res.json();
        if (data.success && Array.isArray(data.methods)) {
          const activeOnly = data.methods.filter((m: CustomPaymentMethod) => m.isActive !== false);
          setMethods(activeOnly);
        }
      } catch (err) {
        console.error('Failed to load custom payment methods:', err);
      } finally {
        setLoadingMethods(false);
      }
    };
    fetchMethods();
  }, []);

  const openModalForMethod = (method: CustomPaymentMethod) => {
    setSelectedMethod(method);
    setErrorMsg(null);
    setSuccessData(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMethod(null);
    setErrorMsg(null);
    setSuccessData(null);
  };

  const handleSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) return;

    if (!name.trim() || !email.trim()) {
      setErrorMsg(isRtl ? 'يرجى إدخال اسمك وبريدك الإلكتروني.' : 'Name and email are required.');
      return;
    }

    if (selectedMethod.requiresReferenceNumber && !referenceNumber.trim()) {
      setErrorMsg(
        isRtl
          ? 'يرجى إدخال رقم الحوالة أو كود العملية (MTCN / Reference Number).'
          : 'Please enter the transfer reference code or MTCN.'
      );
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const res = await fetch('/api/payments/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          methodId: selectedMethod.id,
          methodName: selectedMethod.name,
          referenceNumber: referenceNumber.trim(),
          itemId,
          itemType,
          itemTitle,
          amount,
          currency,
          studentName: name.trim(),
          studentEmail: email.trim(),
          studentPhone: phone.trim(),
          notes: notes.trim(),
          slotDate,
          slotTime,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessData({
          orderId: data.orderId,
          transactionId: data.transactionId,
          contactPhone: data.contactPhone,
        });
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(data.error || (isRtl ? 'تعذر إرسال بيانات التحويل، يرجى المحاولة لاحقاً.' : 'Failed to submit transfer details.'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || (isRtl ? 'حدث خطأ غير متوقع أثناء إرسال البيانات.' : 'An unexpected error occurred.'));
    } finally {
      setSubmitting(false);
    }
  };

  const getMethodIcon = (type?: string) => {
    switch (type) {
      case 'western_union':
        return <Globe className="w-4 h-4 text-amber-600" />;
      case 'wise':
        return <Send className="w-4 h-4 text-emerald-600" />;
      case 'tab_tab':
        return <Smartphone className="w-4 h-4 text-purple-600" />;
      case 'bank_transfer':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-indigo-600" />;
    }
  };

  if (methods.length === 0 && !loadingMethods) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Title / Section Header */}
      <div className="flex items-center gap-2 pt-2 border-t border-surface-borderSubtle">
        <CreditCard className="w-3.5 h-3.5 text-navy-500" />
        <span className="text-[11px] font-bold text-navy-600">
          {isRtl ? 'طرق تحويل دولية أخرى (ويسترن يونيون، وايز، تاب تاب...)' : 'Other International Transfer Methods'}
        </span>
      </div>

      {/* Buttons for each configured custom method */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {methods.map((method) => {
          const displayName = isRtl ? method.nameAr || method.name : method.name;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => openModalForMethod(method)}
              className="px-3 py-2.5 rounded-xl border border-surface-border bg-surface-muted/60 hover:bg-white hover:border-brand-400 hover:shadow-sm text-navy-900 transition-all flex items-center justify-between text-xs font-bold text-start group"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="w-7 h-7 rounded-lg bg-white border border-surface-borderSubtle flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  {getMethodIcon(method.type)}
                </div>
                <span className="truncate">{displayName}</span>
              </div>
              <span className="text-[10px] text-brand-700 font-extrabold shrink-0">
                {isRtl ? 'تحويل' : 'Transfer'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Modal for Selected Method */}
      {isModalOpen && selectedMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white rounded-3xl border border-surface-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in zoom-in-95"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                  {getMethodIcon(selectedMethod.type)}
                </div>
                <div>
                  <h3 className="font-extrabold text-navy-950 text-base">
                    {isRtl ? selectedMethod.nameAr || selectedMethod.name : selectedMethod.name}
                  </h3>
                  <p className="text-[11px] text-navy-500">
                    {isRtl ? 'التحويل المباشر وتأكيد المعاملة' : 'Direct transfer and manual confirmation'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-surface-muted hover:bg-surface-elevated text-navy-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If Payment Confirmed Successfully */}
            {successData ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-black text-navy-950">
                  {isRtl ? 'تم استلام بيانات التحويل بنجاح!' : 'Transfer Details Received!'}
                </h4>
                <p className="text-xs text-navy-600 max-w-sm mx-auto leading-relaxed">
                  {isRtl
                    ? `شكراً لك! تم تسجيل حجزك وتثبيت الموعد برقم مرجعي (${successData.orderId}). جاري مراجعة الحوالة وتأكيدها من قبل إدارة الأكاديمية.`
                    : `Thank you! Your booking is registered with reference (${successData.orderId}). The academy administration will confirm your transfer shortly.`}
                </p>

                <div className="p-3 rounded-2xl bg-surface-muted border border-surface-border font-mono text-xs text-navy-800 flex items-center justify-between">
                  <span>{isRtl ? 'كود الطلب:' : 'Order ID:'}</span>
                  <span className="font-bold text-brand-800">{successData.orderId}</span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <a
                    href={`https://wa.me/${(successData.contactPhone || '201000000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `السلام عليكم، قمت بإجراء تحويل عبر ${selectedMethod.name} لحجز: ${itemTitle} - كود الطلب: ${successData.orderId} - رقم الحوالة: ${referenceNumber}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{isRtl ? 'إرسال الإشعار فوراً عبر واتساب' : 'Notify via WhatsApp'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 rounded-xl border border-surface-border bg-white text-navy-800 font-bold text-xs hover:bg-surface-muted"
                  >
                    {isRtl ? 'إغلاق النافذة' : 'Close'}
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Transfer Form */
              <form onSubmit={handleSubmitTransfer} className="space-y-4 text-xs">
                {/* Amount to pay banner */}
                <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-navy-500 block">{isRtl ? 'المبلغ المطلوب تحويله:' : 'Amount to transfer:'}</span>
                    <span className="text-lg font-black text-brand-900">${amount} {currency}</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-white border border-brand-200 text-brand-800 font-bold">
                    {itemTitle}
                  </span>
                </div>

                {/* Recipient Details & Instructions Provided by Admin */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                  <span className="font-extrabold text-amber-950 block text-xs">
                    📌 {isRtl ? 'بيانات المستلم وتعليمات التحويل:' : 'Recipient Details & Instructions:'}
                  </span>

                  {selectedMethod.recipientName && (
                    <div className="flex items-center justify-between text-navy-800">
                      <span className="text-navy-500">{isRtl ? 'اسم المستلم:' : 'Recipient Name:'}</span>
                      <strong className="font-bold text-navy-950 font-arabic">
                        {isRtl ? selectedMethod.recipientNameAr || selectedMethod.recipientName : selectedMethod.recipientName}
                      </strong>
                    </div>
                  )}

                  {selectedMethod.country && (
                    <div className="flex items-center justify-between text-navy-800">
                      <span className="text-navy-500">{isRtl ? 'الدولة / البلد:' : 'Country:'}</span>
                      <strong className="font-bold text-navy-950">
                        {isRtl ? selectedMethod.countryAr || selectedMethod.country : selectedMethod.country}
                      </strong>
                    </div>
                  )}

                  {selectedMethod.phone && (
                    <div className="flex items-center justify-between text-navy-800">
                      <span className="text-navy-500">{isRtl ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                      <strong className="font-bold font-mono text-navy-950">{selectedMethod.phone}</strong>
                    </div>
                  )}

                  {selectedMethod.emailOrIban && (
                    <div className="flex items-center justify-between text-navy-800">
                      <span className="text-navy-500">{isRtl ? 'الحساب / البريد / IBAN:' : 'Account / IBAN:'}</span>
                      <strong className="font-bold font-mono text-navy-950 text-[11px]">{selectedMethod.emailOrIban}</strong>
                    </div>
                  )}

                  {selectedMethod.accountNumber && (
                    <div className="flex items-center justify-between text-navy-800">
                      <span className="text-navy-500">{isRtl ? 'رقم الحساب:' : 'Account Number:'}</span>
                      <strong className="font-bold font-mono text-navy-950">{selectedMethod.accountNumber}</strong>
                    </div>
                  )}

                  {/* Free text instructions */}
                  <p className="pt-1.5 border-t border-amber-200/60 text-navy-700 leading-relaxed text-[11px]">
                    {isRtl ? selectedMethod.instructionsAr || selectedMethod.instructions : selectedMethod.instructions}
                  </p>
                </div>

                {/* Student Info Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-navy-800 block mb-1">
                      {isRtl ? 'اسمك بالكامل' : 'Your Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isRtl ? 'مثال: محمد أحمد' : 'e.g. John Doe'}
                      className="w-full px-3 py-2 rounded-xl border border-surface-border"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-navy-800 block mb-1">
                      {isRtl ? 'البريد الإلكتروني' : 'Email Address'} *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-navy-800 block mb-1">
                      {isRtl ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+20 100 000 0000"
                      className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-navy-800 block mb-1">
                      {isRtl ? 'رقم الحوالة / كود العملية (MTCN)' : 'MTCN / Transfer Reference'} *
                    </label>
                    <input
                      type="text"
                      required={selectedMethod.requiresReferenceNumber}
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder={isRtl ? 'مثال: 9482019482 أو كود Wise' : 'e.g. 10-digit MTCN or Wise ID'}
                      className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-brand-800 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-navy-800 block mb-1">
                    {isRtl ? 'ملاحظات إضافية (اختياري)' : 'Additional Notes (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isRtl ? 'اسم الراسل أو تفاصيل التحويل' : 'Sender name or transfer notes'}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 rounded-xl border border-surface-border bg-white text-navy-700 font-bold hover:bg-surface-muted"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-extrabold flex items-center gap-2 shadow-sm transition-all"
                  >
                    {submitting ? (
                      <span>{isRtl ? 'جاري التأكيد...' : 'Submitting...'}</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{isRtl ? 'تأكيد وإرسال بيانات التحويل' : 'Confirm & Submit Transfer'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
