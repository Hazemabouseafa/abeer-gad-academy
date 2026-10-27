import { NextResponse } from 'next/server';
import { getSlots, saveSlot, getBlockedDates, toggleBlockedDate, setBlockedDates } from '@/lib/data-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const slots = getSlots();
    const blockedDates = getBlockedDates();
    return NextResponse.json({ success: true, slots, blockedDates });
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

    if (!body.date || !body.time) {
      return NextResponse.json({ success: false, error: 'Date and time are required' }, { status: 400 });
    }
    const slot = saveSlot(body);
    return NextResponse.json({ success: true, slot, slots: getSlots() });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save slot' }, { status: 500 });
  }
}
