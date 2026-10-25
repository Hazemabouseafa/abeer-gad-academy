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
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
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
} from '@/lib/data-store';

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
  const [cmsSubTab, setCmsSubTab] = useState<'HERO' | 'SERVICES' | 'TESTIMONIALS' | 'COMMUNICATION'>('HERO');

  // Sub-tab inside FINANCIALS_STUDENTS
  const [financeSubTab, setFinanceSubTab] = useState<'TRANSACTIONS' | 'STUDENTS'>('TRANSACTIONS');

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
    durationHours: 12,
    promoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    featured: true,
    initialChapterTitle: 'Module 1: Foundations & Core Principles',
    initialChapterTitleAr: 'الوحدة الأولى: المدخل والأسس المنهجية',
    initialLessonTitle: 'Lesson 1: Overview & First Steps',
    initialLessonTitleAr: 'الدرس الأول: نظرة عامة والخطوات التأسيسية',
    initialLessonVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  });

  // Curriculum Modals Form
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterTitleAr, setNewChapterTitleAr] = useState('');
  const [targetChapterId, setTargetChapterId] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonTitleAr, setNewLessonTitleAr] = useState('');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [newLessonDuration, setNewLessonDuration] = useState('30m');
  const [newLessonIsFree, setNewLessonIsFree] = useState(false);

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
      const [resCourses, resSlots, resResources, resSettings] = await Promise.all([
        fetch('/api/admin/courses').then((r) => r.json()),
        fetch('/api/admin/slots').then((r) => r.json()),
        fetch('/api/admin/resources').then((r) => r.json()),
        fetch('/api/admin/settings').then((r) => r.json()),
      ]);

      if (resCourses.courses) setCourses(resCourses.courses);
      if (resSlots.slots) setSlots(resSlots.slots);
      if (resResources.resources) setResources(resResources.resources);
      if (resSettings.settings) setSettings(resSettings.settings);

      // Financial Transactions
      setTransactions([
        {
          id: 'tx-1',
          paypalOrderId: 'PAYID-M45892147K',
          payerEmail: 'tariq.mansoor@example.co.uk',
          itemTitle: 'Tajweed Rules & Accurate Articulation',
          itemType: 'COURSE',
          amount: 110,
          currency: 'USD',
          status: 'COMPLETED',
          date: '2026-10-24 10:15',
        },
        {
          id: 'tx-2',
          paypalOrderId: 'PAYID-M99301124L',
          payerEmail: 'fatima.zahra@example.fr',
          itemTitle: 'Private Lesson (Oct 25 02:00 PM)',
          itemType: 'PRIVATE_LESSON',
          amount: 45,
          currency: 'USD',
          status: 'COMPLETED',
          date: '2026-10-23 16:30',
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
          date: '2026-10-22 18:45',
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
      ]);

      // Students
      setStudents([
        {
          id: 'stu-1',
          name: 'طارق منصور (Tariq Mansoor)',
          email: 'tariq.mansoor@example.co.uk',
          joinedDate: '2026-09-15',
          enrolledCoursesCount: 2,
          completedLessonsCount: 18,
          progressPercentage: 75,
        },
        {
          id: 'stu-2',
          name: 'فاطمة الزهراء (Fatima Zahra)',
          email: 'fatima.zahra@example.fr',
          joinedDate: '2026-09-22',
          enrolledCoursesCount: 1,
          completedLessonsCount: 8,
          progressPercentage: 40,
        },
        {
          id: 'stu-3',
          name: 'ماركوس بلال (Marcus Bilal)',
          email: 'marcus.bilal@example.de',
          joinedDate: '2026-10-02',
          enrolledCoursesCount: 1,
          completedLessonsCount: 14,
          progressPercentage: 60,
        },
        {
          id: 'stu-4',
          name: 'عائشة الهاشمي (Aisha Al-Hashimi)',
          email: 'aisha.hashimi@example.com',
          joinedDate: '2026-10-10',
          enrolledCoursesCount: 3,
          completedLessonsCount: 32,
          progressPercentage: 92,
        },
      ]);
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
      durationHours: 12,
      promoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      isPublished: true,
      featured: true,
      initialChapterTitle: 'Module 1: Foundations & Core Principles',
      initialChapterTitleAr: 'الوحدة الأولى: المدخل والأسس المنهجية',
      initialLessonTitle: 'Lesson 1: Overview & First Steps',
      initialLessonTitleAr: 'الدرس الأول: نظرة عامة والخطوات التأسيسية',
      initialLessonVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    });
    setShowCourseModal(true);
    setTimeout(() => {
      document.getElementById('course-inline-editor')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleOpenEditCourseModal = (course: CourseData) => {
    setEditingCourse(course);
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
      price: course.price,
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
    if (!courseFormData.title || !courseFormData.slug) {
      alert(isRtl ? 'يرجى كتابة عنوان الدورة والرابط الدائم (Slug)' : 'Title and Slug are required');
      return;
    }

    const payload: Partial<CourseData> & { title: string; slug: string } = {
      ...(editingCourse ? { id: editingCourse.id } : {}),
      title: courseFormData.title,
      titleAr: courseFormData.titleAr || courseFormData.title,
      slug: courseFormData.slug.toLowerCase().replace(/\s+/g, '-'),
      subtitle: courseFormData.subtitle,
      subtitleAr: courseFormData.subtitleAr,
      description: courseFormData.description,
      descriptionAr: courseFormData.descriptionAr,
      category: courseFormData.category,
      categoryAr: courseFormData.categoryAr,
      level: courseFormData.level,
      levelAr: courseFormData.levelAr,
      price: Number(courseFormData.price) || 89,
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
    if (!selectedCourseForCurriculum || !newChapterTitle) return;

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseForCurriculum.id}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_CHAPTER',
          chapter: {
            title: newChapterTitle,
            titleAr: newChapterTitleAr || newChapterTitle,
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
        triggerToast(isRtl ? 'تمت إضافة الفصل الجديد بنجاح' : 'New chapter added');
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
    if (!selectedCourseForCurriculum || !targetChapterId || !newLessonTitle) return;

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseForCurriculum.id}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_LESSON',
          chapterId: targetChapterId,
          lesson: {
            title: newLessonTitle,
            titleAr: newLessonTitleAr || newLessonTitle,
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
        if (finalSettings.heroBadgeAr && (!finalSettings.heroBadgeEn || finalSettings.heroBadgeEn.trim() === '')) {
          heroFields.heroBadgeAr = finalSettings.heroBadgeAr;
        }
        if (finalSettings.heroTitleAr && (!finalSettings.heroTitleEn || finalSettings.heroTitleEn.trim() === '')) {
          heroFields.heroTitleAr = finalSettings.heroTitleAr;
        }
        if (finalSettings.heroTitleHighlightAr && (!finalSettings.heroTitleHighlightEn || finalSettings.heroTitleHighlightEn.trim() === '')) {
          heroFields.heroTitleHighlightAr = finalSettings.heroTitleHighlightAr;
        }
        if (finalSettings.heroSubtitleAr && (!finalSettings.heroSubtitleEn || finalSettings.heroSubtitleEn.trim() === '')) {
          heroFields.heroSubtitleAr = finalSettings.heroSubtitleAr;
        }
        if (finalSettings.heroCtaPrimaryTextAr && (!finalSettings.heroCtaPrimaryTextEn || finalSettings.heroCtaPrimaryTextEn.trim() === '')) {
          heroFields.heroCtaPrimaryTextAr = finalSettings.heroCtaPrimaryTextAr;
        }
        if (finalSettings.heroCtaSecondaryTextAr && (!finalSettings.heroCtaSecondaryTextEn || finalSettings.heroCtaSecondaryTextEn.trim() === '')) {
          heroFields.heroCtaSecondaryTextAr = finalSettings.heroCtaSecondaryTextAr;
        }
        if (finalSettings.announcementTextAr && (!finalSettings.announcementTextEn || finalSettings.announcementTextEn.trim() === '')) {
          heroFields.announcementTextAr = finalSettings.announcementTextAr;
        }
        if (finalSettings.footerAboutAr && (!finalSettings.footerAboutEn || finalSettings.footerAboutEn.trim() === '')) {
          heroFields.footerAboutAr = finalSettings.footerAboutAr;
        }

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
              if (svc.titleAr && (!svc.titleEn || svc.titleEn.trim() === '')) svcFields.titleAr = svc.titleAr;
              if (svc.badgeAr && (!svc.badgeEn || svc.badgeEn.trim() === '')) svcFields.badgeAr = svc.badgeAr;
              if (svc.subtitleAr && (!svc.subtitleEn || svc.subtitleEn.trim() === '')) svcFields.subtitleAr = svc.subtitleAr;
              if (svc.levelAr && (!svc.levelEn || svc.levelEn.trim() === '')) svcFields.levelAr = svc.levelAr;
              if (svc.formatAr && (!svc.formatEn || svc.formatEn.trim() === '')) svcFields.formatAr = svc.formatAr;
              if (
                Array.isArray(svc.featuresAr) &&
                svc.featuresAr.length > 0 &&
                (!Array.isArray(svc.featuresEn) || svc.featuresEn.length === 0)
              ) {
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

    const updatedTestimonials = [newTest, ...(settings.testimonials || [])];
    const newSettings = { ...settings, testimonials: updatedTestimonials };
    setSettings(newSettings);
    setShowTestimonialModal(false);

    try {
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      triggerToast(isRtl ? 'تمت إضافة رأي الطالب وسيظهر في الواجهة' : 'Testimonial added to homepage!');
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

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="academy-card p-5 bg-white border border-surface-border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider block">
                      {isRtl ? 'إجمالي الإيرادات (USD)' : 'Total Revenue'}
                    </span>
                    <div className="text-2xl font-black text-brand-800 mt-1">
                      {formatCurrency(14850)}
                    </div>
                    <span className="badge-light text-[11px] mt-2">+18% this month</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="academy-card p-5 bg-white border border-surface-border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider block">
                      {isRtl ? 'الطلاب النشطون' : 'Active Students'}
                    </span>
                    <div className="text-2xl font-black text-navy-900 mt-1">
                      {settings.heroStudentsCount || '1,250+'}
                    </div>
                    <span className="text-xs text-navy-500 mt-2 block">{isRtl ? 'حسابات مسجلة' : 'Verified Accounts'}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center border border-gold-200">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="academy-card p-5 bg-white border border-surface-border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider block">
                      {isRtl ? 'الحجوزات الخاصة' : 'Private Bookings'}
                    </span>
                    <div className="text-2xl font-black text-navy-900 mt-1">
                      {slots.filter((s) => s.status === 'BOOKED').length + 84}
                    </div>
                    <span className="text-xs text-navy-500 mt-2 block">{isRtl ? 'جلسات مباشرة' : '1-on-1 Sessions'}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-quran-50 text-quran-700 flex items-center justify-center border border-quran-200">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>

                <div className="academy-card p-5 bg-white border border-surface-border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-navy-500 uppercase tracking-wider block">
                      {isRtl ? 'الدورات المنشورة' : 'Live Curricula'}
                    </span>
                    <div className="text-2xl font-black text-navy-900 mt-1">
                      {courses.filter((c) => c.isPublished).length} / {courses.length}
                    </div>
                    <span className="text-xs text-emerald-600 font-bold mt-2 block">
                      {isRtl ? 'نشطة في الكتالوج' : 'Publicly Available'}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>
              </div>

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

              {/* Recent Orders Preview */}
              <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-card-subtle">
                <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between">
                  <h3 className="font-extrabold text-navy-950 text-sm">
                    {isRtl ? 'أحدث المعاملات والمدفوعات المعتمدة عبر PayPal' : 'Recent PayPal Transactions'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav('FINANCIALS_STUDENTS');
                      setFinanceSubTab('TRANSACTIONS');
                    }}
                    className="text-xs font-bold text-brand-700 hover:underline"
                  >
                    {isRtl ? 'عرض الكل ←' : 'View all →'}
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
                      {transactions.slice(0, 3).map((tx) => (
                        <tr key={tx.id} className="hover:bg-surface-muted/50">
                          <td className="p-3.5 font-mono font-bold text-navy-900">{tx.paypalOrderId}</td>
                          <td className="p-3.5 text-navy-600">{tx.payerEmail}</td>
                          <td className="p-3.5 font-bold text-navy-900">{tx.itemTitle}</td>
                          <td className="p-3.5 font-extrabold text-brand-700">{formatCurrency(tx.amount)}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
                      <Sparkles className="w-5 h-5 text-gold-600" />
                      <h3 className="font-extrabold text-navy-950 text-sm">
                        {isRtl ? 'الأرقام والإحصائيات الحية في الصفحة الرئيسية' : 'Hero Live Metric Counters'}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
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

              {/* Sub-tab: SERVICES CARDS */}
              {cmsSubTab === 'SERVICES' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-surface-border shadow-card-subtle">
                    <div>
                      <h3 className="font-extrabold text-navy-950 text-sm">
                        {isRtl ? 'إدارة وتخصيص كروت الخدمات المعروضة في الواجهة' : 'Homepage Services Cards Management'}
                      </h3>
                      <p className="text-xs text-navy-500">
                        {isRtl
                          ? 'يمكنك تفعيل أو إخفاء أي خدمة بنقرة زر، وتعديل العناوين والشارات والمحاور فوراً.'
                          : 'Toggle card visibility on the homepage, or customize titles, badges, and features.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200">
                        {isRtl
                          ? `${(settings.services || []).filter((s) => s.isActive !== false).length} خدمات مفعّلة في الواجهة`
                          : `${(settings.services || []).filter((s) => s.isActive !== false).length} Active Services`}
                      </span>
                    </div>
                  </div>

                  {/* Services Cards List */}
                  <div className="grid grid-cols-1 gap-5">
                    {(settings.services || []).map((service) => {
                      const isEditing = editingServiceId === service.id;
                      const isActive = service.isActive !== false;

                      return (
                        <div
                          key={service.id}
                          className={`academy-card p-5 sm:p-6 bg-white border-2 rounded-3xl transition-all shadow-card-subtle ${
                            isActive ? 'border-surface-border hover:border-brand-300' : 'border-gray-200 opacity-60 bg-gray-50/60'
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
                                </div>
                                <span className="text-[11px] text-navy-500 font-medium">
                                  {isRtl
                                    ? `التصنيف: ${service.categoryKey} • المسار: ${service.href}`
                                    : `Category: ${service.categoryKey} • Route: ${service.href}`}
                                </span>
                              </div>
                            </div>

                            {/* Actions: Toggle Active + Edit */}
                            <div className="flex items-center gap-2">
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
                                    ? isRtl ? 'إخفاء الخدمة من الواجهة' : 'Hide from homepage'
                                    : isRtl ? 'إظهار الخدمة في الواجهة' : 'Show on homepage'
                                }
                              >
                                {isActive ? (
                                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                                )}
                                <span>{isActive ? (isRtl ? 'ظاهر في الواجهة' : 'Visible') : isRtl ? 'مخفي' : 'Hidden'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditingServiceId(isEditing ? null : service.id)}
                                className="px-3.5 py-1.5 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-elevated text-navy-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-navy-600" />
                                <span>
                                  {isEditing
                                    ? isRtl ? 'إغلاق المحرر' : 'Close Editor'
                                    : isRtl ? 'تعديل التفاصيل' : 'Edit Details'}
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Inline Editor Form (shown when editing) */}
                          {isEditing ? (
                            <div className="mt-5 pt-4 border-t border-surface-borderSubtle space-y-4 animate-in fade-in duration-200">
                              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-surface-borderSubtle">
                                <span className="text-xs font-bold text-navy-800">
                                  {isRtl ? 'تعديل وتخصيص بيانات الخدمة' : 'Service Customization'}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleTranslateService(service.id)}
                                  disabled={translatingId === `service-${service.id}`}
                                  className="px-3.5 py-1.5 rounded-xl bg-gold-50 border border-gold-300 hover:bg-gold-100 text-navy-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-60"
                                  title={isRtl ? 'ترجمة بيانات هذه الخدمة للإنجليزية بضغطة زر' : 'Translate this service to English'}
                                >
                                  <Sparkles className={`w-3.5 h-3.5 text-gold-600 ${translatingId === `service-${service.id}` ? 'animate-spin' : ''}`} />
                                  <span>
                                    {translatingId === `service-${service.id}`
                                      ? (isRtl ? 'جاري الترجمة...' : 'Translating...')
                                      : (isRtl ? 'ترجمة بيانات الخدمة للإنجليزية ✨' : 'Translate Service ✨')}
                                  </span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'عنوان الخدمة (بالعربية)' : 'Service Title (Arabic)'} *
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
                                    {isRtl ? 'عنوان الخدمة (English)' : 'Service Title (English)'} *
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

                                <div className="md:col-span-2">
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'الوصف التوضيحي للخدمة (بالعربية)' : 'Subtitle / Description (Arabic)'}
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
                                    {isRtl ? 'الوصف التوضيحي للخدمة (English)' : 'Subtitle / Description (English)'}
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={service.subtitleEn || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'subtitleEn', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'المستوى المستهدف (بالعربية)' : 'Target Level (Arabic)'}
                                  </label>
                                  <input
                                    type="text"
                                    value={service.levelAr || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'levelAr', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl ? 'نمط الدراسة (بالعربية)' : 'Study Format (Arabic)'}
                                  </label>
                                  <input
                                    type="text"
                                    value={service.formatAr || ''}
                                    onChange={(e) => handleUpdateServiceField(service.id, 'formatAr', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic text-xs"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="font-bold text-navy-700 block mb-1">
                                    {isRtl
                                      ? 'محاور وخطة المنهج في الكارد (سطر لكل نقطة)'
                                      : 'Features & Curriculum Points (One per line)'}
                                  </label>
                                  <textarea
                                    rows={4}
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
                                  {isRtl ? 'تم' : 'Done'}
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
                                  <span>{isRtl ? 'حفظ وتحديث الواجهة فوراً' : 'Save & Publish Live'}</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 text-xs text-navy-600 line-clamp-2 leading-relaxed">
                              {isRtl ? service.subtitleAr : service.subtitleEn}
                            </div>
                          )}
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
                              {isRtl ? 'إضافة رأي طالب جديد في الصفحة الرئيسية' : 'Add Student Testimonial'}
                            </h3>
                            <p className="text-[11px] text-navy-500">
                              {isRtl ? 'نموذج مباشر على نفس الصفحة — ستظهر الشهادة فور الحفظ' : 'Direct inline form — updates homepage reviews immediately'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowTestimonialModal(false)}
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
                            onClick={() => setShowTestimonialModal(false)}
                            className="px-3 py-1.5 rounded-xl border border-surface-border bg-white text-navy-700 font-bold hover:bg-surface-muted"
                          >
                            {isRtl ? 'إلغاء' : 'Cancel'}
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 shadow-sm"
                          >
                            {isRtl ? 'إضافة الشهادة للواجهة' : 'Add Testimonial'}
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
                            <button
                              type="button"
                              onClick={() => handleDeleteTestimonial(t.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title={isRtl ? 'حذف الشهادة' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
                          {isRtl ? 'عنوان الدورة (English)' : 'Course Title (English)'} *
                        </label>
                        <input
                          type="text"
                          required
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
                          placeholder="مثال: دورة التأسيس المتقن في علوم التجويد"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'الرابط الدائم (Slug)' : 'URL Slug'} *
                        </label>
                        <input
                          type="text"
                          required
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

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'سعر الدورة (USD $)' : 'Price ($ USD)'}
                        </label>
                        <input
                          type="number"
                          value={courseFormData.price}
                          onChange={(e) => setCourseFormData({ ...courseFormData, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
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
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'رابط الفيديو الترويجي (YouTube / Vimeo / MP4)' : 'Promo Video URL'}
                        </label>
                        <input
                          type="text"
                          value={courseFormData.promoVideoUrl}
                          onChange={(e) => setCourseFormData({ ...courseFormData, promoVideoUrl: e.target.value })}
                          placeholder="https://www.youtube.com/embed/..."
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-[11px]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'رابط الصورة المصغرة (Thumbnail URL)' : 'Thumbnail Image URL'}
                        </label>
                        <input
                          type="text"
                          value={courseFormData.thumbnail}
                          onChange={(e) => setCourseFormData({ ...courseFormData, thumbnail: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-[11px]"
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
                                  {les.isFree && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                                      {isRtl ? 'معاينة مجانية' : 'Free Preview'}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="text-navy-400 text-[11px] font-mono">{les.duration}</span>
                                  <a
                                    href={les.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-brand-700 hover:underline font-mono text-[10px]"
                                  >
                                    {isRtl ? 'تشغيل' : 'Play'}
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
                            setNewLessonTitle(e.target.value);
                          }}
                          placeholder={isRtl ? 'مثال: الدرس الثاني: مخارج اللسان' : 'Arabic title...'}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-arabic"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'رابط الفيديو (YouTube Embed, Vimeo, أو MP4)' : 'Video URL'}
                        </label>
                        <input
                          type="text"
                          required
                          value={newLessonVideoUrl}
                          onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                          placeholder="https://www.youtube.com/embed/..."
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-[11px]"
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
                          setNewChapterTitle(e.target.value);
                        }}
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
          {activeNav === 'SLOTS' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-surface-border shadow-card-subtle">
                <div>
                  <h3 className="text-sm font-bold text-navy-950">
                    {isRtl ? 'جدول مواعيد الدروس الفردية المباشرة (1-on-1 Sessions)' : 'Private Lesson Slots Scheduler'}
                  </h3>
                  <p className="text-xs text-navy-500">
                    {isRtl ? 'فتح مواعيد جديدة ليراها الطلاب في صفحة الحجز، أو تعديل الجلسات' : 'Add available slots or manage booked sessions'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowSlotModal(true);
                    setTimeout(() => {
                      document.getElementById('slot-inline-editor')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="px-3 py-2 rounded-xl bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-brand-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isRtl ? 'إضافة موعد جديد' : 'Add Slot'}</span>
                </button>
              </div>

              {/* INLINE SLOT CREATION FORM (No Popups!) */}
              {showSlotModal && (
                <div id="slot-inline-editor" className="bg-white rounded-3xl border-2 border-brand-300 p-6 space-y-4 shadow-card-hover animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-brand-700" />
                      <div>
                        <h3 className="font-extrabold text-navy-950 text-sm">
                          {isRtl ? 'إضافة موعد متاح لدرس فردي مباشر (1-on-1)' : 'Add Private 1-on-1 Lesson Slot'}
                        </h3>
                        <p className="text-[11px] text-navy-500">
                          {isRtl ? 'نموذج مباشر على نفس الصفحة — سيظهر الموعد فوراً للطلاب في صفحة الحجز' : 'Direct inline form — updates available calendar immediately'}
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

                  <form onSubmit={handleSaveSlot} className="space-y-3 text-xs">
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
                        <label className="font-bold text-navy-700 block mb-1">{isRtl ? 'الوقت' : 'Time'} *</label>
                        <input
                          type="text"
                          required
                          value={slotFormData.time}
                          onChange={(e) => setSlotFormData({ ...slotFormData, time: e.target.value })}
                          placeholder="e.g. 10:00 AM UTC"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
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
                        <label className="font-bold text-navy-700 block mb-1">{isRtl ? 'السعر ($ USD)' : 'Price ($ USD)'}</label>
                        <input
                          type="number"
                          value={slotFormData.price}
                          onChange={(e) => setSlotFormData({ ...slotFormData, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-border"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-navy-700 block mb-1">{isRtl ? 'رابط الجلسة (Google Meet / Zoom)' : 'Meeting Link'}</label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="academy-card p-5 bg-white border border-surface-border rounded-2xl space-y-3 shadow-card-subtle"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-700">{slot.date}</span>
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
                      <span>{slot.time}</span>
                    </div>

                    <div className="text-xs text-navy-600">
                      <span className="text-navy-400 block">{isRtl ? 'المعلمة:' : 'Instructor:'}</span>
                      <span className="font-semibold">{slot.instructor}</span>
                    </div>

                    {slot.studentName && (
                      <div className="p-2.5 rounded-xl bg-surface-muted text-xs text-navy-700 border border-surface-border">
                        <span className="text-navy-400 block text-[10px] font-bold uppercase">{isRtl ? 'الطالب المسجل:' : 'Student:'}</span>
                        <span className="font-bold text-navy-900">{slot.studentName}</span>
                        {slot.studentEmail && <span className="block text-[11px] text-navy-500">{slot.studentEmail}</span>}
                      </div>
                    )}

                    <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                      <span className="font-black text-brand-700 text-sm">
                        {formatCurrency(slot.price)}
                      </span>
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
          )}

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

                      <div>
                        <label className="font-bold text-navy-700 block mb-1">
                          {isRtl ? 'رابط الملف للتحميل' : 'Download File URL'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={resourceFormData.fileUrl}
                          onChange={(e) => setResourceFormData({ ...resourceFormData, fileUrl: e.target.value })}
                          placeholder="/downloads/tajweed-guide.pdf"
                          className="w-full px-3 py-2 rounded-xl border border-surface-border font-mono text-[11px]"
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
                <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-card-subtle">
                  <div className="p-5 border-b border-surface-border flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-navy-950 text-sm">
                        {isRtl ? 'سجل عمليات الدفع الإلكتروني المعتمدة عبر PayPal' : 'PayPal Live Transactions Ledger'}
                      </h3>
                      <p className="text-xs text-navy-500">
                        {isRtl
                          ? 'متابعة تفاصيل عمليات الشراء، أرقام المعاملات الرسمية، والمبالغ المحصلة فوراً'
                          : 'Real-time record of verified payments, capture IDs, and customer emails'}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {isRtl ? 'بوابة دفع نشطة ومعتمدة' : 'Verified Gateway'}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-xs">
                      <thead className="bg-surface-muted text-navy-500 font-bold border-b border-surface-border">
                        <tr>
                          <th className="p-4 text-start">{isRtl ? 'رقم طلب PayPal' : 'Order ID'}</th>
                          <th className="p-4 text-start">{isRtl ? 'البريد الإلكتروني' : 'Payer Email'}</th>
                          <th className="p-4 text-start">{isRtl ? 'البند / الدورة' : 'Item Description'}</th>
                          <th className="p-4 text-start">{isRtl ? 'المبلغ' : 'Amount'}</th>
                          <th className="p-4 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                          <th className="p-4 text-start">{isRtl ? 'التاريخ والوقت' : 'Timestamp'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-borderSubtle">
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-surface-muted/50 transition-colors">
                            <td className="p-4 font-mono font-bold text-navy-900">{tx.paypalOrderId}</td>
                            <td className="p-4 text-navy-600">{tx.payerEmail}</td>
                            <td className="p-4 font-bold text-navy-900">{tx.itemTitle}</td>
                            <td className="p-4 font-extrabold text-brand-700">{formatCurrency(tx.amount)}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                                {tx.status}
                              </span>
                            </td>
                            <td className="p-4 text-navy-500">{tx.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: STUDENTS & PROGRESS */}
              {financeSubTab === 'STUDENTS' && (
                <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-card-subtle">
                  <div className="p-5 border-b border-surface-border">
                    <h3 className="font-extrabold text-navy-950 text-sm">
                      {isRtl ? 'سجل الطلاب والتقدم التعليمي' : 'Enrolled Students & Progress'}
                    </h3>
                    <p className="text-xs text-navy-500">
                      {isRtl
                        ? 'متابعة نسبة إنجاز كل طالب للدروس والدورات المسجل بها'
                        : 'Track student completion rates and course participation'}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-xs">
                      <thead className="bg-surface-muted text-navy-500 font-bold border-b border-surface-border">
                        <tr>
                          <th className="p-4 text-start">{isRtl ? 'اسم الطالب' : 'Student Name'}</th>
                          <th className="p-4 text-start">{isRtl ? 'البريد الإلكتروني' : 'Email'}</th>
                          <th className="p-4 text-start">{isRtl ? 'الدورات المسجلة' : 'Courses'}</th>
                          <th className="p-4 text-start">{isRtl ? 'الدروس المكتملة' : 'Lessons Completed'}</th>
                          <th className="p-4 text-start">{isRtl ? 'معدل الإنجاز' : 'Progress'}</th>
                          <th className="p-4 text-start">{isRtl ? 'تاريخ الانضمام' : 'Joined'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-borderSubtle">
                        {students.map((stu) => (
                          <tr key={stu.id} className="hover:bg-surface-muted/50 transition-colors">
                            <td className="p-4 font-bold text-navy-950">{stu.name}</td>
                            <td className="p-4 text-navy-600">{stu.email}</td>
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
