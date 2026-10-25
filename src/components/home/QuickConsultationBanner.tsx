'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Phone, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface QuickConsultationBannerProps {
  currentLocale: string;
}

export function QuickConsultationBanner({ currentLocale }: QuickConsultationBannerProps) {
  const isRtl = currentLocale === 'ar';
  const [whatsappNum, setWhatsappNum] = useState('201000000000');
  const [phoneDisplay, setPhoneDisplay] = useState('+20 100 000 0000');

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;
        if (data.settings?.whatsappNumber) {
          const rawWa = data.settings.whatsappNumber.replace(/[^0-9]/g, '');
          if (rawWa) setWhatsappNum(rawWa);
        }
        if (data.settings?.contactPhone) {
          setPhoneDisplay(data.settings.contactPhone);
        }
      } catch (e) {
        // Fallback gracefully
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const whatsappMsg = encodeURIComponent(
    isRtl
      ? 'السلام عليكم، أود الحصول على استشارة تعليمية لتحديد المستوى واختيار المسار المناسب.'
      : 'Hello, I would like to request an educational consultation to determine my level and choose the right program.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${whatsappMsg}`;

  return (
    <section className="py-12 bg-[#FAF7F0] border-t border-surface-borderSubtle">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-navy-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle geometric light effect */}
          <div className="absolute top-0 end-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-0 start-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-start">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-gold-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRtl ? 'استشارة مجانية وتحديد المستوى' : 'Free Placement & Guidance Session'}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                {isRtl
                  ? 'محتار في اختيار الخدمة أو المسار الأنسب لك أو لأبنائك؟'
                  : 'Unsure which pathway or service fits your goals best?'}
              </h3>

              <p className="text-sm sm:text-base text-brand-100/90 leading-relaxed">
                {isRtl
                  ? 'تواصل مباشرة مع الأستاذة عبير جاد وفريق الأكاديمية عبر واتساب، لنساعدك في تقييم مستواك الصوتي أو اللغوي ووضع خطة دراسية تناسب جدولك.'
                  : 'Connect directly with Ustadha Abeer Gad and the academic advisors on WhatsApp for a personalized level evaluation and tailored study plan.'}
              </p>

              <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-brand-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>{isRtl ? 'تقييم مجاني وسريع' : 'Fast & Free Placement'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>{isRtl ? 'مرونة في المواعيد' : 'Flexible Timezones'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>{isRtl ? 'إشراف مسند بالسند المتصل' : 'Continuous Sanad Supervision'}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-sm shadow-lg hover:shadow-gold-500/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5 text-navy-950" />
                <span>{isRtl ? 'تحدث معنا عبر واتساب الآن' : 'Chat on WhatsApp Now'}</span>
              </a>

              <a
                href={`tel:${phoneDisplay.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all duration-200"
              >
                <Phone className="w-4 h-4 text-gold-300" />
                <span dir="ltr">{phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
