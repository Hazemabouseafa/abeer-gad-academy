import { NextResponse } from 'next/server';
import { getPublishedCourses } from '@/lib/data-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const courses = getPublishedCourses();
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch published courses' }, { status: 500 });
  }
}
