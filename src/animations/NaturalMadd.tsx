import type { Bilingual } from '../i18n/bilingual'
import { MaddBar, maddFilled, maddStepDuration } from './MaddBar'
import type { Clip, ClipStep } from './player/clip'

const COUNTS = 2

/**
 * The three madd letters, each shown as a real syllable (a single consonant, not Quran text) so
 * the harakah that makes it a madd letter is visible: the harakah/consonant (`before`) in the
 * plain text color, then the madd letter itself (`letter`), which MaddBar highlights and anchors
 * its arrow and bar under.
 */
const SYLLABLES: { before: string; letter: string; label: Bilingual; caption: Bilingual }[] = [
  {
    before: 'بَ',
    letter: 'ا',
    label: { ar: 'ألف بعد فتحة', en: 'Alif after fatha' },
    caption: { ar: 'ألف بعد فتحة: تُمدّ حركتين', en: 'Alif after fatha: 2 counts' },
  },
  {
    before: 'بُ',
    letter: 'و',
    label: { ar: 'واو ساكنة بعد ضمة', en: 'Waw sukun after damma' },
    caption: { ar: 'واو ساكنة بعد ضمة: تُمدّ حركتين', en: 'Waw sukun after damma: 2 counts' },
  },
  {
    before: 'بِ',
    letter: 'ي',
    label: { ar: 'ياء ساكنة بعد كسرة', en: 'Ya sukun after kasra' },
    caption: { ar: 'ياء ساكنة بعد كسرة: تُمدّ حركتين', en: 'Ya sukun after kasra: 2 counts' },
  },
]

/**
 * Frame for one syllable: a single, large MaddBar anchored under its madd letter, filling one
 * count at a time (see `maddFilled`) and holding at `counts` for the step's trailing pause before
 * the next syllable — the clip plays "so fast it didn't point at anything" no longer (L13b).
 */
const frame = ({ before, letter, label }: (typeof SYLLABLES)[number], progress: number) => (
  <MaddBar counts={COUNTS} filled={maddFilled(COUNTS, progress)} current before={before} letter={letter} label={label} />
)

/** Natural madd (al-madd al-tabi'i): the three madd letters, each stretched 2 counts (L13, L13b). */
export const naturalMadd: Clip = {
  title: { ar: 'المد الطبيعي: حروف المد الثلاثة', en: 'Natural madd: the three madd letters' },
  steps: SYLLABLES.map(
    (syllable): ClipStep => ({
      duration: maddStepDuration(COUNTS),
      caption: syllable.caption,
      render: (progress) => frame(syllable, progress),
    }),
  ),
}
