import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { LETTER_CARDS, letterName } from '../letters/letters'

/**
 * The letters page (#/letters): one card per letter, in alphabetical order, each a link to that
 * letter's card (#/letters/<id>). Like the lesson cards, each shows an explicit action label and
 * arrow so it reads as something to tap.
 */
export function LettersPage() {
  const { locale, t } = useLocale()
  const action = t(ui.openLetterAction)
  const arrow = locale === 'ar' ? '‹' : '›'
  return (
    <article className="letters-page">
      <a href="#/" className="back">
        {t(ui.backToLessons)}
      </a>
      <h2>{t(ui.lettersTitle)}</h2>
      <p className="summary">{t(ui.lettersIntro)}</p>
      <ul className="letter-grid">
        {LETTER_CARDS.map((card) => (
          <li key={card.id}>
            <a href={`#/letters/${card.id}`} className="card letter-card" aria-label={`${action}: ${t(letterName(card))}`}>
              <span className="letter-card-glyph" lang="ar" dir="rtl">
                {card.letter}
              </span>
              <strong>{t(letterName(card))}</strong>
              <span className="lesson-card-action">
                {action} <span aria-hidden="true">{arrow}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  )
}
