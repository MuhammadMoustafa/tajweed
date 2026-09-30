import { fireEvent, render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { attemptsForLesson } from '../progress'
import type { DrawnQuestion } from '../quiz/draw'
import { segmentsToLetters } from '../tajweed/graphemes'
import { parseTajweed } from '../tajweed/parse'
import { Quiz } from './Quiz'

// 112:1 has exactly one qalaqah letter, 'دٌ' (the API tags د; its tanween joins it as one letter).
const questions: DrawnQuestion[] = [
  {
    kind: 'tap',
    prompt: { ar: 'اضغط على حرف القلقلة', en: 'Tap the qalqalah letter' },
    verseKey: '112:1',
    markup: getVerseMarkup('112:1')!,
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
const renderQuiz = (shown: readonly DrawnQuestion[] = questions, lessonId = 'qalqalah') => {
  const { container } = render(
    <LocaleProvider>
      <Quiz questions={shown} lessonId={lessonId} difficulty="easy" />
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
    // 80% or more passes, which marks the lesson learned and says so.
    expect(container.querySelector('.quiz-passed')).toHaveTextContent('You passed, so the lesson is marked as learned.')
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
    expect(container.querySelector('.quiz-passed')).toBeNull()
    // Color is never the only signal: the right answer carries ✓ and the wrong pick ✗.
    expect(container.querySelector('.quiz-option.correct')).toHaveTextContent('✓ B')
    expect(container.querySelector('.quiz-option.wrong')).toHaveTextContent('✗ A')

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(screen.getByRole('button', { name: 'Check answers' })).toBeEnabled()
    expect(screen.queryByText('Your score: 1 / 2')).not.toBeInTheDocument()
  })

  it('asks which rule is on a highlighted letter, coloring only that letter, and scores the pick', () => {
    // 112:3: tapIndex 4 is the first qalqalah dal (see quiz.test.ts).
    const ruleQuestion: DrawnQuestion = {
      kind: 'rule',
      prompt: { ar: 'ما الحكم؟', en: 'Which rule?' },
      verseKey: '112:3',
      markup: getVerseMarkup('112:3')!,
      letter: 4,
      options: ['madda_normal', 'qalaqah'],
      correctIndex: 1,
    }
    const { container, screen } = renderQuiz([ruleQuestion])
    const target = container.querySelectorAll('.quiz-target')
    expect(target).toHaveLength(1)
    expect(target[0].textContent).toBe('دْ')
    expect(target[0]).toHaveStyle({ color: 'var(--tj-quiz-target)' })
    // Named again below, with its word: 112:3's first dal ends word 2.
    expect(container.querySelector('.quiz-letter')?.textContent).toBe('دْ')
    expect(container.querySelector('.quiz-summary')).toHaveTextContent('(word 2)')
    // No rule colors: the highlight must not give the answer away.
    expect(container.querySelectorAll('.quran span[title]')).toHaveLength(0)

    fireEvent.click(screen.getByRole('radio', { name: 'Qalqalah (echo)' }))
    fireEvent.click(screen.getByRole('button', { name: 'Check answers' }))
    expect(screen.getByText('Your score: 1 / 1')).toBeInTheDocument()
  })

  it('records an attempt, tagged with the rule each generated question tested, once Check passes', () => {
    const { container, screen } = renderQuiz(questions, 'qalqalah')
    expect(attemptsForLesson('qalqalah')).toHaveLength(0)

    tapTheQalqalahLetter(container)
    fireEvent.click(screen.getByRole('radio', { name: 'B' }))
    fireEvent.click(screen.getByRole('button', { name: 'Check answers' }))

    const attempts = attemptsForLesson('qalqalah')
    expect(attempts).toHaveLength(1)
    expect(attempts[0].difficulty).toBe('easy')
    expect(attempts[0].score).toEqual({ correct: 2, total: 2 })
    // The tap question tested qalaqah; the authored choice question carries no rule.
    expect(attempts[0].results).toEqual([
      { rule: 'qalaqah', correct: true },
      { correct: true },
    ])
  })

  it('does not record an attempt for an unanswered Check press', () => {
    const { container, screen } = renderQuiz(questions, 'qalqalah')
    tapTheQalqalahLetter(container)
    fireEvent.click(screen.getByRole('button', { name: 'Check answers' }))
    expect(attemptsForLesson('qalqalah')).toHaveLength(0)
  })
})
