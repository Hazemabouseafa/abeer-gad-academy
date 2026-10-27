'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  DollarSign,
  Users,
  Calendar,
  Layers,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  Search,
  Filter,
  ExternalLink,
  Eye,
  EyeOff,
  Video,
  BookOpen,
  Settings,
  Megaphone,
  Phone,
  Mail,
  RefreshCw,
  X,
  Play,
  UploadCloud,
  Check,
  Sparkles,
  LayoutTemplate,
  LogOut,
  Globe,
  Quote,
  Star,
  Compass,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  FolderPlus,
  Save,
  Sun,
  Moon,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  calculateSlotPrice,
  DEFAULT_SLOT_PRICING,
  type SlotPricingSettings,
} from '@/lib/slot-pricing';
import type {
  CourseData,
  SlotData,
  ResourceData,
  TransactionData,
  StudentData,
  SiteSettingsData,
  TestimonialItem,
  PillarCardItem,
  ServiceCardItem,
  TrackItem,
  TrackItemActionType,
} from '@/lib/data-store';
import { MediaInputWithChoice } from './MediaInputWithChoice';

interface AdminDashboardClientProps {
  currentLocale: string;
}

export function AdminDashboardClient({ currentLocale }: AdminDashboardClientProps) {
  const router = useRouter();
  const isRtl = currentLocale === 'ar';

  // Navigation State (6 Non-Duplicated Core Modules)
  const [activeNav, setActiveNav] = useState<
    'OVERVIEW' | 'FRONTEND_CMS' | 'COURSES' | 'SLOTS' | 'RESOURCES' | 'FINANCIALS_STUDENTS'
  >('OVERVIEW');

  // Sub-tab inside FRONTEND_CMS
  const [cmsSubTab, setCmsSubTab] = useState<'HERO' | 'SERVICES' | 'TESTIMONIALS' | 'COMMUNICATION' | 'PAYPAL'>('HERO');

  // Sub-tab inside FINANCIALS_STUDENTS
  const [financeSubTab, setFinanceSubTab] = useState<'TRANSACTIONS' | 'STUDENTS' | 'PAYPAL_SETTINGS'>('TRANSACTIONS');

  // PayPal Configuration States
  const [showPayPalSecret, setShowPayPalSecret] = useState(false);
  const [testingPayPal, setTestingPayPal] = useState(false);
  const [savingPayPal, setSavingPayPal] = useState(false);
  const [paypalTestResult, setPaypalTestResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  // Service Inline Editor State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Smart Auto-Translation States
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState(true);
  const [translatingId, setTranslatingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [settings, setSettings] = useState<SiteSettingsData>({
    announcementEnabled: true,
    announcementTextEn: '',
    announcementTextAr: '',
    announcementLink: '/private-lessons',
    contactEmail: 'contact@abeergadacademy.com',
    contactPhone: '+20 100 000 0000',
    whatsappNumber: '+201000000000',
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
    heroStatsEnabled: true,
    heroStudentsCount: '1,250+',
    heroCountriesCount: '34+',
    heroSatisfactionRate: '5.0',
    heroLessonsCompleted: '850+',
    testimonials: [],
    pillars: [],
    services: [],
    footerAboutAr: '',
    footerAboutEn: '',
    updatedAt: '',
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);

  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [selectedCourseForCurriculum, setSelectedCourseForCurriculum] = useState<CourseData | null>(null);

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  // New Course Form State
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    titleAr: '',
    slug: '',
    subtitle: '',
    subtitleAr: '',
    description: '',
    descriptionAr: '',
    category: 'Learn Arabic',
    categoryAr: 'تعلم العربية',
    level: 'Beginner',
    levelAr: 'مبتدئ',
    price: 89,
    isFree: false,
    durationHours: 12,
    promoVideoUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    featured: true,
    initialChapterTitle: 'Module 1: Foundations & Core Principles',
    initialChapterTitleAr: 'الوحدة الأولى: المدخل والأسس المنهجية',
    initialLessonTitle: 'Lesson 1: Overview & First Steps',
    initialLessonTitleAr: 'الدرس الأول: نظرة عامة والخطوات التأسيسية',
    initialLessonVideoUrl: '',
  });

  // Curriculum Modals Form
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterTitleAr, setNewChapterTitleAr] = useState('');
  const [targetChapterId, setTargetChapterId] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonTitleAr, setNewLessonTitleAr] = useState('');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('30m');
  const [newLessonIsFree, setNewLessonIsFree] = useState(false);

  // Time-Based Dynamic Slot Pricing States
  const [slotPricingForm, setSlotPricingForm] = useState<SlotPricingSettings>(DEFAULT_SLOT_PRICING);
  const [savingPricing, setSavingPricing] = useState(false);
  const [applyingPricing, setApplyingPricing] = useState(false);

  // Slot Form
  const [slotFormData, setSlotFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM UTC',
    price: 45,
    instructor: 'Ustadha Abeer Gad',
    meetingUrl: 'https://meet.google.com/abeer-gad-session',
  });

  // Resource Form
  const [resourceFormData, setResourceFormData] = useState({
    title: '',
    titleAr: '',
    category: 'Tajweed Chart',
    fileType: 'PDF',
    fileUrl: '/downloads/resource.pdf',
    fileSizeMb: 3.5,
    isPremium: false,
  });

  // Testimonial Form
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialFormData, setTestimonialFormData] = useState<Partial<TestimonialItem>>({
    name: '',
    location: '',
    flag: '🌍',
    focus: 'Quran Memorization & Tajweed',
    focusAr: 'حفظ القرآن والتجويد',
    quote: '',
    quoteAr: '',
    rating: 5,
  });

  // Track & Curriculum Items Management States
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const [trackFormData, setTrackFormData] = useState({
    id: '',
    titleAr: '',
    titleEn: '',
    badgeAr: 'المسار الأكاديمي المعتمد',
    badgeEn: 'Certified Academic Track',
    subtitleAr: '',
    subtitleEn: '',
    categoryKey: 'general',
    href: '',
    levelAr: 'كافة المستويات',
    levelEn: 'All Levels',
    formatAr: 'جلسات تفاعلية أونلاين',
    formatEn: 'Live Interactive Online Sessions',
    durationAr: '3 أشهر',
    durationEn: '3 Months',
    sanadAr: 'شهادة إتمام معتمدة من الأكاديمية',
    sanadEn: 'Certified Completion Certificate',
  });
  const [savingTrack, setSavingTrack] = useState(false);

  // Track Items / Modules inside Track State
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [targetTrackIdForItem, setTargetTrackIdForItem] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemFormData, setItemFormData] = useState<{
    titleAr: string;
    title: string;
    levelAr: string;
    level: string;
    descAr: string;
    desc: string;
    durationAr: string;
    duration: string;
    lessonsCount: number;
    pointsTextAr: string;
    pointsTextEn: string;
    actionType: TrackItemActionType;
    linkedCourseSlug: string;
    price: number;
    isFree: boolean;
    videoUrl: string;
    fileUrl: string;
    detailedContentAr: string;
    detailedContentEn: string;
    ctaTextAr: string;
    ctaTextEn: string;
    customUrl: string;
  }>({
    titleAr: '',
    title: '',
    levelAr: '',
    level: '',
    descAr: '',
    desc: '',
    durationAr: '',
    duration: '',
    lessonsCount: 12,
    pointsTextAr: '',
    pointsTextEn: '',
    actionType: 'PRIVATE_LESSON',
    linkedCourseSlug: '',
    price: 0,
    isFree: false,
    videoUrl: '',
    fileUrl: '',
    detailedContentAr: '',
    detailedContentEn: '',
    ctaTextAr: '',
    ctaTextEn: '',
    customUrl: '',
  });
  const [savingItem, setSavingItem] = useState(false);
  const [expandedTracks, setExpandedTracks] = useState<Record<string, boolean>>({});

  // Admin Slots Calendar State
  const [adminCalendarMonth, setAdminCalendarMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [adminSelectedFilterDate, setAdminSelectedFilterDate] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  // Manual Transaction & Student Management State
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [txFormData, setTxFormData] = useState({
    payerName: '',
    payerEmail: '',
    payerPhone: '',
    itemTitle: '',
    itemType: 'COURSE' as 'COURSE' | 'PRIVATE_LESSON',
    amount: 45,
    status: 'COMPLETED' as 'COMPLETED' | 'PENDING' | 'REFUNDED',
    alsoRecordStudent: true,
  });
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enrolledCoursesCount: 1,
    completedLessonsCount: 0,
    progressPercentage: 0,
  });

  // Trigger Toast Notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper for batch translation
  const translateBatch = async (
    fields: Record<string, string | string[]>,
    targetLang = 'en'
  ): Promise<Record<string, string | string[]>> => {
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields, from: 'ar', to: targetLang }),
      });
      const data = await res.json();
      if (data.success && data.translatedFields) {
        return data.translatedFields;
      }
      return {};
    } catch (err) {
      console.error('Translation failed:', err);
      return {};
    }
  };

  const handleAutoTranslateArabicField = async (
    fieldNameAr: string,
    val: string,
    targetFieldEn: string,
    updater: (enVal: string) => void
  ) => {
    if (!autoTranslateEnabled || !val || !val.trim()) return;
    try {
      const res = await translateBatch({ [fieldNameAr]: val }, 'en');
      if (res[targetFieldEn] && typeof res[targetFieldEn] === 'string') {
        updater(res[targetFieldEn] as string);
      }
    } catch (e) {
      // silent fallback
    }
  };

  const handleTranslateHero = async () => {
    setTranslatingId('hero');
    try {
      const fields: Record<string, string> = {};
      if (settings.heroBadgeAr) fields.heroBadgeAr = settings.heroBadgeAr;
      if (settings.heroTitleAr) fields.heroTitleAr = settings.heroTitleAr;
      if (settings.heroTitleHighlightAr) fields.heroTitleHighlightAr = settings.heroTitleHighlightAr;
      if (settings.heroSubtitleAr) fields.heroSubtitleAr = settings.heroSubtitleAr;
      if (settings.heroCtaPrimaryTextAr) fields.heroCtaPrimaryTextAr = settings.heroCtaPrimaryTextAr;
      if (settings.heroCtaSecondaryTextAr) fields.heroCtaSecondaryTextAr = settings.heroCtaSecondaryTextAr;

      const translated = await translateBatch(fields, 'en');
      setSettings((prev) => ({
        ...prev,
        heroBadgeEn: (translated.heroBadgeEn as string) || prev.heroBadgeEn,
        heroTitleEn: (translated.heroTitleEn as string) || prev.heroTitleEn,
        heroTitleHighlightEn: (translated.heroTitleHighlightEn as string) || prev.heroTitleHighlightEn,
        heroSubtitleEn: (translated.heroSubtitleEn as string) || prev.heroSubtitleEn,
        heroCtaPrimaryTextEn: (translated.heroCtaPrimaryTextEn as string) || prev.heroCtaPrimaryTextEn,
        heroCtaSecondaryTextEn: (translated.heroCtaSecondaryTextEn as string) || prev.heroCtaSecondaryTextEn,
      }));
      triggerToast(isRtl ? 'تمت ترجمة نصوص الهيرو للإنجليزية بنجاح ✨' : 'Hero texts translated to English ✨');
    } catch (err) {
      console.error(err);
      triggerToast(isRtl ? 'تعذر إتمام الترجمة حالياً' : 'Translation failed');
    } finally {
      setTranslatingId(null);
    }
  };

  const handleTranslateService = async (serviceId: string) => {
    const s = (settings.services || []).find((item) => item.id === serviceId);
    if (!s) return;
    setTranslatingId(`service-${serviceId}`);
    try {
      const fields: Record<string, string | string[]> = {};
      if (s.titleAr) fields.titleAr = s.titleAr;
      if (s.badgeAr) fields.badgeAr = s.badgeAr;
      if (s.subtitleAr) fields.subtitleAr = s.subtitleAr;
      if (s.levelAr) fields.levelAr = s.levelAr;
      if (s.formatAr) fields.formatAr = s.formatAr;
      if (s.durationAr) fields.durationAr = s.durationAr;
      if (s.sanadAr) fields.sanadAr = s.sanadAr;
      if (Array.isArray(s.featuresAr) && s.featuresAr.length > 0) fields.featuresAr = s.featuresAr;

      const res = await translateBatch(fields, 'en');

      setSettings((prev) => ({
        ...prev,
        services: (prev.services || []).map((item) => {
          if (item.id !== serviceId) return item;
          return {
            ...item,
            titleEn: (res.titleEn as string) || item.titleEn,
            badgeEn: (res.badgeEn as string) || item.badgeEn,
            subtitleEn: (res.subtitleEn as string) || item.subtitleEn,
            levelEn: (res.levelEn as string) || item.levelEn,
            formatEn: (res.formatEn as string) || item.formatEn,
            durationEn: (res.durationEn as string) || item.durationEn,
            sanadEn: (res.sanadEn as string) || item.sanadEn,
            featuresEn: Array.isArray(res.featuresEn) ? (res.featuresEn as string[]) : item.featuresEn,
          };
        }),
      }));
      triggerToast(isRtl ? `تمت ترجمة خدمة "${s.titleAr || ''}" للإنجليزية بنجاح ✨` : 'Service translated to English ✨');
    } catch (err) {
      console.error(err);
      triggerToast(isRtl ? 'تعذر إتمام الترجمة حالياً' : 'Translation failed');
    } finally {
      setTranslatingId(null);
    }
  };

  const handleTranslateCommunication = async () => {
    setTranslatingId('communication');
    try {
      const fields: Record<string, string> = {};
      if (settings.announcementTextAr) fields.announcementTextAr = settings.announcementTextAr;
      if (settings.footerAboutAr) fields.footerAboutAr = settings.footerAboutAr;

      const res = await translateBatch(fields, 'en');

      setSettings((prev) => ({
        ...prev,
        announcementTextEn: (res.announcementTextEn as string) || prev.announcementTextEn,
        footerAboutEn: (res.footerAboutEn as string) || prev.footerAboutEn,
      }));
      triggerToast(isRtl ? 'تمت ترجمة نصوص الإعلان والفوتر للإنجليزية بنجاح ✨' : 'Announcement & Footer translated ✨');
    } catch (err) {
      console.error(err);
      triggerToast(isRtl ? 'تعذر إتمام الترجمة حالياً' : 'Translation failed');
    } finally {
      setTranslatingId(null);
    }
  };

  const handleTranslateCourseForm = async () => {
    setTranslatingId('course');
    try {
      const fields: Record<string, string> = {};
      if (courseFormData.titleAr) fields.titleAr = courseFormData.titleAr;
      if (courseFormData.subtitleAr) fields.subtitleAr = courseFormData.subtitleAr;
      if (courseFormData.descriptionAr) fields.descriptionAr = courseFormData.descriptionAr;

      const res = await translateBatch(fields, 'en');

      setCourseFormData((prev) => ({
        ...prev,
        title: (res.titleEn as string) || prev.title,
        subtitle: (res.subtitleEn as string) || prev.subtitle,
        description: (res.descriptionEn as string) || prev.description,
      }));
      triggerToast(isRtl ? 'تمت ترجمة بيانات الدورة للإنجليزية بنجاح ✨' : 'Course details translated ✨');
    } catch (err) {
      console.error(err);
      triggerToast(isRtl ? 'تعذر إتمام الترجمة حالياً' : 'Translation failed');
    } finally {
      setTranslatingId(null);
    }
  };

  // Sign out handler
  const handleSignOut = () => {
    document.cookie = 'abeer_admin_session=; path=/; max-age=0';
    router.push(`/${currentLocale}/admin/login`);
  };

  // Fetch all data from server
  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [resCourses, resSlots, resResources, resSettings, resTransactions, resStudents] = await Promise.all([
        fetch('/api/admin/courses').then((r) => r.json()),
        fetch('/api/admin/slots').then((r) => r.json()),
        fetch('/api/admin/resources').then((r) => r.json()),
        fetch('/api/admin/settings?admin=1').then((r) => r.json()),
        fetch('/api/admin/transactions').then((r) => r.json()).catch(() => ({ transactions: [] })),
        fetch('/api/admin/students').then((r) => r.json()).catch(() => ({ students: [] })),
      ]);

      if (resCourses.courses) setCourses(resCourses.courses);
      if (resSlots.slots) setSlots(resSlots.slots);
      if (Array.isArray(resSlots.blockedDates)) {
        setBlockedDates(resSlots.blockedDates);
      } else if (Array.isArray(resSettings.settings?.blockedDates)) {
        setBlockedDates(resSettings.settings.blockedDates);
      }
      if (resResources.resources) setResources(resResources.resources);
      if (resSettings.settings) {
        setSettings(resSettings.settings);
        if (resSettings.settings.slotPricing) {
          setSlotPricingForm({
            ...DEFAULT_SLOT_PRICING,
            ...resSettings.settings.slotPricing,
          });
        }
      }
      if (resTransactions && resTransactions.transactions) {
        setTransactions(resTransactions.transactions);
      } else {
        setTransactions([]);
      }
      if (resStudents && resStudents.students) {
        setStudents(resStudents.students);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Course Operations ---
  const handleOpenNewCourseModal = () => {
    setEditingCourse(null);
    setCourseFormData({
      title: '',
      titleAr: '',
      slug: '',
      subtitle: '',
      subtitleAr: '',
      description: '',
      descriptionAr: '',
      category: 'Learn Arabic',
      categoryAr: 'تعلم العربية',
      level: 'Beginner',
      levelAr: 'مبتدئ',
      price: 89,
      isFree: false,
      durationHours: 12,
      promoVideoUrl: '',
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      isPublished: true,
      featured: true,
      initialChapterTitle: 'Module 1: Foundations & Core Principles',
      initialChapterTitleAr: 'الوحدة الأولى: المدخل والأسس المنهجية',
      initialLessonTitle: 'Lesson 1: Overview & First Steps',
      initialLessonTitleAr: 'الدرس الأول: نظرة عامة والخطوات التأسيسية',
      initialLessonVideoUrl: '',
    });
    setShowCourseModal(true);
    setTimeout(() => {
      document.getElementById('course-inline-editor')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleOpenEditCourseModal = (course: CourseData) => {
    setEditingCourse(course);
    const isFree = Boolean(course.isFree || course.price === 0);
    setCourseFormData({
      title: course.title,
      titleAr: course.titleAr || '',
      slug: course.slug,
      subtitle: course.subtitle || '',
      subtitleAr: course.subtitleAr || '',
      description: course.description || '',
      descriptionAr: course.descriptionAr || '',
      category: course.category,
      categoryAr: course.categoryAr || '',
      level: course.level,
      levelAr: course.levelAr || '',
      price: isFree ? 0 : course.price,
      isFree,
      durationHours: course.durationHours || 10,
      promoVideoUrl: course.promoVideoUrl || '',
      thumbnail: course.thumbnail || '',
      isPublished: course.isPublished,
      featured: course.featured,
      initialChapterTitle: '',
      initialChapterTitleAr: '',
      initialLessonTitle: '',
      initialLessonTitleAr: '',
      initialLessonVideoUrl: '',
    });
    setShowCourseModal(true);
    setTimeout(() => {
      document.getElementById('course-inline-editor')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    let englishTitle = courseFormData.title;
    let englishSubtitle = courseFormData.subtitle;
    let englishDesc = courseFormData.description;
    let englishCategory = courseFormData.category;
    let englishLevel = courseFormData.level;

    if (autoTranslateEnabled) {
      const fieldsToTranslate: Record<string, string> = {};
      if (courseFormData.titleAr && !englishTitle) fieldsToTranslate.titleAr = courseFormData.titleAr;
      if (courseFormData.subtitleAr && !englishSubtitle) fieldsToTranslate.subtitleAr = courseFormData.subtitleAr;
      if (courseFormData.descriptionAr && !englishDesc) fieldsToTranslate.descriptionAr = courseFormData.descriptionAr;

      if (Object.keys(fieldsToTranslate).length > 0) {
        const trans = await translateBatch(fieldsToTranslate, 'en');
        if (trans.titleEn) englishTitle = trans.titleEn as string;
        if (trans.subtitleEn) englishSubtitle = trans.subtitleEn as string;
        if (trans.descriptionEn) englishDesc = trans.descriptionEn as string;
      }
    }

    let finalSlug = courseFormData.slug;
    if (!finalSlug && englishTitle) {
      finalSlug = englishTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    if (!englishTitle && courseFormData.titleAr) {
      englishTitle = courseFormData.titleAr;
    }
    if (!finalSlug) {
      finalSlug = `course-${Date.now()}`;
    }

    const payload: Partial<CourseData> & { title: string; slug: string } = {
      ...(editingCourse ? { id: editingCourse.id } : {}),
      title: englishTitle,
      titleAr: courseFormData.titleAr || englishTitle,
      slug: finalSlug.toLowerCase().replace(/\s+/g, '-'),
      subtitle: englishSubtitle,
      subtitleAr: courseFormData.subtitleAr,
      description: courseFormData.description,
      descriptionAr: courseFormData.descriptionAr,
      category: courseFormData.category,
      categoryAr: courseFormData.categoryAr,
      level: courseFormData.level,
      levelAr: courseFormData.levelAr,
      price: courseFormData.isFree ? 0 : (Number(courseFormData.price) || 0),
      isFree: courseFormData.isFree || Number(courseFormData.price) === 0,
      durationHours: Number(courseFormData.durationHours) || 10,
      promoVideoUrl: courseFormData.promoVideoUrl,
      thumbnail: courseFormData.thumbnail,
      isPublished: courseFormData.isPublished,
      featured: courseFormData.featured,
    };

    if (!editingCourse && courseFormData.initialChapterTitle) {
      payload.chapters = [
        {
          id: `ch-${Date.now()}-1`,
          title: courseFormData.initialChapterTitle,
          titleAr: courseFormData.initialChapterTitleAr || courseFormData.initialChapterTitle,
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              title: courseFormData.initialLessonTitle || 'Lesson 1',
              titleAr: courseFormData.initialLessonTitleAr || 'الدرس الأول',
              duration: '30m',
              durationMinutes: 30,
              videoUrl: courseFormData.initialLessonVideoUrl || courseFormData.promoVideoUrl,
              isFree: true,
            },
          ],
        },
      ];
    }

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(
          editingCourse
            ? (isRtl ? 'تم تحديث بيانات الدورة بنجاح' : 'Course updated successfully')
            : (isRtl ? 'تم رفع الدورة بنجاح ونشرها على المنصة' : 'Course published successfully!')
        );
        setShowCourseModal(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to save course');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

  const handleToggleCoursePublish = async (courseId: string) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/publish`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, isPublished: data.course.isPublished } : c))
        );
        triggerToast(
          data.course.isPublished
            ? (isRtl ? 'تم تفعيل نشر الدورة على الموقع' : 'Course published live')
            : (isRtl ? 'تم إلغاء نشر الدورة وحجبها' : 'Course unpublished')
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (courseId: string, title: string) => {
    if (!confirm(isRtl ? `هل أنت متأكد من حذف دورة "${title}" نهائياً؟` : `Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
        triggerToast(isRtl ? 'تم حذف الدورة بنجاح' : 'Course deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Curriculum Operations ---
  const handleOpenCurriculumModal = (course: CourseData) => {
    setSelectedCourseForCurriculum(course);
    setTargetChapterId(course.chapters[0]?.id || '');
    setShowCurriculumModal(true);
  };

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForCurriculum || (!newChapterTitle && !newChapterTitleAr)) return;

    let engTitle = newChapterTitle;
    const arTitle = newChapterTitleAr || newChapterTitle;

    if (!engTitle && arTitle) {
      if (autoTranslateEnabled) {
        const trans = await translateBatch({ titleAr: arTitle }, 'en');
        engTitle = (trans.titleEn as string) || arTitle;
      } else {
        engTitle = arTitle;
      }
    }

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseForCurriculum.id}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_CHAPTER',
          chapter: {
            title: engTitle,
            titleAr: arTitle,
            lessons: [],
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedCourseForCurriculum(data.course);
        setCourses((prev) => prev.map((c) => (c.id === data.course.id ? data.course : c)));
        setNewChapterTitle('');
        setNewChapterTitleAr('');
        triggerToast(isRtl ? 'تمت إضافة الفصل الجديد وترجمته بنجاح' : 'New chapter added');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!selectedCourseForCurriculum) return;
    if (!confirm(isRtl ? 'حذف هذا الفصل مع جميع دروسه؟' : 'Delete this chapter and all its lessons?')) return;

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseForCurriculum.id}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE_CHAPTER',
          chapterId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedCourseForCurriculum(data.course);
        setCourses((prev) => prev.map((c) => (c.id === data.course.id ? data.course : c)));
        triggerToast(isRtl ? 'تم حذف الفصل' : 'Chapter deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForCurriculum || !targetChapterId || (!newLessonTitle && !newLessonTitleAr)) return;

    let engLessonTitle = newLessonTitle;
    const arLessonTitle = newLessonTitleAr || newLessonTitle;

    if (!engLessonTitle && arLessonTitle) {
      if (autoTranslateEnabled) {
        const trans = await translateBatch({ titleAr: arLessonTitle }, 'en');
        engLessonTitle = (trans.titleEn as string) || arLessonTitle;
      } else {
        engLessonTitle = arLessonTitle;
      }
    }

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseForCurriculum.id}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_LESSON',
          chapterId: targetChapterId,
          lesson: {
            title: engLessonTitle,
            titleAr: arLessonTitle,
            videoUrl: newLessonVideoUrl,
            duration: newLessonDuration,
            durationMinutes: parseInt(newLessonDuration) || 30,
            isFree: newLessonIsFree,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedCourseForCurriculum(data.course);
        setCourses((prev) => prev.map((c) => (c.id === data.course.id ? data.course : c)));
        setNewLessonTitle('');
        setNewLessonTitleAr('');
        triggerToast(isRtl ? 'تمت إضافة الدرس ورابط الفيديو بنجاح' : 'New lesson video added');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLesson = async (chapterId: string, lessonId: string) => {
    if (!selectedCourseForCurriculum) return;
    if (!confirm(isRtl ? 'حذف هذا الدرس؟' : 'Delete this lesson?')) return;

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseForCurriculum.id}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE_LESSON',
          chapterId,
          lessonId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedCourseForCurriculum(data.course);
        setCourses((prev) => prev.map((c) => (c.id === data.course.id ? data.course : c)));
        triggerToast(isRtl ? 'تم حذف الدرس' : 'Lesson deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLessonPreview = async (chapterId: string, lessonId: string) => {
    if (!selectedCourseForCurriculum) return;
    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseForCurriculum.id}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TOGGLE_LESSON_PREVIEW',
          chapterId,
          lessonId,
        }),
      });
      const data = await res.json();
      if (data.success && data.course) {
        setSelectedCourseForCurriculum(data.course);
        setCourses((prev) => prev.map((c) => (c.id === data.course.id ? data.course : c)));
        triggerToast(isRtl ? 'تم تحديث حالة المعاينة المجانية للدرس' : 'Lesson preview status updated');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Slot Operations ---
  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotFormData),
      });
      const data = await res.json();
      if (data.success) {
        setSlots([data.slot, ...slots]);
        setShowSlotModal(false);
        triggerToast(isRtl ? 'تمت إضافة موعد الدرس بنجاح' : 'Lesson slot added');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSlot = async (slotId: string) => {
    try {
      const res = await fetch(`/api/admin/slots/${slotId}`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setSlots(slots.map((s) => (s.id === slotId ? data.slot : s)));
        triggerToast(isRtl ? 'تم تحديث حالة الموعد' : 'Slot status toggled');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm(isRtl ? 'حذف هذا الموعد؟' : 'Delete this slot?')) return;
    try {
      const res = await fetch(`/api/admin/slots/${slotId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSlots(slots.filter((s) => s.id !== slotId));
        triggerToast(isRtl ? 'تم حذف الموعد' : 'Slot deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSlotPricing = async () => {
    try {
      setSavingPricing(true);
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotPricing: slotPricingForm }),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        triggerToast(isRtl ? 'تم حفظ وتحديث نظام أسعار الحصص بنجاح' : 'Slot pricing updated successfully');
      } else {
        triggerToast(isRtl ? 'فشل حفظ إعدادات الأسعار' : 'Failed to save pricing');
      }
    } catch (err) {
      console.error(err);
      triggerToast(isRtl ? 'حدث خطأ في الحفظ' : 'Error saving pricing');
    } finally {
      setSavingPricing(false);
    }
  };

  const handleApplySlotPricingToAll = async () => {
    if (!confirm(isRtl ? 'هل تريد تطبيق هذه الأسعار على كافة المواعيد الحالية في النظام؟' : 'Apply these prices to all current slots?')) return;
    try {
      setApplyingPricing(true);
      // First ensure latest settings are saved
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotPricing: slotPricingForm }),
      });

      const res = await fetch('/api/admin/slots/apply-pricing', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.slots) {
        setSlots(data.slots);
        triggerToast(isRtl ? `تم تحديث أسعار ${data.updatedCount || data.slots.length} موعد وفق النظام الجديد بنجاح!` : `Updated prices for ${data.updatedCount} slots`);
      }
    } catch (err) {
      console.error(err);
      triggerToast(isRtl ? 'حدث خطأ أثناء تطبيق الأسعار' : 'Error applying prices');
    } finally {
      setApplyingPricing(false);
    }
  };

  // --- Resource Operations ---
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceFormData.title) return;
    try {
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceFormData),
      });
      const data = await res.json();
      if (data.success) {
        setResources([data.resource, ...resources]);
        setShowResourceModal(false);
        triggerToast(isRtl ? 'تمت إضافة المصدر التعليمي بنجاح' : 'Resource added successfully');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResource = async (resId: string) => {
    if (!confirm(isRtl ? 'حذف هذا المصدر من المكتبة؟' : 'Delete this resource?')) return;
    try {
      const res = await fetch(`/api/admin/resources/${resId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setResources(resources.filter((r) => r.id !== resId));
        triggerToast(isRtl ? 'تم حذف الملف' : 'Resource deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Settings & Frontend CMS Operations ---
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      let finalSettings = { ...settings };

      if (autoTranslateEnabled) {
        // 1. Check Hero fields needing auto-translation
        const heroFields: Record<string, string> = {};
        if (finalSettings.heroBadgeAr) heroFields.heroBadgeAr = finalSettings.heroBadgeAr;
        if (finalSettings.heroTitleAr) heroFields.heroTitleAr = finalSettings.heroTitleAr;
        if (finalSettings.heroTitleHighlightAr) heroFields.heroTitleHighlightAr = finalSettings.heroTitleHighlightAr;
        if (finalSettings.heroSubtitleAr) heroFields.heroSubtitleAr = finalSettings.heroSubtitleAr;
        if (finalSettings.heroCtaPrimaryTextAr) heroFields.heroCtaPrimaryTextAr = finalSettings.heroCtaPrimaryTextAr;
        if (finalSettings.heroCtaSecondaryTextAr) heroFields.heroCtaSecondaryTextAr = finalSettings.heroCtaSecondaryTextAr;
        if (finalSettings.announcementTextAr) heroFields.announcementTextAr = finalSettings.announcementTextAr;
        if (finalSettings.footerAboutAr) heroFields.footerAboutAr = finalSettings.footerAboutAr;

        if (Object.keys(heroFields).length > 0) {
          const trans = await translateBatch(heroFields, 'en');
          finalSettings = {
            ...finalSettings,
            heroBadgeEn: (trans.heroBadgeEn as string) || finalSettings.heroBadgeEn,
            heroTitleEn: (trans.heroTitleEn as string) || finalSettings.heroTitleEn,
            heroTitleHighlightEn: (trans.heroTitleHighlightEn as string) || finalSettings.heroTitleHighlightEn,
            heroSubtitleEn: (trans.heroSubtitleEn as string) || finalSettings.heroSubtitleEn,
            heroCtaPrimaryTextEn: (trans.heroCtaPrimaryTextEn as string) || finalSettings.heroCtaPrimaryTextEn,
            heroCtaSecondaryTextEn: (trans.heroCtaSecondaryTextEn as string) || finalSettings.heroCtaSecondaryTextEn,
            announcementTextEn: (trans.announcementTextEn as string) || finalSettings.announcementTextEn,
            footerAboutEn: (trans.footerAboutEn as string) || finalSettings.footerAboutEn,
          };
        }

        // 2. Check Services needing auto-translation
        if (Array.isArray(finalSettings.services)) {
          finalSettings.services = await Promise.all(
            finalSettings.services.map(async (svc) => {
              const svcFields: Record<string, string | string[]> = {};
              if (svc.titleAr) svcFields.titleAr = svc.titleAr;
              if (svc.badgeAr) svcFields.badgeAr = svc.badgeAr;
              if (svc.subtitleAr) svcFields.subtitleAr = svc.subtitleAr;
              if (svc.levelAr) svcFields.levelAr = svc.levelAr;
              if (svc.formatAr) svcFields.formatAr = svc.formatAr;
              if (svc.durationAr) svcFields.durationAr = svc.durationAr;
              if (svc.sanadAr) svcFields.sanadAr = svc.sanadAr;
              if (Array.isArray(svc.featuresAr) && svc.featuresAr.length > 0) {
                svcFields.featuresAr = svc.featuresAr;
              }

              if (Object.keys(svcFields).length > 0) {
                const trans = await translateBatch(svcFields, 'en');
                return {
                  ...svc,
                  titleEn: (trans.titleEn as string) || svc.titleEn,
                  badgeEn: (trans.badgeEn as string) || svc.badgeEn,
                  subtitleEn: (trans.subtitleEn as string) || svc.subtitleEn,
                  levelEn: (trans.levelEn as string) || svc.levelEn,
                  formatEn: (trans.formatEn as string) || svc.formatEn,
                  durationEn: (trans.durationEn as string) || svc.durationEn,
                  sanadEn: (trans.sanadEn as string) || svc.sanadEn,
                  featuresEn: Array.isArray(trans.featuresEn) ? (trans.featuresEn as string[]) : svc.featuresEn,
                };
              }
              return svc;
            })
          );
        }
      }

      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalSettings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        triggerToast(
          isRtl
            ? 'تم حفظ التعديلات والترجمة ونشرها فوراً على الواجهة'
            : 'Frontend changes saved and published live!'
        );
      }
    } catch (err) {
      console.error(err);
      alert('Error updating settings');
    }
  };

  // --- PayPal Connection & API Settings Handlers ---
  const handleSavePayPalSettings = async (testConnectionAfterSave = false) => {
    try {
      if (testConnectionAfterSave) {
        setTestingPayPal(true);
      } else {
        setSavingPayPal(true);
      }
      setPaypalTestResult(null);

      const res = await fetch('/api/admin/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: testConnectionAfterSave ? 'save_and_test' : 'save',
          paypalClientId: settings.paypalClientId || '',
          paypalClientSecret: settings.paypalClientSecret || '',
          paypalMode: settings.paypalMode || 'live',
        }),
      });
      const data = await res.json();

      if (data.settings) {
        setSettings(data.settings);
      }

      if (testConnectionAfterSave) {
        if (data.valid) {
          setPaypalTestResult({
            valid: true,
            message: isRtl
              ? `✅ تم حفظ البيانات والاتصال بخوادم PayPal (${(data.mode || 'LIVE').toUpperCase()}) بنجاح! الحساب متصل وجاهز لاستقبال المدفوعات.`
              : `✅ Credentials saved and verified with PayPal (${(data.mode || 'LIVE').toUpperCase()}) successfully!`,
          });
          triggerToast(isRtl ? 'تم التحقق من اتصال PayPal وحفظ المفاتيح بنجاح' : 'PayPal credentials verified & saved!');
        } else {
          setPaypalTestResult({
            valid: false,
            message:
              data.error ||
              (isRtl
                ? '❌ تعذر المصادقة مع PayPal. يرجى التأكد من صحة Client ID و Secret Key ومطابقة وضع التشغيل (Live / Sandbox).'
                : '❌ Failed to authenticate with PayPal. Please check your Client ID, Secret Key, and Mode.'),
          });
        }
      } else if (data.success) {
        setPaypalTestResult({
          valid: true,
          message: isRtl
            ? 'تم حفظ بيانات الاتصال بـ PayPal بنجاح وتفعيلها على المنصة.'
            : 'PayPal credentials saved and activated on the platform.',
        });
        triggerToast(isRtl ? 'تم حفظ إعدادات PayPal بنجاح' : 'PayPal settings saved!');
      }
    } catch (err) {
      console.error(err);
      setPaypalTestResult({
        valid: false,
        message: isRtl ? 'حدث خطأ أثناء حفظ أو اختبار إعدادات PayPal' : 'Error saving or testing PayPal settings',
      });
    } finally {
      setSavingPayPal(false);
      setTestingPayPal(false);
    }
  };

  const renderPayPalSettingsCard = () => (
    <div className="academy-card p-6 bg-white border-2 border-[#003087]/20 rounded-2xl space-y-5 shadow-card-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FFC439]/20 border border-[#FFC439] flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-[#003087]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-navy-950 text-sm sm:text-base">
                {isRtl ? 'إعدادات الربط ببوابة الدفع العالمية (PayPal API Settings)' : 'PayPal Gateway API Configuration'}
              </h4>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                  (settings.paypalMode || 'live') === 'live'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {(settings.paypalMode || 'live') === 'live'
                  ? isRtl
                    ? 'LIVE • وضع مباشر حقيقي'
                    : 'LIVE MODE'
                  : isRtl
                  ? 'SANDBOX • وضع تجريبي'
                  : 'SANDBOX MODE'}
              </span>
            </div>
            <p className="text-xs text-navy-500 mt-0.5">
              {isRtl
                ? 'تحكم في بيانات الربط المباشر بحساب PayPal (Client ID & Secret Key) لتشغيل الدفع التلقائي للدورات والحصص الخاصة'
                : 'Configure your PayPal REST API Client ID and Secret Key for live course and private lesson checkouts'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={testingPayPal || savingPayPal}
            onClick={() => handleSavePayPalSettings(true)}
            className="px-4 py-2 rounded-xl bg-[#003087] hover:bg-[#001F5C] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#FFC439] ${testingPayPal ? 'animate-spin' : ''}`} />
            <span>
              {testingPayPal
                ? isRtl
                  ? 'جاري فحص الاتصال...'
                : 'Testing Connection...'
                : isRtl
                ? 'حفظ وفحص الاتصال بـ PayPal'
                : 'Save & Test Connection'}
            </span>
          </button>

          <button
            type="button"
            disabled={savingPayPal || testingPayPal}
            onClick={() => handleSavePayPalSettings(false)}
            className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5 text-gold-300" />
            <span>
              {savingPayPal
                ? isRtl
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : isRtl
                ? 'حفظ المفاتيح'
                : 'Save Keys'}
            </span>
          </button>
        </div>
      </div>

      {paypalTestResult && (
        <div
          className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2.5 ${
            paypalTestResult.valid
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <CheckCircle2
            className={`w-4 h-4 shrink-0 ${
              paypalTestResult.valid ? 'text-emerald-600' : 'text-rose-600'
            }`}
          />
          <span>{paypalTestResult.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="md:col-span-1">
          <label className="font-bold text-navy-800 block mb-1.5">
            {isRtl ? 'بيئة التشغيل (PayPal Environment)' : 'PayPal Environment Mode'}
          </label>
          <select
            value={settings.paypalMode || 'live'}
            onChange={(e) =>
              setSettings({
                ...settings,
                paypalMode: e.target.value as 'live' | 'sandbox',
              })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="live">
              {isRtl ? '🟢 Live (مباشر - استقبال أموال حقيقية)' : '🟢 Live (Production - Real Payments)'}
            </option>
            <option value="sandbox">
              {isRtl ? '🟡 Sandbox (تجريبي - للاختبار فقط)' : '🟡 Sandbox (Testing Mode)'}
            </option>
          </select>
          <span className="text-[11px] text-navy-400 mt-1 block">
            {isRtl
              ? 'اختر Live عند استخدام مفاتيح الحساب التجاري الحقيقي.'
              : 'Select Live when using real production credentials.'}
          </span>
        </div>

        <div className="md:col-span-2">
          <label className="font-bold text-navy-800 block mb-1.5">
            {isRtl ? 'معرّف العميل (PayPal Client ID)' : 'PayPal Client ID'}
          </label>
          <input
            type="text"
            dir="ltr"
            value={settings.paypalClientId || ''}
            onChange={(e) => setSettings({ ...settings, paypalClientId: e.target.value })}
            placeholder="BAAl7Fn0BnuGQIUuqjDwEvLdEIlEuXpqrH0mpB..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border font-mono text-xs text-navy-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-bold text-navy-800 block">
              {isRtl ? 'المفتاح السري لـ PayPal (PayPal Secret Key)' : 'PayPal Secret Key'}
            </label>
            <button
              type="button"
              onClick={() => setShowPayPalSecret(!showPayPalSecret)}
              className="text-[11px] font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1"
            >
              {showPayPalSecret ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'إخفاء المفتاح السري' : 'Hide Secret Key'}</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'إظهار المفتاح السري' : 'Show Secret Key'}</span>
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPayPalSecret ? 'text' : 'password'}
              dir="ltr"
              value={settings.paypalClientSecret || ''}
              onChange={(e) => setSettings({ ...settings, paypalClientSecret: e.target.value })}
              placeholder="EKTl-t1zJSFcTwgGwVEqLfBRRGQKe6dHnv5ETpfYpzQ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border font-mono text-xs text-navy-900 bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <span className="text-[11px] text-navy-500 mt-1.5 block">
            {isRtl
              ? 'يُستخدم هذا المفتاح السري للمصادقة الآمنة مع خوادم PayPal وإنشاء وتأكيد طلبات الدفع تلقائياً.'
              : 'Used for server-side OAuth2 authentication with PayPal to create and capture orders.'}
          </span>
        </div>
      </div>
    </div>
  );

  const handleUpdateServiceField = (serviceId: string, field: keyof ServiceCardItem, value: any) => {
    setSettings((prev) => ({
      ...prev,
      services: (prev.services || []).map((s) => (s.id === serviceId ? { ...s, [field]: value } : s)),
    }));
  };

  const handleToggleServiceActive = (serviceId: string) => {
    setSettings((prev) => ({
      ...prev,
      services: (prev.services || []).map((s) => (s.id === serviceId ? { ...s, isActive: !s.isActive } : s)),
    }));
  };

  const toggleTrackExpanded = (trackId: string) => {
    setExpandedTracks((prev) => ({
      ...prev,
      [trackId]: prev[trackId] === undefined ? true : !prev[trackId],
    }));
  };

  const handleOpenAddTrack = () => {
    setTrackFormData({
      id: '',
      titleAr: '',
      titleEn: '',
      badgeAr: 'المسار الأكاديمي المعتمد',
      badgeEn: 'Certified Academic Track',
      subtitleAr: '',
      subtitleEn: '',
      categoryKey: 'general',
      href: '',
      levelAr: 'كافة المستويات',
      levelEn: 'All Levels',
      formatAr: 'جلسات تفاعلية أونلاين',
      formatEn: 'Live Interactive Online Sessions',
      durationAr: '3 أشهر',
      durationEn: '3 Months',
      sanadAr: 'شهادة إتمام معتمدة من الأكاديمية',
      sanadEn: 'Certified Completion Certificate',
    });
    setShowAddTrackModal(true);
  };

  const handleSaveTrackModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackFormData.titleAr) {
      alert(isRtl ? 'يرجى كتابة عنوان المسار بالعربية' : 'Please provide track title in Arabic');
      return;
    }
    setSavingTrack(true);
    try {
      const res = await fetch('/api/admin/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-track',
          trackData: trackFormData,
        }),
      });
      const data = await res.json();
      if (data.success && data.tracks) {
        setSettings((prev) => ({ ...prev, services: data.tracks }));
        setShowAddTrackModal(false);
        triggerToast(isRtl ? 'تم حفظ المسار التعليمي بنجاح' : 'Academic track saved successfully');
      } else {
        alert(data.error || 'Failed to save track');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving track');
    } finally {
      setSavingTrack(false);
    }
  };

  const handleDeleteTrackAction = async (trackId: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذا المسار التعليمي نهائياً؟' : 'Are you sure you want to delete this track permanently?')) {
      return;
    }
    try {
      const res = await fetch('/api/admin/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-track',
          trackId,
        }),
      });
      const data = await res.json();
      if (data.success && data.tracks) {
        setSettings((prev) => ({ ...prev, services: data.tracks }));
        triggerToast(isRtl ? 'تم حذف المسار التعليمي بنجاح' : 'Track deleted successfully');
      } else {
        alert(data.error || 'Failed to delete track');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting track');
    }
  };

  const handleOpenAddItemToTrack = (trackId: string) => {
    setTargetTrackIdForItem(trackId);
    setEditingItemId(null);
    const targetTrack = (settings.services || []).find((s) => s.id === trackId);
    const itemsCount = targetTrack?.items?.length || 0;
    setItemFormData({
      titleAr: '',
      title: '',
      levelAr: `المرحلة ${itemsCount + 1}`,
      level: `Stage ${itemsCount + 1}`,
      descAr: '',
      desc: '',
      durationAr: '4 أسابيع',
      duration: '4 Weeks',
      lessonsCount: 12,
      pointsTextAr: '',
      pointsTextEn: '',
      actionType: 'PRIVATE_LESSON',
      linkedCourseSlug: '',
      price: 0,
      isFree: false,
      videoUrl: '',
      fileUrl: '',
      detailedContentAr: '',
      detailedContentEn: '',
      ctaTextAr: '',
      ctaTextEn: '',
      customUrl: '',
    });
    setShowAddItemModal(true);
    setTimeout(() => {
      document.getElementById('add-track-item-modal-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleOpenEditItemInTrack = (trackId: string, item: TrackItem) => {
    setTargetTrackIdForItem(trackId);
    setEditingItemId(item.id);
    setItemFormData({
      titleAr: item.titleAr || '',
      title: item.title || '',
      levelAr: item.levelAr || '',
      level: item.level || '',
      descAr: item.descAr || '',
      desc: item.desc || '',
      durationAr: item.durationAr || '',
      duration: item.duration || '',
      lessonsCount: item.lessonsCount || 12,
      pointsTextAr: Array.isArray(item.pointsAr) ? item.pointsAr.join('\n') : '',
      pointsTextEn: Array.isArray(item.points) ? item.points.join('\n') : '',
      actionType: item.actionType || 'PRIVATE_LESSON',
      linkedCourseSlug: item.linkedCourseSlug || '',
      price: typeof item.price === 'number' ? item.price : 0,
      isFree: Boolean(item.isFree),
      videoUrl: item.videoUrl || '',
      fileUrl: item.fileUrl || '',
      detailedContentAr: item.detailedContentAr || '',
      detailedContentEn: item.detailedContentEn || '',
      ctaTextAr: item.ctaTextAr || '',
      ctaTextEn: item.ctaTextEn || '',
      customUrl: item.customUrl || '',
    });
    setShowAddItemModal(true);
    setTimeout(() => {
      document.getElementById('add-track-item-modal-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSaveTrackItemModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTrackIdForItem || !itemFormData.titleAr) {
      alert(isRtl ? 'يرجى كتابة عنوان المرحلة بالعربية' : 'Please provide item title in Arabic');
      return;
    }
    setSavingItem(true);
    try {
      const pointsAr = itemFormData.pointsTextAr.split('\n').map((s) => s.trim()).filter((s) => s.length > 0);
      const pointsEn = itemFormData.pointsTextEn.split('\n').map((s) => s.trim()).filter((s) => s.length > 0);

      const itemPayload: Partial<TrackItem> = {
        id: editingItemId || undefined,
        titleAr: itemFormData.titleAr,
        title: itemFormData.title,
        levelAr: itemFormData.levelAr,
        level: itemFormData.level,
        descAr: itemFormData.descAr,
        desc: itemFormData.desc,
        durationAr: itemFormData.durationAr,
        duration: itemFormData.duration,
        lessonsCount: Number(itemFormData.lessonsCount) || 12,
        pointsAr,
        points: pointsEn.length > 0 ? pointsEn : undefined,
        actionType: itemFormData.actionType || 'PRIVATE_LESSON',
        linkedCourseSlug: itemFormData.linkedCourseSlug || '',
        price: Number(itemFormData.price) || 0,
        isFree: Boolean(itemFormData.isFree),
        videoUrl: itemFormData.videoUrl || '',
        fileUrl: itemFormData.fileUrl || '',
        detailedContentAr: itemFormData.detailedContentAr || '',
        detailedContentEn: itemFormData.detailedContentEn || '',
        ctaTextAr: itemFormData.ctaTextAr || '',
        ctaTextEn: itemFormData.ctaTextEn || '',
        customUrl: itemFormData.customUrl || '',
      };

      const res = await fetch('/api/admin/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-item',
          trackId: targetTrackIdForItem,
          itemData: itemPayload,
        }),
      });
      const data = await res.json();
      if (data.success && data.tracks) {
        setSettings((prev) => ({ ...prev, services: data.tracks }));
        setShowAddItemModal(false);
        triggerToast(isRtl ? 'تم حفظ المرحلة / الوحدة بنجاح' : 'Module / Stage saved successfully');
      } else {
        alert(data.error || 'Failed to save item');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving item');
    } finally {
      setSavingItem(false);
    }
  };

  const handleDeleteTrackItemAction = async (trackId: string, itemId: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذه المرحلة من داخل المسار؟' : 'Are you sure you want to delete this stage?')) {
      return;
    }
    try {
      const res = await fetch('/api/admin/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-item',
          trackId,
          itemId,
        }),
      });
      const data = await res.json();
      if (data.success && data.tracks) {
        setSettings((prev) => ({ ...prev, services: data.tracks }));
        triggerToast(isRtl ? 'تم حذف المرحلة بنجاح' : 'Stage deleted successfully');
      } else {
        alert(data.error || 'Failed to delete item');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting item');
    }
  };

  const handleToggleBlockedDate = async (dateStr: string) => {
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-blocked-date',
          date: dateStr,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.blockedDates)) {
        setBlockedDates(data.blockedDates);
        setSettings((prev) => ({ ...prev, blockedDates: data.blockedDates }));
        const isNowBlocked = data.blockedDates.includes(dateStr);
        triggerToast(
          isNowBlocked
            ? isRtl
              ? `🔒 تم تحديد يوم (${dateStr}) كـ محجوز بالكامل — لن يظهر متاحاً للطلاب`
              : `🔒 Marked (${dateStr}) as Fully Booked`
            : isRtl
            ? `✅ تم فتح يوم (${dateStr}) وأصبح متاحاً للحجز أمام الطلاب`
            : `✅ Opened (${dateStr}) for student bookings`
        );
      }
    } catch (err) {
      console.error('Error toggling blocked date:', err);
    }
  };

  // --- Real Transactions & Students Handlers ---
  const handleSaveManualTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txFormData.payerEmail || !txFormData.itemTitle) return;
    try {
      const res = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txFormData),
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions || []);
        if (txFormData.alsoRecordStudent) {
          const stRes = await fetch('/api/admin/students').then((r) => r.json());
          if (stRes.students) setStudents(stRes.students);
        }
        setShowAddTxModal(false);
        setTxFormData({
          payerName: '',
          payerEmail: '',
          payerPhone: '',
          itemTitle: '',
          itemType: 'COURSE',
          amount: 45,
          status: 'COMPLETED',
          alsoRecordStudent: true,
        });
        triggerToast(isRtl ? 'تم تسجيل العملية المالية بنجاح' : 'Transaction recorded successfully');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذه العملية المالية من السجل؟' : 'Delete this transaction?')) return;
    try {
      const res = await fetch(`/api/admin/transactions?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions || []);
        triggerToast(isRtl ? 'تم حذف العملية المالية' : 'Transaction deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddStudent = () => {
    setEditingStudentId(null);
    setStudentFormData({
      name: '',
      email: '',
      phone: '',
      enrolledCoursesCount: 1,
      completedLessonsCount: 0,
      progressPercentage: 0,
    });
    setShowAddStudentModal(true);
  };

  const handleOpenEditStudent = (stu: StudentData) => {
    setEditingStudentId(stu.id);
    setStudentFormData({
      name: stu.name,
      email: stu.email,
      phone: stu.phone || '',
      enrolledCoursesCount: stu.enrolledCoursesCount || 0,
      completedLessonsCount: stu.completedLessonsCount || 0,
      progressPercentage: stu.progressPercentage || 0,
    });
    setShowAddStudentModal(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormData.name || !studentFormData.email) return;
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingStudentId || undefined,
          ...studentFormData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
        setShowAddStudentModal(false);
        setEditingStudentId(null);
        triggerToast(isRtl ? 'تم حفظ بيانات الطالب بنجاح' : 'Student saved successfully');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذا الطالب من السجل؟' : 'Delete this student record?')) return;
    try {
      const res = await fetch(`/api/admin/students?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
        triggerToast(isRtl ? 'تم حذف سجل الطالب' : 'Student record deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEditTestimonial = (t: TestimonialItem) => {
    setEditingTestimonialId(t.id);
    setTestimonialFormData(t);
    setShowTestimonialModal(true);
    setTimeout(() => {
      document.getElementById('testimonial-inline-editor')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialFormData.name || !testimonialFormData.quoteAr) return;

    let quoteEn = testimonialFormData.quote;
    let focusEn = testimonialFormData.focus;

    if (autoTranslateEnabled && (!quoteEn || quoteEn.trim() === '')) {
      const trans = await translateBatch(
        {
          quoteAr: testimonialFormData.quoteAr,
          focusAr: testimonialFormData.focusAr || '',
        },
        'en'
      );
      if (trans.quoteEn) quoteEn = trans.quoteEn as string;
      if (trans.focusEn) focusEn = trans.focusEn as string;
    }

    let updatedTestimonials: TestimonialItem[];
    if (editingTestimonialId) {
      updatedTestimonials = (settings.testimonials || []).map((t) =>
        t.id === editingTestimonialId
          ? {
              ...t,
              name: testimonialFormData.name!,
              location: testimonialFormData.location || 'Cairo, Egypt',
              flag: testimonialFormData.flag || '🌍',
              focus: focusEn || t.focus || 'Quran Memorization & Tajweed',
              focusAr: testimonialFormData.focusAr || t.focusAr || 'حفظ القرآن والتجويد',
              quote: quoteEn || testimonialFormData.quoteAr!,
              quoteAr: testimonialFormData.quoteAr!,
              rating: testimonialFormData.rating || 5,
            }
          : t
      );
    } else {
      const newTest: TestimonialItem = {
        id: `test-${Date.now()}`,
        name: testimonialFormData.name,
        location: testimonialFormData.location || 'Cairo, Egypt',
        flag: testimonialFormData.flag || '🌍',
        focus: focusEn || 'Quran Memorization & Tajweed',
        focusAr: testimonialFormData.focusAr || 'حفظ القرآن والتجويد',
        quote: quoteEn || testimonialFormData.quoteAr,
        quoteAr: testimonialFormData.quoteAr,
        rating: testimonialFormData.rating || 5,
      };
      updatedTestimonials = [newTest, ...(settings.testimonials || [])];
    }

    const newSettings = { ...settings, testimonials: updatedTestimonials };
    setSettings(newSettings);
    setShowTestimonialModal(false);
    setEditingTestimonialId(null);

    try {
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      triggerToast(
        editingTestimonialId
          ? (isRtl ? 'تم تحديث رأي الطالب بنجاح' : 'Testimonial updated successfully')
          : (isRtl ? 'تمت إضافة رأي الطالب وسيظهر في الواجهة' : 'Testimonial added to homepage!')
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm(isRtl ? 'حذف هذه الشهادة من الموقع؟' : 'Delete this testimonial?')) return;
    const filtered = (settings.testimonials || []).filter((t) => t.id !== id);
    const newSettings = { ...settings, testimonials: filtered };
    setSettings(newSettings);
    try {
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      triggerToast(isRtl ? 'تم حذف الرأي' : 'Testimonial deleted');
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.titleAr && c.titleAr.includes(searchQuery)) ||
      c.slug.includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-navy-900 flex flex-col selection:bg-brand-100 selection:text-brand-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 end-5 z-50 bg-brand-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-brand-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* DEDICATED STANDALONE ADMIN HEADER (No Public Navbar) */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-border shadow-sm">
        <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo & Platform Command Center Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-icon.png"
                alt="Abeer Gad Academy Emblem"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-navy-950 tracking-tight leading-tight">
                  {isRtl ? 'أكاديمية عبير جاد' : 'Abeer Gad Academy'}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  <ShieldCheck className="w-3 h-3 me-1 text-brand-600" />
                  {isRtl ? 'لوحة القيادة المركزية (CMS)' : 'Admin Command Shell'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-navy-500">
                <span className="inline-flex items-center text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 me-1 animate-pulse" />
                  {isRtl ? 'متصل بقاعدة البيانات الحية' : 'Live Store Connected'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions: Live View, Language, Refresh, Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`/${currentLocale}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-elevated text-navy-700 text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-700" />
              <span>{isRtl ? 'معاينة الموقع العام' : 'View Public Site'}</span>
            </a>

            <button
              type="button"
              onClick={fetchData}
              disabled={refreshing}
              className="p-2 rounded-xl border border-surface-border bg-white text-navy-700 hover:bg-surface-muted transition-colors text-xs"
              title={isRtl ? 'تحديث البيانات' : 'Refresh Data'}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Language Switch */}
            <div className="flex items-center rounded-xl border border-surface-border p-0.5 bg-surface-muted text-xs font-bold">
              <button
                type="button"
                onClick={() => router.push(`/ar/admin`)}
                className={`px-2 py-1 rounded-lg transition-colors ${currentLocale === 'ar' ? 'bg-white shadow-sm text-brand-800' : 'text-navy-600'}`}
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => router.push(`/en/admin`)}
                className={`px-2 py-1 rounded-lg transition-colors ${currentLocale === 'en' ? 'bg-white shadow-sm text-brand-800' : 'text-navy-600'}`}
              >
                EN
              </button>
            </div>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isRtl ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* STANDALONE ADMIN BODY: SIDEBAR + CONTENT GRID */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-e border-surface-border p-4 sm:p-5 shrink-0 flex flex-row md:flex-col justify-start gap-1 overflow-x-auto md:overflow-y-auto">
          <div className="hidden md:block mb-3 px-2">
            <span className="text-[10px] font-black uppercase text-navy-400 tracking-wider">
              {isRtl ? 'أقسام الإدارة والتحكم' : 'Operations Modules'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setActiveNav('OVERVIEW')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-start transition-all whitespace-nowrap ${
              activeNav === 'OVERVIEW'
                ? 'bg-brand-700 text-white shadow-card-subtle'
                : 'text-navy-700 hover:bg-surface-muted'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'نظرة عامة والتحليلات' : 'Overview & Analytics'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('FRONTEND_CMS')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-start transition-all whitespace-nowrap ${
              activeNav === 'FRONTEND_CMS'
                ? 'bg-brand-700 text-white shadow-card-subtle'
                : 'text-navy-700 hover:bg-surface-muted'
            }`}
          >
            <LayoutTemplate className="w-4 h-4 shrink-0 text-amber-500" />
            <span className="flex-1">{isRtl ? 'التحكم في واجهة الموقع' : 'Homepage & CMS'}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-extrabold">
              PRO
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('COURSES')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-start transition-all whitespace-nowrap ${
              activeNav === 'COURSES'
                ? 'bg-brand-700 text-white shadow-card-subtle'
                : 'text-navy-700 hover:bg-surface-muted'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="flex-1">{isRtl ? 'إدارة الدورات والمناهج' : 'Courses & Curriculum'}</span>
            <span className="text-[10px] opacity-80">{courses.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('SLOTS')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-start transition-all whitespace-nowrap ${
              activeNav === 'SLOTS'
                ? 'bg-brand-700 text-white shadow-card-subtle'
                : 'text-navy-700 hover:bg-surface-muted'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="flex-1">{isRtl ? 'المواعيد والدروس الخاصة' : '1-on-1 Slots'}</span>
            <span className="text-[10px] opacity-80">{slots.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('RESOURCES')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-start transition-all whitespace-nowrap ${
              activeNav === 'RESOURCES'
                ? 'bg-brand-700 text-white shadow-card-subtle'
                : 'text-navy-700 hover:bg-surface-muted'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="flex-1">{isRtl ? 'المكتبة الرقمية' : 'Digital Library'}</span>
            <span className="text-[10px] opacity-80">{resources.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('FINANCIALS_STUDENTS')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-start transition-all whitespace-nowrap ${
              activeNav === 'FINANCIALS_STUDENTS'
                ? 'bg-brand-700 text-white shadow-card-subtle'
                : 'text-navy-700 hover:bg-surface-muted'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span className="flex-1">{isRtl ? 'السجل المالي والطلاب' : 'Ledger & Students'}</span>
            <span className="text-[10px] opacity-80">{transactions.length + students.length}</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl">
          {/* ============================================================== */}
          {/* TAB: OVERVIEW & ANALYTICS */}
          {/* ============================================================== */}
          {activeNav === 'OVERVIEW' && (
            <div className="space-y-8">
              {/* Top Banner Alert */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-900 to-brand-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card-subtle">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base sm:text-lg">
                      {isRtl ? 'مرحباً بالأستاذة عبير جاد في لوحة القيادة' : 'Welcome to Abeer Gad Academy Control'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gold-400 text-navy-950">
                      MASTER CMS
                    </span>
                  </div>
                  <p className="text-xs text-brand-100 max-w-2xl leading-relaxed">
                    {isRtl
                      ? 'يمكنك من هنا رفع دورات جديدة، وتعديل فيديوهات المناهج، والتحكم الفوري في كل نص ورقم يظهر في واجهة الموقع للزوار.'
                      : 'Directly upload courses, edit lesson video streams, and control every headline and metric on the homepage.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('COURSES');
                    handleOpenNewCourseModal();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-navy-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0"
                >
                  <UploadCloud className="w-4 h-4 text-navy-950" />
                  <span>{isRtl ? 'رفع دورة جديدة فوراً' : 'Upload Course Now'}</span>
                </button>
              </div>

              {/* 4 Real-Data Metric Cards */}
              {(() => {
                const completedTransactions = transactions.filter((t) => t.status === 'COMPLETED' || !t.status);
                const realTotalRevenue = completedTransactions.reduce(
                  (acc, t) => acc + (Number(t.amount) || 0),
                  0
                );
                const realStudentsCount = students.length;
                const realBookedSlotsCount = slots.filter((s) => s.status === 'BOOKED').length;
                const realAvailableSlotsCount = slots.filter((s) => s.status === 'AVAILABLE').length;
                const publishedCoursesCount = courses.filter((c) => c.isPublished).length;
                const activeTracksCount = (settings.services || []).filter((s) => s.isActive !== false).length;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div
                      onClick={() => {
                        setActiveNav('FINANCIALS_STUDENTS');
                        setFinanceSubTab('TRANSACTIONS');
                      }}
                      className="academy-card p-5 bg-white border border-surface-border hover:border-brand-300 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider block">
                          {isRtl ? 'إجمالي الإيرادات الفعلية (USD)' : 'Real Total Revenue'}
                        </span>
                        <div className="text-2xl font-black text-brand-800 mt-1">
                          {formatCurrency(realTotalRevenue)}
                        </div>
                        <span className="badge-light text-[11px] mt-2 inline-block">
                          {completedTransactions.length}{' '}
                          {isRtl ? 'عملية دفع مؤكدة' : 'Verified Payments'}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        setActiveNav('FINANCIALS_STUDENTS');
                        setFinanceSubTab('STUDENTS');
                      }}
                      className="academy-card p-5 bg-white border border-surface-border hover:border-brand-300 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider block">
                          {isRtl ? 'الطلاب المسجلون فعلياً' : 'Registered Students'}
                        </span>
                        <div className="text-2xl font-black text-navy-900 mt-1">
                          {realStudentsCount}
                        </div>
                        <span className="text-xs text-navy-500 mt-2 block">
                          {realStudentsCount === 0
                            ? isRtl
                              ? 'لا يوجد طلاب مسجلون بعد'
                              : 'No students registered yet'
                            : isRtl
                            ? `${realStudentsCount} طالب مسجل في قاعدة البيانات`
                            : `${realStudentsCount} active student records`}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center border border-gold-200">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveNav('SLOTS')}
                      className="academy-card p-5 bg-white border border-surface-border hover:border-brand-300 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider block">
                          {isRtl ? 'الحجوزات الخاصة الفعلية' : 'Booked Private Sessions'}
                        </span>
                        <div className="text-2xl font-black text-navy-900 mt-1">
                          {realBookedSlotsCount}
                        </div>
                        <span className="text-xs text-navy-500 mt-2 block">
                          {realAvailableSlotsCount}{' '}
                          {isRtl ? 'موعد شاغر متاح للحجز' : 'Available Slots'}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-quran-50 text-quran-700 flex items-center justify-center border border-quran-200">
                        <Calendar className="w-6 h-6" />
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveNav('COURSES')}
                      className="academy-card p-5 bg-white border border-surface-border hover:border-brand-300 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider block">
                          {isRtl ? 'الدورات والمسارات النشطة' : 'Live Courses & Tracks'}
                        </span>
                        <div className="text-2xl font-black text-navy-900 mt-1">
                          {publishedCoursesCount} / {courses.length}
                        </div>
                        <span className="text-xs text-emerald-600 font-bold mt-2 block">
                          {activeTracksCount}{' '}
                          {isRtl ? 'مسارات تعليمية مفعّلة' : 'Active Academic Tracks'}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                        <Layers className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Quick Actions Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('FRONTEND_CMS');
                    setCmsSubTab('HERO');
                  }}
                  className="p-4 rounded-2xl bg-white border border-surface-border hover:border-brand-300 text-start transition-all space-y-1 shadow-card-subtle group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-900 group-hover:text-brand-700">
                      {isRtl ? 'بداية الموقع والـ Hero' : 'Hero & Headlines'}
                    </span>
                    <LayoutTemplate className="w-4 h-4 text-brand-600" />
                  </div>
                  <p className="text-[11px] text-navy-500">
                    {isRtl ? 'تعديل عنوان الـ Hero، شارة الثقة، وأرقام الإحصائيات' : 'Update Hero headline, trust pill, and counter numbers'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('FRONTEND_CMS');
                    setCmsSubTab('SERVICES');
                  }}
                  className="p-4 rounded-2xl bg-white border border-surface-border hover:border-brand-300 text-start transition-all space-y-1 shadow-card-subtle group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-900 group-hover:text-brand-700">
                      {isRtl ? 'كروت الخدمات والمسارات' : 'Services Cards'}
                    </span>
                    <BookOpen className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-[11px] text-navy-500">
                    {isRtl ? 'إظهار أو إخفاء الخدمات وتعديل تفاصيل الكروت في الواجهة' : 'Toggle cards visibility & edit details'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('FRONTEND_CMS');
                    setCmsSubTab('TESTIMONIALS');
                  }}
                  className="p-4 rounded-2xl bg-white border border-surface-border hover:border-brand-300 text-start transition-all space-y-1 shadow-card-subtle group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-900 group-hover:text-brand-700">
                      {isRtl ? 'آراء وتقييمات الطلاب' : 'Manage Testimonials'}
                    </span>
                    <Quote className="w-4 h-4 text-gold-600" />
                  </div>
                  <p className="text-[11px] text-navy-500">
                    {isRtl ? 'إضافة أو حذف تقييمات الطلاب في الصفحة الرئيسية' : 'Add or remove student reviews on homepage'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('FRONTEND_CMS');
                    setCmsSubTab('COMMUNICATION');
                  }}
                  className="p-4 rounded-2xl bg-white border border-surface-border hover:border-brand-300 text-start transition-all space-y-1 shadow-card-subtle group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-900 group-hover:text-brand-700">
                      {isRtl ? 'الإعلانات والواتساب والفوتر' : 'Announcements & Contact'}
                    </span>
                    <Megaphone className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-navy-500">
                    {isRtl ? 'التحكم في الشريط العلوي، الواتساب، وبيانات التواصل' : 'Update top bar, WhatsApp, and contact channels'}
                  </p>
                </button>
              </div>

              {/* Real Recent Transactions & Real Students Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions Preview */}
                <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-card-subtle">
                  <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between">
                    <h3 className="font-extrabold text-navy-950 text-sm">
                      {isRtl ? 'أحدث الإيرادات والمدفوعات الفعلية' : 'Recent Real Transactions'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('FINANCIALS_STUDENTS');
                        setFinanceSubTab('TRANSACTIONS');
                      }}
                      className="text-xs font-bold text-brand-700 hover:underline"
                    >
                      {isRtl ? 'عرض وإدارة السجل المالي ←' : 'Manage Ledger →'}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-xs">
                      <thead className="bg-surface-muted text-navy-500 font-bold border-b border-surface-border">
                        <tr>
                          <th className="p-3.5 text-start">{isRtl ? 'رقم الطلب' : 'Order ID'}</th>
                          <th className="p-3.5 text-start">{isRtl ? 'المشتري' : 'Payer'}</th>
                          <th className="p-3.5 text-start">{isRtl ? 'الدورة / البند' : 'Item'}</th>
                          <th className="p-3.5 text-start">{isRtl ? 'المبلغ' : 'Amount'}</th>
                          <th className="p-3.5 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-borderSubtle">
                        {transactions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-navy-400">
                              {isRtl
                                ? 'لا توجد معاملات مالية مسجلة حتى الآن ($0.00). ستظهر الإيرادات الحقيقية هنا فور إتمام أي عملية دفع.'
                                : 'No transactions recorded yet ($0.00). Real payments will appear here automatically.'}
                            </td>
                          </tr>
                        ) : (
                          transactions.slice(0, 5).map((tx) => (
                            <tr key={tx.id} className="hover:bg-surface-muted/50">
                              <td className="p-3.5 font-mono font-bold text-navy-900">{tx.paypalOrderId}</td>
                              <td className="p-3.5 text-navy-600">{tx.payerName || tx.payerEmail}</td>
                              <td className="p-3.5 font-bold text-navy-900">{tx.itemTitle}</td>
                              <td className="p-3.5 font-extrabold text-brand-700">{formatCurrency(tx.amount)}</td>
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Students Preview */}
                <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-card-subtle">
                  <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between">
                    <h3 className="font-extrabold text-navy-950 text-sm">
                      {isRtl ? 'أحدث الطلاب المسجلين فعلياً' : 'Recent Enrolled Students'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('FINANCIALS_STUDENTS');
                        setFinanceSubTab('STUDENTS');
                      }}
                      className="text-xs font-bold text-brand-700 hover:underline"
                    >
                      {isRtl ? 'عرض وإدارة الطلاب ←' : 'Manage Students →'}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-xs">
                      <thead className="bg-surface-muted text-navy-500 font-bold border-b border-surface-border">
                        <tr>
                          <th className="p-3.5 text-start">{isRtl ? 'اسم الطالب' : 'Student'}</th>
                          <th className="p-3.5 text-start">{isRtl ? 'البريد / الهاتف' : 'Contact'}</th>
                          <th className="p-3.5 text-start">{isRtl ? 'الاشتراكات' : 'Enrollments'}</th>
                          <th className="p-3.5 text-start">{isRtl ? 'تاريخ الانضمام' : 'Joined'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-borderSubtle">
                        {students.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-navy-400">
                              {isRtl
                                ? 'لا يوجد طلاب مسجلون حتى الآن (0 طلاب). يظهر الطلاب تلقائياً فور حجز موعد أو الاشتراك في دورة.'
                                : 'No students enrolled yet (0 students). Students appear automatically upon booking or enrollment.'}
                            </td>
                          </tr>
                        ) : (
                          students.slice(0, 5).map((stu) => (
                            <tr key={stu.id} className="hover:bg-surface-muted/50">
                              <td className="p-3.5 font-bold text-navy-950">{stu.name}</td>
                              <td className="p-3.5 text-navy-600">
                                <div>{stu.email}</div>
                                {stu.phone && <div className="text-[10px] font-mono text-emerald-700">{stu.phone}</div>}
                              </td>
                              <td className="p-3.5 font-semibold text-brand-800">
                                {stu.enrolledCoursesCount} {isRtl ? 'دورات' : 'Courses'} • {stu.completedLessonsCount}{' '}
                                {isRtl ? 'حصة' : 'Lessons'}
                              </td>
                              <td className="p-3.5 text-navy-500">{stu.joinedDate}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB: FRONTEND CMS (Control Every Detail on Frontend) */}
          {/* ============================================================== */}
          {activeNav === 'FRONTEND_CMS' && (
            <div className="space-y-6">
              {/* CMS Sub Navigation Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-surface-border shadow-card-subtle">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCmsSubTab('HERO')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      cmsSubTab === 'HERO'
                        ? 'bg-brand-700 text-white shadow-card-subtle'
                        : 'bg-surface-muted text-navy-700 hover:bg-surface-elevated'
                    }`}
                  >
                    {isRtl ? 'قسم البداية (Hero & Stats)' : 'Hero Section & Stats'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCmsSubTab('SERVICES')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      cmsSubTab === 'SERVICES'
                        ? 'bg-brand-700 text-white shadow-card-subtle'
                        : 'bg-surface-muted text-navy-700 hover:bg-surface-elevated'
                    }`}
                  >
                    {isRtl ? 'كروت الخدمات والمسارات (Services)' : 'Services Cards'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCmsSubTab('TESTIMONIALS')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      cmsSubTab === 'TESTIMONIALS'
                        ? 'bg-brand-700 text-white shadow-card-subtle'
                        : 'bg-surface-muted text-navy-700 hover:bg-surface-elevated'
                    }`}
                  >
                    {isRtl ? 'آراء وتقييمات الطلاب (Testimonials)' : 'Student Reviews'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCmsSubTab('COMMUNICATION')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      cmsSubTab === 'COMMUNICATION'
                        ? 'bg-brand-700 text-white shadow-card-subtle'
                        : 'bg-surface-muted text-navy-700 hover:bg-surface-elevated'
                    }`}
                  >
                    {isRtl ? 'الإعلانات والتواصل والفوتر' : 'Announcements & Contact'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCmsSubTab('PAYPAL')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      cmsSubTab === 'PAYPAL'
                        ? 'bg-[#003087] text-white shadow-card-subtle'
                        : 'bg-[#FFC439]/25 text-[#003087] border border-[#FFC439] hover:bg-[#FFC439]/40'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إعدادات الربط بـ PayPal' : 'PayPal Settings'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-gold-50 border border-gold-200 px-3.5 py-2 rounded-xl text-xs font-bold text-navy-900 select-none shadow-sm hover:bg-gold-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={autoTranslateEnabled}
                      onChange={(e) => setAutoTranslateEnabled(e.target.checked)}
                      className="rounded text-brand-700 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                    <span>{isRtl ? 'الترجمة التلقائية الذكية للغات الأخرى ✨' : 'Smart Auto-Translate ✨'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleSaveSettings()}
                    className="px-5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-card-subtle"
                  >
                    <Check className="w-4 h-4 text-gold-300" />
                    <span>{isRtl ? 'حفظ وتحديث الواجهة فوراً' : 'Save & Publish Live'}</span>
                  </button>
                </div>
              </div>

              {/* Sub-tab 1: HERO & STATS */}
              {cmsSubTab === 'HERO' && (
                <div className="space-y-6">
                  {/* Hero Headline & Texts Form */}
                  <div className="academy-card p-6 bg-white border border-surface-border rounded-2xl space-y-4 shadow-card-subtle">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-border">
                      <div className="flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-brand-700" />
                        <h3 className="font-extrabold text-navy-950 text-sm">
                          {isRtl ? 'نصوص وعناوين الواجهة الرئيسية (Hero Section Content)' : 'Hero Headlines & Subtitle Content'}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={handleTranslateHero}
                        disabled={translatingId === 'hero'}
                        className="px-3.5 py-1.5 rounded-xl bg-gold-50 border border-gold-300 hover:bg-gold-100 text-navy-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-60"
                        title={isRtl ? 'ترجمة كافة نصوص الهيرو العربية إلى الإنجليزية بضغطة واحدة' : 'Auto-translate Hero texts to English'}
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-gold-600 ${translatingId === 'hero' ? 'animate-spin' : ''}`} />
                        <span>
                          {translatingId === 'hero'
                            ? (isRtl ? 'جاري الترجمة آلياً...' : 'Translating...')
                            : (isRtl ? 'ترجمة نصوص الهيرو للإنجليزية ✨' : 'Translate Hero to English ✨')}
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'شارة الثقة العلوية (بالعربية)' : 'Trust Badge (Arabic)'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroBadgeAr || ''}
                          onChange={(e) => setSettings({ ...settings, heroBadgeAr: e.target.value })}
                          onBlur={() => handleAutoTranslateArabicField('heroBadgeAr', settings.heroBadgeAr, 'heroBadgeEn', (v) => setSettings((p) => ({ ...p, heroBadgeEn: v })))}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'شارة الثقة العلوية (English)' : 'Trust Badge (English)'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroBadgeEn || ''}
                          onChange={(e) => setSettings({ ...settings, heroBadgeEn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'العنوان الرئيسي (بالعربية)' : 'Main Headline (Arabic)'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroTitleAr || ''}
                          onChange={(e) => setSettings({ ...settings, heroTitleAr: e.target.value })}
                          onBlur={() => handleAutoTranslateArabicField('heroTitleAr', settings.heroTitleAr, 'heroTitleEn', (v) => setSettings((p) => ({ ...p, heroTitleEn: v })))}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-sm"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'النص الملوّن والمميز في العنوان (بالعربية)' : 'Headline Highlight Text (Arabic)'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroTitleHighlightAr || ''}
                          onChange={(e) => setSettings({ ...settings, heroTitleHighlightAr: e.target.value })}
                          onBlur={() => handleAutoTranslateArabicField('heroTitleHighlightAr', settings.heroTitleHighlightAr, 'heroTitleHighlightEn', (v) => setSettings((p) => ({ ...p, heroTitleHighlightEn: v })))}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-brand-700 font-bold"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'العنوان الرئيسي (English)' : 'Main Headline (English)'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroTitleEn || ''}
                          onChange={(e) => setSettings({ ...settings, heroTitleEn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'النص الملوّن والمميز في العنوان (English)' : 'Headline Highlight Text (English)'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroTitleHighlightEn || ''}
                          onChange={(e) => setSettings({ ...settings, heroTitleHighlightEn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border text-brand-700 font-bold"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'الوصف التمهيدي الجذاب (بالعربية)' : 'Subtitle Paragraph (Arabic)'}
                        </label>
                        <textarea
                          rows={2}
                          value={settings.heroSubtitleAr || ''}
                          onChange={(e) => setSettings({ ...settings, heroSubtitleAr: e.target.value })}
                          onBlur={() => handleAutoTranslateArabicField('heroSubtitleAr', settings.heroSubtitleAr, 'heroSubtitleEn', (v) => setSettings((p) => ({ ...p, heroSubtitleEn: v })))}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'الوصف التمهيدي الجذاب (English)' : 'Subtitle Paragraph (English)'}
                        </label>
                        <textarea
                          rows={2}
                          value={settings.heroSubtitleEn || ''}
                          onChange={(e) => setSettings({ ...settings, heroSubtitleEn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'نص الزر الأساسي (Primary CTA Text)' : 'Primary CTA Button Text'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroCtaPrimaryTextAr || ''}
                          onChange={(e) => setSettings({ ...settings, heroCtaPrimaryTextAr: e.target.value })}
                          onBlur={() => handleAutoTranslateArabicField('heroCtaPrimaryTextAr', settings.heroCtaPrimaryTextAr, 'heroCtaPrimaryTextEn', (v) => setSettings((p) => ({ ...p, heroCtaPrimaryTextEn: v })))}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'رابط الزر الأساسي' : 'Primary CTA Link'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroCtaPrimaryLink || '/courses'}
                          onChange={(e) => setSettings({ ...settings, heroCtaPrimaryLink: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-brand-700"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'نص الزر الثانوي (Secondary CTA Text)' : 'Secondary CTA Button Text'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroCtaSecondaryTextAr || ''}
                          onChange={(e) => setSettings({ ...settings, heroCtaSecondaryTextAr: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'رابط الزر الثانوي' : 'Secondary CTA Link'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroCtaSecondaryLink || '/private-lessons'}
                          onChange={(e) => setSettings({ ...settings, heroCtaSecondaryLink: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-brand-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4 Hero Counters Form */}
                  <div className="academy-card p-6 bg-white border border-surface-border rounded-2xl space-y-4 shadow-card-subtle">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-surface-border">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-gold-600" />
                        <div>
                          <h3 className="font-extrabold text-navy-950 text-sm">
                            {isRtl ? 'الأرقام والإحصائيات الحية في الصفحة الرئيسية' : 'Hero Live Metric Counters'}
                          </h3>
                          <p className="text-xs text-navy-500">
                            {isRtl
                              ? 'التحكم في إظهار أو إخفاء بطاقات الإحصائيات الأربعة في الواجهة الرئيسية'
                              : 'Control display of the 4 live statistics cards in the hero section'}
                          </p>
                        </div>
                      </div>

                      {/* Visibility Toggle Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            heroStatsEnabled: settings.heroStatsEnabled === false ? true : false,
                          })
                        }
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all shadow-sm ${
                          settings.heroStatsEnabled !== false
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            settings.heroStatsEnabled !== false ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'
                          }`}
                        />
                        <span>
                          {settings.heroStatsEnabled !== false
                            ? isRtl
                              ? 'ظاهر في الواجهة (مُفعّل)'
                              : 'Visible on site (Enabled)'
                            : isRtl
                            ? 'مخفي من الواجهة (مُعطّل)'
                            : 'Hidden on site (Disabled)'}
                        </span>
                        <span className="text-[10px] underline ml-1">
                          {isRtl ? '(اضغط للتغيير)' : '(Click to toggle)'}
                        </span>
                      </button>
                    </div>

                    <div
                      className={`grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs transition-opacity ${
                        settings.heroStatsEnabled === false ? 'opacity-40 pointer-events-none' : 'opacity-100'
                      }`}
                    >
                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'عدد الطلاب' : 'Students Count'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroStudentsCount || ''}
                          onChange={(e) => setSettings({ ...settings, heroStudentsCount: e.target.value })}
                          placeholder="1,250+"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border text-center font-black text-brand-800"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'عدد الدول' : 'Countries Count'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroCountriesCount || ''}
                          onChange={(e) => setSettings({ ...settings, heroCountriesCount: e.target.value })}
                          placeholder="34+"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border text-center font-black text-gold-700"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'الإنجازات والدروس' : 'Milestones Completed'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroLessonsCompleted || ''}
                          onChange={(e) => setSettings({ ...settings, heroLessonsCompleted: e.target.value })}
                          placeholder="850+"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border text-center font-black text-quran-700"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'معدل الرضا والتقييم' : 'Satisfaction Rating'}
                        </label>
                        <input
                          type="text"
                          value={settings.heroSatisfactionRate || ''}
                          onChange={(e) => setSettings({ ...settings, heroSatisfactionRate: e.target.value })}
                          placeholder="5.0"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border text-center font-black text-amber-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab: SERVICES / TRACKS */}
              {cmsSubTab === 'SERVICES' && (
                <div className="space-y-6">
                  {/* Top Header Toolbar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-surface-border shadow-card-subtle">
                    <div>
                      <h3 className="font-extrabold text-navy-950 text-sm">
                        {isRtl ? 'إدارة وتخصيص المسارات التعليمية ومحتوياتها' : 'Academic Tracks & Curriculum Management'}
                      </h3>
                      <p className="text-xs text-navy-500">
                        {isRtl
                          ? 'إضافة وتعديل المسارات الأكاديمية والتحكم في المراحل والوحدات والدروس التفصيلية داخل كل مسار.'
                          : 'Add, edit, or customize academic pathways and the detailed stages/modules inside each track.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200">
                        {isRtl
                          ? `${(settings.services || []).filter((s) => s.isActive !== false).length} مسارات مفعّلة في الواجهة`
                          : `${(settings.services || []).filter((s) => s.isActive !== false).length} Active Tracks`}
                      </span>
                      <button
                        type="button"
                        onClick={handleOpenAddTrack}
                        className="px-4 py-2 rounded-xl bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-brand-800 transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isRtl ? 'إضافة مسار تعليمي جديد' : 'Add New Track'}</span>
                      </button>
                    </div>
                  </div>

                  {/* INLINE ADD TRACK MODAL */}
                  {showAddTrackModal && (
                    <div id="add-track-modal-box" className="bg-white rounded-3xl border-2 border-brand-300 p-6 space-y-4 shadow-card-hover animate-in fade-in slide-in-from-top-4">
                      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-brand-700" />
                          <div>
                            <h3 className="font-extrabold text-navy-950 text-sm">
                              {isRtl ? 'إضافة مسار تعليمي جديد للأكاديمية' : 'Create New Academic Track'}
                            </h3>
                            <p className="text-[11px] text-navy-500">
                              {isRtl ? 'يظهر هذا المسار في الواجهة العامة ويمكن إضافة مراحل ووحدات مخصصة بداخله' : 'This track appears on the public site with custom modules & lessons'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddTrackModal(false)}
                          className="px-2.5 py-1 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-elevated text-navy-600 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>{isRtl ? 'إلغاء' : 'Close'}</span>
                        </button>
                      </div>

                      <form onSubmit={handleSaveTrackModal} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'عنوان المسار (بالعربية)' : 'Track Title (Arabic)'} *
                            </label>
                            <input
                              type="text"
                              required
                              value={trackFormData.titleAr}
                              onChange={(e) => setTrackFormData({ ...trackFormData, titleAr: e.target.value })}
                              placeholder="مثال: مسار دبلوم القراءات والتجويد المتخصص"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'عنوان المسار (English)' : 'Track Title (English)'}
                            </label>
                            <input
                              type="text"
                              value={trackFormData.titleEn}
                              onChange={(e) => setTrackFormData({ ...trackFormData, titleEn: e.target.value })}
                              placeholder="Specialized Qira'at & Advanced Tajweed Diploma"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'الشارة الترويجية (بالعربية)' : 'Badge (Arabic)'}
                            </label>
                            <input
                              type="text"
                              value={trackFormData.badgeAr}
                              onChange={(e) => setTrackFormData({ ...trackFormData, badgeAr: e.target.value })}
                              placeholder="المسار الأكاديمي المعتمد"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'تصنيف المسار' : 'Category'}
                            </label>
                            <select
                              value={trackFormData.categoryKey}
                              onChange={(e) => setTrackFormData({ ...trackFormData, categoryKey: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                            >
                              <option value="quran">{isRtl ? 'علوم القرآن الكريم والحفظ' : 'Quran & Hifz'}</option>
                              <option value="arabic">{isRtl ? 'اللغة العربية وفنونها' : 'Arabic Language'}</option>
                              <option value="specialized">{isRtl ? 'العربية لأغراض خاصة' : 'Specialized Arabic'}</option>
                              <option value="general">{isRtl ? 'عام / مسار أكاديمي' : 'General Academic Track'}</option>
                            </select>
                          </div>

                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'رابط المسار (Route / URL)' : 'Route / URL Slug'}
                            </label>
                            <input
                              type="text"
                              value={trackFormData.href}
                              onChange={(e) => setTrackFormData({ ...trackFormData, href: e.target.value })}
                              placeholder="/tracks/qiraat-diploma"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs font-mono"
                            />
                            <span className="text-[10px] text-navy-400 mt-0.5 block">
                              {isRtl ? 'مثال: /tracks/your-slug أو اتركه فارغاً وسيتم إنشاؤه تلقائياً' : 'e.g. /tracks/your-slug (auto-generated if empty)'}
                            </span>
                          </div>

                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'المدة التقديرية (بالعربية)' : 'Estimated Duration (Arabic)'}
                            </label>
                            <input
                              type="text"
                              value={trackFormData.durationAr}
                              onChange={(e) => setTrackFormData({ ...trackFormData, durationAr: e.target.value })}
                              placeholder="3 أشهر (مرن)"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'نمط الدراسة (بالعربية)' : 'Study Format (Arabic)'}
                            </label>
                            <input
                              type="text"
                              value={trackFormData.formatAr}
                              onChange={(e) => setTrackFormData({ ...trackFormData, formatAr: e.target.value })}
                              placeholder="جلسات فردية مباشرة أونلاين"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'الإجازة والسند (بالعربية)' : 'Sanad / Certification (Arabic)'}
                            </label>
                            <input
                              type="text"
                              value={trackFormData.sanadAr}
                              onChange={(e) => setTrackFormData({ ...trackFormData, sanadAr: e.target.value })}
                              placeholder="مؤهل لنيل الإجازة بالسند المتصل"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'نبذة ومقدمة المسار (بالعربية)' : 'Track Description / Subtitle (Arabic)'}
                            </label>
                            <textarea
                              rows={2}
                              value={trackFormData.subtitleAr}
                              onChange={(e) => setTrackFormData({ ...trackFormData, subtitleAr: e.target.value })}
                              placeholder="منهج تعليمي مكثف يهدف إلى تأهيل الدارسين..."
                              className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                            />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-surface-borderSubtle flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAddTrackModal(false)}
                            className="px-4 py-2 rounded-xl border border-surface-border bg-white text-navy-700 font-bold hover:bg-surface-muted"
                          >
                            {isRtl ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button
                            type="submit"
                            disabled={savingTrack}
                            className="px-5 py-2 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Check className="w-4 h-4 text-gold-300" />
                            <span>{savingTrack ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ ونشر المسار' : 'Save Track')}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* INLINE ADD/EDIT TRACK ITEM (STAGE/MODULE) MODAL */}
                  {showAddItemModal && (
                    <div id="add-track-item-modal-box" className="bg-white rounded-3xl border-2 border-emerald-400 p-6 space-y-4 shadow-card-hover animate-in fade-in slide-in-from-top-4">
                      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-emerald-700" />
                          <div>
                            <h3 className="font-extrabold text-navy-950 text-sm">
                              {editingItemId
                                ? (isRtl ? 'تعديل المرحلة / الوحدة داخل المسار' : 'Edit Stage / Module inside Track')
                                : (isRtl ? 'إضافة مرحلة / وحدة جديدة داخل المسار' : 'Add New Stage / Module inside Track')}
                            </h3>
                            <p className="text-[11px] text-navy-500">
                              {isRtl
                                ? 'المراحل والوحدات والدروس المنهجية التي يدرسها الطالب داخل هذا المسار التعليمي'
                                : 'Define the curriculum steps, lessons count, duration, and learning objectives.'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddItemModal(false)}
                          className="px-2.5 py-1 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-elevated text-navy-600 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>{isRtl ? 'إلغاء' : 'Close'}</span>
                        </button>
                      </div>

                      <form onSubmit={handleSaveTrackItemModal} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'عنوان المرحلة / الوحدة (بالعربية)' : 'Stage Title (Arabic)'} *
                            </label>
                            <input
                              type="text"
                              required
                              value={itemFormData.titleAr}
                              onChange={(e) => setItemFormData({ ...itemFormData, titleAr: e.target.value })}
                              placeholder="مثال: تأسيس مخارج الحروف وأحكام النون"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'عنوان المرحلة (English)' : 'Stage Title (English)'}
                            </label>
                            <input
                              type="text"
                              value={itemFormData.title}
                              onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                              placeholder="Phonetic Foundations & Nun Rules"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'اسم المرحلة / الترتيب (بالعربية)' : 'Level / Stage Badge (Arabic)'}
                            </label>
                            <input
                              type="text"
                              value={itemFormData.levelAr}
                              onChange={(e) => setItemFormData({ ...itemFormData, levelAr: e.target.value })}
                              placeholder="المرحلة الأولى"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'اسم المرحلة (English)' : 'Level / Stage Badge (English)'}
                            </label>
                            <input
                              type="text"
                              value={itemFormData.level}
                              onChange={(e) => setItemFormData({ ...itemFormData, level: e.target.value })}
                              placeholder="Stage 1"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'المدة التقديرية للمرحلة (بالعربية)' : 'Stage Duration (Arabic)'}
                            </label>
                            <input
                              type="text"
                              value={itemFormData.durationAr}
                              onChange={(e) => setItemFormData({ ...itemFormData, durationAr: e.target.value })}
                              placeholder="4 أسابيع"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'عدد الدروس في هذه المرحلة' : 'Lessons Count'}
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={itemFormData.lessonsCount}
                              onChange={(e) => setItemFormData({ ...itemFormData, lessonsCount: Number(e.target.value) })}
                              placeholder="12"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'شرح ووصف أهداف هذه المرحلة (بالعربية)' : 'Stage Description (Arabic)'}
                            </label>
                            <textarea
                              rows={2}
                              value={itemFormData.descAr}
                              onChange={(e) => setItemFormData({ ...itemFormData, descAr: e.target.value })}
                              placeholder="تركز هذه المرحلة على الضبط العملي للمخارج والصفات الصوتية والتطبيق المباشر..."
                              className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'المحاور والنقاط التعليمية المستهدفة (سطر لكل نقطة بالعربية)' : 'Key Topics & Learning Objectives (One per line)'}
                            </label>
                            <textarea
                              rows={3}
                              value={itemFormData.pointsTextAr}
                              onChange={(e) => setItemFormData({ ...itemFormData, pointsTextAr: e.target.value })}
                              placeholder="المخرج الصوتي لكل حرف&#10;أحكام النون الساكنة والتنوين&#10;تدريبات تلاوة عملية"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                            />
                          </div>

                          {/* UNIT DESTINATION & CONTENT TYPE SELECTOR */}
                          <div className="md:col-span-2 pt-3 border-t border-surface-border space-y-4">
                            <div>
                              <label className="font-extrabold text-navy-900 block mb-1.5 text-xs">
                                {isRtl
                                  ? '🎯 ماذا يجد العميل عند الدخول على هذه الوحدة / المرحلة؟ (تحديد نوع المحتوى والوجهة)'
                                  : '🎯 What does the student find inside this Unit / Stage? (Content & Action Type)'}
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                                {[
                                  {
                                    type: 'PRIVATE_LESSON' as TrackItemActionType,
                                    labelAr: 'حصة خاصة / حجز موعد',
                                    labelEn: '1-on-1 Private Lesson',
                                    subAr: 'تقويم حجز المواعيد المباشر + شرح تمهيدي',
                                    subEn: 'Live Booking Calendar + Intro Content',
                                  },
                                  {
                                    type: 'COURSE' as TrackItemActionType,
                                    labelAr: 'دورة تدريبية متكاملة',
                                    labelEn: 'Full Structured Course',
                                    subAr: 'ربط بدورة مسجلة وعرض جميع دروسها واشتراكها',
                                    subEn: 'Link to a Course & its lessons',
                                  },
                                  {
                                    type: 'DIRECT_CONTENT' as TrackItemActionType,
                                    labelAr: 'درس مرئي / محتوى مباشر',
                                    labelEn: 'Direct Video / PDF Lesson',
                                    subAr: 'فيديو شرح + مذكرة PDF + مادة علمية مكتوبة',
                                    subEn: 'Video Player + PDF + Written Guide',
                                  },
                                  {
                                    type: 'CUSTOM_LINK' as TrackItemActionType,
                                    labelAr: 'رابط مخصص / وجهة خارجية',
                                    labelEn: 'Custom Link / URL',
                                    subAr: 'توجيه العميل لصفحة أو رابط يحدده المدير',
                                    subEn: 'Redirect student to a custom URL',
                                  },
                                ].map((opt) => {
                                  const isSelected = itemFormData.actionType === opt.type;
                                  return (
                                    <button
                                      key={opt.type}
                                      type="button"
                                      onClick={() => setItemFormData({ ...itemFormData, actionType: opt.type })}
                                      className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between gap-1 ${
                                        isSelected
                                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                                          : 'border-surface-border bg-surface-muted/40 hover:bg-surface-muted'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <span className={`font-extrabold text-xs ${isSelected ? 'text-emerald-900' : 'text-navy-900'}`}>
                                          {isRtl ? opt.labelAr : opt.labelEn}
                                        </span>
                                        <span
                                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                            isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-navy-300 bg-white'
                                          }`}
                                        >
                                          {isSelected && <Check className="w-2.5 h-2.5" />}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-navy-500 leading-snug">
                                        {isRtl ? opt.subAr : opt.subEn}
                                      </p>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* CONDITIONAL: Linked Course Selector when actionType === 'COURSE' */}
                            {itemFormData.actionType === 'COURSE' && (
                              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                                <label className="font-bold text-purple-950 block">
                                  {isRtl ? 'اختر الدورة التدريبية المرتبطة بهذه الوحدة' : 'Select Linked Course'}
                                </label>
                                <select
                                  value={itemFormData.linkedCourseSlug}
                                  onChange={(e) => {
                                    const selectedSlug = e.target.value;
                                    const matchedCourse = courses.find((c) => c.slug === selectedSlug || c.id === selectedSlug);
                                    setItemFormData({
                                      ...itemFormData,
                                      linkedCourseSlug: selectedSlug,
                                      price: matchedCourse && !itemFormData.price ? matchedCourse.price : itemFormData.price,
                                    });
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-purple-300 bg-white text-navy-900 font-bold text-xs"
                                >
                                  <option value="">
                                    {isRtl ? '-- اختر دورة من الدورات المضافة في الأكاديمية --' : '-- Select an existing course --'}
                                  </option>
                                  {courses.map((c) => (
                                    <option key={c.id} value={c.slug}>
                                      {isRtl ? c.titleAr : c.title} ({c.price > 0 ? `$${c.price}` : isRtl ? 'مجاني' : 'Free'})
                                    </option>
                                  ))}
                                </select>
                                <p className="text-[11px] text-purple-800">
                                  {isRtl
                                    ? 'عند دخول الطالب لهذه الوحدة سيجد مشغل دروس هذه الدورة بالكامل وزر الاشتراك المباشر بها.'
                                    : 'Students entering this unit will see the full course curriculum player and enrollment options.'}
                                </p>
                              </div>
                            )}

                            {/* CONDITIONAL: Custom URL when actionType === 'CUSTOM_LINK' */}
                            {itemFormData.actionType === 'CUSTOM_LINK' && (
                              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                                <label className="font-bold text-amber-950 block">
                                  {isRtl ? 'الرابط المخصص للوحدة (URL أو مسار داخلي)' : 'Custom Destination URL'}
                                </label>
                                <input
                                  type="text"
                                  value={itemFormData.customUrl}
                                  onChange={(e) => setItemFormData({ ...itemFormData, customUrl: e.target.value })}
                                  placeholder="https://... أو /courses/..."
                                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-mono"
                                  dir="ltr"
                                />
                              </div>
                            )}

                            {/* PRICING & CTA CUSTOMIZATION */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-surface-muted/50 border border-surface-border">
                              <div>
                                <label className="font-bold text-navy-700 block mb-1">
                                  {isRtl ? 'سعر مستقل لهذه الوحدة ($ USD - اختياري)' : 'Unit Price ($ USD - Optional)'}
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  disabled={itemFormData.isFree}
                                  value={itemFormData.isFree ? 0 : itemFormData.price}
                                  onChange={(e) => setItemFormData({ ...itemFormData, price: Number(e.target.value) })}
                                  placeholder="0 = حسب التسعير الزمني أو مجاني"
                                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-xs disabled:opacity-50"
                                />
                                <span className="text-[10px] text-navy-500 block mt-1">
                                  {isRtl
                                    ? 'إذا وضعت سعراً > 0 سيظهر زر دفع PayPal مباشر لهذه الوحدة'
                                    : 'If > 0, a direct PayPal checkout button appears inside the unit'}
                                </span>
                              </div>

                              <div className="flex items-center pt-4">
                                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={itemFormData.isFree}
                                    onChange={(e) =>
                                      setItemFormData({
                                        ...itemFormData,
                                        isFree: e.target.checked,
                                        price: e.target.checked ? 0 : itemFormData.price,
                                      })
                                    }
                                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <span className="font-bold text-navy-800 text-xs">
                                    {isRtl ? 'وحدة مجانية تماماً (تظهر شارة مجاناً للعميل)' : 'Free Unit (Displays Free Badge)'}
                                  </span>
                                </label>
                              </div>

                              <div>
                                <label className="font-bold text-navy-700 block mb-1">
                                  {isRtl ? 'نص زر الدخول للوحدة (اختياري - بالعربية)' : 'Custom Button Label (Arabic - Optional)'}
                                </label>
                                <input
                                  type="text"
                                  value={itemFormData.ctaTextAr}
                                  onChange={(e) => setItemFormData({ ...itemFormData, ctaTextAr: e.target.value })}
                                  placeholder={
                                    itemFormData.actionType === 'PRIVATE_LESSON'
                                      ? 'ادخل للوحدة واحجز حصتك'
                                      : itemFormData.actionType === 'COURSE'
                                      ? 'استعرض الدورة والدروس'
                                      : 'ابدأ دراسة هذه الوحدة'
                                  }
                                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white font-arabic text-xs"
                                />
                              </div>
                            </div>

                            {/* DIRECT EDUCATIONAL CONTENT INSIDE UNIT (VIDEO, PDF, WRITTEN EXPLANATION) */}
                            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-extrabold text-navy-900 text-xs flex items-center gap-1.5">
                                  <Video className="w-4 h-4 text-emerald-700" />
                                  <span>
                                    {isRtl
                                      ? 'المحتوى العلمي المباشر داخل صفحة الوحدة (فيديو / ملف PDF / شرح تفصيلي)'
                                      : 'Direct Educational Content Inside Unit Page (Video / PDF / Detailed Text)'}
                                  </span>
                                </h4>
                                <span className="text-[10px] text-emerald-800 font-bold">
                                  {isRtl ? 'يظهر للطالب فور فتح صفحة الوحدة' : 'Displayed inside the unit page'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <MediaInputWithChoice
                                  label={isRtl ? 'فيديو شرح الوحدة (رفع فيديو أو رابط يوتيوب / MP4)' : 'Unit Video (Upload or YouTube/MP4 URL)'}
                                  value={itemFormData.videoUrl}
                                  onChange={(url) => setItemFormData({ ...itemFormData, videoUrl: url })}
                                  category="videos"
                                  accept="video/*"
                                  placeholder="https://www.youtube.com/watch?v=... أو ارفع ملف فيديو"
                                  isRtl={isRtl}
                                />

                                <MediaInputWithChoice
                                  label={isRtl ? 'ملف PDF أو مذكرة الوحدة (رفع ملف أو رابط)' : 'Unit PDF / Worksheet (Upload or URL)'}
                                  value={itemFormData.fileUrl}
                                  onChange={(url) => setItemFormData({ ...itemFormData, fileUrl: url })}
                                  category="resources"
                                  accept=".pdf,.doc,.docx,application/pdf"
                                  placeholder="https://... أو ارفع ملف PDF"
                                  isRtl={isRtl}
                                />
                              </div>

                              <div>
                                <label className="font-bold text-navy-700 block mb-1">
                                  {isRtl
                                    ? 'المادة العلمية أو الشرح التفصيلي داخل صفحة الوحدة (بالعربية)'
                                    : 'Detailed Written Lesson / Instructions Inside Unit (Arabic)'}
                                </label>
                                <textarea
                                  rows={4}
                                  value={itemFormData.detailedContentAr}
                                  onChange={(e) => setItemFormData({ ...itemFormData, detailedContentAr: e.target.value })}
                                  placeholder="اكتب هنا الشرح المفصل للوحدة، القواعد العلمية، خطوات التطبيق العملي، أو تعليمات التحضير قبل الحصة..."
                                  className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white font-arabic text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-surface-borderSubtle flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAddItemModal(false)}
                            className="px-4 py-2 rounded-xl border border-surface-border bg-white text-navy-700 font-bold hover:bg-surface-muted"
                          >
                            {isRtl ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button
                            type="submit"
                            disabled={savingItem}
                            className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Check className="w-4 h-4 text-emerald-200" />
                            <span>{savingItem ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ المرحلة في المسار' : 'Save Stage')}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Services / Tracks Cards List */}
                  <div className="grid grid-cols-1 gap-6">
                    {(settings.services || []).map((service) => {
                      const isEditing = editingServiceId === service.id;
                      const isActive = service.isActive !== false;
                      const isExpanded = expandedTracks[service.id] !== false; // Default is open
                      const items = service.items || [];

                      return (
                        <div
                          key={service.id}
                          className={`academy-card p-5 sm:p-6 bg-white border-2 rounded-3xl transition-all shadow-card-subtle ${
                            isActive ? 'border-surface-border hover:border-brand-300' : 'border-gray-200 opacity-70 bg-gray-50/60'
                          }`}
                        >
                          {/* Card Header Toolbar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-borderSubtle">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                                  isActive ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-black text-sm sm:text-base text-navy-950">
                                    {isRtl ? service.titleAr : service.titleEn}
                                  </span>
                                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                    {isRtl ? service.badgeAr : service.badgeEn}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-brand-50 text-brand-700 border border-brand-200">
                                    {items.length} {isRtl ? 'مراحل مضافة' : 'Stages'}
                                  </span>
                                </div>
                                <span className="text-[11px] text-navy-500 font-medium">
                                  {isRtl
                                    ? `التصنيف: ${service.categoryKey} • المسار: ${service.href}`
                                    : `Category: ${service.categoryKey} • Route: ${service.href}`}
                                </span>
                              </div>
                            </div>

                            {/* Actions: Toggle Active + Edit + Delete */}
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleServiceActive(service.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                                  isActive
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                }`}
                                title={
                                  isActive
                                    ? isRtl ? 'إخفاء المسار من الواجهة' : 'Hide track from homepage'
                                    : isRtl ? 'إظهار المسار في الواجهة' : 'Show track on homepage'
                                }
                              >
                                {isActive ? (
                                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                                )}
                                <span>{isActive ? (isRtl ? 'ظاهر' : 'Visible') : isRtl ? 'مخفي' : 'Hidden'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditingServiceId(isEditing ? null : service.id)}
                                className="px-3.5 py-1.5 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-elevated text-navy-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-navy-600" />
                                <span>
                                  {isEditing
                                    ? isRtl ? 'إغلاق المحرر' : 'Close'
                                    : isRtl ? 'تعديل المسار' : 'Edit Track'}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteTrackAction(service.id)}
                                className="p-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                title={isRtl ? 'حذف هذا المسار التعليمي نهائياً' : 'Delete track permanently'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Inline Editor Form for Track Details (shown when editing) */}
                          {isEditing ? (
                            <div className="mt-5 pt-4 border-t border-surface-borderSubtle space-y-4 animate-in fade-in duration-200">
                              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-surface-borderSubtle">
                                <span className="text-xs font-bold text-navy-800">
                                  {isRtl ? 'تعديل وتخصيص بيانات المسار التعليمي' : 'Track Details Customization'}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleTranslateService(service.id)}
                                  disabled={translatingId === `service-${service.id}`}
                                  className="px-3.5 py-1.5 rounded-xl bg-gold-50 border border-gold-300 hover:bg-gold-100 text-navy-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-60"
                                  title={isRtl ? 'ترجمة بيانات هذا المسار للإنجليزية بضغطة زر' : 'Translate this track to English'}
                                >
                                  <Sparkles className={`w-3.5 h-3.5 text-gold-600 ${translatingId === `service-${service.id}` ? 'animate-spin' : ''}`} />
                                  <span>
                                    {translatingId === `service-${service.id}`
                                      ? (isRtl ? 'جاري الترجمة...' : 'Translating...')
                                      : (isRtl ? 'ترجمة المسار للإنجليزية ✨' : 'Translate Track ✨')}
                                  </span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'عنوان المسار (بالعربية)' : 'Track Title (Arabic)'} *
                                  </label>
                                  <input
                                    type="text"
                                    value={service.titleAr || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'titleAr', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'عنوان المسار (English)' : 'Track Title (English)'} *
                                  </label>
                                  <input
                                    type="text"
                                    value={service.titleEn || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'titleEn', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'الشارة الترويجية (بالعربية)' : 'Badge Label (Arabic)'}
                                  </label>
                                  <input
                                    type="text"
                                    value={service.badgeAr || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'badgeAr', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'الشارة الترويجية (English)' : 'Badge Label (English)'}
                                  </label>
                                  <input
                                    type="text"
                                    value={service.badgeEn || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'badgeEn', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'رابط المسار في الموقع (Route URL)' : 'Route URL (Href)'}
                                  </label>
                                  <input
                                    type="text"
                                    value={service.href || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'href', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs font-mono"
                                  />
                                </div>

                                <div>
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'المدة التقديرية (بالعربية)' : 'Duration (Arabic)'}
                                  </label>
                                  <input
                                    type="text"
                                    value={service.durationAr || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'durationAr', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'نمط الدراسة (بالعربية)' : 'Format (Arabic)'}
                                  </label>
                                  <input
                                    type="text"
                                    value={service.formatAr || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'formatAr', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'معلومات الإجازة والسند (بالعربية)' : 'Sanad Info (Arabic)'}
                                  </label>
                                  <input
                                    type="text"
                                    value={service.sanadAr || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'sanadAr', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'الوصف التوضيحي للمسار (بالعربية)' : 'Subtitle / Description (Arabic)'}
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={service.subtitleAr || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'subtitleAr', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'الوصف التوضيحي للمسار (English)' : 'Subtitle / Description (English)'}
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={service.subtitleEn || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'subtitleEn', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl
                                      ? 'محاور وخطة المنهج السريعة في الكارد (سطر لكل نقطة)'
                                      : 'Quick Highlights in Card (One per line)'}
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={(service.featuresAr || []).join('\n')}
                                    onChange={(e) =>
                                      handleUpdateServiceField(
                                        service.id,
                                        'featuresAr',
                                        e.target.value.split('\n').filter((l) => l.trim().length > 0)
                                      )
                                    }
                                    placeholder="تأسيس مخارج الحروف..."
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end gap-2 pt-2 border-t border-surface-borderSubtle">
                                <button
                                  type="button"
                                  onClick={() => setEditingServiceId(null)}
                                  className="px-4 py-1.5 rounded-xl border border-surface-border bg-white text-navy-700 text-xs font-bold hover:bg-surface-muted"
                                >
                                  {isRtl ? 'إغلاق' : 'Close'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleSaveSettings();
                                    setEditingServiceId(null);
                                  }}
                                  className="px-5 py-1.5 rounded-xl bg-brand-700 text-white text-xs font-bold hover:bg-brand-800 flex items-center gap-1.5 shadow-sm"
                                >
                                  <Check className="w-3.5 h-3.5 text-gold-300" />
                                  <span>{isRtl ? 'حفظ وتحديث المسار فوراً' : 'Save Track Changes'}</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 text-xs text-navy-600 line-clamp-2 leading-relaxed">
                              {isRtl ? service.subtitleAr : service.subtitleEn}
                            </div>
                          )}

                          {/* ============================================================== */}
                          {/* STAGES & MODULES INSIDE TRACK SECTION (الحاجات اللي داخل المسار) */}
                          {/* ============================================================== */}
                          <div className="mt-5 pt-4 border-t border-surface-borderSubtle space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-muted/70 p-3.5 rounded-2xl border border-surface-borderSubtle">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
                                  <Layers className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="font-extrabold text-xs text-navy-950 block">
                                    {isRtl ? 'المراحل والوحدات المنهجية داخل هذا المسار' : 'Curriculum Stages & Modules Inside Track'}
                                  </span>
                                  <span className="text-[10px] text-navy-500">
                                    {items.length > 0
                                      ? (isRtl ? `يحتوي على ${items.length} مراحل دراسية تفصيلية` : `${items.length} detailed learning stages`)
                                      : (isRtl ? 'لا توجد مراحل مضافة بعد داخل هذا المسار' : 'No stages added yet')}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenAddItemToTrack(service.id)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>{isRtl ? 'إضافة مرحلة / وحدة داخل المسار' : 'Add Stage / Module'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleTrackExpanded(service.id)}
                                  className="p-1.5 rounded-xl border border-surface-border bg-white text-navy-600 hover:bg-surface-muted transition-colors"
                                  title={isExpanded ? (isRtl ? 'طي المراحل' : 'Collapse') : (isRtl ? 'عرض المراحل' : 'Expand')}
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {/* List of items inside this track */}
                            {isExpanded && (
                              <div className="space-y-2.5 pt-1 animate-in fade-in duration-150">
                                {items.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {items.map((item, itIdx) => {
                                      const itemPoints = isRtl ? item.pointsAr : item.points;
                                      const actionType = item.actionType || 'PRIVATE_LESSON';
                                      const cleanTrackSlug = (service.href || '')
                                        .replace(/^\/+/, '')
                                        .replace(/^tracks\//, '');
                                      const unitPreviewUrl = `/${currentLocale}/tracks/${cleanTrackSlug}/${item.id}`;

                                      const actionBadge =
                                        actionType === 'COURSE'
                                          ? {
                                              label: isRtl ? '🎓 دورة تدريبية' : '🎓 Course',
                                              cls: 'bg-purple-50 text-purple-800 border-purple-200',
                                            }
                                          : actionType === 'DIRECT_CONTENT'
                                          ? {
                                              label: isRtl ? '🎬 درس ومحتوى مباشر' : '🎬 Direct Lesson',
                                              cls: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                                            }
                                          : actionType === 'CUSTOM_LINK'
                                          ? {
                                              label: isRtl ? '🔗 رابط مخصص' : '🔗 Custom Link',
                                              cls: 'bg-amber-50 text-amber-800 border-amber-200',
                                            }
                                          : {
                                              label: isRtl ? '📅 حصة خاصة / حجز موعد' : '📅 1-on-1 Lesson',
                                              cls: 'bg-blue-50 text-blue-800 border-blue-200',
                                            };

                                      return (
                                        <div
                                          key={item.id || itIdx}
                                          className="p-3.5 rounded-2xl bg-white border border-surface-border hover:border-brand-200 shadow-sm flex flex-col justify-between gap-3 group transition-all"
                                        >
                                          <div className="space-y-1.5">
                                            <div className="flex items-center justify-between flex-wrap gap-1.5">
                                              <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                                                  {isRtl ? item.levelAr : item.level}
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${actionBadge.cls}`}>
                                                  {actionBadge.label}
                                                </span>
                                                {item.isFree ? (
                                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    {isRtl ? 'مجاني' : 'Free'}
                                                  </span>
                                                ) : item.price && item.price > 0 ? (
                                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-navy-900 text-amber-300">
                                                    ${item.price}
                                                  </span>
                                                ) : null}
                                              </div>
                                              {(item.duration || item.lessonsCount) && (
                                                <span className="text-[10px] text-navy-500 font-medium">
                                                  {item.duration && (isRtl ? item.durationAr : item.duration)}
                                                  {item.lessonsCount ? ` • ${item.lessonsCount} ${isRtl ? 'درساً' : 'Lessons'}` : ''}
                                                </span>
                                              )}
                                            </div>

                                            <h4 className="font-bold text-xs text-navy-900 group-hover:text-brand-800 transition-colors">
                                              {isRtl ? item.titleAr : item.title}
                                            </h4>

                                            {(item.descAr || item.desc) && (
                                              <p className="text-[11px] text-navy-600 line-clamp-2 leading-relaxed">
                                                {isRtl ? item.descAr : item.desc}
                                              </p>
                                            )}

                                            {/* Indicators for attached media / linked course */}
                                            {(item.videoUrl || item.fileUrl || item.linkedCourseSlug || item.detailedContentAr) && (
                                              <div className="flex flex-wrap gap-1.5 pt-1">
                                                {item.videoUrl && (
                                                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                                                    ▶ {isRtl ? 'فيديو مرفق' : 'Video'}
                                                  </span>
                                                )}
                                                {item.fileUrl && (
                                                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                                                    📄 {isRtl ? 'ملف PDF' : 'PDF'}
                                                  </span>
                                                )}
                                                {item.linkedCourseSlug && (
                                                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 font-bold">
                                                    🔗 {isRtl ? `مرتبط بدورة: ${item.linkedCourseSlug}` : `Course: ${item.linkedCourseSlug}`}
                                                  </span>
                                                )}
                                                {item.detailedContentAr && (
                                                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                                                    📝 {isRtl ? 'مادة علمية مشروحة' : 'Written Guide'}
                                                  </span>
                                                )}
                                              </div>
                                            )}

                                            {Array.isArray(itemPoints) && itemPoints.length > 0 && (
                                              <div className="flex flex-wrap gap-1 pt-1">
                                                {itemPoints.map((pt, pIdx) => (
                                                  <span
                                                    key={pIdx}
                                                    className="text-[9px] px-1.5 py-0.5 rounded bg-surface-muted border border-surface-borderSubtle text-navy-600 font-medium"
                                                  >
                                                    ✓ {pt}
                                                  </span>
                                                ))}
                                              </div>
                                            )}
                                          </div>

                                          {/* Item Action Buttons */}
                                          <div className="pt-2 border-t border-surface-borderSubtle flex items-center justify-between gap-1.5">
                                            <a
                                              href={unitPreviewUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 transition-colors"
                                            >
                                              <ExternalLink className="w-3 h-3" />
                                              <span>{isRtl ? 'معاينة صفحة الوحدة' : 'Preview Unit Page'}</span>
                                            </a>

                                            <div className="flex items-center gap-1.5">
                                              <button
                                                type="button"
                                                onClick={() => handleOpenEditItemInTrack(service.id, item)}
                                                className="px-2.5 py-1 rounded-lg border border-surface-border bg-surface-muted hover:bg-surface-elevated text-navy-700 text-[10px] font-bold flex items-center gap-1 transition-colors"
                                              >
                                                <Edit3 className="w-3 h-3 text-navy-500" />
                                                <span>{isRtl ? 'تعديل المحتوى والوجهة' : 'Edit Unit & Content'}</span>
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() => handleDeleteTrackItemAction(service.id, item.id)}
                                                className="p-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] transition-colors"
                                                title={isRtl ? 'حذف هذه المرحلة' : 'Delete Stage'}
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="p-4 rounded-xl bg-surface-muted/40 border border-dashed border-surface-border text-center">
                                    <p className="text-xs text-navy-500 mb-2">
                                      {isRtl ? 'لا توجد مراحل مضافة بعد داخل هذا المسار' : 'No curriculum stages defined inside this track.'}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenAddItemToTrack(service.id)}
                                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>{isRtl ? 'إضافة أول مرحلة داخل المسار الآن' : 'Add First Stage'}</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-tab 2: TESTIMONIALS */}
              {cmsSubTab === 'TESTIMONIALS' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-surface-border shadow-card-subtle">
                    <div>
                      <h3 className="font-extrabold text-navy-950 text-sm">
                        {isRtl ? 'شهادات وآراء الطلاب المعتمدة في الواجهة' : 'Homepage Student Testimonials'}
                      </h3>
                      <p className="text-xs text-navy-500">
                        {isRtl ? 'يمكنك إضافة أو حذف تجارب الطلاب الحقيقية المعروضة على الصفحة الرئيسية' : 'Manage student testimonials shown to website visitors'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTestimonialFormData({
                          name: '',
                          location: '',
                          flag: '🌍',
                          focus: 'Quran Memorization & Tajweed',
                          focusAr: 'حفظ القرآن والتجويد',
                          quote: '',
                          quoteAr: '',
                          rating: 5,
                        });
                        setShowTestimonialModal(true);
                        setTimeout(() => {
                          document.getElementById('testimonial-inline-editor')?.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      }}
                      className="px-4 py-2 rounded-xl bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-brand-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isRtl ? 'إضافة رأي طالب جديد' : 'Add Testimonial'}</span>
                    </button>
                  </div>

                  {/* INLINE TESTIMONIAL CREATION FORM (No Popups!) */}
                  {showTestimonialModal && (
                    <div id="testimonial-inline-editor" className="bg-white rounded-3xl border-2 border-brand-300 p-6 space-y-4 shadow-card-hover animate-in fade-in slide-in-from-top-4">
                      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                        <div className="flex items-center gap-2">
                          <Quote className="w-5 h-5 text-brand-700" />
                          <div>
                            <h3 className="font-extrabold text-navy-950 text-sm">
                              {editingTestimonialId
                                ? (isRtl ? 'تعديل رأي الطالب في الصفحة الرئيسية' : 'Edit Student Testimonial')
                                : (isRtl ? 'إضافة رأي طالب جديد في الصفحة الرئيسية' : 'Add Student Testimonial')}
                            </h3>
                            <p className="text-[11px] text-navy-500">
                              {isRtl ? 'نموذج مباشر على نفس الصفحة — ستظهر الشهادة فور الحفظ' : 'Direct inline form — updates homepage reviews immediately'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowTestimonialModal(false);
                            setEditingTestimonialId(null);
                          }}
                          className="px-2.5 py-1 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-elevated text-navy-600 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>{isRtl ? 'إغلاق' : 'Close'}</span>
                        </button>
                      </div>

                      <form onSubmit={handleAddTestimonial} className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold text-navy-700 block mb-1">
                            {isRtl ? 'اسم الطالب' : 'Student Name'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={testimonialFormData.name || ''}
                            onChange={(e) => setTestimonialFormData({ ...testimonialFormData, name: e.target.value })}
                            placeholder="مثال: د. طارق المنصور"
                            className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'الدولة / المدينة' : 'Location'}
                            </label>
                            <input
                              type="text"
                              value={testimonialFormData.location || ''}
                              onChange={(e) => setTestimonialFormData({ ...testimonialFormData, location: e.target.value })}
                              placeholder="London, UK"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'رمز العلم' : 'Flag Emoji'}
                            </label>
                            <input
                              type="text"
                              value={testimonialFormData.flag || '🌍'}
                              onChange={(e) => setTestimonialFormData({ ...testimonialFormData, flag: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-surface-border text-center"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'المسار التعليمي (بالعربية)' : 'Focus Area (Arabic)'}
                            </label>
                            <input
                              type="text"
                              value={testimonialFormData.focusAr || ''}
                              onChange={(e) => setTestimonialFormData({ ...testimonialFormData, focusAr: e.target.value })}
                              placeholder="حفظ القرآن والتجويد"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'التقييم بالنجوم' : 'Rating (Stars)'}
                            </label>
                            <select
                              value={testimonialFormData.rating || 5}
                              onChange={(e) => setTestimonialFormData({ ...testimonialFormData, rating: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl border border-surface-border"
                            >
                              <option value="5">⭐⭐⭐⭐⭐ (5 نجوم)</option>
                              <option value="4">⭐⭐⭐⭐ (4 نجوم)</option>
                              <option value="3">⭐⭐⭐ (3 نجوم)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="font-bold text-navy-700 block mb-1">
                            {isRtl ? 'نص الشهادة ورأي الطالب' : 'Testimonial Quote'} *
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={testimonialFormData.quoteAr || ''}
                            onChange={(e) => setTestimonialFormData({ ...testimonialFormData, quoteAr: e.target.value })}
                            placeholder="تجربة الطالب مع الأستاذة عبير جاد وما حققه من تقدم ملموس..."
                            className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                          />
                        </div>

                        <div className="pt-3 border-t border-surface-borderSubtle flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowTestimonialModal(false);
                              setEditingTestimonialId(null);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-surface-border bg-white text-navy-700 font-bold hover:bg-surface-muted"
                          >
                            {isRtl ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 shadow-sm"
                          >
                            {editingTestimonialId
                              ? (isRtl ? 'حفظ تعديلات الشهادة' : 'Save Changes')
                              : (isRtl ? 'إضافة الشهادة للواجهة' : 'Add Testimonial')}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(settings.testimonials || []).map((t) => (
                      <div
                        key={t.id}
                        className="academy-card p-5 bg-white border border-surface-border rounded-2xl flex flex-col justify-between space-y-4 shadow-card-subtle"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-amber-500">
                              {Array.from({ length: t.rating || 5 }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditTestimonial(t)}
                                className="text-navy-500 hover:text-brand-700 p-1 rounded-lg hover:bg-surface-muted transition-colors"
                                title={isRtl ? 'تعديل الشهادة' : 'Edit'}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTestimonial(t.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                title={isRtl ? 'حذف الشهادة' : 'Delete'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-navy-700 italic leading-relaxed">
                            &ldquo;{isRtl && t.quoteAr ? t.quoteAr : t.quote}&rdquo;
                          </p>
                        </div>

                        <div className="pt-3 border-t border-surface-borderSubtle flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-800 font-bold flex items-center justify-center text-xs">
                            {t.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-navy-950 block">
                              {t.name} {t.flag}
                            </span>
                            <span className="text-[10px] text-navy-500 block">
                              {isRtl ? t.focusAr : t.focus} &bull; {t.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 4: COMMUNICATION & SOCIAL CHANNELS */}
              {cmsSubTab === 'COMMUNICATION' && (
                <div className="space-y-6">
                  {/* Announcement Banner Box */}
                  <div className="academy-card p-6 bg-white border border-surface-border rounded-2xl space-y-4 shadow-card-subtle">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-border">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center border border-gold-200">
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-navy-950 text-sm">
                            {isRtl ? 'شريط الإعلانات العلوي المباشر (Top Announcement Bar)' : 'Top Announcement Banner'}
                          </h4>
                          <p className="text-xs text-navy-500">
                            {isRtl
                              ? 'يظهر في أعلى صفحات الموقع لتنبيه الطلاب بحجز الجلسات أو الدورات'
                              : 'Sticky top announcement bar displayed across all pages'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleTranslateCommunication}
                          disabled={translatingId === 'communication'}
                          className="px-3.5 py-1.5 rounded-xl bg-gold-50 border border-gold-300 hover:bg-gold-100 text-navy-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-60"
                          title={isRtl ? 'ترجمة نصوص الإعلان والفوتر للإنجليزية بضغطة واحدة' : 'Auto-translate announcements and footer to English'}
                        >
                          <Sparkles className={`w-3.5 h-3.5 text-gold-600 ${translatingId === 'communication' ? 'animate-spin' : ''}`} />
                          <span>
                            {translatingId === 'communication'
                              ? (isRtl ? 'جاري الترجمة...' : 'Translating...')
                              : (isRtl ? 'ترجمة الإعلان والفوتر للإنجليزية ✨' : 'Translate Banner & Footer ✨')}
                          </span>
                        </button>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.announcementEnabled}
                            onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'نص الإعلان (بالعربية)' : 'Banner Text (Arabic)'}
                        </label>
                        <input
                          type="text"
                          value={settings.announcementTextAr}
                          onChange={(e) => setSettings({ ...settings, announcementTextAr: e.target.value })}
                          onBlur={() => handleAutoTranslateArabicField('announcementTextAr', settings.announcementTextAr, 'announcementTextEn', (v) => setSettings((p) => ({ ...p, announcementTextEn: v })))}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'نص الإعلان (بالإنجليزية)' : 'Banner Text (English)'}
                        </label>
                        <input
                          type="text"
                          value={settings.announcementTextEn}
                          onChange={(e) => setSettings({ ...settings, announcementTextEn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'رابط الإعلان (عند الضغط)' : 'Action Link URL'}
                        </label>
                        <input
                          type="text"
                          value={settings.announcementLink}
                          onChange={(e) => setSettings({ ...settings, announcementLink: e.target.value })}
                          placeholder="/private-lessons"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-brand-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Official Direct Contact & Support */}
                  <div className="academy-card p-6 bg-white border border-surface-border rounded-2xl space-y-4 shadow-card-subtle">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-surface-border">
                      <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-navy-950 text-sm">
                          {isRtl ? 'قنوات التواصل المباشر والأرقام الرسمية' : 'Official Communication & Direct Support'}
                        </h4>
                        <p className="text-xs text-navy-500">
                          {isRtl
                            ? 'يتم تحديث رقم الواتساب المباشر، الهاتف، البريد، وقنوات التواصل في كافة صفحات الموقع فوراً'
                            : 'Updates official WhatsApp click-to-chat, phone, email, and social links sitewide'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'رقم الواتساب الرسمي (بدون مسافات)' : 'WhatsApp Official Number (e.g. +201000000000)'}
                        </label>
                        <input
                          type="text"
                          value={settings.whatsappNumber}
                          onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono font-bold text-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'رقم الهاتف الرسمي للاتصال' : 'Official Contact Phone'}
                        </label>
                        <input
                          type="text"
                          value={settings.contactPhone || ''}
                          onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                          placeholder="+20 100 000 0000"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-navy-800"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'البريد الإلكتروني للأكاديمية' : 'Official Academy Email'}
                        </label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'رابط قناة التيليجرام' : 'Telegram Channel URL'}
                        </label>
                        <input
                          type="text"
                          value={settings.telegramLink || ''}
                          onChange={(e) => setSettings({ ...settings, telegramLink: e.target.value })}
                          placeholder="https://t.me/AbeerGadAcademy"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-[11px]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'رابط قناة اليوتيوب' : 'YouTube Channel URL'}
                        </label>
                        <input
                          type="text"
                          value={settings.youtubeLink || ''}
                          onChange={(e) => setSettings({ ...settings, youtubeLink: e.target.value })}
                          placeholder="https://youtube.com/@AbeerGadAcademy"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'نص نبذة الأكاديمية في الفوتر (بالعربية)' : 'Footer About (Arabic)'}
                        </label>
                        <textarea
                          rows={3}
                          value={settings.footerAboutAr || ''}
                          onChange={(e) => setSettings({ ...settings, footerAboutAr: e.target.value })}
                          onBlur={() => handleAutoTranslateArabicField('footerAboutAr', settings.footerAboutAr, 'footerAboutEn', (v) => setSettings((p) => ({ ...p, footerAboutEn: v })))}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'نص نبذة الأكاديمية في الفوتر (English)' : 'Footer About (English)'}
                        </label>
                        <textarea
                          rows={3}
                          value={settings.footerAboutEn || ''}
                          onChange={(e) => setSettings({ ...settings, footerAboutEn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PayPal Gateway Settings also included here for convenience */}
                  {renderPayPalSettingsCard()}
                </div>
              )}

              {/* Sub-tab 5: PAYPAL SETTINGS */}
              {cmsSubTab === 'PAYPAL' && (
                <div className="space-y-6">
                  {renderPayPalSettingsCard()}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB: COURSES & DIRECT UPLOAD */}
          {/* ============================================================== */}
          {activeNav === 'COURSES' && (
            <div className="space-y-6">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-surface-border shadow-card-subtle">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-navy-400 absolute start-3 top-3" />
                  <input
                    type="text"
                    placeholder={isRtl ? 'بحث بالاسم أو الرابط...' : 'Search course or slug...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full ps-9 pe-3 py-2 rounded-xl border border-surface-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-navy-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-xs border border-surface-border rounded-xl px-3 py-2 bg-white text-navy-700 focus:outline-none"
                  >
                    <option value="ALL">{isRtl ? 'جميع التصنيفات' : 'All Categories'}</option>
                    <option value="Learn Arabic">{isRtl ? 'تعلم العربية' : 'Learn Arabic'}</option>
                    <option value="Tajweed">{isRtl ? 'التجويد' : 'Tajweed'}</option>
                    <option value="Quran Memorization">{isRtl ? 'حفظ القرآن' : 'Quran Memorization'}</option>
                    <option value="Quran Reading">{isRtl ? 'تلاوة القرآن' : 'Quran Reading'}</option>
                    <option value="Specialized Arabic">{isRtl ? 'العربية التخصصية' : 'Specialized Arabic'}</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleOpenNewCourseModal}
                    className="ms-auto sm:ms-2 px-3 py-2 rounded-xl bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-brand-800 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isRtl ? 'رفع دورة جديدة' : 'Upload Course'}</span>
                  </button>
                </div>
              </div>

              {/* INLINE COURSE CREATION / EDITING FORM (No Popups!) */}
              {showCourseModal && (
                <div id="course-inline-editor" className="bg-white rounded-3xl border-2 border-brand-300 p-6 sm:p-8 space-y-6 shadow-card-hover animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center justify-between pb-4 border-b border-surface-border">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-200 shrink-0">
                        <UploadCloud className="w-5 h-5 text-brand-700" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-navy-950 text-base">
                          {editingCourse
                            ? (isRtl ? 'تعديل بيانات الدورة' : 'Edit Course Details')
                            : (isRtl ? 'رفع دورة تعليمية جديدة للمنصة' : 'Upload New Course to Platform')}
                        </h3>
                        <p className="text-xs text-navy-500">
                          {isRtl ? 'نموذج مباشر على نفس الصفحة — املأ الحقول واضغط حفظ ونشر' : 'Direct inline form — complete details and publish live'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleTranslateCourseForm}
                        disabled={translatingId === 'course'}
                        className="px-3.5 py-1.5 rounded-xl bg-gold-50 border border-gold-300 hover:bg-gold-100 text-navy-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-60"
                        title={isRtl ? 'ترجمة نصوص الدورة العربية إلى الإنجليزية بضغطة زر' : 'Auto-translate course info to English'}
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-gold-600 ${translatingId === 'course' ? 'animate-spin' : ''}`} />
                        <span>
                          {translatingId === 'course'
                            ? (isRtl ? 'جاري الترجمة...' : 'Translating...')
                            : (isRtl ? 'ترجمة بيانات الدورة للإنجليزية ✨' : 'Translate Course ✨')}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowCourseModal(false)}
                        className="px-3 py-1.5 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-elevated text-navy-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>{isRtl ? 'إغلاق النموذج' : 'Close Form'}</span>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'عنوان الدورة (English)' : 'Course Title (English)'}
                        </label>
                        <input
                          type="text"
                          value={courseFormData.title}
                          onChange={(e) => {
                            const t = e.target.value;
                            setCourseFormData({
                              ...courseFormData,
                              title: t,
                              slug: editingCourse ? courseFormData.slug : t.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                            });
                          }}
                          placeholder="e.g. Masterclass in Arabic Phonetics"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'عنوان الدورة (بالعربية)' : 'Course Title (Arabic)'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={courseFormData.titleAr}
                          onChange={(e) => setCourseFormData({ ...courseFormData, titleAr: e.target.value })}
                          onBlur={() => handleAutoTranslateArabicField('titleAr', courseFormData.titleAr, 'titleEn', (v) => setCourseFormData((p) => ({ ...p, title: v, slug: p.slug ? p.slug : v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })))}
                          placeholder="مثال: دورة التأسيس المتقن في علوم التجويد"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'الرابط الدائم (Slug)' : 'URL Slug'}
                        </label>
                        <input
                          type="text"
                          value={courseFormData.slug}
                          onChange={(e) => setCourseFormData({ ...courseFormData, slug: e.target.value })}
                          placeholder="e.g. masterclass-arabic-phonetics"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-brand-700"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'التصنيف' : 'Category'}
                        </label>
                        <select
                          value={courseFormData.category}
                          onChange={(e) => {
                            const cat = e.target.value;
                            let catAr = 'تعلم العربية';
                            if (cat === 'Tajweed') catAr = 'علم التجويد';
                            if (cat === 'Quran Memorization') catAr = 'حفظ القرآن';
                            if (cat === 'Quran Reading') catAr = 'تلاوة القرآن';
                            if (cat === 'Specialized Arabic') catAr = 'العربية التخصصية';
                            setCourseFormData({ ...courseFormData, category: cat, categoryAr: catAr });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        >
                          <option value="Learn Arabic">Learn Arabic (تعلم العربية)</option>
                          <option value="Tajweed">Tajweed (علم التجويد)</option>
                          <option value="Quran Memorization">Quran Memorization (حفظ القرآن)</option>
                          <option value="Quran Reading">Quran Reading (تلاوة القرآن)</option>
                          <option value="Specialized Arabic">Specialized Arabic (العربية التخصصية)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'المستوى' : 'Level'}
                        </label>
                        <select
                          value={courseFormData.level}
                          onChange={(e) => setCourseFormData({ ...courseFormData, level: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        >
                          <option value="Beginner">Beginner (مبتدئ)</option>
                          <option value="Intermediate">Intermediate (متوسط)</option>
                          <option value="Advanced">Advanced (متقدم)</option>
                          <option value="All Levels">All Levels (جميع المستويات)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'سعر الدورة (USD $)' : 'Price ($ USD)'}
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            disabled={courseFormData.isFree}
                            value={courseFormData.isFree ? 0 : courseFormData.price}
                            onChange={(e) => setCourseFormData({ ...courseFormData, price: Number(e.target.value) })}
                            className={`w-full px-3 py-2 rounded-xl border border-surface-border font-bold ${courseFormData.isFree ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                          />
                          <label className="inline-flex items-center gap-1.5 cursor-pointer shrink-0 p-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                            <input
                              type="checkbox"
                              checked={courseFormData.isFree}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setCourseFormData({
                                  ...courseFormData,
                                  isFree: checked,
                                  price: checked ? 0 : (courseFormData.price || 89),
                                });
                              }}
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-[11px] font-extrabold text-emerald-900">
                              {isRtl ? 'دورة مجانية بالكامل' : '100% Free'}
                            </span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'إجمالي الساعات' : 'Total Duration (Hours)'}
                        </label>
                        <input
                          type="number"
                          value={courseFormData.durationHours}
                          onChange={(e) => setCourseFormData({ ...courseFormData, durationHours: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <MediaInputWithChoice
                          label={isRtl ? 'الفيديو الترويجي للدورة (Promo Video)' : 'Course Promo Video'}
                          value={courseFormData.promoVideoUrl}
                          onChange={(url) => setCourseFormData({ ...courseFormData, promoVideoUrl: url })}
                          category="videos"
                          accept="video/*"
                          placeholder="https://www.youtube.com/embed/... أو رفع فيديو من الجهاز"
                          isRtl={isRtl}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <MediaInputWithChoice
                          label={isRtl ? 'صورة غلاف الدورة (Thumbnail)' : 'Course Thumbnail Image'}
                          value={courseFormData.thumbnail}
                          onChange={(url) => setCourseFormData({ ...courseFormData, thumbnail: url })}
                          category="thumbnails"
                          accept="image/*"
                          placeholder="https://images.unsplash.com/... أو رفع صورة من الجهاز"
                          isRtl={isRtl}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'الوصف المختصر (Subtitle)' : 'Subtitle'}
                        </label>
                        <input
                          type="text"
                          value={courseFormData.subtitleAr}
                          onChange={(e) => setCourseFormData({ ...courseFormData, subtitleAr: e.target.value })}
                          onBlur={() => handleAutoTranslateArabicField('subtitleAr', courseFormData.subtitleAr, 'subtitleEn', (v) => setCourseFormData((p) => ({ ...p, subtitle: v })))}
                          placeholder="وصف مختصر وجذاب يظهر أسفل العنوان"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'تفاصيل ومنهج الدورة الكامل' : 'Full Description'}
                        </label>
                        <textarea
                          rows={3}
                          value={courseFormData.descriptionAr}
                          onChange={(e) => setCourseFormData({ ...courseFormData, descriptionAr: e.target.value })}
                          onBlur={() => handleAutoTranslateArabicField('descriptionAr', courseFormData.descriptionAr, 'descriptionEn', (v) => setCourseFormData((p) => ({ ...p, description: v })))}
                          placeholder="اكتب هنا أهداف الدورة وما سيتعلمه الطالب بالتفصيل..."
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={courseFormData.isPublished}
                            onChange={(e) => setCourseFormData({ ...courseFormData, isPublished: e.target.checked })}
                            className="rounded text-brand-700"
                          />
                          <span className="font-bold text-navy-800">
                            {isRtl ? 'نشر فوري على الموقع للطلاب' : 'Publish live immediately'}
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={courseFormData.featured}
                            onChange={(e) => setCourseFormData({ ...courseFormData, featured: e.target.checked })}
                            className="rounded text-brand-700"
                          />
                          <span className="font-bold text-navy-800">
                            {isRtl ? 'إبراز في الصفحة الرئيسية' : 'Feature on homepage'}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCourseModal(false)}
                        className="px-4 py-2 rounded-xl border border-surface-border bg-white text-navy-700 font-bold hover:bg-surface-muted"
                      >
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 shadow-card-subtle flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>{editingCourse ? (isRtl ? 'حفظ التعديلات' : 'Save Changes') : (isRtl ? 'رفع ونشر الدورة' : 'Upload & Publish')}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const totalLessons = course.chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0);
                  return (
                    <div
                      key={course.id}
                      className="academy-card bg-white border border-surface-border rounded-2xl overflow-hidden flex flex-col justify-between hover:border-brand-200 transition-all shadow-card-subtle"
                    >
                      <div>
                        {/* Course Header Thumbnail */}
                        <div className="relative aspect-video bg-navy-950 overflow-hidden group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                          />
                          <div className="absolute top-3 end-3 flex items-center gap-1.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${
                                course.isPublished
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-navy-700 text-navy-200'
                              }`}
                            >
                              {course.isPublished ? (isRtl ? 'منشور نشط' : 'Published') : (isRtl ? 'مسودة' : 'Draft')}
                            </span>
                          </div>
                          <div className="absolute bottom-3 start-3">
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-navy-900/80 backdrop-blur-sm text-gold-300 border border-gold-500/20">
                              {isRtl ? course.categoryAr || course.category : course.category}
                            </span>
                          </div>
                        </div>

                        {/* Course Body */}
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between text-xs text-navy-500">
                            <span>{course.level}</span>
                            <span className="font-extrabold text-brand-700 text-sm">
                              {formatCurrency(course.price)}
                            </span>
                          </div>

                          <h3 className="font-black text-navy-950 text-base leading-snug line-clamp-2">
                            {isRtl && course.titleAr ? course.titleAr : course.title}
                          </h3>

                          <p className="text-xs text-navy-600 line-clamp-2 leading-relaxed">
                            {isRtl && course.subtitleAr ? course.subtitleAr : course.subtitle}
                          </p>

                          <div className="pt-2 border-t border-surface-borderSubtle flex items-center justify-between text-[11px] text-navy-500">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5 text-navy-400" />
                              <span>{course.chapters.length} {isRtl ? 'فصول' : 'Chapters'}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Video className="w-3.5 h-3.5 text-navy-400" />
                              <span>{totalLessons} {isRtl ? 'دروس فيديو' : 'Lessons'}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-navy-400" />
                              <span>{course.studentsCount} {isRtl ? 'طالب' : 'Students'}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Course Action Buttons */}
                      <div className="p-4 bg-surface-muted border-t border-surface-border flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedCourseForCurriculum?.id === course.id) {
                              setSelectedCourseForCurriculum(null);
                            } else {
                              setSelectedCourseForCurriculum(course);
                              setTargetChapterId(course.chapters[0]?.id || '');
                              setTimeout(() => {
                                document.getElementById('course-curriculum-editor')?.scrollIntoView({ behavior: 'smooth' });
                              }, 50);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                            selectedCourseForCurriculum?.id === course.id
                              ? 'bg-brand-700 text-white border-brand-800 shadow-sm'
                              : 'bg-brand-50 hover:bg-brand-100 text-brand-800 border-brand-200'
                          }`}
                          title={isRtl ? 'إدارة المنهج والدروس والفيديوهات' : 'Manage Curriculum & Videos'}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'المنهج والفيديوهات' : 'Curriculum'}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <a
                            href={`/${currentLocale}/courses/${course.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-navy-600 hover:text-brand-700 hover:bg-white transition-colors"
                            title={isRtl ? 'معاينة مباشرة على الموقع' : 'Preview Live'}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleToggleCoursePublish(course.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              course.isPublished
                                ? 'text-emerald-700 hover:bg-emerald-50'
                                : 'text-navy-400 hover:bg-navy-100'
                            }`}
                            title={course.isPublished ? (isRtl ? 'إلغاء النشر' : 'Unpublish') : (isRtl ? 'نشر فوري' : 'Publish')}
                          >
                            {course.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditCourseModal(course)}
                            className="p-1.5 rounded-lg text-navy-600 hover:text-navy-950 hover:bg-white transition-colors"
                            title={isRtl ? 'تعديل البيانات' : 'Edit Info'}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title={isRtl ? 'حذف الدورة' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INLINE CURRICULUM & LESSONS MANAGER */}
              {selectedCourseForCurriculum && (
                <div
                  id="course-curriculum-editor"
                  className="mt-8 pt-6 border-t-2 border-brand-200 space-y-6 animate-in fade-in duration-200"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-surface-border shadow-card-subtle">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center font-bold">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black text-navy-950 text-sm sm:text-base">
                            {isRtl ? 'منهج وفيديوهات دورة:' : 'Curriculum & Video Lessons for:'}
                          </h3>
                          <span className="px-3 py-1 rounded-xl text-xs font-black bg-brand-700 text-white">
                            {isRtl && selectedCourseForCurriculum.titleAr
                              ? selectedCourseForCurriculum.titleAr
                              : selectedCourseForCurriculum.title}
                          </span>
                        </div>
                        <p className="text-xs text-navy-500 mt-0.5">
                          {isRtl
                            ? 'إضافة وتعديل فصول الدورة، روابط فيديوهات المشاهدة، والدروس المجانية المتاحة للمعاينة'
                            : 'Add & edit chapters, video URLs, and free previews'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCourseForCurriculum(null)}
                      className="px-3.5 py-1.5 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-elevated text-navy-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>{isRtl ? 'إغلاق محرر المنهج' : 'Close Curriculum Editor'}</span>
                    </button>
                  </div>

                  {/* Chapters List */}
                  <div className="space-y-4">
                    {selectedCourseForCurriculum.chapters.map((chapter, chIdx) => (
                      <div
                        key={chapter.id}
                        className="p-5 rounded-2xl bg-white border border-surface-border space-y-4 shadow-card-subtle"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-surface-borderSubtle">
                          <span className="font-black text-sm text-navy-950 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs flex items-center justify-center">
                              {chIdx + 1}
                            </span>
                            <span>{isRtl && chapter.titleAr ? chapter.titleAr : chapter.title}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDeleteChapter(chapter.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'حذف الفصل' : 'Delete Chapter'}</span>
                          </button>
                        </div>

                        {/* Lessons inside chapter */}
                        <div className="space-y-2 ps-3 border-s-2 border-brand-200">
                          {chapter.lessons && chapter.lessons.length > 0 ? (
                            chapter.lessons.map((les, lIdx) => (
                              <div
                                key={les.id}
                                className="p-3 rounded-xl bg-surface-muted/60 border border-surface-border flex items-center justify-between text-xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Play className="w-4 h-4 text-brand-600 shrink-0" />
                                  <span className="font-bold text-navy-900">
                                    {lIdx + 1}. {isRtl && les.titleAr ? les.titleAr : les.title}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleLessonPreview(chapter.id, les.id)}
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                                      les.isFree
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 shadow-sm'
                                        : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-emerald-50 hover:text-emerald-800'
                                    }`}
                                    title={isRtl ? 'انقر للتبديل بين المعاينة المجانية والمدفوع' : 'Click to toggle preview'}
                                  >
                                    <span>{les.isFree ? '✓' : '🔒'}</span>
                                    <span>{les.isFree ? (isRtl ? 'معاينة مجانية للطلاب' : 'Free Preview') : (isRtl ? 'مدفوع (انقر لجعله مجانياً)' : 'Paid (Make Preview)')}</span>
                                  </button>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="text-navy-400 text-[11px] font-mono">{les.duration}</span>
                                  <a
                                    href={les.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-brand-700 hover:underline font-mono text-[10px]"
                                  >
                                    {isRtl ? 'معاينة' : 'Play'}
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLesson(chapter.id, les.id)}
                                    className="text-red-400 hover:text-red-600"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-navy-400 italic">
                              {isRtl ? 'لا توجد دروس في هذا الفصل بعد' : 'No lessons added yet.'}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Lesson Form */}
                  <div className="p-5 rounded-2xl bg-white border border-brand-200 space-y-4 shadow-card-subtle">
                    <h4 className="font-extrabold text-sm text-navy-950 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-brand-700" />
                      <span>{isRtl ? 'إضافة درس فيديو جديد لهذا المنهج:' : 'Add New Video Lesson:'}</span>
                    </h4>

                    <form onSubmit={handleAddLesson} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'اختر الفصل' : 'Target Chapter'}
                        </label>
                        <select
                          value={targetChapterId}
                          onChange={(e) => setTargetChapterId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white"
                        >
                          {selectedCourseForCurriculum.chapters.map((ch) => (
                            <option key={ch.id} value={ch.id}>
                              {ch.titleAr || ch.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'عنوان الدرس (بالعربية)' : 'Lesson Title (Arabic)'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={newLessonTitleAr}
                          onChange={(e) => {
                            setNewLessonTitleAr(e.target.value);
                          }}
                          onBlur={() => handleAutoTranslateArabicField('titleAr', newLessonTitleAr, 'titleEn', (v) => setNewLessonTitle(v))}
                          placeholder={isRtl ? 'مثال: الدرس الثاني: مخارج اللسان' : 'Arabic title...'}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <MediaInputWithChoice
                          label={isRtl ? 'فيديو الدرس (YouTube, Vimeo, أو رفع MP4 على السيرفر)' : 'Lesson Video URL / Upload'}
                          value={newLessonVideoUrl}
                          onChange={(url) => setNewLessonVideoUrl(url)}
                          category="videos"
                          accept="video/*"
                          placeholder="https://www.youtube.com/embed/... أو رفع ملف فيديو من جهازك"
                          isRtl={isRtl}
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'المدة الزمنية' : 'Duration (e.g. 35m)'}
                        </label>
                        <input
                          type="text"
                          value={newLessonDuration}
                          onChange={(e) => setNewLessonDuration(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-5">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newLessonIsFree}
                            onChange={(e) => setNewLessonIsFree(e.target.checked)}
                            className="rounded text-brand-700"
                          />
                          <span className="font-bold text-navy-800">
                            {isRtl ? 'معاينة مجانية للجميع' : 'Free Preview'}
                          </span>
                        </label>
                      </div>

                      <div className="sm:col-span-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{isRtl ? 'إضافة الدرس للمنهج' : 'Add Lesson to Course'}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Add New Chapter Form */}
                  <div className="p-4 rounded-2xl bg-white border border-surface-border space-y-3">
                    <h4 className="font-extrabold text-xs text-navy-950 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-brand-700" />
                      <span>{isRtl ? 'إضافة فصل أو وحدة جديدة إلى المنهج:' : 'Add New Chapter to Course:'}</span>
                    </h4>
                    <form onSubmit={handleAddChapter} className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newChapterTitleAr}
                        onChange={(e) => {
                          setNewChapterTitleAr(e.target.value);
                        }}
                        onBlur={() => handleAutoTranslateArabicField('titleAr', newChapterTitleAr, 'titleEn', (v) => setNewChapterTitle(v))}
                        placeholder={isRtl ? 'عنوان الفصل الجديد...' : 'New chapter title...'}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-surface-border bg-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-950"
                      >
                        {isRtl ? 'إضافة فصل' : 'Add Chapter'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}



          {/* ============================================================== */}
          {/* TAB: 1-ON-1 SLOTS */}
          {/* ============================================================== */}
          {activeNav === 'SLOTS' && (() => {
            const adminYear = adminCalendarMonth.getFullYear();
            const adminMonth = adminCalendarMonth.getMonth();
            const adminDaysInMonth = new Date(adminYear, adminMonth + 1, 0).getDate();
            const adminFirstDayIndex = new Date(adminYear, adminMonth, 1).getDay();
            const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
            const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const daysOfWeekAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
            const daysOfWeekEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            const displayedSlots = adminSelectedFilterDate
              ? slots.filter((s) => s.date === adminSelectedFilterDate)
              : slots;

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-surface-border shadow-card-subtle">
                  <div>
                    <h3 className="text-sm font-extrabold text-navy-950 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-700" />
                      <span>{isRtl ? 'تقويم مواعيد الدروس الفردية المباشرة (1-on-1 Sessions)' : 'Private Lesson Slots & Calendar'}</span>
                    </h3>
                    <p className="text-xs text-navy-500">
                      {isRtl ? 'حدد الأيام الشاغرة في التقويم، أضف مواعيد جديدة، أو تابع بيانات المتدربين المسجلين' : 'Manage available calendar dates, add time slots, and view booked students'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {adminSelectedFilterDate && (
                      <button
                        type="button"
                        onClick={() => setAdminSelectedFilterDate(null)}
                        className="px-3 py-1.5 rounded-xl border border-surface-border bg-white text-navy-700 text-xs font-bold hover:bg-surface-muted"
                      >
                        {isRtl ? 'إلغاء فلتر اليوم' : 'Show All Days'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSlotModal(true);
                        setTimeout(() => {
                          document.getElementById('slot-inline-editor')?.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-brand-800 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isRtl ? 'إضافة موعد جديد' : 'Add Slot'}</span>
                    </button>
                  </div>
                </div>

                {/* ========================================================== */}
                {/* TIME-BASED DYNAMIC PRICING CONFIGURATION CARD */}
                {/* ========================================================== */}
                <div className="bg-gradient-to-r from-amber-50/80 via-white to-indigo-50/80 rounded-3xl border border-surface-border p-5 sm:p-6 shadow-card-subtle space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="badge-gold text-[10px] mb-1 inline-flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-brand-700" />
                        <span>{isRtl ? 'نظام التسعير الزمني الذكي للحصص الفردية' : 'Dynamic Time-Based Slot Pricing'}</span>
                      </span>
                      <h4 className="font-extrabold text-base text-navy-950 flex items-center gap-2">
                        <span>{isRtl ? 'تحديد أسعار الحصص حسب توقيت الجلسة (صباحي / مسائي)' : 'Configure Day & Night Lesson Rates'}</span>
                      </h4>
                      <p className="text-xs text-navy-500">
                        {isRtl
                          ? 'يمكنك تعديل أسعار الفترات في أي وقت وتطبيقها فوراً بنقرة واحدة على كافة المواعيد الحالية والجديدة'
                          : 'Define automated rates for daytime and nighttime slots, editable anytime by the administrator'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleApplySlotPricingToAll}
                        disabled={applyingPricing}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-surface-muted border border-surface-border text-navy-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        title={isRtl ? 'تحديث أسعار كافة المواعيد المتاحة حالياً وفقاً لهذه الأسعار' : 'Apply rates to all existing slots'}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-brand-700 ${applyingPricing ? 'animate-spin' : ''}`} />
                        <span>{applyingPricing ? (isRtl ? 'جاري التطبيق...' : 'Applying...') : (isRtl ? 'تطبيق على كافة المواعيد' : 'Apply to All Slots')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSlotPricing}
                        disabled={savingPricing}
                        className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{savingPricing ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ الأسعار' : 'Save Rates')}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2 Interactive Period Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* DAYTIME CARD */}
                    <div className="p-4 rounded-2xl bg-white/90 border border-amber-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">☀️</span>
                          <div>
                            <h5 className="font-extrabold text-xs text-navy-950">
                              {isRtl ? 'الفترة الصباحية / النهارية' : 'Daytime Window'}
                            </h5>
                            <span className="text-[11px] font-mono text-amber-700 font-semibold block">
                              {isRtl ? 'من 10:00 صباحاً حتى 10:00 مساءً (10:00 - 22:00)' : '10:00 AM - 10:00 PM'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                          {isRtl ? '12 ساعة نهارية' : '12 Hours Day'}
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-navy-700 block mb-1">
                          {isRtl ? 'سعر الحصة الصباحية ($ USD)' : 'Daytime Lesson Rate ($ USD)'}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={slotPricingForm.dayPrice}
                            onChange={(e) => setSlotPricingForm({ ...slotPricingForm, dayPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 ps-8 rounded-xl border border-surface-border text-xs font-mono font-bold text-navy-900 focus:ring-2 focus:ring-brand-500/20"
                          />
                          <span className="absolute start-3 top-2 font-mono font-bold text-navy-400 text-xs">$</span>
                        </div>
                        <span className="text-[10px] text-navy-400 mt-1 block">
                          {isRtl ? 'السعر التلقائي للحصص بين 10:00 ص و 10:00 م' : 'Applied to slots between 10:00 AM & 10:00 PM'}
                        </span>
                      </div>
                    </div>

                    {/* NIGHTTIME CARD */}
                    <div className="p-4 rounded-2xl bg-white/90 border border-indigo-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🌙</span>
                          <div>
                            <h5 className="font-extrabold text-xs text-navy-950">
                              {isRtl ? 'الفترة المسائية / الليلية' : 'Nighttime Window'}
                            </h5>
                            <span className="text-[11px] font-mono text-indigo-700 font-semibold block">
                              {isRtl ? 'من 10:00 مساءً حتى 10:00 صباحاً (22:00 - 10:00)' : '10:00 PM - 10:00 AM'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                          {isRtl ? '12 ساعة ليلية' : '12 Hours Night'}
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-navy-700 block mb-1">
                          {isRtl ? 'سعر الحصة المسائية/الليلية ($ USD)' : 'Nighttime Lesson Rate ($ USD)'}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={slotPricingForm.nightPrice}
                            onChange={(e) => setSlotPricingForm({ ...slotPricingForm, nightPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 ps-8 rounded-xl border border-surface-border text-xs font-mono font-bold text-navy-900 focus:ring-2 focus:ring-brand-500/20"
                          />
                          <span className="absolute start-3 top-2 font-mono font-bold text-navy-400 text-xs">$</span>
                        </div>
                        <span className="text-[10px] text-navy-400 mt-1 block">
                          {isRtl ? 'السعر التلقائي للحصص بين 10:00 م و 10:00 ص' : 'Applied to slots between 10:00 PM & 10:00 AM'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================================== */}
                {/* INTERACTIVE ADMIN MONTH CALENDAR (BLOCK / UNBLOCK DAYS) */}
                {/* ========================================================== */}
                <div className="bg-white rounded-3xl border border-surface-border p-6 shadow-card-subtle space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="badge-light text-[10px] mb-1 inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-brand-700" />
                        <span>
                          {isRtl
                            ? 'نظام الإتاحة التلقائية وتحديد الأيام المحجوزة'
                            : 'Open Calendar & Blocked Days Manager'}
                        </span>
                      </span>
                      <h4 className="font-extrabold text-base text-navy-950">
                        {isRtl ? monthNamesAr[adminMonth] : monthNamesEn[adminMonth]} {adminYear}
                      </h4>
                      <p className="text-xs text-navy-600 mt-1">
                        {isRtl
                          ? '💡 جميع الأيام والساعات متاحة للطلاب تلقائياً — اضغط على أي يوم في التقويم بالأسفل لتحديده كـ (يوم محجوز / مغلق) أو لإعادة فتحه للطلاب فوراً.'
                          : '💡 All days and hours are open to students by default — click any day below to mark it as (Busy / Fully Booked) or click again to reopen it.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setAdminCalendarMonth(new Date(adminYear, adminMonth - 1, 1))}
                        className="w-8 h-8 rounded-xl border border-surface-border hover:bg-surface-muted flex items-center justify-center text-navy-700"
                        title={isRtl ? 'الشهر السابق' : 'Prev Month'}
                      >
                        <ChevronRight className="w-4 h-4 ltr:rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminCalendarMonth(new Date(adminYear, adminMonth + 1, 1))}
                        className="w-8 h-8 rounded-xl border border-surface-border hover:bg-surface-muted flex items-center justify-center text-navy-700"
                        title={isRtl ? 'الشهر التالي' : 'Next Month'}
                      >
                        <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
                      </button>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-4 text-xs bg-surface-muted/50 p-3 rounded-2xl border border-surface-border">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 inline-block" />
                      <span className="font-bold text-navy-800">
                        {isRtl ? 'يوم متاح تلقائياً للطلاب (اضغط لقفل اليوم)' : 'Open Day (Click to block)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-md bg-red-500 inline-block" />
                      <span className="font-bold text-red-700">
                        {isRtl ? 'يوم محجوز بالكامل / غير متاح (اضغط لإعادة فتحه)' : 'Blocked Day (Click to reopen)'}
                      </span>
                    </div>
                  </div>

                  {/* Days of Week */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {(isRtl ? daysOfWeekAr : daysOfWeekEn).map((d) => (
                      <div key={d} className="py-1 text-[11px] font-extrabold text-navy-400 uppercase">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid: Click any day to toggle Blocked / Available */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {Array.from({ length: adminFirstDayIndex }).map((_, i) => (
                      <div key={`admin-empty-${i}`} className="aspect-square rounded-2xl bg-gray-50/40" />
                    ))}

                    {Array.from({ length: adminDaysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateStr = `${adminYear}-${(adminMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
                      const daySlots = slots.filter((s) => s.date === dateStr);
                      const bookedCount = daySlots.filter((s) => s.status === 'BOOKED').length;
                      const isBlocked = blockedDates.includes(dateStr);

                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={() => handleToggleBlockedDate(dateStr)}
                          className={`aspect-square p-1.5 sm:p-2 rounded-2xl border text-center transition-all flex flex-col justify-between items-center relative ${
                            isBlocked
                              ? 'border-red-300 bg-red-50 hover:bg-red-100/80 text-red-900 shadow-sm'
                              : 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-navy-900'
                          }`}
                          title={
                            isBlocked
                              ? isRtl
                                ? 'هذا اليوم محجوز بالكامل — اضغط لإتاحته للطلاب'
                                : 'Blocked Day — Click to open'
                              : isRtl
                              ? 'هذا اليوم متاح للطلاب — اضغط لتحديده كمحجوز'
                              : 'Open Day — Click to mark as booked'
                          }
                        >
                          <span
                            className={`text-xs sm:text-sm font-extrabold ${
                              isBlocked ? 'text-red-700 line-through' : 'text-navy-950'
                            }`}
                          >
                            {dayNum}
                          </span>

                          <div className="flex flex-col gap-0.5 w-full items-center">
                            {isBlocked ? (
                              <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full font-extrabold bg-red-600 text-white w-full truncate">
                                {isRtl ? '🔒 محجوز' : '🔒 Busy'}
                              </span>
                            ) : (
                              <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full font-extrabold bg-emerald-600 text-white w-full truncate">
                                {isRtl ? '✓ متاح' : '✓ Open'}
                              </span>
                            )}
                            {bookedCount > 0 && (
                              <span className="text-[8px] px-1 py-0.2 rounded-full font-extrabold bg-amber-100 text-amber-900 w-full truncate">
                                {bookedCount} {isRtl ? 'حصة' : 'booked'}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Summary of Blocked Dates */}
                  <div className="p-4 rounded-2xl bg-surface-muted/60 border border-surface-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-navy-900">
                        {isRtl
                          ? `الأيام المحددة كـ (محجوزة بالكامل / غير متاحة للطلاب): (${blockedDates.length})`
                          : `Currently Blocked Dates: (${blockedDates.length})`}
                      </span>
                      {blockedDates.length > 0 && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (
                              !confirm(
                                isRtl
                                  ? 'هل تريد إلغاء حجز جميع الأيام وفتح كافة الأيام للطلاب؟'
                                  : 'Unblock all dates and open all days?'
                              )
                            )
                              return;
                            const res = await fetch('/api/admin/slots', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action: 'set-blocked-dates', blockedDates: [] }),
                            });
                            const data = await res.json();
                            if (data.success) {
                              setBlockedDates([]);
                              setSettings((prev) => ({ ...prev, blockedDates: [] }));
                              triggerToast(isRtl ? 'تم فتح كافة الأيام للطلاب' : 'All days opened');
                            }
                          }}
                          className="text-[11px] font-bold text-emerald-700 hover:underline"
                        >
                          {isRtl ? 'فتح كافة الأيام بضغطة واحدة' : 'Open All Days'}
                        </button>
                      )}
                    </div>
                    {blockedDates.length === 0 ? (
                      <p className="text-xs text-emerald-800 font-semibold">
                        {isRtl
                          ? '✅ لا توجد أيام مقفلة حالياً — جميع الأيام متاحة للطلاب للحجز في أي وقت مع الحساب التلقائي للسعر.'
                          : '✅ No blocked dates — all days are open for students with automatic time-based pricing.'}
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {blockedDates.map((dStr) => (
                          <span
                            key={dStr}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-mono font-bold"
                          >
                            <span>🔒 {dStr}</span>
                            <button
                              type="button"
                              onClick={() => handleToggleBlockedDate(dStr)}
                              className="hover:text-red-950 font-black"
                              title={isRtl ? 'إلغاء قفل هذا اليوم' : 'Unblock this date'}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* INLINE SLOT CREATION FORM (No Popups!) */}
                {showSlotModal && (
                  <div id="slot-inline-editor" className="bg-white rounded-3xl border-2 border-brand-300 p-6 space-y-4 shadow-card-hover animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-brand-700" />
                        <div>
                          <h3 className="font-extrabold text-navy-950 text-sm">
                            {isRtl ? 'إضافة موعد شاغر لدرس فردي مباشر (1-on-1)' : 'Add Private 1-on-1 Lesson Slot'}
                          </h3>
                          <p className="text-[11px] text-navy-500">
                            {isRtl ? 'نموذج مباشر على نفس الصفحة — سيظهر الموعد فوراً للطلاب في التقويم' : 'Direct inline form — updates available calendar immediately'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSlotModal(false)}
                        className="px-2.5 py-1 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-elevated text-navy-600 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>{isRtl ? 'إغلاق' : 'Close'}</span>
                      </button>
                    </div>

                    <form onSubmit={handleSaveSlot} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-navy-700 block mb-1">{isRtl ? 'التاريخ' : 'Date'} *</label>
                          <input
                            type="date"
                            required
                            value={slotFormData.date}
                            onChange={(e) => setSlotFormData({ ...slotFormData, date: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-surface-border"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-navy-700 block mb-1">{isRtl ? 'الوقت والتوقيت' : 'Time'} *</label>
                          <input
                            type="text"
                            required
                            value={slotFormData.time}
                            onChange={(e) => {
                              const newTime = e.target.value;
                              const calc = calculateSlotPrice(newTime, slotPricingForm);
                              setSlotFormData({ ...slotFormData, time: newTime, price: calc.price });
                            }}
                            placeholder="e.g. 10:00 AM UTC"
                            className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono"
                          />
                          {/* Quick Time Preset Chips */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {[
                              { label: '☀️ 10:00 ص', time: '10:00 AM UTC' },
                              { label: '☀️ 02:00 م', time: '02:00 PM UTC' },
                              { label: '☀️ 06:00 م', time: '06:00 PM UTC' },
                              { label: '☀️ 09:00 م', time: '09:00 PM UTC' },
                              { label: '🌙 10:00 م', time: '10:00 PM UTC' },
                              { label: '🌙 11:30 م', time: '11:30 PM UTC' },
                              { label: '🌙 02:00 ص', time: '02:00 AM UTC' },
                            ].map((preset) => (
                              <button
                                key={preset.time}
                                type="button"
                                onClick={() => {
                                  const calc = calculateSlotPrice(preset.time, slotPricingForm);
                                  setSlotFormData({ ...slotFormData, time: preset.time, price: calc.price });
                                }}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-surface-muted hover:bg-brand-50 hover:text-brand-800 border border-surface-borderSubtle font-mono"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-navy-700 block mb-1">{isRtl ? 'المعلمة' : 'Instructor'}</label>
                          <input
                            type="text"
                            value={slotFormData.instructor}
                            onChange={(e) => setSlotFormData({ ...slotFormData, instructor: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-navy-700 block">{isRtl ? 'السعر ($ USD)' : 'Price ($ USD)'}</label>
                            {(() => {
                              const calc = calculateSlotPrice(slotFormData.time, slotPricingForm);
                              return (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 ${
                                  calc.isDay ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                }`}>
                                  {calc.icon} {isRtl ? (calc.isDay ? `سعر نهاري ($${slotPricingForm.dayPrice})` : `سعر ليلي ($${slotPricingForm.nightPrice})`) : (calc.isDay ? `Day ($${slotPricingForm.dayPrice})` : `Night ($${slotPricingForm.nightPrice})`)}
                                </span>
                              );
                            })()}
                          </div>
                          <input
                            type="number"
                            value={slotFormData.price}
                            onChange={(e) => setSlotFormData({ ...slotFormData, price: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl border border-surface-border font-bold font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">{isRtl ? 'رابط الجلسة المباشر (Google Meet / Zoom)' : 'Meeting Link'}</label>
                        <input
                          type="text"
                          value={slotFormData.meetingUrl}
                          onChange={(e) => setSlotFormData({ ...slotFormData, meetingUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-[11px]"
                        />
                      </div>

                      <div className="pt-3 border-t border-surface-borderSubtle flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowSlotModal(false)}
                          className="px-3 py-1.5 rounded-xl border border-surface-border bg-white text-navy-700 font-bold hover:bg-surface-muted"
                        >
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 shadow-sm"
                        >
                          {isRtl ? 'حفظ ونشر الموعد' : 'Save Slot'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {displayedSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="academy-card p-5 bg-white border border-surface-border rounded-2xl space-y-3 shadow-card-subtle hover:border-brand-300 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-navy-700 font-mono">{slot.date}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            slot.status === 'AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {slot.status === 'AVAILABLE' ? (isRtl ? 'متاح للحجز' : 'Available') : (isRtl ? 'محجوز' : 'Booked')}
                        </span>
                      </div>

                      <div className="text-sm font-black text-navy-950 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-brand-600" />
                        <span className="font-mono">{slot.time}</span>
                      </div>

                      <div className="text-xs text-navy-600">
                        <span className="text-navy-400 block">{isRtl ? 'المعلمة:' : 'Instructor:'}</span>
                        <span className="font-semibold">{slot.instructor}</span>
                      </div>

                      {/* Booked Student Info including Phone */}
                      {slot.studentName && (
                        <div className="p-2.5 rounded-xl bg-surface-muted text-xs text-navy-700 border border-surface-border space-y-1">
                          <span className="text-navy-400 block text-[10px] font-bold uppercase">{isRtl ? 'المتدرب المسجل:' : 'Enrolled Trainee:'}</span>
                          <span className="font-bold text-navy-900 block">{slot.studentName}</span>
                          {slot.studentEmail && <span className="block text-[11px] font-mono text-navy-600 truncate">{slot.studentEmail}</span>}
                          {slot.studentPhone && (
                            <span className="block text-[11px] font-mono text-emerald-700 font-bold">
                              📞 {slot.studentPhone}
                            </span>
                          )}
                          {slot.notes && (
                            <span className="block text-[10px] text-navy-500 italic line-clamp-2">
                              {slot.notes}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-brand-700 text-sm">
                            {formatCurrency(slot.price)}
                          </span>
                          {(() => {
                            const pInfo = calculateSlotPrice(slot.time, slotPricingForm);
                            return (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                pInfo.isDay ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              }`}>
                                {pInfo.icon} {isRtl ? (pInfo.isDay ? 'نهاري' : 'ليلي') : (pInfo.isDay ? 'Day' : 'Night')}
                              </span>
                            );
                          })()}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleSlot(slot.id)}
                            className="px-2 py-1 rounded-lg text-xs font-semibold bg-surface-muted hover:bg-surface-elevated text-navy-700 transition-colors"
                          >
                            {slot.status === 'AVAILABLE' ? (isRtl ? 'حجز يدوي' : 'Book') : (isRtl ? 'إتاحة' : 'Free up')}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ============================================================== */}
          {/* TAB: DIGITAL LIBRARY */}
          {/* ============================================================== */}
          {activeNav === 'RESOURCES' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-surface-border shadow-card-subtle">
                <div>
                  <h3 className="text-sm font-bold text-navy-950">
                    {isRtl ? 'إدارة المكتبة الرقمية والملفات التعليمية' : 'Digital Educational Library Files'}
                  </h3>
                  <p className="text-xs text-navy-500">
                    {isRtl ? 'إضافة ملفات PDF ومخططات التجويد والملفات الصوتية للطلاب' : 'Upload downloadable charts, tables, and audio guides'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowResourceModal(true);
                    setTimeout(() => {
                      document.getElementById('resource-inline-editor')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="px-3 py-2 rounded-xl bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-brand-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isRtl ? 'إضافة ملف للمكتبة' : 'Add Resource'}</span>
                </button>
              </div>

              {/* INLINE RESOURCE CREATION FORM (No Popups!) */}
              {showResourceModal && (
                <div id="resource-inline-editor" className="bg-white rounded-3xl border-2 border-brand-300 p-6 space-y-4 shadow-card-hover animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-brand-700" />
                      <div>
                        <h3 className="font-extrabold text-navy-950 text-sm">
                          {isRtl ? 'إضافة ملف جديد للمكتبة الرقمية' : 'Add New Library Resource'}
                        </h3>
                        <p className="text-[11px] text-navy-500">
                          {isRtl ? 'نموذج مباشر على نفس الصفحة — سيتاح الملف فوراً للتحميل للطلاب' : 'Direct inline form — file becomes available for download immediately'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowResourceModal(false)}
                      className="px-2.5 py-1 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-elevated text-navy-600 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>{isRtl ? 'إغلاق' : 'Close'}</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveResource} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'عنوان الملف (English)' : 'Title (English)'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={resourceFormData.title}
                          onChange={(e) => setResourceFormData({ ...resourceFormData, title: e.target.value })}
                          placeholder="e.g. Tajweed Mastery Cheat Sheet"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'عنوان الملف (بالعربية)' : 'Title (Arabic)'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={resourceFormData.titleAr}
                          onChange={(e) => setResourceFormData({ ...resourceFormData, titleAr: e.target.value })}
                          placeholder="مثال: جدول مخارج الحروف وصفاتها"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'التصنيف' : 'Category'}
                        </label>
                        <select
                          value={resourceFormData.category}
                          onChange={(e) => setResourceFormData({ ...resourceFormData, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        >
                          <option value="Tajweed">Tajweed (التجويد)</option>
                          <option value="Arabic Grammar">Arabic Grammar (النحو والصرف)</option>
                          <option value="Quran Memorization">Quran Memorization (جداول الحفظ)</option>
                          <option value="Audio Guide">Audio Guide (ملفات صوتية)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <MediaInputWithChoice
                          label={isRtl ? 'ملف المادة العلمية (رفع من الجهاز للسيرفر أو وضع رابط)' : 'Resource File (Upload or External Link)'}
                          value={resourceFormData.fileUrl}
                          onChange={(url, meta) =>
                            setResourceFormData({
                              ...resourceFormData,
                              fileUrl: url,
                              fileSizeMb: meta?.sizeMb || resourceFormData.fileSizeMb,
                              fileType: meta?.fileType || resourceFormData.fileType,
                            })
                          }
                          category="resources"
                          accept=".pdf,.doc,.docx,.zip,.mp3"
                          placeholder="/downloads/tajweed-guide.pdf أو رابط خارجي"
                          isRtl={isRtl}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'نوع الملف' : 'File Type'}
                        </label>
                        <input
                          type="text"
                          value={resourceFormData.fileType}
                          onChange={(e) => setResourceFormData({ ...resourceFormData, fileType: e.target.value })}
                          placeholder="PDF, MP3, ZIP"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'الحجم (MB)' : 'Size (MB)'}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={resourceFormData.fileSizeMb}
                          onChange={(e) => setResourceFormData({ ...resourceFormData, fileSizeMb: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-surface-borderSubtle flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowResourceModal(false)}
                        className="px-3 py-1.5 rounded-xl border border-surface-border bg-white text-navy-700 font-bold hover:bg-surface-muted"
                      >
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 shadow-sm"
                      >
                        {isRtl ? 'إضافة ونشر الملف' : 'Add Resource'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="academy-card p-5 bg-white border border-surface-border rounded-2xl flex flex-col justify-between space-y-4 shadow-card-subtle"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="badge-light text-[10px]">{res.category}</span>
                        <span className="text-[11px] font-bold text-navy-500">
                          {res.fileType} • {res.fileSizeMb} MB
                        </span>
                      </div>

                      <h4 className="font-extrabold text-navy-950 text-sm leading-snug">
                        {isRtl && res.titleAr ? res.titleAr : res.title}
                      </h4>
                    </div>

                    <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-navy-500">
                      <span>{res.downloads.toLocaleString()} {isRtl ? 'تحميل' : 'Downloads'}</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={res.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-brand-700 hover:text-brand-900"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteResource(res.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB: FINANCIALS & STUDENTS (Combined Ledger & Progress) */}
          {/* ============================================================== */}
          {activeNav === 'FINANCIALS_STUDENTS' && (
            <div className="space-y-6">
              {/* Financials & Students Sub Navigation Pills */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-surface-border shadow-card-subtle">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFinanceSubTab('TRANSACTIONS')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      financeSubTab === 'TRANSACTIONS'
                        ? 'bg-brand-700 text-white shadow-card-subtle'
                        : 'bg-surface-muted text-navy-700 hover:bg-surface-elevated'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span>{isRtl ? 'سجل مدفوعات PayPal المعتمدة' : 'PayPal Ledger'}</span>
                    <span
                      className={`ms-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                        financeSubTab === 'TRANSACTIONS'
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {transactions.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFinanceSubTab('STUDENTS')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      financeSubTab === 'STUDENTS'
                        ? 'bg-brand-700 text-white shadow-card-subtle'
                        : 'bg-surface-muted text-navy-700 hover:bg-surface-elevated'
                    }`}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    <span>{isRtl ? 'سجل الطلاب ومعدل التقدم' : 'Students & Progress'}</span>
                    <span
                      className={`ms-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                        financeSubTab === 'STUDENTS'
                          ? 'bg-white/20 text-white'
                          : 'bg-brand-100 text-brand-800'
                      }`}
                    >
                      {students.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFinanceSubTab('PAYPAL_SETTINGS')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      financeSubTab === 'PAYPAL_SETTINGS'
                        ? 'bg-[#003087] text-white shadow-card-subtle'
                        : 'bg-[#FFC439]/25 text-[#003087] border border-[#FFC439] hover:bg-[#FFC439]/40'
                    }`}
                  >
                    <Settings className="w-4 h-4 shrink-0" />
                    <span>{isRtl ? 'إعدادات الربط بـ PayPal (Client ID & Secret)' : 'PayPal API Settings'}</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-navy-700 px-2">
                  <span className="text-navy-500">{isRtl ? 'إجمالي المحصل المعتمد:' : 'Total Captured:'}</span>
                  <span className="text-emerald-700 font-black text-sm">
                    {formatCurrency(transactions.reduce((acc, t) => acc + (t.amount || 0), 0))}
                  </span>
                </div>
              </div>

              {/* Sub-tab 1: PAYPAL TRANSACTIONS LEDGER */}
              {financeSubTab === 'TRANSACTIONS' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-card-subtle">
                    <div className="p-5 border-b border-surface-border flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-navy-950 text-sm">
                          {isRtl ? 'سجل عمليات الدفع الإلكتروني والإيرادات الفعلية' : 'Live Transactions & Revenue Ledger'}
                        </h3>
                        <p className="text-xs text-navy-500">
                          {isRtl
                            ? 'متابعة تفاصيل عمليات الشراء الفعلية، أو تسجيل دفعة يدوية، أو حذف أي معاملة تجريبية'
                            : 'Real-time record of verified payments, with ability to record manual payments or delete test entries'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setShowAddTxModal(!showAddTxModal)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'تسجيل دفعة / إيراد يدوياً' : 'Record Payment'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFinanceSubTab('PAYPAL_SETTINGS')}
                          className="px-3.5 py-1.5 rounded-xl bg-[#003087] hover:bg-[#001F5C] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Settings className="w-3.5 h-3.5 text-[#FFC439]" />
                          <span>{isRtl ? 'تعديل بيانات الربط بـ PayPal' : 'Edit PayPal API Keys'}</span>
                        </button>
                      </div>
                    </div>

                    {showAddTxModal && (
                      <form
                        onSubmit={handleSaveManualTransaction}
                        className="p-5 bg-emerald-50/50 border-b border-emerald-200 space-y-4 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-emerald-950">
                            {isRtl ? 'إضافة عملية دفع حقيقية إلى سجل الإيرادات' : 'Add Real Payment to Ledger'}
                          </h4>
                          <button
                            type="button"
                            onClick={() => setShowAddTxModal(false)}
                            className="text-navy-500 hover:text-navy-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'اسم الطالب / المشتري' : 'Student Name'}
                            </label>
                            <input
                              type="text"
                              value={txFormData.payerName}
                              onChange={(e) => setTxFormData({ ...txFormData, payerName: e.target.value })}
                              placeholder="أحمد محمد"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'البريد الإلكتروني *' : 'Email *'}
                            </label>
                            <input
                              type="email"
                              required
                              value={txFormData.payerEmail}
                              onChange={(e) => setTxFormData({ ...txFormData, payerEmail: e.target.value })}
                              placeholder="student@example.com"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'اسم الدورة أو الحصة *' : 'Item / Course Title *'}
                            </label>
                            <input
                              type="text"
                              required
                              value={txFormData.itemTitle}
                              onChange={(e) => setTxFormData({ ...txFormData, itemTitle: e.target.value })}
                              placeholder="مثال: حصة تصحيح تلاوة فردية"
                              className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'المبلغ المحصل ($ USD) *' : 'Amount ($ USD) *'}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              required
                              value={txFormData.amount}
                              onChange={(e) => setTxFormData({ ...txFormData, amount: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-navy-700 block mb-1">
                              {isRtl ? 'نوع البند' : 'Item Type'}
                            </label>
                            <select
                              value={txFormData.itemType}
                              onChange={(e) =>
                                setTxFormData({
                                  ...txFormData,
                                  itemType: e.target.value as 'COURSE' | 'PRIVATE_LESSON',
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white"
                            >
                              <option value="COURSE">{isRtl ? 'دورة تدريبية' : 'Course'}</option>
                              <option value="PRIVATE_LESSON">{isRtl ? 'حصة خاصة' : 'Private Lesson'}</option>
                            </select>
                          </div>
                          <div className="flex items-center pt-5">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={txFormData.alsoRecordStudent}
                                onChange={(e) =>
                                  setTxFormData({ ...txFormData, alsoRecordStudent: e.target.checked })
                                }
                                className="w-4 h-4 rounded text-emerald-600"
                              />
                              <span className="font-bold text-navy-800">
                                {isRtl ? 'إضافة المشترك تلقائياً لسجل الطلاب' : 'Also add to Students list'}
                              </span>
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                          >
                            {isRtl ? 'حفظ العملية المالية' : 'Save Transaction'}
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="overflow-x-auto">
                      <table className="w-full text-start text-xs">
                        <thead className="bg-surface-muted text-navy-500 font-bold border-b border-surface-border">
                          <tr>
                            <th className="p-4 text-start">{isRtl ? 'رقم الطلب' : 'Order ID'}</th>
                            <th className="p-4 text-start">{isRtl ? 'المشتري / البريد' : 'Payer'}</th>
                            <th className="p-4 text-start">{isRtl ? 'البند / الدورة' : 'Item Description'}</th>
                            <th className="p-4 text-start">{isRtl ? 'المبلغ' : 'Amount'}</th>
                            <th className="p-4 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                            <th className="p-4 text-start">{isRtl ? 'التاريخ والوقت' : 'Timestamp'}</th>
                            <th className="p-4 text-end">{isRtl ? 'إجراءات' : 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-borderSubtle">
                          {transactions.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-navy-400">
                                {isRtl
                                  ? 'لا توجد معاملات مسجلة بعد ($0.00). سيتم تسجيل عمليات الدفع تلقائياً فور إتمامها عبر بوابة الدفع أو عند إضافتها يدوياً.'
                                  : 'No transactions recorded yet ($0.00). Completed orders will appear here automatically.'}
                              </td>
                            </tr>
                          ) : (
                            transactions.map((tx) => (
                              <tr key={tx.id} className="hover:bg-surface-muted/50 transition-colors">
                                <td className="p-4 font-mono font-bold text-navy-900">{tx.paypalOrderId}</td>
                                <td className="p-4 text-navy-600">
                                  {tx.payerName && <div className="font-bold text-navy-900">{tx.payerName}</div>}
                                  <div>{tx.payerEmail}</div>
                                </td>
                                <td className="p-4 font-bold text-navy-900">{tx.itemTitle}</td>
                                <td className="p-4 font-extrabold text-brand-700">{formatCurrency(tx.amount)}</td>
                                <td className="p-4">
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                                    {tx.status}
                                  </span>
                                </td>
                                <td className="p-4 text-navy-500">{tx.date}</td>
                                <td className="p-4 text-end">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTransaction(tx.id)}
                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                    title={isRtl ? 'حذف المعاملة' : 'Delete Transaction'}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: STUDENTS & PROGRESS */}
              {financeSubTab === 'STUDENTS' && (
                <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-card-subtle">
                  <div className="p-5 border-b border-surface-border flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-navy-950 text-sm">
                        {isRtl ? 'سجل الطلاب المسجلين فعلياً والتقدم التعليمي' : 'Enrolled Students & Progress'}
                      </h3>
                      <p className="text-xs text-navy-500">
                        {isRtl
                          ? 'يُسجّل الطلاب هنا تلقائياً عند حجز حصة أو الاشتراك في دورة، ويمكنك أيضاً إضافة أو تعديل أو حذف أي طالب'
                          : 'Students are recorded automatically upon booking or enrollment, and can also be managed manually'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenAddStudent}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إضافة طالب جديد' : 'Add Student'}</span>
                    </button>
                  </div>

                  {showAddStudentModal && (
                    <form
                      onSubmit={handleSaveStudent}
                      className="p-5 bg-brand-50/40 border-b border-brand-200 space-y-4 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-navy-950">
                          {editingStudentId
                            ? isRtl
                              ? 'تعديل بيانات الطالب وتقدمه'
                              : 'Edit Student Record'
                            : isRtl
                            ? 'إضافة طالب جديد لسجل الأكاديمية'
                            : 'Add New Student'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowAddStudentModal(false)}
                          className="text-navy-500 hover:text-navy-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-navy-700 block mb-1">
                            {isRtl ? 'اسم الطالب *' : 'Student Name *'}
                          </label>
                          <input
                            type="text"
                            required
                            value={studentFormData.name}
                            onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-navy-700 block mb-1">
                            {isRtl ? 'البريد الإلكتروني *' : 'Email *'}
                          </label>
                          <input
                            type="email"
                            required
                            value={studentFormData.email}
                            onChange={(e) => setStudentFormData({ ...studentFormData, email: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-navy-700 block mb-1">
                            {isRtl ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
                          </label>
                          <input
                            type="text"
                            value={studentFormData.phone}
                            onChange={(e) => setStudentFormData({ ...studentFormData, phone: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-navy-700 block mb-1">
                            {isRtl ? 'عدد الدورات المسجلة' : 'Enrolled Courses'}
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={studentFormData.enrolledCoursesCount}
                            onChange={(e) =>
                              setStudentFormData({
                                ...studentFormData,
                                enrolledCoursesCount: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-navy-700 block mb-1">
                            {isRtl ? 'عدد الدروس / الحصص المكتملة' : 'Completed Lessons'}
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={studentFormData.completedLessonsCount}
                            onChange={(e) =>
                              setStudentFormData({
                                ...studentFormData,
                                completedLessonsCount: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-navy-700 block mb-1">
                            {isRtl ? 'نسبة الإنجاز (%)' : 'Progress (%)'}
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={studentFormData.progressPercentage}
                            onChange={(e) =>
                              setStudentFormData({
                                ...studentFormData,
                                progressPercentage: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800"
                        >
                          {isRtl ? 'حفظ بيانات الطالب' : 'Save Student'}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-xs">
                      <thead className="bg-surface-muted text-navy-500 font-bold border-b border-surface-border">
                        <tr>
                          <th className="p-4 text-start">{isRtl ? 'اسم الطالب' : 'Student Name'}</th>
                          <th className="p-4 text-start">{isRtl ? 'البريد والهاتف' : 'Email & Phone'}</th>
                          <th className="p-4 text-start">{isRtl ? 'الدورات المسجلة' : 'Courses'}</th>
                          <th className="p-4 text-start">{isRtl ? 'الدروس المكتملة' : 'Lessons Completed'}</th>
                          <th className="p-4 text-start">{isRtl ? 'معدل الإنجاز' : 'Progress'}</th>
                          <th className="p-4 text-start">{isRtl ? 'تاريخ الانضمام' : 'Joined'}</th>
                          <th className="p-4 text-end">{isRtl ? 'إجراءات' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-borderSubtle">
                        {students.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-navy-400">
                              {isRtl
                                ? 'لا يوجد طلاب مسجلون بعد (0 طلاب). سيتم قيد المتدربين تلقائياً عند الاشتراك في الدورات أو حجز الدروس.'
                                : 'No students enrolled yet (0 students). Students will appear automatically upon course enrollment or lesson booking.'}
                            </td>
                          </tr>
                        ) : (
                          students.map((stu) => (
                            <tr key={stu.id} className="hover:bg-surface-muted/50 transition-colors">
                              <td className="p-4 font-bold text-navy-950">{stu.name}</td>
                              <td className="p-4 text-navy-600">
                                <div>{stu.email}</div>
                                {stu.phone && (
                                  <div className="text-[11px] font-mono text-emerald-700 font-bold">
                                    📞 {stu.phone}
                                  </div>
                                )}
                              </td>
                              <td className="p-4 font-semibold text-brand-800">
                                {stu.enrolledCoursesCount} {isRtl ? 'دورات' : 'Courses'}
                              </td>
                              <td className="p-4 text-navy-700">
                                {stu.completedLessonsCount} {isRtl ? 'درساً' : 'Lessons'}
                              </td>
                              <td className="p-4">
                                <div className="w-24 bg-surface-muted rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-brand-600 h-2 rounded-full"
                                    style={{ width: `${stu.progressPercentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-[10px] text-navy-500 font-bold mt-1 block">
                                  {stu.progressPercentage}%
                                </span>
                              </td>
                              <td className="p-4 text-navy-500">{stu.joinedDate}</td>
                              <td className="p-4 text-end">
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditStudent(stu)}
                                    className="p-1.5 rounded-lg text-navy-600 hover:bg-surface-muted transition-colors"
                                    title={isRtl ? 'تعديل الطالب' : 'Edit Student'}
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteStudent(stu.id)}
                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                    title={isRtl ? 'حذف الطالب' : 'Delete Student'}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: PAYPAL API SETTINGS */}
              {financeSubTab === 'PAYPAL_SETTINGS' && (
                <div className="space-y-6">
                  {renderPayPalSettingsCard()}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
