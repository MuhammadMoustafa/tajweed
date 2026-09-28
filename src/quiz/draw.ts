import { getVerseMarkup } from '../data/quran'
import type { Bilingual } from '../i18n/bilingual'
import { ui, withRuleName } from '../i18n/ui'
import { LESSONS } from '../lessons'
import { ruleRunLetters } from '../lessons/quiz'
import type { Lesson, QuizChoiceQuestion, QuizQuestion, VerseKey } from '../lessons/types'
import type { Mark } from '../tajweed/marks'
import { ALL_RULES, confusableRules, isTajweedRuleId, type RuleId } from '../tajweed/rules'
import { DIFFICULTIES, type Difficulty, type QuizPool } from './pool'
import { pick, shuffle, type Rng } from './random'

/** A verse a question is asked on, with its markup resolved (from quran.json or the pool). */
interface VerseSource {
  verseKey: VerseKey
  markup: string
  marks?: readonly Mark[]
}

/** "Tap the letters that have `rule`": answers are derived from the markup (tapCorrectIndices). */
export interface DrawnTapQuestion extends VerseSource {
  kind: 'tap'
  prompt: Bilingual
  rule: RuleId
}

/** "Which rule is on the highlighted letter?" — `letter` is a tapIndex, `options` rule ids. */
export interface DrawnRuleQuestion extends VerseSource {
  kind: 'rule'
  prompt: Bilingual
  letter: number
  options: RuleId[]
  correctIndex: number
}

/** One question of an attempt, ready to render: generated, or one of the lesson's authored ones. */
export type DrawnQuestion = DrawnTapQuestion | DrawnRuleQuestion | QuizChoiceQuestion

/** Questions per attempt, when there is enough material. */
export const QUIZ_LENGTH = 8
const MAX_AUTHORED = 2
const MAX_FROM_EXAMPLES = 2
const MAX_OPTIONS = 4

/**
 * Rules a lesson's quiz may ask about: the focus rules of every lesson up to it in `order`. A
 * lesson without focus rules (e.g. makharij) gets none — only its authored questions.
 */
export function taughtRules(lesson: Lesson, lessons: readonly Lesson[] = LESSONS): RuleId[] {
  if (lesson.focusRules.length === 0) return []
  const rules = lessons.filter((l) => l.order <= lesson.order).flatMap((l) => l.focusRules)
  return [...new Set([...lesson.focusRules, ...rules])]
}

/**
 * Options for "which rule?" on a `rule` letter: the rule, then its look-alikes (confusableRules)
 * and then other rules, all among `taught` — never a rule the learner hasn't met — up to
 * MAX_OPTIONS, shuffled. Empty when there is nothing to choose between.
 */
export function ruleOptions(rule: RuleId, taught: readonly RuleId[], rng: Rng): RuleId[] {
  const others = [...confusableRules(rule), ...shuffle(taught, rng)].filter((r) => r !== rule && taught.includes(r))
  const options = [...new Set([rule, ...others])].slice(0, MAX_OPTIONS)
  return options.length < 2 ? [] : shuffle(options, rng)
}

/**
 * A question about `rule` on `source`, of the `prefer`red kind when the verse allows it: a tap
 * question needs every span of the rule to be one letter (the API tags some noon rules on the
 * noon and the next letter, which a "tap the letters" answer can't fairly include); a "which
 * rule?" question needs options. Undefined when the verse can't carry either.
 */
export function questionFor(
  source: VerseSource,
  rule: RuleId,
  taught: readonly RuleId[],
  prefer: 'tap' | 'rule',
  rng: Rng,
): DrawnTapQuestion | DrawnRuleQuestion | undefined {
  const { runs, unplaced } = ruleRunLetters(source.markup, rule, source.marks)
  if (runs.length === 0 || unplaced > 0) return undefined
  const tap = (): DrawnTapQuestion | undefined =>
    runs.every((run) => run.length === 1)
      ? { kind: 'tap', prompt: withRuleName(ui.quizTapPrompt, ALL_RULES[rule].name), ...source, rule }
      : undefined
  const which = (): DrawnRuleQuestion | undefined => {
    const options = ruleOptions(rule, taught, rng)
    if (options.length === 0) return undefined
    // The first letter of a span: the noon or meem itself when the API tags the next letter too.
    const letter = pick(runs, rng)[0]
    return { kind: 'rule', prompt: ui.quizRulePrompt, ...source, letter, options, correctIndex: options.indexOf(rule) }
  }
  return prefer === 'tap' ? (tap() ?? which()) : (which() ?? tap())
}

