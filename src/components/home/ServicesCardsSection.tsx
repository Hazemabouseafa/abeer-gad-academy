'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import type { ServiceCardItem } from '@/lib/data-store';
import {
  BookOpen,
  ScrollText,
  Bookmark,
  GraduationCap,
  Calendar,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Award,
  ShieldCheck,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  categoryKey: 'all' | 'quran' | 'arabic' | 'private';
  href: string;
  badge: {
    ar: string;
    en: string;
  };
  title: {
    ar: string;
    en: string;
  };
  subtitle: {
    ar: string;
    en: string;
  };
  icon: typeof BookOpen;
  colorScheme: {
    badgeBg: string;
    iconBg: string;
    iconColor: string;
    borderColor: string;
    accentBtn: string;
  };
  meta: {
    level: { ar: string; en: string };
    format: { ar: string; en: string };
    duration: { ar: string; en: string };
    sanad: { ar: string; en: string };
  };
  features: {
    ar: string[];
    en: string[];
  };
  detailedSyllabus: {
    ar: { title: string; points: string[] }[];
    en: { title: string; points: string[] }[];
  };
  outcomes: {
    ar: string[];
    en: string[];
  };
  whatsappText: {
    ar: string;
    en: string;
  };
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'arabic-mastery',
    categoryKey: 'arabic',
    href: '/learn-arabic',
    badge: {
      ar: 'تأسيس وفصاحة ونحو',
      en: 'Phonetics to Fluency',
    },
    title: {
      ar: 'تعليم وإتقان اللغة العربية الشامل',
      en: 'Comprehensive Arabic Language Mastery',
    },
    subtitle: {
      ar: 'منهج متكامل يبدأ من مخارج الحروف الصوتية والكتابة، ويتدرج إلى إتقان النحو والصرف والمحادثة الفصيحة.',
      en: 'Structured pathway covering Arabic phonetics, script, morphology (Sarf), syntax (Nahw), and fluent conversation.',
    },
    icon: BookOpen,
    colorScheme: {
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      iconBg: 'bg-emerald-100/70 border-emerald-200',
      iconColor: 'text-emerald-700',
      borderColor: 'hover:border-emerald-300',
      accentBtn: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    },
    meta: {
      level: { ar: 'كافة المستويات (مبتدئ إلى متقدم)', en: 'All Levels (Beginner to Advanced)' },
      format: { ar: 'جلسات تفاعلية مباشرة أونلاين', en: 'Live Interactive Online Sessions' },
      duration: { ar: 'مستويات مرنة (40 دقيقة للجلسة)', en: 'Flexible Modules (40m / session)' },
      sanad: { ar: 'شهادة إتمام معتمدة من الأكاديمية', en: 'Certified Completion Certificate' },
    },
    features: {
      ar: [
        'تأسيس مخارج الحروف والأصوات اللغوية بدقة',
        'شرح مبسط لقواعد النحو (الجملة الاسمية والفعلية والإعراب)',
        'علم الصرف ونظام الجذور الثلاثية واشتقاق الكلمات',
        'تدريب عملي مكثف على المحادثة والفصاحة والتعبير',
      ],
      en: [
        'Accurate phonetics and letter articulation training',
        'Intuitive Nahw (syntax, parsing, and nominal/verbal sentences)',
        'Sarf morphology: Tri-literal roots and derivation',
        'Immersive conversation drills and expressive fluency',
      ],
    },
    detailedSyllabus: {
      ar: [
        {
          title: 'المستوى الأول: التأسيس الصوتي والكتابي',
          points: ['ضبط شكل الحروف بالحركات القصيرة والطويلة', 'التنوين والسكون وتفكيك المقاطع الصوتية', 'التدريب على القراءة الإملائية الصحيحة'],
        },
        {
          title: 'المستوى الثاني: أركان الجملة والنحو التطبيقي',
          points: ['المبتدأ والخبر والفاعل والمفعول به', 'علامات الإعراب الأصلية والفرعية', 'تطبيقات على نصوص فصيحة مختارة'],
        },
        {
          title: 'المستوى الثالث: الصرف وبناء الفصاحة',
          points: ['أوزان الأفعال والمشتقات واسم الفاعل والمفعول', 'حوارات يومية وأكاديمية تفاعلية', 'تذوق التراكيب البلاغية الرفيعة'],
        },
      ],
      en: [
        {
          title: 'Module 1: Phonetics & Script Foundation',
          points: ['Short and long vowels, nunation, and sukūn', 'Syllable segmentation and accurate orthography', 'Foundational reading and handwriting drills'],
        },
        {
          title: 'Module 2: Applied Syntax (Nahw)',
          points: ['Nominal & verbal sentences, subjects and predicates', 'Primary and secondary inflectional markers', 'Direct sentence parsing with selected prose'],
        },
        {
          title: 'Module 3: Morphology & Conversational Fluency',
          points: ['Verb paradigms and derivative noun systems', 'Real-time conversational immersion', 'Rhetorical nuance and classical text appreciation'],
        },
      ],
    },
    outcomes: {
      ar: [
        'القدرة على القراءة والكتابة بالفصحى بدون تردد',
        'إعراب الجمل وفهم بنية الكلام العربي بدقة',
        'إجراء حوارات باللغة العربية بطلاقة وثقة تامة',
      ],
      en: [
        'Fluent, unhesitating classical Arabic reading and writing',
        'Clear comprehension of sentence grammar and structural parsing',
        'Confidence to converse naturally in formal Arabic environments',
      ],
    },
    whatsappText: {
      ar: 'السلام عليكم، أود الاستفسار والتسجيل في برنامج تعليم وإتقان اللغة العربية.',
      en: 'Hello, I would like to inquire and enroll in the Comprehensive Arabic Language Program.',
    },
  },
  {
    id: 'quran-reading-tajweed',
    categoryKey: 'quran',
    href: '/quran-reading',
    badge: {
      ar: 'تصحيح التلاوة والنورانية',
      en: 'Recitation & Makhaarij',
    },
    title: {
      ar: 'قراءة القرآن الكريم وإتقان التجويد',
      en: 'Quran Reading & Tajweed Articulation',
    },
    subtitle: {
      ar: 'تأسيس رصين بمنهجية القاعدة النورانية، وضبط مخارج الحروف وصفاتها، وتصحيح التلاوة المباشرة من المصحف.',
      en: 'Solid foundational study via Noorani Qaida, phonetic articulation points (Makhaarij), and direct Mus\'haf recitation.',
    },
    icon: ScrollText,
    colorScheme: {
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-900',
      iconBg: 'bg-amber-100/70 border-amber-200',
      iconColor: 'text-amber-800',
      borderColor: 'hover:border-amber-300',
      accentBtn: 'bg-amber-700 hover:bg-amber-800 text-white',
    },
    meta: {
      level: { ar: 'للمبتدئين ومن يرغب في تصحيح التلاوة', en: 'Beginners & Recitation Correction' },
      format: { ar: 'تلقي صوتي ومرئي مباشر مع المعلمة', en: 'Direct Oral Recitation & Correction' },
      duration: { ar: 'جلسات تدريبية متدرجة (45 دقيقة)', en: 'Progressive Sessions (45m each)' },
      sanad: { ar: 'إشراف مسند بالأسانيد القرآنية المتصلة', en: 'Supervised under Authentic Sanad Standards' },
    },
    features: {
      ar: [
        'دراسة القاعدة النورانية بالتفصيل حرفاً بحرف',
        'ضبط مخارج الحروف الحلقية واللهوية واللسانية والشفوية',
        'تطبيق عملي لأحكام النون والميم الساكنتين والتنوين والمدود',
        'تصحيح التلاوة آية بآية من المصحف الشريف برواية حفص',
      ],
      en: [
        'In-depth letter-by-letter Noorani Qaida instruction',
        'Physical articulation accuracy (Throat, Palate, Tongue, Lips)',
        'Practical ahkām: Noon & Meem Sakinah, Madd, and Ghunnah timings',
        'Direct verse-by-verse recitation correction from the Mus\'haf',
      ],
    },
    detailedSyllabus: {
      ar: [
        {
          title: 'المرحلة الأولى: إتقان نطق الحروف المجردة والمركبة',
          points: ['مخارج وصفات الحروف (الهمس والجهر والرخاوة والشدة والاستعلاء)', 'الحركات وسكون الحرف وقلقلة حروف (قطب جد)', 'تفكيك الكلمات القرآنية الصعبة صوتياً'],
        },
        {
          title: 'المرحلة الثانية: أحكام التجويد الأساسية',
          points: ['الإظهار، الإدغام، الإقلاب، والإخفاء الحقيقي والشفوي', 'أحكام اللامات والراءات تفخيماً وترقيقاً', 'أزمنة الغنن وأحكام المد المتصل والمنفصل واللازم'],
        },
        {
          title: 'المرحلة الثالثة: التلاوة المسترسلة وعلامات الوقف',
          points: ['الوقف والابتداء والتعامل مع علامات المصحف', 'تطبيق الأحكام تلقائياً أثناء التلاوة بدون تكلف', 'جلسات محاكاة لتسجيلات كبار القراء المتقنين'],
        },
      ],
      en: [
        {
          title: 'Phase 1: Letter Articulation & Phonics',
          points: ['Makharij & Sifaat (whispering, loudness, softness, strength, elevation)', 'Vowel durations, Sukun, and Qalqalah mechanisms', 'Phonetic breakdown of intricate Quranic vocabulary'],
        },
        {
          title: 'Phase 2: Fundamental Tajweed Rules',
          points: ['Izhar, Idgham, Iqlab, and Ikhfa (real and labial)', 'Tafkheem (heaviness) and Tarqeeq (lightness) of Raa and Laam', 'Ghunnah durations and comprehensive Madd classifications'],
        },
        {
          title: 'Phase 3: Continuous Recitation & Waqf / Ibtida',
          points: ['Rules of stopping and starting and Mus\'haf orthography', 'Effortless automatic application during recitation', 'Masterclass simulations guided by scholarly tradition'],
        },
      ],
    },
    outcomes: {
      ar: [
        'تلاوة القرآن الكريم قراءة صحيحة خالية من اللحن الجلي والخفي',
        'القدرة على نطق أي كلمة قرآنية بدقة تامة ومخارج مضبوطة',
        'الاستعداد الكامل للالتحاق ببرامج الحفظ المتقن والإجازة بالسند',
      ],
      en: [
        'Reciting the Holy Qur\'an free from obvious and subtle errors',
        'Mastering pristine pronunciation of any Quranic word directly',
        'Readiness to transition into rigorous Hifz and Sanad certification',
      ],
    },
    whatsappText: {
      ar: 'السلام عليكم، أود الاستفسار والتسجيل في برنامج قراءة القرآن الكريم وإتقان التجويد.',
      en: 'Hello, I would like to inquire and enroll in the Quran Reading & Tajweed Program.',
    },
  },
  {
    id: 'quran-memorization-hifz',
    categoryKey: 'quran',
    href: '/quran-memorization',
    badge: {
      ar: 'حفظ راسخ وتكرار متباعد',
      en: 'Cognitive Hifz System',
    },
    title: {
      ar: 'منظومة حفظ القرآن الكريم وتثبيته',
      en: 'Quran Memorization & Retention Methodology',
    },
    subtitle: {
      ar: 'نظام حفظ منهجي يعتمد على خطط فردية مرنة، والتكرار المتباعد، وضبط المتشابهات اللفظية، والمتابعة الدورية المستمرة.',
      en: 'Individualized Hifz curricula leveraging spaced repetition algorithms, Mutashabihat mastery, and consistent revision cycles.',
    },
    icon: Bookmark,
    colorScheme: {
      badgeBg: 'bg-teal-50 border-teal-200 text-teal-800',
      iconBg: 'bg-teal-100/70 border-teal-200',
      iconColor: 'text-teal-700',
      borderColor: 'hover:border-teal-300',
      accentBtn: 'bg-teal-700 hover:bg-teal-800 text-white',
    },
    meta: {
      level: { ar: 'متاح للراغبين في حفظ أجزاء محددة أو المصحف كاملاً', en: 'Partial or Full Holy Qur\'an' },
      format: { ar: 'تسميع مباشر وجداول متابعة أسبوعية دقيقة', en: 'Live Oral Recitation & Tracking Reports' },
      duration: { ar: 'خطط مخصصة (يومية أو أسبوعية)', en: 'Customized Daily / Weekly Pacing' },
      sanad: { ar: 'مسار تأهيل رسمي لختمة الإجازة بالسند', en: 'Direct Pathway to Continuous Sanad Ijazah' },
    },
    features: {
      ar: [
        'خطة حفظ مرنة تراعي وقت الطالب وقدرته الذهنية واستيعابه',
        'تقنية التكرار المتباعد لضمان عدم نسيان المحفوظ القديم',
        'معالجة المتشابهات اللفظية وضبط الآيات المتقاربة بالروابط الذهنية',
        'اختبارات إتقان دورية مع كشف علامات وملاحظات المعلمة',
      ],
      en: [
        'Tailored memory roadmap adapted to student schedule and capacity',
        'Spaced repetition methodology safeguarding previously memorized Juz',
        'Systematic Mutashabihat analysis preventing common verbal mix-ups',
        'Scheduled milestone exams with detailed instructor evaluations',
      ],
    },
    detailedSyllabus: {
      ar: [
        {
          title: 'الركيزة الأولى: الورد اليومي الجديد (الحفظ الجديد)',
          points: ['تفكيك الوجه وحفظه بالربط البصري للمصحف الشريف', 'التسميع المباشر وضبط التشكيل وحركات الإعراب بدقة', 'التكرار التثبيتي قبل الانتقال للوجه التالي'],
        },
        {
          title: 'الركيزة الثانية: مراجعة القريب والبعيد (الورد الماضي)',
          points: ['جدول دوري لمراجعة آخر 5 أوجه يومياً', 'مراجعة الأجزاء القديمة بنظام الحلقات الدائرية المتكررة', 'تثبيت محفوظ الشهر الماضي بدون انقطاع'],
        },
        {
          title: 'الركيزة الثالثة: ربط المتشابهات واختبارات الإتقان',
          points: ['جداول مقارنة للآيات المتشابهة في نفس السورة وعبر السور', 'اختبارات عشوائية من أول ووسط ونهايات الأوجه', 'التأهيل لختمات السرد الكاملة تمهيداً للإجازة بالسند'],
        },
      ],
      en: [
        {
          title: 'Pillar 1: New Daily Portion (Sabaq)',
          points: ['Visual page layout mapping with dedicated Mus\'haf consistency', 'Oral recitation check ensuring zero voweling errors', 'Retention consolidation cycle before moving forward'],
        },
        {
          title: 'Pillar 2: Cumulative Revision (Sabqi & Manzil)',
          points: ['Daily revision of the most recent 5 to 10 pages', 'Cyclical rotation covering older Juz to maintain recall', 'Uninterrupted structured review tracking'],
        },
        {
          title: 'Pillar 3: Mutashabihat Mastery & Oral Exam Trials',
          points: ['Comparative charts across similar verses and passages', 'Surprise cue audits from top, middle, and bottom of pages', 'Preparation for complete one-sitting recitations towards Sanad'],
        },
      ],
    },
    outcomes: {
      ar: [
        'حفظ السور القرآنية حفظاً راسخاً لا يزول بمرور الوقت',
        'التمكن من السرد المباشر لأي سورة من الذاكرة دون تلعثم',
        'الاستعداد لاختبار الإجازة القرآنية بالسند المتصل إلى النبي ﷺ',
      ],
      en: [
        'Unyielding, permanent Quranic memory that withstands time',
        'Ability to recite any memorized Surah on command with serenity',
        'Full qualification to enter the Sanad Ijazah examination track',
      ],
    },
    whatsappText: {
      ar: 'السلام عليكم، أود الاستفسار والتسجيل في منظومة حفظ القرآن الكريم وتثبيته.',
      en: 'Hello, I would like to inquire and enroll in the Quran Memorization & Retention Program.',
    },
  },
  {
    id: 'private-vip-lessons',
    categoryKey: 'private',
    href: '/private-lessons',
    badge: {
      ar: 'إشراف فردي مباشر VIP',
      en: 'Direct 1-on-1 Mentorship',
    },
    title: {
      ar: 'الدروس الفردية الخاصة المباشرة (1-on-1)',
      en: 'Private 1-on-1 Dedicated Lessons',
    },
    subtitle: {
      ar: 'جلسات خصوصية مباشرة (45 دقيقة) مخصصة لطالب واحد مع الأستاذة عبير جاد لتركيز كامل، ومرونة مطلقة في الأوقات.',
      en: 'Private 45-minute live sessions dedicated 100% to a single student with Ustadha Abeer Gad for focused mastery and custom scheduling.',
    },
    icon: Calendar,
    colorScheme: {
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
      iconBg: 'bg-rose-100/70 border-rose-200',
      iconColor: 'text-rose-700',
      borderColor: 'hover:border-rose-300',
      accentBtn: 'bg-rose-700 hover:bg-rose-800 text-white',
    },
    meta: {
      level: { ar: 'مخصص حسب هدف الطالب واحتياجه', en: 'Customized to the Student\'s Exact Goal' },
      format: { ar: 'جلسة فيديو مرئية فردية خاصة (Zoom / Google Meet)', en: 'Private 1-on-1 Live Video Room' },
      duration: { ar: '45 دقيقة مكثفة من التركيز الكامل', en: '45 Minutes of Dedicated 1-on-1 Focus' },
      sanad: { ar: 'إشراف مباشر وحصري من الأستاذة عبير جاد', en: 'Direct Tuition by Ustadha Abeer Gad' },
    },
    features: {
      ar: [
        'تركيز فردي 100% بدون أي تشتيت من طلاب آخرين',
        'تخصيص المحتوى بالكامل: تصحيح تلاوة، إتقان نحو، أو مراجعة حفظ',
        'مرونة عالية في اختيار المواعيد المناسبة لجدولك وفارق التوقيت',
        'تقرير تقييم فوري وملاحظات مخصصة تسلم للطالب عقب كل جلسة',
      ],
      en: [
        '100% individual dedication without classroom distractions',
        'Bespoke agenda: Tajweed audit, Arabic grammar, or Hifz testing',
        'Complete timezone flexibility across UK, Europe, Americas, and Gulf',
        'Personalized feedback report and action steps delivered after each class',
      ],
    },
    detailedSyllabus: {
      ar: [
        {
          title: 'ماذا يمكنك إنجازه في الجلسات الفردية؟',
          points: [
            'جلسات تصحيح التلاوة وتدقيق مخارج الحروف الشاقة كلمة بكلمة',
            'حل المشكلات النحوية والإعرابية ومراجعة نصوص خاصة أو كتب شرعية',
            'اختبارات حفظ الأجزاء القرآنية وإعداد الطالب لمرحلة الإجازة',
            'تدريب مكثف على المحادثة باللغة العربية للأعمال أو الأكاديميين',
          ],
        },
        {
          title: 'مميزات إضافية للطالب في هذا المسار',
          points: [
            'تسجيل كامل للجلسة متاح للطالب لمراجعته متى شاء',
            'إمكانية التواصل المباشر مع المعلمة للأسئلة والاستفسارات السريعة',
            'أولوية حجز المواعيد الجديدة والمراجعات المستعجلة',
          ],
        },
      ],
      en: [
        {
          title: 'What You Can Achieve in 1-on-1 Sessions:',
          points: [
            'Granular pronunciation diagnosis and customized phonetic correction',
            'Focused Arabic grammar tutoring on complex classical treatises',
            'Comprehensive Hifz retention verification and Sanad testing trials',
            'High-velocity formal conversational fluency for professionals and academics',
          ],
        },
        {
          title: 'Exclusive VIP Privileges:',
          points: [
            'Private HD recordings of sessions for self-paced review anytime',
            'Direct advisory communication for quick study clarifications',
            'Priority access to calendar slots and schedule adjustments',
          ],
        },
      ],
    },
    outcomes: {
      ar: [
        'تحقيق قفزة نوعية وسريعة في المستوى خلال أسابيع قليلة',
        'معالجة دقيقة وشخصية لأي نقاط ضعف لغوية أو تجويدية',
        'الوصول لأعلى معايير الإتقان مع مرونة تامة تناسب انشغالاتك',
      ],
      en: [
        'Accelerated measurable leap in proficiency within weeks',
        'Direct resolution of individual pronunciation or grammar hurdles',
        'Peak mastery achieved around your personal professional schedule',
      ],
    },
    whatsappText: {
      ar: 'السلام عليكم أستاذة عبير، أود حجز جلسة خاصة فردية مباشرة (1-on-1).',
      en: 'Hello Ustadha Abeer, I would like to book a private dedicated 1-on-1 lesson.',
    },
  },
  {
    id: 'tajweed-sanad',
    categoryKey: 'quran',
    href: '/tajweed',
    badge: {
      ar: 'إجازة بالسند المتصل',
      en: 'Scholarly Sanad Pathway',
    },
    title: {
      ar: 'علم التجويد التخصصي ومسار الإجازة بالسند',
      en: 'Advanced Tajweed Science & Sanad Ijazah',
    },
    subtitle: {
      ar: 'دراسة متعمقة للمنظومات التجويدية (تحفة الأطفال والمقدمة الجزرية) مع الإقراء المتصل بالإسناد الشريف.',
      en: 'Rigorous study of classical tajweed poems (Tuhfah & Jazariyyah) with continuous chain of transmission (Sanad).',
    },
    icon: GraduationCap,
    colorScheme: {
      badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      iconBg: 'bg-indigo-100/70 border-indigo-200',
      iconColor: 'text-indigo-800',
      borderColor: 'hover:border-indigo-300',
      accentBtn: 'bg-indigo-700 hover:bg-indigo-800 text-white',
    },
    meta: {
      level: { ar: 'متوسط إلى متقدم ولمعلمي القرآن الكريم', en: 'Intermediate to Advanced & Teachers' },
      format: { ar: 'دراسة نظرية تطبيقية مع إقراء متصل', en: 'Theoretical Matn Study & Sanad Audits' },
      duration: { ar: 'مسار تأهيلي متكامل للختمة', en: 'Comprehensive Recitation Cycle' },
      sanad: { ar: 'إسناد متصل إلى النبي ﷺ بحفص والقراءات', en: 'Continuous Sanad to the Prophet ﷺ' },
    },
    features: {
      ar: [
        'حفظ وشرح متني تحفة الأطفال والجزرية بيتاً بيتاً',
        'أزمنة الحركات والغنن والمدود بالميزان الصوتي الدقيق',
        'دراسة باب المخارج والصفات وأحكام الوقف والابتداء والراءات',
        'التأهيل للختمة الكاملة ونيل الإجازة بالسند المتصل',
      ],
      en: [
        'Memorization & commentary on Tuhfat al-Atfal and Al-Jazariyyah',
        'Precise acoustic measurement of vowel durations and Ghunnah',
        'Exhaustive analysis of articulation points, attributes, and Waqf/Ibtida',
        'Qualification for complete Mus\'haf recital towards certified Sanad',
      ],
    },
    detailedSyllabus: {
      ar: [
        {
          title: 'المحور الأول: شرح منظومة تحفة الأطفال',
          points: ['أحكام النون الساكنة والتنوين والميم الساكنة واللامات', 'أقسام المد وأحكامه وأسبابه وتطبيقاته العملية'],
        },
        {
          title: 'المحور الثاني: شرح المقدمة الجزرية وعلم الصوتيات',
          points: ['المخارج السبعة عشر والصفات المتضادة وغير المتضادة', 'أحكام الترقيق والتفخيم والضاد والظاء', 'المقطوع والموصول والتاءات في الرسم العثماني'],
        },
      ],
      en: [
        {
          title: 'Pillar 1: Tuhfat al-Atfal Commentary',
          points: ['Rules of Noon & Meem Sakinah, Tanween, and Laam', 'Comprehensive divisions of primary and derived Madd rules'],
        },
        {
          title: 'Pillar 2: Al-Muqaddimah Al-Jazariyyah',
          points: ['Seventeen articulation points and paired/unpaired phonetic attributes', 'Tafkheem/Tarqeeq nuances, Dhad vs Dhaa differentiation', 'Orthographic junctions (Maqtoo & Mawsool) in Uthmanic script'],
        },
      ],
    },
    outcomes: {
      ar: [
        'إتقان تدريس أحكام التجويد تأصيلاً وتطبيقاً',
        'فهم دقائق المنظومات وتوجيه الروايات القرآنية',
        'نيل إجازة السند المتصل الشريف برواية حفص عن عاصم',
      ],
      en: [
        'Authority to teach Tajweed with theoretical and practical mastery',
        'Profound comprehension of classical pedagogical poems',
        'Attainment of continuous Sanad Ijazah in Hafs from Asim',
      ],
    },
    whatsappText: {
      ar: 'السلام عليكم، أود الاستفسار والتسجيل في مسار علم التجويد التخصصي والإجازة بالسند.',
      en: 'Hello, I would like to inquire about the Advanced Tajweed & Sanad Ijazah track.',
    },
  },
  {
    id: 'specialized-arabic',
    categoryKey: 'arabic',
    href: '/specialized-arabic',
    badge: {
      ar: 'لغة العلوم الشرعية والأكاديمية',
      en: 'Islamic & Academic Arabic',
    },
    title: {
      ar: 'العربية لأغراض خاصة والعلوم الشرعية',
      en: 'Specialized Arabic for Islamic & Academic Fields',
    },
    subtitle: {
      ar: 'مسار مخصص لطلبة العلوم الشرعية والباحثين والدبلوماسيين لفهم أمهات الكتب والمصطلحات الفقهية والتراثية.',
      en: 'Tailored curriculum for scholars, researchers, and professionals engaging with classical Islamic jurisprudence and academic texts.',
    },
    icon: Briefcase,
    colorScheme: {
      badgeBg: 'bg-stone-100 border-stone-300 text-stone-800',
      iconBg: 'bg-stone-200/80 border-stone-300',
      iconColor: 'text-stone-800',
      borderColor: 'hover:border-stone-400',
      accentBtn: 'bg-stone-800 hover:bg-stone-900 text-white',
    },
    meta: {
      level: { ar: 'متوسط إلى متقدم وللباحثين', en: 'Intermediate to Advanced Scholars' },
      format: { ar: 'دراسة نصوص وتحليل أصولي ولغوي', en: 'Textual Analysis & Applied Hermeneutics' },
      duration: { ar: 'وحدات دراسية تخصصية', en: 'Specialized Modular Syllabi' },
      sanad: { ar: 'منهجية أكاديمية أزهرية رصينة', en: 'Rigorous Scholarly Academic Foundation' },
    },
    features: {
      ar: [
        'قراءة نصوص من كتب التفسير والفقه والعقيدة وأصول الفقه',
        'تفكيك عبارات الفقهاء والمصطلحات التراثية بدقة',
        'البلاغة القرآنية: أسرار البيان والمعاني والبديع',
        'تطوير مهارات الكتابة الأكاديمية وصياغة البحوث باللغة العربية',
      ],
      en: [
        'Analysis of primary classical Tafseer, Fiqh, and Usul texts',
        'Decoding intricate juristic terminology and classical idioms',
        'Quranic Balaghah: Rhetorical eloquence, semantics, and aesthetics',
        'Academic writing and research formulation in classical Arabic',
      ],
    },
    detailedSyllabus: {
      ar: [
        {
          title: 'المحور الأول: لغة التفسير والحديث',
          points: ['قواعد إعراب القرآن وبيان أسباب النزول لغوياً', 'فهم مفردات الحديث النبوي الشريف وغريبه'],
        },
        {
          title: 'المحور الثاني: فقه اللغة ومصطلحات المذاهب',
          points: ['المصطلحات الفقهية الأربعة وتطور دلالاتها', 'تحليل عبارات المتون الفقهية وشروحها'],
        },
      ],
      en: [
        {
          title: 'Pillar 1: Hermeneutics of Tafseer & Hadith',
          points: ['Grammatical parsing of Quranic discourse and textual contexts', 'Vocabulary and linguistic semantics of classical Hadith compilations'],
        },
        {
          title: 'Pillar 2: Classical Terminology & Juristic Lexicons',
          points: ['Evolution of legal terminology across classical schools of thought', 'Analytical reading of primary classical matn commentaries'],
        },
      ],
    },
    outcomes: {
      ar: [
        'القدرة على القراءة المستقلة في أمهات كتب التراث الإسلامي',
        'فهم دقائق الاستدلال اللغوي في الفقه والتفسير',
        'إتقان الصياغة والتحرير العلمي باللغة العربية الفصحى',
      ],
      en: [
        'Self-reliant reading of primary classical Islamic literature',
        'Grasping subtle linguistic arguments in juristic reasoning',
        'Authoritative academic writing and argumentation in Arabic',
      ],
    },
    whatsappText: {
      ar: 'السلام عليكم، أود الاستفسار والتسجيل في برنامج العربية لأغراض خاصة والعلوم الشرعية.',
      en: 'Hello, I would like to inquire about the Specialized Arabic for Islamic Sciences program.',
    },
  },
];

