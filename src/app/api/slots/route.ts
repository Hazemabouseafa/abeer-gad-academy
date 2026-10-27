import { NextResponse } from 'next/server';
import { getSlots, getBlockedDates, getSiteSettings } from '@/lib/data-store';
import { DEFAULT_SLOT_PRICING } from '@/lib/slot-pricing';

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

    const blockedDates = getBlockedDates();
    const settings = getSiteSettings();
    const slotPricing = settings.slotPricing || DEFAULT_SLOT_PRICING;

    return NextResponse.json({
      success: true,
      slots,
      blockedDates,
      slotPricing,
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch slots' }, { status: 500 });
  }
}
