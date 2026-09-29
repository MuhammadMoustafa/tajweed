import { describe, expect, it } from 'vitest'
import { getVerseMarkup, getWord, QURAN_WORDS_SOURCE, splitWordKey, WORD_RECITATION } from '../data/quran'
import { parseTajweed } from '../tajweed/parse'
import { CLIP_WORDS, LETTER_WORDS } from './words'

/** Every fetched word, named: the clips' and the letters page's. */
const WORDS = [...Object.entries(CLIP_WORDS), ...Object.entries(LETTER_WORDS).map(([letter, key]) => [`letter ${letter}`, key] as const)]

describe('clip words (src/animations/words.ts)', () => {
  it('were fetched with the current recitation', () => {
    expect(QURAN_WORDS_SOURCE.recitationId).toBe(WORD_RECITATION.id)
  })

  it.each(WORDS)('%s (%s) has text and a timed audio span', (_name, key) => {
    const word = getWord(key)
    expect(word, `${key}: run npm run fetch-quran`).toBeDefined()
    expect(word!.text.trim()).not.toBe('')
    expect(word!.audio.url).toMatch(/^https:\/\/.+\.mp3$/)
    expect(word!.audio.start).toBeGreaterThanOrEqual(0)
    expect(word!.audio.end).toBeGreaterThan(word!.audio.start)
  })

  // Cross-checks the word position against the ayah's own text (from a different endpoint), so a
  // key pointing at the wrong word fails here rather than playing the wrong word.
  it.each(WORDS)('%s (%s) is that word of its ayah in quran.json', (_name, key) => {
    const { verseKey, position } = splitWordKey(key)
    const markup = getVerseMarkup(verseKey)
    expect(markup, `${verseKey}: clip word verses are fetched with the lesson verses`).toBeDefined()
    expect(markup, `${verseKey}: run npm run fetch-quran`).toBeDefined()
    const verseWords = parseTajweed(markup!)
      .segments.map((s) => s.text)
      .join('')
      .split(/\s+/)
      .filter(Boolean)
    expect(verseWords[position - 1]).toBe(getWord(key)!.text)
  })
})
