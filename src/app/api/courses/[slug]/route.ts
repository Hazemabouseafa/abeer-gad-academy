import { NextResponse } from 'next/server';
import { getCourseBySlug } from '@/lib/data-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const course = getCourseBySlug(params.slug);
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch course' }, { status: 500 });
  }
}
