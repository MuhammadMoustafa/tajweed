import { getWord } from '../data/quran'
import type { Bilingual } from '../i18n/bilingual'
import { maddCountingSteps } from './maddCounting'
import { MaddBar } from './MaddBar'
import { MouthDiagram } from './mouth/MouthDiagram'
import type { Clip, ClipStep } from './player/clip'
import { CLIP_WORDS } from './words'

const COUNTS = 2

/**
 * The doubled letter shown large (a single consonant with its shaddah, not Quran text), which
 * MaddBar highlights and anchors its arrow, bar and start/end markers under. The bar uses the
 * ghunnah's own green token, so it matches the colored letters in the examples.
 */
const LETTER = 'نّ'
const LABEL: Bilingual = { ar: 'نون مشددة: غنة حركتان', en: 'Noon with shaddah: ghunnah of 2 counts' }

/** The nose (al-khayshum) beside the counting bar, lit once the ghunnah starts (with a nasal cloud of strength `nasal`, if given). */
export const withNose = (lit: boolean, bar: React.ReactNode, nasal?: number) => (
  <div className="ghunnah-tour">
    <MouthDiagram highlight={lit ? ['khayshum'] : []} labels={['khayshum']} nasal={nasal} />
    {bar}
  </div>
)

const WORD = CLIP_WORDS.ghunnah
const LISTEN_LABEL: Bilingual = { ar: 'نون مشددة: غنة حركتان', en: 'Noon with shaddah: ghunnah of 2 counts' }
/** About as long as the recited word, which the player waits for anyway (ClipStep.audio). */
export const LISTEN_MS = 2000

/** Reuses maddCountingSteps (get ready, count one, count two = end marker, stop); the nose lights from the first count. */
const counting = maddCountingSteps({
  counts: COUNTS,
  bar: { letter: LETTER, token: 'ghunnah', label: LABEL },
  ready: {
    ar: 'قل معي: انطق نونًا أو ميمًا مشددة، واترك الصوت يخرج من الأنف، وعُدّ معه.',
    en: 'Say it with me: pronounce a noon or meem with a shaddah, let the sound hum through the nose, and count along.',
  },
  stop: { ar: 'قف هنا؛ الغنة حركتان لا أكثر ولا أقل.', en: 'Stop here — the ghunnah is exactly two counts.' },
}).map((step, i): ClipStep => ({ ...step, render: (progress) => withNose(i > 0, step.render(progress)) }))

const listenFrame = () =>
  withNose(true, <MaddBar counts={COUNTS} current markers stopped token="ghunnah" word={getWord(WORD)?.text} label={LISTEN_LABEL} />)

/**
 * Ghunnah on a noon or meem with a shaddah: the nose lit while the 2 counts run on the shared
 * madd counting bar, pointing at the doubled letter, then al-Husary reciting a Quran word with it.
 */
export const ghunnah: Clip = {
  title: { ar: 'الغنة: عدّ الحركتين', en: 'Ghunnah: counting the two movements' },
  steps: [
    ...counting,
    {
      duration: LISTEN_MS,
      label: { ar: 'استمع', en: 'Listen' },
      caption: {
        ar: 'استمع إلى الغنة نفسها في القرآن: الميم المشددة في الكلمة الأولى من الآية، حركتان كما عددت.',
        en: 'Hear the same ghunnah in the Quran: the meem with a shaddah in the first word of the ayah, two counts, just as you counted.',
      },
      audio: { word: WORD },
      render: listenFrame,
    },
  ],
}
