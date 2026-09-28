import { segmentsToLetters } from '../tajweed/graphemes'
import { applyMarks, type Mark } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import type { RuleId } from '../tajweed/rules'
import type { Lesson, QuizChoiceQuestion } from './types'

/**
 * Whether a lesson has a quiz page (#/lesson/<id>/quiz): authored questions, or focus rules to
 * draw questions for (src/quiz/draw.ts).
 */
export const hasQuiz = (lesson: Lesson): boolean => (lesson.quiz?.length ?? 0) > 0 || lesson.focusRules.length > 0

/** Visual state of a tappable letter; drives color only (see TajweedText). */
export type SegmentState = 'selected' | 'correct' | 'wrong'

/**
 * The letters of every run of `rule` in a verse, as `tapIndex` lists in reading order: one list
 * per rule span of the markup (or per mark). The API sometimes tags a noon with the letter after
 * it (ikhfa, idgham), so a run can hold more than one letter. `unplaced` counts runs that hold no
 * letter at all — a span of only harakat or signs, which no letter tap can answer — so callers
 * can skip such a verse. Reuses `parseTajweed`/`applyMarks` — the only places verse markup/marks
 * are interpreted.
 */
export function ruleRunLetters(
  markup: string,
  rule: RuleId,
  marks?: readonly Mark[],
): { runs: number[][]; unplaced: number } {
  const { segments } = parseTajweed(markup)
  const ruled = marks && marks.length > 0 ? applyMarks(segments, marks) : segments
  const bySegment = new Map<number, number[]>()
  for (const letter of segmentsToLetters(ruled)) {
    if (letter.tapIndex === undefined || letter.rule !== rule) continue
    const run = bySegment.get(letter.segment)
    if (run) run.push(letter.tapIndex)
    else bySegment.set(letter.segment, [letter.tapIndex])
  }
  const spans = ruled.filter((seg) => seg.rule === rule).length
  return { runs: [...bySegment.values()], unplaced: spans - bySegment.size }
}

/**
 * The correct answers for a "tap the letters" question: the `tapIndex` of every letter (grapheme)
 * whose rule matches — never a whole rule run. For a custom rule (one the API markup doesn't tag),
 * pass the question's `marks` so they're applied before splitting into letters. The answer is
 * derived from the real verse rather than hand-picked.
 */
export function tapCorrectIndices(markup: string, rule: RuleId, marks?: readonly Mark[]): number[] {
  return ruleRunLetters(markup, rule, marks).runs.flat()
}

/** A tap answer is correct only when the tapped letters are exactly the correct ones. */
export function isTapAnswerCorrect(selected: ReadonlySet<number>, correct: readonly number[]): boolean {
  return selected.size === correct.length && correct.every((i) => selected.has(i))
}

export function isChoiceAnswerCorrect(question: Pick<QuizChoiceQuestion, 'correctIndex'>, selectedIndex: number | undefined): boolean {
  return selectedIndex === question.correctIndex
}

export function scoreQuiz(results: readonly boolean[]): { correct: number; total: number } {
  return { correct: results.filter(Boolean).length, total: results.length }
}
