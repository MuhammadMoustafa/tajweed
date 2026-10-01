/**
 * The one place scripts call the Quran Foundation API: tajweed markup (Hafs), shared by
 * fetch-quran (lesson examples) and build-quiz-pool (the whole Quran), and the words clips play
 * (their text and a recitation's per-word timings) and the surah names, for fetch-quran.
 *
 * Every response is checked at runtime before it becomes domain data: a missing or empty field, a
 * verse key other than the one requested, a duplicate or missing chapter or a non-finite timing
 * throws with the URL (or verse key) and the offending value, so a changed API fails the fetch
 * instead of writing an incomplete dataset.
 */
import type { QuranWord } from '../../src/data/quran.ts'
import type { VerseKey, WordKey } from '../../src/lessons/types.ts'
import { compareVerseKeys, splitWordKey } from '../../src/data/quran.ts'
import { fetchJson, writeJsonFiles, type StagingFs } from './fetch.ts'

export const TAJWEED_API = 'https://api.quran.com/api/v4/quran/verses/uthmani_tajweed'

/** Verses in the whole Quran (Hafs numbering), which a full fetch must return exactly. */
export const VERSE_COUNT = 6236
/** Surahs in the Quran, which the chapters endpoint must return exactly (ids 1–114). */
export const SURAH_COUNT = 114

/** Attribution stored alongside every generated JSON file. */
export const tajweedSource = () => ({
  name: 'Quran Foundation API (quran.com) — text_uthmani_tajweed, riwayat Hafs',
  url: TAJWEED_API,
  fetchedAt: new Date().toISOString().slice(0, 10),
})

// --- runtime checks -------------------------------------------------------------------------

/** A short, printable form of an offending value for error messages. */
const show = (value: unknown): string => {
  const text = JSON.stringify(value) ?? String(value)
  return text.length > 80 ? `${text.slice(0, 77)}...` : text
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

function record(value: unknown, what: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${what} is not an object: ${show(value)}`)
  return value
}

function array(value: unknown, what: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${what} is not an array: ${show(value)}`)
  return value
}

