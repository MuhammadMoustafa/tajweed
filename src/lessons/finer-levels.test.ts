import { describe, expect, it } from 'vitest'
import { LESSONS } from '.'
import { getVerseMarkup } from '../data/quran'
import { applyMarks } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import type { VerseKey } from './types'
import { UNITS } from './units'

const lessonOf = (id: string) => LESSONS.find((l) => l.id === id)!
const colored = (id: string, verseKey: VerseKey) => {
  const example = lessonOf(id).examples.find((e) => e.verseKey === verseKey)!
  const segments = applyMarks(parseTajweed(getVerseMarkup(verseKey)!).segments, example.marks ?? [])
  return segments.filter((s) => s.rule && lessonOf(id).focusRules.includes(s.rule)).map((s) => [s.rule, s.text] as const)
}

describe('finer levels unit (L24)', () => {
  it('is unit 12 with three lessons 12, 12.1, 12.2, titled in both languages', () => {
    expect(UNITS['finer-levels'].order).toBe(12)
    expect(UNITS['finer-levels'].title.ar.trim()).not.toBe('')
    const lessons = LESSONS.filter((l) => l.unit === 'finer-levels')
    expect(lessons.map((l) => [l.id, l.order])).toEqual([
      ['tafkhim-levels', 12],
      ['ghunnah-levels', 12.1],
      ['idgham-complete-incomplete', 12.2],
    ])
    expect(lessons.map((l) => l.sections.map((s) => s.animation).filter(Boolean))).toEqual([
      ['tafkhim-levels'],
      ['ghunnah-levels'],
      ['idgham-naqis'],
    ])
    for (const l of lessons) expect(l.reviewed).toBe(false)
  })

  it.each<[VerseKey, string]>([
    ['101:1', 'ق'],
    ['1:6', 'ص'],
    ['112:1', 'ق'],
    ['105:2', 'ض'],
  ])('tafkhim example %s colors heavy letters only (first: %s)', (verseKey, first) => {
    const spans = colored('tafkhim-levels', verseKey)
    expect(spans.length).toBeGreaterThan(0)
    for (const [rule, text] of spans) {
      expect(rule).toBe('tafkheem')
      expect('خصضغطقظ'.includes(text[0])).toBe(true)
    }
    expect(spans.some(([, text]) => text.startsWith(first))).toBe(true)
  })

  it('marks the ṭa before the ta in the two incomplete-idgham examples, and keeps the API idgham colors', () => {
    for (const key of ['27:22', '5:28'] as const) {
      const spans = colored('idgham-complete-incomplete', key)
      expect(spans.filter(([r]) => r === 'tafkheem').map(([, t]) => t[0])).toEqual(['ط'])
    }
    expect(colored('idgham-complete-incomplete', '99:7').map(([r]) => r)).toEqual(['idgham_ghunnah', 'idgham_ghunnah'])
    expect(colored('idgham-complete-incomplete', '100:11').map(([r]) => r)).toEqual(['idgham_wo_ghunnah'])
  })

  it('colors each ghunnah level with its own rule', () => {
    const rules = (key: VerseKey) => new Set(colored('ghunnah-levels', key).map(([r]) => r))
    expect(rules('78:1')).toEqual(new Set(['ghunnah']))
    expect(rules('99:7')).toEqual(new Set(['idgham_ghunnah']))
    expect(rules('113:2')).toEqual(new Set(['ikhafa']))
    expect(rules('80:27')).toEqual(new Set(['iqlab']))
    expect(rules('1:7')).toEqual(new Set(['izhar']))
  })

  it('cites both poems for every lesson but Tuhfa on tafkhim, in both languages', () => {
    for (const l of LESSONS.filter((x) => x.unit === 'finer-levels')) {
      expect(l.mutoon?.jazariyya).not.toBe('not-covered')
      if (l.id !== 'tafkhim-levels') expect(l.mutoon?.tuhfa).not.toBe('not-covered')
      else expect(l.mutoon?.tuhfa).toBe('not-covered')
      for (const p of [l.mutoon!.tuhfa, l.mutoon!.jazariyya]) {
        if (p === 'not-covered') continue
        for (const passage of p) {
          expect(passage.note.ar.trim()).not.toBe('')
          expect(passage.note.en.trim()).not.toBe('')
        }
      }
    }
  })
})
