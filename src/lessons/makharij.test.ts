import { describe, expect, it } from 'vitest'
import { LESSONS } from '.'

const makharij = LESSONS.find((l) => l.id === 'makharij')!

// Every area section gets its own controllable clip (L2b); the introductory sections before them
// don't, and the lesson itself carries no clip of its own (each section plays its own instead).
describe('makharij lesson clips', () => {
  it('has no lesson-level clip', () => {
    expect(makharij.animation).toBeUndefined()
  })

  it('gives the three introductory sections no clip', () => {
    expect(makharij.sections.slice(0, 3).map((s) => s.animation)).toEqual([undefined, undefined, undefined])
  })

  it('gives each of the five area sections its own clip, in area order', () => {
    expect(makharij.sections.slice(3).map((s) => s.animation)).toEqual([
      'makharij-jawf',
      'makharij-halq',
      'makharij-lisan',
      'makharij-shafatan',
      'makharij-khayshum',
    ])
  })
})
