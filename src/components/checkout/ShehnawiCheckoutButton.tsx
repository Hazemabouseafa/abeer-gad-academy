'use client';

import { useState, useEffect } from 'react';
import {
  Wallet,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  X,
  ShieldCheck,
  Smartphone,
  CreditCard,
  User,
  Mail,
  Phone,
  FileCheck,
} from 'lucide-react';
import { SUPPORTED_WALLETS, WalletProviderOption } from '@/lib/shehnawi';

interface ShehnawiCheckoutButtonProps {
  itemId: string;
  itemType: 'COURSE' | 'PRIVATE_LESSON';
  itemTitle: string;
  amount: number; // in USD
  slotDate?: string;
  slotTime?: string;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  onSuccess?: () => void;
  className?: string;
  buttonLabel?: string;
  locale?: string;
}

export function ShehnawiCheckoutButton({
  itemId,
  itemType,
  itemTitle,
  amount,
  slotDate,
  slotTime,
  studentName = '',
  studentEmail = '',
  studentPhone = '',
  onSuccess,
  className = '',
  buttonLabel,
  locale = 'ar',
}: ShehnawiCheckoutButtonProps) {
  const isRtl = locale === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Gateway Settings fetched from API
  const [gatewayConfig, setGatewayConfig] = useState({
    enabled: true,
    walletNumber: '01012345678',
    instapayHandle: 'abeergad@instapay',
    exchangeRateUsdToEgp: 50.0,
    instructionsAr:
      'قم بالتحويل عبر فودافون كاش أو إنستاباي أو أي محفظة مصرية إلى الرقم الموضح، ثم سجل رقم المحفظة المحول منها ورقم العملية لتأكيد الحجز فوراً.',
    instructionsEn:
      'Transfer via Vodafone Cash, InstaPay, or any Egyptian wallet to the provided details, then submit your sender number and transaction reference.',
  });

  // Selected Wallet
  const [selectedWalletId, setSelectedWalletId] = useState<string>('VODAFONE_CASH');

  // Customer Form State
  const [name, setName] = useState(studentName);
  const [email, setEmail] = useState(studentEmail);
  const [phone, setPhone] = useState(studentPhone);
  const [senderWallet, setSenderWallet] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  // Copy state
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);

  useEffect(() => {
    if (studentName) setName(studentName);
    if (studentEmail) setEmail(studentEmail);
    if (studentPhone) setPhone(studentPhone);
  }, [studentName, studentEmail, studentPhone]);

  // Fetch live gateway settings
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data?.settings?.shehnawi) {
          setGatewayConfig((prev) => ({
            ...prev,
            ...data.settings.shehnawi,
          }));
        }
      } catch (err) {
        console.warn('Could not fetch Shehnawi settings, using default:', err);
      }
    };
    fetchConfig();
  }, []);

  const rate = gatewayConfig.exchangeRateUsdToEgp || 50;
  const amountEgp = Math.round(amount * rate);

  const selectedWallet =
    SUPPORTED_WALLETS.find((w) => w.id === selectedWalletId) || SUPPORTED_WALLETS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTarget(id);
    setTimeout(() => setCopiedTarget(null), 2000);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage(isRtl ? 'يرجى إدخال اسمك بالكامل' : 'Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(isRtl ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email');
      return;
    }
    if (!phone.trim() || phone.trim().replace(/\D/g, '').length < 6) {
      setErrorMessage(isRtl ? 'يرجى إدخال رقم هاتف للتواصل' : 'Please enter a valid phone number');
      return;
    }
    if (!senderWallet.trim()) {
      setErrorMessage(
        isRtl
          ? 'يرجى كتابة رقم المحفظة أو معرف إنستاباي المحوّل منه'
          : 'Please enter the sender wallet number or InstaPay handle'
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/payments/shehnawi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType,
          itemId,
          itemTitle,
          amount,
          amountEgp,
          studentName: name.trim(),
          studentEmail: email.trim(),
          studentPhone: phone.trim(),
          walletProvider: selectedWallet.id,
          senderWalletNumber: senderWallet.trim(),
          transactionRef: transactionRef.trim() || `REF-${Date.now().toString().slice(-6)}`,
          slotDate,
          slotTime,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (isRtl ? 'فشل تأكيد العملية، يرجى المحاولة لاحقاً' : 'Failed to confirm payment'));
      }

      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err: any) {
      console.error('Shehnawi payment error:', err);
      setErrorMessage(err.message || (isRtl ? 'حدث خطأ أثناء معالجة الطلب' : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  // If disabled by Admin, don't show
  if (!gatewayConfig.enabled) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setSuccess(false);
          setErrorMessage(null);
        }}
        className={
          className ||
          'w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-purple-700 to-indigo-800 hover:from-red-700 hover:via-purple-800 hover:to-indigo-900 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg'
        }
      >
        <Wallet className="w-4 h-4 text-amber-300 shrink-0" />
        <span>
          {buttonLabel ||
            (isRtl
              ? `دفع بمحافظ مصر وإنستاباي (شحناوي) • ${amountEgp.toLocaleString('ar-EG')} ج.م`
              : `Egypt Wallets & InstaPay (Shehnawi) • ${amountEgp.toLocaleString()} EGP`)}
        </span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-surface-border overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-navy-950 via-purple-950 to-navy-900 text-white p-5 sm:p-6 border-b border-purple-900/50">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute end-4 top-4 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black tracking-wide">
                      {isRtl ? 'بوابة شحناوي • المحافظ الإلكترونية وإنستاباي' : 'Shehnawi Gateway • Egypt E-Wallets'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {isRtl ? 'دفع لحظي في مصر' : 'Instant in Egypt'}
                    </span>
                  </div>
                  <p className="text-xs text-purple-200/80 mt-0.5">
                    {isRtl
                      ? 'فودافون كاش، إنستاباي، أورنج كاش، اتصالات كاش، وي باي، والمحافظ الذكية'
                      : 'Vodafone Cash, InstaPay IPN, Orange, Etisalat, WE Pay & Smart Wallets'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-5">
              {success ? (
                /* Success Screen */
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-navy-950">
                      {isRtl ? 'تم تأكيد حجزك وتسجيلك بنجاح!' : 'Payment & Booking Confirmed!'}
                    </h4>
                    <p className="text-xs text-navy-600 mt-1 max-w-md mx-auto">
                      {isRtl
                        ? `شكراً لك، تم استقبال تفاصيل التحويل بنجاح لحساب (${itemTitle}). سنتواصل معك فوراً عبر الواتساب لتأكيد تفاصيل الجلسة.`
                        : `Thank you! Your payment details for (${itemTitle}) have been recorded. We will contact you via WhatsApp.`}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-muted border border-surface-border inline-block text-xs text-navy-800 space-y-1 text-start">
                    <div>
                      <span className="text-navy-500">{isRtl ? 'البند:' : 'Item:'} </span>
                      <strong>{itemTitle}</strong>
                    </div>
                    <div>
                      <span className="text-navy-500">{isRtl ? 'المبلغ المسدد:' : 'Amount Paid:'} </span>
                      <strong className="text-brand-800 font-mono">
                        {amountEgp.toLocaleString()} EGP (${amount} USD)
                      </strong>
                    </div>
                    <div>
                      <span className="text-navy-500">{isRtl ? 'طريقة الدفع:' : 'Method:'} </span>
                      <strong>{selectedWallet.nameAr} (بوابة شحناوي)</strong>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      {isRtl ? 'إغلاق ومتابعة' : 'Close and Continue'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleConfirmPayment} className="space-y-4">
                  {/* Order Summary Box */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-50/60 to-purple-50/40 border border-brand-200/70 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-navy-500 block">
                        {isRtl ? 'المطلوب سداده:' : 'Total Amount Due:'}
                      </span>
                      <span className="font-extrabold text-navy-950 text-xs sm:text-sm line-clamp-1">
                        {itemTitle}
                      </span>
                    </div>
                    <div className="text-end">
                      <div className="text-lg sm:text-xl font-black text-brand-800 font-mono">
                        {amountEgp.toLocaleString()} <span className="text-xs font-bold">ج.م</span>
                      </div>
                      <div className="text-[10px] text-navy-500 font-mono">
                        ${amount} USD • ($1 = {rate} ج.م)
                      </div>
                    </div>
                  </div>

                  {/* Wallet Providers Tabs */}
                  <div>
                    <label className="text-xs font-extrabold text-navy-900 block mb-2">
                      {isRtl ? 'اختر محفظتك الإلكترونية / تطبيق الدفع:' : 'Choose Your E-Wallet Provider:'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SUPPORTED_WALLETS.map((w) => {
                        const isChosen = selectedWalletId === w.id;
                        return (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => setSelectedWalletId(w.id)}
                            className={`p-2.5 rounded-xl border text-start transition-all flex flex-col justify-between ${
                              isChosen
                                ? 'border-brand-700 bg-brand-50/80 shadow-sm ring-2 ring-brand-500/20'
                                : 'border-surface-border bg-white hover:border-surface-borderSubtle hover:bg-surface-muted'
                            }`}
                          >
                            <span className="text-[10px] font-bold text-navy-500 uppercase tracking-wider block">
                              {w.badge}
                            </span>
                            <span className="text-xs font-black text-navy-950 mt-1 block">
                              {isRtl ? w.nameAr : w.nameEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Transfer Destination Box */}
                  <div className="p-4 rounded-2xl bg-navy-950 text-white space-y-3 shadow-sm border border-purple-900">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-200">
                        {selectedWallet.id === 'INSTAPAY'
                          ? isRtl
                            ? 'معرف إنستاباي الرسمي للتحويل (InstaPay IPN):'
                            : 'Official InstaPay Handle:'
                          : isRtl
                          ? `رقم محفظة التحويل (${selectedWallet.nameAr}):`
                          : `Transfer Destination Number (${selectedWallet.nameEn}):`}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500 text-white font-bold">
                        {isRtl ? 'بوابة شحناوي' : 'Shehnawi Pay'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 border border-white/15">
                      <span className="font-mono text-base sm:text-lg font-black tracking-wider text-amber-300">
                        {selectedWallet.id === 'INSTAPAY'
                          ? gatewayConfig.instapayHandle
                          : gatewayConfig.walletNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            selectedWallet.id === 'INSTAPAY'
                              ? gatewayConfig.instapayHandle
                              : gatewayConfig.walletNumber,
                            'dest'
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                      >
                        {copiedTarget === 'dest' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{isRtl ? 'تم النسخ!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'نسخ' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-purple-200/90 leading-relaxed">
                      💡{' '}
                      {isRtl
                        ? gatewayConfig.instructionsAr
                        : gatewayConfig.instructionsEn}
                    </p>
                  </div>

                  {/* Student Inputs */}
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-navy-700 block mb-1">
                          {isRtl ? 'الاسم بالكامل *' : 'Full Name *'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={isRtl ? 'اكتب اسمك الثلاثي' : 'Your full name'}
                            className="w-full px-3 py-2 ps-8 rounded-xl border border-surface-border text-xs focus:ring-2 focus:ring-brand-500/20"
                          />
                          <User className="w-3.5 h-3.5 absolute start-2.5 top-2.5 text-navy-400" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-navy-700 block mb-1">
                          {isRtl ? 'البريد الإلكتروني *' : 'Email *'}
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@example.com"
                            className="w-full px-3 py-2 ps-8 rounded-xl border border-surface-border text-xs focus:ring-2 focus:ring-brand-500/20"
                          />
                          <Mail className="w-3.5 h-3.5 absolute start-2.5 top-2.5 text-navy-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-navy-700 block mb-1">
                          {isRtl ? 'رقم الواتساب للتواصل *' : 'WhatsApp / Mobile *'}
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="010XXXXXXXX"
                            className="w-full px-3 py-2 ps-8 rounded-xl border border-surface-border text-xs focus:ring-2 focus:ring-brand-500/20 font-mono"
                          />
                          <Phone className="w-3.5 h-3.5 absolute start-2.5 top-2.5 text-navy-400" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-navy-700 block mb-1">
                          {isRtl
                            ? 'رقم المحفظة / الحساب المحول منه *'
                            : 'Sender Wallet Phone / IPN Username *'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={senderWallet}
                            onChange={(e) => setSenderWallet(e.target.value)}
                            placeholder={isRtl ? 'الرقم الذي قمت بالتحويل منه' : 'Sender mobile number or username'}
                            className="w-full px-3 py-2 ps-8 rounded-xl border border-brand-300 bg-brand-50/20 text-xs focus:ring-2 focus:ring-brand-500/20 font-mono"
                          />
                          <Smartphone className="w-3.5 h-3.5 absolute start-2.5 top-2.5 text-brand-600" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-navy-700 block mb-1">
                          {isRtl ? 'كود العملية / الرقم المرجعي (اختياري)' : 'Transaction Ref / Code (Optional)'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            placeholder={isRtl ? 'رقم الإشعار أو كود الحوالة' : 'e.g. 98457201'}
                            className="w-full px-3 py-2 ps-8 rounded-xl border border-surface-border text-xs focus:ring-2 focus:ring-brand-500/20 font-mono"
                          />
                          <FileCheck className="w-3.5 h-3.5 absolute start-2.5 top-2.5 text-navy-400" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-navy-700 block mb-1">
                          {isRtl ? 'ملاحظات إضافية' : 'Additional Notes'}
                        </label>
                        <input
                          type="text"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder={isRtl ? 'أي ملاحظات ترغب بإرفاقها' : 'Any requests'}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs focus:ring-2 focus:ring-brand-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-purple-700 to-indigo-800 hover:from-red-700 hover:via-purple-800 hover:to-indigo-900 text-white font-extrabold text-xs shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isRtl ? 'جاري التحقق وتأكيد الدفع...' : 'Verifying and Confirming...'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>
                            {isRtl
                              ? `تأكيد التحويل وحجز الحصة (${amountEgp.toLocaleString()} ج.م)`
                              : `Confirm Payment & Book (${amountEgp.toLocaleString()} EGP)`}
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="pt-1 text-center">
                    <span className="text-[11px] text-navy-500 inline-flex items-center gap-1.5 justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {isRtl
                          ? 'بوابة شحnaوي للمحافظ الإلكترونية • تسجيل مباشر معتمد في لوحة تحكم الأكاديمية'
                          : 'Shehnawi Payment Network • Direct verified academy enrollment'}
                      </span>
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
