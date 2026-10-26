import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';
import { saveTransaction } from '@/lib/data-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      orderId,
      itemType,
      itemId,
      amount,
      currency = 'USD',
      description,
      studentEmail,
      studentName,
      studentPhone,
    } = body;

    if (action === 'create') {
      if (!amount) {
        return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
      }

      if (!studentPhone || !studentPhone.trim() || studentPhone.trim().replace(/\D/g, '').length < 6) {
        return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 });
      }

      const order = await createPayPalOrder({
        amount,
        currency,
        description: description || 'ABEER GAD Academy Enrollment',
        customId: itemId,
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        status: order.status,
        simulated: Boolean(order.simulated),
      });
    }

    if (action === 'capture') {
      if (!orderId) {
        return NextResponse.json({ error: 'orderId is required for capture' }, { status: 400 });
      }

      const captureResult = await capturePayPalOrder(orderId);

      // Attempt to record payment transaction in Prisma
      try {
        let userId: string | null = null;
        if (studentEmail) {
          const user = await prisma.user.upsert({
            where: { email: studentEmail },
            update: {
              name: studentName || 'Student',
              phone: studentPhone || undefined,
            },
            create: {
              email: studentEmail,
              name: studentName || 'Student',
              phone: studentPhone || null,
              preferredLocale: 'ar',
            },
          });
          userId = user.id;
        }

        if (userId) {
          await prisma.payment.create({
            data: {
              userId,
              amount: typeof amount === 'number' ? amount : 45.0,
              currency,
              status: captureResult.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
              provider: 'PAYPAL',
              paypalOrderId: orderId,
              paypalCaptureId: captureResult.captureId || captureResult.id,
              paypalPayerEmail: studentEmail || null,
              itemType: itemType === 'PRIVATE_LESSON' ? 'PRIVATE_LESSON' : 'COURSE',
              courseId: itemType === 'COURSE' ? itemId : null,
              metadata: {
                captureResult,
                studentPhone,
                studentName,
                studentEmail,
              },
            },
          });
        }
      } catch (dbErr) {
        console.warn('Note: Database payment record skipped (offline mode):', dbErr);
      }

      // Record in local data-store for admin dashboard
      try {
        saveTransaction({
          paypalOrderId: orderId,
          payerEmail: studentEmail || captureResult?.payer?.email_address || 'student@abeergad.academy',
          itemTitle: description || (itemType === 'COURSE' ? 'Course Enrollment' : 'Private Lesson'),
          itemType: itemType === 'PRIVATE_LESSON' ? 'PRIVATE_LESSON' : 'COURSE',
          amount: typeof amount === 'number' ? amount : 45.0,
          currency,
          status: captureResult.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        });
      } catch (storeErr) {
        console.warn('Note: Local store transaction record skipped:', storeErr);
      }

      return NextResponse.json({
        success: true,
        status: captureResult.status,
        orderId,
        message: 'Payment completed successfully',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    console.error('Checkout API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown checkout error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
