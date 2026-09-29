import { getWord } from '../data/quran'
import type { Bilingual } from '../i18n/bilingual'
import { Localized } from '../i18n/LocaleProvider'
import { MouthDiagram, type MakhrajRegion } from './mouth/MouthDiagram'
import type { Clip, ClipStep } from './player/clip'
import { CLIP_WORDS } from './words'

/** The six throat letters, in the order the poem lists them (hamza, ha, ain, ha, ghain, kha). */
const THROAT_LETTERS = ['ء', 'هـ', 'ع', 'ح', 'غ', 'خ']
const NOON = 'نْ'
/** Audio-timed word: the third word of 1:7 (a lesson example), noon sakinah then ain in one word. */
const WORD = CLIP_WORDS.izharAnamta
export const LISTEN_MS = 2400

interface FrameProps {
  highlight: readonly MakhrajRegion[]
  letters: readonly string[]
  /** Indexes of the letters shown as "current" (lit); undefined lights them all. */
  current?: readonly number[]
  note?: Bilingual
  word?: string
}

/** The mouth diagram with its lit places, and under it the letters involved, the current ones marked. */
const frame = ({ highlight, letters, current, note, word }: FrameProps) => (
  <div className="makharij-tour">
    <MouthDiagram highlight={highlight} labels={highlight} />
    <div className="makharij-caption">
      <span className="makharij-letters" lang="ar" dir="rtl">
        {letters.map((text, i) => (
          <span
            key={`${text}${i}`}
            className="makharij-letter"
            data-current={current === undefined || current.includes(i) ? true : undefined}
          >
            {text}
          </span>
        ))}
      </span>
      {word && (
        <span className="makharij-letters" lang="ar" dir="rtl">
          <span className="makharij-letter" data-current>
            {word}
          </span>
        </span>
      )}
      {note && (
        <span className="makharij-letter-name">
          <Localized text={note} />
        </span>
      )}
    </div>
  </div>
)

const STEPS: ClipStep[] = [
  {
    duration: 4000,
    label: { ar: 'النون الساكنة', en: 'Noon sakinah' },
    caption: {
      ar: 'النون الساكنة (أو التنوين) تخرج من طرف اللسان مع اللثة، وتحمل غنة من الخيشوم.',
      en: 'A noon sakinah (or tanween) comes from the tip of the tongue at the gum ridge, and carries a ghunnah from the nose.',
    },
    render: () => frame({ highlight: ['tongue-tip', 'gums'], letters: [NOON], note: { ar: 'ن ساكنة', en: 'Noon with a sukun' } }),
  },
  {
    duration: 5000,
    label: { ar: 'حروف الحلق', en: 'The throat letters' },
    caption: {
      ar: 'حروف الحلق ستة: ء هـ ع ح غ خ. مخرجها من الحلق، بعيد عن مخرج النون.',
      en: 'There are six throat letters: ء هـ ع ح غ خ. They are made in the throat, far from where the noon is made.',
    },
    render: () => frame({ highlight: ['halq'], letters: THROAT_LETTERS }),
  },
  {
    duration: 7000,
    label: { ar: 'الإظهار', en: 'Izhar' },
    caption: {
      ar: 'قبل حرف الحلق تُنطق النون واضحة، ثم ينتقل اللسان إلى الحلق دون إدغام ولا إخفاء ولا مدّ للغنة.',
      en: 'Before a throat letter the noon is said clearly; then we move to the throat, with no merging, no hiding, and no stretching of the ghunnah.',
    },
    // First half: the noon on its own place; second half: the throat letter at the throat. The end frame shows the throat letter lit and both letters in the row.
    render: (progress) =>
      progress < 0.5
        ? frame({ highlight: ['tongue-tip', 'gums'], letters: [NOON, 'ع'], current: [0], note: { ar: 'أولًا: النون واضحة', en: 'First: the noon, clearly' } })
        : frame({ highlight: ['halq-middle'], letters: [NOON, 'ع'], current: [1], note: { ar: 'ثم: حرف الحلق مباشرة', en: 'Then: straight to the throat letter' } }),
  },
  {
    duration: LISTEN_MS,
    label: { ar: 'استمع', en: 'Listen' },
    caption: {
      ar: 'استمع: في الكلمة الثالثة من الآية السابعة من الفاتحة نون ساكنة ثم عين. النون واضحة.',
      en: 'Listen: the third word of the seventh ayah of al-Fatiha has a noon sakinah then an ain. The noon is clear.',
    },
    audio: { word: WORD },
    render: () => frame({ highlight: ['tongue-tip', 'gums', 'halq-middle'], letters: [NOON, 'ع'], word: getWord(WORD)?.text }),
  },
]

/** Izhar halqi (L4): the noon said clearly, then the throat letter lit at the throat. */
export const izharClip: Clip = {
  title: { ar: 'الإظهار الحلقي', en: 'Izhar halqi (clear noon)' },
  steps: STEPS,
}
