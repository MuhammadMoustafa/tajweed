import { describe, expect, it } from 'vitest'
import { applyMarks } from './marks'
import { parseTajweed } from './parse'

// Verse markup copied verbatim from src/data/quran.json (never typed by hand).
const ikhlas1 =
  'قُلْ هُوَ <tajweed class=ham_wasl>ٱ</tajweed>للَّهُ أَحَ<tajweed class=qalaqah>د</tajweed>ٌ <span class=end>١</span>'

describe('applyMarks', () => {
  it('marks a whole word when letter is omitted', () => {
    const { segments } = parseTajweed(ikhlas1)
    const marked = applyMarks(segments, [{ word: 1, rule: 'tafkheem' }])

    const hit = marked.find((s) => s.rule === 'tafkheem')
    expect(hit?.text).toBe('قُلْ')
    // The rest of the verse is untouched.
    expect(marked.map((s) => s.text).join('')).toBe(segments.map((s) => s.text).join(''))
  })

  it('marks a single letter, keeping its harakat together', () => {
    const { segments } = parseTajweed(ikhlas1)
    // Word 3 "ٱللَّهُ" → graphemes: ٱ, ل, لَّ (shadda+fatha), هُ. Letter 3 is the shaddah lam.
    const marked = applyMarks(segments, [{ word: 3, letter: 3, rule: 'tafkheem' }])

    const hit = marked.find((s) => s.rule === 'tafkheem')
    expect(hit?.text).toBe('لَّ')
  })

  it('never overwrites a letter the API already tagged: the API rule wins', () => {
    const { segments } = parseTajweed(ikhlas1)
    // Word 3 letter 1 is "ٱ", already tagged ham_wasl by the API.
    const marked = applyMarks(segments, [{ word: 3, letter: 1, rule: 'tafkheem' }])

    expect(marked.some((s) => s.rule === 'tafkheem')).toBe(false)
    expect(marked.some((s) => s.rule === 'ham_wasl' && s.text === 'ٱ')).toBe(true)
  })

  it('applies several marks, splitting segments as needed', () => {
    const { segments } = parseTajweed(ikhlas1)
    const marked = applyMarks(segments, [
      { word: 1, rule: 'izhar' },
      { word: 4, letter: 2, rule: 'tafkheem' },
    ])

    expect(marked.find((s) => s.rule === 'izhar')?.text).toBe('قُلْ')
    // Word 4 "أَحَدٌ" → graphemes: أَ, حَ, دٌ. Letter 2 is "حَ".
    expect(marked.find((s) => s.rule === 'tafkheem')?.text).toBe('حَ')
    expect(marked.map((s) => s.text).join('')).toBe(segments.map((s) => s.text).join(''))
  })

  it('returns the original segments unchanged when there are no marks', () => {
    const { segments } = parseTajweed(ikhlas1)
    expect(applyMarks(segments, [])).toEqual(segments)
  })

  it('throws a clear error when the word is out of range', () => {
    const { segments } = parseTajweed(ikhlas1)
    expect(() => applyMarks(segments, [{ word: 99, rule: 'tafkheem' }])).toThrow(/word 99/)
  })

  it('throws a clear error when the letter is out of range', () => {
    const { segments } = parseTajweed(ikhlas1)
    // Word 1 "قُلْ" only has 2 letters.
    expect(() => applyMarks(segments, [{ word: 1, letter: 99, rule: 'tafkheem' }])).toThrow(/letter 99/)
  })
})
