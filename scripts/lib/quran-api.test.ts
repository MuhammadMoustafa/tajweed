import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fixture from '../../src/test/fixtures/verse-words-1-1.json'
import {
  fetchSurahNames,
  fetchTajweedVerses,
  fetchVerseWords,
  parseSurahNames,
  parseTajweedVerses,
  parseVerseWords,
  refreshQuranData,
  SURAH_COUNT,
  VERSE_COUNT,
  type VerseWordsResponse,
} from './quran-api.ts'

// A real `/verses/by_key/1:1?words=true&word_fields=text_uthmani&audio=6` response (trimmed to the
// fields parseVerseWords reads) — the Quran text in it comes from the API, never typed here. Every
// other fixture below uses placeholder strings that are obviously not Quran text.
const response = fixture as VerseWordsResponse

/** The fixture with its audio replaced, for the malformed cases. */
const withAudio = (audio: unknown): unknown => ({ verse: { ...response.verse, audio } })
const withVerse = (fields: Record<string, unknown>): unknown => ({ verse: { ...response.verse, ...fields } })

/** Responses for a stubbed `fetch`: a 200 with `body`, or an HTTP 500. */
const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body })
const failed = { ok: false, status: 500, json: async () => ({}) }

const chapters = (count = SURAH_COUNT) =>
  Array.from({ length: count }, (_, i) => ({ id: i + 1, name_arabic: `fixture-ar-${i + 1}`, name_simple: `fixture-en-${i + 1}` }))

afterEach(() => vi.unstubAllGlobals())

describe('parseVerseWords', () => {
  it('gives every word its text and its segment of the https ayah audio', () => {
    const words = parseVerseWords(response, '1:1')
    const spoken = response.verse.words.filter((w) => w.char_type_name === 'word')
    expect(Object.keys(words).map(Number)).toEqual(spoken.map((w) => w.position))
    for (const w of spoken) expect(words[w.position].text).toBe(w.text_uthmani)
    expect(words[3].audio).toEqual({
      url: 'https://mirrors.quranicaudio.com/everyayah/Husary_64kbps/001001.mp3',
      start: 1190,
      end: 2340,
    })
  })

  it('never gives the end-of-ayah marker a segment', () => {
    const end = response.verse.words.find((w) => w.char_type_name === 'end')!
    expect(parseVerseWords(response, '1:1')[end.position]).toBeUndefined()
  })

  it('throws when the audio is missing, a segment is missing, or segments are out of order', () => {
    const { url, segments } = response.verse.audio!
    expect(() => parseVerseWords(withAudio(undefined), '1:1')).toThrow(/no audio/)
    expect(() => parseVerseWords(withAudio({ url, segments: segments.slice(1) }), '1:1')).toThrow(/segments for/)
    const swapped = [segments[1], segments[0], ...segments.slice(2)]
    expect(() => parseVerseWords(withAudio({ url, segments: swapped }), '1:1')).toThrow(/out-of-order/)
    const overlapping = segments.map((s, i) => (i === 1 ? [s[0], s[1], s[2] - 100, s[3]] : s))
    expect(() => parseVerseWords(withAudio({ url, segments: overlapping }), '1:1')).toThrow(/out-of-order/)
  })

  it('R6: rejects a response for another verse than the one requested', () => {
    expect(() => parseVerseWords(response, '1:2')).toThrow(/1:2: response is for verse 1:1/)
  })

  it('R6: rejects non-finite, negative or non-numeric timings, naming the segment', () => {
    const { url, segments } = response.verse.audio!
    for (const bad of [Number.NaN, Number.POSITIVE_INFINITY, -10, '520']) {
      const broken = segments.map((s, i) => (i === 1 ? [s[0], s[1], bad, s[3]] : s))
      expect(() => parseVerseWords(withAudio({ url, segments: broken }), '1:1')).toThrow(/1:1: malformed segment/)
    }
  })

  it('R6: rejects a word with empty text or a missing or repeated position', () => {
    const words = response.verse.words
    const emptyText = words.map((w, i) => (i === 0 ? { ...w, text_uthmani: '' } : w))
    expect(() => parseVerseWords(withVerse({ words: emptyText }), '1:1')).toThrow(/word 1 text_uthmani/)
    const noPosition = words.map((w, i) => (i === 1 ? { ...w, position: undefined } : w))
    expect(() => parseVerseWords(withVerse({ words: noPosition }), '1:1')).toThrow(/words\[1\] has position/)
    const repeated = words.map((w, i) => (i === 2 ? { ...w, position: 2 } : w))
    expect(() => parseVerseWords(withVerse({ words: repeated }), '1:1')).toThrow(/words\[2\] has position 2 after 2/)
  })

  it('R6: fetchVerseWords names the URL of a malformed response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({ verse: { verse_key: '1:1' } })))
    await expect(fetchVerseWords('1:1', 6)).rejects.toThrow(/verses\/by_key\/1:1\?.*: 1:1: no audio/)
  })
})

