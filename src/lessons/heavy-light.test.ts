import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { HEAVY_LETTERS } from '../animations/HeavyLight'
import { applyMarks } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import { heavyLight } from './heavy-light'

describe('heavy-light lesson', () => {
  it('colors only heavy letters as tafkheem and only light letters as tarqeeq in its examples', () => {
    for (const example of heavyLight.examples) {
      const segments = applyMarks(parseTajweed(getVerseMarkup(example.verseKey) ?? '').segments, example.marks ?? [])
      const heavy = segments.filter((s) => s.rule === 'tafkheem')
      const light = segments.filter((s) => s.rule === 'tarqeeq')
      expect(heavy.length, example.verseKey).toBeGreaterThan(0)
      expect(light.length, example.verseKey).toBeGreaterThan(0)
      for (const s of heavy) expect(HEAVY_LETTERS.some((l) => s.text.includes(l)), s.text).toBe(true)
      for (const s of light) expect(HEAVY_LETTERS.some((l) => s.text.includes(l)), s.text).toBe(false)
    }
  })

  it('leaves Tuhfa uncovered and cites the Jazariyya', () => {
    expect(heavyLight.mutoon?.tuhfa).toBe('not-covered')
    expect(heavyLight.mutoon?.jazariyya).not.toBe('not-covered')
  })
})
