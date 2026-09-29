import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { applyMarks } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import { ra } from './ra'

const KASRA = '\u0650'

describe('ra lesson', () => {
  it('marks only ra letters, heavy or light, in every example', () => {
    for (const example of ra.examples) {
      const segments = applyMarks(parseTajweed(getVerseMarkup(example.verseKey) ?? '').segments, example.marks ?? [])
      const marked = segments.filter((s) => s.rule === 'tafkheem' || s.rule === 'tarqeeq')
      expect(marked.length, example.verseKey).toBeGreaterThan(0)
      for (const s of marked) expect(s.text.startsWith('\u0631'), `${example.verseKey}: ${s.text}`).toBe(true)
    }
  })

  it('never calls a ra with a fatha light, nor one with a kasra heavy unless it has a sukun', () => {
    for (const example of ra.examples) {
      const segments = applyMarks(parseTajweed(getVerseMarkup(example.verseKey) ?? '').segments, example.marks ?? [])
      for (const s of segments) {
        if (s.rule === 'tarqeeq') expect(s.text, example.verseKey).not.toContain('َ')
        // A heavy ra with a written kasra is only a ra at the end of an ayah where you stop.
        if (s.rule === 'tafkheem' && s.text.includes(KASRA)) expect(['97:1', '103:1'], example.verseKey).toContain(example.verseKey)
      }
    }
  })

  it('covers both heavy and light ras across the examples', () => {
    const rules = ra.examples.flatMap((e) => e.marks ?? []).map((m) => m.rule)
    expect(rules).toContain('tafkheem')
    expect(rules).toContain('tarqeeq')
  })

  it('leaves Tuhfa uncovered and cites the Jazariyya chapter on the ra', () => {
    expect(ra.mutoon?.tuhfa).toBe('not-covered')
    expect(ra.mutoon?.jazariyya).not.toBe('not-covered')
  })

  it('has a clip per teaching section', () => {
    expect(ra.sections.filter((s) => s.animation).map((s) => s.animation)).toEqual(['ra-vowel', 'ra-sakinah', 'ra-waqf'])
  })
})
