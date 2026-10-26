'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, CheckCircle2, Loader2, Lock, X, Phone, User, Mail } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PayPalCheckoutButtonProps {
  itemId: string;
  itemType: 'COURSE' | 'PRIVATE_LESSON';
  itemTitle: string;
  amount: number;
  currency?: string;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  onSuccess?: () => void;
  className?: string;
}

export function PayPalCheckoutButton({
  itemId,
  itemType,
  itemTitle,
  amount,
  currency = 'USD',
  studentName = '',
  studentEmail = '',
  studentPhone = '',
  onSuccess,
  className = '',
}: PayPalCheckoutButtonProps) {
  const tCheckout = useTranslations('checkout');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState(studentName);
  const [email, setEmail] = useState(studentEmail);
  const [phone, setPhone] = useState(studentPhone);

  useEffect(() => {
    if (studentName) setName(studentName);
    if (studentEmail) setEmail(studentEmail);
    if (studentPhone) setPhone(studentPhone);
  }, [studentName, studentEmail, studentPhone]);

  const handleInitiatePayment = async () => {
    setErrorMsg(null);

    // Strict validation
    if (!name.trim()) {
      setErrorMsg(tCheckout('nameRequiredError'));
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(tCheckout('emailRequiredError'));
      return;
    }
    if (!phone || !phone.trim() || phone.trim().replace(/\D/g, '').length < 6) {
      setErrorMsg(tCheckout('phoneRequiredError'));
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create Order via our API
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          itemType,
          itemId,
          amount,
          currency,
          description: itemTitle,
          studentName: name.trim(),
          studentEmail: email.trim(),
          studentPhone: phone.trim(),
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      // 2. Simulate or execute Capture
      const captureRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'capture',
          orderId: orderData.orderId,
          itemType,
          itemId,
          amount,
          currency,
          studentName: name.trim(),
          studentEmail: email.trim(),
          studentPhone: phone.trim(),
        }),
      });

      const captureData = await captureRes.json();
      if (!captureRes.ok) {
        throw new Error(captureData.error || 'Payment capture failed');
      }

      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Payment process failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsSuccess(false);
          setErrorMsg(null);
          setIsOpen(true);
        }}
        className={`w-full py-3 px-5 rounded-xl font-bold text-sm bg-[#FFC439] hover:bg-[#F4B41A] text-navy-950 flex items-center justify-center gap-2.5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${className}`}
      >
        {/* PayPal Monogram SVG */}
        <span className="font-extrabold italic text-base text-[#003087]">Pay</span>
        <span className="font-extrabold italic text-base text-[#0079C1] -ms-2">Pal</span>
        <span className="font-semibold ms-1">Checkout</span>
      </button>

      {/* Checkout Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl border border-surface-border shadow-card-elevated overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-surface-borderSubtle bg-[#FAF7F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-brand-700" />
                </div>
                <h3 className="font-bold text-base text-navy-900">
                  {tCheckout('title')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-navy-500 hover:text-navy-900 hover:bg-surface-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {isSuccess ? (
                <div className="text-center py-6 space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-quran-50 text-quran-600 border border-quran-200 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-extrabold text-navy-950">
                    {tCheckout('success')}
                  </h4>
                  <p className="text-xs text-navy-600 max-w-xs mx-auto">
                    A confirmation receipt and instant access details have been dispatched to your email.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-xs shadow-sm hover:bg-brand-800 transition-colors"
                  >
                    Done / Return
                  </button>
                </div>
              ) : (
                <>
                  {/* Order Summary Card */}
                  <div className="p-4 rounded-xl bg-background-warm border border-surface-borderSubtle space-y-2">
                    <div className="text-xs font-semibold text-navy-500 uppercase tracking-wider">
                      {tCheckout('summary')}
                    </div>
                    <div className="flex items-center justify-between font-bold text-sm text-navy-900">
                      <span className="line-clamp-1">{itemTitle}</span>
                      <span className="text-brand-800 shrink-0 ms-2">
                        {formatCurrency(amount, currency)}
                      </span>
                    </div>
                    <div className="text-[11px] text-navy-500 flex items-center gap-1.5 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                      <span>{tCheckout('secureNotice')}</span>
                    </div>
                  </div>

                  {/* Student Details Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-navy-800 block mb-1">
                        {tCheckout('studentName')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-navy-400 absolute start-3 top-3" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Fatima Zahra"
                          className="w-full ps-9 pe-3.5 py-2.5 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-navy-800 block mb-1">
                        {tCheckout('studentEmail')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-navy-400 absolute start-3 top-3" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@email.com"
                          className="w-full ps-9 pe-3.5 py-2.5 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-navy-800 block">
                          {tCheckout('studentPhone')} <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          مطلوب للتواصل
                        </span>
                      </div>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-navy-400 absolute start-3 top-3" />
                        <input
                          type="tel"
                          required
                          dir="ltr"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={tCheckout('phonePlaceholder')}
                          className="w-full ps-9 pe-3.5 py-2.5 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                        />
                      </div>
                      <span className="text-[10px] text-navy-500 mt-1 block">
                        ضروري للتنسيق المباشر وإرسال رابط الجلسة ومتابعة التقدم.
                      </span>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Confirm Button */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleInitiatePayment}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-brand-700 hover:bg-brand-800 text-white flex items-center justify-center gap-2 shadow-card-subtle transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{tCheckout('pending')}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-gold-300" />
                        <span>
                          Pay {formatCurrency(amount, currency)} with PayPal
                        </span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
