import { NextResponse } from 'next/server';
import { getStudents, saveStudent, deleteStudent } from '@/lib/data-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const students = getStudents();
    return NextResponse.json({ success: true, students });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Student name and email are required' },
        { status: 400 }
      );
    }
    const student = saveStudent(body);
    return NextResponse.json({
      success: true,
      student,
      students: getStudents(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save student' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Student ID is required' }, { status: 400 });
    }
    deleteStudent(id);
    return NextResponse.json({
      success: true,
      students: getStudents(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete student' }, { status: 500 });
  }
}
