import { useMemo, useRef, useState } from 'react'
import type { Bilingual } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { isChoiceAnswerCorrect, isTapAnswerCorrect, scoreQuiz, tapCorrectIndices, type SegmentState } from '../lessons/quiz'
import type { DrawnQuestion, DrawnRuleQuestion, DrawnTapQuestion } from '../quiz/draw'
import { segmentsToLetters } from '../tajweed/graphemes'
import { applyMarks } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import { ALL_RULES } from '../tajweed/rules'
import { TajweedText } from './TajweedText'

type Answer = { kind: 'tap'; selected: Set<number> } | { kind: 'choice'; index?: number }

const initialAnswer = (question: DrawnQuestion): Answer =>
  question.kind === 'tap' ? { kind: 'tap', selected: new Set() } : { kind: 'choice' }

const isAnswered = (answer: Answer): boolean => (answer.kind === 'tap' ? answer.selected.size > 0 : answer.index !== undefined)

/**
 * One quiz attempt (see src/quiz/draw.ts): tap-the-letters, "which rule is on the highlighted
 * letter?" and bilingual multiple choice.
 */
export function Quiz({ questions }: { questions: readonly DrawnQuestion[] }) {
  const { t, n } = useLocale()
  const [answers, setAnswers] = useState<Answer[]>(() => questions.map(initialAnswer))
  const [checked, setChecked] = useState(false)
  // Set when Check is pressed with questions still unanswered: those questions are flagged (until
  // answered) and the first is scrolled into view, so the press always says what's missing.
  const [showMissing, setShowMissing] = useState(false)
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const missing = showMissing && !checked ? answers.filter((answer) => !isAnswered(answer)).length : 0

  const results = useMemo(() => {
    if (!checked) return undefined
    return questions.map((question, i) => {
      const answer = answers[i]
      if (question.kind === 'tap' && answer.kind === 'tap')
        return isTapAnswerCorrect(answer.selected, tapCorrectIndices(question.markup, question.rule, question.marks))
      if (question.kind !== 'tap' && answer.kind === 'choice') return isChoiceAnswerCorrect(question, answer.index)
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
    setShowMissing(false)
  }

  const check = () => {
    const firstMissing = answers.findIndex((answer) => !isAnswered(answer))
    if (firstMissing === -1) {
      setChecked(true)
      return
    }
    setShowMissing(true)
    cards.current[firstMissing]?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section className="quiz" aria-label={t(ui.quizTitle)}>
      <h3>{t(ui.quizTitle)}</h3>
      {questions.map((question, i) => {
        const answer = answers[i]
        const isCorrect = results?.[i]
        const isMissing = missing > 0 && !isAnswered(answer)
        return (
          <div
            className={`card quiz-question${isMissing ? ' unanswered' : ''}`}
            key={i}
            data-kind={question.kind}
            data-verse={question.kind === 'choice' ? undefined : question.verseKey}
            ref={(el) => {
              cards.current[i] = el
            }}
          >
            <p className="quiz-prompt">{t(question.prompt)}</p>
            {isMissing && <p className="quiz-missing">{t(ui.notAnsweredYet)}</p>}
            {question.kind === 'tap' && answer.kind === 'tap' && (
              <TapQuestion question={question} selected={answer.selected} checked={checked} onToggle={(seg) => toggleTap(i, seg)} />
            )}
            {question.kind === 'rule' && <RuleQuestionVerse question={question} />}
            {question.kind !== 'tap' && answer.kind === 'choice' && (
              <ChoiceQuestion
                options={question.kind === 'rule' ? question.options.map((id) => ALL_RULES[id].name) : question.options}
                correctIndex={question.correctIndex}
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
          <>
            <button type="button" onClick={check}>
              {t(ui.checkAnswers)}
            </button>
            {missing > 0 && (
              <p className="quiz-feedback wrong" role="status">
                {t(ui.answerAllFirst)} ({n(missing)})
              </p>
            )}
          </>
        ) : (
          <>
            <p className="quiz-score">
              {t(ui.yourScore)}: {n(score!.correct)} / {n(score!.total)}
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

/**
 * The verse of a "which rule?" question with its letter highlighted, and that letter named again
 * below with its word number: a highlighted harakah-sized letter (a dagger alif) is easy to miss.
 */
function RuleQuestionVerse({ question }: { question: DrawnRuleQuestion }) {
  const { t, n } = useLocale()
  const parsedSegments = parseTajweed(question.markup).segments
  const letters = segmentsToLetters(question.marks?.length ? applyMarks(parsedSegments, question.marks) : parsedSegments)
  const at = letters.findIndex((l) => l.tapIndex === question.letter)
  const word = letters.slice(0, at).filter((l) => l.isSpace).length + 1
  return (
    <div>
      <TajweedText markup={question.markup} marks={question.marks} target={question.letter} />
      <p className="quiz-summary">
        {t(ui.highlightedLetter)}:{' '}
        <span className="quiz-letter" lang="ar" style={{ color: 'var(--tj-quiz-target)' }}>
          {letters[at]?.text}
        </span>{' '}
        ({t(ui.wordNumber)} {n(word)})
      </p>
    </div>
  )
}

function TapQuestion({
  question,
  selected,
  checked,
  onToggle,
}: {
  question: DrawnTapQuestion
  selected: ReadonlySet<number>
  checked: boolean
  onToggle: (segmentIndex: number) => void
}) {
  const { t } = useLocale()
  const { markup } = question
  const parsedSegments = parseTajweed(markup).segments
  const ruledSegments = question.marks?.length ? applyMarks(parsedSegments, question.marks) : parsedSegments
  const letters = segmentsToLetters(ruledSegments)
  const correct = tapCorrectIndices(markup, question.rule, question.marks)
  const correctLetters = letters.filter((l) => l.tapIndex !== undefined && correct.includes(l.tapIndex))

  const stateOf = (index: number): SegmentState | undefined => {
    if (!checked) return selected.has(index) ? 'selected' : undefined
    if (correct.includes(index)) return 'correct'
    return selected.has(index) ? 'wrong' : undefined
  }

  return (
    <div>
      <TajweedText markup={markup} marks={question.marks} interactive={{ selected, onToggle, stateOf }} />
      {checked && (
        <p className="quiz-summary">
          {t(ui.correctLetters)}: {correctLetters.map((l) => l.text).join('، ')}
        </p>
      )}
    </div>
  )
}

function ChoiceQuestion({
  options,
  correctIndex,
  selectedIndex,
  checked,
  onChoose,
}: {
  options: readonly Bilingual[]
  correctIndex: number
  selectedIndex: number | undefined
  checked: boolean
  onChoose: (optionIndex: number) => void
}) {
  const { t } = useLocale()
  return (
    <div className="quiz-options" role="radiogroup">
      {options.map((option, i) => {
        const isSelected = selectedIndex === i
        const isRightAnswer = checked && i === correctIndex
        const isWrongPick = checked && isSelected && i !== correctIndex
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
