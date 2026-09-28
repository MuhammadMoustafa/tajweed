import type { Bilingual } from '../i18n/bilingual'
import { COUNT_MS, MADD_READY_MS, MADD_STOP_MS, MaddBar, maddBeatFilled } from './MaddBar'
import type { Clip, ClipStep } from './player/clip'

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

// TODO(T12, #35): recitation audio per step goes here — each step below is a natural place to key
// an audio cue off (get ready / count one / count two / stop).

/** Step 1: static — the learner sees the letter and gets ready to pronounce it and count along. */
const readyFrame = () => (
  <MaddBar counts={COUNTS} filled={0} current markers before={SYLLABLE.before} letter={SYLLABLE.letter} label={READY_LABEL} />
)

/** Steps 2-3: the bar fills from `beat - 1` to `beat`, landing MaddBar's pulse on that count. */
const beatFrame = (beat: number, progress: number) => (
  <MaddBar
    counts={COUNTS}
    filled={maddBeatFilled(beat, progress)}
    current
    markers
    before={SYLLABLE.before}
    letter={SYLLABLE.letter}
    label={LABEL}
  />
)

/** Step 4: static — full bar, stopped, so the letter must not be stretched any further. */
const stopFrame = () => (
  <MaddBar counts={COUNTS} filled={COUNTS} current markers stopped before={SYLLABLE.before} letter={SYLLABLE.letter} label={LABEL} />
)

const STEPS: ClipStep[] = [
  {
    duration: MADD_READY_MS,
    label: { ar: 'استعدّ', en: 'Get ready' },
    caption: {
      ar: 'قل معي: انطق بَا، وعُدّ معها. بُو، بِي بنفس المقدار تمامًا.',
      en: 'Say it with me: pronounce بَا and count along. بُو and بِي take exactly the same time.',
    },
    render: readyFrame,
  },
  {
    duration: COUNT_MS,
    label: { ar: 'الحركة ١', en: 'Count 1' },
    caption: { ar: 'الحركة الأولى.', en: 'Count one.' },
    render: (progress) => beatFrame(1, progress),
  },
  {
    duration: COUNT_MS,
    label: { ar: 'الحركة ٢', en: 'Count 2' },
    caption: { ar: 'الحركة الثانية — علامة النهاية.', en: 'Count two — the end marker.' },
    render: (progress) => beatFrame(2, progress),
  },
  {
    duration: MADD_STOP_MS,
    label: { ar: 'قف', en: 'Stop' },
    caption: { ar: 'قف هنا؛ لا تُطِل الحرف أكثر من ذلك.', en: 'Stop here — don’t stretch the letter any further.' },
    render: stopFrame,
  },
]

/**
 * Natural madd (al-madd al-tabi'i): one counting demonstration on بَا — pronounce it and count its
 * 2 movements, marked at the first and the last, then stop (L13, L13b, L13c/#34). بُو and بِي hold
 * the same 2 counts, so they're named once (small) rather than repeated as their own steps.
 */
export const naturalMadd: Clip = {
  title: { ar: 'المد الطبيعي: عدّ الحركتين', en: 'Natural madd: counting the two movements' },
  steps: STEPS,
}
