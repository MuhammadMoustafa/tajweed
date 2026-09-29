import { describe, expect, it } from 'vitest'
import { LESSONS } from '.'
import { getVerseMarkup } from '../data/quran'
import { applyMarks } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import { WAQF_SIGNS } from '../animations/Waqf'
import { waqf } from './waqf'

// What each example's marks must land on, as the sign code points the verse text carries at those
// letters (never the verse text itself), or the ending being taught for the stopping examples.
const SIGNS_AT: Record<string, string[]> = {
  '54:6': [WAQF_SIGNS.lazim],
  '16:24': [WAQF_SIGNS.mamnu],
  '89:17': [WAQF_SIGNS.wasl],
  '16:17': [WAQF_SIGNS.waqf],
  '110:3': [WAQF_SIGNS.jaiz],
  '2:2': [WAQF_SIGNS.muanaqah, WAQF_SIGNS.muanaqah],
}
const ENDINGS_AT: Record<string, RegExp> = {
  '83:9': /\u064C$/, // tanween damma
  '78:6': /^\u0627$/, // the alif that tanween fatha becomes
  '101:1': /^\u0629\u064F$/, // ta marbuta with its damma
}

const markedTexts = (key: string, marks: NonNullable<(typeof waqf.examples)[number]['marks']>) => {
  const parsed = parseTajweed(getVerseMarkup(key as `${number}:${number}`)!)
  return applyMarks(parsed.segments, marks)
    .filter((s) => s.rule === 'waqf_sign')
    .map((s) => s.text)
}

describe('waqf lesson (src/lessons/waqf.ts)', () => {
  it('is registered as lesson 8 opening the stopping unit, focusing waqf_sign', () => {
    expect(LESSONS.find((l) => l.id === 'waqf')).toBe(waqf)
    expect(waqf.order).toBe(8)
    expect(waqf.unit).toBe('stopping')
    expect(waqf.focusRules).toEqual(['waqf_sign'])
  })

  it('gives each of the three teaching sections its own clip', () => {
    expect(waqf.sections.map((s) => s.animation).filter(Boolean)).toEqual(['waqf-signs', 'waqf-stop', 'waqf-restart'])
  })

  it.each(Object.entries(SIGNS_AT))('%s: the marked letters carry the expected sign(s)', (key, signs) => {
    const example = waqf.examples.find((e) => e.verseKey === key)!
    const texts = markedTexts(key, example.marks!)
    expect(texts).toHaveLength(signs.length)
    signs.forEach((sign, i) => expect(texts[i]).toContain(sign))
  })

  it.each(Object.entries(ENDINGS_AT))('%s: the mark lands on the ending being taught', (key, ending) => {
    const example = waqf.examples.find((e) => e.verseKey === key)!
    const texts = markedTexts(key, example.marks!)
    expect(texts).toHaveLength(1)
    expect(texts[0]).toMatch(ending)
  })

  it('has bilingual notes and covers every example above', () => {
    expect(waqf.examples).toHaveLength(Object.keys(SIGNS_AT).length + Object.keys(ENDINGS_AT).length)
    for (const e of waqf.examples) {
      expect(e.note.ar.trim()).not.toBe('')
      expect(e.note.en.trim()).not.toBe('')
    }
  })

  it('cites the Jazariyya lines on waqf and ibtida and marks Tuhfa not covered', () => {
    expect(waqf.mutoon?.tuhfa).toBe('not-covered')
    const passages = waqf.mutoon!.jazariyya
    expect(passages).not.toBe('not-covered')
    expect((passages as { from: number; to?: number }[]).map((p) => [p.from, p.to])).toEqual([
      [73, 78],
      [101, 103],
      [104, 105],
    ])
  })
})
