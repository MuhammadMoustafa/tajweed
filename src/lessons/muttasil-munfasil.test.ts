import { describe, expect, it } from 'vitest'
import { LESSONS } from '.'

const lesson = LESSONS.find((l) => l.id === 'muttasil-munfasil')!

// The muttasil and jaiz-munfasil sections each get their own controllable clip (L14, mirroring
// L2b's per-section makharij clips); the lesson itself carries no clip of its own.
describe('muttasil-munfasil lesson clips', () => {
  it('has no lesson-level clip', () => {
    expect(lesson.animation).toBeUndefined()
  })

  it('gives the muttasil section the muttasil clip and the munfasil section the munfasil clip', () => {
    const animations = lesson.sections.map((s) => s.animation)
    expect(animations).toContain('madd-muttasil')
    expect(animations).toContain('madd-munfasil')
    expect(animations.indexOf('madd-muttasil')).toBeLessThan(animations.indexOf('madd-munfasil'))
  })

  it('focuses only madda_obligatory (the API tags both muttasil and munfasil with it)', () => {
    expect(lesson.focusRules).toEqual(['madda_obligatory'])
  })

  it('has at least 2 examples for each kind, told apart by their notes', () => {
    expect(lesson.examples.length).toBeGreaterThanOrEqual(4)
    const muttasilNotes = lesson.examples.filter((e) => e.note.en.includes('muttasil'))
    const munfasilNotes = lesson.examples.filter((e) => e.note.en.includes('munfasil'))
    expect(muttasilNotes.length).toBeGreaterThanOrEqual(2)
    expect(munfasilNotes.length).toBeGreaterThanOrEqual(2)
  })
})
