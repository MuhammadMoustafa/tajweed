import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { segmentsToLetters } from '../tajweed/graphemes'
import { applyMarks, type Mark } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import { isChoiceAnswerCorrect, isTapAnswerCorrect, scoreQuiz, tapCorrectIndices } from './quiz'
import type { QuizChoiceQuestion } from './types'

// Verse markup copied verbatim from src/data/quran.json (never typed by hand).
const ikhlas1 =
  'قُلْ هُوَ <tajweed class=ham_wasl>ٱ</tajweed>للَّهُ أَحَ<tajweed class=qalaqah>د</tajweed>ٌ <span class=end>١</span>'

describe('tapCorrectIndices', () => {
  it('finds the tapIndex of every letter (not rule run) whose rule matches, using the real verse markup', () => {
    // 112:3 "لَمْ يَلِدْ وَلَمْ يُولَدْ" has two qalqalah letters, each its own single-letter API
    // span ("دْ"). Spaces never get a tapIndex, so these aren't small contiguous numbers.
    const markup = getVerseMarkup('112:3')
    expect(markup).toBeDefined()
    const indices = tapCorrectIndices(markup!, 'qalaqah')
    expect(indices).toEqual([4, 11])

    // Confirm those indices really do land on the "دْ" letters, not on a whole rule-run span.
    const letters = segmentsToLetters(parseTajweed(markup!).segments)
    const tapped = letters.filter((l) => l.tapIndex !== undefined && indices.includes(l.tapIndex))
    expect(tapped.map((l) => l.text)).toEqual(['دْ', 'دْ'])
  })

  it('returns an empty list when the rule never appears', () => {
    const markup = getVerseMarkup('112:1')
    expect(tapCorrectIndices(markup!, 'ikhafa')).toEqual([])
  })

  it('derives a custom-rule answer from marks, keeping a letter and its harakat together', () => {
    // Word 3 "ٱللَّهُ" → graphemes: ٱ, ل, لَّ (shadda+fatha), هُ (see marks.test.ts). Mark the
    // shaddah lam with a custom rule the API markup never tags.
    const marks: Mark[] = [{ word: 3, letter: 3, rule: 'tafkheem' }]
    const indices = tapCorrectIndices(ikhlas1, 'tafkheem', marks)
    expect(indices).toHaveLength(1)

    const segments = applyMarks(parseTajweed(ikhlas1).segments, marks)
    const letters = segmentsToLetters(segments)
    const letter = letters.find((l) => l.tapIndex === indices[0])
    expect(letter?.text).toBe('لَّ')
    expect(letter?.rule).toBe('tafkheem')
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
