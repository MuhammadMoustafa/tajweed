import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import committedPool from '../data/quiz-pool.json'
import { makharij } from '../lessons/makharij'
import { naturalMadd } from '../lessons/natural-madd'
import { qalqalah } from '../lessons/qalqalah'
import { hasQuiz, tapCorrectIndices } from '../lessons/quiz'
import type { Lesson } from '../lessons/types'
import type { RuleId } from '../tajweed/rules'
import { drawQuiz, questionFor, QUIZ_LENGTH, ruleOptions, taughtRules, type DrawnQuestion } from './draw'
import type { Difficulty, QuizPool } from './pool'
import { createRng } from './random'

const pool = committedPool as QuizPool
const SEEDS = Array.from({ length: 25 }, (_, i) => i + 1)
const LESSONS_HERE: Lesson[] = [makharij, qalqalah, naturalMadd]

/** The rule a generated question asks about. */
const ruleOf = (q: DrawnQuestion): RuleId | undefined =>
  q.kind === 'tap' ? q.rule : q.kind === 'rule' ? q.options[q.correctIndex] : undefined

const draw = (lesson: Lesson, difficulty: Difficulty, seed: number) =>
  drawQuiz({ lesson, difficulty, pool, rng: createRng(seed), lessons: LESSONS_HERE })

describe('taughtRules / hasQuiz', () => {
  it('collects the focus rules of every lesson up to this one, by order', () => {
    expect(taughtRules(qalqalah, LESSONS_HERE)).toEqual(['qalaqah'])
    expect(new Set(taughtRules(naturalMadd, LESSONS_HERE))).toEqual(new Set(['madda_normal', 'qalaqah']))
    // Reordered: qalqalah after natural madd now reviews it too.
    const later = { ...qalqalah, order: 99 }
    expect(new Set(taughtRules(later, [makharij, naturalMadd, later]))).toEqual(new Set(['qalaqah', 'madda_normal']))
  })

  it('gives a lesson without focus rules none, even after other lessons', () => {
    expect(taughtRules({ ...makharij, order: 99 }, LESSONS_HERE)).toEqual([])
  })

  it('has a quiz for authored questions or focus rules', () => {
    expect(hasQuiz(makharij)).toBe(true)
    expect(hasQuiz({ ...makharij, quiz: undefined })).toBe(false)
    expect(hasQuiz({ ...qalqalah, quiz: undefined })).toBe(true)
  })
})

describe('ruleOptions', () => {
  const taught: RuleId[] = ['madda_normal', 'madda_obligatory', 'madda_permissible', 'qalaqah', 'ikhafa', 'ghunnah']

  it('always includes the right answer, once, among unique taught rules, at most four', () => {
    for (const seed of SEEDS) {
      const options = ruleOptions('madda_normal', taught, createRng(seed))
      expect(options).toContain('madda_normal')
      expect(new Set(options).size).toBe(options.length)
      expect(options.every((o) => taught.includes(o))).toBe(true)
      expect(options.length).toBeGreaterThanOrEqual(2)
      expect(options.length).toBeLessThanOrEqual(4)
    }
  })

  it('prefers look-alike rules as distractors', () => {
    const options = ruleOptions('madda_normal', taught, createRng(1))
    expect(options).toEqual(expect.arrayContaining(['madda_obligatory', 'madda_permissible']))
  })

  it('is empty when only one rule has been taught', () => {
    expect(ruleOptions('qalaqah', ['qalaqah'], createRng(1))).toEqual([])
  })
})

describe('questionFor', () => {
  const source = (key: '97:1' | '112:3') => ({ verseKey: key, markup: getVerseMarkup(key)! })

  it('makes a tap question when every span of the rule is one letter', () => {
    const q = questionFor(source('112:3'), 'qalaqah', ['qalaqah'], 'tap', createRng(1))
    expect(q).toMatchObject({ kind: 'tap', rule: 'qalaqah', verseKey: '112:3' })
    expect(q?.prompt.en).toContain('Qalqalah')
    expect(q?.prompt.ar.trim()).not.toBe('')
  })

  it('asks "which rule?" on the noon of an ikhfa span that also covers the next letter (97:1)', () => {
    const q = questionFor(source('97:1'), 'ikhafa', ['ikhafa', 'idgham_ghunnah', 'qalaqah'], 'tap', createRng(1))
    expect(q?.kind).toBe('rule')
    if (q?.kind !== 'rule') return
    expect(q.options[q.correctIndex]).toBe('ikhafa')
    expect(tapCorrectIndices(q.markup, 'ikhafa')[0]).toBe(q.letter)
  })

  it('gives up when neither kind fits', () => {
    expect(questionFor(source('97:1'), 'ikhafa', ['ikhafa'], 'tap', createRng(1))).toBeUndefined()
    expect(questionFor(source('112:3'), 'iqlab', ['iqlab', 'ikhafa'], 'tap', createRng(1))).toBeUndefined()
  })
})

