import { useEffect, useMemo, useState } from 'react'
import { loadQuizPool } from '../data/quizPool'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import type { Lesson } from '../lessons/types'
import { drawQuiz, taughtRules } from '../quiz/draw'
import { DIFFICULTIES, type Difficulty, type QuizPool } from '../quiz/pool'
import { createRng, randomSeed } from '../quiz/random'
import { Quiz } from './Quiz'

const DIFFICULTY_LABEL = {
  easy: ui.difficultyEasy,
  medium: ui.difficultyMedium,
  hard: ui.difficultyHard,
} as const satisfies Record<Difficulty, unknown>

/**
 * A lesson's quiz page (#/lesson/<id>/quiz). Each attempt is drawn from the lesson's examples,
 * the whole-Quran pool at the chosen difficulty and the lesson's authored questions; `seed`
 * makes an attempt reproducible (tests), otherwise every visit and "New questions" is fresh.
 */
export function QuizPage({ lesson, seed: initialSeed }: { lesson: Lesson; seed?: number }) {
  const { t } = useLocale()
  const usesPool = taughtRules(lesson).length > 0
  // undefined while loading; null if it couldn't load (offline before the first visit cached it).
  const [pool, setPool] = useState<QuizPool | null>()
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [seed, setSeed] = useState(() => initialSeed ?? randomSeed())

  useEffect(() => {
    if (!usesPool) return
    let live = true
    loadQuizPool().then(
      (loaded) => live && setPool(loaded),
      () => live && setPool(null),
    )
    return () => {
      live = false
    }
  }, [usesPool])

  const questions = useMemo(
    () =>
      usesPool && pool === undefined
        ? undefined
        : drawQuiz({ lesson, difficulty, pool: pool ?? undefined, rng: createRng(seed) }),
    [lesson, usesPool, pool, difficulty, seed],
  )

  return (
    <article className="lesson quiz-page">
      <a href={`#/lesson/${lesson.id}`} className="back">
        {t(ui.backToLesson)}
      </a>
      <h2>{t(lesson.title)}</h2>
      {usesPool && <p className="summary">{t(ui.quizScope)}</p>}

      <div className="quiz-controls">
        {usesPool && (
          <div className="difficulty" role="radiogroup" aria-label={t(ui.difficulty)}>
            <span>{t(ui.difficulty)}:</span>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={difficulty === d}
                className={difficulty === d ? 'selected' : undefined}
                onClick={() => setDifficulty(d)}
              >
                {t(DIFFICULTY_LABEL[d])}
              </button>
            ))}
          </div>
        )}
        <button type="button" className="new-questions" onClick={() => setSeed(randomSeed())}>
          ↻ {t(ui.newQuestions)}
        </button>
      </div>

      {questions ? (
        <Quiz key={`${difficulty}-${seed}`} questions={questions} />
      ) : (
        <p role="status">{t(ui.loadingQuiz)}</p>
      )}
    </article>
  )
}
