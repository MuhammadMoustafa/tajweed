import { ANIMATIONS } from '../animations'
import { AnimationPlayer } from '../animations/player/AnimationPlayer'
import { navArrows } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import type { Lesson } from '../lessons/types'
import { useProgress } from '../progress'
import { hasQuiz } from '../lessons/quiz'
import { AyahExample } from './AyahExample'
import { LessonNav } from './LessonNav'
import { MatnPanel } from './MatnPanel'
import { RuleLegend } from './RuleLegend'

export function LessonView({ lesson }: { lesson: Lesson }) {
  const { locale, t } = useLocale()
  const { isLearned, toggle } = useProgress()
  const learned = isLearned(lesson.id)
  const { nextArrow } = navArrows(locale)

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
              {section.link && (
                <a href={section.link.href} className="section-link">
                  {t(section.link.label)} {nextArrow}
                </a>
              )}
              {section.animation && (
                <figure className="card section-animation">
                  <AnimationPlayer key={section.animation} clip={ANIMATIONS[section.animation]} />
                </figure>
              )}
            </section>
          ))}
        </div>

        {lesson.animation && (
          <figure className="card animation">
            <AnimationPlayer key={lesson.animation} clip={ANIMATIONS[lesson.animation]} />
          </figure>
        )}
      </div>

      <h3>{t(ui.examples)}</h3>
      {lesson.focusRules.length > 0 && <RuleLegend rules={lesson.focusRules} />}
      {lesson.examples.map((example) => (
        <AyahExample key={example.verseKey} example={example} highlight={lesson.focusRules} />
      ))}

      {lesson.mutoon && <MatnPanel refs={lesson.mutoon} />}

      {hasQuiz(lesson) && (
        <a href={`#/lesson/${lesson.id}/quiz`} className="card test-yourself">
          {t(ui.testYourself)} {nextArrow}
        </a>
      )}

      <LessonNav lessonId={lesson.id} />
    </article>
  )
}
