import type { Bilingual } from '../i18n/bilingual'
import { COUNT_MS, MADD_READY_MS, MADD_STOP_MS, MaddBar, maddBeatFilled } from './MaddBar'
import type { Clip, ClipStep } from './player/clip'

/** Hafs 'an 'Asim via the Shatibiyyah lengthens both muttasil and munfasil 4 or 5 counts; these
 * clips settle on 4 and say so, per the maintainer's "counts 4 (mention 5)" (#20). */
const COUNTS = 4

// Practice syllables (not Quran text): a single consonant + harakah, the madd letter, and the
// hamza that causes the madd — muttasil keeps it in the same invented word, munfasil puts it at
// the start of a second one, both anchored on the same letter as natural-madd's بَا (L13c).
const MUTTASIL_SYLLABLE = { before: 'بَ', letter: 'ا', after: 'ءَ' }
const MUNFASIL_SYLLABLE = { before: 'بَ', letter: 'ا', after: 'أَ' }

const MUTTASIL_READY: Bilingual = {
  ar: 'قل معي: بَاءَ، وعُدّ أربع حركات. الهمزة جاءت بعد حرف المدّ في نفس الكلمة، فوجب المدّ.',
  en: 'Say it with me: pronounce بَاءَ and count four. The hamza comes right after the madd letter, in the same word, so the madd is obligatory.',
}
const MUTTASIL_LABEL: Bilingual = {
  ar: 'همزة بعد حرف المدّ، في كلمة واحدة: مدّ واجب متصل',
  en: 'Hamza right after the madd letter, same word: madd wajib muttasil',
}
const MUNFASIL_READY: Bilingual = {
  ar: 'قل معي: بَا ثم أَ، وعُدّ أربع حركات. حرف المدّ آخر كلمة، والهمزة أول الكلمة التالية.',
  en: 'Say it with me: بَا, then أَ, and count four. The madd letter ends one word, and the hamza starts the next.',
}
const MUNFASIL_LABEL: Bilingual = {
  ar: 'حرف المدّ آخر كلمة، والهمزة أول التالية: مدّ جائز منفصل',
  en: 'Madd letter ends one word, hamza starts the next: madd jaiz munfasil',
}
// TODO(T12, #35): recitation audio per step goes here, as in NaturalMadd.tsx.

interface Kind {
  syllable: { before: string; letter: string; after: string }
  /** Draws the hamza with a visible gap from the letter (munfasil: a new word starts there). */
  afterGap: boolean
  ready: Bilingual
  label: Bilingual
}

const MUTTASIL: Kind = { syllable: MUTTASIL_SYLLABLE, afterGap: false, ready: MUTTASIL_READY, label: MUTTASIL_LABEL }
const MUNFASIL: Kind = { syllable: MUNFASIL_SYLLABLE, afterGap: true, ready: MUNFASIL_READY, label: MUNFASIL_LABEL }

const readyFrame = (kind: Kind) => () =>
  (
    <MaddBar
      counts={COUNTS}
      filled={0}
      current
      markers
      token="madd-obligatory"
      before={kind.syllable.before}
      letter={kind.syllable.letter}
      after={kind.syllable.after}
      afterGap={kind.afterGap}
      label={kind.ready}
    />
  )

const beatFrame = (kind: Kind) => (beat: number, progress: number) => (
  <MaddBar
    counts={COUNTS}
    filled={maddBeatFilled(beat, progress)}
    current
    markers
    token="madd-obligatory"
    before={kind.syllable.before}
    letter={kind.syllable.letter}
    after={kind.syllable.after}
    afterGap={kind.afterGap}
    label={kind.label}
  />
)

const stopFrame = (kind: Kind) => () =>
  (
    <MaddBar
      counts={COUNTS}
      filled={COUNTS}
      current
      markers
      stopped
      token="madd-obligatory"
      before={kind.syllable.before}
      letter={kind.syllable.letter}
      after={kind.syllable.after}
      afterGap={kind.afterGap}
      label={kind.label}
    />
  )

const COUNT_LABELS: Bilingual[] = [
  { ar: 'الحركة ١', en: 'Count 1' },
  { ar: 'الحركة ٢', en: 'Count 2' },
  { ar: 'الحركة ٣', en: 'Count 3' },
  { ar: 'الحركة ٤', en: 'Count 4' },
]

const stepsFor = (kind: Kind): ClipStep[] => [
  {
    duration: MADD_READY_MS,
    label: { ar: 'استعدّ', en: 'Get ready' },
    caption: kind.ready,
    render: readyFrame(kind),
  },
  ...[1, 2, 3, 4].map(
    (beat): ClipStep => ({
      duration: COUNT_MS,
      label: COUNT_LABELS[beat - 1],
      caption:
        beat < 4
          ? { ar: `الحركة رقم ${beat}.`, en: `Count ${beat}.` }
          : {
              ar: 'الحركة الرابعة — علامة النهاية. (يجوز خمس حركات عند بعضهم؛ التزم عددًا واحدًا طوال القراءة.)',
              en: 'Count four — the end marker. (Some count five instead; keep one length throughout your recitation.)',
            },
      render: (progress) => beatFrame(kind)(beat, progress),
    }),
  ),
  {
    duration: MADD_STOP_MS,
    label: { ar: 'قف', en: 'Stop' },
    caption: { ar: 'قف هنا؛ لا تُطِل الحرف أكثر من ذلك.', en: 'Stop here — don’t stretch the letter any further.' },
    render: stopFrame(kind),
  },
]

/**
 * Madd wajib muttasil (L14): the hamza follows the madd letter in the same word, so the madd is
 * obligatory — counted 4 movements here (mentioning 5, since Hafs from the Shatibiyyah allows
 * either, as long as one length is kept throughout a recitation).
 */
export const maddMuttasil: Clip = {
  title: { ar: 'المد الواجب المتصل: عدّ أربع حركات', en: 'Madd wajib muttasil: counting four movements' },
  steps: stepsFor(MUTTASIL),
}

/**
 * Madd jaiz munfasil (L14): the madd letter ends a word and the hamza starts the next, so the
 * madd is permissible — also 4 movements here (mentioning 5), the same length as muttasil so a
 * reciter keeps one consistent count for both.
 */
export const maddMunfasil: Clip = {
  title: { ar: 'المد الجائز المنفصل: عدّ أربع حركات', en: 'Madd jaiz munfasil: counting four movements' },
  steps: stepsFor(MUNFASIL),
}
