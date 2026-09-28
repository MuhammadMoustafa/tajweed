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
