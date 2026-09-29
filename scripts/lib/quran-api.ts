/**
 * The one place scripts call the Quran Foundation API: tajweed markup (Hafs), shared by
 * fetch-quran (lesson examples) and build-quiz-pool (the whole Quran), and the words clips play
 * (their text and a recitation's per-word timings) and the surah names, for fetch-quran.
 */
import type { QuranWord } from '../../src/data/quran.ts'
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

/** One verse with its words and one recitation's ayah audio (`/verses/by_key/…?audio=<id>`). */
export const VERSE_BY_KEY_API = 'https://api.quran.com/api/v4/verses/by_key'

const verseWordsUrl = (verseKey: string, recitationId: number) =>
  `${VERSE_BY_KEY_API}/${verseKey}?words=true&word_fields=text_uthmani&audio=${recitationId}`

/** Attribution for src/data/quran-words.json. */
export const wordsSource = (recitationId: number) => ({
  name:
    'Quran Foundation API (quran.com) — word text_uthmani, riwayat Hafs; audio: recitation ' +
    `${recitationId} (Mahmoud Khalil al-Husary, murattal), per-ayah files with per-word timing segments`,
  url: verseWordsUrl('{verse_key}', recitationId),
  recitationId,
  fetchedAt: new Date().toISOString().slice(0, 10),
})

export interface VerseWordsResponse {
  verse: {
    verse_key: string
    /** Every word of the ayah, then its end marker (`char_type_name: 'end'`). */
    words: { position: number; char_type_name: string; text_uthmani: string }[]
    /**
     * The ayah's audio file (protocol-relative, e.g. `//mirrors.quranicaudio.com/…/001001.mp3`)
     * and one segment per word: `[index, position, startMs, endMs]`, `index` = `position - 1`.
     */
    audio?: { url: string; segments: number[][] }
  }
}

/**
 * Word position (1-based) → its text and audio span, from one `/verses/by_key` response. Throws
 * unless every word has exactly one well-formed segment and the segments run in order without
 * overlapping, so a changed API format fails the fetch instead of cutting the wrong word.
 */
export function parseVerseWords(body: VerseWordsResponse): Record<number, QuranWord> {
  const { verse_key: key, words, audio } = body.verse
  if (!audio) throw new Error(`${key}: no audio in API response`)
  const url = audio.url.startsWith('//') ? `https:${audio.url}` : audio.url
  if (!url.startsWith('https://')) throw new Error(`${key}: unexpected audio url ${audio.url}`)

  const spoken = words.filter((w) => w.char_type_name === 'word')
  if (audio.segments.length !== spoken.length) {
    throw new Error(`${key}: ${audio.segments.length} audio segments for ${spoken.length} words`)
  }
  const spans = new Map<number, { start: number; end: number }>()
  let previousEnd = 0
  for (const segment of audio.segments) {
    const [index, position, start, end] = segment
    if (segment.length !== 4 || position !== index + 1 || !(start >= previousEnd && end > start)) {
      throw new Error(`${key}: malformed or out-of-order segment ${JSON.stringify(segment)}`)
    }
    spans.set(position, { start, end })
    previousEnd = end
  }

  const result: Record<number, QuranWord> = {}
  for (const word of spoken) {
    const span = spans.get(word.position)
    if (!span) throw new Error(`${key}: no audio segment for word ${word.position}`)
    result[word.position] = { text: word.text_uthmani, audio: { url, ...span } }
  }
  return result
}

/** Word position → text and audio span for every word of `verseKey`, in `recitationId`'s recitation. */
export async function fetchVerseWords(verseKey: string, recitationId: number): Promise<Record<number, QuranWord>> {
  return parseVerseWords(await fetchJson<VerseWordsResponse>(verseWordsUrl(verseKey, recitationId)))
}

/** Every surah's name, in Arabic and in the API's English transliteration (`name_simple`). */
export const CHAPTERS_API = 'https://api.quran.com/api/v4/chapters?language=en'

/** Attribution for src/data/surahs.json. */
export const chaptersSource = () => ({
  name: 'Quran Foundation API (quran.com) — chapters: name_arabic and name_simple',
  url: CHAPTERS_API,
  fetchedAt: new Date().toISOString().slice(0, 10),
})

interface ChaptersResponse {
  chapters: { id: number; name_arabic: string; name_simple: string }[]
}

/** Surah number → its name in both languages, for all 114 (throws if the API returns fewer). */
export async function fetchSurahNames(): Promise<Record<number, { ar: string; en: string }>> {
  const { chapters } = await fetchJson<ChaptersResponse>(CHAPTERS_API)
  if (chapters.length !== 114) throw new Error(`${chapters.length} chapters in API response, expected 114`)
  return Object.fromEntries(chapters.map((c) => [c.id, { ar: c.name_arabic, en: c.name_simple }]))
}
