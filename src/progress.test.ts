// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react'
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
  cleanup()
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

describe('passing a quiz', () => {
  const answers = (correct: number, total: number) => Array.from({ length: total }, (_, i) => ({ correct: i < correct }))

  it('marks the lesson learned at 80% or more, and not below', async () => {
    const { isLessonLearned, passesQuiz, recordQuizAttempt } = await loadProgress()
    expect(passesQuiz({ correct: 4, total: 5 })).toBe(true)
    expect(passesQuiz({ correct: 6, total: 8 })).toBe(false)
    recordQuizAttempt('ikhfa', 'easy', answers(6, 8))
    expect(isLessonLearned('ikhfa')).toBe(false)
    recordQuizAttempt('ikhfa', 'easy', answers(7, 8))
    expect(isLessonLearned('ikhfa')).toBe(true)
  })

  it('never unmarks a learned lesson when a later attempt fails', async () => {
    const { isLessonLearned, recordQuizAttempt, setLessonLearned } = await loadProgress()
    setLessonLearned('ikhfa', true)
    recordQuizAttempt('ikhfa', 'hard', answers(1, 8))
    expect(isLessonLearned('ikhfa')).toBe(true)
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

const LEARNED_KEY = 'tajweed.progress'
const ATTEMPTS_KEY = 'tajweed.progress.attempts'

/** A stored attempt as recordQuizAttempt writes it, with `overrides` replacing fields. */
function storedAttempt(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    date: '2026-10-01T00:00:00.000Z',
    difficulty: 'easy',
    score: { correct: 1, total: 2 },
    results: [{ rule: 'qalaqah', correct: true }, { correct: false }],
    ...overrides,
  }
}

function storeAttempts(attempts: Record<string, unknown[]>): void {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify({ version: 1, attempts }))
}

describe('R1: validating stored progress', () => {
  it('drops attempts with an unknown rule, a bad date or a score that disagrees with the results, keeping valid siblings', async () => {
    storeAttempts({
      qalqalah: [
        storedAttempt(),
        storedAttempt({ results: [{ rule: 'unknown-rule', correct: true }, { correct: false }] }),
        storedAttempt({ results: [{ rule: 42, correct: true }, { correct: false }] }),
        storedAttempt({ date: 'invalid-date' }),
        storedAttempt({ score: { correct: -1, total: 2 } }),
        storedAttempt({ score: { correct: 0.5, total: 2 } }),
        storedAttempt({ score: { correct: 1, total: 0 } }),
        storedAttempt({ score: { correct: 3, total: 2 } }),
        storedAttempt({ score: { correct: 2, total: 2 } }), // only one result is correct
        storedAttempt({ score: { correct: 1, total: 3 } }), // two results, not three
        storedAttempt({ score: { correct: '1', total: 2 } }),
        storedAttempt({ score: null }),
        storedAttempt({ score: { correct: 0, total: 0 }, results: [] }),
        storedAttempt({ date: '2026-10-02T00:00:00.000Z', score: { correct: 1, total: 1 }, results: [{ correct: true }] }),
      ],
      'other-lesson': [storedAttempt({ date: 'not a date' })],
    })
    const { attemptsForLesson, useProgress } = await loadProgress()

    expect(attemptsForLesson('qalqalah').map((a) => a.date)).toEqual(['2026-10-01T00:00:00.000Z', '2026-10-02T00:00:00.000Z'])
    expect(attemptsForLesson('other-lesson')).toEqual([])
    const { result } = renderHook(() => useProgress())
    expect(result.current.ruleStats).toEqual([{ rule: 'qalaqah', correct: 1, total: 1 }])
  })

  it('accepts what recordQuizAttempt itself writes, across a reload', async () => {
    const first = await loadProgress()
    first.recordQuizAttempt('qalqalah', 'hard', [{ rule: 'ikhafa', correct: true }, { correct: true }, { rule: 'qalaqah', correct: false }])
    vi.resetModules()
    const reloaded = await loadProgress()
    expect(reloaded.attemptsForLesson('qalqalah')).toEqual(first.attemptsForLesson('qalqalah'))
    expect(reloaded.attemptsForLesson('qalqalah')[0].score).toEqual({ correct: 2, total: 3 })
  })

  it('reads learned ids only from a JSON array of strings', async () => {
    localStorage.setItem(LEARNED_KEY, JSON.stringify('qalqalah'))
    let progress = await loadProgress()
    expect(progress.isLessonLearned('q')).toBe(false)
    expect(progress.isLessonLearned('qalqalah')).toBe(false)

    localStorage.setItem(LEARNED_KEY, JSON.stringify({ qalqalah: true }))
    vi.resetModules()
    progress = await loadProgress()
    expect(progress.isLessonLearned('qalqalah')).toBe(false)

    localStorage.setItem(LEARNED_KEY, JSON.stringify(['qalqalah', 7, null, 'ra']))
    vi.resetModules()
    progress = await loadProgress()
    const { useProgress } = progress
    const { result } = renderHook(() => useProgress())
    expect([...result.current.learnedIds]).toEqual(['qalqalah', 'ra'])
  })
})

describe('R2: reset when storage refuses to remove a key', () => {
  async function resetWithFailingRemoval(failing: readonly string[]) {
    const progress = await loadProgress()
    progress.setLessonLearned('qalqalah', true)
    progress.recordQuizAttempt('qalqalah', 'easy', [{ rule: 'qalaqah', correct: true }])
    const removeItem = Storage.prototype.removeItem
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(function (this: Storage, key: string) {
      if (failing.includes(key)) throw new Error('blocked')
      removeItem.call(this, key)
    })
    progress.resetAllProgress()
    return progress
  }

  it.each([[[LEARNED_KEY]], [[ATTEMPTS_KEY]], [[LEARNED_KEY, ATTEMPTS_KEY]]])(
    'keeps the reset for the session when removing %j fails',
    async (failing) => {
      const progress = await resetWithFailingRemoval(failing)
      const { useProgress } = progress
      const { result } = renderHook(() => useProgress())

      expect(progress.isLessonLearned('qalqalah')).toBe(false)
      expect(progress.attemptsForLesson('qalqalah')).toEqual([])
      expect(result.current.count).toBe(0)
      expect(result.current.ruleStats).toEqual([])
      // Only the refused keys are still in storage: a reload would read them again.
      expect(localStorage.getItem(LEARNED_KEY) !== null).toBe(failing.includes(LEARNED_KEY))
      expect(localStorage.getItem(ATTEMPTS_KEY) !== null).toBe(failing.includes(ATTEMPTS_KEY))
    },
  )

  it('persists the next change after a refused reset, without the old data', async () => {
    const progress = await resetWithFailingRemoval([LEARNED_KEY, ATTEMPTS_KEY])
    progress.setLessonLearned('ra', true)
    progress.recordQuizAttempt('ra', 'easy', [{ correct: false }])

    vi.resetModules()
    const reloaded = await loadProgress()
    expect(reloaded.isLessonLearned('qalqalah')).toBe(false)
    expect(reloaded.isLessonLearned('ra')).toBe(true)
    expect(reloaded.attemptsForLesson('qalqalah')).toEqual([])
    expect(reloaded.attemptsForLesson('ra')).toHaveLength(1)
  })
})

describe('R3: changes from another tab', () => {
  /** What the browser does in this tab when another tab writes `key` (null: clears storage). */
  function otherTabWrites(key: string | null, newValue: string | null): void {
    act(() => {
      if (key === null) localStorage.clear()
      else if (newValue === null) localStorage.removeItem(key)
      else localStorage.setItem(key, newValue)
      window.dispatchEvent(new StorageEvent('storage', { key, newValue, storageArea: localStorage }))
    })
  }

  it('updates every mounted view: learned flags, attempts, then a clear', async () => {
    const { useProgress } = await loadProgress()
    const home = renderHook(() => useProgress())
    const progressPage = renderHook(() => useProgress())

    otherTabWrites(LEARNED_KEY, JSON.stringify(['qalqalah']))
    for (const view of [home, progressPage]) expect(view.result.current.isLearned('qalqalah')).toBe(true)

    otherTabWrites(ATTEMPTS_KEY, JSON.stringify({ version: 1, attempts: { ra: [storedAttempt()] } }))
    for (const view of [home, progressPage]) {
      expect(view.result.current.cardState('ra')).toBe('started')
      expect(view.result.current.ruleStats).toEqual([{ rule: 'qalaqah', correct: 1, total: 1 }])
    }

    otherTabWrites(null, null)
    for (const view of [home, progressPage]) {
      expect(view.result.current.count).toBe(0)
      expect(view.result.current.hasAttempts('ra')).toBe(false)
    }
  })

  it("follows another tab's reset, which removes both keys", async () => {
    const { useProgress, setLessonLearned, recordQuizAttempt } = await loadProgress()
    setLessonLearned('qalqalah', true)
    recordQuizAttempt('qalqalah', 'easy', [{ correct: true }])
    const { result } = renderHook(() => useProgress())

    otherTabWrites(LEARNED_KEY, null)
    expect(result.current.count).toBe(0)
    otherTabWrites(ATTEMPTS_KEY, null)
    expect(result.current.hasAttempts('qalqalah')).toBe(false)
  })

  it('ignores storage events for other keys', async () => {
    const { useProgress } = await loadProgress()
    let renders = 0
    renderHook(() => {
      renders += 1
      return useProgress()
    })
    const before = renders
    otherTabWrites('tajweed.locale', 'ar')
    expect(renders).toBe(before)
  })

  it('listens to the window only while a view is subscribed', async () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const { useProgress } = await loadProgress()
    const storageCalls = (spy: typeof add) => spy.mock.calls.filter(([type]) => type === 'storage').length

    const first = renderHook(() => useProgress())
    const second = renderHook(() => useProgress())
    expect(storageCalls(add)).toBe(1)

    first.unmount()
    expect(storageCalls(remove)).toBe(0)
    second.unmount()
    expect(storageCalls(remove)).toBe(1)
  })
})
