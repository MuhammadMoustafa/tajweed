import type { Bilingual } from '../i18n/bilingual'
import { COUNT_MS, MADD_READY_MS, MADD_STOP_MS, MaddBar, maddBeatFilled } from './MaddBar'
import type { Clip, ClipStep } from './player/clip'

const COUNTS = 6

/**
 * The syllable shown throughout the counting demo (a single consonant + harakah + a shaddah
 * consonant after it, not Quran text): `before` (بَ) plain, `letter` (ا) colored, and `after` (جّ,
 * a shaddah) plain — so the six counts are shown on the most common kind, kalimi muthaqqal
 * (the shaddah is the necessary madd's cause; see maddLazimCause for the other three kinds).
 */
const SYLLABLE = { before: 'بَ', letter: 'ا', after: 'جّ' }

const READY_LABEL: Bilingual = {
  ar: 'ألف بعدها حرف مشدَّد: ست حركات، بدل حركتَي المدّ الطبيعي.',
  en: 'Alif followed by a shaddah letter: six counts, instead of natural madd\'s two.',
}
const LABEL: Bilingual = { ar: 'مدّ لازم: ست حركات', en: 'Necessary madd: six counts' }

/** Step 1: static — the learner sees the letter and its cause, and gets ready to count along. */
const readyFrame = () => (
  <MaddBar
    counts={COUNTS}
    filled={0}
    current
    markers
    before={SYLLABLE.before}
    letter={SYLLABLE.letter}
    after={SYLLABLE.after}
    label={READY_LABEL}
  />
)

/** Steps 2-7: the bar fills from `beat - 1` to `beat`, landing MaddBar's pulse on that count. */
const beatFrame = (beat: number, progress: number) => (
  <MaddBar
    counts={COUNTS}
    filled={maddBeatFilled(beat, progress)}
    current
    markers
    before={SYLLABLE.before}
    letter={SYLLABLE.letter}
    after={SYLLABLE.after}
    label={LABEL}
  />
)

/** Step 8: static — full bar, stopped, so the letter must not be stretched any further. */
const stopFrame = () => (
  <MaddBar
    counts={COUNTS}
    filled={COUNTS}
    current
    markers
    stopped
    before={SYLLABLE.before}
    letter={SYLLABLE.letter}
    after={SYLLABLE.after}
    label={LABEL}
  />
)

const COUNT_LABELS: Bilingual[] = [
  { ar: 'الحركة ١', en: 'Count 1' },
  { ar: 'الحركة ٢', en: 'Count 2' },
  { ar: 'الحركة ٣', en: 'Count 3' },
  { ar: 'الحركة ٤', en: 'Count 4' },
  { ar: 'الحركة ٥', en: 'Count 5' },
  { ar: 'الحركة ٦ (نهاية المدّ)', en: 'Count 6 (the end of the madd)' },
]

const STEPS: ClipStep[] = [
  {
    duration: MADD_READY_MS,
    label: { ar: 'استعدّ', en: 'Get ready' },
    caption: {
      ar: 'قل معي: انطق بَاجّ، وعُدّ ست حركات قبل أن تنتقل إلى الحرف المشدَّد.',
      en: 'Say it with me: pronounce بَاجّ and count six movements before moving on to the shaddah letter.',
    },
    render: readyFrame,
  },
  ...COUNT_LABELS.map(
    (label, i): ClipStep => ({
      duration: COUNT_MS,
      label,
      caption: { ar: `الحركة رقم ${i + 1}.`, en: `Count number ${i + 1}.` },
      render: (progress) => beatFrame(i + 1, progress),
    }),
  ),
  {
    duration: MADD_STOP_MS,
    label: { ar: 'قف', en: 'Stop' },
    caption: { ar: 'قف هنا عند الحرف المشدَّد؛ لا تُطِل حرف المدّ أكثر من ست حركات.', en: 'Stop here at the shaddah letter — don’t stretch the madd letter past six counts.' },
    render: stopFrame,
  },
]

/**
 * Necessary madd (al-madd al-lazim): one counting demonstration on بَاجّ — pronounce the madd
 * letter and count its 6 movements, marked at the first and the last, then stop at the shaddah
 * that caused it (L15/#21), reusing MaddBar/COUNT_MS exactly like L13c's natural-madd demo.
 */
export const maddLazimBar: Clip = {
  title: { ar: 'المدّ اللازم: عدّ الحركات الست', en: 'Necessary madd: counting the six movements' },
  steps: STEPS,
}

// --- The cause clip: what makes a madd "necessary" — muthaqqal vs mukhaffaf, kalimi vs harfi ---

const causeFrame = (after: string, label: Bilingual) => (
  <MaddBar counts={COUNTS} filled={COUNTS} current markers stopped before={SYLLABLE.before} letter={SYLLABLE.letter} after={after} label={label} />
)

const CAUSE_STEPS: ClipStep[] = [
  {
    duration: 2200,
    label: { ar: 'السبب', en: 'The cause' },
    caption: {
      ar: 'المدّ يصير لازمًا إذا جاء بعد حرف المدّ سكون أصلي ثابت لا يزول وصلًا ولا وقفًا — لا همزة، ولا سكون عارض بسبب الوقف فقط.',
      en: 'A madd becomes necessary when a permanent sukun — one that never goes away, whether you stop or continue — follows the madd letter. Not a hamza, and not a sukun that only appears from stopping.',
    },
    render: () => causeFrame('جّ', { ar: 'سكون أصلي ثابت', en: 'A permanent, unchanging sukun' }),
  },
  {
    duration: 2600,
    label: { ar: 'مثقَّل', en: 'Muthaqqal' },
    caption: {
      ar: 'مثقَّل: الحرف الساكن بعد حرف المدّ مشدَّد (حرفان، أولهما أُدغم في الثاني)، فيثقل النطق به.',
      en: 'Muthaqqal: the sakin letter after the madd letter carries a shaddah (two letters, the first merged into the second) — "heavier" to pronounce.',
    },
    render: () => causeFrame('جّ', { ar: 'مثقَّل: حرف مشدَّد بعد المدّ', en: 'Muthaqqal: a shaddah letter after the madd' }),
  },
  {
    duration: 2600,
    label: { ar: 'مخفَّف', en: 'Mukhaffaf' },
    caption: {
      ar: 'مخفَّف: الحرف الساكن بعد حرف المدّ ساكن سكونًا عاديًا، من غير إدغام.',
      en: 'Mukhaffaf: the sakin letter after the madd letter is just plain — no merging.',
    },
    render: () => causeFrame('جْ', { ar: 'مخفَّف: سكون عادي بعد المدّ', en: 'Mukhaffaf: a plain sukun after the madd' }),
  },
]

/**
 * What causes a madd to be "necessary": a permanent sukun after the madd letter, either shaddah
 * (muthaqqal) or plain (mukhaffaf) — the axis the lesson's kinds section relies on (L15/#21). Not
 * a counting demo (no beats to land on), so it holds each frame long enough to read without
 * `markers`' pulse; `stopped` keeps the bar static throughout.
 */
export const maddLazimCause: Clip = {
  title: { ar: 'ما الذي يجعل المدّ لازمًا؟', en: 'What makes a madd necessary?' },
  steps: CAUSE_STEPS,
}
