import { fireEvent, render, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import type { QuizQuestion } from '../lessons/types'
import { Quiz } from './Quiz'

// 112:1 has exactly one qalaqah letter, 'د' (see src/data/quran.json / parse.test.ts).
const questions: QuizQuestion[] = [
  {
    kind: 'tap',
    prompt: { ar: 'اضغط على حرف القلقلة', en: 'Tap the qalqalah letter' },
    verseKey: '112:1',
    rule: 'qalaqah',
  },
  {
    kind: 'choice',
    prompt: { ar: 'اختر ب', en: 'Pick B' },
    options: [
      { ar: 'أ', en: 'A' },
      { ar: 'ب', en: 'B' },
    ],
    correctIndex: 1,
    explanation: { ar: 'لأنها ب', en: 'Because it is B' },
  },
]

// Renders are not auto-cleaned between tests (no `globals: true`), so every query below is scoped
// to this render's own container rather than the shared `screen`.
const renderQuiz = () => {
  const { container } = render(
    <LocaleProvider>
      <Quiz questions={questions} />
    </LocaleProvider>,
  )
  return { container, screen: within(container) }
}

const tapTheQalqalahLetter = (container: HTMLElement) => {
  const span = [...container.querySelectorAll('.tap')].find((el) => el.textContent === 'د')
  if (!span) throw new Error('qalqalah letter span not found')
  fireEvent.click(span)
}

describe('Quiz', () => {
  it('disables checking until every question is answered', () => {
    const { container, screen } = renderQuiz()
    expect(screen.getByRole('button', { name: 'Check answers' })).toBeDisabled()

    tapTheQalqalahLetter(container)
    expect(screen.getByRole('button', { name: 'Check answers' })).toBeDisabled()

    fireEvent.click(screen.getByRole('radio', { name: 'B' }))
    expect(screen.getByRole('button', { name: 'Check answers' })).toBeEnabled()
  })

  it('scores a fully correct attempt', () => {
    const { container, screen } = renderQuiz()
    tapTheQalqalahLetter(container)
    fireEvent.click(screen.getByRole('radio', { name: 'B' }))
    fireEvent.click(screen.getByRole('button', { name: 'Check answers' }))

    expect(screen.getAllByText(/Correct!/)).toHaveLength(2)
    expect(screen.getByText('Your score: 2 / 2')).toBeInTheDocument()
  })

  it('marks a wrong choice, keeps the correct tap right, and lets the learner retry', () => {
    const { container, screen } = renderQuiz()
    tapTheQalqalahLetter(container)
    fireEvent.click(screen.getByRole('radio', { name: 'A' }))
    fireEvent.click(screen.getByRole('button', { name: 'Check answers' }))

    expect(screen.getByText('Correct!')).toBeInTheDocument()
    expect(screen.getByText(/Not quite\./)).toBeInTheDocument()
    expect(screen.getByText(/Because it is B/)).toBeInTheDocument()
    expect(screen.getByText('Your score: 1 / 2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(screen.getByRole('button', { name: 'Check answers' })).toBeDisabled()
    expect(screen.queryByText('Your score: 1 / 2')).not.toBeInTheDocument()
  })
})
