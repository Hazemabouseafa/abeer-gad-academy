import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const eventType = payload.event_type;

    console.log(`[PayPal Webhook Received] Event: ${eventType}`, payload.id);

    // Verify webhook payload
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = payload.resource;
      const captureId = resource.id;
      const orderId = resource.supplementary_data?.related_ids?.order_id;
      const status = resource.status; // 'COMPLETED'

      if (orderId) {
        try {
          await prisma.payment.updateMany({
            where: { paypalOrderId: orderId },
            data: {
              status: 'COMPLETED',
              paypalCaptureId: captureId,
              updatedAt: new Date(),
            },
          });
          console.log(`Payment status updated to COMPLETED for order: ${orderId}`);
        } catch (dbError) {
          console.warn('Webhook DB update skipped:', dbError);
        }
      }
    }

    if (eventType === 'CHECKOUT.ORDER.APPROVED') {
      const orderId = payload.resource?.id;
      console.log(`Checkout Order Approved by user for order: ${orderId}`);
    }

    return NextResponse.json({ received: true, status: 'processed' }, { status: 200 });
  } catch (error: unknown) {
    console.error('PayPal Webhook handling error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