describe('drawQuiz', () => {
  it('is reproducible from a seed', () => {
    expect(draw(naturalMadd, 'medium', 7)).toEqual(draw(naturalMadd, 'medium', 7))
    expect(draw(naturalMadd, 'medium', 7)).not.toEqual(draw(naturalMadd, 'medium', 8))
  })

  it('gives a lesson without focus rules exactly its authored questions', () => {
    expect(draw(makharij, 'hard', 1)).toEqual(makharij.quiz)
  })

  it.each(['easy', 'medium', 'hard'] as const)('draws a full %s attempt about taught rules only', (difficulty) => {
    for (const lesson of [qalqalah, naturalMadd]) {
      const taught = taughtRules(lesson, LESSONS_HERE)
      for (const seed of SEEDS) {
        const questions = draw(lesson, difficulty, seed)
        expect(questions).toHaveLength(QUIZ_LENGTH)
        const asked = new Set<string>()
        for (const q of questions) {
          if (q.kind === 'choice') {
            expect(lesson.quiz).toContain(q)
            continue
          }
          const rule = ruleOf(q)!
          expect(taught).toContain(rule)
          expect(asked.has(`${q.verseKey}|${rule}`)).toBe(false)
          asked.add(`${q.verseKey}|${rule}`)
          if (q.kind === 'tap') expect(tapCorrectIndices(q.markup, q.rule, q.marks).length).toBeGreaterThan(0)
          if (q.kind === 'rule') {
            expect(new Set(q.options).size).toBe(q.options.length)
            expect(tapCorrectIndices(q.markup, rule, q.marks)).toContain(q.letter)
          }
        }
      }
    }
  })

  it('takes pool verses from the chosen difficulty, and its examples from the lesson', () => {
    for (const seed of SEEDS) {
      for (const difficulty of ['easy', 'hard'] as const) {
        for (const q of draw(naturalMadd, difficulty, seed)) {
          if (q.kind === 'choice') continue
          const fromExample = naturalMadd.examples.some((e) => e.verseKey === q.verseKey)
          const inTier = pool.rules[ruleOf(q) as 'qalaqah']?.[difficulty].includes(q.verseKey)
          expect(fromExample || inTier, `${difficulty} ${q.verseKey}`).toBe(true)
        }
      }
    }
  })

  it('asks mostly about the lesson’s own rule, and reviews earlier ones', () => {
    const rules = SEEDS.flatMap((seed) => draw(naturalMadd, 'medium', seed).map(ruleOf)).filter(Boolean)
    const own = rules.filter((r) => r === 'madda_normal').length
    expect(own).toBeGreaterThan(rules.length / 2)
    expect(rules).toContain('qalaqah')
  })

  it('mixes tap and "which rule?" questions once two rules are taught', () => {
    const kinds = new Set(SEEDS.flatMap((seed) => draw(naturalMadd, 'medium', seed).map((q) => q.kind)))
    expect(kinds).toEqual(new Set(['tap', 'rule', 'choice']))
  })

  it('draws different pool verses at different difficulties', () => {
    const verses = (d: Difficulty) =>
      new Set(draw(qalqalah, d, 3).flatMap((q) => (q.kind === 'choice' ? [] : [q.verseKey])))
    expect(verses('easy')).not.toEqual(verses('hard'))
  })

  it('still draws from the examples when the pool is unavailable', () => {
    const questions = drawQuiz({ lesson: qalqalah, difficulty: 'easy', rng: createRng(1), lessons: LESSONS_HERE })
    expect(questions.length).toBeGreaterThan(0)
    for (const q of questions) {
      if (q.kind !== 'choice') expect(qalqalah.examples.map((e) => e.verseKey)).toContain(q.verseKey)
    }
  })
})
