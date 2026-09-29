import { getWord } from '../data/quran'
import type { Bilingual } from '../i18n/bilingual'
import { ui } from '../i18n/ui'
import { letterName, letterWord, splitAtLetter, type LetterCard } from '../letters/letters'
import { AREA_CAPTIONS, AREA_TITLES, letterTourFrame } from './MakharijClips'
import { makharijOf, makhrajOfLetter } from './mouth/makharij'
import type { Clip, ClipStep } from './player/clip'

/** Long enough to read the area's line, then the exact point's description, slowly. */
const AREA_MS = 3500
const POINT_MS = 5000
/** About as long as a recited word, which the player waits for anyway (ClipStep.audio). */
const LISTEN_MS = 2500

/** A narrow frame, so the letter and the word stay large on a phone. */
const VIEW_W = 300
const LETTER_Y = 48
const WORD_Y = 172

/** The letter large, a caret pointing down at the word, and the word with that letter colored. */
function listenFrame(card: LetterCard) {
  const key = letterWord(card)
  const text = getWord(key)?.text ?? ''
  const split = splitAtLetter(text, card.letter)
  return (
    <svg viewBox={`0 0 ${VIEW_W} 218`} aria-hidden="true" className="anim-svg letter-listen">
      <text x={VIEW_W / 2} y={LETTER_Y} textAnchor="middle" dominantBaseline="central" className="anim-letter" fill="var(--accent)">
        {card.letter}
      </text>
      <path d={`M${VIEW_W / 2 - 9} 114 L${VIEW_W / 2} 127 L${VIEW_W / 2 + 9} 114 Z`} fill="var(--accent)" />
      <text x={VIEW_W / 2} y={WORD_Y} textAnchor="middle" dominantBaseline="central" className="anim-word" data-word={key}>
        {split ? (
          <>
            {split.before}
            {/* Only the color changes, so the letter stays joined to its neighbors. */}
            <tspan fill="var(--accent)" data-letter>
              {split.at}
            </tspan>
            {split.after}
          </>
        ) : (
          text
        )}
      </text>
    </svg>
  )
}

function listenCaption(card: LetterCard): Bilingual {
  const name = letterName(card)
  if (card.letter === 'ا') {
    return {
      ar: 'استمع إلى الألف بعد الفتحة في هذه الكلمة، تُمدّ حركتين. هي الحرف الملوّن.',
      en: 'Listen for the alif after a fatha in this word, held for two counts. It is the colored letter.',
    }
  }
  const sakin = splitAtLetter(getWord(letterWord(card))?.text ?? '', card.letter)?.sakin
  return sakin
    ? {
        ar: `استمع إلى ${name.ar} ساكنةً في هذه الكلمة، حيث يظهر مخرجها. هي الحرف الملوّن.`,
        en: `Listen for ${name.en} with a sukun in this word, where its makhraj is easiest to hear. It is the colored letter.`,
      }
    : {
        ar: `استمع إلى ${name.ar} في هذه الكلمة. هي الحرف الملوّن.`,
        en: `Listen for ${name.en} in this word. It is the colored letter.`,
      }
}

/**
 * A letter card's clip (the letters page, #/letters/<id>): the general area it comes from (when
 * that area holds more than one makhraj), then its exact point with the contact drawn, both on the
 * makharij unit's frame; then al-Husary says a Quran word with the letter (LETTER_WORDS).
 */
export function letterClip(card: LetterCard): Clip {
  const makhraj = makhrajOfLetter(card.letter)
  const shown = makhraj.letters.find((l) => l.letter === card.letter)!
  const letters = [shown.text]
  const area: ClipStep[] =
    makharijOf(makhraj.area).length > 1
      ? [
          {
            duration: AREA_MS,
            label: AREA_TITLES[makhraj.area],
            caption: AREA_CAPTIONS[makhraj.area],
            render: () => letterTourFrame({ heading: AREA_TITLES[makhraj.area], highlight: [makhraj.area], letters, names: shown.name }),
          },
        ]
      : []
  return {
    title: { ar: `مخرج ${letterName(card).ar} وصوتها`, en: `${letterName(card).en}: its makhraj and its sound` },
    steps: [
      ...area,
      {
        duration: POINT_MS,
        label: makhraj.name,
        caption: makhraj.description,
        render: () =>
          letterTourFrame({
            heading: makhraj.name,
            highlight: makhraj.regions,
            contact: makhraj.contact,
            letters,
            current: 0,
            names: shown.name,
          }),
      },
      {
        duration: LISTEN_MS,
        label: ui.listen,
        caption: listenCaption(card),
        audio: { word: letterWord(card) },
        render: () => listenFrame(card),
      },
    ],
  }
}
