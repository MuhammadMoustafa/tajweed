import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Progress is module-level singleton state (so every component sees the same learned set), so
// each test resets it via `vi.resetModules()` + a fresh dynamic import rather than relying on a
// static import shared across this whole file.
async function loadProgress() {
  return import('./progress')
}

beforeEach(() => {
  localStorage.clear()
  vi.resetModules()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('progress', () => {
  it('starts with nothing learned', async () => {
    const { isLessonLearned } = await loadProgress()
    expect(isLessonLearned('qalqalah')).toBe(false)
  })

  it('marks and unmarks a lesson learned, notifying nothing else in between', async () => {
    const { isLessonLearned, setLessonLearned } = await loadProgress()

    setLessonLearned('qalqalah', true)
    expect(isLessonLearned('qalqalah')).toBe(true)

    setLessonLearned('qalqalah', false)
    expect(isLessonLearned('qalqalah')).toBe(false)
  })

  it('toggleLessonLearned flips the current state', async () => {
    const { isLessonLearned, toggleLessonLearned } = await loadProgress()

    toggleLessonLearned('qalqalah')
    expect(isLessonLearned('qalqalah')).toBe(true)

    toggleLessonLearned('qalqalah')
    expect(isLessonLearned('qalqalah')).toBe(false)
  })

  it('persists across a fresh module load (simulating a page reload)', async () => {
    const first = await loadProgress()
    first.setLessonLearned('qalqalah', true)

    vi.resetModules()
    const reloaded = await loadProgress()
    expect(reloaded.isLessonLearned('qalqalah')).toBe(true)
  })

  it('keeps other lessons untouched', async () => {
    const { isLessonLearned, setLessonLearned } = await loadProgress()
    setLessonLearned('qalqalah', true)
    expect(isLessonLearned('other-lesson')).toBe(false)
  })

  it('reads as not-learned, without throwing, when localStorage.getItem throws', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })
    const { isLessonLearned } = await loadProgress()
    expect(() => isLessonLearned('qalqalah')).not.toThrow()
    expect(isLessonLearned('qalqalah')).toBe(false)
  })

  it('treats corrupted JSON in storage as empty, without throwing', async () => {
    localStorage.setItem('tajweed.progress', '{not json')
    const { isLessonLearned } = await loadProgress()
    expect(() => isLessonLearned('qalqalah')).not.toThrow()
    expect(isLessonLearned('qalqalah')).toBe(false)
  })

  it('does not throw when localStorage.setItem throws, and keeps the change for this session', async () => {
    const { isLessonLearned, setLessonLearned } = await loadProgress()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(() => setLessonLearned('qalqalah', true)).not.toThrow()
    expect(isLessonLearned('qalqalah')).toBe(true)
  })

  it('useProgress reflects toggles made through the module functions', async () => {
    const { setLessonLearned, useProgress } = await loadProgress()
    const { result } = renderHook(() => useProgress())

    expect(result.current.isLearned('qalqalah')).toBe(false)
    expect(result.current.count).toBe(0)

    act(() => {
      setLessonLearned('qalqalah', true)
    })

    expect(result.current.isLearned('qalqalah')).toBe(true)
    expect(result.current.count).toBe(1)
  })

  it('useProgress().toggle marks and unmarks a lesson', async () => {
    const { useProgress } = await loadProgress()
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.toggle('qalqalah')
    })
    expect(result.current.isLearned('qalqalah')).toBe(true)

    act(() => {
      result.current.toggle('qalqalah')
    })
    expect(result.current.isLearned('qalqalah')).toBe(false)
  })

  it('keeps two hook instances in sync (list and lesson view sharing state)', async () => {
    const { useProgress } = await loadProgress()
    const a = renderHook(() => useProgress())
    const b = renderHook(() => useProgress())

    act(() => {
      a.result.current.toggle('qalqalah')
    })

    expect(a.result.current.isLearned('qalqalah')).toBe(true)
    expect(b.result.current.isLearned('qalqalah')).toBe(true)
  })
})

