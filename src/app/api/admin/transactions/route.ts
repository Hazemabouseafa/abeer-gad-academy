import { NextResponse } from 'next/server';
import { getTransactions } from '@/lib/data-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const transactions = getTransactions();
    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
