import { NextResponse } from 'next/server';

const translationCache = new Map<string, string>();

function decodeEntities(str: string): string {
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

async function translateSingle(text: string, from = 'ar', to = 'en'): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  const cacheKey = `${from}:${to}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${from}|${to}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AbeerGadAcademyTranslator/1.0',
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      return text;
    }

    const data = await res.json();
    let translated = data?.responseData?.translatedText;
    if (typeof translated === 'string' && translated.trim()) {
      translated = decodeEntities(translated.trim());
      if (translationCache.size > 2000) translationCache.clear();
      translationCache.set(cacheKey, translated);
      return translated;
    }
    return text;
  } catch (err) {
    console.error('Translation helper error:', err);
    return text;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, texts, fields, from = 'ar', to = 'en' } = body;

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
      const translatedFields: Record<string, any> = {};

      for (const [key, val] of Object.entries(fields)) {
        // Derive target key: e.g. titleAr -> titleEn, or keep key as is
        const targetKey = key.endsWith('Ar')
          ? key.replace(/Ar$/, to === 'en' ? 'En' : to.toUpperCase())
          : `${key}_${to}`;

        if (typeof val === 'string') {
          translatedFields[targetKey] = await translateSingle(val, from, to);
        } else if (Array.isArray(val)) {
          translatedFields[targetKey] = await Promise.all(
            val.map(async (item: any) => {
              if (typeof item === 'string') {
                return translateSingle(item, from, to);
              }
              return item;
            })
          );
        } else {
          translatedFields[targetKey] = val;
        }
      }

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
