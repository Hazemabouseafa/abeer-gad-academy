import { NextResponse } from 'next/server';
import { togglePublishCourse } from '@/lib/data-store';

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const updated = togglePublishCourse(params.id);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to toggle course publish status' }, { status: 500 });
  }
}
