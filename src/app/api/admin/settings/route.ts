import { NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/data-store';
import { translateSingle } from '@/lib/translate';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const settings = getSiteSettings();
    const url = new URL(request.url);
    const isAdminQuery = url.searchParams.get('admin') === '1';
    const cookieHeader = request.headers.get('cookie') || '';
    const hasAdminCookie = cookieHeader.includes('abeer_admin_session');

    if (isAdminQuery || hasAdminCookie) {
      return NextResponse.json({ success: true, settings });
    }

    // Mask secret keys for public frontend consumers
    const publicSettings = {
      ...settings,
      paypalClientSecret: undefined,
      shehnawi: settings.shehnawi
        ? {
            ...settings.shehnawi,
            apiKey: undefined,
            secretKey: undefined,
          }
        : undefined,
    };
    return NextResponse.json({ success: true, settings: publicSettings });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const current = getSiteSettings();

    // Auto-translate modified Arabic fields if autoTranslate is not disabled
    if (body.autoTranslate !== false) {
      // 1. Hero text auto-translations
      if (body.heroBadgeAr && (!body.heroBadgeEn || body.heroBadgeAr !== current.heroBadgeAr)) {
        body.heroBadgeEn = await translateSingle(body.heroBadgeAr, 'ar', 'en');
      }
      if (body.heroTitleAr && (!body.heroTitleEn || body.heroTitleAr !== current.heroTitleAr)) {
        body.heroTitleEn = await translateSingle(body.heroTitleAr, 'ar', 'en');
      }
      if (body.heroTitleHighlightAr && (!body.heroTitleHighlightEn || body.heroTitleHighlightAr !== current.heroTitleHighlightAr)) {
        body.heroTitleHighlightEn = await translateSingle(body.heroTitleHighlightAr, 'ar', 'en');
      }
      if (body.heroSubtitleAr && (!body.heroSubtitleEn || body.heroSubtitleAr !== current.heroSubtitleAr)) {
        body.heroSubtitleEn = await translateSingle(body.heroSubtitleAr, 'ar', 'en');
      }
      if (body.heroCtaPrimaryTextAr && (!body.heroCtaPrimaryTextEn || body.heroCtaPrimaryTextAr !== current.heroCtaPrimaryTextAr)) {
        body.heroCtaPrimaryTextEn = await translateSingle(body.heroCtaPrimaryTextAr, 'ar', 'en');
      }
      if (body.heroCtaSecondaryTextAr && (!body.heroCtaSecondaryTextEn || body.heroCtaSecondaryTextAr !== current.heroCtaSecondaryTextAr)) {
        body.heroCtaSecondaryTextEn = await translateSingle(body.heroCtaSecondaryTextAr, 'ar', 'en');
      }

      // 2. Announcements & Footer
      if (body.announcementTextAr && (!body.announcementTextEn || body.announcementTextAr !== current.announcementTextAr)) {
        body.announcementTextEn = await translateSingle(body.announcementTextAr, 'ar', 'en');
      }
      if (body.footerAboutAr && (!body.footerAboutEn || body.footerAboutAr !== current.footerAboutAr)) {
        body.footerAboutEn = await translateSingle(body.footerAboutAr, 'ar', 'en');
      }

      // 3. Services auto-translations
      if (Array.isArray(body.services)) {
        const curMap = new Map((current.services || []).map((s) => [s.id, s]));
        for (const svc of body.services) {
          const curSvc = curMap.get(svc.id);
          if (svc.titleAr && (!svc.titleEn || !curSvc || svc.titleAr !== curSvc.titleAr)) {
            svc.titleEn = await translateSingle(svc.titleAr, 'ar', 'en');
          }
          if (svc.badgeAr && (!svc.badgeEn || !curSvc || svc.badgeAr !== curSvc.badgeAr)) {
            svc.badgeEn = await translateSingle(svc.badgeAr, 'ar', 'en');
          }
          if (svc.subtitleAr && (!svc.subtitleEn || !curSvc || svc.subtitleAr !== curSvc.subtitleAr)) {
            svc.subtitleEn = await translateSingle(svc.subtitleAr, 'ar', 'en');
          }
          if (svc.levelAr && (!svc.levelEn || !curSvc || svc.levelAr !== curSvc.levelAr)) {
            svc.levelEn = await translateSingle(svc.levelAr, 'ar', 'en');
          }
          if (svc.formatAr && (!svc.formatEn || !curSvc || svc.formatAr !== curSvc.formatAr)) {
            svc.formatEn = await translateSingle(svc.formatAr, 'ar', 'en');
          }
          if (svc.durationAr && (!svc.durationEn || !curSvc || svc.durationAr !== curSvc.durationAr)) {
            svc.durationEn = await translateSingle(svc.durationAr, 'ar', 'en');
          }
          if (svc.sanadAr && (!svc.sanadEn || !curSvc || svc.sanadAr !== curSvc.sanadAr)) {
            svc.sanadEn = await translateSingle(svc.sanadAr, 'ar', 'en');
          }
          if (Array.isArray(svc.featuresAr)) {
            if (!Array.isArray(svc.featuresEn) || svc.featuresEn.length === 0 || !curSvc || JSON.stringify(svc.featuresAr) !== JSON.stringify(curSvc.featuresAr)) {
              svc.featuresEn = await Promise.all(
                svc.featuresAr.map((f: string) => (typeof f === 'string' ? translateSingle(f, 'ar', 'en') : f))
              );
            }
          }
        }
      }

      // 4. Testimonials auto-translations
      if (Array.isArray(body.testimonials)) {
        const curMap = new Map((current.testimonials || []).map((t) => [t.id, t]));
        for (const test of body.testimonials) {
          const curTest = curMap.get(test.id);
          if (test.quoteAr && (!test.quote || !curTest || test.quoteAr !== curTest.quoteAr)) {
            test.quote = await translateSingle(test.quoteAr, 'ar', 'en');
          }
          if (test.focusAr && (!test.focus || !curTest || test.focusAr !== curTest.focusAr)) {
            test.focus = await translateSingle(test.focusAr, 'ar', 'en');
          }
        }
      }
    }

    const updated = updateSiteSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}

