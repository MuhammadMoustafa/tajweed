import { fireEvent, render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { attemptsForLesson, isLessonLearned, recordQuizAttempt, setLessonLearned } from '../progress'
import { ProgressPage } from './ProgressPage'

const renderPage = () => {
  const { container } = render(
    <LocaleProvider>
      <ProgressPage />
    </LocaleProvider>,
  )
  return { container, screen: within(container) }
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

describe('ProgressPage', () => {
  it('shows an empty state for a new learner', () => {
    const { screen } = renderPage()
    expect(screen.getByText(/haven't started learning yet/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reset progress' })).toBeNull()
  })

  it('shows the app version, and in a browser no update check', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const { container, screen } = renderPage()
    expect(container.querySelector('.update-status .app-version')).toHaveTextContent(/^Version \d+\.\d+\.\d+$/)
    expect(screen.queryByRole('button', { name: 'Check for updates' })).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })

  it('shows a lesson\'s attempt count and best/last score once it has attempts', () => {
    recordQuizAttempt('qalqalah', 'easy', [
      { rule: 'qalaqah', correct: true },
      { rule: 'qalaqah', correct: false },
    ])
    recordQuizAttempt('qalqalah', 'hard', [
      { rule: 'qalaqah', correct: true },
      { rule: 'qalaqah', correct: true },
    ])
    const { container } = renderPage()

    const card = container.querySelector('.progress-lesson-list a[href="#/lesson/qalqalah"]')!.closest('.progress-lesson')!
    expect(card).toHaveTextContent('2 attempts')
    expect(card).not.toHaveTextContent('Not started')
    // Best is the second attempt (2/2), which is also the most recent (last).
    expect(card.querySelector('.progress-lesson-scores')).toHaveTextContent('Best score2/2')
    expect(card.querySelector('.progress-lesson-scores')).toHaveTextContent('Last score2/2')
  })

  it('shows a learned lesson as learned even without attempts', () => {
    setLessonLearned('qalqalah', true)
    const { container } = renderPage()
    const card = container.querySelector('.progress-lesson-list a[href="#/lesson/qalqalah"]')!.closest('.progress-lesson')!
    expect(card).toHaveTextContent('Learned')
    expect(card).toHaveTextContent('No attempts yet')
  })

  it('lists rule accuracy weakest first, linking each rule to the lesson that teaches it', () => {
    // qalaqah: 1/2 (50%), madda_normal: 0/1 (0%) — madda_normal is weaker and must come first.
    recordQuizAttempt('qalqalah', 'easy', [
      { rule: 'qalaqah', correct: true },
      { rule: 'qalaqah', correct: false },
    ])
    recordQuizAttempt('natural-madd', 'easy', [{ rule: 'madda_normal', correct: false }])
    const { container } = renderPage()

    const rows = container.querySelectorAll('.rule-accuracy-row')
    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent('0/1')
    expect(rows[1]).toHaveTextContent('1/2')

    const link = within(rows[0] as HTMLElement).getByRole('link')
    expect(link).toHaveAttribute('href', '#/lesson/natural-madd')
  })

  it('resets all progress only after confirming', () => {
    setLessonLearned('qalqalah', true)
    recordQuizAttempt('qalqalah', 'easy', [{ correct: true }])
    const { screen } = renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Reset progress' }))
    expect(screen.getByText(/cannot be undone/)).toBeInTheDocument()
    // Not reset yet.
    expect(isLessonLearned('qalqalah')).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByText(/cannot be undone/)).toBeNull()
    expect(isLessonLearned('qalqalah')).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Reset progress' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, reset' }))

    expect(isLessonLearned('qalqalah')).toBe(false)
    expect(attemptsForLesson('qalqalah')).toEqual([])
    expect(screen.getByText(/haven't started learning yet/)).toBeInTheDocument()
  })
})
