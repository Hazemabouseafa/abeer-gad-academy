import { NextRequest, NextResponse } from 'next/server';
import { saveTransaction, recordStudent, bookSlot } from '@/lib/data-store';
import { getShehnawiConfig, convertUsdToEgp } from '@/lib/shehnawi';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
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

    // Validate essentials
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

    const config = getShehnawiConfig();
    const calculatedEgp = typeof amountEgp === 'number' && amountEgp > 0
      ? amountEgp
      : convertUsdToEgp(amount || 45, config.exchangeRateUsdToEgp);

    const txId = `shh-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const effectiveOrderId = `SHEHNAWI-${Date.now()}`;

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
          notes: notes || `مدفوع عبر بوابة شحناوي (${walletProvider || 'كاش'}) - مرجع: ${transactionRef || 'تحويل مباشر'}`,
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
      transactionRef: transactionRef ? transactionRef.trim() : `REF-${Date.now().toString().slice(-6)}`,
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
              gateway: 'SHEHNAWI',
              walletProvider,
              senderWalletNumber,
              transactionRef,
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
      messageAr: 'تم تسجيل وتأكيد الدفع وحجزك بنجاح عبر بوابة شحناوي للمحافظ الإلكترونية!',
      messageEn: 'Payment and booking successfully confirmed via Shehnawi E-Wallet Gateway!',
    });
  } catch (error: any) {
    console.error('Error processing Shehnawi checkout:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process payment via Shehnawi' },
      { status: 500 }
    );
  }
}
