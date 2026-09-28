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
} as const satisfies Record<string, WordKey>
