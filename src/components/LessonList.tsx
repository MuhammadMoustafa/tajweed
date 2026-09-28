import { useLocale } from '../i18n/LocaleProvider'
import { formatLearnedCount, ui } from '../i18n/ui'
import { LESSONS } from '../lessons'
import { useProgress } from '../progress'
import { LessonCard } from './LessonCard'

/** Color is never the only signal: each lesson-card state below also has a text badge or
 *  sr-only label (see the map in LessonCard). This legend names what the colors mean. */
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
        {LESSONS.map((lesson) => (
          <li key={lesson.id}>
            <LessonCard lesson={lesson} state={cardState(lesson.id)} isNext={lesson.id === nextId} />
          </li>
        ))}
      </ol>
    </section>
  )
}
