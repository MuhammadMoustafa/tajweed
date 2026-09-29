import { lazy, Suspense, useEffect } from 'react'
import { LessonList } from './components/LessonList'
import { ProgressPage } from './components/ProgressPage'
import { useLocale } from './i18n/LocaleProvider'
import { ui } from './i18n/ui'
import { findLesson } from './lessons'
import { hasQuiz } from './lessons/quiz'
import { letterNameOf, letterOfId } from './letters/ids'
import { reloadOnFailedImport } from './reloadOnFailedImport'
import { useHashRoute } from './useHashRoute'

// The lesson and quiz pages carry the animations, the verse data and the matn: loaded on demand as
// their own chunks (the service worker precaches them, so this still works offline), which keeps
// the first download to the home page and the chunk under the build's 500 kB warning as lessons grow.
// A page open since before a deploy can no longer find its old chunks: reloadOnFailedImport.
const LessonView = lazy(() =>
  reloadOnFailedImport(() => import('./components/LessonView')).then((m) => ({ default: m.LessonView })),
)
const QuizPage = lazy(() =>
  reloadOnFailedImport(() => import('./components/QuizPage')).then((m) => ({ default: m.QuizPage })),
)
const LettersPage = lazy(() =>
  reloadOnFailedImport(() => import('./components/LettersPage')).then((m) => ({ default: m.LettersPage })),
)
const LetterView = lazy(() =>
  reloadOnFailedImport(() => import('./components/LetterView')).then((m) => ({ default: m.LetterView })),
)

export function App() {
  const { locale, setLocale, t } = useLocale()
  const route = useHashRoute()
  const lesson = route.page === 'lesson' || route.page === 'quiz' ? findLesson(route.id) : undefined
  const letter = route.page === 'letter' ? letterOfId(route.id) : undefined
  const onQuiz = route.page === 'quiz'

  useEffect(() => {
    const parts =
      route.page === 'progress'
        ? [t(ui.progressTitle)]
        : route.page === 'letters' || route.page === 'letter'
          ? [...(letter ? [t(letterNameOf(letter))] : []), t(ui.lettersTitle)]
          : lesson
            ? [...(onQuiz ? [t(ui.quizTitle)] : []), t(lesson.title)]
            : []
    document.title = [...parts, t(ui.appTitle)].join(' · ')
    window.scrollTo(0, 0)
  }, [route.page, lesson, letter, onQuiz, t])

  return (
    <>
      <header className="app-header">
        <a href="#/" className="brand">
          <h1>{t(ui.appTitle)}</h1>
          <span>{t(ui.appTagline)}</span>
        </a>
        <div className="header-actions">
          <a href="#/letters" className="header-link letters-link">
            {t(ui.lettersTitle)}
          </a>
          <a href="#/progress" className="header-link progress-link">
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
        {route.page === 'letters' && <LettersPage />}
        {route.page === 'letter' && (letter ? <LetterView key={letter} letter={letter} /> : <p>{t(ui.letterNotFound)}</p>)}
        {route.page === 'lesson' && (lesson ? <LessonView key={lesson.id} lesson={lesson} /> : <p>{t(ui.lessonNotFound)}</p>)}
        {route.page === 'quiz' &&
          (lesson && hasQuiz(lesson) ? <QuizPage key={lesson.id} lesson={lesson} /> : <p>{t(ui.lessonNotFound)}</p>)}
        </Suspense>
      </main>
    </>
  )
}
