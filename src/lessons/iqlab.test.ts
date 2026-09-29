import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { parseTajweed } from '../tajweed/parse'
import { findLesson } from '.'

const lesson = findLesson('iqlab')!

describe('iqlab lesson', () => {
  it('is the third noon-sakinah lesson, in that unit, with both poems', () => {
    expect(lesson.unit).toBe('noon-sakinah')
    expect(lesson.order).toBe(6)
    expect(lesson.focusRules).toEqual(['iqlab'])
    expect(lesson.animation).toBe('iqlab-meem')
    expect(Array.isArray(lesson.mutoon?.tuhfa)).toBe(true)
    expect(Array.isArray(lesson.mutoon?.jazariyya)).toBe(true)
  })

  it('colors iqlab in every example, inside a word and across words', () => {
    for (const example of lesson.examples) {
      const spans = parseTajweed(getVerseMarkup(example.verseKey) ?? "").segments.filter((s) => s.rule === 'iqlab')
      expect(spans.length, example.verseKey).toBeGreaterThan(0)
    }
    expect(lesson.examples.length).toBeGreaterThanOrEqual(4)
  })
})
