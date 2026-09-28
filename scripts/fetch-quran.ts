/**
 * Downloads the tajweed-annotated Uthmani text (Hafs) for every verse referenced by a lesson
 * and writes it to src/data/quran.json. The JSON is committed so the app builds and runs offline.
 *
 * Run after adding or changing lesson examples:  npm run fetch-quran
 */
import { LESSONS } from '../src/lessons/index.ts'
import { fetchJson, writeJsonFile } from './lib/fetch.ts'

const API = 'https://api.quran.com/api/v4/quran/verses/uthmani_tajweed'
const OUT = new URL('../src/data/quran.json', import.meta.url)

interface ApiResponse {
  verses: { verse_key: string; text_uthmani_tajweed: string }[]
}

const keys = [...new Set(LESSONS.flatMap((l) => l.examples.map((e) => e.verseKey)))].sort(
  (a, b) => {
    const [sa, aa] = a.split(':').map(Number)
    const [sb, ab] = b.split(':').map(Number)
    return sa - sb || aa - ab
  },
)

const verses: Record<string, string> = {}
for (const key of keys) {
  const body = await fetchJson<ApiResponse>(`${API}?verse_key=${key}`)
  const verse = body.verses[0]
  if (!verse || verse.verse_key !== key) throw new Error(`${key}: not found in API response`)
  verses[key] = verse.text_uthmani_tajweed
}

const data = {
  source: {
    name: 'Quran Foundation API (quran.com) — text_uthmani_tajweed, riwayat Hafs',
    url: API,
    fetchedAt: new Date().toISOString().slice(0, 10),
  },
  verses,
}

await writeJsonFile(OUT, data)
console.log(`Wrote ${keys.length} verses to src/data/quran.json`)
