import { describe, expect, it } from 'vitest'
import { ANIMATIONS } from '../animations'
import { foundations } from './foundations'
import { findLesson } from './index'

describe('foundations lesson', () => {
  it('is registered first, in the first unit and no focus rule', () => {
    expect(findLesson('foundations')).toBe(foundations)
    expect(foundations.order).toBe(1)
    expect(foundations.unit).toBe('foundations')
    expect(foundations.focusRules).toEqual([])
  })

  it('has a clip on each of the harakat, sukun/shaddah and tanween sections', () => {
    const ids = foundations.sections.flatMap((s) => (s.animation ? [s.animation] : []))
    expect(ids).toEqual(['foundations-harakat', 'foundations-sukun-shadda', 'foundations-tanween'])
    for (const id of ids) expect(ANIMATIONS[id].steps.length).toBeGreaterThan(0)
  })

  it('uses the basmala, verse 1:1, as its first example', () => {
    expect(foundations.examples[0].verseKey).toBe('1:1')
  })

  it('names both poems, neither covering the basics', () => {
    expect(foundations.mutoon).toEqual({ tuhfa: 'not-covered', jazariyya: 'not-covered' })
  })
})
