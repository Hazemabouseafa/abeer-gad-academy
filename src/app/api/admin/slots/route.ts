import { NextResponse } from 'next/server';
import {
  getSlots,
  saveSlot,
  getBlockedDates,
  toggleBlockedDate,
  setBlockedDates,
  getBlockedHours,
  toggleBlockedHour,
  setBlockedHoursForDate,
} from '@/lib/data-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const slots = getSlots();
    const blockedDates = getBlockedDates();
    const blockedHoursByDate = getBlockedHours();
    return NextResponse.json({ success: true, slots, blockedDates, blockedHoursByDate });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch slots' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === 'toggle-blocked-date' && body.date) {
      const blockedDates = toggleBlockedDate(body.date);
      return NextResponse.json({ success: true, blockedDates });
    }

    if (body.action === 'set-blocked-dates' && Array.isArray(body.blockedDates)) {
      const blockedDates = setBlockedDates(body.blockedDates);
      return NextResponse.json({ success: true, blockedDates });
    }

    if (body.action === 'toggle-blocked-hour' && body.date && body.time) {
      const dayHours = toggleBlockedHour(body.date, body.time);
      return NextResponse.json({
        success: true,
        date: body.date,
        blockedHours: dayHours,
        blockedHoursByDate: getBlockedHours(),
      });
    }

    if (body.action === 'set-blocked-hours' && body.date && Array.isArray(body.hours)) {
      const dayHours = setBlockedHoursForDate(body.date, body.hours);
      return NextResponse.json({
        success: true,
        date: body.date,
        blockedHours: dayHours,
        blockedHoursByDate: getBlockedHours(),
      });
    }

    if (!body.date || !body.time) {
      return NextResponse.json({ success: false, error: 'Date and time are required' }, { status: 400 });
    }
    const slot = saveSlot(body);
    return NextResponse.json({ success: true, slot, slots: getSlots() });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save slot' }, { status: 500 });
  }
}
