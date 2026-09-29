import type { WordKey } from '../lessons/types'
import type { ArabicLetter } from '../tajweed/letters'

/**
 * The Quran words the clips play, recited by the reciter in src/data/quran.ts (`WORD_RECITATION`),
 * by `surah:ayah:word` position — never the word's text, which comes only from
 * src/data/quran-words.json. Kept React-free so `npm run fetch-quran` can import it: every word
 * listed here is fetched (text + audio timing), and clips.test.tsx fails if a clip step plays a
 * word missing from this list or from the data.
 */
export const CLIP_WORDS = {
  /** Natural madd: the small alif after a fatha in the basmala's third word (1:1, a lesson example). */
  naturalMadd: '1:1:3',
  /** Qalqalah on qaf, at the end of 113:1 (a lesson example), where the reciter stops. */
  qalqalahQaf: '113:1:4',
  /** Qalqalah on dal with a sukun in the middle of 112:3 (a lesson example). */
  qalqalahDal: '112:3:2',
  /** Qalqalah on ta (ط) with a sukun inside 96:6, the fourth word. */
  qalqalahTa: '96:6:4',
  /** Qalqalah on ba at the end of 111:1, the last word, where the reciter stops. */
  qalqalahBa: '111:1:5',
  /** Qalqalah on jeem with a sukun inside 89:1, its first word. */
  qalqalahJeem: '89:1:1',
  /** Lam shamsiyyah: the basmala's al-Rahman (1:1, a lesson example), where the lam is silent. */
  lamShamsiyyah: '1:1:3',
  /** Lam qamariyyah: the first word of al-Fatiha's second ayah (1:2, a lesson example). */
  lamQamariyyah: '1:2:1',
  /** The lam of the name of Allah after a fatha, heavy (112:1, a lesson example). */
  lamAllahHeavy: '112:1:3',
  /** The lam of the name of Allah after a kasra, light (1:1, a lesson example). */
  lamAllahLight: '1:1:2',
  /** Izhar halqi: noon sakinah then ain inside one word, the third word of 1:7 (a lesson example). */
  izharAnamta: '1:7:3',
  /** Iqlab: the noon sakinah before ba inside one word (80:27, a lesson example): the first word. */
  iqlabAnbatna: '80:27:1',
  /** Ghunnah: the meem with a shaddah in the first word of 78:1 (a lesson example). */
  ghunnah: '78:1:1',
  /** Hamzat al-wasl: the first word of 96:1 (started with) and the next word (joined to the one before). */
  waslStart: '96:1:1',
  waslJoined: '96:1:2',
  /** Hafs special words (L23): a sad read as seen (2:245), a sad read as sad (88:22), the kasra lam of 49:11 read on. */
  readSeen: '2:245:14', readSad: '88:22:3', ismJoined: '49:11:30',
} as const satisfies Record<string, WordKey>

/**
 * One word per letter for the letters page (#/letters/<id>, src/letters/): a word where al-Husary
 * says that letter clearly, with a sukun where one exists (the usual makhraj test), from al-Fatiha
 * or Juz ʿAmma, else Tabarak / Qad Samiʿa (surahs 58–77). Alif is the madd alif after a fatha;
 * waw and ya are the lin (sakin after a fatha) forms, said from the lips and the middle of the
 * tongue. Fetched by `npm run fetch-quran` like CLIP_WORDS; letters.test.ts checks each word holds
 * its letter.
 */
export const LETTER_WORDS = {
  'ء': '89:19:1', 'ا': '1:5:1', 'ب': '108:3:4', 'ت': '110:1:5', 'ث': '99:7:3', 'ج': '105:2:2', 'ح': '1:1:3', 'خ': '104:3:4',
  'د': '97:1:5', 'ذ': '97:4:5', 'ر': '105:4:1', 'ز': '94:2:3', 'س': '1:1:1', 'ش': '94:1:2', 'ص': '110:1:3', 'ض': '83:24:4',
  'ط': '106:4:2', 'ظ': '61:7:2', 'ع': '1:5:2', 'غ': '1:7:6', 'ف': '91:9:2', 'ق': '96:1:1', 'ك': '94:4:3', 'ل': '1:2:1',
  'م': '110:3:2', 'ن': '1:7:3', 'ه': '1:6:1', 'و': '1:4:2', 'ي': '1:7:5',
} as const satisfies Record<ArabicLetter, WordKey>

/** Every word `npm run fetch-quran` fetches: the clips' and the letters page's. */
export const FETCHED_WORDS: readonly WordKey[] = [...Object.values(CLIP_WORDS), ...Object.values(LETTER_WORDS)]
