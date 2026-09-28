/**
 * The one place scripts call the Quran Foundation API for tajweed markup (Hafs), shared by
 * fetch-quran (lesson examples) and build-quiz-pool (the whole Quran).
 */
import { fetchJson } from './fetch.ts'

export const TAJWEED_API = 'https://api.quran.com/api/v4/quran/verses/uthmani_tajweed'

/** Attribution stored alongside every generated JSON file. */
export const tajweedSource = () => ({
  name: 'Quran Foundation API (quran.com) — text_uthmani_tajweed, riwayat Hafs',
  url: TAJWEED_API,
  fetchedAt: new Date().toISOString().slice(0, 10),
})

interface ApiResponse {
  verses: { verse_key: string; text_uthmani_tajweed: string }[]
}

/**
 * Verse key → `text_uthmani_tajweed` markup. With `verseKey`, just that verse (throws if the API
 * doesn't return it); without, all 6,236 verses in one call.
 */
export async function fetchTajweedVerses(verseKey?: string): Promise<Record<string, string>> {
  const url = verseKey ? `${TAJWEED_API}?verse_key=${verseKey}` : TAJWEED_API
  const body = await fetchJson<ApiResponse>(url)
  const verses = Object.fromEntries(body.verses.map((v) => [v.verse_key, v.text_uthmani_tajweed]))
  if (verseKey && !(verseKey in verses)) throw new Error(`${verseKey}: not found in API response`)
  return verses
}
