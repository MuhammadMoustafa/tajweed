import type { WordKey } from '../lessons/types'

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
} as const satisfies Record<string, WordKey>