describe('parseTajweedVerses', () => {
  it('maps the requested verse key to its markup', () => {
    expect(parseTajweedVerses({ verses: [{ verse_key: '1:1', text_uthmani_tajweed: 'fixture-markup' }] }, '1:1')).toEqual({
      '1:1': 'fixture-markup',
    })
  })

  it('R6: rejects a requested verse without its text field', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({ verses: [{ verse_key: '1:1' }] })))
    await expect(fetchTajweedVerses('1:1')).rejects.toThrow(/verse_key=1:1: verse 1:1 text_uthmani_tajweed .*undefined/)
  })

  it('R6: rejects empty text, another verse, extra verses and malformed keys', () => {
    const verse = (key: unknown, text: unknown = 'fixture-markup') => ({ verse_key: key, text_uthmani_tajweed: text })
    expect(() => parseTajweedVerses({ verses: [verse('1:1', ' ')] }, '1:1')).toThrow(/text_uthmani_tajweed/)
    expect(() => parseTajweedVerses({ verses: [verse('1:2')] }, '1:1')).toThrow(/1:1: expected only that verse/)
    expect(() => parseTajweedVerses({ verses: [verse('1:1'), verse('1:2')] }, '1:1')).toThrow(/expected only/)
    expect(() => parseTajweedVerses({ verses: [verse('1-1')] }, '1:1')).toThrow(/not a verse key: "1-1"/)
    expect(() => parseTajweedVerses({ verses: 'none' }, '1:1')).toThrow(/verses is not an array/)
  })

  it('R6: the full fetch needs every verse, each key once', () => {
    const all = Array.from({ length: VERSE_COUNT }, (_, i) => ({ verse_key: `1:${i + 1}`, text_uthmani_tajweed: 'fixture-markup' }))
    expect(Object.keys(parseTajweedVerses({ verses: all }))).toHaveLength(VERSE_COUNT)
    expect(() => parseTajweedVerses({ verses: all.slice(1) })).toThrow(`expected ${VERSE_COUNT} verses, got ${VERSE_COUNT - 1}`)
    expect(() => parseTajweedVerses({ verses: [...all.slice(1), all[1]] })).toThrow(/verse 1:2 appears twice/)
  })
})

describe('parseSurahNames', () => {
  it('maps each of the 114 ids to both names', () => {
    const names = parseSurahNames({ chapters: chapters() })
    expect(Object.keys(names)).toHaveLength(SURAH_COUNT)
    expect(names[114]).toEqual({ ar: 'fixture-ar-114', en: 'fixture-en-114' })
  })

  it('R6: rejects 114 duplicate chapter IDs instead of overwriting them', async () => {
    const duplicates = Array.from({ length: SURAH_COUNT }, () => ({ id: 1, name_arabic: 'fixture-name', name_simple: 'fixture-name' }))
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({ chapters: duplicates })))
    await expect(fetchSurahNames()).rejects.toThrow(/chapters\?language=en: chapter 1 appears twice/)
  })

  it('R6: rejects a missing chapter, an id out of range and an empty name', () => {
    expect(() => parseSurahNames({ chapters: chapters(113) })).toThrow(/113 chapters, expected 114/)
    const outOfRange = chapters().map((c) => (c.id === 114 ? { ...c, id: 115 } : c))
    expect(() => parseSurahNames({ chapters: outOfRange })).toThrow(/chapters\[113\].id .*115/)
    const noName = chapters().map((c) => (c.id === 7 ? { ...c, name_simple: '' } : c))
    expect(() => parseSurahNames({ chapters: noName })).toThrow(/chapter 7 name_simple/)
  })
})

