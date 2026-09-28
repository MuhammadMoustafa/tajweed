import { describe, expect, it } from 'vitest'
import { compareVerseKeys } from '../data/quran'
import quran from '../data/quran.json'
import committedPool from '../data/quiz-pool.json'
import { isTajweedRuleId } from '../tajweed/rules'
import { buildQuizPool, DIFFICULTIES, tierOf, verseRuleStats, type QuizPool, type VerseRuleStats } from './pool'

// Fixture: the lesson verses in quran.json — real API markup, never typed by hand.
const fixture = quran.verses as Record<string, string>
const source = { name: 'fixture', url: 'fixture', fetchedAt: '2026-01-01' }

const stats = (over: Partial<VerseRuleStats>): VerseRuleStats => ({
  letters: 30,
  targets: 1,
  otherRules: 1,
  confusables: 0,
  lookalikes: 0,
  ...over,
})

/** Every tier entry must name a pool verse that exercises the rule at exactly that tier. */
function expectConsistent(pool: QuizPool) {
  for (const [rule, tiers] of Object.entries(pool.rules)) {
    if (!isTajweedRuleId(rule)) throw new Error(`not an API rule: ${rule}`)
    const seen = new Set<string>()
    for (const d of DIFFICULTIES) {
      for (const key of tiers[d]) {
        const markup = pool.verses[key]
        expect(markup, `${rule} ${d} ${key}`).toBeDefined()
        const s = verseRuleStats(markup, rule)
        expect(s && tierOf(s), `${rule} ${key}`).toBe(d)
        expect(seen.has(key), `${rule} ${key} is in two tiers`).toBe(false)
        seen.add(key)
      }
      expect([...tiers[d]].sort(compareVerseKeys), `${rule} ${d} in mushaf order`).toEqual(tiers[d])
    }
  }
}

describe('verseRuleStats', () => {
  it('counts the targets of a lesson verse (112:3)', () => {
    expect(verseRuleStats(fixture['112:3'], 'qalaqah')).toMatchObject({ targets: 2, confusables: 0 })
  })

  it('counts both letters of an ikhfa span (97:1) as targets', () => {
    expect(verseRuleStats(fixture['97:1'], 'ikhafa')?.targets).toBe(2)
  })

  it('is undefined when the rule is absent', () => {
    expect(verseRuleStats(fixture['112:3'], 'iqlab')).toBeUndefined()
  })

  it('is undefined when a span of the rule holds no letter', () => {
    // 112:1's tanween (U+064C) belongs to the letter before it; a span of only that has no letter.
    const markup = fixture['112:1'].replace('ٌ', '<tajweed class=madda_obligatory>ٌ</tajweed>')
    expect(verseRuleStats(markup, 'madda_obligatory')).toBeUndefined()
  })
})

describe('tierOf', () => {
  it('puts a short verse with one target and no decoys in easy', () => {
    expect(tierOf(stats({}))).toBe('easy')
  })

  it('puts a long verse with many targets and decoys in hard', () => {
    expect(tierOf(stats({ letters: 150, targets: 4, confusables: 2, lookalikes: 5 }))).toBe('hard')
  })

  it('keeps a long verse without enough decoys out of hard', () => {
    expect(tierOf(stats({ letters: 150, targets: 4, confusables: 0, lookalikes: 1 }))).toBe('medium')
  })

  it('drops a verse too long for any tier', () => {
    expect(tierOf(stats({ letters: 500 }))).toBeUndefined()
  })
})

describe('buildQuizPool (fixture)', () => {
  const pool = buildQuizPool(fixture, { perTier: 2, source })

  it('lists only verses that exercise each rule at that tier, each in one tier, in mushaf order', () => {
    expectConsistent(pool)
  })

  it('picks lesson verses for the qalqalah rule', () => {
    const picked = DIFFICULTIES.flatMap((d) => pool.rules.qalaqah?.[d] ?? [])
    expect(picked.length).toBeGreaterThan(0)
    // 85:1 (L14's example) also carries a qalqalah letter, alongside the qalqalah lesson's own.
    expect(picked.every((key) => ['85:1', '97:1', '112:1', '112:3', '113:1'].includes(key))).toBe(true)
  })

  it('caps each tier', () => {
    for (const tiers of Object.values(pool.rules)) for (const d of DIFFICULTIES) expect(tiers[d].length).toBeLessThanOrEqual(2)
  })

  it('keeps only the verses some tier uses', () => {
    const used = new Set(Object.values(pool.rules).flatMap((tiers) => DIFFICULTIES.flatMap((d) => tiers[d])))
    expect(new Set(Object.keys(pool.verses))).toEqual(used)
  })

  it('is deterministic', () => {
    expect(buildQuizPool(fixture, { perTier: 2, source })).toEqual(pool)
  })
})

describe('committed src/data/quiz-pool.json', () => {
  const pool = committedPool as QuizPool

  it('matches the current tiering (rerun npm run build-quiz-pool after changing it)', () => {
    expectConsistent(pool)
  })

  it('stays within its 400 KB budget', () => {
    expect(new TextEncoder().encode(JSON.stringify(pool, null, 1)).length).toBeLessThanOrEqual(400 * 1024)
  })

  it('has every tier for the rules the lessons teach so far', () => {
    for (const rule of ['qalaqah', 'madda_normal'] as const) {
      for (const d of DIFFICULTIES) expect(pool.rules[rule]?.[d].length, `${rule} ${d}`).toBeGreaterThan(0)
    }
  })
})
