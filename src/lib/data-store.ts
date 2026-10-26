import fs from 'fs';
import path from 'path';
import {
  SlotPricingSettings,
  DEFAULT_SLOT_PRICING,
  calculateSlotPrice,
} from './slot-pricing';

export interface LessonData {
  id: string;
  title: string;
  titleAr: string;
  duration: string;
  durationMinutes: number;
  videoUrl: string;
  isFree: boolean;
  notes?: string;
}

export interface ChapterData {
  id: string;
  title: string;
  titleAr: string;
  lessons: LessonData[];
}

export interface CourseData {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  level: string;
  levelAr: string;
  price: number;
  currency: string;
  thumbnail: string;
  promoVideoUrl: string;
  instructorName: string;
  isPublished: boolean;
  featured: boolean;
  isFree?: boolean;
  durationHours: number;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  chapters: ChapterData[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourceData {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  fileType: string;
  fileUrl: string;
  fileSizeMb: number;
  isPremium: boolean;
  downloads: number;
  createdAt: string;
}

export interface SlotData {
  id: string;
  date: string;
  time: string;
  instructor: string;
  price: number;
  currency: string;
  status: 'AVAILABLE' | 'BOOKED';
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  meetingUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface TransactionData {
  id: string;
  paypalOrderId: string;
  payerEmail: string;
  itemTitle: string;
  itemType: 'COURSE' | 'PRIVATE_LESSON';
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  date: string;
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  enrolledCoursesCount: number;
  completedLessonsCount: number;
  progressPercentage: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  flag: string;
  focus: string;
  focusAr: string;
  quote: string;
  quoteAr: string;
  rating: number;
}

export interface PillarCardItem {
  id: string;
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
  tag: string;
  tagAr: string;
  href: string;
  features: string[];
  featuresAr: string[];
}

export interface ServiceCardItem {
  id: string;
  categoryKey: 'all' | 'quran' | 'arabic' | 'private';
  href: string;
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  levelAr: string;
  levelEn: string;
  formatAr: string;
  formatEn: string;
  durationAr: string;
  durationEn: string;
  sanadAr: string;
  sanadEn: string;
  featuresAr: string[];
  featuresEn: string[];
  isActive: boolean;
}

export interface SiteSettingsData {
  announcementEnabled: boolean;
  announcementTextEn: string;
  announcementTextAr: string;
  announcementLink: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  telegramLink?: string;
  youtubeLink?: string;

  // Hero Section
  heroBadgeAr: string;
  heroBadgeEn: string;
  heroTitleAr: string;
  heroTitleHighlightAr: string;
  heroTitleEn: string;
  heroTitleHighlightEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
  heroCtaPrimaryTextAr: string;
  heroCtaPrimaryTextEn: string;
  heroCtaPrimaryLink: string;
  heroCtaSecondaryTextAr: string;
  heroCtaSecondaryTextEn: string;
  heroCtaSecondaryLink: string;

  // Hero Live Statistics
  heroStatsEnabled?: boolean;
  heroStudentsCount: string;
  heroCountriesCount: string;
  heroSatisfactionRate: string;
  heroLessonsCompleted: string;

  // Testimonials, Services & Pillars
  testimonials: TestimonialItem[];
  pillars: PillarCardItem[];
  services: ServiceCardItem[];

  // Footer About
  footerAboutAr: string;
  footerAboutEn: string;

  // Time-Based Dynamic Slot Pricing
  slotPricing?: SlotPricingSettings;

  updatedAt: string;
}

export interface AcademyStore {
  courses: CourseData[];
  resources: ResourceData[];
  slots: SlotData[];
  transactions: TransactionData[];
  students: StudentData[];
  settings: SiteSettingsData;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'academy-store.json');

const INITIAL_COURSES: CourseData[] = [];

const INITIAL_RESOURCES: ResourceData[] = [];

const INITIAL_SLOTS: SlotData[] = [];

const INITIAL_TRANSACTIONS: TransactionData[] = [];

const INITIAL_STUDENTS: StudentData[] = [];

const INITIAL_SERVICES: ServiceCardItem[] = [
  {
    id: 'arabic-mastery',
    categoryKey: 'arabic',
    href: '/learn-arabic',
    badgeAr: 'تأسيس وفصاحة ونحو',
    badgeEn: 'Phonetics to Fluency',
    titleAr: 'تعليم وإتقان اللغة العربية الشامل',
    titleEn: 'Comprehensive Arabic Language Mastery',
    subtitleAr: 'منهج متكامل يبدأ من مخارج الحروف الصوتية والكتابة، ويتدرج إلى إتقان النحو والصرف والمحادثة الفصيحة.',
    subtitleEn: 'Structured pathway covering Arabic phonetics, script, morphology (Sarf), syntax (Nahw), and fluent conversation.',
    levelAr: 'كافة المستويات (مبتدئ إلى متقدم)',
    levelEn: 'All Levels (Beginner to Advanced)',
    formatAr: 'جلسات تفاعلية مباشرة أونلاين',
    formatEn: 'Live Interactive Online Sessions',
    durationAr: 'مستويات مرنة (40 دقيقة للجلسة)',
    durationEn: 'Flexible Modules (40m / session)',
    sanadAr: 'شهادة إتمام معتمدة من الأكاديمية',
    sanadEn: 'Certified Completion Certificate',
    featuresAr: [
      'تأسيس مخارج الحروف والأصوات اللغوية بدقة',
      'شرح مبسط لقواعد النحو (الجملة الاسمية والفعلية والإعراب)',
      'علم الصرف ونظام الجذور الثلاثية واشتقاق الكلمات',
      'تدريب عملي مكثف على المحادثة والفصاحة والتعبير',
    ],
    featuresEn: [
      'Accurate phonetics and letter articulation training',
      'Intuitive Nahw (syntax, parsing, and nominal/verbal sentences)',
      'Sarf morphology: Tri-literal roots and derivation',
      'Immersive conversation drills and expressive fluency',
    ],
    isActive: true,
  },
  {
    id: 'quran-reading-tajweed',
    categoryKey: 'quran',
    href: '/quran-reading',
    badgeAr: 'تصحيح التلاوة والنورانية',
    badgeEn: 'Recitation & Makhaarij',
    titleAr: 'قراءة القرآن الكريم وإتقان التجويد',
    titleEn: 'Quran Reading & Tajweed Articulation',
    subtitleAr: 'تأسيس رصين بمنهجية القاعدة النورانية، وضبط مخارج الحروف وصفاتها، وتصحيح التلاوة المباشرة من المصحف.',
    subtitleEn: 'Solid foundational study via Noorani Qaida, phonetic articulation points (Makhaarij), and direct Mus\'haf recitation.',
    levelAr: 'للمبتدئين ومن يرغب في تصحيح التلاوة',
    levelEn: 'Beginners & Recitation Correction',
    formatAr: 'تلقي صوتي ومرئي مباشر مع المعلمة',
    formatEn: 'Direct Oral Recitation & Correction',
    durationAr: 'جلسات تدريبية متدرجة (45 دقيقة)',
    durationEn: 'Progressive Sessions (45m each)',
    sanadAr: 'إشراف مسند بالأسانيد القرآنية المتصلة',
    sanadEn: 'Supervised under Authentic Sanad Standards',
    featuresAr: [
      'دراسة القاعدة النورانية بالتفصيل حرفاً بحرف',
      'ضبط مخارج الحروف الحلقية واللهوية واللسانية والشفوية',
      'تطبيق عملي لأحكام النون والميم الساكنتين والتنوين والمدود',
      'تصحيح التلاوة آية بآية من المصحف الشريف برواية حفص',
    ],
    featuresEn: [
      'In-depth letter-by-letter Noorani Qaida instruction',
      'Physical articulation accuracy (Throat, Palate, Tongue, Lips)',
      'Practical ahkām: Noon & Meem Sakinah, Madd, and Ghunnah timings',
      'Direct verse-by-verse recitation correction from the Mus\'haf',
    ],
    isActive: true,
  },
  {
    id: 'quran-memorization-hifz',
    categoryKey: 'quran',
    href: '/quran-memorization',
    badgeAr: 'حفظ راسخ وتكرار متباعد',
    badgeEn: 'Cognitive Hifz System',
    titleAr: 'منظومة حفظ القرآن الكريم وتثبيته',
    titleEn: 'Quran Memorization & Retention Methodology',
    subtitleAr: 'نظام حفظ منهجي يعتمد على خطط فردية مرنة، والتكرار المتباعد، وضبط المتشابهات اللفظية، والمتابعة الدورية المستمرة.',
    subtitleEn: 'Individualized Hifz curricula leveraging spaced repetition algorithms, Mutashabihat mastery, and consistent revision cycles.',
    levelAr: 'متاح للراغبين في حفظ أجزاء محددة أو المصحف كاملاً',
    levelEn: 'Partial or Full Holy Qur\'an',
    formatAr: 'تسميع مباشر وجداول متابعة أسبوعية دقيقة',
    formatEn: 'Live Oral Recitation & Tracking Reports',
    durationAr: 'خطط مخصصة (يومية أو أسبوعية)',
    durationEn: 'Customized Daily / Weekly Pacing',
    sanadAr: 'مسار تأهيل رسمي لختمة الإجازة بالسند',
    sanadEn: 'Direct Pathway to Continuous Sanad Ijazah',
    featuresAr: [
      'خطة حفظ مرنة تراعي وقت الطالب وقدرته الذهنية واستيعابه',
      'تقنية التكرار المتباعد لضمان عدم نسيان المحفوظ القديم',
      'معالجة المتشابهات اللفظية وضبط الآيات المتقاربة بالروابط الذهنية',
      'اختبارات إتقان دورية مع كشف علامات وملاحظات المعلمة',
    ],
    featuresEn: [
      'Tailored memory roadmap adapted to student schedule and capacity',
      'Spaced repetition methodology safeguarding previously memorized Juz',
      'Systematic Mutashabihat analysis preventing common verbal mix-ups',
      'Scheduled milestone exams with detailed instructor evaluations',
    ],
    isActive: true,
  },
  {
    id: 'private-vip-lessons',
    categoryKey: 'private',
    href: '/private-lessons',
    badgeAr: 'إشراف فردي مباشر VIP',
    badgeEn: 'Direct 1-on-1 Mentorship',
    titleAr: 'الدروس الفردية الخاصة المباشرة (1-on-1)',
    titleEn: 'Private 1-on-1 Dedicated Lessons',
    subtitleAr: 'جلسات خصوصية مباشرة (45 دقيقة) مخصصة لطالب واحد مع الأستاذة عبير جاد لتركيز كامل، ومرونة مطلقة في الأوقات.',
    subtitleEn: 'Private 45-minute live sessions dedicated 100% to a single student with Ustadha Abeer Gad for focused mastery and custom scheduling.',
    levelAr: 'مخصص حسب هدف الطالب واحتياجه',
    levelEn: 'Customized to the Student\'s Exact Goal',
    formatAr: 'جلسة فيديو مرئية فردية خاصة (Zoom / Google Meet)',
    formatEn: 'Private 1-on-1 Live Video Room',
    durationAr: '45 دقيقة مكثفة من التركيز الكامل',
    durationEn: '45 Minutes of Dedicated 1-on-1 Focus',
    sanadAr: 'إشراف مباشر وحصري من الأستاذة عبير جاد',
    sanadEn: 'Direct Tuition by Ustadha Abeer Gad',
    featuresAr: [
      'تركيز فردي 100% بدون أي تشتيت من طلاب آخرين',
      'تخصيص المحتوى بالكامل: تصحيح تلاوة، إتقان نحو، أو مراجعة حفظ',
      'مرونة عالية في اختيار المواعيد المناسبة لجدولك وفارق التوقيت',
      'تقرير تقييم فوري وملاحظات مخصصة تسلم للطالب عقب كل جلسة',
    ],
    featuresEn: [
      '100% individual dedication without classroom distractions',
      'Bespoke agenda: Tajweed audit, Arabic grammar, or Hifz testing',
      'Complete timezone flexibility across UK, Europe, Americas, and Gulf',
      'Personalized feedback report and action steps delivered after each class',
    ],
    isActive: true,
  },
  {
    id: 'tajweed-sanad',
    categoryKey: 'quran',
    href: '/tajweed',
    badgeAr: 'إجازة بالسند المتصل',
    badgeEn: 'Scholarly Sanad Pathway',
    titleAr: 'علم التجويد التخصصي ومسار الإجازة بالسند',
    titleEn: 'Advanced Tajweed Science & Sanad Ijazah',
    subtitleAr: 'دراسة متعمقة للمنظومات التجويدية (تحفة الأطفال والمقدمة الجزرية) مع الإقراء المتصل بالإسناد الشريف.',
    subtitleEn: 'Rigorous study of classical tajweed poems (Tuhfah & Jazariyyah) with continuous chain of transmission (Sanad).',
    levelAr: 'متوسط إلى متقدم ولمعلمي القرآن الكريم',
    levelEn: 'Intermediate to Advanced & Teachers',
    formatAr: 'دراسة نظرية تطبيقية مع إقراء متصل',
    formatEn: 'Theoretical Matn Study & Sanad Audits',
    durationAr: 'مسار تأهيلي متكامل للختمة',
    durationEn: 'Comprehensive Recitation Cycle',
    sanadAr: 'إسناد متصل إلى النبي ﷺ بحفص والقراءات',
    sanadEn: 'Continuous Sanad to the Prophet ﷺ',
    featuresAr: [
      'حفظ وشرح متني تحفة الأطفال والجزرية بيتاً بيتاً',
      'أزمنة الحركات والغنن والمدود بالميزان الصوتي الدقيق',
      'دراسة باب المخارج والصفات وأحكام الوقف والابتداء والراءات',
      'التأهيل للختمة الكاملة ونيل الإجازة بالسند المتصل',
    ],
    featuresEn: [
      'Memorization & commentary on Tuhfat al-Atfal and Al-Jazariyyah',
      'Precise acoustic measurement of vowel durations and Ghunnah',
      'Exhaustive analysis of articulation points, attributes, and Waqf/Ibtida',
      'Qualification for complete Mus\'haf recital towards certified Sanad',
    ],
    isActive: true,
  },
  {
    id: 'specialized-arabic',
    categoryKey: 'arabic',
    href: '/specialized-arabic',
    badgeAr: 'لغة العلوم الشرعية والأكاديمية',
    badgeEn: 'Islamic & Academic Arabic',
    titleAr: 'العربية لأغراض خاصة والعلوم الشرعية',
    titleEn: 'Specialized Arabic for Islamic & Academic Fields',
    subtitleAr: 'مسار مخصص لطلبة العلوم الشرعية والباحثين والدبلوماسيين لفهم أمهات الكتب والمصطلحات الفقهية والتراثية.',
    subtitleEn: 'Tailored curriculum for scholars, researchers, and professionals engaging with classical Islamic jurisprudence and academic texts.',
    levelAr: 'متوسط إلى متقدم وللباحثين',
    levelEn: 'Intermediate to Advanced Scholars',
    formatAr: 'دراسة نصوص وتحليل أصولي ولغوي',
    formatEn: 'Textual Analysis & Applied Hermeneutics',
    durationAr: 'وحدات دراسية تخصصية',
    durationEn: 'Specialized Modular Syllabi',
    sanadAr: 'منهجية أكاديمية أزهرية رصينة',
    sanadEn: 'Rigorous Scholarly Academic Foundation',
    featuresAr: [
      'قراءة نصوص من كتب التفسير والفقه والعقيدة وأصول الفقه',
      'تفكيك عبارات الفقهاء والمصطلحات التراثية بدقة',
      'البلاغة القرآنية: أسرار البيان والمعاني والبديع',
      'تطوير مهارات الكتابة الأكاديمية وصياغة البحوث باللغة العربية',
    ],
    featuresEn: [
      'Analysis of primary classical Tafseer, Fiqh, and Usul texts',
      'Decoding intricate juristic terminology and classical idioms',
      'Quranic Balaghah: Rhetorical eloquence, semantics, and aesthetics',
      'Academic writing and research formulation in classical Arabic',
    ],
    isActive: true,
  },
];

const INITIAL_SETTINGS: SiteSettingsData = {
  announcementEnabled: true,
  announcementTextEn: '✨ Special Intake Open: Book your 1-on-1 recitation correction session with Ustadha Abeer Gad.',
  announcementTextAr: '✨ فُتح باب التسجيل للجلسات الفردية وتصحيح التلاوة مع الأستاذة عبير جاد - الأماكن محدودة.',
  announcementLink: '/private-lessons',
  contactEmail: 'contact@abeergadacademy.com',
  contactPhone: '+20 100 000 0000',
  whatsappNumber: '+201000000000',
  telegramLink: 'https://t.me/AbeerGadAcademy',
  youtubeLink: 'https://youtube.com/@AbeerGadAcademy',

  // Hero Section Defaults
  heroBadgeAr: 'أكاديمية عبير جاد لعلوم القرآن والعربية',
  heroBadgeEn: 'Abeer Gad Academy • Quran & Arabic Mastery',
  heroTitleAr: 'تعلّم العربية، اقرأ واحفظ القرآن الكريم',
  heroTitleHighlightAr: 'بالسند المتصل',
  heroTitleEn: 'Learn Arabic, Read & Memorize the Qur\'an with',
  heroTitleHighlightEn: 'Verified Continuous Sanad',
  heroSubtitleAr: 'منهجية علمية تجمع بين أصالة الإجازة النبوية المسندة وأحدث التقنيات الرقمية الميسرة لجميع المستويات في أنحاء العالم.',
  heroSubtitleEn: 'Authentic scholarly instruction connecting classical Sanad traditions with modern high-definition digital learning for all levels.',
  heroCtaPrimaryTextAr: 'استكشف كافة الدورات',
  heroCtaPrimaryTextEn: 'Explore Academic Courses',
  heroCtaPrimaryLink: '/courses',
  heroCtaSecondaryTextAr: 'احجز درساً فردياً خاصاً',
  heroCtaSecondaryTextEn: 'Book a 1-on-1 Lesson',
  heroCtaSecondaryLink: '/private-lessons',

  // Hero Live Statistics
  heroStatsEnabled: true,
  heroStudentsCount: '1,250+',
  heroCountriesCount: '34+',
  heroSatisfactionRate: '5.0',
  heroLessonsCompleted: '850+',

  // Testimonials, Services & Pillars
  testimonials: [
    {
      id: 'test-1',
      name: 'د. طارق المنصور (Dr. Tariq Al-Mansoor)',
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
      name: 'فاطمة الزهراء بن علي (Fatima Zahra Benali)',
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
      name: 'الأخ ماركوس بلال (Brother Marcus Bilal)',
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
  ],

  // Services on Homepage
  services: INITIAL_SERVICES,

  // Core Pillars matching the official emblem
  pillars: [
    {
      id: 'arabic',
      title: 'Foundational Arabic to Fluency',
      titleAr: 'تأسيس اللغة العربية وإتقان النحو والصرف',
      desc: 'Systematic curriculum from phonetics to syntax (Nahw), morphology (Sarf), and eloquent conversational Arabic.',
      descAr: 'برنامج متدرج من مخارج الحروف إلى قواعد النحو والصرف، واكتساب الفصاحة اللغوية والمحادثة الحية.',
      tag: 'Arabic Tracks',
      tagAr: 'مسارات العربية',
      href: '/learn-arabic',
      features: ['Foundational Alphabet', 'Syntax & Sarf', 'Conversational Fluency'],
      featuresAr: ['تأسيس الحروف والأصوات', 'قواعد النحو والصرف', 'المحادثة والفصاحة'],
    },
    {
      id: 'reading',
      title: 'Quran Reading & Noorani Qaida',
      titleAr: 'تلاوة القرآن الكريم وضبط القراءة المباشرة',
      desc: 'Graduated phonetics, correct articulation points (Makhaarij), and confident recitation directly from the Mus\'haf.',
      descAr: 'تأسيس متين بالقاعدة النورانية، وضبط مخارج الحروف وصفاتها للقراءة المتقنة مباشرة من المصحف.',
      tag: 'Phonetics & Reading',
      tagAr: 'التلاوة والنورانية',
      href: '/quran-reading',
      features: ['Noorani Qaida', 'Letter Articulation', 'Mus\'haf Recitation'],
      featuresAr: ['القاعدة النورانية', 'تصحيح المخارج', 'القراءة المباشرة من المصحف'],
    },
    {
      id: 'memorization',
      title: 'Quran Memorization & Hifz Methodology',
      titleAr: 'حفظ القرآن الكريم وتثبيت المتشابهات',
      desc: 'Structured memorization schedules, spaced repetition algorithms, and individual revision monitoring.',
      descAr: 'جداول حفظ يومية مدروسة، ونظام التكرار المتباعد لتثبيت الآيات وضبط المتشابهات اللفظية برعاية متخصصة.',
      tag: 'Hifz Acceleration',
      tagAr: 'الحفظ الراسخ',
      href: '/quran-memorization',
      features: ['Spaced Repetition', 'Mutashabihat Mastery', 'Daily Werd Tracking'],
      featuresAr: ['التكرار المتباعد', 'ضبط المتشابهات', 'متابعة الورد اليومي'],
    },
    {
      id: 'tajweed',
      title: 'Tajweed Rules & Continuous Sanad',
      titleAr: 'أحكام التجويد والإجازة بالسند المتصل',
      desc: 'Theoretical and acoustic breakdowns of classic texts (Tuhfat al-Atfal & Jazariyyah) towards Ijazah certification.',
      descAr: 'دراسة تطبيقية لمنظومتي تحفة الأطفال والجزرية مع أزمنة الغنن وأحكام المدود للتأهيل للإجازة.',
      tag: 'Scholarly Sanad',
      tagAr: 'إجازة وسند',
      href: '/tajweed',
      features: ['Madd & Ghunnah Timings', 'Tuhfat al-Atfal', 'Ijazah Pathway'],
      featuresAr: ['أزمنة الغنن والمدود', 'تحفة الأطفال والجزرية', 'مسار الإجازة بالسند'],
    },
  ],

  // Footer About
  footerAboutAr: 'أكاديمية عبير جاد متخصصة في تعليم اللغة العربية وعلوم القرآن الكريم وتجويده، وتجمع بين أصالة السند النبوي الشريف وأحدث أساليب التعليم الرقمي التفاعلي.',
  footerAboutEn: 'Abeer Gad Academy specializes in Classical Arabic, Quran Recitation, and Memorization with authentic continuous Sanad and modern interactive technology.',

  // Time-Based Slot Pricing Defaults (Day: 10 AM - 10 PM -> $45, Night: 10 PM - 10 AM -> $60)
  slotPricing: DEFAULT_SLOT_PRICING,

  updatedAt: new Date().toISOString(),
};

function ensureStoreExists(): AcademyStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      const initialStore: AcademyStore = {
        courses: INITIAL_COURSES,
        resources: INITIAL_RESOURCES,
        slots: INITIAL_SLOTS,
        transactions: INITIAL_TRANSACTIONS,
        students: INITIAL_STUDENTS,
        settings: INITIAL_SETTINGS,
      };
      fs.writeFileSync(STORE_FILE, JSON.stringify(initialStore, null, 2), 'utf8');
      return initialStore;
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as AcademyStore;
    parsed.settings = { ...INITIAL_SETTINGS, ...(parsed.settings || {}) };
    parsed.settings.slotPricing = {
      ...DEFAULT_SLOT_PRICING,
      ...(parsed.settings.slotPricing || {}),
    };
    if (!parsed.settings.services || parsed.settings.services.length === 0) {
      parsed.settings.services = INITIAL_SERVICES;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading store file, initializing fallback:', err);
    return {
      courses: INITIAL_COURSES,
      resources: INITIAL_RESOURCES,
      slots: INITIAL_SLOTS,
      transactions: INITIAL_TRANSACTIONS,
      students: INITIAL_STUDENTS,
      settings: INITIAL_SETTINGS,
    };
  }
}

function saveStore(store: AcademyStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${STORE_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), 'utf8');
    fs.renameSync(tempFile, STORE_FILE);
  } catch (err) {
    console.error('Error saving academy store:', err);
    throw err;
  }
}

// Store Repository Methods

export function getCourses(): CourseData[] {
  const store = ensureStoreExists();
  return store.courses || [];
}

export function getPublishedCourses(): CourseData[] {
  return getCourses().filter((c) => c.isPublished);
}

export function getCourseBySlug(slug: string): CourseData | undefined {
  return getCourses().find((c) => c.slug === slug);
}

export function getCourseById(id: string): CourseData | undefined {
  return getCourses().find((c) => c.id === id);
}

export function saveCourse(courseData: Partial<CourseData> & { title: string; slug: string }): CourseData {
  const store = ensureStoreExists();
  const now = new Date().toISOString();

  const existingIndex = store.courses.findIndex((c) => c.id === courseData.id || c.slug === courseData.slug);

  if (existingIndex >= 0) {
    const existing = store.courses[existingIndex];
    const updated: CourseData = {
      ...existing,
      ...courseData,
      id: existing.id,
      updatedAt: now,
    };
    store.courses[existingIndex] = updated;
    saveStore(store);
    return updated;
  } else {
    const newCourse: CourseData = {
      id: courseData.id || `course-${Date.now()}`,
      slug: courseData.slug,
      title: courseData.title,
      titleAr: courseData.titleAr || courseData.title,
      subtitle: courseData.subtitle || '',
      subtitleAr: courseData.subtitleAr || '',
      description: courseData.description || '',
      descriptionAr: courseData.descriptionAr || '',
      category: courseData.category || 'General Course',
      categoryAr: courseData.categoryAr || 'دورة عامة',
      level: courseData.level || 'Beginner',
      levelAr: courseData.levelAr || 'مبتدئ',
      price: courseData.price ?? 89,
      currency: courseData.currency || 'USD',
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      promoVideoUrl: courseData.promoVideoUrl || '',
      instructorName: courseData.instructorName || 'Ustadha Abeer Gad',
      isPublished: courseData.isPublished ?? true,
      featured: courseData.featured ?? false,
      durationHours: courseData.durationHours || 10,
      studentsCount: courseData.studentsCount || 0,
      rating: 5.0,
      reviewsCount: 0,
      chapters: courseData.chapters || [
        {
          id: `ch-${Date.now()}-1`,
          title: 'Module 1: Introduction & Foundations',
          titleAr: 'الوحدة الأولى: المدخل والأسس',
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              title: 'Lesson 1: Core Principles',
              titleAr: 'الدرس الأول: المبادئ الأساسية',
              duration: '30m',
              durationMinutes: 30,
              videoUrl: courseData.promoVideoUrl || '',
              isFree: true,
            },
          ],
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    store.courses.unshift(newCourse);
    saveStore(store);
    return newCourse;
  }
}

export function deleteCourse(id: string): boolean {
  const store = ensureStoreExists();
  const initialLength = store.courses.length;
  store.courses = store.courses.filter((c) => c.id !== id);
  if (store.courses.length !== initialLength) {
    saveStore(store);
    return true;
  }
  return false;
}

export function togglePublishCourse(id: string): CourseData | null {
  const store = ensureStoreExists();
  const course = store.courses.find((c) => c.id === id);
  if (!course) return null;
  course.isPublished = !course.isPublished;
  course.updatedAt = new Date().toISOString();
  saveStore(store);
  return course;
}

export function addChapterToCourse(courseId: string, chapter: Omit<ChapterData, 'id'> & { id?: string }): CourseData | null {
  const store = ensureStoreExists();
  const course = store.courses.find((c) => c.id === courseId);
  if (!course) return null;

  const newChapter: ChapterData = {
    id: chapter.id || `ch-${Date.now()}`,
    title: chapter.title,
    titleAr: chapter.titleAr || chapter.title,
    lessons: chapter.lessons || [],
  };
  course.chapters.push(newChapter);
  course.updatedAt = new Date().toISOString();
  saveStore(store);
  return course;
}

export function deleteChapterFromCourse(courseId: string, chapterId: string): CourseData | null {
  const store = ensureStoreExists();
  const course = store.courses.find((c) => c.id === courseId);
  if (!course) return null;

  course.chapters = course.chapters.filter((ch) => ch.id !== chapterId);
  course.updatedAt = new Date().toISOString();
  saveStore(store);
  return course;
}

export function addLessonToChapter(
  courseId: string,
  chapterId: string,
  lesson: Omit<LessonData, 'id'> & { id?: string }
): CourseData | null {
  const store = ensureStoreExists();
  const course = store.courses.find((c) => c.id === courseId);
  if (!course) return null;

  const chapter = course.chapters.find((ch) => ch.id === chapterId);
  if (!chapter) return null;

  const newLesson: LessonData = {
    id: lesson.id || `les-${Date.now()}`,
    title: lesson.title,
    titleAr: lesson.titleAr || lesson.title,
    duration: lesson.duration || '30m',
    durationMinutes: lesson.durationMinutes || 30,
    videoUrl: lesson.videoUrl || '',
    isFree: lesson.isFree ?? false,
    notes: lesson.notes,
  };
  chapter.lessons.push(newLesson);
  course.updatedAt = new Date().toISOString();
  saveStore(store);
  return course;
}

export function deleteLessonFromChapter(courseId: string, chapterId: string, lessonId: string): CourseData | null {
  const store = ensureStoreExists();
  const course = store.courses.find((c) => c.id === courseId);
  if (!course) return null;

  const chapter = course.chapters.find((ch) => ch.id === chapterId);
  if (!chapter) return null;

  chapter.lessons = chapter.lessons.filter((les) => les.id !== lessonId);
  course.updatedAt = new Date().toISOString();
  saveStore(store);
  return course;
}

export function toggleLessonPreview(courseId: string, chapterId: string, lessonId: string): CourseData | null {
  const store = ensureStoreExists();
  const course = store.courses.find((c) => c.id === courseId);
  if (!course) return null;

  const chapter = course.chapters.find((ch) => ch.id === chapterId);
  if (!chapter) return null;

  const lesson = chapter.lessons.find((les) => les.id === lessonId);
  if (!lesson) return null;

  lesson.isFree = !lesson.isFree;
  course.updatedAt = new Date().toISOString();
  saveStore(store);
  return course;
}

// Resources CRUD
export function getResources(): ResourceData[] {
  const store = ensureStoreExists();
  return store.resources || [];
}

export function saveResource(data: Partial<ResourceData> & { title: string }): ResourceData {
  const store = ensureStoreExists();
  const now = new Date().toISOString();

  if (data.id) {
    const idx = store.resources.findIndex((r) => r.id === data.id);
    if (idx >= 0) {
      store.resources[idx] = { ...store.resources[idx], ...data } as ResourceData;
      saveStore(store);
      return store.resources[idx];
    }
  }

  const newRes: ResourceData = {
    id: `res-${Date.now()}`,
    title: data.title,
    titleAr: data.titleAr || data.title,
    category: data.category || 'General',
    fileType: data.fileType || 'PDF',
    fileUrl: data.fileUrl || '/downloads/resource.pdf',
    fileSizeMb: data.fileSizeMb || 2.5,
    isPremium: data.isPremium ?? false,
    downloads: 0,
    createdAt: now,
  };
  store.resources.unshift(newRes);
  saveStore(store);
  return newRes;
}

export function deleteResource(id: string): boolean {
  const store = ensureStoreExists();
  const initialLength = store.resources.length;
  store.resources = store.resources.filter((r) => r.id !== id);
  if (store.resources.length !== initialLength) {
    saveStore(store);
    return true;
  }
  return false;
}

// Slots CRUD
export function getSlots(): SlotData[] {
  const store = ensureStoreExists();
  return store.slots || [];
}

export function saveSlot(data: Partial<SlotData> & { date: string; time: string }): SlotData {
  const store = ensureStoreExists();
  const now = new Date().toISOString();

  if (data.id) {
    const idx = store.slots.findIndex((s) => s.id === data.id);
    if (idx >= 0) {
      store.slots[idx] = { ...store.slots[idx], ...data } as SlotData;
      saveStore(store);
      return store.slots[idx];
    }
  }

  // Auto-calculate dynamic time-based price if not explicitly provided
  const pricing = store.settings?.slotPricing || DEFAULT_SLOT_PRICING;
  const calculated = calculateSlotPrice(data.time, pricing);
  const finalPrice = typeof data.price === 'number' && data.price >= 0 ? data.price : calculated.price;

  const newSlot: SlotData = {
    id: `slot-${Date.now()}`,
    date: data.date,
    time: data.time,
    instructor: data.instructor || 'Ustadha Abeer Gad',
    price: finalPrice,
    currency: data.currency || pricing.currency || 'USD',
    status: data.status || 'AVAILABLE',
    meetingUrl: data.meetingUrl || 'https://meet.google.com/abeergad-academy',
    notes: data.notes,
    createdAt: now,
  };
  store.slots.unshift(newSlot);
  saveStore(store);
  return newSlot;
}

export function applyPricingToAllSlots(): { updatedCount: number; slots: SlotData[] } {
  const store = ensureStoreExists();
  const pricing = store.settings?.slotPricing || DEFAULT_SLOT_PRICING;
  let count = 0;
  store.slots = (store.slots || []).map((s) => {
    // Only update available slots, or all slots
    const calculated = calculateSlotPrice(s.time, pricing);
    count++;
    return {
      ...s,
      price: calculated.price,
      currency: pricing.currency || s.currency || 'USD',
    };
  });
  saveStore(store);
  return { updatedCount: count, slots: store.slots };
}

export function toggleSlotStatus(id: string): SlotData | null {
  const store = ensureStoreExists();
  const slot = store.slots.find((s) => s.id === id);
  if (!slot) return null;
  slot.status = slot.status === 'AVAILABLE' ? 'BOOKED' : 'AVAILABLE';
  if (slot.status === 'AVAILABLE') {
    slot.studentName = undefined;
    slot.studentEmail = undefined;
  } else {
    slot.studentName = 'Assigned via Dashboard';
  }
  saveStore(store);
  return slot;
}

export function bookSlot(
  id: string,
  bookingInfo: {
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    notes?: string;
  }
): SlotData | null {
  const store = ensureStoreExists();
  const slot = store.slots.find((s) => s.id === id);
  if (!slot) return null;

  slot.status = 'BOOKED';
  slot.studentName = bookingInfo.studentName;
  slot.studentEmail = bookingInfo.studentEmail;
  slot.studentPhone = bookingInfo.studentPhone;
  if (bookingInfo.notes) {
    slot.notes = bookingInfo.notes;
  }

  // Also record a student or transaction if not existing
  const studentExists = store.students.some((st) => st.email.toLowerCase() === bookingInfo.studentEmail.toLowerCase());
  if (!studentExists) {
    store.students.push({
      id: `std-${Date.now()}`,
      name: bookingInfo.studentName,
      email: bookingInfo.studentEmail,
      joinedDate: new Date().toISOString().slice(0, 10),
      enrolledCoursesCount: 0,
      completedLessonsCount: 1,
      progressPercentage: 100,
    });
  }

  saveStore(store);
  return slot;
}

export function deleteSlot(id: string): boolean {
  const store = ensureStoreExists();
  const initialLength = store.slots.length;
  store.slots = store.slots.filter((s) => s.id !== id);
  if (store.slots.length !== initialLength) {
    saveStore(store);
    return true;
  }
  return false;
}

// Transactions
export function getTransactions(): TransactionData[] {
  const store = ensureStoreExists();
  return store.transactions || [];
}

export function saveTransaction(data: Omit<TransactionData, 'id'>): TransactionData {
  const store = ensureStoreExists();
  const newTx: TransactionData = {
    id: `tx-${Date.now()}`,
    ...data,
  };
  store.transactions.unshift(newTx);
  saveStore(store);
  return newTx;
}

// Students
export function getStudents(): StudentData[] {
  const store = ensureStoreExists();
  return store.students || [];
}

export function recordStudent(data: { name: string; email: string; phone?: string }): StudentData {
  const store = ensureStoreExists();
  const existing = store.students.find((s) => s.email.toLowerCase() === data.email.toLowerCase());
  if (existing) {
    if (data.name && (!existing.name || existing.name === 'Student')) {
      existing.name = data.name;
    }
    existing.enrolledCoursesCount = (existing.enrolledCoursesCount || 0) + 1;
    saveStore(store);
    return existing;
  }
  const newStudent: StudentData = {
    id: `stu-${Date.now()}`,
    name: data.name || 'Student',
    email: data.email,
    joinedDate: new Date().toISOString().split('T')[0],
    enrolledCoursesCount: 1,
    completedLessonsCount: 0,
    progressPercentage: 0,
  };
  store.students.unshift(newStudent);
  saveStore(store);
  return newStudent;
}

// Settings
export function getSiteSettings(): SiteSettingsData {
  const store = ensureStoreExists();
  return store.settings || INITIAL_SETTINGS;
}

export function updateSiteSettings(settings: Partial<SiteSettingsData>): SiteSettingsData {
  const store = ensureStoreExists();
  store.settings = {
    ...store.settings,
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  saveStore(store);
  return store.settings;
}