describe('quiz attempts', () => {
  it('starts with no attempts recorded', async () => {
    const { attemptsForLesson, hasAttempts } = await loadProgress()
    expect(attemptsForLesson('qalqalah')).toEqual([])
    expect(hasAttempts('qalqalah')).toBe(false)
  })

  it('records an attempt with a derived score, tagging only questions that carried a rule', async () => {
    const { attemptsForLesson, hasAttempts, recordQuizAttempt } = await loadProgress()

    recordQuizAttempt('qalqalah', 'easy', [
      { rule: 'qalaqah', correct: true },
      { rule: 'qalaqah', correct: false },
      { correct: true },
    ])

    expect(hasAttempts('qalqalah')).toBe(true)
    const attempts = attemptsForLesson('qalqalah')
    expect(attempts).toHaveLength(1)
    expect(attempts[0].difficulty).toBe('easy')
    expect(attempts[0].score).toEqual({ correct: 2, total: 3 })
    expect(attempts[0].results).toEqual([
      { rule: 'qalaqah', correct: true },
      { rule: 'qalaqah', correct: false },
      { correct: true },
    ])
    expect(typeof attempts[0].date).toBe('string')
    expect(() => new Date(attempts[0].date).toISOString()).not.toThrow()
  })

  it('does not record an empty attempt', async () => {
    const { attemptsForLesson, recordQuizAttempt } = await loadProgress()
    recordQuizAttempt('qalqalah', 'easy', [])
    expect(attemptsForLesson('qalqalah')).toEqual([])
  })

  it('keeps attempts of other lessons untouched', async () => {
    const { attemptsForLesson, recordQuizAttempt } = await loadProgress()
    recordQuizAttempt('qalqalah', 'easy', [{ correct: true }])
    expect(attemptsForLesson('natural-madd')).toEqual([])
  })

  it('keeps only the most recent attempts once a lesson exceeds the per-lesson cap', async () => {
    const { attemptsForLesson, recordQuizAttempt } = await loadProgress()
    // Each attempt's question count (`score.total`) doubles as its call index, so the surviving
    // range after the cap is easy to check.
    for (let i = 0; i < 25; i++) recordQuizAttempt('qalqalah', 'easy', Array.from({ length: i + 1 }, () => ({ correct: true })))
    const attempts = attemptsForLesson('qalqalah')
    expect(attempts).toHaveLength(20)
    // Calls 0..4 (total 1..5) were dropped; 5..24 (total 6..25) remain, oldest first.
    expect(attempts[0].score.total).toBe(6)
    expect(attempts[attempts.length - 1].score.total).toBe(25)
  })

  it('persists attempts across a fresh module load', async () => {
    const first = await loadProgress()
    first.recordQuizAttempt('qalqalah', 'hard', [{ correct: true }])

    vi.resetModules()
    const reloaded = await loadProgress()
    expect(reloaded.attemptsForLesson('qalqalah')).toHaveLength(1)
    expect(reloaded.attemptsForLesson('qalqalah')[0].difficulty).toBe('hard')
  })

  it('treats corrupted JSON in the attempts key as empty, without throwing', async () => {
    localStorage.setItem('tajweed.progress.attempts', '{not json')
    const { attemptsForLesson } = await loadProgress()
    expect(() => attemptsForLesson('qalqalah')).not.toThrow()
    expect(attemptsForLesson('qalqalah')).toEqual([])
  })

  it('treats data from an unrecognized (missing or mismatched) version as empty', async () => {
    localStorage.setItem('tajweed.progress.attempts', JSON.stringify({ qalqalah: [{ correct: true }] }))
    const { attemptsForLesson } = await loadProgress()
    expect(attemptsForLesson('qalqalah')).toEqual([])

    localStorage.setItem(
      'tajweed.progress.attempts',
      JSON.stringify({ version: 99, attempts: { qalqalah: [{ date: 'x', difficulty: 'easy', score: { correct: 1, total: 1 }, results: [] }] } }),
    )
    vi.resetModules()
    const reloaded = await loadProgress()
    expect(reloaded.attemptsForLesson('qalqalah')).toEqual([])
  })

  it('drops individually malformed attempts but keeps the valid ones', async () => {
    localStorage.setItem(
      'tajweed.progress.attempts',
      JSON.stringify({
        version: 1,
        attempts: {
          qalqalah: [
            { date: '2026-01-01T00:00:00.000Z', difficulty: 'easy', score: { correct: 1, total: 1 }, results: [{ correct: true }] },
            { difficulty: 'easy' }, // missing date/score/results
            { date: '2026-01-02T00:00:00.000Z', difficulty: 'nonsense', score: { correct: 1, total: 1 }, results: [] },
          ],
        },
      }),
    )
    const { attemptsForLesson } = await loadProgress()
    expect(attemptsForLesson('qalqalah')).toHaveLength(1)
  })

  it('does not throw when localStorage.setItem throws while recording, and keeps the change for this session', async () => {
    const { attemptsForLesson, recordQuizAttempt } = await loadProgress()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(() => recordQuizAttempt('qalqalah', 'easy', [{ correct: true }])).not.toThrow()
    expect(attemptsForLesson('qalqalah')).toHaveLength(1)
  })
})

