import { describe, expect, it } from 'vitest'
import { ANIMATIONS } from '../animations'
import { foundations } from './foundations'
import { foundationsBasmala } from './foundations-basmala'
import { foundationsHarakat } from './foundations-harakat'
import { foundationsShaddahTanween } from './foundations-shaddah-tanween'
import { findLesson, LESSONS } from './index'

const UNIT = [foundations, foundationsHarakat, foundationsShaddahTanween, foundationsBasmala]

describe('foundations lessons', () => {
  it('are four lessons in the first unit, orders 1 to 1.3, with no focus rule; the first keeps its id', () => {
    expect(findLesson('foundations')).toBe(foundations)
    expect(UNIT.map((l) => l.order)).toEqual([1, 1.1, 1.2, 1.3])
    expect(LESSONS.filter((l) => l.unit === 'foundations')).toEqual(UNIT)
    for (const l of UNIT) expect(l.focusRules).toEqual([])
  })

  it('give each visual section its own clip', () => {
    const ids = (l: (typeof UNIT)[number]) => l.sections.flatMap((s) => (s.animation ? [s.animation] : []))
    expect(ids(foundationsHarakat)).toEqual(['foundations-harakat', 'foundations-sukun'])
    expect(ids(foundationsShaddahTanween)).toEqual(['foundations-shadda', 'foundations-tanween'])
    for (const id of [...ids(foundationsHarakat), ...ids(foundationsShaddahTanween)])
      expect(ANIMATIONS[id as keyof typeof ANIMATIONS].steps.length).toBeGreaterThan(0)
  })

  it('uses the basmala, verse 1:1, as the basmala lesson example', () => {
    expect(foundationsBasmala.examples[0].verseKey).toBe('1:1')
  })

  it('name both poems, neither covering the basics', () => {
    for (const l of UNIT) expect(l.mutoon).toEqual({ tuhfa: 'not-covered', jazariyya: 'not-covered' })
  })
})
