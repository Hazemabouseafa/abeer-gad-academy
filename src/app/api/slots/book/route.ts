import { NextResponse } from 'next/server';
import { bookSlot } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slotId, date, time, studentName, studentEmail, studentPhone, notes } = body;

    if ((!slotId && (!date || !time)) || !studentName || !studentEmail || !studentPhone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Date/time (or Slot ID), student name, email, and phone number are all required',
        },
        { status: 400 }
      );
    }

    const updatedSlot = bookSlot(slotId || '', {
      date,
      time,
      studentName,
      studentEmail,
      studentPhone,
      notes,
    });

    if (!updatedSlot) {
      return NextResponse.json(
        { success: false, error: 'هذا اليوم أو الموعد محجوز بالفعل، يرجى اختيار يوم أو وقت آخر متاح' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Slot successfully booked and confirmed',
      slot: updatedSlot,
    });
  } catch (error: any) {
    console.error('Error booking slot:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to book slot' },
      { status: 500 }
    );
  }
}
