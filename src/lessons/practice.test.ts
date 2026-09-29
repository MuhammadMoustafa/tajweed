import { describe, expect, it } from 'vitest'
import committedPool from '../data/quiz-pool.json'
import { getVerseMarkup } from '../data/quran'
import { drawQuiz, taughtRules, type DrawnQuestion } from '../quiz/draw'
import { DIFFICULTIES, type QuizPool } from '../quiz/pool'
import { createRng } from '../quiz/random'
import { parseTajweed } from '../tajweed/parse'
import { TAJWEED_RULE_IDS, type RuleId } from '../tajweed/rules'
import { LESSONS } from '.'
import { practiceAsrKawthar } from './practice-asr-kawthar'
import { practiceFatiha } from './practice-fatiha'
import { practiceIkhlasFalaq } from './practice-ikhlas-falaq'
import { practiceNas } from './practice-nas'
import { sifat } from './sifat'
import type { Lesson, VerseKey } from './types'
import { UNITS } from './units'

const pool = committedPool as QuizPool

/** Each practice lesson with the surahs it reads whole: [surah, number of ayat]. */
const PRACTICE: [Lesson, [number, number][]][] = [
  [practiceFatiha, [[1, 7]]],
  [practiceIkhlasFalaq, [[112, 4], [113, 5]]],
  [practiceNas, [[114, 6]]],
  [practiceAsrKawthar, [[103, 3], [108, 3]]],
]

/** The API rules tagged anywhere in `keys`, in TAJWEED_RULE_IDS order. */
const rulesIn = (keys: readonly VerseKey[]): RuleId[] => {
  const found = new Set(keys.flatMap((key) => parseTajweed(getVerseMarkup(key)!).segments.map((s) => s.rule)))
  return TAJWEED_RULE_IDS.filter((rule) => found.has(rule))
}

/** The rule a drawn question asks about (its answer), if it asks about one. */
const askedRule = (q: DrawnQuestion): RuleId | undefined =>
  q.kind === 'tap' ? q.rule : q.kind === 'rule' ? q.options[q.correctIndex] : undefined

describe('practice & review unit (L22)', () => {
  it('is unit 9, before sifat (now unit 10), with al-Fatiha then the Juz ʿAmma lessons', () => {
    expect(UNITS.practice.order).toBe(9)
    expect(UNITS.deeper.order).toBe(10)
    expect(sifat.order).toBe(10)
    expect(LESSONS.filter((l) => l.unit === 'practice')).toEqual(PRACTICE.map(([lesson]) => lesson))
    expect(PRACTICE.map(([lesson]) => lesson.order)).toEqual([9, 9.1, 9.2, 9.3])
    expect(LESSONS.indexOf(sifat)).toBe(LESSONS.indexOf(practiceAsrKawthar) + 1)
  })

  describe.each(PRACTICE.map(([lesson, surahs]) => [lesson.id, lesson, surahs] as const))('%s', (_, lesson, surahs) => {
    const keys = surahs.flatMap(([surah, ayat]) => Array.from({ length: ayat }, (_, i): VerseKey => `${surah}:${i + 1}`))

    it('reads every ayah of its surahs, in order, unreviewed', () => {
      expect(lesson.examples.map((e) => e.verseKey)).toEqual(keys)
      expect(lesson.reviewed).toBe(false)
    })

    it('focuses on exactly the rules the API tags in those ayat, in the legend’s rule order', () => {
      expect(lesson.focusRules).toEqual(rulesIn(keys))
    })

    // Every ayah has at least one tagged rule (a connecting hamza at least), so each example
    // shows some color; lessons.test.ts checks each shows a focus rule.
    it.each(keys)('%s has at least one colored rule', (key) => {
      expect(rulesIn([key]).length).toBeGreaterThan(0)
    })

    it('only reviews rules taught in earlier units', () => {
      const earlier = new Set(LESSONS.filter((l) => l.order < UNITS.practice.order).flatMap((l) => l.focusRules))
      for (const rule of lesson.focusRules) expect(earlier, rule).toContain(rule)
    })

    it('quizzes on every rule taught up to it, never on one not yet taught', () => {
      const taught = taughtRules(lesson)
      const upToHere = new Set(LESSONS.filter((l) => l.order <= lesson.order).flatMap((l) => l.focusRules))
      expect(new Set(taught)).toEqual(upToHere)

      const asked = new Set<RuleId>()
      const offered = new Set<RuleId>()
      for (let seed = 1; seed <= 40; seed++) {
        const difficulty = DIFFICULTIES[seed % DIFFICULTIES.length]
        for (const q of drawQuiz({ lesson, difficulty, pool, rng: createRng(seed) })) {
          const rule = askedRule(q)
          if (rule) asked.add(rule)
          if (q.kind === 'rule') for (const option of q.options) offered.add(option)
        }
      }
      for (const rule of [...asked, ...offered]) expect(taught).toContain(rule)
      // Most of the lesson's own rules come up, and earlier rules are reviewed too.
      expect(lesson.focusRules.filter((r) => asked.has(r)).length).toBeGreaterThanOrEqual(lesson.focusRules.length - 1)
      expect([...asked].some((r) => !lesson.focusRules.includes(r))).toBe(true)
      expect([...offered].some((r) => !lesson.focusRules.includes(r))).toBe(true)
    })
  })
})
