import fs from 'fs';
import path from 'path';
import {
  SlotPricingSettings,
  DEFAULT_SLOT_PRICING,
  calculateSlotPrice,
} from './slot-pricing';
import { INITIAL_SERVICES } from './initial-tracks';

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
  payerName?: string;
  payerPhone?: string;
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
  phone?: string;
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

export type TrackItemActionType = 'PRIVATE_LESSON' | 'COURSE' | 'DIRECT_CONTENT' | 'CUSTOM_LINK';

export interface TrackItem {
  id: string;
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
  level?: string;
  levelAr?: string;
  duration?: string;
  durationAr?: string;
  lessonsCount?: number;
  points?: string[];
  pointsAr?: string[];

  // Admin-defined unit target & content logic
  actionType?: TrackItemActionType;
  linkedCourseSlug?: string;
  price?: number;
  isFree?: boolean;
  videoUrl?: string;
  fileUrl?: string;
  detailedContentAr?: string;
  detailedContentEn?: string;
  ctaTextAr?: string;
  ctaTextEn?: string;
  customUrl?: string;
}

export interface ServiceCardItem {
  id: string;
  categoryKey: 'all' | 'quran' | 'arabic' | 'private' | 'specialized' | 'tajweed' | 'general';
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
  items?: TrackItem[];
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

  // Blocked Dates (Days marked by Admin as busy / unavailable; all other days are open by default)
  blockedDates?: string[];

  // PayPal Integration Settings
  paypalClientId?: string;
  paypalClientSecret?: string;
  paypalMode?: 'live' | 'sandbox';

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

// INITIAL_SERVICES is imported from ./initial-tracks with full track items

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

  // Blocked Dates Default (empty = all days are available by default)
  blockedDates: [],

