'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled platform error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FDFBF7] px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 academy-card p-8 sm:p-10 bg-white border border-surface-border rounded-3xl shadow-card-hover">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950">
            حدث خطأ غير متوقع | An Unexpected Error Occurred
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
            نعتذر عن هذا الخطأ المؤقت. تم تسجيل المشكلة ويمكنك إعادة المحاولة أو العودة إلى الصفحة الرئيسية.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-gold-300" />
            <span>إعادة المحاولة (Try Again)</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Home className="w-4 h-4 text-gold-400" />
            <span>الرئيسية (Home)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
