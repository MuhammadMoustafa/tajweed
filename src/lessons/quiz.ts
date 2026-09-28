import { parseTajweed } from '../tajweed/parse'
import type { TajweedRuleId } from '../tajweed/rules'
import type { QuizChoiceQuestion } from './types'

/** Visual state of a tappable segment; drives color only (see TajweedText). */
export type SegmentState = 'selected' | 'correct' | 'wrong'

/**
 * The correct answers for a "tap the letters" question: every parsed segment index whose rule
 * matches. Reuses `parseTajweed` — the only place verse markup is interpreted — so the answer is
 * derived from the real verse rather than hand-picked.
 */
export function tapCorrectIndices(markup: string, rule: TajweedRuleId): number[] {
  return parseTajweed(markup).segments.reduce<number[]>((indices, segment, i) => {
    if (segment.rule === rule) indices.push(i)
    return indices
  }, [])
}

/** A tap answer is correct only when the tapped segments are exactly the correct ones. */
export function isTapAnswerCorrect(selected: ReadonlySet<number>, correct: readonly number[]): boolean {
  return selected.size === correct.length && correct.every((i) => selected.has(i))
}

export function isChoiceAnswerCorrect(question: QuizChoiceQuestion, selectedIndex: number | undefined): boolean {
  return selectedIndex === question.correctIndex
}

export function scoreQuiz(results: readonly boolean[]): { correct: number; total: number } {
  return { correct: results.filter(Boolean).length, total: results.length }
}