describe('refreshQuranData (R7)', () => {
  let dir: string
  const originals = { 'quran.json': 'original quran\n', 'quran-words.json': 'original words\n', 'surahs.json': 'original surahs\n' }
  const outputs = () => ({
    quran: pathToFileURL(join(dir, 'quran.json')),
    words: pathToFileURL(join(dir, 'quran-words.json')),
    surahs: pathToFileURL(join(dir, 'surahs.json')),
  })
  const snapshot = async () =>
    Object.fromEntries(await Promise.all((await readdir(dir)).sort().map(async (f) => [f, await readFile(join(dir, f), 'utf8')])))

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'quran-refresh-'))
    for (const [name, text] of Object.entries(originals)) await writeFile(join(dir, name), text)
  })
  afterEach(() => rm(dir, { recursive: true, force: true }))

  const responses = () => [
    ok({ verses: [{ verse_key: '1:1', text_uthmani_tajweed: 'fixture-markup' }] }),
    ok(response),
    ok({ chapters: chapters() }),
  ]
  const run = (fs?: Parameters<typeof refreshQuranData>[0]['fs']) =>
    refreshQuranData({ verseKeys: ['1:1', '1:1'], wordKeys: ['1:1:2', '1:1:1'], recitationId: 6, outputs: outputs(), fs })

  it('writes all three datasets once everything downloads', async () => {
    const fetchStub = vi.fn()
    for (const r of responses()) fetchStub.mockResolvedValueOnce(r)
    vi.stubGlobal('fetch', fetchStub)
    expect(await run()).toEqual({ verses: 1, words: 2, surahs: SURAH_COUNT })
    const files = await snapshot()
    expect(Object.keys(files)).toEqual(['quran-words.json', 'quran.json', 'surahs.json'])
    expect(JSON.parse(files['quran.json']).verses).toEqual({ '1:1': 'fixture-markup' })
    expect(Object.keys(JSON.parse(files['quran-words.json']).words)).toEqual(['1:1:1', '1:1:2'])
    expect(JSON.parse(files['surahs.json']).names['1']).toEqual({ ar: 'fixture-ar-1', en: 'fixture-en-1' })
  })

  it.each([1, 2])('leaves every file unchanged when request %i after a successful one fails', async (failing) => {
    const fetchStub = vi.fn()
    responses().forEach((r, i) => fetchStub.mockResolvedValueOnce(i === failing ? failed : r))
    vi.stubGlobal('fetch', fetchStub)
    await expect(run()).rejects.toThrow(/HTTP 500/)
    expect(fetchStub).toHaveBeenCalledTimes(failing + 1)
    expect(await snapshot()).toEqual(originals)
  })

  it('leaves every file unchanged when the last response is malformed', async () => {
    const fetchStub = vi.fn()
    const all = responses()
    all[2] = ok({ chapters: chapters(113) })
    for (const r of all) fetchStub.mockResolvedValueOnce(r)
    vi.stubGlobal('fetch', fetchStub)
    await expect(run()).rejects.toThrow(/113 chapters/)
    expect(await snapshot()).toEqual(originals)
  })

  it('restores every file when replacing the last one fails', async () => {
    const fetchStub = vi.fn()
    for (const r of responses()) fetchStub.mockResolvedValueOnce(r)
    vi.stubGlobal('fetch', fetchStub)
    const { rename, rm: remove, writeFile: write } = await import('node:fs/promises')
    await expect(
      run({
        writeFile: (path, text) => write(path, text, 'utf8'),
        remove: (path) => remove(path, { force: true }),
        rename: async (from, to) => {
          if (from.endsWith('.tmp') && to.endsWith('surahs.json')) throw new Error('injected rename failure')
          await rename(from, to)
        },
      }),
    ).rejects.toThrow(/every destination was restored: injected rename failure/)
    expect(await snapshot()).toEqual(originals)
  })
})
