import { describe, expect, it } from 'vitest'
import fixture from '../../src/test/fixtures/verse-words-1-1.json'
import { parseVerseWords, type VerseWordsResponse } from './quran-api.ts'

// A real `/verses/by_key/1:1?words=true&word_fields=text_uthmani&audio=6` response (trimmed to the
// fields parseVerseWords reads) — the Quran text in it comes from the API, never typed here.
const response = fixture as VerseWordsResponse

/** The fixture with its audio replaced, for the malformed cases. */
const withAudio = (audio: VerseWordsResponse['verse']['audio']): VerseWordsResponse => ({
  verse: { ...response.verse, audio },
})

describe('parseVerseWords', () => {
  it('gives every word its text and its segment of the https ayah audio', () => {
    const words = parseVerseWords(response)
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
    expect(parseVerseWords(response)[end.position]).toBeUndefined()
  })

  it('throws when the audio is missing, a segment is missing, or segments are out of order', () => {
    const { url, segments } = response.verse.audio!
    expect(() => parseVerseWords(withAudio(undefined))).toThrow(/no audio/)
    expect(() => parseVerseWords(withAudio({ url, segments: segments.slice(1) }))).toThrow(/segments for/)
    const swapped = [segments[1], segments[0], ...segments.slice(2)]
    expect(() => parseVerseWords(withAudio({ url, segments: swapped }))).toThrow(/out-of-order/)
    const overlapping = segments.map((s, i) => (i === 1 ? [s[0], s[1], s[2] - 100, s[3]] : s))
    expect(() => parseVerseWords(withAudio({ url, segments: overlapping }))).toThrow(/out-of-order/)
  })
})
