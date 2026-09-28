import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { LESSONS } from '../lessons'

export function LessonList() {
  const { t } = useLocale()
  return (
    <section>
      <h2>{t(ui.lessons)}</h2>
      <ol className="lesson-list">
        {LESSONS.map((lesson) => (
          <li key={lesson.id}>
            <a href={`#/lesson/${lesson.id}`} className="card">
              <strong>{t(lesson.title)}</strong>
              <span>{t(lesson.summary)}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