  // PayPal Settings Defaults (reads from env if available, editable from Admin Dashboard)
  paypalClientId: (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '').replace(/['"]/g, '').trim(),
  paypalClientSecret: (process.env.PAYPAL_CLIENT_SECRET || '').replace(/['"]/g, '').trim(),
  paypalMode: ((process.env.PAYPAL_MODE || 'live').replace(/['"]/g, '').trim().toLowerCase() === 'sandbox'
    ? 'sandbox'
    : 'live') as 'live' | 'sandbox',

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
    if (!parsed.settings.paypalClientId && INITIAL_SETTINGS.paypalClientId) {
      parsed.settings.paypalClientId = INITIAL_SETTINGS.paypalClientId;
    }
    if (!parsed.settings.paypalClientSecret && INITIAL_SETTINGS.paypalClientSecret) {
      parsed.settings.paypalClientSecret = INITIAL_SETTINGS.paypalClientSecret;
    }
    if (!parsed.settings.paypalMode) {
      parsed.settings.paypalMode = INITIAL_SETTINGS.paypalMode || 'live';
    }
    parsed.settings.slotPricing = {
      ...DEFAULT_SLOT_PRICING,
      ...(parsed.settings.slotPricing || {}),
    };
    if (!Array.isArray(parsed.settings.blockedDates)) {
      parsed.settings.blockedDates = [];
    }
    if (!parsed.settings.services || parsed.settings.services.length === 0) {
      parsed.settings.services = INITIAL_SERVICES;
    } else {
      // Ensure all services have their items populated if missing
      parsed.settings.services = parsed.settings.services.map((svc) => {
        if (!Array.isArray(svc.items) || svc.items.length === 0) {
          const match = INITIAL_SERVICES.find((init) => init.id === svc.id || init.href === svc.href);
          if (match?.items && match.items.length > 0) {
            return { ...svc, items: match.items };
          }
        }
        return svc;
      });
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

export function getBlockedDates(): string[] {
  const store = ensureStoreExists();
  return Array.isArray(store.settings?.blockedDates) ? store.settings.blockedDates : [];
}

export function toggleBlockedDate(dateStr: string): string[] {
  const store = ensureStoreExists();
  const current = Array.isArray(store.settings?.blockedDates) ? [...store.settings.blockedDates] : [];
  const idx = current.indexOf(dateStr);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(dateStr);
    current.sort();
  }
  store.settings.blockedDates = current;
  store.settings.updatedAt = new Date().toISOString();
  saveStore(store);
  return current;
}

export function setBlockedDates(dates: string[]): string[] {
  const store = ensureStoreExists();
  const clean = Array.from(new Set((dates || []).filter(Boolean))).sort();
  store.settings.blockedDates = clean;
  store.settings.updatedAt = new Date().toISOString();
  saveStore(store);
  return clean;
}

export function bookSlot(
  id: string,
  bookingInfo: {
    date?: string;
    time?: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    notes?: string;
  }
): SlotData | null {
  const store = ensureStoreExists();
  const pricing = store.settings?.slotPricing || DEFAULT_SLOT_PRICING;
  const blockedDates = Array.isArray(store.settings?.blockedDates) ? store.settings.blockedDates : [];

  let slot = store.slots.find((s) => s.id === id);

  // If no slot matched by id, check if date & time are provided (open calendar booking)
  const targetDate = slot?.date || bookingInfo.date;
  const targetTime = slot?.time || bookingInfo.time;

  if (!targetDate || !targetTime) {
    return null;
  }

  // Reject if the date is blocked by Admin
  if (blockedDates.includes(targetDate)) {
    return null;
  }

  // Check if there is an existing slot at the same date & time
  if (!slot) {
    slot = store.slots.find(
      (s) => s.date === targetDate && s.time.trim().toLowerCase() === targetTime.trim().toLowerCase()
    );
  }

  // If already booked by someone else, reject
  if (slot && slot.status === 'BOOKED') {
    return null;
  }

  const calculated = calculateSlotPrice(targetTime, pricing);

  if (slot) {
    slot.status = 'BOOKED';
    slot.price = calculated.price;
    slot.currency = pricing.currency || slot.currency || 'USD';
    slot.studentName = bookingInfo.studentName;
    slot.studentEmail = bookingInfo.studentEmail;
    slot.studentPhone = bookingInfo.studentPhone;
    if (bookingInfo.notes) {
      slot.notes = bookingInfo.notes;
    }
  } else {
    slot = {
      id: `slot-${Date.now()}`,
      date: targetDate,
      time: targetTime,
      instructor: 'Ustadha Abeer Gad',
      price: calculated.price,
      currency: pricing.currency || 'USD',
      status: 'BOOKED',
      studentName: bookingInfo.studentName,
      studentEmail: bookingInfo.studentEmail,
      studentPhone: bookingInfo.studentPhone,
      meetingUrl: 'https://meet.google.com/abeergad-academy',
      notes: bookingInfo.notes,
      createdAt: new Date().toISOString(),
    };
    store.slots.unshift(slot);
  }

  // Also record or update student
  const existingStudent = store.students.find(
    (st) => st.email.toLowerCase() === bookingInfo.studentEmail.toLowerCase()
  );
  if (existingStudent) {
    if (bookingInfo.studentName) existingStudent.name = bookingInfo.studentName;
    if (bookingInfo.studentPhone) existingStudent.phone = bookingInfo.studentPhone;
    existingStudent.completedLessonsCount = (existingStudent.completedLessonsCount || 0) + 1;
  } else {
    store.students.unshift({
      id: `std-${Date.now()}`,
      name: bookingInfo.studentName,
      email: bookingInfo.studentEmail,
      phone: bookingInfo.studentPhone,
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

export function saveTransaction(data: Omit<TransactionData, 'id'> & { id?: string }): TransactionData {
  const store = ensureStoreExists();
  if (data.id) {
    const idx = store.transactions.findIndex((t) => t.id === data.id);
    if (idx >= 0) {
      store.transactions[idx] = { ...store.transactions[idx], ...data, id: data.id };
      saveStore(store);
      return store.transactions[idx];
    }
  }
  const newTx: TransactionData = {
    ...data,
    id: data.id || `tx-${Date.now()}`,
  };
  store.transactions.unshift(newTx);
  saveStore(store);
  return newTx;
}

export function deleteTransaction(id: string): boolean {
  const store = ensureStoreExists();
  const initialLen = store.transactions.length;
  store.transactions = store.transactions.filter((t) => t.id !== id);
  if (store.transactions.length !== initialLen) {
    saveStore(store);
    return true;
  }
  return false;
}

// Students
export function getStudents(): StudentData[] {
  const store = ensureStoreExists();
  return store.students || [];
}

export function recordStudent(data: {
  name: string;
  email: string;
  phone?: string;
  itemType?: 'COURSE' | 'PRIVATE_LESSON';
  itemId?: string;
}): StudentData {
  const store = ensureStoreExists();

  // Increment course studentsCount if enrolling in a course
  if (data.itemType === 'COURSE' && data.itemId) {
    const course = store.courses.find((c) => c.id === data.itemId || c.slug === data.itemId);
    if (course) {
      course.studentsCount = (course.studentsCount || 0) + 1;
    }
  }

  const existing = store.students.find((s) => s.email.toLowerCase() === data.email.toLowerCase());
  if (existing) {
    if (data.name && (!existing.name || existing.name === 'Student')) {
      existing.name = data.name;
    }
    if (data.phone) {
      existing.phone = data.phone;
    }
    if (data.itemType === 'PRIVATE_LESSON') {
      existing.completedLessonsCount = (existing.completedLessonsCount || 0) + 1;
    } else {
      existing.enrolledCoursesCount = (existing.enrolledCoursesCount || 0) + 1;
    }
    saveStore(store);
    return existing;
  }
  const newStudent: StudentData = {
    id: `stu-${Date.now()}`,
    name: data.name || 'Student',
    email: data.email,
    phone: data.phone,
    joinedDate: new Date().toISOString().split('T')[0],
    enrolledCoursesCount: data.itemType === 'PRIVATE_LESSON' ? 0 : 1,
    completedLessonsCount: data.itemType === 'PRIVATE_LESSON' ? 1 : 0,
    progressPercentage: data.itemType === 'PRIVATE_LESSON' ? 100 : 10,
  };
  store.students.unshift(newStudent);
  saveStore(store);
  return newStudent;
}

export function saveStudent(data: Partial<StudentData> & { name: string; email: string }): StudentData {
  const store = ensureStoreExists();
  if (data.id) {
    const idx = store.students.findIndex((s) => s.id === data.id);
    if (idx >= 0) {
      store.students[idx] = { ...store.students[idx], ...data };
      saveStore(store);
      return store.students[idx];
    }
  }
  const newStudent: StudentData = {
    id: `stu-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    joinedDate: data.joinedDate || new Date().toISOString().split('T')[0],
    enrolledCoursesCount: Number(data.enrolledCoursesCount) || 0,
    completedLessonsCount: Number(data.completedLessonsCount) || 0,
    progressPercentage: Number(data.progressPercentage) || 0,
  };
  store.students.unshift(newStudent);
  saveStore(store);
  return newStudent;
}

export function deleteStudent(id: string): boolean {
  const store = ensureStoreExists();
  const initialLen = store.students.length;
  store.students = store.students.filter((s) => s.id !== id);
  if (store.students.length !== initialLen) {
    saveStore(store);
    return true;
  }
  return false;
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

// ==============================================================================
// Tracks & Track Items CRUD (إدارة المسارات والمراحل والوحدات التعليمية)
// ==============================================================================

export function getTracks(): ServiceCardItem[] {
  const store = ensureStoreExists();
  return store.settings?.services || INITIAL_SERVICES;
}

export function getTrackById(id: string): ServiceCardItem | undefined {
  const tracks = getTracks();
  return tracks.find((t) => t.id === id);
}

export function getTrackByHref(href: string): ServiceCardItem | undefined {
  const tracks = getTracks();
  const clean = href.replace(/^\/+|\/+$/g, '').replace(/^tracks\//, '');
  return tracks.find((t) => {
    const tClean = t.href.replace(/^\/+|\/+$/g, '').replace(/^tracks\//, '');
    return (
      tClean === clean ||
      t.id === clean ||
      t.id.endsWith(clean) ||
      t.href === href ||
      t.href === `/${clean}` ||
      t.href === `/tracks/${clean}`
    );
  });
}

export function saveTrack(data: Partial<ServiceCardItem>): ServiceCardItem {
  const store = ensureStoreExists();
  const services = [...(store.settings?.services || INITIAL_SERVICES)];

  if (data.id) {
    const idx = services.findIndex((s) => s.id === data.id);
    if (idx >= 0) {
      services[idx] = {
        ...services[idx],
        ...data,
        items: data.items !== undefined ? data.items : services[idx].items || [],
      };
      store.settings.services = services;
      store.settings.updatedAt = new Date().toISOString();
      saveStore(store);
      return services[idx];
    }
  }

  // Create new track
  const newId = data.id || `track-${Date.now()}`;
  let routePath = data.href || `/tracks/${newId}`;
  if (!routePath.startsWith('/')) routePath = `/${routePath}`;

  const newTrack: ServiceCardItem = {
    id: newId,
    categoryKey: data.categoryKey || 'general',
    href: routePath,
    titleAr: data.titleAr || 'مسار تعليمي جديد',
    titleEn: data.titleEn || data.titleAr || 'New Academic Track',
    badgeAr: data.badgeAr || 'مسار معتمد',
    badgeEn: data.badgeEn || 'Certified Track',
    subtitleAr: data.subtitleAr || '',
    subtitleEn: data.subtitleEn || '',
    levelAr: data.levelAr || 'كافة المستويات',
    levelEn: data.levelEn || 'All Levels',
    formatAr: data.formatAr || 'جلسات تفاعلية مباشرة أونلاين',
    formatEn: data.formatEn || 'Live Interactive Online Sessions',
    durationAr: data.durationAr || 'مرن',
    durationEn: data.durationEn || 'Flexible',
    sanadAr: data.sanadAr || 'شهادة إتمام معتمدة من الأكاديمية',
    sanadEn: data.sanadEn || 'Certified Completion Certificate',
    featuresAr: data.featuresAr || (data.items ? data.items.map((i) => i.titleAr) : []),
    featuresEn: data.featuresEn || (data.items ? data.items.map((i) => i.title) : []),
    isActive: data.isActive !== undefined ? data.isActive : true,
    items: data.items || [],
  };

  services.unshift(newTrack);
  store.settings.services = services;
  store.settings.updatedAt = new Date().toISOString();
  saveStore(store);
  return newTrack;
}

export function deleteTrack(id: string): boolean {
  const store = ensureStoreExists();
  const services = store.settings?.services || [...INITIAL_SERVICES];
  const initialLen = services.length;
  store.settings.services = services.filter((s) => s.id !== id);
  if (store.settings.services.length !== initialLen) {
    store.settings.updatedAt = new Date().toISOString();
    saveStore(store);
    return true;
  }
  return false;
}

export function saveTrackItem(trackId: string, itemData: Partial<TrackItem>): TrackItem | null {
  const store = ensureStoreExists();
  const services = [...(store.settings?.services || INITIAL_SERVICES)];
  const trackIdx = services.findIndex((s) => s.id === trackId);
  if (trackIdx < 0) return null;

  const track = { ...services[trackIdx] };
  const items = Array.isArray(track.items) ? [...track.items] : [];

  if (itemData.id) {
    const itemIdx = items.findIndex((it) => it.id === itemData.id);
    if (itemIdx >= 0) {
      items[itemIdx] = {
        ...items[itemIdx],
        ...itemData,
      } as TrackItem;
      track.items = items;
      // Sync quick features highlights
      track.featuresAr = items.map((i) => i.titleAr).slice(0, 4);
      track.featuresEn = items.map((i) => i.title).slice(0, 4);
      services[trackIdx] = track;
      store.settings.services = services;
      store.settings.updatedAt = new Date().toISOString();
      saveStore(store);
      return items[itemIdx];
    }
  }

  // Add new item to track
  const newItem: TrackItem = {
    id: itemData.id || `mod-${Date.now()}`,
    title: itemData.title || itemData.titleAr || 'New Module',
    titleAr: itemData.titleAr || 'وحدة تعليمية جديدة',
    desc: itemData.desc || '',
    descAr: itemData.descAr || '',
    level: itemData.level || `Stage ${items.length + 1}`,
    levelAr: itemData.levelAr || `المرحلة ${items.length + 1}`,
    duration: itemData.duration || '4 Weeks',
    durationAr: itemData.durationAr || '4 أسابيع',
    lessonsCount: itemData.lessonsCount || 10,
    points: itemData.points || [],
    pointsAr: itemData.pointsAr || [],
    actionType: itemData.actionType || 'PRIVATE_LESSON',
    linkedCourseSlug: itemData.linkedCourseSlug || '',
    price: itemData.price ?? 0,
    isFree: itemData.isFree ?? false,
    videoUrl: itemData.videoUrl || '',
    fileUrl: itemData.fileUrl || '',
    detailedContentAr: itemData.detailedContentAr || '',
    detailedContentEn: itemData.detailedContentEn || '',
    ctaTextAr: itemData.ctaTextAr || '',
    ctaTextEn: itemData.ctaTextEn || '',
    customUrl: itemData.customUrl || '',
  };

  items.push(newItem);
  track.items = items;
  track.featuresAr = items.map((i) => i.titleAr).slice(0, 4);
  track.featuresEn = items.map((i) => i.title).slice(0, 4);
  services[trackIdx] = track;
  store.settings.services = services;
  store.settings.updatedAt = new Date().toISOString();
  saveStore(store);
  return newItem;
}

export function deleteTrackItem(trackId: string, itemId: string): boolean {
  const store = ensureStoreExists();
  const services = [...(store.settings?.services || INITIAL_SERVICES)];
  const trackIdx = services.findIndex((s) => s.id === trackId);
  if (trackIdx < 0) return false;

  const track = { ...services[trackIdx] };
  if (!Array.isArray(track.items)) return false;

  const initialLen = track.items.length;
  track.items = track.items.filter((it) => it.id !== itemId);
  if (track.items.length !== initialLen) {
    track.featuresAr = track.items.map((i) => i.titleAr).slice(0, 4);
    track.featuresEn = track.items.map((i) => i.title).slice(0, 4);
    services[trackIdx] = track;
    store.settings.services = services;
    store.settings.updatedAt = new Date().toISOString();
    saveStore(store);
    return true;
  }
  return false;
}
