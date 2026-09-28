/**
 * Downloads the tajweed-annotated Uthmani text (Hafs) for every verse referenced by a lesson
 * and writes it to src/data/quran.json. The JSON is committed so the app builds and runs offline.
 *
 * Run after adding or changing lesson examples:  npm run fetch-quran
 */
import { compareVerseKeys } from '../src/data/quran.ts'
import { LESSONS } from '../src/lessons/index.ts'
import { writeJsonFile } from './lib/fetch.ts'
import { fetchTajweedVerses, tajweedSource } from './lib/quran-api.ts'

const OUT = new URL('../src/data/quran.json', import.meta.url)

const keys = [...new Set(LESSONS.flatMap((l) => l.examples.map((e) => e.verseKey)))].sort(compareVerseKeys)

const verses: Record<string, string> = {}
for (const key of keys) verses[key] = (await fetchTajweedVerses(key))[key]

const data = { source: tajweedSource(), verses }

await writeJsonFile(OUT, data)
console.log(`Wrote ${keys.length} verses to src/data/quran.json`)