describe('per-rule accuracy', () => {
  it('aggregates correct/total across lessons and attempts, only for questions tagged with a rule', async () => {
    const { ruleStatsFromAttempts } = await loadProgress()
    const stats = ruleStatsFromAttempts({
      qalqalah: [
        {
          date: 'd',
          difficulty: 'easy',
          score: { correct: 2, total: 3 },
          results: [
            { rule: 'qalaqah', correct: true },
            { rule: 'qalaqah', correct: false },
            { correct: true }, // no rule: excluded
          ],
        },
      ],
      'natural-madd': [
        { date: 'd', difficulty: 'easy', score: { correct: 1, total: 1 }, results: [{ rule: 'qalaqah', correct: true }] },
        { date: 'd', difficulty: 'easy', score: { correct: 0, total: 1 }, results: [{ rule: 'madda_normal', correct: false }] },
      ],
    })

    expect(stats).toEqual([
      { rule: 'madda_normal', correct: 0, total: 1 }, // 0% — weakest
      { rule: 'qalaqah', correct: 2, total: 3 }, // ~67%
    ])
  })

  it('returns nothing when no attempt carries a rule', async () => {
    const { ruleStatsFromAttempts } = await loadProgress()
    expect(ruleStatsFromAttempts({ makharij: [{ date: 'd', difficulty: 'easy', score: { correct: 1, total: 1 }, results: [{ correct: true }] }] })).toEqual(
      [],
    )
  })
})

describe('lessonCardState', () => {
  it('derives learned/started/not-started from the learned flag and whether there is an attempt', async () => {
    const { lessonCardState } = await loadProgress()
    expect(lessonCardState(true, true)).toBe('learned')
    expect(lessonCardState(true, false)).toBe('learned')
    expect(lessonCardState(false, true)).toBe('started')
    expect(lessonCardState(false, false)).toBe('not-started')
  })
})

describe('resetAllProgress', () => {
  it('clears both learned lessons and recorded attempts', async () => {
    const { isLessonLearned, setLessonLearned, attemptsForLesson, recordQuizAttempt, resetAllProgress } = await loadProgress()
    setLessonLearned('qalqalah', true)
    recordQuizAttempt('qalqalah', 'easy', [{ correct: true }])

    resetAllProgress()

    expect(isLessonLearned('qalqalah')).toBe(false)
    expect(attemptsForLesson('qalqalah')).toEqual([])
    expect(localStorage.getItem('tajweed.progress')).toBeNull()
    expect(localStorage.getItem('tajweed.progress.attempts')).toBeNull()
  })

  it('notifies useProgress subscribers', async () => {
    const { useProgress, setLessonLearned, recordQuizAttempt } = await loadProgress()
    const { result } = renderHook(() => useProgress())

    act(() => {
      setLessonLearned('qalqalah', true)
      recordQuizAttempt('qalqalah', 'easy', [{ correct: true }])
    })
    expect(result.current.count).toBe(1)
    expect(result.current.hasAttempts('qalqalah')).toBe(true)

    act(() => {
      result.current.reset()
    })
    expect(result.current.count).toBe(0)
    expect(result.current.hasAttempts('qalqalah')).toBe(false)
  })
})
