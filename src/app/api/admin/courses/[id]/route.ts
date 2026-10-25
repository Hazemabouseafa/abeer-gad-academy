import { NextResponse } from 'next/server';
import { getCourseById, saveCourse, deleteCourse } from '@/lib/data-store';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const course = getCourseById(params.id);
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 400 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch course' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const updated = saveCourse({ ...body, id: params.id });
    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const deleted = deleteCourse(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Course not found or could not be deleted' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete course' }, { status: 500 });
  }
}
