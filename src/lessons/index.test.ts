import { describe, expect, it } from 'vitest'
import { adjacentLessons, findLesson, LESSONS } from '.'
import type { Lesson } from './types'

const stub = (id: string, order: number): Lesson => ({
  id,
  order,
  title: { ar: id, en: id },
  summary: { ar: id, en: id },
  sections: [],
  focusRules: [],
  examples: [],
  reviewed: true,
})

const three = [stub('a', 1), stub('b', 2), stub('c', 3)]

describe('adjacentLessons', () => {
  it('has no prev at the start of the list', () => {
    expect(adjacentLessons('a', three)).toEqual({ prev: undefined, next: three[1] })
  })

  it('has both prev and next in the middle', () => {
    expect(adjacentLessons('b', three)).toEqual({ prev: three[0], next: three[2] })
  })

  it('has no next at the end of the list', () => {
    expect(adjacentLessons('c', three)).toEqual({ prev: three[1], next: undefined })
  })

  it('returns neither for an id not in the list', () => {
    expect(adjacentLessons('missing', three)).toEqual({})
  })

  it('defaults to the real LESSONS order', () => {
    for (const lesson of LESSONS) {
      const index = LESSONS.indexOf(lesson)
      expect(adjacentLessons(lesson.id)).toEqual({ prev: LESSONS[index - 1], next: LESSONS[index + 1] })
    }
  })

  it('findLesson still finds every registered lesson', () => {
    for (const lesson of LESSONS) expect(findLesson(lesson.id)).toBe(lesson)
  })
})
