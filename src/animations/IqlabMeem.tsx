import type { ReactNode } from 'react'
import { getWord } from '../data/quran'
import type { Bilingual } from '../i18n/bilingual'
import { maddCountingSteps } from './maddCounting'
import { MaddBar } from './MaddBar'
import { MouthDiagram, type MakhrajRegion } from './mouth/MouthDiagram'
import type { Clip, ClipStep } from './player/clip'
import { CLIP_WORDS } from './words'

const COUNTS = 2
/** Isolated letters (not Quran text): the noon or the hidden meem, then the ba that causes it. */
const BA = 'بَ'
const NOON = 'نْ'
const MEEM = 'مْ'

/** The lips close lightly and the sound goes through the nose (khayshum): where the hidden meem is. */
const MEEM_REGIONS: MakhrajRegion[] = ['shafatan', 'khayshum']

/** A step's frame: the mouth diagram (labelled with what is lit) above the bar under the letters. */
const withMouth = (regions: MakhrajRegion[]) => (bar: ReactNode) => (
  <div className="makharij-tour">
    <MouthDiagram highlight={regions} labels={regions} />
    {bar}
  </div>
)

const bar = (props: { letter: string; filled: number; label: Bilingual; regions: MakhrajRegion[]; stopped?: boolean }) =>
  withMouth(props.regions)(
    <MaddBar
      counts={COUNTS}
      filled={props.filled}
      current
      letter={props.letter}
      after={BA}
      cause="after"
      token="ghunnah"
      label={props.label}
      markers
      stopped={props.stopped}
    />,
  )

const WORD = CLIP_WORDS.iqlabAnbatna
/** About as long as the recited word, which the player waits for anyway (ClipStep.audio). */
export const LISTEN_MS = 2400

const STEPS: ClipStep[] = [
  {
    duration: 4000,
    label: { ar: 'النون قبل الباء', en: 'Noon before ba' },
    caption: {
      ar: 'نون ساكنة (أو تنوين) وبعدها باء. النون تخرج من طرف اللسان، لكن الباء حرف شفوي.',
      en: 'A noon sakinah (or tanween) with a ba right after it. The noon is made with the tongue tip, but ba is a lip letter.',
    },
    render: () =>
      bar({
        letter: NOON,
        filled: 0,
        regions: ['gums'],
        label: { ar: 'النون الساكنة، والباء بعدها', en: 'The noon sakinah, then the ba' },
      }),
  },
  {
    duration: 4500,
    label: { ar: 'تنقلب ميمًا', en: 'It turns into a meem' },
    caption: {
      ar: 'تُقلب النون ميمًا خفيفة: تنطبق الشفتان انطباقًا خفيفًا، ولا يبقى لطرف اللسان عمل.',
      en: 'The noon is changed into a light meem: the lips close lightly, and the tongue tip no longer does anything.',
    },
    render: () =>
      bar({
        letter: MEEM,
        filled: 0,
        regions: MEEM_REGIONS,
        label: { ar: 'ميم مخفاة قبل الباء', en: 'A hidden meem before the ba' },
      }),
  },
  ...maddCountingSteps({
    counts: COUNTS,
    bar: { letter: MEEM, after: BA, cause: 'after', token: 'ghunnah', label: { ar: 'غنة حركتان', en: 'Ghunnah: 2 counts' } },
    frame: withMouth(MEEM_REGIONS),
    ready: {
      ar: 'اقرأ معي: أطبق الشفتين برفق وأخرج الغنة من الأنف، وعدّ معها.',
      en: 'Say it with me: close the lips lightly, let the ghunnah come through the nose, and count along.',
    },
    stop: {
      ar: 'قف عند الحركتين، ثم انطق الباء واضحة مع فتح الشفتين.',
      en: 'Stop at two counts, then say the ba clearly as the lips open.',
    },
  }),
  {
    duration: LISTEN_MS,
    label: { ar: 'استمع', en: 'Listen' },
    caption: {
      ar: 'استمع إلى الإقلاب في القرآن: النون الساكنة قبل الباء في أول كلمة من الآية، غنة بمقدار حركتين.',
      en: 'Hear iqlab in the Quran: the noon sakinah before the ba in the first word of the ayah, with a ghunnah of two counts.',
    },
    audio: { word: WORD },
    render: () =>
      withMouth(MEEM_REGIONS)(
        <MaddBar counts={COUNTS} current markers stopped token="ghunnah" word={getWord(WORD)?.text} />,
      ),
  },
]

/**
 * Iqlab: the noon sakinah (or tanween) before ba turns into a hidden meem with a 2-count ghunnah.
 * Points at the noon (then the meem it becomes) and at the ba that causes it, on the lips and nose
 * of MouthDiagram, counts the ghunnah with MaddBar, then plays a Quran word with iqlab.
 */
export const iqlabMeem: Clip = {
  title: { ar: 'الإقلاب: النون تصير ميمًا', en: 'Iqlab: the noon becomes a meem' },
  steps: STEPS,
}
