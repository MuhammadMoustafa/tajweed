import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { applyMarks } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import { LESSONS } from '.'

const lesson = LESSONS.find((l) => l.id === 'lam-rules')!

const rulesOf = (verseKey: string) => {
  const example = lesson.examples.find((e) => e.verseKey === verseKey)!
  const segments = applyMarks(parseTajweed(getVerseMarkup(verseKey as `${number}:${number}`)!).segments, example.marks ?? [])
  return segments.filter((s) => s.rule).map((s) => [s.rule, s.text] as const)
}

describe('lam-rules lesson', () => {
  it('has one clip per teaching section and none of its own', () => {
    expect(lesson.animation).toBeUndefined()
    expect(lesson.sections.map((s) => s.animation).filter(Boolean)).toEqual(['lam-shamsiyyah', 'lam-qamariyyah', 'lam-allah'])
  })

  it('colors the sun lam (API) plus the marked moon, heavy and light lams', () => {
    const rules = (key: string) => rulesOf(key).map(([r]) => r)
    expect(rules('1:1')).toEqual(expect.arrayContaining(['laam_shamsiyah', 'tarqeeq']))
    expect(rules('1:2')).toEqual(expect.arrayContaining(['laam_qamariyah', 'tarqeeq']))
    expect(rules('112:1')).toContain('tafkheem')
    expect(rules('112:2')).toEqual(expect.arrayContaining(['laam_shamsiyah', 'tafkheem']))
  })

  it('marks a lam letter each time', () => {
    for (const key of ['1:1', '1:2', '112:1', '112:2']) {
      for (const [rule, text] of rulesOf(key)) {
        if (rule === 'tafkheem' || rule === 'tarqeeq' || rule === 'laam_qamariyah' || rule === 'laam_shamsiyah') {
          expect(text, `${key} ${rule}`).toContain('ل')
        }
      }
    }
  })

  it('cites Tuhfa lines 24-29 (its whole lam section) and Jazariyya line 44', () => {
    const tuhfa = lesson.mutoon!.tuhfa
    expect(tuhfa).not.toBe('not-covered')
    if (tuhfa !== 'not-covered') {
      expect(tuhfa[0].from).toBe(24)
      expect(tuhfa.at(-1)!.from).toBe(29)
    }
    const jaz = lesson.mutoon!.jazariyya
    expect(jaz === 'not-covered' ? [] : jaz.map((p) => p.from)).toContain(44)
  })
})
