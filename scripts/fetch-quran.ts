/**
 * Downloads the tajweed-annotated Uthmani text (Hafs) for every verse referenced by a lesson, or
 * holding a fetched word, and writes it to src/data/quran.json; and, for every Quran word a clip
 * or the letters page plays (src/animations/words.ts), its text and where the reciter (WORD_RECITATION) says it in the ayah's
 * audio, written to src/data/quran-words.json; and every surah's name (Arabic and English), written
 * to src/data/surahs.json. The JSON is committed so the app builds and runs offline. All three are
 * downloaded and checked first, then replaced together: a failure leaves every file as it was.
 *
 * Run after adding or changing lesson examples or clip words:  npm run fetch-quran
 */
import { FETCHED_WORDS } from '../src/animations/words.ts'
import { splitWordKey, WORD_RECITATION } from '../src/data/quran.ts'
import { LESSONS } from '../src/lessons/index.ts'
import { refreshQuranData } from './lib/quran-api.ts'

// The lesson examples' verses, plus each fetched word's own verse (words.test.ts checks every word
// against its verse's text). Everything is downloaded and checked before any file is replaced.
const counts = await refreshQuranData({
  verseKeys: [...LESSONS.flatMap((l) => l.examples.map((e) => e.verseKey)), ...FETCHED_WORDS.map((k) => splitWordKey(k).verseKey)],
  wordKeys: FETCHED_WORDS,
  recitationId: WORD_RECITATION.id,
  outputs: {
    quran: new URL('../src/data/quran.json', import.meta.url),
    words: new URL('../src/data/quran-words.json', import.meta.url),
    surahs: new URL('../src/data/surahs.json', import.meta.url),
  },
})
console.log(`Wrote ${counts.verses} verses to src/data/quran.json`)
console.log(`Wrote ${counts.words} words to src/data/quran-words.json`)
console.log(`Wrote the ${counts.surahs} surah names to src/data/surahs.json`)
