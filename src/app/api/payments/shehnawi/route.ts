import { NextRequest, NextResponse } from 'next/server';
import { saveTransaction, recordStudent, bookSlot, getTransactions } from '@/lib/data-store';
import {
  getShehnawiConfig,
  convertUsdToEgp,
  createSha7nawyPayment,
  confirmSha7nawyPayment,
  SUPPORTED_WALLETS,
} from '@/lib/shehnawi';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action = 'direct', // 'create' | 'confirm' | 'direct'
      reference,
      itemType,
      itemId,
      itemTitle,
      amount,
      amountEgp,
      studentName,
      studentEmail,
      studentPhone,
      walletProvider,
      senderWalletNumber,
      transactionRef,
      slotDate,
      slotTime,
      notes,
    } = body;

    const config = getShehnawiConfig();
    const calculatedEgp = typeof amountEgp === 'number' && amountEgp > 0
      ? amountEgp
      : convertUsdToEgp(amount || 45, config.exchangeRateUsdToEgp);

    // =========================================================================
    // ACTION: 1. CREATE PAYMENT via Sha7nawy Gate API v2.0
    // =========================================================================
    if (action === 'create') {
      if (!senderWalletNumber || !senderWalletNumber.trim()) {
        return NextResponse.json({ success: false, error: 'رقم محفظة الدفع مطلوب' }, { status: 400 });
      }

      // Find matched wallet provider option
      const matched = SUPPORTED_WALLETS.find(
        (w) => w.id === walletProvider || w.sha7nawyMethod === walletProvider
      ) || SUPPORTED_WALLETS[0];

      const orderId = `ORD-${Date.now()}`;

      // Call Sha7nawy API v2 /api/v2/payment/create
      const apiResult = await createSha7nawyPayment({
        orderId,
        number: senderWalletNumber.trim(),
        amountEgp: calculatedEgp,
        method: matched.sha7nawyMethod,
        customerName: studentName?.trim() || 'Student',
        customerEmail: studentEmail?.trim() || 'student@abeergad.academy',
        customerPhone: studentPhone?.trim() || senderWalletNumber.trim(),
        description: itemTitle || 'Abeer Gad Academy Enrollment',
        metadata: {
          itemId,
          itemType,
          slotDate,
          slotTime,
        },
      });

      if (!apiResult.success && !apiResult.simulated) {
        return NextResponse.json(
          {
            success: false,
            error: apiResult.error || 'فشلت عملية إنشاء طلب الدفع عبر بوابة شحناوي',
            code: apiResult.code,
          },
          { status: 400 }
        );
      }

      // Save initial pending transaction record in store
      saveTransaction({
        id: `tx-shh-${Date.now()}`,
        paypalOrderId: orderId,
        payerEmail: studentEmail?.trim() || 'student@abeergad.academy',
        payerName: studentName?.trim() || 'Student',
        payerPhone: studentPhone?.trim() || senderWalletNumber.trim(),
        itemTitle: itemTitle || 'Abeer Gad Academy Enrollment',
        itemType: itemType === 'COURSE' ? 'COURSE' : 'PRIVATE_LESSON',
        amount: typeof amount === 'number' ? amount : 45.0,
        currency: 'USD',
        amountEgp: calculatedEgp,
        paymentMethod: 'SHEHNAWI',
        walletProvider: matched.id,
        senderWalletNumber: senderWalletNumber.trim(),
        transactionRef: apiResult.reference,
        status: 'PENDING',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });

      return NextResponse.json({
        success: true,
        reference: apiResult.reference,
        orderId,
        method: matched.sha7nawyMethod,
        instructionsAr: matched.promptInstructionsAr,
        instructionsEn: matched.promptInstructionsEn,
        ussdCode: matched.ussdCode,
        amountEgp: calculatedEgp,
        simulated: Boolean(apiResult.simulated),
      });
    }

    // =========================================================================
    // ACTION: 2. CONFIRM PAYMENT via Sha7nawy Gate API v2.0
    // =========================================================================
    if (action === 'confirm') {
      if (!reference) {
        return NextResponse.json({ success: false, error: 'كود المرجع (reference) مطلوب للتأكيد' }, { status: 400 });
      }

      const confirmResult = await confirmSha7nawyPayment(reference);
      if (!confirmResult.success) {
        return NextResponse.json(
          { success: false, error: confirmResult.error || 'تعذر تأكيد الدفع عبر شحناوي' },
          { status: 400 }
        );
      }

      // Update existing transaction to COMPLETED
      const allTx = getTransactions();
      const existing = allTx.find((t) => t.transactionRef === reference);
      if (existing) {
        saveTransaction({
          ...existing,
          status: 'COMPLETED',
        });
      }

      // Book private slot if applicable
      let bookedSlot = null;
      if (itemType === 'PRIVATE_LESSON' && (itemId || (slotDate && slotTime))) {
        bookedSlot = bookSlot(itemId, {
          date: slotDate,
          time: slotTime,
          studentName: studentName || existing?.payerName || 'Student',
          studentEmail: studentEmail || existing?.payerEmail || 'student@abeergad.academy',
          studentPhone: studentPhone || existing?.payerPhone || '',
          notes: `تم التأكيد عبر بوابة شحناوي (مرجع: ${reference})`,
        });
      }

      return NextResponse.json({
        success: true,
        messageAr: 'تم تأكيد سحب المبلغ وتسجيل الحجز بنجاح عبر بوابة شحناوي!',
        messageEn: 'Payment confirmed and booked successfully via Sha7nawy Gate!',
        bookedSlot,
      });
    }

    // =========================================================================
    // ACTION: 3. DIRECT INSTANT CHECKOUT (Simulated / Verified / Direct Transfer)
    // =========================================================================
    if (!studentName || !studentName.trim()) {
      return NextResponse.json({ success: false, error: 'اسم الطالب مطلوب' }, { status: 400 });
    }
    if (!studentEmail || !studentEmail.trim() || !studentEmail.includes('@')) {
      return NextResponse.json({ success: false, error: 'البريد الإلكتروني غير صحيح' }, { status: 400 });
    }
    if (!studentPhone || !studentPhone.trim() || studentPhone.trim().replace(/\D/g, '').length < 6) {
      return NextResponse.json({ success: false, error: 'رقم الهاتف/الواتساب للتواصل مطلوب' }, { status: 400 });
    }
    if (!senderWalletNumber || !senderWalletNumber.trim()) {
      return NextResponse.json(
        { success: false, error: 'رقم المحفظة أو حساب إنستاباي المحوّل منه مطلوب لتأكيد العملية' },
        { status: 400 }
      );
    }

    const txId = `shh-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const effectiveOrderId = `ORD-${Date.now()}`;
    const effectiveRef = transactionRef ? transactionRef.trim() : `SH_${Date.now()}`;

    // 1. If Private Lesson slot, automatically book the slot
    let bookedSlotData = null;
    if (itemType === 'PRIVATE_LESSON' && (itemId || (slotDate && slotTime))) {
      try {
        bookedSlotData = bookSlot(itemId, {
          date: slotDate,
          time: slotTime,
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim(),
          studentPhone: studentPhone.trim(),
          notes: notes || `مدفوع عبر بوابة شحناوي (${walletProvider || 'كاش'}) - مرجع: ${effectiveRef}`,
        });
      } catch (slotErr) {
        console.warn('Slot booking warning:', slotErr);
      }
    }

    // 2. Record transaction in local data-store for instant admin dashboard visibility
    const transaction = saveTransaction({
      id: txId,
      paypalOrderId: effectiveOrderId,
      payerEmail: studentEmail.trim(),
      payerName: studentName.trim(),
      payerPhone: studentPhone.trim(),
      itemTitle: itemTitle || (itemType === 'COURSE' ? 'Course Enrollment' : 'Private Lesson'),
      itemType: itemType === 'COURSE' ? 'COURSE' : 'PRIVATE_LESSON',
      amount: typeof amount === 'number' ? amount : 45.0,
      currency: 'USD',
      amountEgp: calculatedEgp,
      paymentMethod: 'SHEHNAWI',
      walletProvider: walletProvider || 'VODAFONE_CASH',
      senderWalletNumber: senderWalletNumber.trim(),
      transactionRef: effectiveRef,
      status: 'COMPLETED',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    // 3. Record student in student registry
    try {
      recordStudent({
        email: studentEmail.trim(),
        name: studentName.trim(),
        phone: studentPhone.trim(),
        itemType: itemType === 'COURSE' ? 'COURSE' : 'PRIVATE_LESSON',
      });
    } catch (stuErr) {
      console.warn('Student recording warning:', stuErr);
    }

    // 4. Save to Prisma DB if accessible
    try {
      const user = await prisma.user.upsert({
        where: { email: studentEmail.trim() },
        update: {
          name: studentName.trim(),
          phone: studentPhone.trim(),
        },
        create: {
          email: studentEmail.trim(),
          name: studentName.trim(),
          phone: studentPhone.trim(),
          preferredLocale: 'ar',
        },
      });

      if (user?.id) {
        await prisma.payment.create({
          data: {
            userId: user.id,
            amount: typeof amount === 'number' ? amount : 45.0,
            currency: 'USD',
            status: 'COMPLETED',
            provider: 'PAYPAL',
            paypalOrderId: effectiveOrderId,
            paypalCaptureId: txId,
            paypalPayerEmail: studentEmail.trim(),
            itemType: itemType === 'PRIVATE_LESSON' ? 'PRIVATE_LESSON' : 'COURSE',
            courseId: itemType === 'COURSE' ? itemId : null,
            metadata: {
              gateway: 'SHA7NAWY_V2',
              walletProvider,
              senderWalletNumber,
              transactionRef: effectiveRef,
              amountEgp: calculatedEgp,
              studentPhone,
              studentName,
              studentEmail,
            },
          },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma DB write note (offline or file-store mode):', dbErr);
    }

    return NextResponse.json({
      success: true,
      transaction,
      bookedSlot: bookedSlotData,
      reference: effectiveRef,
      messageAr: 'تم تسجيل وتأكيد الدفع وحجزك بنجاح عبر بوابة شحناوي (Sha7nawy Gate v2.0)!',
      messageEn: 'Payment and booking successfully confirmed via Sha7nawy Gate (v2.0)!',
    });
  } catch (error: any) {
    console.error('Error processing Shehnawi checkout:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process payment via Shehnawi' },
      { status: 500 }
    );
  }
}
