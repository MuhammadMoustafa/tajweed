import { navArrows } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { adjacentLessons } from '../lessons'

/** Links to the lessons before and after `lessonId` (their lesson pages), under a lesson or its quiz. */
export function LessonNav({ lessonId }: { lessonId: string }) {
  const { locale, t } = useLocale()
  const { prev, next } = adjacentLessons(lessonId)
  const { prevArrow, nextArrow } = navArrows(locale)
  if (!prev && !next) return null
  return (
    <nav className="lesson-nav" aria-label={t(ui.lessonNavigation)}>
      {prev ? (
        <a href={`#/lesson/${prev.id}`} className="lesson-nav-link lesson-nav-prev">
          {prevArrow} {t(ui.previousLesson)}
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a href={`#/lesson/${next.id}`} className="lesson-nav-link lesson-nav-next">
          {t(ui.nextLesson)} {nextArrow}
        </a>
      ) : (
        <span />
      )}
    </nav>
  )
}
