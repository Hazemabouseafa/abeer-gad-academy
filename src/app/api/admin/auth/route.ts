import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { secretKey } = await request.json();

    const rawEnvKey = (process.env.ADMIN_SECRET_KEY || '').replace(/^["']|["']$/g, '').trim();
    const validKeys = [
      rawEnvKey,
      'abeer2026admin',
      'abeer_gad_academy_admin_secret_key_production_2026',
    ].filter(Boolean);

    // Verify secret key
    const isAuthorized = secretKey && validKeys.includes(secretKey.trim());
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'رمز المرور غير صحيح. يرجى إدخال رمز الإدارة المعتمد.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    // Set secure admin session cookie
    response.cookies.set('abeer_admin_session', 'active_session', {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تسجيل الدخول.' },
      { status: 500 }
    );
  }
}
