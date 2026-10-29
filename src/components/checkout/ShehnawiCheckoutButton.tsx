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
  Clock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { SUPPORTED_WALLETS, WalletProviderOption, SHA7NAWY_ERROR_CODES } from '@/lib/shehnawi-constants';

interface ShehnawiCheckoutButtonProps {
  itemId: string;
  itemType: 'COURSE' | 'PRIVATE_LESSON' | 'RESOURCE';
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
  const [step, setStep] = useState<'FORM' | 'PROMPT_APPROVAL' | 'SUCCESS'>('FORM');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Gateway Settings fetched from API
  const [gatewayConfig, setGatewayConfig] = useState({
    enabled: true,
    walletNumber: '01012345678',
    instapayHandle: 'abeergad@instapay',
    exchangeRateUsdToEgp: 50.0,
    instructionsAr:
      'قم باختيار المحفظة وإدخال رقم هاتفك لتنفيذ السحب الآمن عبر بوابة شحناوي الرسمية (API v2).',
    instructionsEn:
      'Select your wallet provider and enter your mobile number for secure instant deduction via Sha7nawy Gate (API v2).',
  });

  // Selected Wallet
  const [selectedWalletId, setSelectedWalletId] = useState<string>('VODAFONE_CASH');

  // Customer Form State
  const [name, setName] = useState(studentName);
  const [email, setEmail] = useState(studentEmail);
  const [phone, setPhone] = useState(studentPhone);
  const [senderWallet, setSenderWallet] = useState('');
  const [notes, setNotes] = useState('');

  // Sha7nawy API v2 Response State
  const [sha7nawyReference, setSha7nawyReference] = useState<string>('');
  const [sha7nawyOrderId, setSha7nawyOrderId] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(60);

