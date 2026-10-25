import { NextResponse } from 'next/server';
import { getSlots } from '@/lib/data-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const availableOnly = searchParams.get('availableOnly') === 'true';

    let slots = getSlots();
    if (availableOnly) {
      slots = slots.filter((s) => s.status === 'AVAILABLE');
    }

    return NextResponse.json({ success: true, slots });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch slots' }, { status: 500 });
  }
}
