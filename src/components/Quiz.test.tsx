import { fireEvent, render, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { LocaleProvider } from '../i18n/LocaleProvider'
import type { QuizQuestion } from '../lessons/types'
import { segmentsToLetters } from '../tajweed/graphemes'
import { parseTajweed } from '../tajweed/parse'
import { Quiz } from './Quiz'

// 112:1 has exactly one qalaqah letter, 'دٌ' (the API tags د; its tanween joins it as one letter).
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
  const span = [...container.querySelectorAll('.tap')].find((el) => el.textContent === 'دٌ')
  if (!span) throw new Error('qalqalah letter span not found')
  fireEvent.click(span)
}

describe('Quiz', () => {
  it('makes every letter its own tap target, not one span per rule run', () => {
    const { container } = renderQuiz()
    const tapSpans = container.querySelectorAll('.quiz-question .tap')
    const letters = segmentsToLetters(parseTajweed(getVerseMarkup('112:1')!).segments)
    const nonSpaceLetters = letters.filter((l) => !l.isSpace)

    expect(tapSpans.length).toBe(nonSpaceLetters.length)
    // 112:1 has only one qalqalah rule run ("د"), so a segment-per-run quiz would render far fewer
    // than this many tap targets.
    expect(tapSpans.length).toBeGreaterThan(3)
  })

  it('tapping a single letter selects only that letter', () => {
    const { container, screen } = renderQuiz()
    tapTheQalqalahLetter(container)

    const pressed = [...container.querySelectorAll('.tap[aria-pressed="true"]')]
    expect(pressed).toHaveLength(1)
    expect(pressed[0].textContent).toBe('دٌ')

    fireEvent.click(screen.getByRole('radio', { name: 'B' }))
    fireEvent.click(screen.getByRole('button', { name: 'Check answers' }))
    expect(screen.getByText('Correct!')).toBeInTheDocument()
  })

  it('flags the unanswered questions instead of checking', () => {
    const { container, screen } = renderQuiz()
    tapTheQalqalahLetter(container)
    fireEvent.click(screen.getByRole('button', { name: 'Check answers' }))
    expect(screen.getByRole('status')).toHaveTextContent('Answer the highlighted questions first (1)')
    expect(screen.queryByText(/Your score/)).toBeNull()
    // Only the unanswered (choice) question is flagged.
    const flagged = container.querySelectorAll('.quiz-question.unanswered')
    expect(flagged).toHaveLength(1)
    expect(flagged[0]).toHaveTextContent('Pick B')
    expect(flagged[0]).toHaveTextContent('Not answered yet')

    fireEvent.click(screen.getByRole('radio', { name: 'B' }))
    fireEvent.click(screen.getByRole('button', { name: 'Check answers' }))
    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.getByText(/Your score/)).toBeInTheDocument()
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
    expect(screen.getByRole('button', { name: 'Check answers' })).toBeEnabled()
    expect(screen.queryByText('Your score: 1 / 2')).not.toBeInTheDocument()
  })
})