  // Copy state
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);

  useEffect(() => {
    if (studentName) setName(studentName);
    if (studentEmail) setEmail(studentEmail);
    if (studentPhone) {
      setPhone(studentPhone);
      if (!senderWallet) setSenderWallet(studentPhone);
    }
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

  // 60-second timer for approval prompt
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'PROMPT_APPROVAL' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const rate = gatewayConfig.exchangeRateUsdToEgp || 50;
  const amountEgp = Math.round(amount * rate);

  const selectedWallet =
    SUPPORTED_WALLETS.find((w) => w.id === selectedWalletId) || SUPPORTED_WALLETS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTarget(id);
    setTimeout(() => setCopiedTarget(null), 2000);
  };

  // Step 1: Initiate Payment with Sha7nawy API v2
  const handleInitiatePayment = async (e: React.FormEvent) => {
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
    if (!senderWallet.trim() || senderWallet.trim().replace(/\D/g, '').length < 8) {
      setErrorMessage(
        isRtl
          ? 'يرجى إدخال رقم محفظة هاتف صحيح (11 رقماً) للخصم منها'
          : 'Please enter a valid 11-digit wallet phone number'
      );
      return;
    }

    setLoading(true);

    try {
      // If InstaPay or direct wallet transfer is chosen, execute direct confirmation
      if (selectedWallet.sha7nawyMethod === 'instapay') {
        const res = await fetch('/api/payments/shehnawi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'direct',
            itemType,
            itemId,
            itemTitle,
            amount,
            amountEgp,
            studentName: name.trim(),
            studentEmail: email.trim(),
            studentPhone: phone.trim() || senderWallet.trim(),
            walletProvider: selectedWallet.id,
            senderWalletNumber: senderWallet.trim(),
            slotDate,
            slotTime,
            notes,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'فشلت عملية الدفع عبر إنستاباي');
        }
        setSha7nawyReference(data.reference || `SH_${Date.now()}`);
        setStep('SUCCESS');
        if (onSuccess) {
          setTimeout(() => onSuccess(), 1200);
        }
        return;
      }

      // For Vodafone / Orange / Etisalat Cash: call Sha7nawy API v2.0 /payment/create
      const res = await fetch('/api/payments/shehnawi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          itemType,
          itemId,
          itemTitle,
          amount,
          amountEgp,
          studentName: name.trim(),
          studentEmail: email.trim(),
          studentPhone: phone.trim() || senderWallet.trim(),
          walletProvider: selectedWallet.sha7nawyMethod,
          senderWalletNumber: senderWallet.trim(),
          slotDate,
          slotTime,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const codeInfo = data.code ? SHA7NAWY_ERROR_CODES[data.code] : null;
        throw new Error(
          codeInfo
            ? isRtl ? codeInfo.ar : codeInfo.en
            : data.error || (isRtl ? 'تعذر إنشاء طلب الدفع عبر شحناوي' : 'Failed to create payment')
        );
      }

      setSha7nawyReference(data.reference);
      setSha7nawyOrderId(data.orderId);
      setCountdown(60);
      setStep('PROMPT_APPROVAL');
    } catch (err: any) {
      console.error('Sha7nawy payment initiation error:', err);
      setErrorMessage(err.message || (isRtl ? 'حدث خطأ أثناء معالجة الطلب' : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm Payment with Sha7nawy API v2
  const handleConfirmDeduction = async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/payments/shehnawi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm',
          reference: sha7nawyReference,
          itemId,
          itemType,
          itemTitle,
          studentName: name.trim(),
          studentEmail: email.trim(),
          studentPhone: phone.trim() || senderWallet.trim(),
          slotDate,
          slotTime,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (isRtl ? 'تعذر تأكيد السحب، يرجى التأكد من الموافقة على هاتفك' : 'Confirmation failed'));
      }

      setStep('SUCCESS');
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1200);
      }
    } catch (err: any) {
      console.error('Sha7nawy confirmation error:', err);
      setErrorMessage(err.message || (isRtl ? 'يرجى الموافقة على هاتفك أولاً ثم الضغط على تأكيد' : 'Please approve on your phone first'));
    } finally {
      setLoading(false);
    }
  };

  if (!gatewayConfig.enabled) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setStep('FORM');
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
              ? `دفع بمحافظ مصر وإنستاباي (شحناوي v2) • ${amountEgp.toLocaleString('ar-EG')} ج.م`
              : `Egypt Wallets & InstaPay (Sha7nawy v2) • ${amountEgp.toLocaleString()} EGP`)}
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
                      {isRtl ? 'بوابة شحناوي الرسمية • Sha7nawy Gate v2.0' : 'Sha7nawy Gate Official Payment API v2.0'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      API v2.0
                    </span>
                  </div>
                  <p className="text-xs text-purple-200/80 mt-0.5">
                    {isRtl
                      ? 'دفع فوري مباشر: فودافون كاش، أورنج كاش، اتصالات كاش، إنستاباي'
                      : 'Direct instant mobile deduction: Vodafone Cash, Orange Cash, Etisalat Cash'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-5">
              {/* ======================================================== */}
              {/* STEP 3: SUCCESS CELEBRATION */}
              {/* ======================================================== */}
              {step === 'SUCCESS' && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-navy-950">
                      {isRtl ? 'تم تأكيد حجزك والدفع بنجاح عبر شحناوي!' : 'Payment & Booking Confirmed!'}
                    </h4>
                    <p className="text-xs text-navy-600 mt-1 max-w-md mx-auto">
                      {isRtl
                        ? `شكراً لك! تم استلام وتأكيد العملية بنجاح للبند (${itemTitle}). رقم المعاملة المعتمد: ${sha7nawyReference}`
                        : `Thank you! Your payment for (${itemTitle}) has been verified. Reference: ${sha7nawyReference}`}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-muted border border-surface-border inline-block text-xs text-navy-800 space-y-1.5 text-start w-full max-w-md">
                    <div className="flex justify-between">
                      <span className="text-navy-500">{isRtl ? 'البند:' : 'Item:'}</span>
                      <strong className="text-navy-900">{itemTitle}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-500">{isRtl ? 'المبلغ المسدد:' : 'Amount Paid:'}</span>
                      <strong className="text-brand-800 font-mono">
                        {amountEgp.toLocaleString()} EGP (${amount} USD)
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-500">{isRtl ? 'رقم المرجع (Reference):' : 'Reference:'}</span>
                      <strong className="font-mono text-purple-900">{sha7nawyReference}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-500">{isRtl ? 'طريقة الدفع:' : 'Method:'}</span>
                      <strong>{selectedWallet.nameAr}</strong>
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
              )}

              {/* ======================================================== */}
              {/* STEP 2: PROMPT APPROVAL (Sha7nawy API v2.0 Live Prompt) */}
              {/* ======================================================== */}
              {step === 'PROMPT_APPROVAL' && (
                <div className="space-y-4">
                  {/* Reference & Timer Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950 to-navy-950 text-white space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-200">
                        {isRtl ? 'كود المرجع للعملية (Reference):' : 'Transaction Reference:'}
                      </span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400 text-navy-950 text-xs font-black">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{countdown} {isRtl ? 'ثانية' : 'sec'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 border border-white/20">
                      <span className="font-mono text-lg font-black text-amber-300 tracking-wider">
                        {sha7nawyReference}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(sha7nawyReference, 'ref')}
                        className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold flex items-center gap-1"
                      >
                        {copiedTarget === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTarget === 'ref' ? (isRtl ? 'تم!' : 'Copied!') : (isRtl ? 'نسخ' : 'Copy')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Wallet-specific phone instruction box */}
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2">
                    <div className="flex items-center gap-2 font-black text-xs text-amber-900">
                      <Smartphone className="w-4 h-4 text-amber-700" />
                      <span>
                        {isRtl ? 'الخطوة المطلوبة على هاتفك الآن:' : 'Action Required on Your Phone Now:'}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed font-bold">
                      {isRtl ? selectedWallet.promptInstructionsAr : selectedWallet.promptInstructionsEn}
                    </p>

                    {selectedWallet.ussdCode && (
                      <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-center font-mono font-black text-sm text-brand-800">
                        {selectedWallet.ussdCode}
                      </div>
                    )}
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Confirm Deduction Button */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleConfirmDeduction}
                      disabled={loading}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isRtl ? 'جاري التحقق من السحب...' : 'Verifying Deduction...'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-amber-300" />
                          <span>
                            {isRtl
                              ? `لقد وافقت على هاتفي - إتمام الحجز الآن (${amountEgp.toLocaleString()} ج.م)`
                              : `I Approved on My Phone - Complete Booking`}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep('FORM')}
                      className="w-full py-2 text-navy-500 hover:text-navy-800 text-xs font-bold transition-colors"
                    >
                      {isRtl ? '← العودة وتغيير رقم المحفظة' : '← Back and Change Wallet'}
                    </button>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* STEP 1: PAYMENT FORM */}
              {/* ======================================================== */}
              {step === 'FORM' && (
                <form onSubmit={handleInitiatePayment} className="space-y-4">
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
                      {isRtl ? 'اختر طريقة الدفع عبر شحناوي (API v2.0):' : 'Choose Sha7nawy Payment Method (v2.0):'}
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

                  {/* Notice Box */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-purple-950 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-purple-900">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      <span>
                        {selectedWallet.sha7nawyMethod === 'vf_cash'
                          ? isRtl ? 'فودافون كاش: سيُطلب منك طلب كود #1*9* لتأكيد السحب' : 'Vodafone Cash: Dial *9*1# to approve'
                          : selectedWallet.sha7nawyMethod === 'or_cash'
                          ? isRtl ? 'أورنج كاش: ستصلك إشعار موافقة على تطبيق أورنج كاش' : 'Orange Cash: Approve in app'
                          : selectedWallet.sha7nawyMethod === 'et_cash'
                          ? isRtl ? 'اتصالات كاش: اطلب #11*777* أو وافق عبر e& Money' : 'Etisalat Cash: Dial *777*11#'
                          : isRtl ? 'إنستاباي: تحويل لحظي مباشر لحساب الأكاديمية' : 'InstaPay: Direct instant IPN'}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-800/80">
                      {isRtl
                        ? 'عملية سحب آمنة 100% ومشفرة عبر بوابة شحناوي الرسمية بدون أي رسوم إضافية.'
                        : '100% encrypted & verified via Sha7nawy Payment Gateway.'}
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
                            ? 'رقم محفظة الدفع للخصم منها (11 رقماً) *'
                            : 'Egyptian Wallet Phone (11 digits) *'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={senderWallet}
                            onChange={(e) => setSenderWallet(e.target.value)}
                            placeholder="010XXXXXXXX"
                            className="w-full px-3 py-2 ps-8 rounded-xl border border-brand-300 bg-brand-50/20 text-xs focus:ring-2 focus:ring-brand-500/20 font-mono font-bold text-navy-950"
                          />
                          <Smartphone className="w-3.5 h-3.5 absolute start-2.5 top-2.5 text-brand-600" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-navy-700 block mb-1">
                        {isRtl ? 'ملاحظات إضافية للمعلمة' : 'Additional Notes'}
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
                          <span>{isRtl ? 'جاري إرسال طلب السحب لبوابة شحناوي...' : 'Sending Request to Sha7nawy...'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>
                            {selectedWallet.sha7nawyMethod === 'instapay'
                              ? isRtl
                                ? `تأكيد الدفع والتسجيل (${amountEgp.toLocaleString()} ج.م)`
                                : `Confirm Booking (${amountEgp.toLocaleString()} EGP)`
                              : isRtl
                              ? `طلب سحب الرسوم وتأكيد الحجز (${amountEgp.toLocaleString()} ج.م) ⚡`
                              : `Request Deduction (${amountEgp.toLocaleString()} EGP)`}
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
                          ? 'بوابة شحناوي (Sha7nawy Gate v2.0) • معتمدة ومشفرة لجميع شبكات المحافظ في مصر'
                          : 'Official Sha7nawy Gate v2.0 API • Encrypted and verified sitewide'}
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
