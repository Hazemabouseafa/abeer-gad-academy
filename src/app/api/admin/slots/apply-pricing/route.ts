import { NextResponse } from 'next/server';
import { applyPricingToAllSlots } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const result = applyPricingToAllSlots();
    return NextResponse.json({
      success: true,
      message: `Successfully updated prices for ${result.updatedCount} slots`,
      updatedCount: result.updatedCount,
      slots: result.slots,
    });
  } catch (error: any) {
    console.error('Error applying slot pricing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to apply time-based pricing to slots' },
      { status: 500 }
    );
  }
}
