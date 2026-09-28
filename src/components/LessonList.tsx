import { useLocale } from '../i18n/LocaleProvider'
import { formatLearnedCount, ui } from '../i18n/ui'
import { LESSONS } from '../lessons'
import { useProgress } from '../progress'

/** Color is never the only signal: each lesson-card state below also has a text badge or
 *  sr-only label (see the map in LessonList). This legend names what the colors mean. */
function CardStateLegend() {
  const { t } = useLocale()
  return (
    <aside className="legend" aria-label={t(ui.cardStateLegend)}>
      <ul>
        <li>
          <span className="swatch state-swatch is-learned" aria-hidden="true" />
          {t(ui.markedAsLearned)}
        </li>
        <li>
          <span className="swatch state-swatch is-started" aria-hidden="true" />
          {t(ui.cardStateStarted)}
        </li>
        <li>
          <span className="swatch state-swatch is-next" aria-hidden="true" />
          {t(ui.nextLessonBadge)}
        </li>
      </ul>
    </aside>
  )
}

export function LessonList() {
  const { locale, t } = useLocale()
  const { isLearned, cardState, count } = useProgress()
  // The next lesson to take: the first, in order, not yet marked learned.
  const nextId = LESSONS.find((lesson) => !isLearned(lesson.id))?.id

  return (
    <section>
      <h2>{t(ui.lessons)}</h2>
      <p className="progress-summary">{formatLearnedCount(locale, count, LESSONS.length)}</p>
      <CardStateLegend />
      <ol className="lesson-list">
        {LESSONS.map((lesson) => {
          const state = cardState(lesson.id)
          const isNext = lesson.id === nextId
          return (
            <li key={lesson.id}>
              <a href={`#/lesson/${lesson.id}`} className={`card lesson-card is-${state}${isNext ? ' is-next' : ''}`}>
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
              </a>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
