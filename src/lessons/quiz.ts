import { segmentsToLetters } from '../tajweed/graphemes'
import { applyMarks, type Mark } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import type { RuleId } from '../tajweed/rules'
import type { QuizChoiceQuestion } from './types'

/** Visual state of a tappable letter; drives color only (see TajweedText). */
export type SegmentState = 'selected' | 'correct' | 'wrong'

/**
 * The correct answers for a "tap the letters" question: the `tapIndex` of every letter (grapheme)
 * whose rule matches — never a whole rule run. For a custom rule (one the API markup doesn't tag),
 * pass the question's `marks` so they're applied before splitting into letters. Reuses
 * `parseTajweed`/`applyMarks` — the only places verse markup/marks are interpreted — so the answer
 * is derived from the real verse rather than hand-picked.
 */
export function tapCorrectIndices(markup: string, rule: RuleId, marks?: readonly Mark[]): number[] {
  const { segments } = parseTajweed(markup)
  const ruled = marks && marks.length > 0 ? applyMarks(segments, marks) : segments
  return segmentsToLetters(ruled).reduce<number[]>((indices, letter) => {
    if (letter.tapIndex !== undefined && letter.rule === rule) indices.push(letter.tapIndex)
    return indices
  }, [])
}

/** A tap answer is correct only when the tapped letters are exactly the correct ones. */
export function isTapAnswerCorrect(selected: ReadonlySet<number>, correct: readonly number[]): boolean {
  return selected.size === correct.length && correct.every((i) => selected.has(i))
}

export function isChoiceAnswerCorrect(question: QuizChoiceQuestion, selectedIndex: number | undefined): boolean {
  return selectedIndex === question.correctIndex
}

export function scoreQuiz(results: readonly boolean[]): { correct: number; total: number } {
  return { correct: results.filter(Boolean).length, total: results.length }
}
