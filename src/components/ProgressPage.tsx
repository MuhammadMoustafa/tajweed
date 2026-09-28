import { useState } from 'react'
import { formatDate, type Bilingual, type Locale } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'
import { formatAttemptsCount, ui } from '../i18n/ui'
import { LESSONS } from '../lessons'
import { useProgress, type LessonCardState, type QuizAttempt } from '../progress'
import { DIFFICULTY_LABEL } from '../quiz/difficultyLabel'
import { ALL_RULES } from '../tajweed/rules'

/** Bilingual label for a lesson's card state, reusing the same strings as the home cards
 *  (src/components/LessonList.tsx): "learned" reuses ui.markedAsLearned. */
const STATE_LABEL: Record<LessonCardState, Bilingual> = {
  learned: ui.markedAsLearned,
  started: ui.cardStateStarted,
  'not-started': ui.cardStateNotStarted,
}

/** The most recent attempt (attempts are stored oldest first). */
const lastOf = (attempts: readonly QuizAttempt[]): QuizAttempt | undefined => attempts[attempts.length - 1]

/** The attempt with the highest correct/total ratio; ties keep the earlier one. */
function bestOf(attempts: readonly QuizAttempt[]): QuizAttempt | undefined {
  return attempts.reduce<QuizAttempt | undefined>((best, attempt) => {
    if (!best) return attempt
    return attempt.score.correct / attempt.score.total > best.score.correct / best.score.total ? attempt : best
  }, undefined)
}

/**
 * Per-lesson attempt history and cross-lesson per-rule accuracy (#/progress), linked from the
 * app header. Reads only from src/progress.ts, which owns all progress storage.
 */
export function ProgressPage() {
  const { locale, t, n } = useLocale()
  const { isLearned, attemptsFor, cardState, ruleStats, reset } = useProgress()
  const [confirmingReset, setConfirmingReset] = useState(false)

  const hasAnyProgress = LESSONS.some((lesson) => isLearned(lesson.id) || attemptsFor(lesson.id).length > 0)

  const confirmReset = () => {
    reset()
    setConfirmingReset(false)
  }

  return (
    <article className="progress-page">
      <a href="#/" className="back">
        {t(ui.backToLessons)}
      </a>
      <h2>{t(ui.progressTitle)}</h2>

      {!hasAnyProgress ? (
        <p className="progress-empty">{t(ui.progressEmpty)}</p>
      ) : (
        <>
          <section>
            <h3>{t(ui.lessons)}</h3>
            <ul className="progress-lesson-list">
              {LESSONS.map((lesson) => {
                const attempts = attemptsFor(lesson.id)
                const best = bestOf(attempts)
                const last = lastOf(attempts)
                return (
                  <li key={lesson.id} className="card progress-lesson">
                    <a href={`#/lesson/${lesson.id}`}>
                      <strong>{t(lesson.title)}</strong>
                    </a>
                    <p className="progress-lesson-status">
                      {t(STATE_LABEL[cardState(lesson.id)])} ·{' '}
                      {attempts.length > 0 ? formatAttemptsCount(locale, attempts.length) : t(ui.noAttemptsYet)}
                    </p>
                    {best && last && (
                      <dl className="progress-lesson-scores">
                        <div>
                          <dt>{t(ui.bestScore)}</dt>
                          <dd>{scoreLine(locale, t, n, best)}</dd>
                        </div>
                        <div>
                          <dt>{t(ui.lastScore)}</dt>
                          <dd>{scoreLine(locale, t, n, last)}</dd>
                        </div>
                      </dl>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>

          <section>
            <h3>{t(ui.ruleAccuracyHeading)}</h3>
            {ruleStats.length === 0 ? (
              <p>{t(ui.ruleAccuracyEmpty)}</p>
            ) : (
              <ul className="rule-accuracy-list">
                {ruleStats.map((stat) => {
                  const teaches = LESSONS.find((lesson) => lesson.focusRules.includes(stat.rule))
                  const name = t(ALL_RULES[stat.rule].name)
                  return (
                    <li key={stat.rule} className="rule-accuracy-row">
                      {teaches ? <a href={`#/lesson/${teaches.id}`}>{name}</a> : <span>{name}</span>}
                      <span className="rule-accuracy-score">
                        {n(stat.correct)}/{n(stat.total)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </>
      )}

      {hasAnyProgress &&
        (confirmingReset ? (
          <div className="reset-confirm" role="alertdialog" aria-label={t(ui.resetConfirmQuestion)}>
            <p>{t(ui.resetConfirmQuestion)}</p>
            <button type="button" className="reset-confirm-yes" onClick={confirmReset}>
              {t(ui.resetConfirmYes)}
            </button>
            <button type="button" onClick={() => setConfirmingReset(false)}>
              {t(ui.cancel)}
            </button>
          </div>
        ) : (
          <button type="button" className="reset-progress" onClick={() => setConfirmingReset(true)}>
            {t(ui.resetProgress)}
          </button>
        ))}
    </article>
  )
}

/** "6/8 (Easy, Jan 5, 2026)" / "٦/٨ (سهل، ٥ يناير ٢٠٢٦)" for a best/last attempt row. */
function scoreLine(locale: Locale, t: (text: Bilingual) => string, n: (value: number) => string, attempt: QuizAttempt): string {
  return `${n(attempt.score.correct)}/${n(attempt.score.total)} (${t(DIFFICULTY_LABEL[attempt.difficulty])}, ${formatDate(locale, attempt.date)})`
}
