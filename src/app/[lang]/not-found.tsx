import Link from 'next/link';
import { BookOpen, Home, ArrowRight, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FDFBF7] px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 academy-card p-8 sm:p-10 bg-white border border-surface-border rounded-3xl shadow-card-hover">
        <div className="w-16 h-16 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center mx-auto border border-gold-200">
          <Sparkles className="w-8 h-8 text-gold-600" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-black text-brand-800 tracking-tight block">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-950">
            الصفحة غير موجودة | Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
            عذراً، الصفحة التي تبحث عنها غير متوفرة أو ربما تم نقلها. يمكنك العودة إلى الصفحة الرئيسية أو استكشاف برامج ودورات الأكاديمية.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Home className="w-4 h-4 text-gold-300" />
            <span>الرئيسية (Home)</span>
          </Link>

          <Link
            href="/courses"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <BookOpen className="w-4 h-4 text-gold-400" />
            <span>الدورات (Courses)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
