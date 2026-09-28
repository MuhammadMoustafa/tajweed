import { fireEvent, render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { LESSONS } from '../lessons'
import { LessonView } from './LessonView'

const lesson = LESSONS[0]

const renderLesson = () => {
  const { container } = render(
    <LocaleProvider>
      <LessonView lesson={lesson} />
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

describe('LessonView', () => {
  it('marks and unmarks the lesson as learned', () => {
    const { screen } = renderLesson()
    const toggle = screen.getByRole('button', { name: 'Mark as learned' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(toggle)
    const learnedButton = screen.getByRole('button', { name: /Learned/ })
    expect(learnedButton).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(learnedButton)
    expect(screen.getByRole('button', { name: 'Mark as learned' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('persists the learned state in localStorage under one key', () => {
    const { screen } = renderLesson()
    fireEvent.click(screen.getByRole('button', { name: 'Mark as learned' }))

    const raw = localStorage.getItem('tajweed.progress')
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toContain(lesson.id)
  })

  it('hides prev/next navigation at both ends of the (currently single-lesson) list', () => {
    const { container } = renderLesson()
    // LESSONS has one lesson today, so this lesson is both the first and the last: no nav at all.
    expect(container.querySelector('.lesson-nav')).toBeNull()
  })
})
