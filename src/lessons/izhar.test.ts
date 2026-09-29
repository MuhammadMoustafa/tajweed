import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { applyMarks } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import { LESSONS } from '.'

const lesson = LESSONS.find((l) => l.id === 'izhar')!

describe('izhar lesson', () => {
  it('opens the noon-sakinah unit at order 4 with its clip and the izhar rule', () => {
    expect(lesson.unit).toBe('noon-sakinah')
    expect(lesson.order).toBe(4)
    expect(lesson.animation).toBe('izhar-clip')
    expect(lesson.focusRules).toEqual(['izhar'])
    expect(lesson.reviewed).toBe(false)
  })

  // Each example colors exactly the marked letters: two in a word or across words, and the
  // tanween example's carrier letter plus the next word's throat letter.
  it('colors izhar spans (one when adjacent letters merge) in every example, from its marks', () => {
    for (const example of lesson.examples) {
      expect(example.marks?.length).toBe(2)
      const segments = applyMarks(parseTajweed(getVerseMarkup(example.verseKey) ?? '').segments, example.marks ?? [])
      const izhar = segments.filter((s) => s.rule === 'izhar')
      expect(izhar.length, example.verseKey).toBeGreaterThanOrEqual(1)
    }
  })

  it('covers both poems', () => {
    expect(lesson.mutoon?.tuhfa).not.toBe('not-covered')
    expect(lesson.mutoon?.jazariyya).not.toBe('not-covered')
  })
})
