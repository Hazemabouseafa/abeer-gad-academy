import { NextResponse } from 'next/server';
import { getCourses, saveCourse } from '@/lib/data-store';
import { translateSingle } from '@/lib/translate';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const courses = getCourses();
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Auto-translate from Arabic if English title is missing
    if (!body.title && body.titleAr) {
      body.title = await translateSingle(body.titleAr, 'ar', 'en');
    }

    // Auto-generate slug if missing
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `course-${Date.now()}`;
    }

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Title and Slug are required' },
        { status: 400 }
      );
    }

    // Auto-translate other fields if Arabic is present
    if (!body.subtitle && body.subtitleAr) {
      body.subtitle = await translateSingle(body.subtitleAr, 'ar', 'en');
    }
    if (!body.description && body.descriptionAr) {
      body.description = await translateSingle(body.descriptionAr, 'ar', 'en');
    }
    if (!body.category && body.categoryAr) {
      body.category = await translateSingle(body.categoryAr, 'ar', 'en');
    }
    if (!body.level && body.levelAr) {
      body.level = await translateSingle(body.levelAr, 'ar', 'en');
    }

    // Auto-translate initial chapters/lessons if any
    if (Array.isArray(body.chapters)) {
      for (const ch of body.chapters) {
        if (!ch.title && ch.titleAr) {
          ch.title = await translateSingle(ch.titleAr, 'ar', 'en');
        }
        if (Array.isArray(ch.lessons)) {
          for (const les of ch.lessons) {
            if (!les.title && les.titleAr) {
              les.title = await translateSingle(les.titleAr, 'ar', 'en');
            }
          }
        }
      }
    }

    const course = saveCourse(body);
    return NextResponse.json({ success: true, course });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save course' }, { status: 500 });
  }
}

