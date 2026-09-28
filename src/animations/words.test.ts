import { describe, expect, it } from 'vitest'
import { getVerseMarkup, getWord, QURAN_WORDS_SOURCE, splitWordKey, WORD_RECITATION } from '../data/quran'
import { parseTajweed } from '../tajweed/parse'
import { CLIP_WORDS } from './words'

describe('clip words (src/animations/words.ts)', () => {
  it('were fetched with the current recitation', () => {
    expect(QURAN_WORDS_SOURCE.recitationId).toBe(WORD_RECITATION.id)
  })

  it.each(Object.entries(CLIP_WORDS))('%s (%s) has text and a timed audio span', (_name, key) => {
    const word = getWord(key)
    expect(word, `${key}: run npm run fetch-quran`).toBeDefined()
    expect(word!.text.trim()).not.toBe('')
    expect(word!.audio.url).toMatch(/^https:\/\/.+\.mp3$/)
    expect(word!.audio.start).toBeGreaterThanOrEqual(0)
    expect(word!.audio.end).toBeGreaterThan(word!.audio.start)
  })

  // Cross-checks the word position against the ayah's own text (from a different endpoint), so a
  // key pointing at the wrong word fails here rather than playing the wrong word.
  it.each(Object.entries(CLIP_WORDS))('%s (%s) is that word of its ayah in quran.json', (_name, key) => {
    const { verseKey, position } = splitWordKey(key)
    const markup = getVerseMarkup(verseKey)
    expect(markup, `${verseKey}: clip words come from lesson verses`).toBeDefined()
    const verseWords = parseTajweed(markup!)
      .segments.map((s) => s.text)
      .join('')
      .split(/\s+/)
      .filter(Boolean)
    expect(verseWords[position - 1]).toBe(getWord(key)!.text)
  })
})
