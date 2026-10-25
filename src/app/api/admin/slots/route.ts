import { NextResponse } from 'next/server';
import { getSlots, saveSlot } from '@/lib/data-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const slots = getSlots();
    return NextResponse.json({ success: true, slots });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch slots' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.date || !body.time) {
      return NextResponse.json({ success: false, error: 'Date and time are required' }, { status: 400 });
    }
    const slot = saveSlot(body);
    return NextResponse.json({ success: true, slot });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save slot' }, { status: 500 });
  }
}
