import { useState } from 'react'
import { ANIMATIONS } from '../animations'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import type { Lesson } from '../lessons/types'
import { AyahExample } from './AyahExample'
import { RuleLegend } from './RuleLegend'

export function LessonView({ lesson }: { lesson: Lesson }) {
  const { t } = useLocale()
  const [playKey, setPlayKey] = useState(0)
  const Animation = lesson.animation ? ANIMATIONS[lesson.animation] : undefined

  return (
    <article className="lesson">
      <a href="#/" className="back">
        {t(ui.backToLessons)}
      </a>
      <h2>{t(lesson.title)}</h2>
      {!lesson.reviewed && <p className="notice">{t(ui.notReviewed)}</p>}

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
      <RuleLegend rules={lesson.focusRules} />
      {lesson.examples.map((example) => (
        <AyahExample key={example.verseKey} example={example} highlight={lesson.focusRules} />
      ))}
    </article>
  )
}
