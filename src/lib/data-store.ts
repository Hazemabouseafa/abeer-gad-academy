import fs from 'fs';
import path from 'path';

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

const INITIAL_COURSES: CourseData[] = [
  {
    id: 'course-1',
    slug: 'foundational-arabic-alphabet-grammar',
    title: 'Foundational Arabic: Phonetics to Sentence Mastery',
    titleAr: 'تأسيس اللغة العربية: من مخارج الحروف إلى إعراب الجمل',
    subtitle: 'Comprehensive program from letter articulation to fluent conversation and syntax.',
    subtitleAr: 'برنامج متكامل من مخارج الحروف والتشكيل وحتى الفصاحة وإعراب الجمل المركبة.',
    description:
      'Engineered specifically for non-native and heritage learners under the direct scholarship of Ustadha Abeer Gad. This course demystifies classical Arabic morphology (Sarf) and syntax (Nahw) through interactive exercises, high-definition phonetic breakdowns, and conversational immersion.',
    descriptionAr:
      'صُمم هذا البرنامج خصيصاً لغير الناطقين بالعربية والراغبين في التأسيس المتين بإشراف الأستاذة عبير جاد. يغطي البرنامج قواعد الصرف والنحو عبر تدريبات تفاعلية وتفكيك صوتي مرئي لجميع مخارج الحروف.',
    category: 'Learn Arabic',
    categoryAr: 'تعلم العربية',
    level: 'Beginner',
    levelAr: 'مبتدئ',
    price: 89,
    currency: 'USD',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    promoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorName: 'Ustadha Abeer Gad',
    isPublished: true,
    featured: true,
    durationHours: 12,
    studentsCount: 420,
    rating: 5.0,
    reviewsCount: 142,
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-22T12:00:00.000Z',
    chapters: [
      {
        id: 'ch-1-1',
        title: 'Module 1: The Arabic Phonetic System & Articulation Points',
        titleAr: 'الوحدة الأولى: النظام الصوتي العربي ومخارج الحروف',
        lessons: [
          {
            id: 'les-1-1-1',
            title: 'Anatomy of the Vocal Tract & Arabic Letters',
            titleAr: 'تشريح جهاز النطق والحروف العربية',
            duration: '28m',
            durationMinutes: 28,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: true,
            notes: 'Detailed diagrams of the throat, tongue, and lips articulation points.',
          },
          {
            id: 'les-1-1-2',
            title: 'Short & Long Vowels (Harakat and Madd Letters)',
            titleAr: 'الحركات القصيرة وحروف المد الطويلة',
            duration: '34m',
            durationMinutes: 34,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: true,
          },
          {
            id: 'les-1-1-3',
            title: 'The Subtle Rules of Sukoon & Tanween',
            titleAr: 'أحكام السكون والتنوين في النطق',
            duration: '40m',
            durationMinutes: 40,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: false,
          },
        ],
      },
      {
        id: 'ch-1-2',
        title: 'Module 2: Morphology (Sarf) - Root Systems & Word Derivation',
        titleAr: 'الوحدة الثانية: علم الصرف - نظام الجذور واشتقاق الكلمات',
        lessons: [
          {
            id: 'les-1-2-1',
            title: 'The Tri-literal Root Principle (Fa-Ai-La)',
            titleAr: 'مبدأ الجذر الثلاثي والميزان الصرفي',
            duration: '45m',
            durationMinutes: 45,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: false,
          },
          {
            id: 'les-1-2-2',
            title: 'Deriving Nouns, Adjectives, and Active Participles',
            titleAr: 'اشتقاق الأسماء والصفات واسم الفاعل',
            duration: '50m',
            durationMinutes: 50,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: false,
          },
        ],
      },
      {
        id: 'ch-1-3',
        title: 'Module 3: Syntax (Nahw) & Practical Conversational Fluency',
        titleAr: 'الوحدة الثالثة: النحو والتطبيق العملي للمحادثة',
        lessons: [
          {
            id: 'les-1-3-1',
            title: 'Nominal Sentence (Jumla Ismiyyah) & Parsing',
            titleAr: 'الجملة الاسمية وأركانها وإعرابها',
            duration: '55m',
            durationMinutes: 55,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: false,
          },
          {
            id: 'les-1-3-2',
            title: 'Verbal Sentence (Jumla Fi\'liyyah) & Conjugation',
            titleAr: 'الجملة الفعلية وتصريف الأفعال',
            duration: '58m',
            durationMinutes: 58,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: false,
          },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    slug: 'tajweed-and-makharij-masterclass',
    title: 'Tajweed Rules & Accurate Articulation (Makhaarij)',
    titleAr: 'أحكام التجويد وضبط مخارج الحروف والصفات',
    subtitle: 'Master the rules of Noon Sakinah, Meem, Madd, and phonetic characteristics.',
    subtitleAr: 'دراسة تطبيقية لأحكام النون والميم والمدود وصفات الحروف مع توجيهات السند المتصل.',
    description:
      'An in-depth theoretical and audio-visual course on the science of Tajweed. Study the classic poem Tuhfat al-Atfal and Al-Jazariyyah with modern high-definition acoustic diagrams and personal corrections.',
    descriptionAr:
      'دورة تخصصية تجمع بين دراسة منظومتي تحفة الأطفال والجزرية مع الشرح الصوتي العملي وتدريبات تصحيح الأخطاء الشائعة في التلاوة تحت إشراف الإجازة النبوية.',
    category: 'Tajweed',
    categoryAr: 'علم التجويد',
    level: 'Intermediate',
    levelAr: 'متوسط',
    price: 110,
    currency: 'USD',
    thumbnail: 'https://images.unsplash.com/photo-1584281729288-89826ac70b0a?auto=format&fit=crop&w=1200&q=80',
    promoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorName: 'Ustadha Abeer Gad',
    isPublished: true,
    featured: true,
    durationHours: 16,
    studentsCount: 580,
    rating: 5.0,
    reviewsCount: 210,
    createdAt: '2026-10-02T10:00:00.000Z',
    updatedAt: '2026-10-22T12:00:00.000Z',
    chapters: [
      {
        id: 'ch-2-1',
        title: 'Module 1: Principles of Noon Sakinah and Tanween',
        titleAr: 'الوحدة الأولى: أحكام النون الساكنة والتنوين',
        lessons: [
          {
            id: 'les-2-1-1',
            title: 'Izhar Halqi (Clear Pronunciation) & Throat Letters',
            titleAr: 'الإظهار الحلقي وحروف الحلق الستة',
            duration: '32m',
            durationMinutes: 32,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: true,
          },
          {
            id: 'les-2-1-2',
            title: 'Idghaam with & without Ghunnah',
            titleAr: 'الإدغام بغنة وبغير غنة مع الأمثلة التطبيقية',
            duration: '42m',
            durationMinutes: 42,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: true,
          },
          {
            id: 'les-2-1-3',
            title: 'Iqlab & Ikhfa Haqiqi Precision',
            titleAr: 'الإقلاب والإخفاء الحقيقي مع أزمنة الغنن',
            duration: '48m',
            durationMinutes: 48,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: false,
          },
        ],
      },
      {
        id: 'ch-2-2',
        title: 'Module 2: The Rules of Madd (Prolongation)',
        titleAr: 'الوحدة الثانية: أحكام المدود وأنواعها وأزمنتها',
        lessons: [
          {
            id: 'les-2-2-1',
            title: 'Natural Madd (Asli) vs Secondary Madd (Far\'i)',
            titleAr: 'المد الأصلي والمد الفرعي بسبب الهمز أو السكون',
            duration: '50m',
            durationMinutes: 50,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: false,
          },
          {
            id: 'les-2-2-2',
            title: 'Madd Lazim: Word & Letter Based Formats',
            titleAr: 'المد اللازم الكلمي والحرفي المثقل والمخفف',
            duration: '55m',
            durationMinutes: 55,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: false,
          },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    slug: 'quran-memorization-hifz-methodology',
    title: 'Hifz Acceleration: Structured Memorization System',
    titleAr: 'منهجية الحفظ المتقن للقرآن الكريم وتثبيت المتشابهات',
    subtitle: 'Proven techniques for permanent retention, spaced repetition, and Mutashabihat mastery.',
    subtitleAr: 'تقنيات التثبيت الراسخ، التكرار المتباعد، وضبط الآيات المتشابهة في الحفظ.',
    description:
      'Gain lifelong discipline and flawless retention with this specialized methodology created from classical Hifz traditions and contemporary cognitive science. Includes individual revision calendars and ayah linkage algorithms.',
    descriptionAr:
      'اكتسب مهارة الحفظ الراسخ عبر نظام التكرار المتباعد وضبط المتشابهات اللفظية، مع جداول يومية مرنة بإشراف مباشر لمتابعة الأجزاء والسور.',
    category: 'Quran Memorization',
    categoryAr: 'حفظ القرآن',
    level: 'All Levels',
    levelAr: 'جميع المستويات',
    price: 125,
    currency: 'USD',
    thumbnail: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
    promoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    instructorName: 'Ustadha Abeer Gad',
    isPublished: true,
    featured: true,
    durationHours: 14,
    studentsCount: 250,
    rating: 5.0,
    reviewsCount: 98,
    createdAt: '2026-10-03T10:00:00.000Z',
    updatedAt: '2026-10-22T12:00:00.000Z',
    chapters: [
      {
        id: 'ch-3-1',
        title: 'Module 1: Cognitive Foundations of Quran Retention',
        titleAr: 'الوحدة الأولى: الأسس الذهنية للحفظ المتين',
        lessons: [
          {
            id: 'les-3-1-1',
            title: 'Visual Page Mapping & Mus-haf Consistency',
            titleAr: 'الرسم البصري للصفحة واختيار طبعة المصحف الثابتة',
            duration: '35m',
            durationMinutes: 35,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: true,
          },
          {
            id: 'les-3-1-2',
            title: 'The Spaced Repetition Cycle for Daily Werd',
            titleAr: 'دورة التكرار المتباعد للورد اليومي الجديد والماضي',
            duration: '45m',
            durationMinutes: 45,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isFree: false,
          },
        ],
      },
    ],
  },
];

const INITIAL_RESOURCES: ResourceData[] = [
  {
    id: 'res-1',
    title: 'Comprehensive Tajweed Rules & Articulation Chart',
    titleAr: 'مخطط مخارج وصفات الحروف العربية وأحكام التجويد الشامل',
    category: 'Tajweed Chart',
    fileType: 'PDF',
    fileUrl: '/downloads/tajweed-chart.pdf',
    fileSizeMb: 4.8,
    isPremium: false,
    downloads: 3820,
    createdAt: '2026-10-05T10:00:00.000Z',
  },
  {
    id: 'res-2',
    title: 'Classical Arabic Grammar (Nahw) Quick Reference Table',
    titleAr: 'جدول إعراب الجمل وقواعد النحو الأساسية للمبتدئين',
    category: 'Arabic Grammar',
    fileType: 'PDF',
    fileUrl: '/downloads/nahw-quick-reference.pdf',
    fileSizeMb: 3.2,
    isPremium: false,
    downloads: 2490,
    createdAt: '2026-10-06T10:00:00.000Z',
  },
  {
    id: 'res-3',
    title: '1,000 Essential Quranic Words & Root Meanings',
    titleAr: 'معجم أكثر 1000 كلمة تكراراً في القرآن الكريم وجذورها',
    category: 'Vocabulary Sheet',
    fileType: 'PDF',
    fileUrl: '/downloads/quran-vocabulary-1000.pdf',
    fileSizeMb: 6.5,
    isPremium: false,
    downloads: 4100,
    createdAt: '2026-10-07T10:00:00.000Z',
  },
  {
    id: 'res-4',
    title: 'Letter Articulation Audio Drills (High-Definition MP3)',
    titleAr: 'الملفات الصوتية لتدريب النطق ومخارج الحروف بدقة استوديو',
    category: 'Audio Practice',
    fileType: 'ZIP / MP3',
    fileUrl: '/downloads/articulation-drills.zip',
    fileSizeMb: 42.0,
    isPremium: true,
    downloads: 1850,
    createdAt: '2026-10-08T10:00:00.000Z',
  },
];

const INITIAL_SLOTS: SlotData[] = [
  {
    id: 'slot-1',
    date: '2026-10-24',
    time: '10:00 AM UTC',
    instructor: 'Ustadha Abeer Gad',
    price: 45,
    currency: 'USD',
    status: 'AVAILABLE',
    meetingUrl: 'https://meet.google.com/demo-session-1',
    createdAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'slot-2',
    date: '2026-10-24',
    time: '02:00 PM UTC',
    instructor: 'Ustadha Abeer Gad',
    price: 45,
    currency: 'USD',
    status: 'BOOKED',
    studentName: 'Omar Farooq',
    studentEmail: 'omar.farooq@example.com',
    meetingUrl: 'https://meet.google.com/demo-session-2',
    notes: 'Surah Al-Baqarah recitation check and Tajweed correction.',
    createdAt: '2026-10-20T11:00:00.000Z',
  },
  {
    id: 'slot-3',
    date: '2026-10-25',
    time: '09:00 AM UTC',
    instructor: 'Ustadha Abeer Gad',
    price: 45,
    currency: 'USD',
    status: 'AVAILABLE',
    meetingUrl: 'https://meet.google.com/demo-session-3',
    createdAt: '2026-10-20T12:00:00.000Z',
  },
  {
    id: 'slot-4',
    date: '2026-10-25',
    time: '05:00 PM UTC',
    instructor: 'Ustadha Abeer Gad',
    price: 45,
    currency: 'USD',
    status: 'BOOKED',
    studentName: 'Fatima Zahra',
    studentEmail: 'fatima.zahra@example.fr',
    meetingUrl: 'https://meet.google.com/demo-session-4',
    notes: 'Arabic conversation practice and verb conjugation drill.',
    createdAt: '2026-10-20T14:00:00.000Z',
  },
];

const INITIAL_TRANSACTIONS: TransactionData[] = [
  {
    id: 'tx-1',
    paypalOrderId: 'PAYID-M45892147K',
    payerEmail: 'tariq.mansoor@example.co.uk',
    itemTitle: 'Tajweed Rules & Accurate Articulation',
    itemType: 'COURSE',
    amount: 110,
    currency: 'USD',
    status: 'COMPLETED',
    date: '2026-10-22 14:15',
  },
  {
    id: 'tx-2',
    paypalOrderId: 'PAYID-M99301124L',
    payerEmail: 'fatima.zahra@example.fr',
    itemTitle: 'Private Lesson (Oct 24 02:00 PM)',
    itemType: 'PRIVATE_LESSON',
    amount: 45,
    currency: 'USD',
    status: 'COMPLETED',
    date: '2026-10-22 11:30',
  },
  {
    id: 'tx-3',
    paypalOrderId: 'PAYID-M11029482X',
    payerEmail: 'marcus.bilal@example.de',
    itemTitle: 'Foundational Arabic Masterclass',
    itemType: 'COURSE',
    amount: 89,
    currency: 'USD',
    status: 'COMPLETED',
    date: '2026-10-21 18:45',
  },
  {
    id: 'tx-4',
    paypalOrderId: 'PAYID-M55019238Z',
    payerEmail: 'ahmed.khalil@example.com',
    itemTitle: 'Hifz Acceleration Program',
    itemType: 'COURSE',
    amount: 125,
    currency: 'USD',
    status: 'COMPLETED',
    date: '2026-10-21 09:20',
  },
];

const INITIAL_STUDENTS: StudentData[] = [
  {
    id: 'stu-1',
    name: 'Tariq Mansoor',
    email: 'tariq.mansoor@example.co.uk',
    joinedDate: '2026-09-15',
    enrolledCoursesCount: 2,
    completedLessonsCount: 18,
    progressPercentage: 75,
  },
  {
    id: 'stu-2',
    name: 'Fatima Zahra',
    email: 'fatima.zahra@example.fr',
    joinedDate: '2026-09-22',
    enrolledCoursesCount: 1,
    completedLessonsCount: 8,
    progressPercentage: 40,
  },
  {
    id: 'stu-3',
    name: 'Marcus Bilal',
    email: 'marcus.bilal@example.de',
    joinedDate: '2026-10-02',
    enrolledCoursesCount: 1,
    completedLessonsCount: 14,
    progressPercentage: 60,
  },
  {
    id: 'stu-4',
    name: 'Aisha Al-Hashimi',
    email: 'aisha.hashimi@example.com',
    joinedDate: '2026-10-10',
    enrolledCoursesCount: 3,
    completedLessonsCount: 32,
    progressPercentage: 92,
  },
];

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
      promoVideoUrl: courseData.promoVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
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
              videoUrl: courseData.promoVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
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
    videoUrl: lesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
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

  const newSlot: SlotData = {
    id: `slot-${Date.now()}`,
    date: data.date,
    time: data.time,
    instructor: data.instructor || 'Ustadha Abeer Gad',
    price: data.price ?? 45,
    currency: data.currency || 'USD',
    status: data.status || 'AVAILABLE',
    meetingUrl: data.meetingUrl || 'https://meet.google.com/new-session',
    notes: data.notes,
    createdAt: now,
  };
  store.slots.unshift(newSlot);
  saveStore(store);
  return newSlot;
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
