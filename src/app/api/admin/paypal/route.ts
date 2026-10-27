import { NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/data-store';
import { verifyPayPalCredentials } from '@/lib/paypal';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, paypalClientId, paypalClientSecret, paypalMode } = body;

    const cleanClientId = (paypalClientId ?? '').replace(/['"]/g, '').trim();
    const cleanClientSecret = (paypalClientSecret ?? '').replace(/['"]/g, '').trim();
    const cleanMode: 'live' | 'sandbox' =
      (paypalMode || 'live').toLowerCase() === 'sandbox' ? 'sandbox' : 'live';

    if (action === 'save' || action === 'save_and_test') {
      updateSiteSettings({
        paypalClientId: cleanClientId,
        paypalClientSecret: cleanClientSecret,
        paypalMode: cleanMode,
      });
    }

    if (action === 'test' || action === 'save_and_test') {
      const verification = await verifyPayPalCredentials(
        cleanClientId,
        cleanClientSecret,
        cleanMode
      );
      return NextResponse.json({
        success: verification.valid,
        valid: verification.valid,
        mode: verification.mode,
        appId: verification.appId,
        error: verification.error,
        settings: getSiteSettings(),
      });
    }

    return NextResponse.json({
      success: true,
      settings: getSiteSettings(),
    });
  } catch (error) {
    console.error('PayPal admin settings error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حفظ أو فحص إعدادات PayPal.' },
      { status: 500 }
    );
  }
}
