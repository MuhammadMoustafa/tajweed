import { useMemo, useState } from 'react'
import { getVerseMarkup } from '../data/quran'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { isChoiceAnswerCorrect, isTapAnswerCorrect, scoreQuiz, tapCorrectIndices, type SegmentState } from '../lessons/quiz'
import type { QuizChoiceQuestion, QuizQuestion, QuizTapQuestion } from '../lessons/types'
import { parseTajweed } from '../tajweed/parse'
import { TajweedText } from './TajweedText'

type Answer = { kind: 'tap'; selected: Set<number> } | { kind: 'choice'; index?: number }

const initialAnswer = (question: QuizQuestion): Answer =>
  question.kind === 'tap' ? { kind: 'tap', selected: new Set() } : { kind: 'choice' }

const isAnswered = (answer: Answer): boolean => (answer.kind === 'tap' ? answer.selected.size > 0 : answer.index !== undefined)

/** Practice quiz shown after a lesson's examples: tap-the-letters and bilingual multiple choice. */
export function Quiz({ questions }: { questions: readonly QuizQuestion[] }) {
  const { t } = useLocale()
  const [answers, setAnswers] = useState<Answer[]>(() => questions.map(initialAnswer))
  const [checked, setChecked] = useState(false)

  const results = useMemo(() => {
    if (!checked) return undefined
    return questions.map((question, i) => {
      const answer = answers[i]
      if (question.kind === 'tap' && answer.kind === 'tap') {
        const markup = getVerseMarkup(question.verseKey)
        return markup ? isTapAnswerCorrect(answer.selected, tapCorrectIndices(markup, question.rule)) : false
      }
      if (question.kind === 'choice' && answer.kind === 'choice') return isChoiceAnswerCorrect(question, answer.index)
      return false
    })
  }, [checked, questions, answers])

  const score = results && scoreQuiz(results)

  const toggleTap = (questionIndex: number, segmentIndex: number) => {
    if (checked) return
    setAnswers((prev) =>
      prev.map((answer, i) => {
        if (i !== questionIndex || answer.kind !== 'tap') return answer
        const selected = new Set(answer.selected)
        if (selected.has(segmentIndex)) selected.delete(segmentIndex)
        else selected.add(segmentIndex)
        return { kind: 'tap', selected }
      }),
    )
  }

  const chooseOption = (questionIndex: number, optionIndex: number) => {
    if (checked) return
    setAnswers((prev) => prev.map((answer, i) => (i === questionIndex ? { kind: 'choice', index: optionIndex } : answer)))
  }

  const reset = () => {
    setAnswers(questions.map(initialAnswer))
    setChecked(false)
  }

  return (
    <section className="quiz" aria-label={t(ui.quizTitle)}>
      <h3>{t(ui.quizTitle)}</h3>
      {questions.map((question, i) => {
        const answer = answers[i]
        const isCorrect = results?.[i]
        return (
          <div className="card quiz-question" key={i}>
            <p className="quiz-prompt">{t(question.prompt)}</p>
            {question.kind === 'tap' && answer.kind === 'tap' && (
              <TapQuestion question={question} selected={answer.selected} checked={checked} onToggle={(seg) => toggleTap(i, seg)} />
            )}
            {question.kind === 'choice' && answer.kind === 'choice' && (
              <ChoiceQuestion
                question={question}
                selectedIndex={answer.index}
                checked={checked}
                onChoose={(opt) => chooseOption(i, opt)}
              />
            )}
            {checked && (
              <p className={`quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
                {isCorrect ? t(ui.quizCorrect) : t(ui.quizIncorrect)}
                {question.kind === 'choice' && question.explanation ? ` ${t(question.explanation)}` : ''}
              </p>
            )}
          </div>
        )
      })}
      <div className="quiz-actions">
        {!checked ? (
          <button type="button" onClick={() => setChecked(true)} disabled={!answers.every(isAnswered)}>
            {t(ui.checkAnswers)}
          </button>
        ) : (
          <>
            <p className="quiz-score">
              {t(ui.yourScore)}: {score!.correct} / {score!.total}
            </p>
            <button type="button" onClick={reset}>
              {t(ui.tryAgain)}
            </button>
          </>
        )}
      </div>
    </section>
  )
}

function TapQuestion({
  question,
  selected,
  checked,
  onToggle,
}: {
  question: QuizTapQuestion
  selected: ReadonlySet<number>
  checked: boolean
  onToggle: (segmentIndex: number) => void
}) {
  const { t } = useLocale()
  const markup = getVerseMarkup(question.verseKey)
  // A missing verse means `npm run fetch-quran` wasn't run after this question's verseKey was added.
  if (!markup) return null

  const segments = parseTajweed(markup).segments
  const correct = tapCorrectIndices(markup, question.rule)

  const stateOf = (index: number): SegmentState | undefined => {
    if (!checked) return selected.has(index) ? 'selected' : undefined
    if (correct.includes(index)) return 'correct'
    return selected.has(index) ? 'wrong' : undefined
  }

  return (
    <div>
      <TajweedText markup={markup} interactive={{ selected, onToggle, stateOf }} />
      {checked && (
        <p className="quiz-summary">
          {t(ui.correctLetters)}: {correct.map((i) => segments[i].text).join('، ')}
        </p>
      )}
    </div>
  )
}

function ChoiceQuestion({
  question,
  selectedIndex,
  checked,
  onChoose,
}: {
  question: QuizChoiceQuestion
  selectedIndex: number | undefined
  checked: boolean
  onChoose: (optionIndex: number) => void
}) {
  const { t } = useLocale()
  return (
    <div className="quiz-options" role="radiogroup">
      {question.options.map((option, i) => {
        const isSelected = selectedIndex === i
        const isRightAnswer = checked && i === question.correctIndex
        const isWrongPick = checked && isSelected && i !== question.correctIndex
        const className = ['quiz-option', isSelected && 'selected', isRightAnswer && 'correct', isWrongPick && 'wrong']
          .filter(Boolean)
          .join(' ')
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={className}
            disabled={checked}
            onClick={() => onChoose(i)}
          >
            {t(option)}
          </button>
        )
      })}
    </div>
  )
}
