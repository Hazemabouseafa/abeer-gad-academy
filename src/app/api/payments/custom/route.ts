import { NextResponse } from 'next/server';
import {
  saveTransaction,
  recordStudent,
  bookSlot,
  getCustomPaymentMethods,
  getSiteSettings,
} from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      methodId,
      methodName,
      referenceNumber,
      itemId,
      itemType,
      itemTitle,
      amount,
      currency,
      amountEgp,
      studentName,
      studentEmail,
      studentPhone,
      notes,
      slotDate,
      slotTime,
    } = body;

    if (!studentName || !studentEmail) {
      return NextResponse.json(
        { success: false, error: 'Student name and email are required' },
        { status: 400 }
      );
    }

    const customMethods = getCustomPaymentMethods();
    const matchedMethod = customMethods.find((m) => m.id === methodId || m.name === methodName);
    const resolvedMethodName = matchedMethod?.name || methodName || 'CUSTOM_TRANSFER';

    const orderId = `CPM-${Date.now().toString().slice(-6)}`;
    const tx = saveTransaction({
      paypalOrderId: orderId,
      payerEmail: studentEmail,
      payerName: studentName,
      payerPhone: studentPhone || '',
      itemTitle: itemTitle || 'Academy Enrollment',
      itemType: (itemType as any) || 'PRIVATE_LESSON',
      amount: Number(amount) || 0,
      currency: currency || 'USD',
      amountEgp: amountEgp ? Number(amountEgp) : undefined,
      status: 'PENDING',
      paymentMethod: resolvedMethodName,
      customMethodId: matchedMethod?.id || methodId,
      customMethodName: resolvedMethodName,
      referenceNumber: referenceNumber || '',
      transactionRef: referenceNumber || orderId,
      notes: notes || `Direct transfer via ${resolvedMethodName}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    // If booking a private lesson slot, book and reserve the slot
    let bookedSlot = null;
    if (slotDate && slotTime) {
      bookedSlot = bookSlot('', {
        date: slotDate,
        time: slotTime,
        studentName,
        studentEmail,
        studentPhone: studentPhone || '',
        notes: `Transfer via ${resolvedMethodName} - Ref: ${referenceNumber || 'N/A'}${notes ? ` | ${notes}` : ''}`,
      });
    }

    // Record student profile
    recordStudent({
      name: studentName,
      email: studentEmail,
      phone: studentPhone || undefined,
      itemType: (itemType as any) || 'PRIVATE_LESSON',
    });

    const settings = getSiteSettings();

    return NextResponse.json({
      success: true,
      transactionId: tx.id,
      orderId,
      status: 'PENDING',
      message: 'Payment transfer submitted successfully',
      slot: bookedSlot,
      contactPhone: settings.whatsappNumber || settings.contactPhone || '+201000000000',
    });
  } catch (error: any) {
    console.error('Error submitting custom payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit payment' },
      { status: 500 }
    );
  }
}
