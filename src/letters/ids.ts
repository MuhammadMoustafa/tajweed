import { LETTER_NAMES, type ArabicLetter } from '../tajweed/letters'

/**
 * Each letter's card id on the letters page (#/letters/<id>): a stable transliteration. Kept apart
 * from the cards' prose (letters.ts) so the router and the document title (App.tsx, in the main
 * chunk) need only this; the prose loads with the lazy pages.
 */
export const LETTER_IDS: Record<ArabicLetter, string> = {
  'ء': 'hamzah',
  'ا': 'alif',
  'ب': 'ba',
  'ت': 'ta',
  'ث': 'tha',
  'ج': 'jeem',
  'ح': 'hha',
  'خ': 'kha',
  'د': 'dal',
  'ذ': 'dhal',
  'ر': 'ra',
  'ز': 'zay',
  'س': 'seen',
  'ش': 'sheen',
  'ص': 'sad',
  'ض': 'dad',
  'ط': 'tta',
  'ظ': 'zza',
  'ع': 'ayn',
  'غ': 'ghayn',
  'ف': 'fa',
  'ق': 'qaf',
  'ك': 'kaf',
  'ل': 'lam',
  'م': 'meem',
  'ن': 'noon',
  'ه': 'ha',
  'و': 'waw',
  'ي': 'ya',
}

/** The letter whose card is `id`, if any. */
export const letterOfId = (id: string): ArabicLetter | undefined =>
  (Object.keys(LETTER_IDS) as ArabicLetter[]).find((letter) => LETTER_IDS[letter] === id)

/** A letter's name in both languages (from LETTER_NAMES). */
export const letterNameOf = (letter: ArabicLetter) => LETTER_NAMES[letter]
