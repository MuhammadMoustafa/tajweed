import { useMemo, useSyncExternalStore } from 'react'
import { DIFFICULTIES, type Difficulty } from './quiz/pool'
import type { RuleId } from './tajweed/rules'

/**
 * Per-device learning progress, the only module that reads or writes it: which lessons are marked
 * "learned" and every quiz attempt taken. Two localStorage keys, each wrapped in try/catch so a
 * page still renders correctly when storage is unavailable (private browsing, restricted
 * WebViews) — changes just stop persisting across reloads and instead only last the session.
 */
const STORAGE_KEY = 'tajweed.progress'
const ATTEMPTS_KEY = 'tajweed.progress.attempts'
/** Storage format version for the attempts key, so a future format change can detect and skip
 *  (or migrate) data it doesn't recognize instead of throwing. */
const ATTEMPTS_VERSION = 1
/** Oldest attempts are dropped past this, per lesson. */
const MAX_ATTEMPTS_PER_LESSON = 20

type Listener = () => void
const listeners = new Set<Listener>()

function emit(): void {
  for (const listener of listeners) listener()
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// ---- Learned lessons -------------------------------------------------------------------------

// `cachedRaw` mirrors the last string actually read from (or successfully written to) storage,
// so `readAll` only re-parses JSON when storage truly changed — required for useSyncExternalStore,
// which needs a stable snapshot reference across renders when nothing changed.
let cachedRaw: string | null = null
let cachedIds: ReadonlySet<string> = new Set()

function readStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function parseIds(raw: string | null): Set<string> {
  try {
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function readAll(): ReadonlySet<string> {
  const raw = readStorage()
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedIds = parseIds(raw)
  }
  return cachedIds
}

/** Whether `id` is currently marked learned. */
export function isLessonLearned(id: string): boolean {
  return readAll().has(id)
}

/** Marks (or unmarks) a lesson as learned and persists it. Never throws, even if storage does. */
export function setLessonLearned(id: string, learned: boolean): void {
  const current = readAll()
  if (current.has(id) === learned) return

  const next = new Set(current)
  if (learned) next.add(id)
  else next.delete(id)
  cachedIds = next

  try {
    const raw = JSON.stringify([...next])
    localStorage.setItem(STORAGE_KEY, raw)
    // Only remember the write as the new baseline once it actually succeeded — if it threw,
    // `cachedRaw` is left pointing at the last value storage really holds, so a later successful
    // read doesn't undo this in-memory change by re-parsing stale, unwritten storage content.
    cachedRaw = raw
  } catch {
    // Storage unavailable or full: the change above still applies for this session.
  }

  emit()
}

/** Flips `id`'s learned state. */
export function toggleLessonLearned(id: string): void {
  setLessonLearned(id, !isLessonLearned(id))
}

// ---- Quiz attempts ----------------------------------------------------------------------------

/**
 * One question's outcome in a recorded attempt. `rule` is the rule a generated "tap" or "which
 * rule?" question tested (src/quiz/draw.ts); an authored multiple-choice question has none.
 */
export interface QuestionResult {
  rule?: RuleId
  correct: boolean
}

/** One completed quiz attempt (src/components/Quiz.tsx), recorded when Check is pressed with
 *  every question answered. */
export interface QuizAttempt {
  /** `new Date().toISOString()`. */
  date: string
  difficulty: Difficulty
  score: { correct: number; total: number }
  results: readonly QuestionResult[]
}

const EMPTY_ATTEMPTS: readonly QuizAttempt[] = []
const EMPTY_ATTEMPTS_BY_LESSON: Record<string, QuizAttempt[]> = {}
const EMPTY_LEARNED: ReadonlySet<string> = new Set()

function isQuestionResult(value: unknown): value is QuestionResult {
  if (!value || typeof value !== 'object') return false
  const r = value as Record<string, unknown>
  return typeof r.correct === 'boolean' && (r.rule === undefined || typeof r.rule === 'string')
}

function isQuizAttempt(value: unknown): value is QuizAttempt {
  if (!value || typeof value !== 'object') return false
  const a = value as Record<string, unknown>
  return (
    typeof a.date === 'string' &&
    (DIFFICULTIES as readonly string[]).includes(a.difficulty as string) &&
    !!a.score &&
    typeof (a.score as Record<string, unknown>).correct === 'number' &&
    typeof (a.score as Record<string, unknown>).total === 'number' &&
    Array.isArray(a.results) &&
    a.results.every(isQuestionResult)
  )
}

let cachedAttemptsRaw: string | null = null
let cachedAttempts: Record<string, QuizAttempt[]> = {}

function readAttemptsStorage(): string | null {
  try {
    return localStorage.getItem(ATTEMPTS_KEY)
  } catch {
    return null
  }
}

/** Parses the attempts envelope, discarding anything that isn't recognizably this shape: missing
 *  or mismatched `version` (older or foreign data), corrupt JSON, or an individual attempt that
 *  doesn't validate — so a bad or outdated record never breaks the whole page. */
function parseAttempts(raw: string | null): Record<string, QuizAttempt[]> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    const envelope = parsed as Record<string, unknown>
    if (envelope.version !== ATTEMPTS_VERSION || !envelope.attempts || typeof envelope.attempts !== 'object') return {}

    const result: Record<string, QuizAttempt[]> = {}
    for (const [lessonId, list] of Object.entries(envelope.attempts as Record<string, unknown>)) {
      if (!Array.isArray(list)) continue
      const valid = list.filter(isQuizAttempt)
      if (valid.length > 0) result[lessonId] = valid.slice(-MAX_ATTEMPTS_PER_LESSON)
    }
    return result
  } catch {
    return {}
  }
}