function text(value: unknown, what: string): string {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${what} is not a nonempty string: ${show(value)}`)
  return value
}

const VERSE_KEY = /^[1-9]\d*:[1-9]\d*$/

function checkVerseKey(value: unknown, what: string): string {
  if (typeof value !== 'string' || !VERSE_KEY.test(value)) throw new Error(`${what} is not a verse key: ${show(value)}`)
  return value
}

// --- tajweed markup -------------------------------------------------------------------------

/**
 * Verse key → `text_uthmani_tajweed` markup from one `/quran/verses/uthmani_tajweed` response.
 * With `verseKey`, the response must hold exactly that verse; without, all VERSE_COUNT verses,
 * each key once. Every verse needs a nonempty markup string.
 */
export function parseTajweedVerses(body: unknown, verseKey?: string): Record<string, string> {
  const verses = array(record(body, 'response').verses, 'verses')
  const result: Record<string, string> = {}
  verses.forEach((v, i) => {
    const verse = record(v, `verses[${i}]`)
    const key = checkVerseKey(verse.verse_key, `verses[${i}].verse_key`)
    if (key in result) throw new Error(`verse ${key} appears twice`)
    result[key] = text(verse.text_uthmani_tajweed, `verse ${key} text_uthmani_tajweed`)
  })
  const keys = Object.keys(result)
  if (verseKey !== undefined) {
    if (keys.length !== 1 || keys[0] !== verseKey) {
      throw new Error(`${verseKey}: expected only that verse, got ${show(keys)}`)
    }
  } else if (keys.length !== VERSE_COUNT) {
    throw new Error(`expected ${VERSE_COUNT} verses, got ${keys.length}`)
  }
  return result
}

/**
 * Verse key → `text_uthmani_tajweed` markup. With `verseKey`, just that verse (throws if the API
 * returns anything else); without, all 6,236 verses in one call.
 */
export async function fetchTajweedVerses(verseKey?: string): Promise<Record<string, string>> {
  const url = verseKey ? `${TAJWEED_API}?verse_key=${verseKey}` : TAJWEED_API
  return fetchJson(url, (body) => parseTajweedVerses(body, verseKey))
}

// --- words and their timings ----------------------------------------------------------------

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

/** The `/verses/by_key` response fields parseVerseWords reads (it checks them at runtime). */
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

const isTiming = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n >= 0

/**
 * Word position (1-based) → its text and audio span, from one `/verses/by_key` response for
 * `expectedKey`. Throws unless the response is for that verse, its words have increasing
 * positive positions and nonempty text, and every word has exactly one segment of finite,
 * nonnegative times, the segments running in order without overlapping, so a changed API format
 * fails the fetch instead of cutting the wrong word.
 */
export function parseVerseWords(body: unknown, expectedKey: string): Record<number, QuranWord> {
  const verse = record(record(body, `${expectedKey}: response`).verse, `${expectedKey}: verse`)
  const key = checkVerseKey(verse.verse_key, `${expectedKey}: verse_key`)
  if (key !== expectedKey) throw new Error(`${expectedKey}: response is for verse ${key}`)
  if (verse.audio === undefined || verse.audio === null) throw new Error(`${key}: no audio in API response`)
  const audio = record(verse.audio, `${key}: audio`)
  const audioUrl = text(audio.url, `${key}: audio url`)
  const url = audioUrl.startsWith('//') ? `https:${audioUrl}` : audioUrl
  if (!url.startsWith('https://')) throw new Error(`${key}: unexpected audio url ${audioUrl}`)

  const spoken: { position: number; text: string }[] = []
  array(verse.words, `${key}: words`).forEach((w, i) => {
    const word = record(w, `${key}: words[${i}]`)
    if (text(word.char_type_name, `${key}: words[${i}].char_type_name`) !== 'word') return
    const position = word.position
    const previous = spoken.at(-1)?.position ?? 0
    if (typeof position !== 'number' || !Number.isInteger(position) || position <= previous) {
      throw new Error(`${key}: words[${i}] has position ${show(position)} after ${previous}`)
    }
    spoken.push({ position, text: text(word.text_uthmani, `${key}: word ${position} text_uthmani`) })
  })
  if (spoken.length === 0) throw new Error(`${key}: no words in API response`)

  const segments = array(audio.segments, `${key}: audio segments`)
  if (segments.length !== spoken.length) {
    throw new Error(`${key}: ${segments.length} audio segments for ${spoken.length} words`)
  }
  const spans = new Map<number, { start: number; end: number }>()
  let previousEnd = 0
  for (const segment of segments) {
    if (!Array.isArray(segment) || segment.length !== 4 || !segment.every(isTiming)) {
      throw new Error(`${key}: malformed segment ${show(segment)}`)
    }
    const [index, position, start, end] = segment
    if (position !== index + 1 || !(start >= previousEnd && end > start)) {
      throw new Error(`${key}: malformed or out-of-order segment ${show(segment)}`)
    }
    spans.set(position, { start, end })
    previousEnd = end
  }

  const result: Record<number, QuranWord> = {}
  for (const word of spoken) {
    const span = spans.get(word.position)
    if (!span) throw new Error(`${key}: no audio segment for word ${word.position}`)
    result[word.position] = { text: word.text, audio: { url, ...span } }
  }
  return result
}

/** Word position → text and audio span for every word of `verseKey`, in `recitationId`'s recitation. */
export async function fetchVerseWords(verseKey: string, recitationId: number): Promise<Record<number, QuranWord>> {
  return fetchJson(verseWordsUrl(verseKey, recitationId), (body) => parseVerseWords(body, verseKey))
}

// --- surah names ----------------------------------------------------------------------------

/** Every surah's name, in Arabic and in the API's English transliteration (`name_simple`). */
export const CHAPTERS_API = 'https://api.quran.com/api/v4/chapters?language=en'

/** Attribution for src/data/surahs.json. */
export const chaptersSource = () => ({
  name: 'Quran Foundation API (quran.com) — chapters: name_arabic and name_simple',
  url: CHAPTERS_API,
  fetchedAt: new Date().toISOString().slice(0, 10),
})

/**
 * Surah number → its name in both languages, from one `/chapters` response: exactly the ids
 * 1–114, each once, each with a nonempty name_arabic and name_simple.
 */
export function parseSurahNames(body: unknown): Record<number, { ar: string; en: string }> {
  const chapters = array(record(body, 'response').chapters, 'chapters')
  if (chapters.length !== SURAH_COUNT) throw new Error(`${chapters.length} chapters, expected ${SURAH_COUNT}`)
  const names: Record<number, { ar: string; en: string }> = {}
  chapters.forEach((c, i) => {
    const chapter = record(c, `chapters[${i}]`)
    const id = chapter.id
    if (typeof id !== 'number' || !Number.isInteger(id) || id < 1 || id > SURAH_COUNT) {
      throw new Error(`chapters[${i}].id is not a surah number 1–${SURAH_COUNT}: ${show(id)}`)
    }
    if (id in names) throw new Error(`chapter ${id} appears twice`)
    names[id] = {
      ar: text(chapter.name_arabic, `chapter ${id} name_arabic`),
      en: text(chapter.name_simple, `chapter ${id} name_simple`),
    }
  })
  return names
}

/** Surah number → its name in both languages, for all 114 (throws on anything else). */
export async function fetchSurahNames(): Promise<Record<number, { ar: string; en: string }>> {
  return fetchJson(CHAPTERS_API, parseSurahNames)
}

// --- the whole refresh ----------------------------------------------------------------------

/** Where fetch-quran writes its three datasets. */
export interface QuranOutputs {
  quran: URL
  words: URL
  surahs: URL
}

/**
 * fetch-quran's refresh: downloads and checks the markup of `verseKeys`, the text and timings of
 * `wordKeys` in `recitationId`'s recitation and the 114 surah names, and only then replaces the
 * three files as one set (writeJsonFiles), so a failed request or write leaves all of them as
 * they were. Returns the counts written.
 */
export async function refreshQuranData(options: {
  verseKeys: readonly string[]
  wordKeys: readonly WordKey[]
  recitationId: number
  outputs: QuranOutputs
  fs?: StagingFs
}): Promise<{ verses: number; words: number; surahs: number }> {
  const { recitationId, outputs } = options
  const verseKeys = [...new Set(options.verseKeys)].sort(compareVerseKeys)
  const wordKeys = [...new Set(options.wordKeys)].sort(compareVerseKeys)

  const verses: Record<string, string> = {}
  for (const key of verseKeys) verses[key] = (await fetchTajweedVerses(key))[key]

  const verseWords = new Map<VerseKey, Record<number, QuranWord>>()
  const words: Record<string, QuranWord> = {}
  for (const key of wordKeys) {
    const { verseKey, position } = splitWordKey(key)
    if (!verseWords.has(verseKey)) verseWords.set(verseKey, await fetchVerseWords(verseKey, recitationId))
    const word = verseWords.get(verseKey)![position]
    if (!word) throw new Error(`${key}: ${verseKey} has no word ${position}`)
    words[key] = word
  }

  const names = await fetchSurahNames()

  await writeJsonFiles(
    [
      { url: outputs.quran, data: { source: tajweedSource(), verses } },
      { url: outputs.words, data: { source: wordsSource(recitationId), words } },
      { url: outputs.surahs, data: { source: chaptersSource(), names } },
    ],
    options.fs,
  )
  return { verses: verseKeys.length, words: wordKeys.length, surahs: Object.keys(names).length }
}
