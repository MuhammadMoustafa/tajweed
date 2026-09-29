import { describe, expect, it } from 'vitest'
import { findLesson } from '.'
import { ANIMATIONS } from '../animations'
import { getVerseMarkup } from '../data/quran'
import { applyMarks } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import { tapCorrectIndices } from './quiz'

const lesson = findLesson('meem-sakinah')!

/** Text of the letters each rule colors in an example (API tags plus the example's marks). */
const coloredBy = (verseKey: `${number}:${number}`, rule: string) => {
  const ex = lesson.examples.find((e) => e.verseKey === verseKey)!
  const segments = applyMarks(parseTajweed(getVerseMarkup(verseKey)!).segments, ex.marks ?? [])
  return segments.filter((s) => s.rule === rule).map((s) => s.text)
}

describe('meem-sakinah lesson', () => {
  it('is lesson 8, with one clip per rule under its own section', () => {
    expect(lesson.order).toBe(8)
    expect(lesson.unit).toBeUndefined()
    const clips = lesson.sections.map((s) => s.animation).filter(Boolean)
    expect(clips).toEqual(['meem-ikhfa-shafawi', 'meem-idgham-shafawi', 'meem-izhar-shafawi'])
    for (const id of clips) expect(ANIMATIONS[id!].steps.length).toBeGreaterThan(2)
  })

  it('colors a meem in every example, in the rule it teaches', () => {
    for (const [key, rule] of [
      ['105:4', 'ikhafa_shafawi'],
      ['104:8', 'idgham_shafawi'],
      ['105:2', 'izhar_shafawi'],
    ] as const) {
      const texts = coloredBy(key, rule)
      expect(texts, key).toHaveLength(1)
      expect(texts[0].includes('م'), key).toBe(true)
    }
    const both = coloredBy('1:7', 'izhar_shafawi')
    expect(both).toHaveLength(2)
    for (const t of both) expect(t.includes('م')).toBe(true)
  })

  it('answers the tap question with the marked meem', () => {
    const q = lesson.quiz!.find((x) => x.kind === 'tap')!
    if (q.kind !== 'tap') throw new Error('unreachable')
    expect(tapCorrectIndices(getVerseMarkup(q.verseKey)!, q.rule, q.marks)).toHaveLength(1)
  })

  it('cites both poems, with the meem sakinah lines', () => {
    expect(Array.isArray(lesson.mutoon?.tuhfa)).toBe(true)
    expect(Array.isArray(lesson.mutoon?.jazariyya)).toBe(true)
  })
})
