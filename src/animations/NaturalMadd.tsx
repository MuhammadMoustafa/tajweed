import { getWord } from '../data/quran'
import type { Bilingual } from '../i18n/bilingual'
import { maddCountingSteps } from './maddCounting'
import { MaddBar } from './MaddBar'
import type { Clip, ClipStep } from './player/clip'
import { CLIP_WORDS } from './words'

const COUNTS = 2

/**
 * The syllable shown large throughout the clip (a single consonant + harakah, not Quran text) so
 * the harakah that makes it a madd letter is visible: `before` (the harakah/consonant) in the
 * plain text color, then `letter` itself, which MaddBar highlights and anchors its arrow, bar and
 * start/end markers under.
 */
const SYLLABLE = { before: 'بَ', letter: 'ا' }

/**
 * All three madd letters hold the same 2 counts (maintainer, #34), so بُو and بِي don't get their
 * own steps — only named once, small, alongside بَا's label.
 */
const READY_LABEL: Bilingual = {
  ar: 'ألف بعد فتحة: حركتان. وبُو، بِي بنفس المقدار، فلا داعي لتكرارهما.',
  en: 'Alif after fatha: 2 counts. بُو and بِي take exactly the same time, so they don’t get their own steps.',
}
const LABEL: Bilingual = { ar: 'ألف بعد فتحة: حركتان', en: 'Alif after fatha: 2 counts' }

/**
 * The last step plays a real Quran word with the same madd (an alif after a fatha), recited by
 * al-Husary: the basmala's third word (1:1, the lesson's first example). Its text comes from the
 * fetched data, never typed.
 */
const WORD = CLIP_WORDS.naturalMadd
const LISTEN_LABEL: Bilingual = { ar: 'ألف صغيرة بعد فتحة: حركتان', en: 'Small alif after fatha: 2 counts' }
/** About as long as the recited word, which the player waits for anyway (ClipStep.audio). */
export const LISTEN_MS = 2000

/** Step 5: static — the Quran word being recited, over the same full 2-count bar. */
const listenFrame = () => <MaddBar counts={COUNTS} current markers stopped word={getWord(WORD)?.text} label={LISTEN_LABEL} />

/** Get ready, count one, count two (the end marker), stop (see maddCountingSteps), then listen. */
const STEPS: ClipStep[] = [
  ...maddCountingSteps({
    counts: COUNTS,
    bar: { before: SYLLABLE.before, letter: SYLLABLE.letter, label: LABEL },
    readyBarLabel: READY_LABEL,
    ready: {
      ar: 'قل معي: انطق بَا، وعُدّ معها. بُو، بِي بنفس المقدار تمامًا.',
      en: 'Say it with me: pronounce بَا and count along. بُو and بِي take exactly the same time.',
    },
    stop: { ar: 'قف هنا؛ لا تُطِل الحرف أكثر من ذلك.', en: 'Stop here — don’t stretch the letter any further.' },
  }),
  {
    duration: LISTEN_MS,
    label: { ar: 'استمع', en: 'Listen' },
    caption: {
      ar: 'استمع إلى المدّ نفسه في القرآن: الألف الصغيرة بعد الفتحة في الكلمة الثالثة من البسملة، حركتان كما عددت.',
      en: 'Hear the same madd in the Quran: the small alif after a fatha in the third word of the basmala, two counts, just as you counted.',
    },
    audio: { word: WORD },
    render: listenFrame,
  },
]

/**
 * Natural madd (al-madd al-tabi'i): one counting demonstration on بَا — pronounce it and count its
 * 2 movements, marked at the first and the last, then stop (L13, L13b, L13c/#34). بُو and بِي hold
 * the same 2 counts, so they're named once (small) rather than repeated as their own steps. Then
 * al-Husary recites a Quran word with the same madd (T12/#35).
 */
export const naturalMadd: Clip = {
  title: { ar: 'المد الطبيعي: عدّ الحركتين', en: 'Natural madd: counting the two movements' },
  steps: STEPS,
}
