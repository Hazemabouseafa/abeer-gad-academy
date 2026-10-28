import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, getTransactions } from '@/lib/data-store';
import { verifyShehnawiCredentials } from '@/lib/shehnawi';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = getSiteSettings();
    const transactions = getTransactions();

    const shehnawiTx = transactions.filter(
      (t) => t.paymentMethod === 'SHEHNAWI' || (t.paypalOrderId && t.paypalOrderId.startsWith('SHEHNAWI'))
    );

    const totalEgp = shehnawiTx.reduce((acc, t) => acc + (t.amountEgp || t.amount * 50), 0);
    const totalUsd = shehnawiTx.reduce((acc, t) => acc + (t.amount || 0), 0);

    return NextResponse.json({
      success: true,
      config: settings.shehnawi,
      stats: {
        totalTransactions: shehnawiTx.length,
        totalRevenueEgp: totalEgp,
        totalRevenueUsd: totalUsd,
        recentTransactions: shehnawiTx.slice(0, 5),
      },
    });
  } catch (error) {
    console.error('Error fetching Shehnawi admin data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch Shehnawi data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await verifyShehnawiCredentials({
      merchantId: body.merchantId,
      apiKey: body.apiKey,
      secretKey: body.secretKey,
      walletNumber: body.walletNumber,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, messageAr: 'حدث خطأ أثناء فحص الاتصال ببوابة شحناوي', messageEn: error.message },
      { status: 500 }
    );
  }
}