interface ServicesCardsSectionProps {
  currentLocale: string;
}

export function ServicesCardsSection({ currentLocale }: ServicesCardsSectionProps) {
  const isRtl = currentLocale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activeCategory, setActiveCategory] = useState<'all' | 'quran' | 'arabic' | 'private'>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES_DATA);
  const [whatsappNum, setWhatsappNum] = useState<string>('201000000000');

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

        if (Array.isArray(data.settings?.services)) {
          const overridesMap = new Map<string, ServiceCardItem>(
            data.settings.services.map((s: ServiceCardItem) => [s.id, s])
          );
          const updated = SERVICES_DATA.filter((svc) => {
            const override = overridesMap.get(svc.id);
            if (override && override.isActive === false) return false;
            return true;
          }).map((svc) => {
            const override = overridesMap.get(svc.id);
            if (!override) return svc;
            return {
              ...svc,
              badge: {
                ar: override.badgeAr || svc.badge.ar,
                en: override.badgeEn || svc.badge.en,
              },
              title: {
                ar: override.titleAr || svc.title.ar,
                en: override.titleEn || svc.title.en,
              },
              subtitle: {
                ar: override.subtitleAr || svc.subtitle.ar,
                en: override.subtitleEn || svc.subtitle.en,
              },
              meta: {
                ...svc.meta,
                level: {
                  ar: override.levelAr || svc.meta.level.ar,
                  en: override.levelEn || svc.meta.level.en,
                },
                format: {
                  ar: override.formatAr || svc.meta.format.ar,
                  en: override.formatEn || svc.meta.format.en,
                },
              },
              features: {
                ar: Array.isArray(override.featuresAr) && override.featuresAr.length > 0 ? override.featuresAr : svc.features.ar,
                en: Array.isArray(override.featuresEn) && override.featuresEn.length > 0 ? override.featuresEn : svc.features.en,
              },
            };
          });
          setServicesList(updated);
        }
      } catch (e) {
        // Fallback to static SERVICES_DATA
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const filteredServices = servicesList.filter((svc) => {
    if (activeCategory === 'all') return true;
    return svc.categoryKey === activeCategory;
  });

  const categories = [
    { key: 'all', labelAr: 'جميع الخدمات والمسارات', labelEn: 'All Services & Pathways' },
    { key: 'quran', labelAr: 'علوم القرآن الكريم والتجويد', labelEn: 'Quran & Tajweed' },
    { key: 'arabic', labelAr: 'اللغة العربية وفنونها', labelEn: 'Arabic Language' },
    { key: 'private', labelAr: 'الدروس الفردية الخاصة VIP', labelEn: 'Private 1-on-1 VIP' },
  ];

  return (
    <section id="services-section" className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF7F0] via-[#FDFBF7] to-[#FAF7F0] relative">
      {/* Decorative ambient background */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-50/50 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-surface-border shadow-card-subtle text-xs sm:text-sm font-bold text-brand-800">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span>{isRtl ? 'خدماتنا وبرامجنا التعليمية المتكاملة' : 'Comprehensive Educational Services'}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight leading-tight">
            {isRtl ? (
              <>
                اختر مسارك التعليمي، <span className="text-brand-700 underline decoration-gold-400 decoration-wavy underline-offset-8">وكافة التفاصيل بداخل كل خدمة</span>
              </>
            ) : (
              <>
                Choose Your Pathway, <span className="text-brand-700 underline decoration-gold-400 decoration-wavy underline-offset-8">Full Details Inside Every Service</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-navy-600 max-w-2xl mx-auto leading-relaxed">
            {isRtl
              ? 'صممنا لك برامج أكاديمية واضحة ومباشرة؛ اطّلع على محاور المنهج، نظام الدراسة، والمخرجات المعتمدة وسجل فوراً بكل سهولة.'
              : 'Clearly structured educational programs. Explore the curriculum highlights, study format, and certified outcomes, then enroll directly.'}
          </p>

          {/* Category Filter Tabs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-700 text-white shadow-card-subtle scale-105'
                      : 'bg-white text-navy-700 border border-surface-border hover:border-brand-300 hover:text-brand-800 hover:bg-surface-muted'
                  }`}
                >
                  {isRtl ? cat.labelAr : cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            const isExpanded = expandedCardId === service.id;
            const features = isRtl ? service.features.ar : service.features.en;
            const detailedSyllabus = isRtl ? service.detailedSyllabus.ar : service.detailedSyllabus.en;
            const outcomes = isRtl ? service.outcomes.ar : service.outcomes.en;
            const whatsappMsg = encodeURIComponent(isRtl ? service.whatsappText.ar : service.whatsappText.en);
            const whatsappUrl = `https://wa.me/${whatsappNum}?text=${whatsappMsg}`;

            return (
              <div
                key={service.id}
                className={`bg-white rounded-3xl border border-surface-border p-6 sm:p-8 shadow-card-subtle transition-all duration-300 hover:shadow-card-hover flex flex-col justify-between ${service.colorScheme.borderColor} relative overflow-hidden`}
              >
                {/* Top Header inside the Card */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-2xl ${service.colorScheme.iconBg} border flex items-center justify-center shrink-0 shadow-inner`}
                    >
                      <Icon className={`w-7 h-7 ${service.colorScheme.iconColor}`} />
                    </div>

                    {/* Badge */}
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border ${service.colorScheme.badgeBg} text-center`}
                    >
                      {isRtl ? service.badge.ar : service.badge.en}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-navy-950 mb-2 leading-snug">
                    {isRtl ? service.title.ar : service.title.en}
                  </h3>
                  <p className="text-xs sm:text-sm text-navy-600 leading-relaxed mb-5">
                    {isRtl ? service.subtitle.ar : service.subtitle.en}
                  </p>

                  {/* Key Metadata Grid (Level, Format, Duration, Sanad) */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-surface-muted/60 border border-surface-borderSubtle mb-5 text-[11px] sm:text-xs">
                    <div className="space-y-0.5">
                      <span className="text-navy-500 block font-medium">
                        {isRtl ? 'المستوى المستهدف:' : 'Target Level:'}
                      </span>
                      <span className="font-bold text-navy-900 block truncate">
                        {isRtl ? service.meta.level.ar : service.meta.level.en}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-navy-500 block font-medium">
                        {isRtl ? 'نمط الدراسة:' : 'Study Format:'}
                      </span>
                      <span className="font-bold text-navy-900 block truncate">
                        {isRtl ? service.meta.format.ar : service.meta.format.en}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-navy-500 block font-medium">
                        {isRtl ? 'نظام الجلسات:' : 'Duration & Pace:'}
                      </span>
                      <span className="font-bold text-navy-900 block truncate">
                        {isRtl ? service.meta.duration.ar : service.meta.duration.en}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-navy-500 block font-medium">
                        {isRtl ? 'الاعتماد والسند:' : 'Accreditation:'}
                      </span>
                      <span className="font-bold text-navy-900 block truncate">
                        {isRtl ? service.meta.sanad.ar : service.meta.sanad.en}
                      </span>
                    </div>
                  </div>

                  {/* Core Features List (What you will learn) */}
                  <div className="space-y-2 mb-6">
                    <h4 className="text-xs font-bold text-navy-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                      <span>{isRtl ? 'أبرز محاور البرنامج وما ستتعلمه:' : 'Key Syllabus Highlights:'}</span>
                    </h4>
                    <ul className="space-y-2">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-navy-700 leading-snug">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* In-Card Expandable Details (Inline Accordion - Zero Popups) */}
                  <div className="pt-2 border-t border-surface-borderSubtle">
                    <button
                      onClick={() => toggleExpand(service.id)}
                      className="w-full flex items-center justify-between py-2 text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-gold-600" />
                        <span>
                          {isExpanded
                            ? isRtl
                              ? 'إخفاء تفاصيل المنهج والمخرجات'
                              : 'Hide Detailed Syllabus & Outcomes'
                            : isRtl
                            ? 'عرض تفاصيل المنهج بالكامل والمخرجات'
                            : 'View Full In-Depth Syllabus & Outcomes'}
                        </span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Detailed Syllabus when expanded */}
                    {isExpanded && (
                      <div className="pt-4 pb-2 space-y-4 animate-fadeIn">
                        {/* Modules Breakdown */}
                        <div className="space-y-3">
                          <span className="text-[11px] font-bold text-navy-500 uppercase tracking-wider block">
                            {isRtl ? 'المقرر الدراسي بالتفصيل:' : 'Granular Curriculum Breakdown:'}
                          </span>
                          <div className="space-y-2.5">
                            {detailedSyllabus.map((module, mIdx) => (
                              <div
                                key={mIdx}
                                className="p-3 rounded-xl bg-background-warm border border-surface-borderSubtle space-y-1.5 text-xs"
                              >
                                <span className="font-bold text-navy-900 block">{module.title}</span>
                                <ul className="space-y-1 ps-2">
                                  {module.points.map((p, pIdx) => (
                                    <li key={pIdx} className="text-navy-600 text-[11px] flex items-center gap-1.5">
                                      <span className="w-1 h-1 rounded-full bg-gold-600 shrink-0" />
                                      <span>{p}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Outcomes upon completion */}
                        <div className="p-3 rounded-xl bg-brand-50/50 border border-brand-100 space-y-1.5 text-xs">
                          <span className="font-bold text-brand-900 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-brand-700" />
                            <span>{isRtl ? 'المخرجات المتوقعة عند إتمام المسار:' : 'Certified Outcomes upon Completion:'}</span>
                          </span>
                          <ul className="space-y-1 ps-2">
                            {outcomes.map((out, oIdx) => (
                              <li key={oIdx} className="text-navy-700 text-[11px] flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-brand-600 shrink-0" />
                                <span>{out}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-6 mt-4 border-t border-surface-border flex flex-col sm:flex-row items-center gap-3">
                  {/* Primary Pathway Enrollment Button */}
                  <Link
                    href={service.href}
                    className={`w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm ${service.colorScheme.accentBtn} shadow-card-subtle hover:-translate-y-0.5 transition-all duration-200`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{isRtl ? 'التسجيل في المسار (Enroll)' : 'Enroll in Pathway'}</span>
                    <ArrowIcon className="w-3.5 h-3.5 ms-1" />
                  </Link>

                  {/* Toggle Detailed In-Card Syllabus */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(service.id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-navy-800 border border-surface-border hover:border-brand-400 hover:text-brand-800 hover:bg-surface-muted shadow-card-subtle transition-all duration-200"
                  >
                    <span>
                      {isExpanded
                        ? isRtl ? 'إخفاء المنهج' : 'Hide Syllabus'
                        : isRtl ? 'محاور المنهج' : 'View Syllabus'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Guarantee Note */}
        <div className="max-w-3xl mx-auto mt-12 p-4 rounded-2xl bg-white border border-surface-border shadow-card-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-gold-700" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-navy-900">
                {isRtl ? 'ضمان الجودة ومطابقة السند النبوي' : 'Scholarly Integrity & Sanad Authenticity'}
              </h4>
              <p className="text-[11px] sm:text-xs text-navy-600">
                {isRtl
                  ? 'كافة المسارات تتم تحت الإشراف المباشر للأستاذة عبير جاد وبأعلى معايير الإتقان والتلقي الشفاهي.'
                  : 'All curricula are supervised under continuous Sanad chains and personalized oral instruction.'}
              </p>
            </div>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 shrink-0"
          >
            <span>{isRtl ? 'تصفح فهرس الدورات المسجلة' : 'Browse Recorded Courses'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
