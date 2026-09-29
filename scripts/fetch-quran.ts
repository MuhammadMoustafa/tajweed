/**
 * Downloads the tajweed-annotated Uthmani text (Hafs) for every verse referenced by a lesson (and every clip word's ayah)
 * and writes it to src/data/quran.json; and, for every Quran word a clip plays
 * (src/animations/words.ts), its text and where the reciter (WORD_RECITATION) says it in the ayah's
 * Downloads the tajweed-annotated Uthmani text (Hafs) for every verse referenced by a lesson, or
 * holding a fetched word, and writes it to src/data/quran.json; and, for every Quran word a clip
 * or the letters page plays (src/animations/words.ts), its text and where the reciter (WORD_RECITATION) says it in the ayah's
 * audio, written to src/data/quran-words.json. The JSON is committed so the app builds and runs
 * offline.
 *
 * Run after adding or changing lesson examples or clip words:  npm run fetch-quran
 */
import { FETCHED_WORDS } from '../src/animations/words.ts'
import { compareVerseKeys, splitWordKey, WORD_RECITATION, type QuranWord } from '../src/data/quran.ts'
import { LESSONS } from '../src/lessons/index.ts'
import { writeJsonFile } from './lib/fetch.ts'
import { fetchTajweedVerses, fetchVerseWords, tajweedSource, wordsSource } from './lib/quran-api.ts'

const OUT = new URL('../src/data/quran.json', import.meta.url)
const WORDS_OUT = new URL('../src/data/quran-words.json', import.meta.url)

// Lesson examples, plus the ayah of every clip word (so a word's position can be checked against
// its ayah, and its rule against the markup, without the word being a lesson example).
const keys = [
  ...new Set([
    ...LESSONS.flatMap((l) => l.examples.map((e) => e.verseKey)),
    ...Object.values(CLIP_WORDS).map((key) => splitWordKey(key).verseKey),
  ]),
const wordKeys = [...new Set(FETCHED_WORDS)].sort(compareVerseKeys)
// The lesson examples' verses, plus each fetched word's own verse (words.test.ts checks every word
// against its verse's text).
const keys = [
  ...new Set([...LESSONS.flatMap((l) => l.examples.map((e) => e.verseKey)), ...wordKeys.map((k) => splitWordKey(k).verseKey)]),
].sort(compareVerseKeys)

const verses: Record<string, string> = {}
for (const key of keys) verses[key] = (await fetchTajweedVerses(key))[key]

const data = { source: tajweedSource(), verses }

await writeJsonFile(OUT, data)
console.log(`Wrote ${keys.length} verses to src/data/quran.json`)

const verseWords = new Map<string, Record<number, QuranWord>>()
const words: Record<string, QuranWord> = {}
for (const key of wordKeys) {
  const { verseKey, position } = splitWordKey(key)
  if (!verseWords.has(verseKey)) verseWords.set(verseKey, await fetchVerseWords(verseKey, WORD_RECITATION.id))
  const word = verseWords.get(verseKey)![position]
  if (!word) throw new Error(`${key}: ${verseKey} has no word ${position}`)
  words[key] = word
}

await writeJsonFile(WORDS_OUT, { source: wordsSource(WORD_RECITATION.id), words })
console.log(`Wrote ${wordKeys.length} words to src/data/quran-words.json`)
