import { act, render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { formatNumber } from '../i18n/bilingual'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { LESSONS } from '../lessons'
import { recordQuizAttempt, setLessonLearned } from '../progress'
import { LessonList } from './LessonList'

const renderList = () => {
  const { container } = render(
    <LocaleProvider>
      <LessonList />
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

describe('LessonList', () => {
  it('shows a "0 of N learned" summary with nothing learned yet', () => {
    const { screen } = renderList()
    expect(screen.getByText(`0 of ${LESSONS.length} learned`)).toBeInTheDocument()
  })

  it('shows a check plus accessible text, and updates the count, once a lesson is marked learned', () => {
    const lesson = LESSONS[0]
    const { screen, container } = renderList()

    act(() => {
      setLessonLearned(lesson.id, true)
    })

    expect(screen.getByText(`1 of ${LESSONS.length} learned`)).toBeInTheDocument()
    // Not color alone: a check glyph plus screen-reader text name the state.
    expect(container.querySelector('.learned-check')).not.toBeNull()
    expect(screen.getByText('Learned', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('formats the count with Arabic-Indic digits in Arabic', () => {
    localStorage.setItem('tajweed.locale', 'ar')
    const { screen } = renderList()
    const expectedTotal = formatNumber('ar', LESSONS.length)
    expect(screen.getByText(`٠ من ${expectedTotal} تم تعلّمها`)).toBeInTheDocument()
  })

  it('marks the first not-learned lesson as "next", with a plain not-started card otherwise', () => {
    const { container } = renderList()
    const firstCard = container.querySelector(`a[href="#/lesson/${LESSONS[0].id}"]`)
    expect(firstCard).toHaveClass('is-next')
    expect(firstCard).toHaveClass('is-not-started')
    expect(container.querySelectorAll('.lesson-list .is-next')).toHaveLength(1)
  })

  it('gives a lesson with an attempt (but not learned) the "started" state and a badge, not learned', () => {
    const lesson = LESSONS[0]
    recordQuizAttempt(lesson.id, 'easy', [{ correct: true }])
    const { container } = renderList()

    const card = container.querySelector(`a[href="#/lesson/${lesson.id}"]`)
    expect(card).toHaveClass('is-started')
    expect(card).not.toHaveClass('is-learned')
    expect(card?.querySelector('.card-badge.started')).not.toBeNull()
  })

  it('gives a learned lesson the "learned" state even if it also has attempts, and moves "next" on', () => {
    const [first, second] = LESSONS
    recordQuizAttempt(first.id, 'easy', [{ correct: true }])
    setLessonLearned(first.id, true)
    const { container } = renderList()

    const firstCard = container.querySelector(`a[href="#/lesson/${first.id}"]`)
    expect(firstCard).toHaveClass('is-learned')
    expect(firstCard).not.toHaveClass('is-next')

    if (second) {
      const secondCard = container.querySelector(`a[href="#/lesson/${second.id}"]`)
      expect(secondCard).toHaveClass('is-next')
    }
  })

  it('shows a legend explaining the card colors', () => {
    const { container } = renderList()
    expect(container.querySelector('.legend')).not.toBeNull()
  })
})
