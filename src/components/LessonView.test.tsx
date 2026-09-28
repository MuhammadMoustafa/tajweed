import { fireEvent, render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { LESSONS } from '../lessons'
import { hasQuiz } from '../lessons/quiz'
import type { Lesson } from '../lessons/types'
import { LessonView } from './LessonView'

const lesson = LESSONS[0]

const renderLesson = (shown = lesson) => {
  const { container } = render(
    <LocaleProvider>
      <LessonView lesson={shown} />
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

  it('links only forward from the first lesson and only back from the last', () => {
    const first = within(renderLesson(LESSONS[0]).container)
    expect(first.queryByText(/Previous lesson/)).toBeNull()
    expect(first.queryAllByText(/Next lesson/).length).toBe(LESSONS.length > 1 ? 1 : 0)

    const last = within(renderLesson(LESSONS[LESSONS.length - 1]).container)
    expect(last.queryByText(/Next lesson/)).toBeNull()
    expect(last.queryAllByText(/Previous lesson/).length).toBe(LESSONS.length > 1 ? 1 : 0)
  })

  it('links every lesson with a quiz to its quiz page instead of showing the quiz inline', () => {
    for (const shown of LESSONS) {
      const { container, screen } = renderLesson(shown)
      expect(container.querySelector('.quiz')).toBeNull()
      const link = screen.queryByRole('link', { name: /Test yourself/ })
      if (hasQuiz(shown)) expect(link).toHaveAttribute('href', `#/lesson/${shown.id}/quiz`)
      else expect(link).toBeNull()
    }
  })

  it('plays the lesson clip beside the text and a section clip under its own section', () => {
    localStorage.setItem('tajweed.locale', 'ar')
    const shown: Lesson = {
      ...lesson,
      animation: 'qalqalah-bounce',
      sections: [lesson.sections[0], { ...lesson.sections[0], animation: 'natural-madd' }],
    }
    const { container } = renderLesson(shown)
    const main = within(container.querySelector<HTMLElement>('.animation')!)
    expect(main.getByRole('group', { name: 'حروف القلقلة الخمسة' })).toHaveAttribute('data-playing', 'false')

    const [plain, withClip] = container.querySelectorAll('section')
    expect(plain.querySelector('.player')).toBeNull()
    expect(within(withClip).getByRole('group', { name: 'المد الطبيعي: حروف المد الثلاثة' })).toBeInTheDocument()
    expect(within(withClip).getByText('الخطوة ١ من ٣')).toBeInTheDocument()
  })
})
