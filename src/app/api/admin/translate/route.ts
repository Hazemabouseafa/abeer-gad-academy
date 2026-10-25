import { NextResponse } from 'next/server';
import { translateSingle, translateFieldsObject } from '@/lib/translate';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, texts, fields, from = 'ar', to = 'en', targetLangs } = body;

    // Multi-target language batch translation (e.g. ['en', 'fr', 'de', 'zh'])
    if (Array.isArray(targetLangs) && targetLangs.length > 0) {
      const results: Record<string, any> = {};
      await Promise.all(
        targetLangs.map(async (lang: string) => {
          if (typeof text === 'string') {
            results[lang] = await translateSingle(text, from, lang);
          } else if (Array.isArray(texts)) {
            results[lang] = await Promise.all(
              texts.map((item) => (typeof item === 'string' ? translateSingle(item, from, lang) : item))
            );
          } else if (fields && typeof fields === 'object') {
            results[lang] = await translateFieldsObject(fields, from, lang);
          }
        })
      );
      return NextResponse.json({ success: true, multiResults: results, from, targetLangs });
    }

    // Single text translation
    if (typeof text === 'string') {
      const translated = await translateSingle(text, from, to);
      return NextResponse.json({ success: true, text: translated, from, to });
    }

    // Array of texts translation
    if (Array.isArray(texts)) {
      const results = await Promise.all(
        texts.map(async (item: string) => {
          if (typeof item !== 'string') return item;
          return translateSingle(item, from, to);
        })
      );
      return NextResponse.json({ success: true, texts: results, from, to });
    }

    // Key-value fields translation (e.g. { titleAr: "...", featuresAr: ["..."] })
    if (fields && typeof fields === 'object') {
      const translatedFields = await translateFieldsObject(fields, from, to);
      return NextResponse.json({ success: true, translatedFields, from, to });
    }

    return NextResponse.json(
      { success: false, error: 'Provide text, texts, or fields to translate' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('Translate API Route Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal translation error' },
      { status: 500 }
    );
  }
}


