import { NextRequest, NextResponse } from 'next/server';
import { getShehnawiConfig, verifySha7nawyWebhookSignature } from '@/lib/shehnawi';
import { getTransactions, saveTransaction, recordStudent, bookSlot } from '@/lib/data-store';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-sha7nawy-signature-256');
    const eventHeader = request.headers.get('x-sha7nawy-event');
    const config = getShehnawiConfig();

    // Verify HMAC-SHA256 signature if secretKey is set
    if (config.secretKey && config.secretKey !== 'YOUR_SECRET_KEY_HERE') {
      const isValid = verifySha7nawyWebhookSignature(rawBody, signature, config.secretKey);
      if (!isValid) {
        console.warn('Sha7nawy webhook signature verification failed!');
        return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event || eventHeader;
    const data = payload.data || {};

    const reference = data.reference;
    const orderId = data.order_id;
    const status = data.status; // 'completed' | 'rejected'
    const amountEgp = Number(data.amount) || 0;
    const clientName = data.client || 'Student';
    const clientPhone = data.number || '';
    const method = data.method; // 'vf_cash' | 'or_cash' | 'et_cash'

    console.log(`[Sha7nawy Webhook] Received event: ${event} for ref: ${reference}, order: ${orderId}`);

    if (event === 'transaction.completed' || status === 'completed') {
      // Find matching existing transaction or create new verified record
      const allTransactions = getTransactions();
      const existing = allTransactions.find(
        (t) =>
          t.transactionRef === reference ||
          t.paypalOrderId === orderId ||
          t.id === orderId
      );

      const effectiveUsd = existing?.amount || Math.round(amountEgp / (config.exchangeRateUsdToEgp || 50));

      saveTransaction({
        id: existing?.id || `tx-shh-${Date.now()}`,
        paypalOrderId: orderId || `SHEHNAWI-${Date.now()}`,
        payerEmail: existing?.payerEmail || 'student@abeergad.academy',
        payerName: clientName || existing?.payerName || 'Student',
        payerPhone: clientPhone || existing?.payerPhone,
        itemTitle: existing?.itemTitle || data.details || 'Abeer Gad Academy Enrollment',
        itemType: existing?.itemType || 'PRIVATE_LESSON',
        amount: effectiveUsd,
        amountEgp: amountEgp || existing?.amountEgp,
        currency: 'USD',
        status: 'COMPLETED',
        paymentMethod: 'SHEHNAWI',
        walletProvider: method || existing?.walletProvider || 'vf_cash',
        senderWalletNumber: clientPhone,
        transactionRef: reference,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });

      // Record student
      try {
        recordStudent({
          email: existing?.payerEmail || 'student@abeergad.academy',
          name: clientName || existing?.payerName || 'Student',
          phone: clientPhone || existing?.payerPhone,
          itemType: existing?.itemType || 'PRIVATE_LESSON',
        });
      } catch (stuErr) {
        console.warn('Student record notice:', stuErr);
      }

      // If tied to a slot booking by orderId
      if (orderId && orderId.startsWith('ORD-SLOT-')) {
        const parts = orderId.replace('ORD-SLOT-', '').split('-');
        if (parts.length >= 2) {
          try {
            bookSlot('', {
              date: parts[0],
              time: parts[1],
              studentName: clientName,
              studentEmail: existing?.payerEmail || 'student@abeergad.academy',
              studentPhone: clientPhone,
              notes: `تم التأكيد التلقائي عبر ويب هوك شحناوي (مرجع: ${reference})`,
            });
          } catch (slotErr) {
            console.warn('Slot booking error via webhook:', slotErr);
          }
        }
      }

      // Update Prisma payment record if available
      try {
        const paymentRecord = await prisma.payment.findFirst({
          where: {
            OR: [
              { paypalOrderId: orderId },
              { paypalCaptureId: reference },
            ],
          },
        });

        if (paymentRecord) {
          await prisma.payment.update({
            where: { id: paymentRecord.id },
            data: { status: 'COMPLETED' },
          });
        }
      } catch (dbErr) {
        // Prisma offline mode
      }

      return NextResponse.json({
        success: true,
        message: 'Transaction completed and processed successfully',
        reference,
      });
    }

    if (event === 'transaction.rejected' || status === 'rejected') {
      const allTransactions = getTransactions();
      const existing = allTransactions.find(
        (t) =>
          t.transactionRef === reference ||
          t.paypalOrderId === orderId
      );

      if (existing) {
        saveTransaction({
          ...existing,
          status: 'REFUNDED',
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Transaction marked as rejected',
        reference,
      });
    }

    return NextResponse.json({ success: true, message: 'Event received' });
  } catch (error: any) {
    console.error('Sha7nawy webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook internal error' },
      { status: 500 }
    );
  }
}
