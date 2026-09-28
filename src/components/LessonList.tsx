import { useId } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import { formatLearnedCount, ui } from '../i18n/ui'
import { LESSONS } from '../lessons'
import { groupByUnit, UNITS } from '../lessons/units'
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
  const idPrefix = useId()
  // The next lesson to take: the first, in order, not yet marked learned.
  const nextId = LESSONS.find((lesson) => !isLearned(lesson.id))?.id

  return (
    <section>
      <h2>{t(ui.lessons)}</h2>
      <p className="progress-summary">{formatLearnedCount(locale, count, LESSONS.length)}</p>
      <CardStateLegend />
      <ol className="lesson-list">
        {groupByUnit(LESSONS).map((group) => {
          const cards = group.lessons.map((lesson) => (
            <li key={lesson.id}>
              <LessonCard lesson={lesson} state={cardState(lesson.id)} isNext={lesson.id === nextId} />
            </li>
          ))
          if (group.unit === undefined) return cards
          // A unit: its heading, then its chapters as their own nested list of the same cards.
          const headingId = `${idPrefix}unit-${group.unit}`
          return (
            <li key={headingId} className="lesson-unit" data-unit={group.unit}>
              <section aria-labelledby={headingId}>
                <h3 id={headingId} className="lesson-unit-title">
                  {t(UNITS[group.unit].title)}
                </h3>
                <ol className="lesson-list lesson-unit-chapters">{cards}</ol>
              </section>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
