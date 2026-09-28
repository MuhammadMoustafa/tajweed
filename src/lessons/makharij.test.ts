import { describe, expect, it } from 'vitest'
import { LESSONS } from '.'
import { hasQuiz } from './quiz'

const unit = LESSONS.filter((l) => l.unit === 'makharij')
const intro = LESSONS.find((l) => l.id === 'makharij')!

// L2c: the makharij unit is an intro plus one chapter per area. The intro keeps the old lesson's
// id so progress saved for it still matches.
describe('makharij unit', () => {
  it('is the intro, then the five area chapters, in order and next to each other', () => {
    expect(unit.map((l) => [l.id, l.order])).toEqual([
      ['makharij', 2],
      ['makharij-jawf', 2.1],
      ['makharij-halq', 2.2],
      ['makharij-lisan', 2.3],
      ['makharij-shafatan', 2.4],
      ['makharij-khayshum', 2.5],
    ])
    const first = LESSONS.indexOf(intro)
    expect(LESSONS.slice(first, first + unit.length)).toEqual(unit)
  })

  it('gives the intro no lesson-level clip and the five-areas overview under its last section', () => {
    expect(intro.animation).toBeUndefined()
    expect(intro.sections.map((s) => s.animation)).toEqual([undefined, undefined, 'makharij-areas'])
  })

  it.each(unit.slice(1).map((l) => [l.id, l] as const))('%s plays its own area clip beside the text', (id, lesson) => {
    expect(lesson.animation).toBe(id)
    expect(lesson.sections.every((s) => s.animation === undefined)).toBe(true)
  })

  it.each(unit.map((l) => [l.id, l] as const))('%s colors no rule, has a quiz and awaits review', (_id, lesson) => {
    expect(lesson.focusRules).toEqual([])
    expect(hasQuiz(lesson)).toBe(true)
    expect(lesson.quiz?.length).toBeGreaterThanOrEqual(3)
    expect(lesson.examples.length).toBeGreaterThan(0)
    expect(lesson.reviewed).toBe(false)
  })

  // Tuhfat al-Atfal has no makharij chapter; al-Jazariyyah's (lines 9–19) is shared out: the
  // opening line to the intro, then each area's lines to its chapter (a line that moves from one
  // area to the next is shown in both).
  it('cites al-Jazariyyah lines 9–19 across the unit, and Tuhfa nowhere', () => {
    const ranges = unit.map((l) => {
      expect(l.mutoon?.tuhfa).toBe('not-covered')
      const passages = l.mutoon?.jazariyya
      if (!passages || passages === 'not-covered') throw new Error(`${l.id} cites no Jazariyya line`)
      return passages.map((p) => [p.from, p.to ?? p.from])
    })
    expect(ranges).toEqual([[[9, 9]], [[10, 10]], [[11, 12]], [[12, 18]], [[18, 19]], [[19, 19]]])
  })
})