/** An authored question, with a tap question's markup looked up; undefined if it's missing. */
function resolveAuthored(question: QuizQuestion): DrawnQuestion | undefined {
  if (question.kind === 'choice') return question
  const markup = getVerseMarkup(question.verseKey)
  if (!markup) return undefined
  const { kind, prompt, verseKey, rule, marks } = question
  return { kind, prompt, verseKey, rule, markup, ...(marks ? { marks } : {}) }
}

/** The pool's verses for `rule` at `difficulty`, or at the nearest difficulty that has some. */
function tierKeys(pool: QuizPool, rule: RuleId, difficulty: Difficulty): VerseKey[] {
  const tiers = isTajweedRuleId(rule) ? pool.rules[rule] : undefined
  if (!tiers) return []
  const at = DIFFICULTIES.indexOf(difficulty)
  const nearest = [...DIFFICULTIES].sort((a, b) => Math.abs(DIFFICULTIES.indexOf(a) - at) - Math.abs(DIFFICULTIES.indexOf(b) - at))
  return nearest.map((d) => tiers[d]).find((keys) => keys.length > 0) ?? []
}

const questionKey = (q: DrawnQuestion) => (q.kind === 'choice' ? undefined : `${q.verseKey}|${q.kind === 'tap' ? q.rule : q.options[q.correctIndex]}`)

/**
 * One quiz attempt for `lesson`, about QUIZ_LENGTH questions: up to MAX_FROM_EXAMPLES from the
 * lesson's own examples, verses from `pool` at `difficulty` for the rules taught so far (mostly
 * this lesson's; about one in three reviews an earlier lesson's rule), then up to MAX_AUTHORED of
 * the lesson's authored questions. A lesson without focus rules gets all its authored questions
 * and nothing else. All randomness comes from `rng`, so a seed reproduces the attempt.
 */
export function drawQuiz({
  lesson,
  difficulty,
  pool,
  rng,
  lessons = LESSONS,
}: {
  lesson: Lesson
  difficulty: Difficulty
  /** Not needed (and may still be loading) for a lesson without focus rules. */
  pool?: QuizPool
  rng: Rng
  lessons?: readonly Lesson[]
}): DrawnQuestion[] {
  const authored = (lesson.quiz ?? []).map(resolveAuthored).filter((q) => q !== undefined)
  const taught = taughtRules(lesson, lessons)
  if (taught.length === 0) return authored

  const pickedAuthored = shuffle(authored, rng).slice(0, MAX_AUTHORED)
  const asked = new Set(pickedAuthored.map(questionKey).filter((k) => k !== undefined))
  let prefer: 'tap' | 'rule' = 'tap'
  const add = (out: DrawnQuestion[], source: VerseSource, rule: RuleId): boolean => {
    if (asked.has(`${source.verseKey}|${rule}`)) return false
    const q = questionFor(source, rule, taught, prefer, rng)
    if (!q) return false
    asked.add(`${source.verseKey}|${rule}`)
    out.push(q)
    prefer = prefer === 'tap' ? 'rule' : 'tap'
    return true
  }

  const fromExamples: DrawnQuestion[] = []
  const exampleItems = lesson.examples.flatMap((example) => lesson.focusRules.map((rule) => ({ example, rule })))
  for (const { example, rule } of shuffle(exampleItems, rng)) {
    if (fromExamples.length >= MAX_FROM_EXAMPLES) break
    const markup = getVerseMarkup(example.verseKey)
    if (markup) add(fromExamples, { verseKey: example.verseKey, markup, marks: example.marks }, rule)
  }

  const fromPool: DrawnQuestion[] = []
  if (pool) {
    const available = taught.filter((rule) => tierKeys(pool, rule, difficulty).length > 0)
    const current = available.filter((rule) => lesson.focusRules.includes(rule))
    const earlier = available.filter((rule) => !lesson.focusRules.includes(rule))
    const wanted = QUIZ_LENGTH - pickedAuthored.length - fromExamples.length
    const remaining = new Map(available.map((rule) => [rule, shuffle(tierKeys(pool, rule, difficulty), rng)]))
    for (let slot = 0; fromPool.length < wanted && slot < wanted * 4; slot++) {
      const useEarlier = earlier.length > 0 && (current.length === 0 || slot % 3 === 2)
      const candidates = (useEarlier ? earlier : current).filter((rule) => remaining.get(rule)!.length > 0)
      if (candidates.length === 0) continue
      const rule = pick(candidates, rng)
      const verseKey = remaining.get(rule)!.shift()!
      add(fromPool, { verseKey, markup: pool.verses[verseKey] }, rule)
    }
  }

  return [...fromExamples, ...fromPool, ...pickedAuthored]
}
