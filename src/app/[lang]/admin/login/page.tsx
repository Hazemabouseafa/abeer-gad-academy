'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight, Key, Loader2 } from 'lucide-react';

function AdminLoginForm({ lang }: { lang: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || `/${lang}/admin`;
  const isRtl = lang === 'ar';

  const [secretKey, setSecretKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(redirectPath);
      } else {
        setErrorMessage(
          data.error ||
            (isRtl
              ? 'رمز المرور غير صحيح. يرجى إدخال رمز الإدارة المعتمد.'
              : 'Invalid secret key. Please provide valid administrative credentials.')
        );
      }
    } catch (err) {
      setErrorMessage(
        isRtl ? 'حدث خطأ في الاتصال بالخادم.' : 'Connection error. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md academy-card p-8 bg-white border border-surface-border shadow-card-hover space-y-6">
      <div className="text-center space-y-3">
        <div className="w-24 h-24 mx-auto flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-icon.png"
            alt="Abeer Gad Academy"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
        <h2 className="text-2xl font-extrabold text-navy-950">
          {isRtl ? 'بوابة الإدارة والتحكم المركزي' : 'Administrative Access'}
        </h2>
        <p className="text-xs text-navy-500">
          ABEER GAD Academy Secured Operations Portal
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-navy-700 block mb-1">
            {isRtl ? 'رمز المرور السري للإدارة' : 'Admin Secret Key'}
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-navy-400 absolute start-3 top-3" />
            <input
              type="password"
              required
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
                setErrorMessage('');
              }}
              placeholder={isRtl ? 'أدخل رمز الإدارة السري' : 'Enter admin secret key'}
              className="w-full ps-9 pe-3 py-2 rounded-xl border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          {errorMessage && (
            <span className="text-[11px] text-red-600 mt-1.5 block font-medium">
              {errorMessage}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isRtl ? 'جاري التحقق...' : 'Authenticating...'}</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>{isRtl ? 'تسجيل الدخول الآمن' : 'Authenticate'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 border-t border-surface-borderSubtle text-center">
        <span className="text-[11px] text-navy-400">
          {isRtl ? 'نظام مشفر وآمن خاص بإدارة المنصة' : 'Secured SSL Operations Environment'}
        </span>
      </div>
    </div>
  );
}

export default function AdminLoginPage({ params: { lang } }: { params: { lang: string } }) {
  return (
    <div className="py-16 sm:py-24 bg-[#FDFBF7] min-h-[75vh] flex items-center justify-center px-4">
      <Suspense fallback={<div className="p-8 text-sm text-navy-600">Loading admin authentication...</div>}>
        <AdminLoginForm lang={lang} />
      </Suspense>
    </div>
  );
}
