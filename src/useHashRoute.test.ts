import { describe, expect, it } from 'vitest'
import { parseHash } from './useHashRoute'

describe('parseHash', () => {
  it('routes a lesson and its quiz page', () => {
    expect(parseHash('#/lesson/qalqalah')).toEqual({ page: 'lesson', id: 'qalqalah' })
    expect(parseHash('#/lesson/natural-madd/quiz')).toEqual({ page: 'quiz', id: 'natural-madd' })
  })

  it('routes the progress page', () => {
    expect(parseHash('#/progress')).toEqual({ page: 'progress' })
  })

  it('falls back to home for anything else', () => {
    expect(parseHash('')).toEqual({ page: 'home' })
    expect(parseHash('#/lesson/qalqalah/other')).toEqual({ page: 'home' })
  })
})
