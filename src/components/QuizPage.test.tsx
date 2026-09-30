import { fireEvent, render, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { adjacentLessons, findLesson } from '../lessons'
import { QUIZ_LENGTH } from '../quiz/draw'
import { QuizPage } from './QuizPage'

const renderPage = (id: string, seed = 1) => {
  const { container } = render(
    <LocaleProvider>
      <QuizPage lesson={findLesson(id)!} seed={seed} />
    </LocaleProvider>,
  )
  return { container, screen: within(container) }
}

const drawnVerses = (container: HTMLElement) =>
  [...container.querySelectorAll('.quiz-question[data-verse]')].map((el) => el.getAttribute('data-verse'))

describe('QuizPage', () => {
  it('links to the lessons before and after, like the lesson page', () => {
    const { container } = renderPage('qalqalah')
    const { prev, next } = adjacentLessons('qalqalah')
    expect(container.querySelector('.lesson-nav-prev')).toHaveAttribute('href', `#/lesson/${prev!.id}`)
    expect(container.querySelector('.lesson-nav-next')).toHaveAttribute('href', `#/lesson/${next!.id}`)
  })

  it('loads the pool and draws a full attempt with a link back to the lesson', async () => {
    const { container, screen } = renderPage('qalqalah')
    await waitFor(() => expect(container.querySelectorAll('.quiz-question')).toHaveLength(QUIZ_LENGTH))
    expect(screen.getByRole('link', { name: 'Back to the lesson' })).toHaveAttribute('href', '#/lesson/qalqalah')
    // Quran text in questions is Arabic and right-to-left whatever the UI language.
    for (const quran of container.querySelectorAll('.quiz .quran')) {
      expect(quran).toHaveAttribute('lang', 'ar')
      expect(quran).toHaveAttribute('dir', 'rtl')
    }
  })

  it('redraws from the pool when the difficulty changes', async () => {
    const { container, screen } = renderPage('natural-madd')
    await waitFor(() => expect(container.querySelectorAll('.quiz-question')).toHaveLength(QUIZ_LENGTH))
    expect(screen.getByRole('radio', { name: 'Easy' })).toHaveAttribute('aria-checked', 'true')
    const easy = drawnVerses(container)

    fireEvent.click(screen.getByRole('radio', { name: 'Hard' }))
    expect(screen.getByRole('radio', { name: 'Hard' })).toHaveAttribute('aria-checked', 'true')
    expect(drawnVerses(container)).not.toEqual(easy)
  })

  it('shows only the authored questions, and no difficulty, for a lesson without focus rules', () => {
    const { container, screen } = renderPage('makharij')
    expect(container.querySelectorAll('.quiz-question')).toHaveLength(findLesson('makharij')!.quiz!.length)
    expect(screen.queryByRole('radiogroup', { name: 'Difficulty' })).toBeNull()
  })
})
