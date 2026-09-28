import { useLocale } from '../i18n/LocaleProvider'
import { formatLearnedCount, ui } from '../i18n/ui'
import { LESSONS } from '../lessons'
import { useProgress } from '../progress'

export function LessonList() {
  const { locale, t } = useLocale()
  const { isLearned, count } = useProgress()

  return (
    <section>
      <h2>{t(ui.lessons)}</h2>
      <p className="progress-summary">{formatLearnedCount(locale, count, LESSONS.length)}</p>
      <ol className="lesson-list">
        {LESSONS.map((lesson) => {
          const learned = isLearned(lesson.id)
          return (
            <li key={lesson.id}>
              <a href={`#/lesson/${lesson.id}`} className="card">
                <strong>
                  {t(lesson.title)}
                  {learned && (
                    <span className="learned-check">
                      {' '}
                      ✓<span className="sr-only"> {t(ui.markedAsLearned)}</span>
                    </span>
                  )}
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
