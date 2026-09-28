import { useEffect } from 'react'
import { LessonList } from './components/LessonList'
import { LessonView } from './components/LessonView'
import { useLocale } from './i18n/LocaleProvider'
import { ui } from './i18n/ui'
import { findLesson } from './lessons'
import { useHashRoute } from './useHashRoute'

export function App() {
  const { locale, setLocale, t } = useLocale()
  const route = useHashRoute()
  const lesson = route.page === 'lesson' ? findLesson(route.id) : undefined

  useEffect(() => {
    document.title = lesson ? `${t(lesson.title)} · ${t(ui.appTitle)}` : t(ui.appTitle)
    window.scrollTo(0, 0)
  }, [lesson, t])

  return (
    <>
      <header className="app-header">
        <a href="#/" className="brand">
          <h1>{t(ui.appTitle)}</h1>
          <span>{t(ui.appTagline)}</span>
        </a>
        <button
          type="button"
          className="lang-toggle"
          lang={locale === 'ar' ? 'en' : 'ar'}
          onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
        >
          {t(ui.switchLanguage)}
        </button>
      </header>
      <main>
        {route.page === 'home' && <LessonList />}
        {route.page === 'lesson' && (lesson ? <LessonView lesson={lesson} /> : <p>{t(ui.lessonNotFound)}</p>)}
      </main>
    </>
  )
}
