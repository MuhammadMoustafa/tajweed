import { useLocale } from '../i18n/LocaleProvider'
import { formatScore, ui } from '../i18n/ui'
import { hasQuiz } from '../lessons/quiz'
import type { Lesson } from '../lessons/types'
import { bestAttempt, lastAttempt, useProgress, type LessonCardState } from '../progress'
import { DIFFICULTY_LABEL } from '../quiz/difficultyLabel'

interface LessonCardProps {
  lesson: Lesson
  state: LessonCardState
  isNext: boolean
}

/**
 * One lesson's card on the home page (src/components/LessonList.tsx). Not itself a link: it's a
 * container with two separate interactive children, so no link ends up nested inside another.
 * The lesson link's ::after covers the whole card (one tap target); the quiz panel sits above it.
 * - Main part (inline-start): the link to the lesson, its title, summary and state badge.
 * - Quiz side panel (inline-end, stacking under the main part on narrow phones): a "Take the quiz"
 *   link when there's no attempt yet, otherwise the best/last grade plus a "Retry quiz" link.
 *   Omitted entirely when the lesson has no quiz.
 */
export function LessonCard({ lesson, state, isNext }: LessonCardProps) {
  const { locale, t } = useLocale()
  const { attemptsFor } = useProgress()
  const attempts = attemptsFor(lesson.id)
  const best = bestAttempt(attempts)
  const last = lastAttempt(attempts)
  const action = t(state === 'learned' ? ui.reviewLessonAction : state === 'started' ? ui.continueLessonAction : ui.startLessonAction)
  const arrow = locale === 'ar' ? '‹' : '›'

  return (
    <div className={`card lesson-card is-${state}${isNext ? ' is-next' : ''}`}>
      <a href={`#/lesson/${lesson.id}`} className="lesson-card-main" aria-label={`${action}: ${t(lesson.title)}`}>
        <strong>
          {t(lesson.title)}
          {state === 'learned' && (
            <span className="learned-check">
              {' '}
              ✓<span className="sr-only"> {t(ui.markedAsLearned)}</span>
            </span>
          )}
          {state === 'started' && <span className="card-badge started"> {t(ui.cardStateStarted)}</span>}
          {isNext && <span className="card-badge next"> {t(ui.nextLessonBadge)}</span>}
        </strong>
        <span>{t(lesson.summary)}</span>
        <span className="lesson-card-action">
          {action} <span aria-hidden="true">{arrow}</span>
        </span>
      </a>
      {hasQuiz(lesson) && (
        <div className="lesson-card-quiz">
          {!best || !last ? (
            <a href={`#/lesson/${lesson.id}/quiz`} className="lesson-card-quiz-link">
              {t(ui.takeQuizButton)}
            </a>
          ) : (
            <div className="lesson-card-grade">
              <span className="lesson-card-grade-best">{formatScore(locale, best.score)}</span>
              <span className="lesson-card-grade-last">
                {t(ui.lastScore)} {formatScore(locale, last.score)} · {t(DIFFICULTY_LABEL[last.difficulty])}
              </span>
              <a href={`#/lesson/${lesson.id}/quiz`} className="lesson-card-retry">
                {t(ui.retryQuizButton)}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
