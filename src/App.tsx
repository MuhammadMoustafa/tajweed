import { useEffect } from 'react'
import { LessonList } from './components/LessonList'
import { LessonView } from './components/LessonView'
import { QuizPage } from './components/QuizPage'
import { useLocale } from './i18n/LocaleProvider'
import { ui } from './i18n/ui'
import { findLesson } from './lessons'
import { hasQuiz } from './lessons/quiz'
import { useHashRoute } from './useHashRoute'

export function App() {
  const { locale, setLocale, t } = useLocale()
  const route = useHashRoute()
  const lesson = route.page === 'home' ? undefined : findLesson(route.id)
  const onQuiz = route.page === 'quiz'

  useEffect(() => {
    const parts = lesson ? [...(onQuiz ? [t(ui.quizTitle)] : []), t(lesson.title)] : []
    document.title = [...parts, t(ui.appTitle)].join(' · ')
    window.scrollTo(0, 0)
  }, [lesson, onQuiz, t])

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
        {route.page === 'lesson' && (lesson ? <LessonView key={lesson.id} lesson={lesson} /> : <p>{t(ui.lessonNotFound)}</p>)}
        {route.page === 'quiz' &&
          (lesson && hasQuiz(lesson) ? <QuizPage key={lesson.id} lesson={lesson} /> : <p>{t(ui.lessonNotFound)}</p>)}
      </main>
    </>
  )
}
