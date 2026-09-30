import type { Bilingual } from '../i18n/bilingual'

/**
 * The three short vowels, in one place: the syllable, an everyday Arabic word (not a Quran quote)
 * where the vowel is heard clearly, the IPA symbol and what the mouth does. The harakat lesson,
 * its quiz and its clip all read this; nothing here is Quran text.
 */
export type VowelName = 'fatha' | 'damma' | 'kasra'
export type MouthShape = 'open' | 'round' | 'lowered'

export interface Vowel {
  name: VowelName
  label: Bilingual
  /** Bare ب with the haraka. */
  syllable: string
  /** An everyday word, with the vowel on its first letter. */
  word: string
  /** Between slashes. */
  ipa: string
  mouth: MouthShape
  /** What the mouth does, where the name comes from. */
  mouthDoes: Bilingual
  /** An approximate English word for the sound (English text only; marked approximate there). */
  englishLike: string
  /** The same vowel drawn out two counts by its madd letter (natural madd). */
  long: { syllable: string; word: string; ipa: string; englishLike: string }
}

export const VOWELS: readonly Vowel[] = [
  {
    name: 'fatha',
    label: { ar: 'الفتحة', en: 'Fatha' },
    syllable: 'بَ',
    word: 'كَتَبَ',
    ipa: '/a/',
    mouth: 'open',
    mouthDoes: { ar: 'تفتح فمك', en: 'the mouth opens' },
    englishLike: 'a short "a" as in "father"',
    long: { syllable: 'بَا', word: 'كِتَاب', ipa: '/aː/', englishLike: 'the "a" in "father"' },
  },
  {
    name: 'damma',
    label: { ar: 'الضمة', en: 'Damma' },
    syllable: 'بُ',
    word: 'كُتُب',
    ipa: '/u/',
    mouth: 'round',
    mouthDoes: { ar: 'تضمّ شفتيك وتدوّرهما إلى الأمام', en: 'the lips are gathered and rounded forward' },
    englishLike: 'the vowel in "put", with the lips rounded',
    long: { syllable: 'بُو', word: 'نُور', ipa: '/uː/', englishLike: 'the "oo" in "food"' },
  },
  {
    name: 'kasra',
    label: { ar: 'الكسرة', en: 'Kasra' },
    syllable: 'بِ',
    word: 'إِبِل',
    ipa: '/i/',
    mouth: 'lowered',
    mouthDoes: { ar: 'تخفض فكّك السفلي', en: 'the jaw lowers, the lips spread' },
    englishLike: 'the vowel in "sit", but nearer to "ee"',
    long: { syllable: 'بِي', word: 'كَبِير', ipa: '/iː/', englishLike: 'the "ee" in "see"' },
  },
]

export const vowel = (name: VowelName): Vowel => VOWELS.find((v) => v.name === name)!

/** The sukun and tanween sounds: an Arabic syllable and its IPA, never a bare Latin spelling. */
export const SOUNDS = {
  sukun: { syllable: 'أَبْ', ipa: '/ab/' },
  fathatan: { syllable: 'بً', ipa: '/an/' },
  dammatan: { syllable: 'بٌ', ipa: '/un/' },
  kasratan: { syllable: 'بٍ', ipa: '/in/' },
} as const

/** A sound as shown in text: the syllable, then its IPA. */
export const soundText = (s: { syllable: string; ipa: string }) => `${s.syllable} ${s.ipa}`
