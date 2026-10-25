'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, Award } from 'lucide-react';
import type { TestimonialItem } from '@/lib/data-store';

const fallbackTestimonials: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Dr. Tariq Al-Mansoor',
    location: 'London, United Kingdom',
    flag: '🇬🇧',
    focus: 'Classical Arabic & Nahw',
    focusAr: 'النحو والصرف العربي',
    quote:
      'Ustadha Abeer Gad possesses a rare pedagogical gift. In 6 months, my ability to analyze classical Islamic texts and understand Quranic nuances reached an unprecedented level of clarity.',
    quoteAr:
      'تمتلك الأستاذة عبير جاد أسلوباً تعليمياً فريداً ومؤثراً. خلال 6 أشهر استطعت قراءة أمهات الكتب وفهم أسرار الإعراب والنظم القرآني بكل ثقة.',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Fatima Zahra Benali',
    location: 'Paris, France',
    flag: '🇫🇷',
    focus: 'Quran Memorization & Tajweed',
    focusAr: 'حفظ القرآن والتجويد',
    quote:
      'The spaced revision system and her gentle, precise correction of Makhaarij transformed my Hifz. I successfully memorized Surat Al-Baqarah and received my Tajweed certificate.',
    quoteAr:
      'نظام المراجعة المتباعدة وتصحيح مخارج الحروف الدقيق غيّر مسيرتي في الحفظ. أتممت حفظ سورة البقرة واجتزت اختبار التجويد بنجاح.',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Brother Marcus (Bilal)',
    location: 'Munich, Germany',
    flag: '🇩🇪',
    focus: 'Quran Reading (Noorani Qaida)',
    focusAr: 'قراءة القرآن والقاعدة النورانية',
    quote:
      'Starting as an adult non-Arabic speaker was intimidating, but Ustadha Abeer made each letter intuitive. I am now reading fluently directly from the Mus\'haf with proper rules.',
    quoteAr:
      'البدء بتعلم القراءة كشخص غير ناطق بالعربية كان تحدياً كبيراً، لكن شرح الأستاذة عبير بسط كل حرف. الآن أقرأ القرآن بطلاقة مباشرة من المصحف.',
    rating: 5,
  },
];

interface TestimonialsSectionProps {
  currentLocale: string;
}

export function TestimonialsSection({ currentLocale }: TestimonialsSectionProps) {
  const isRtl = currentLocale === 'ar';
  const [items, setItems] = useState<TestimonialItem[]>(fallbackTestimonials);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings?.testimonials && Array.isArray(d.settings.testimonials) && d.settings.testimonials.length > 0) {
          setItems(d.settings.testimonials);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-[#FDFBF7]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <span className="badge-light">
            <Award className="w-3.5 h-3.5" />
            <span>{isRtl ? 'شهادات الطلاب والباحثين' : 'Student & Scholar Endorsements'}</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
            {isRtl ? 'قصص نجاح من شتى بقاع العالم' : 'Inspiring Stories from Global Students'}
          </h2>
          <p className="text-sm sm:text-base text-navy-600">
            {isRtl
              ? 'تجارب حقيقية لطلاب خاضوا رحلة تعلم اللغة العربية وحفظ القرآن الكريم مع الأكاديمية.'
              : 'Authentic student journeys in mastering Arabic syntax, phonetics, and holy memorization.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item) => (
            <div
              key={item.id || item.name}
              className="academy-card p-6 sm:p-7 flex flex-col justify-between hover:border-gold-300 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-gold-300 rotate-180" />
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-navy-700 leading-relaxed italic">
                  &ldquo;{isRtl && item.quoteAr ? item.quoteAr : item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 mt-4 border-t border-surface-borderSubtle flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-200 text-brand-800 flex items-center justify-center font-bold text-sm">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <span>{item.flag}</span>
                  </h4>
                  <span className="text-xs text-navy-500 block">
                    {isRtl && item.focusAr ? item.focusAr : item.focus} &bull; {item.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
