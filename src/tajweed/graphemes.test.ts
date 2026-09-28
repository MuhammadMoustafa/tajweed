import { describe, expect, it } from 'vitest'
import { segmentsToLetters, splitGraphemes } from './graphemes'

describe('splitGraphemes', () => {
  it('keeps a base letter joined with its harakat as one grapheme', () => {
    // "لَّ" = lam + shadda + fatha, one grapheme cluster.
    const graphemes = splitGraphemes('لَّهُ')
    expect(graphemes.map((g) => g.segment)).toEqual(['لَّ', 'هُ'])
  })
})

describe('segmentsToLetters', () => {
  it('splits a segment into one entry per letter, inheriting its rule', () => {
    const letters = segmentsToLetters([{ text: 'قُلْ', rule: 'qalaqah' }])
    expect(letters.map((l) => l.text)).toEqual(['قُ', 'لْ'])
    expect(letters.every((l) => l.rule === 'qalaqah')).toBe(true)
  })

  it('flags spaces and gives them no tapIndex, while numbering letters around them', () => {
    const letters = segmentsToLetters([{ text: 'قُلْ هُوَ' }])
    expect(letters.map((l) => (l.isSpace ? 'space' : l.text))).toEqual(['قُ', 'لْ', 'space', 'هُ', 'وَ'])
    expect(letters.map((l) => l.tapIndex)).toEqual([0, 1, undefined, 2, 3])
  })

  it('keeps a letter and its harakat as a single tap target', () => {
    // "لَّ" (shadda+fatha) must be one entry, not split into lam / shadda / fatha.
    const letters = segmentsToLetters([{ text: 'لَّ', rule: 'tafkheem' }])
    expect(letters).toHaveLength(1)
    expect(letters[0].text).toBe('لَّ')
    expect(letters[0].tapIndex).toBe(0)
  })

  it('traces each letter back to the segment holding its base character', () => {
    // The 112:1 split below: the tanween sits in segment 2 but belongs to the د of segment 1.
    const letters = segmentsToLetters([{ text: 'أَحَ' }, { text: 'د', rule: 'qalaqah' }, { text: 'ٌ ' }])
    expect(letters.map((l) => l.segment)).toEqual([0, 0, 1, 2])
  })

  it('keeps a harakah the API left outside a tagged letter on that letter (112:1)', () => {
    // From quran.json 112:1: the API tags د but its tanween follows in the untagged segment.
    const letters = segmentsToLetters([{ text: 'أَحَ' }, { text: 'د', rule: 'qalaqah' }, { text: 'ٌ ' }])
    const dal = letters.find((l) => l.rule === 'qalaqah')
    expect(dal?.text).toBe('دٌ')
    expect(letters.filter((l) => !l.isSpace).map((l) => l.text)).toEqual(['أَ', 'حَ', 'دٌ'])
  })

  it('returns an empty list for no segments', () => {
    expect(segmentsToLetters([])).toEqual([])
  })
})
