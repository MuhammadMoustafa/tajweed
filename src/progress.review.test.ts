// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Review reproductions: `it.fails` asserts the desired behavior for a confirmed open defect.
// When a fix lands, remove `.fails`; an unexpected pass deliberately fails the suite.
beforeEach(() => {
  localStorage.clear()
  vi.resetModules()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('2026-10-01 review: progress boundaries', () => {
  it.fails('R1: rejects unknown rule IDs before they reach the progress renderer', async () => {
    localStorage.setItem('tajweed.progress.attempts', JSON.stringify({
      version: 1,
      attempts: { qalqalah: [{
        date: '2026-10-01T00:00:00.000Z', difficulty: 'easy',
        score: { correct: 1, total: 1 }, results: [{ rule: 'unknown-rule', correct: true }],
      }] },
    }))
    const { attemptsForLesson } = await import('./progress')
    expect(attemptsForLesson('qalqalah')).toEqual([])
  })

  it.fails('R1: rejects an invalid date and inconsistent score', async () => {
    localStorage.setItem('tajweed.progress.attempts', JSON.stringify({
      version: 1,
      attempts: { qalqalah: [{
        date: 'invalid-date', difficulty: 'easy',
        score: { correct: -1, total: 0 }, results: [{ correct: true }],
      }] },
    }))
    const { attemptsForLesson } = await import('./progress')
    expect(attemptsForLesson('qalqalah')).toEqual([])
  })

  it.fails('R2: reset stays cleared in memory when storage removal fails', async () => {
    const progress = await import('./progress')
    progress.recordQuizAttempt('qalqalah', 'easy', [{ correct: true }])
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked') })
    progress.resetAllProgress()
    expect({
      learned: progress.isLessonLearned('qalqalah'),
      attempts: progress.attemptsForLesson('qalqalah'),
    }).toEqual({ learned: false, attempts: [] })
  })

  it.fails('R3: a storage event updates mounted progress subscribers', async () => {
    const { useProgress } = await import('./progress')
    const { result } = renderHook(() => useProgress())
    act(() => {
      const newValue = JSON.stringify(['qalqalah'])
      // Simulate a write in another tab followed by its browser storage event.
      localStorage.setItem('tajweed.progress', newValue)
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'tajweed.progress', oldValue: null, newValue, storageArea: localStorage,
      }))
    })
    expect(result.current.isLearned('qalqalah')).toBe(true)
  })
})
