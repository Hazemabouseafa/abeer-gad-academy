const translationCache = new Map<string, string>();

export const DOMAIN_DICTIONARY: Record<string, Record<string, string>> = {
  'أكاديمية عبير جاد': {
    en: 'Abeer Gad Academy',
    fr: 'Académie Abeer Gad',
    de: 'Abeer Gad Akademie',
    zh: '阿比尔·贾德学院',
  },
  'أكاديمية عبير جاد لعلوم القرآن واللغة العربية': {
    en: 'Abeer Gad Academy for Quranic Sciences & Arabic Language',
    fr: 'Académie Abeer Gad pour les Sciences du Coran et la Langue Arabe',
    de: 'Abeer Gad Akademie für Koranwissenschaften und Arabische Sprache',
    zh: '阿比尔·贾德古兰经科学与阿拉伯语学院',
  },
  'علوم القرآن الكريم': {
    en: 'Holy Quran Sciences',
    fr: 'Sciences du Saint Coran',
    de: 'Wissenschaften des Heiligen Korans',
    zh: '古兰经圣典科学',
  },
  'اللغة العربية وفنونها': {
    en: 'Arabic Language & Eloquence',
    fr: 'Langue Arabe & Rhétorique',
    de: 'Arabische Sprache & Beredsamkeit',
    zh: '阿拉伯语与文法修辞',
  },
  'الدروس الفردية الخاصة VIP': {
    en: 'Private 1-on-1 VIP Lessons',
    fr: 'Cours Particuliers VIP Individuels',
    de: 'Individueller VIP-Einzelunterricht',
    zh: '一对一VIP专属私教',
  },
  'أحكام التجويد وضبط مخارج الحروف والصفات': {
    en: 'Tajweed Rules & Accurate Articulation (Makhaarij)',
    fr: 'Règles de Tajwîd et Articulation Phonétique (Makhaarij)',
    de: 'Tajweed-Regeln und präzise Lautbildung (Makhaarij)',
    zh: '音律法则精研与发音器官纠正 (Makhaarij)',
  },
  'منهجية الحفظ المتقن للقرآن الكريم وتثبيت المتشابهات': {
    en: 'Quran Hifz Mastery & Mutashabihat System',
    fr: 'Maîtrise de la Mémorisation du Coran & Mutashâbihât',
    de: 'Koran-Auswendiglernen & Mutashabihat-Festigung',
    zh: '系统化古兰经背诵与易混淆经文精研',
  },
  'تأسيس اللغة العربية: من مخارج الحروف إلى إعراب الجمل': {
    en: 'Foundational Arabic: Phonetics to Sentence Mastery',
    fr: 'Fondements de la Langue Arabe : Des Lettres à la Syntaxe',
    de: 'Grundlagen des Arabischen: Von der Phonetik zur Satzanalyse',
    zh: '阿拉伯语基础：从字母发音到句子语法',
  },
  'تأسيس القراءة بالقرآن الكريم (القاعدة النورانية)': {
    en: 'Quran Reading Foundations (Noorani Qaida)',
    fr: 'Apprentissage de la Lecture Coranique (Qaida Nourania)',
    de: 'Koran-Lesegrundlagen (Noorani Qaida)',
    zh: '古兰经初级诵读 (努拉尼法)',
  },
  'إجازة بالسند المتصل': {
    en: 'Ijazah with Continuous Sanad',
    fr: 'Ijâzah avec Chaîne de Transmission Continue (Sanad)',
    de: 'Ijazah mit ununterbrochener Übertragungskette (Sanad)',
    zh: '具有连贯传授链的正统证书 (Ijazah)',
  },
  'بالسند المتصل': {
    en: 'With Continuous Sanad',
    fr: 'Avec Sanad Continu',
    de: 'Mit kontinuierlicher Kette (Sanad)',
    zh: '连贯传授链 (Sanad)',
  },
  'مبتدئ': {
    en: 'Beginner',
    fr: 'Débutant',
    de: 'Anfänger',
    zh: '初学者',
  },
  'متوسط': {
    en: 'Intermediate',
    fr: 'Intermédiaire',
    de: 'Mittelstufe',
    zh: '中级',
  },
  'متقدم': {
    en: 'Advanced',
    fr: 'Avancé',
    de: 'Fortgeschritten',
    zh: '高级',
  },
  'جميع المستويات': {
    en: 'All Levels',
    fr: 'Tous Niveaux',
    de: 'Alle Niveaus',
    zh: '所有级别',
  },
  'أونلاين مباشر (فردي)': {
    en: 'Live Online (1-on-1)',
    fr: 'En direct en ligne (Individuel)',
    de: 'Live Online (Einzelunterricht)',
    zh: '在线实时授课 (一对一)',
  },
  'جلسات تفاعلية مباشرة': {
    en: 'Interactive Live Sessions',
    fr: 'Sessions interactives en direct',
    de: 'Interaktive Live-Sitzungen',
    zh: '实时互动授课',
  },
};

function decodeEntities(str: string): string {
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

export async function translateSingle(text: string, from = 'ar', to = 'en'): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return text || '';

  if (from === 'ar' && DOMAIN_DICTIONARY[trimmed]?.[to]) {
    return DOMAIN_DICTIONARY[trimmed][to];
  }

  // 1. Check in-memory cache
  const cacheKey = `${from}:${to}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  const targetLang = to === 'zh' ? 'zh-CN' : to;

  // 2. Primary Engine: High-speed Google Translate
  try {
    const googleUrl = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${from}&tl=${targetLang}&q=${encodeURIComponent(trimmed)}`;
    const gRes = await fetch(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
    });

    if (gRes.ok) {
      const gData = await gRes.json();
      const rawText = Array.isArray(gData) ? (typeof gData[0] === 'string' ? gData[0] : gData[0]?.[0]) : gData;
      if (typeof rawText === 'string' && rawText.trim()) {
        const cleaned = decodeEntities(rawText.trim());
        if (translationCache.size > 5000) translationCache.clear();
        translationCache.set(cacheKey, cleaned);
        return cleaned;
      }
    }
  } catch (gErr) {
    // proceed to fallback
  }

  // 3. Secondary Engine Fallback: MyMemory
  try {
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${from}|${targetLang}`;
    const mRes = await fetch(myMemoryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AbeerGadAcademyTranslator/1.0',
        Accept: 'application/json',
      },
    });

    if (mRes.ok) {
      const data = await mRes.json();
      let translated = data?.responseData?.translatedText;
      if (typeof translated === 'string' && translated.trim()) {
        translated = decodeEntities(translated.trim());
        if (!translated.toLowerCase().startsWith('invalid') && !translated.toLowerCase().startsWith('my memory')) {
          if (translationCache.size > 5000) translationCache.clear();
          translationCache.set(cacheKey, translated);
          return translated;
        }
      }
    }
  } catch (mErr) {
    // fallback
  }

  return text;
}

export async function translateFieldsObject(
  fields: Record<string, any>,
  from = 'ar',
  to = 'en'
): Promise<Record<string, any>> {
  const translatedFields: Record<string, any> = {};

  for (const [key, val] of Object.entries(fields)) {
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

  return translatedFields;
}
