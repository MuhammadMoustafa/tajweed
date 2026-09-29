import { useMemo } from 'react'
import { letterClip } from '../animations/LetterClip'
import { AREA_TITLES } from '../animations/MakharijClips'
import { makhrajOfLetter } from '../animations/mouth/makharij'
import { SIFAT, sifatOfLetter, type SifahId } from '../animations/mouth/sifat'
import { AnimationPlayer } from '../animations/player/AnimationPlayer'
import { dirOf } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { findLesson } from '../lessons'
import { cardOf, LETTERS_REVIEWED, letterName } from '../letters/letters'
import type { ArabicLetter } from '../tajweed/letters'

/** A "more in the lesson" link, or nothing if the lesson is missing. */
function LessonLink({ id }: { id: string }) {
  const { locale, t } = useLocale()
  const lesson = findLesson(id)
  if (!lesson) return null
  return (
    <a href={`#/lesson/${id}`} className="section-link">
      {t(ui.moreInLesson)}: {t(lesson.title)} {dirOf(locale) === 'rtl' ? '←' : '→'}
    </a>
  )
}

function SifatList({ ids }: { ids: readonly SifahId[] }) {
  const { t } = useLocale()
  return (
    <ul className="letter-sifat">
      {ids.map((id) => (
        <li key={id} data-sifah={id}>
          <strong>{t(SIFAT[id].name)}</strong>: {t(SIFAT[id].brief)}
        </li>
      ))}
    </ul>
  )
}

/**
 * One letter's card (#/letters/<id>): the letter, its makhraj (area and exact point, from the
 * makharij data), its qualities (from the sifat data) and a clip drawing the makhraj and playing
 * al-Husary's word for it (src/animations/LetterClip.tsx). Not a lesson: no quiz or progress.
 */
export function LetterView({ letter }: { letter: ArabicLetter }) {
  const { t } = useLocale()
  const card = cardOf(letter)
  const makhraj = makhrajOfLetter(card.letter)
  const { opposites, singles } = sifatOfLetter(card.letter)
  const clip = useMemo(() => letterClip(cardOf(letter)), [letter])

  return (
    <article className="lesson letter-view">
      <a href="#/letters" className="back">
        {t(ui.backToLetters)}
      </a>
      <h2>
        <span className="letter-view-glyph" lang="ar" dir="rtl">
          {card.letter}
        </span>{' '}
        {t(letterName(card))}
      </h2>
      {!LETTERS_REVIEWED && <p className="notice">{t(ui.lettersNotReviewed)}</p>}

      <div className="lesson-body">
        <div className="lesson-text">
          <p className="summary">{t(card.tip)}</p>
          <section className="letter-makhraj">
            <h3>{t(ui.letterMakhraj)}</h3>
            <dl>
              <dt>{t(ui.letterArea)}</dt>
              <dd>{t(AREA_TITLES[makhraj.area])}</dd>
              <dt>{t(ui.letterPoint)}</dt>
              <dd>{t(makhraj.description)}</dd>
            </dl>
            <LessonLink id={`makharij-${makhraj.area}`} />
          </section>
          <section className="letter-sifat-section">
            <h3>{t(ui.letterSifat)}</h3>
            <h4>{t(ui.letterPairedSifat)}</h4>
            <SifatList ids={opposites} />
            {singles.length > 0 && (
              <>
                <h4>{t(ui.letterSingleSifat)}</h4>
                <SifatList ids={singles} />
              </>
            )}
            <LessonLink id="sifat" />
          </section>
        </div>

        <figure className="card animation">
          <AnimationPlayer key={card.id} clip={clip} />
        </figure>
      </div>
    </article>
  )
}
