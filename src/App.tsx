import { lazy, Suspense, useEffect } from 'react'
import { LessonList } from './components/LessonList'
import { ProgressPage } from './components/ProgressPage'
import { useLocale } from './i18n/LocaleProvider'
import { ui } from './i18n/ui'
import { findLesson } from './lessons'
import { hasQuiz } from './lessons/quiz'
import { useHashRoute } from './useHashRoute'

// The lesson and quiz pages carry the animations, the verse data and the matn: loaded on demand as
// their own chunks (the service worker precaches them, so this still works offline), which keeps
// the first download to the home page and the chunk under the build's 500 kB warning as lessons grow.
const LessonView = lazy(() => import('./components/LessonView').then((m) => ({ default: m.LessonView })))
const QuizPage = lazy(() => import('./components/QuizPage').then((m) => ({ default: m.QuizPage })))

export function App() {
  const { locale, setLocale, t } = useLocale()
  const route = useHashRoute()
  const lesson = route.page === 'home' || route.page === 'progress' ? undefined : findLesson(route.id)
  const onQuiz = route.page === 'quiz'

  useEffect(() => {
    const parts = route.page === 'progress' ? [t(ui.progressTitle)] : lesson ? [...(onQuiz ? [t(ui.quizTitle)] : []), t(lesson.title)] : []
    document.title = [...parts, t(ui.appTitle)].join(' · ')
    window.scrollTo(0, 0)
  }, [route.page, lesson, onQuiz, t])

  return (
    <>
      <header className="app-header">
        <a href="#/" className="brand">
          <h1>{t(ui.appTitle)}</h1>
          <span>{t(ui.appTagline)}</span>
        </a>
        <div className="header-actions">
          <a href="#/progress" className="progress-link">
            {t(ui.progressTitle)}
          </a>
          <button
            type="button"
            className="lang-toggle"
            lang={locale === 'ar' ? 'en' : 'ar'}
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
          >
            {t(ui.switchLanguage)}
          </button>
        </div>
      </header>
      <main>
        <Suspense fallback={null}>
        {route.page === 'home' && <LessonList />}
        {route.page === 'progress' && <ProgressPage />}
        {route.page === 'lesson' && (lesson ? <LessonView key={lesson.id} lesson={lesson} /> : <p>{t(ui.lessonNotFound)}</p>)}
        {route.page === 'quiz' &&
          (lesson && hasQuiz(lesson) ? <QuizPage key={lesson.id} lesson={lesson} /> : <p>{t(ui.lessonNotFound)}</p>)}
        </Suspense>
      </main>
    </>
  )
}
