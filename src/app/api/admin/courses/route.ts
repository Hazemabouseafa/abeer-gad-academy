import { NextResponse } from 'next/server';
import { getCourses, saveCourse } from '@/lib/data-store';

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
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Title and Slug are required' },
        { status: 400 }
      );
    }

    const course = saveCourse(body);
    return NextResponse.json({ success: true, course });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save course' }, { status: 500 });
  }
}
