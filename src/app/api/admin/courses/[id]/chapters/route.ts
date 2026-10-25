import { NextResponse } from 'next/server';
import { addChapterToCourse, deleteChapterFromCourse, addLessonToChapter, deleteLessonFromChapter } from '@/lib/data-store';

interface Params {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const { action, chapter, lesson, chapterId, lessonId } = body;

    if (action === 'ADD_CHAPTER') {
      const updatedCourse = addChapterToCourse(params.id, chapter);
      if (!updatedCourse) {
        return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, course: updatedCourse });
    }

    if (action === 'DELETE_CHAPTER') {
      const updatedCourse = deleteChapterFromCourse(params.id, chapterId);
      if (!updatedCourse) {
        return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, course: updatedCourse });
    }

    if (action === 'ADD_LESSON') {
      const updatedCourse = addLessonToChapter(params.id, chapterId, lesson);
      if (!updatedCourse) {
        return NextResponse.json({ success: false, error: 'Course or chapter not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, course: updatedCourse });
    }

    if (action === 'DELETE_LESSON') {
      const updatedCourse = deleteLessonFromChapter(params.id, chapterId, lessonId);
      if (!updatedCourse) {
        return NextResponse.json({ success: false, error: 'Course or chapter not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, course: updatedCourse });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update curriculum' }, { status: 500 });
  }
}
