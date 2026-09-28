import type { Bilingual } from '../i18n/bilingual'
import { MaddBar } from './MaddBar'
import type { Clip, ClipStep } from './player/clip'

/** The three madd letters, each preceded by its matching harakah, stretching to 2 counts. */
const LETTERS: { letter: string; label: Bilingual; caption: Bilingual }[] = [
  {
    letter: 'ـَا',
    label: { ar: 'ألف بعد فتحة', en: 'Alif after fatha' },
    caption: { ar: 'الألف بعد الفتحة تُمدّ حركتين', en: 'An alif after a fatha is stretched for two counts' },
  },
  {
    letter: 'ـُو',
    label: { ar: 'واو ساكنة بعد ضمة', en: 'Waw sukun after damma' },
    caption: {
      ar: 'الواو الساكنة بعد الضمة تُمدّ حركتين',
      en: 'A waw with a sukun after a damma is stretched for two counts',
    },
  },
  {
    letter: 'ـِي',
    label: { ar: 'ياء ساكنة بعد كسرة', en: 'Ya sukun after kasra' },
    caption: {
      ar: 'الياء الساكنة بعد الكسرة تُمدّ حركتين',
      en: 'A ya with a sukun after a kasra is stretched for two counts',
    },
  },
]

const COUNTS = 2
/** One count lasts about a second at 1×. */
const COUNT_MS = 1000

/** Frame for letter `current`: its bar fills over the step; earlier bars stay full, later ones empty. */
const frame = (current: number, progress: number) => (
  <div className="madd-row">
    {LETTERS.map(({ letter, label }, i) => (
      <MaddBar
        key={letter}
        counts={COUNTS}
        filled={i < current ? COUNTS : i === current ? progress * COUNTS : 0}
        current={i === current}
        letter={letter}
        label={label}
      />
    ))}
  </div>
)

/** Natural madd (al-madd al-tabi'i): the three madd letters, each stretched 2 counts (L13). */
export const naturalMadd: Clip = {
  title: { ar: 'المد الطبيعي: حروف المد الثلاثة', en: 'Natural madd: the three madd letters' },
  steps: LETTERS.map(
    ({ caption }, i): ClipStep => ({ duration: COUNTS * COUNT_MS, caption, render: (progress) => frame(i, progress) }),
  ),
}
