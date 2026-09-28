import { render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import type { Lesson } from '../lessons/types'
import { recordQuizAttempt } from '../progress'
import { LessonCard } from './LessonCard'

const baseLesson: Lesson = {
  id: 'test-lesson',
  order: 1,
  title: { ar: 'درس تجريبي', en: 'Test lesson' },
  summary: { ar: 'ملخص الدرس', en: 'Lesson summary' },
  sections: [],
  focusRules: ['madda_normal'],
  examples: [],
  reviewed: true,
}

const lessonWithoutQuiz: Lesson = { ...baseLesson, id: 'no-quiz-lesson', focusRules: [], quiz: undefined }

const renderCard = (lesson: Lesson) => {
  const { container } = render(
    <LocaleProvider>
      <LessonCard lesson={lesson} state="not-started" isNext={false} />
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

describe('LessonCard', () => {
  it('has no nested links: the lesson link and the quiz link are separate, sibling elements', () => {
    const { container } = renderCard(baseLesson)
    const main = container.querySelector('.lesson-card-main')
    expect(main?.tagName).toBe('A')
    // The main lesson link contains no other link (e.g. the quiz side panel's).
    expect(main?.querySelector('a')).toBeNull()
    const quizLink = container.querySelector('.lesson-card-quiz-link')
    expect(quizLink?.tagName).toBe('A')
    expect(main?.contains(quizLink)).toBe(false)
  })

  it('shows no side panel for a lesson without a quiz', () => {
    const { container } = renderCard(lessonWithoutQuiz)
    expect(container.querySelector('.lesson-card-quiz')).toBeNull()
  })

  it('shows a "Take the quiz" link when there is no attempt yet', () => {
    const { container, screen } = renderCard(baseLesson)
    const link = screen.getByText('Take the quiz')
    expect(link.closest('a')).toHaveAttribute('href', `#/lesson/${baseLesson.id}/quiz`)
    expect(container.querySelector('.lesson-card-grade')).toBeNull()
  })

  it('shows the best/last grade and a "Retry quiz" link once the quiz has been attempted', () => {
    recordQuizAttempt(baseLesson.id, 'easy', [{ correct: true }, { correct: true }, { correct: false }])
    recordQuizAttempt(baseLesson.id, 'medium', [{ correct: true }, { correct: false }])

    const { container, screen } = renderCard(baseLesson)
    expect(container.querySelector('.lesson-card-quiz-link')).toBeNull()
    // Best attempt: 2/3; last attempt: 1/2.
    expect(container.querySelector('.lesson-card-grade-best')).toHaveTextContent('2/3')
    expect(container.querySelector('.lesson-card-grade-last')).toHaveTextContent('1/2')

    const retry = screen.getByText('Retry quiz')
    expect(retry.closest('a')).toHaveAttribute('href', `#/lesson/${baseLesson.id}/quiz`)
  })
})
