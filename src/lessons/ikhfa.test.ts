import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { parseTajweed } from '../tajweed/parse'
import { IKHFA_LETTERS } from '../animations/IkhfaClip'
import { LESSONS } from '.'

const lesson = LESSONS.find((l) => l.id === 'ikhfa')!

describe('ikhfa lesson', () => {
  it('closes the noon-sakinah unit at order 7 with the ikhafa rule and a clip', () => {
    expect(lesson.unit).toBe('noon-sakinah')
    expect(lesson.order).toBe(7)
    expect(lesson.focusRules).toEqual(['ikhafa'])
    expect(lesson.animation).toBe('ikhfa-hidden')
  })

  it('ends with a summary of the four rules, in both languages', () => {
    const last = lesson.sections[lesson.sections.length - 1]
    expect(last.body.en).toMatch(/Izhar.*Idgham.*Iqlab.*Ikhfa/)
    expect(last.body.ar).toMatch(/الإظهار.*الإدغام.*الإقلاب.*الإخفاء/)
  })

  it('colors ikhafa in every example', () => {
    for (const { verseKey } of lesson.examples) {
      const segments = parseTajweed(getVerseMarkup(verseKey))
      expect(segments.some((s) => s.rule === 'ikhafa'), verseKey).toBe(true)
    }
  })

  it('names fifteen distinct letters, none of them izhar, idgham or iqlab letters', () => {
    expect(new Set(IKHFA_LETTERS).size).toBe(15)
    for (const other of 'ءهعحغخيرملونب') expect(IKHFA_LETTERS).not.toContain(other)
  })

  it('cites both poems, Tuhfa lines 14-16 and Jazariyya line 68', () => {
    const m = lesson.mutoon!
    expect(m.tuhfa).not.toBe('not-covered')
    expect(m.jazariyya).not.toBe('not-covered')
  })
})
