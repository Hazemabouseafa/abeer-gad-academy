import { NextResponse } from 'next/server';
import { getTransactions, saveTransaction, deleteTransaction, recordStudent } from '@/lib/data-store';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      paypalOrderId,
      payerEmail,
      payerName,
      payerPhone,
      itemTitle,
      itemType,
      amount,
      currency,
      status,
      date,
      alsoRecordStudent,
    } = body;

    if (!payerEmail || !itemTitle) {
      return NextResponse.json(
        { success: false, error: 'Payer email and item title are required' },
        { status: 400 }
      );
    }

    const tx = saveTransaction({
      id,
      paypalOrderId: paypalOrderId || `MAN-${Date.now().toString().slice(-6)}`,
      payerEmail,
      payerName: payerName || '',
      payerPhone: payerPhone || '',
      itemTitle,
      itemType: itemType === 'PRIVATE_LESSON' ? 'PRIVATE_LESSON' : 'COURSE',
      amount: Number(amount) || 0,
      currency: currency || 'USD',
      status: status || 'COMPLETED',
      date: date || new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    if (alsoRecordStudent && payerEmail) {
      recordStudent({
        name: payerName || payerEmail.split('@')[0],
        email: payerEmail,
        phone: payerPhone || undefined,
        itemType: itemType === 'PRIVATE_LESSON' ? 'PRIVATE_LESSON' : 'COURSE',
      });
    }

    return NextResponse.json({
      success: true,
      transaction: tx,
      transactions: getTransactions(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save transaction' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status required' }, { status: 400 });
    }
    const txs = getTransactions();
    const existing = txs.find((t) => t.id === id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
    }
    const updated = saveTransaction({
      ...existing,
      status,
    });
    return NextResponse.json({
      success: true,
      transaction: updated,
      transactions: getTransactions(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Transaction ID is required' }, { status: 400 });
    }
    deleteTransaction(id);
    return NextResponse.json({
      success: true,
      transactions: getTransactions(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete transaction' }, { status: 500 });
  }
}
