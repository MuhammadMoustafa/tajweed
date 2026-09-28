import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { isChoiceAnswerCorrect, isTapAnswerCorrect, scoreQuiz, tapCorrectIndices } from './quiz'
import type { QuizChoiceQuestion } from './types'

describe('tapCorrectIndices', () => {
  it('finds every parsed segment whose rule matches, using the real verse markup', () => {
    // 112:3 has two qalqalah letters (parse.test.ts asserts the exact segment shape for this verse).
    const markup = getVerseMarkup('112:3')
    expect(markup).toBeDefined()
    expect(tapCorrectIndices(markup!, 'qalaqah')).toEqual([1, 3])
  })

  it('returns an empty list when the rule never appears', () => {
    const markup = getVerseMarkup('112:1')
    expect(tapCorrectIndices(markup!, 'ikhafa')).toEqual([])
  })
})

describe('isTapAnswerCorrect', () => {
  const correct = [1, 3]

  it('is correct when the selected set exactly matches', () => {
    expect(isTapAnswerCorrect(new Set([1, 3]), correct)).toBe(true)
    expect(isTapAnswerCorrect(new Set([3, 1]), correct)).toBe(true)
  })

  it('is wrong when a correct segment is missed', () => {
    expect(isTapAnswerCorrect(new Set([1]), correct)).toBe(false)
  })

  it('is wrong when an extra, incorrect segment is tapped', () => {
    expect(isTapAnswerCorrect(new Set([1, 3, 2]), correct)).toBe(false)
  })

  it('is wrong when nothing is tapped', () => {
    expect(isTapAnswerCorrect(new Set(), correct)).toBe(false)
  })
})

describe('isChoiceAnswerCorrect', () => {
  const question: QuizChoiceQuestion = {
    kind: 'choice',
    prompt: { ar: 'س', en: 'Q' },
    options: [
      { ar: 'أ', en: 'A' },
      { ar: 'ب', en: 'B' },
    ],
    correctIndex: 1,
  }

  it('matches the correct index', () => {
    expect(isChoiceAnswerCorrect(question, 1)).toBe(true)
  })

  it('rejects any other index, including undefined (unanswered)', () => {
    expect(isChoiceAnswerCorrect(question, 0)).toBe(false)
    expect(isChoiceAnswerCorrect(question, undefined)).toBe(false)
  })
})

describe('scoreQuiz', () => {
  it('counts correct answers out of the total', () => {
    expect(scoreQuiz([true, false, true, true])).toEqual({ correct: 3, total: 4 })
  })

  it('handles an empty quiz', () => {
    expect(scoreQuiz([])).toEqual({ correct: 0, total: 0 })
  })
})
