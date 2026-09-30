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
  },
]

export const vowel = (name: VowelName): Vowel => VOWELS.find((v) => v.name === name)!

/** Tanween and sukun syllables, shown as the Arabic syllable with IPA. */
export const SOUND_IPA = { ab: '/ab/', an: '/an/', un: '/un/', in: '/in/' } as const
