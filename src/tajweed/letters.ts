import type { Bilingual } from '../i18n/bilingual'

/**
 * The Arabic letters (single letters, not Quran text) and their names in both languages, e.g. for
 * a clip naming the letter it shows. English names follow the course's transliteration: a dot
 * under the heavy look-alikes (ḥa, ṣad, ḍad, ṭa, ẓa), ʿ for ʿayn.
 */
export const LETTER_NAMES = {
  'ء': { ar: 'الهمزة', en: 'Hamzah' },
  'ا': { ar: 'الألف', en: 'Alif' },
  'ب': { ar: 'الباء', en: 'Ba' },
  'ت': { ar: 'التاء', en: 'Ta' },
  'ث': { ar: 'الثاء', en: 'Tha' },
  'ج': { ar: 'الجيم', en: 'Jeem' },
  'ح': { ar: 'الحاء', en: 'Ḥa' },
  'خ': { ar: 'الخاء', en: 'Kha' },
  'د': { ar: 'الدال', en: 'Dal' },
  'ذ': { ar: 'الذال', en: 'Dhal' },
  'ر': { ar: 'الراء', en: 'Ra' },
  'ز': { ar: 'الزاي', en: 'Zay' },
  'س': { ar: 'السين', en: 'Seen' },
  'ش': { ar: 'الشين', en: 'Sheen' },
  'ص': { ar: 'الصاد', en: 'Ṣad' },
  'ض': { ar: 'الضاد', en: 'Ḍad' },
  'ط': { ar: 'الطاء', en: 'Ṭa' },
  'ظ': { ar: 'الظاء', en: 'Ẓa' },
  'ع': { ar: 'العين', en: 'ʿAyn' },
  'غ': { ar: 'الغين', en: 'Ghayn' },
  'ف': { ar: 'الفاء', en: 'Fa' },
  'ق': { ar: 'القاف', en: 'Qaf' },
  'ك': { ar: 'الكاف', en: 'Kaf' },
  'ل': { ar: 'اللام', en: 'Lam' },
  'م': { ar: 'الميم', en: 'Meem' },
  'ن': { ar: 'النون', en: 'Noon' },
  'ه': { ar: 'الهاء', en: 'Ha' },
  'و': { ar: 'الواو', en: 'Waw' },
  'ي': { ar: 'الياء', en: 'Ya' },
} as const satisfies Record<string, Bilingual>

export type ArabicLetter = keyof typeof LETTER_NAMES
