import { useState } from 'react'
import { ANIMATIONS } from '../animations'
import { dirOf } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { adjacentLessons } from '../lessons'
import type { Lesson } from '../lessons/types'
import { useProgress } from '../progress'
import { AyahExample } from './AyahExample'
import { Quiz } from './Quiz'
import { RuleLegend } from './RuleLegend'

export function LessonView({ lesson }: { lesson: Lesson }) {
  const { locale, t } = useLocale()
  const [playKey, setPlayKey] = useState(0)
  const Animation = lesson.animation ? ANIMATIONS[lesson.animation] : undefined
  const { isLearned, toggle } = useProgress()
  const learned = isLearned(lesson.id)
  const { prev, next } = adjacentLessons(lesson.id)
  // In RTL, "next" reads toward the visual left, so the arrows swap with direction rather than
  // pointing the same way "previous"/"next" would in LTR.
  const isRtl = dirOf(locale) === 'rtl'
  const prevArrow = isRtl ? '→' : '←'
  const nextArrow = isRtl ? '←' : '→'

  return (
    <article className="lesson">
      <a href="#/" className="back">
        {t(ui.backToLessons)}
      </a>
      <h2>{t(lesson.title)}</h2>
      {!lesson.reviewed && <p className="notice">{t(ui.notReviewed)}</p>}

      <button
        type="button"
        className={`learned-toggle${learned ? ' is-learned' : ''}`}
        aria-pressed={learned}
        onClick={() => toggle(lesson.id)}
      >
        {learned ? `✓ ${t(ui.markedAsLearned)}` : t(ui.markAsLearned)}
      </button>

      <div className="lesson-body">
        <div className="lesson-text">
          <p className="summary">{t(lesson.summary)}</p>
          {lesson.sections.map((section, i) => (
            <section key={i}>
              {section.heading && <h3>{t(section.heading)}</h3>}
              <p>{t(section.body)}</p>
            </section>
          ))}
        </div>

        {Animation && (
          <figure className="card animation">
            <Animation key={playKey} />
            <button type="button" onClick={() => setPlayKey((k) => k + 1)}>
              ↻ {t(ui.replay)}
            </button>
          </figure>
        )}
      </div>

      <h3>{t(ui.examples)}</h3>
      {lesson.focusRules.length > 0 && <RuleLegend rules={lesson.focusRules} />}
      {lesson.examples.map((example) => (
        <AyahExample key={example.verseKey} example={example} highlight={lesson.focusRules} />
      ))}

      {lesson.quiz && lesson.quiz.length > 0 && <Quiz questions={lesson.quiz} />}

      {(prev || next) && (
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
      )}
    </article>
  )
}