function readAttempts(): Record<string, QuizAttempt[]> {
  const raw = readAttemptsStorage()
  if (raw !== cachedAttemptsRaw) {
    cachedAttemptsRaw = raw
    cachedAttempts = parseAttempts(raw)
  }
  return cachedAttempts
}

function writeAttempts(next: Record<string, QuizAttempt[]>): void {
  cachedAttempts = next
  try {
    const raw = JSON.stringify({ version: ATTEMPTS_VERSION, attempts: next })
    localStorage.setItem(ATTEMPTS_KEY, raw)
    cachedAttemptsRaw = raw
  } catch {
    // Storage unavailable or full: the change above still applies for this session.
  }
  emit()
}

/** `lessonId`'s recorded attempts, oldest first. */
export function attemptsForLesson(lessonId: string): readonly QuizAttempt[] {
  return readAttempts()[lessonId] ?? EMPTY_ATTEMPTS
}

/** Whether `lessonId` has at least one recorded attempt. */
export function hasAttempts(lessonId: string): boolean {
  return attemptsForLesson(lessonId).length > 0
}

/** Share of correct answers that passes a quiz (maintainer, 2026-09-29). */
export const PASS_RATIO = 0.8

/** Whether `score` passes the quiz, which marks its lesson learned (recordQuizAttempt). */
export const passesQuiz = (score: QuizAttempt['score']): boolean => score.correct >= PASS_RATIO * score.total

/**
 * Records one completed attempt for `lessonId`: `results` in question order, score derived from
 * them. Keeps only the last MAX_ATTEMPTS_PER_LESSON attempts per lesson. A passing attempt
 * (`passesQuiz`) also marks the lesson learned, so "next" moves on; a failing one never unmarks
 * it. Never throws.
 */
export function recordQuizAttempt(lessonId: string, difficulty: Difficulty, results: readonly QuestionResult[]): void {
  if (results.length === 0) return
  const attempt: QuizAttempt = {
    date: new Date().toISOString(),
    difficulty,
    score: { correct: results.filter((r) => r.correct).length, total: results.length },
    results: results.map((r) => (r.rule ? { rule: r.rule, correct: r.correct } : { correct: r.correct })),
  }
  const current = readAttempts()
  const forLesson = [...(current[lessonId] ?? []), attempt].slice(-MAX_ATTEMPTS_PER_LESSON)
  writeAttempts({ ...current, [lessonId]: forLesson })
  if (passesQuiz(attempt.score) && !isLessonLearned(lessonId)) setLessonLearned(lessonId, true)
}

/** The most recent of `attempts` (stored oldest first). Shared by the lesson card's grade side
 *  panel (src/components/LessonCard.tsx) and the progress page (src/components/ProgressPage.tsx)
 *  so "last score" means the same attempt in both places. */
