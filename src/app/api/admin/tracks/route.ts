import { NextResponse } from 'next/server';
import {
  getTracks,
  saveTrack,
  deleteTrack,
  saveTrackItem,
  deleteTrackItem,
} from '@/lib/data-store';
import { translateSingle } from '@/lib/translate';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tracks = getTracks();
    return NextResponse.json({ success: true, tracks });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch tracks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // 1. Delete track action
    if (action === 'delete-track') {
      const { trackId } = body;
      if (!trackId) {
        return NextResponse.json({ success: false, error: 'trackId is required' }, { status: 400 });
      }
      const deleted = deleteTrack(trackId);
      return NextResponse.json({ success: deleted, tracks: getTracks() });
    }

    // 2. Save/Update track item action (الحاجات اللي داخل المسار)
    if (action === 'save-item') {
      const { trackId, itemData } = body;
      if (!trackId || !itemData) {
        return NextResponse.json({ success: false, error: 'trackId and itemData are required' }, { status: 400 });
      }

      // Auto-translate if Arabic provided and English missing
      if (itemData.titleAr && !itemData.title) {
        itemData.title = await translateSingle(itemData.titleAr, 'ar', 'en');
      }
      if (itemData.descAr && !itemData.desc) {
        itemData.desc = await translateSingle(itemData.descAr, 'ar', 'en');
      }
      if (itemData.levelAr && !itemData.level) {
        itemData.level = await translateSingle(itemData.levelAr, 'ar', 'en');
      }
      if (itemData.durationAr && !itemData.duration) {
        itemData.duration = await translateSingle(itemData.durationAr, 'ar', 'en');
      }
      if (Array.isArray(itemData.pointsAr) && (!Array.isArray(itemData.points) || itemData.points.length === 0)) {
        itemData.points = await Promise.all(
          itemData.pointsAr.map((p: string) => translateSingle(p, 'ar', 'en'))
        );
      }

      const savedItem = saveTrackItem(trackId, itemData);
      return NextResponse.json({ success: true, item: savedItem, tracks: getTracks() });
    }

    // 3. Delete track item action (حذف حاجة من داخل المسار)
    if (action === 'delete-item') {
      const { trackId, itemId } = body;
      if (!trackId || !itemId) {
        return NextResponse.json({ success: false, error: 'trackId and itemId are required' }, { status: 400 });
      }
      const deleted = deleteTrackItem(trackId, itemId);
      return NextResponse.json({ success: deleted, tracks: getTracks() });
    }

    // 4. Default: Save/Update Track (إضافة أو تعديل مسار)
    const trackData = body.trackData || body;

    // Auto-translate track if Arabic provided and English missing
    if (trackData.titleAr && !trackData.titleEn) {
      trackData.titleEn = await translateSingle(trackData.titleAr, 'ar', 'en');
    }
    if (trackData.badgeAr && !trackData.badgeEn) {
      trackData.badgeEn = await translateSingle(trackData.badgeAr, 'ar', 'en');
    }
    if (trackData.subtitleAr && !trackData.subtitleEn) {
      trackData.subtitleEn = await translateSingle(trackData.subtitleAr, 'ar', 'en');
    }
    if (trackData.levelAr && !trackData.levelEn) {
      trackData.levelEn = await translateSingle(trackData.levelAr, 'ar', 'en');
    }
    if (trackData.formatAr && !trackData.formatEn) {
      trackData.formatEn = await translateSingle(trackData.formatAr, 'ar', 'en');
    }
    if (trackData.durationAr && !trackData.durationEn) {
      trackData.durationEn = await translateSingle(trackData.durationAr, 'ar', 'en');
    }
    if (trackData.sanadAr && !trackData.sanadEn) {
      trackData.sanadEn = await translateSingle(trackData.sanadAr, 'ar', 'en');
    }

    const saved = saveTrack(trackData);
    return NextResponse.json({ success: true, track: saved, tracks: getTracks() });
  } catch (error: any) {
    console.error('Error in tracks API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process track request' },
      { status: 500 }
    );
  }
}
