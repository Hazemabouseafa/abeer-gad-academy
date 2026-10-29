import { NextResponse } from 'next/server';
import {
  getCustomPaymentMethods,
  saveCustomPaymentMethod,
  deleteCustomPaymentMethod,
  toggleCustomPaymentMethod,
} from '@/lib/data-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const methods = getCustomPaymentMethods();
    return NextResponse.json({ success: true, methods });
  } catch (error) {
    console.error('Error fetching custom payment methods:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch payment methods' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === 'toggle' && body.id) {
      const activeState = toggleCustomPaymentMethod(body.id);
      return NextResponse.json({ success: true, active: activeState, methods: getCustomPaymentMethods() });
    }

    if (!body.name || !body.nameAr) {
      return NextResponse.json({ success: false, error: 'Name and NameAr are required' }, { status: 400 });
    }

    const method = saveCustomPaymentMethod(body);
    return NextResponse.json({ success: true, method, methods: getCustomPaymentMethods() });
  } catch (error) {
    console.error('Error saving custom payment method:', error);
    return NextResponse.json({ success: false, error: 'Failed to save payment method' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Payment method ID is required' }, { status: 400 });
    }
    const deleted = deleteCustomPaymentMethod(id);
    return NextResponse.json({ success: deleted, methods: getCustomPaymentMethods() });
  } catch (error) {
    console.error('Error deleting custom payment method:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete payment method' }, { status: 500 });
  }
}