export function lastAttempt(attempts: readonly QuizAttempt[]): QuizAttempt | undefined {
  return attempts[attempts.length - 1]
}

/** The attempt with the highest correct/total ratio among `attempts`; ties keep the earlier one. */
export function bestAttempt(attempts: readonly QuizAttempt[]): QuizAttempt | undefined {
  return attempts.reduce<QuizAttempt | undefined>((best, attempt) => {
    if (!best) return attempt
    return attempt.score.correct / attempt.score.total > best.score.correct / best.score.total ? attempt : best
  }, undefined)
}

/** Accuracy per rule, across every recorded attempt of every lesson: correct/total counts,
 *  weakest (lowest accuracy) first, ties broken by more attempts first. Only rules that have
 *  actually been asked appear. */
export interface RuleStat {
  rule: RuleId
  correct: number
  total: number
}

export function ruleStatsFromAttempts(attemptsByLesson: Readonly<Record<string, readonly QuizAttempt[]>>): RuleStat[] {
  const byRule = new Map<RuleId, { correct: number; total: number }>()
  for (const attempts of Object.values(attemptsByLesson)) {
    for (const attempt of attempts) {
      for (const result of attempt.results) {
        if (!result.rule) continue
        const entry = byRule.get(result.rule) ?? { correct: 0, total: 0 }
        entry.total += 1
        if (result.correct) entry.correct += 1
        byRule.set(result.rule, entry)
      }
    }
  }
  return [...byRule.entries()]
    .map(([rule, stats]) => ({ rule, ...stats }))
    .sort((a, b) => a.correct / a.total - b.correct / b.total || b.total - a.total)
}

/** Clears every learned lesson and every recorded attempt. Never throws. */
export function resetAllProgress(): void {
  cachedIds = new Set()
  cachedRaw = null
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable: the in-memory reset above still applies for this session.
  }

  cachedAttempts = {}
  cachedAttemptsRaw = null
  try {
    localStorage.removeItem(ATTEMPTS_KEY)
  } catch {
    // Storage unavailable: the in-memory reset above still applies for this session.
  }

  emit()
}

// ---- Home card state ---------------------------------------------------------------------------

/** A lesson card's state on the home page (src/components/LessonList.tsx): color/badge only, never
 *  the only signal — every state also carries a text badge or sr-only label. */
export type LessonCardState = 'learned' | 'started' | 'not-started'

/** Derives a lesson card's state from its learned flag and whether it has any attempt. */
export function lessonCardState(learned: boolean, attempted: boolean): LessonCardState {
  if (learned) return 'learned'
  if (attempted) return 'started'
  return 'not-started'
}

// ---- Hook ---------------------------------------------------------------------------------------

export interface ProgressState {
  learnedIds: ReadonlySet<string>
  isLearned: (id: string) => boolean
  toggle: (id: string) => void
  count: number
  attemptsFor: (lessonId: string) => readonly QuizAttempt[]
  hasAttempts: (lessonId: string) => boolean
  cardState: (lessonId: string) => LessonCardState
  ruleStats: readonly RuleStat[]
  reset: () => void
}

/** Learning progress kept in sync across every component that calls this hook: learned lessons and
 *  quiz attempts share one change notification, since both live in this module. */
export function useProgress(): ProgressState {
  const learnedIds = useSyncExternalStore(subscribe, readAll, () => EMPTY_LEARNED)
  const attempts = useSyncExternalStore(subscribe, readAttempts, () => EMPTY_ATTEMPTS_BY_LESSON)
  const ruleStats = useMemo(() => ruleStatsFromAttempts(attempts), [attempts])

  return {
    learnedIds,
    isLearned: (id: string) => learnedIds.has(id),
    toggle: toggleLessonLearned,
    count: learnedIds.size,
    attemptsFor: (id: string) => attempts[id] ?? EMPTY_ATTEMPTS,
    hasAttempts: (id: string) => (attempts[id]?.length ?? 0) > 0,
    cardState: (id: string) => lessonCardState(learnedIds.has(id), (attempts[id]?.length ?? 0) > 0),
    ruleStats,
    reset: resetAllProgress,
  }
}
