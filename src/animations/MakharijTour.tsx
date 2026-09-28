import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Bilingual } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'
import { MouthDiagram } from './mouth/MouthDiagram'
import { MAKHRAJ_REGION_NAMES, type MakhrajRegion } from './mouth/regions'

// Single letters (not Quran text), in the order the lesson teaches them.
const MADD = 'ا و ي'
const HALQ_DEEPEST = 'ء ه'
const HALQ_MIDDLE = 'ع ح'
const HALQ_CLOSEST = 'غ خ'
const LISAN = 'ق ك ج ش ي ض ل ن ر ط د ت ص س ز ظ ذ ث'
const FA = 'ف'
const BOTH_LIPS = 'ب م و'
const GHUNNAH = 'نّ مّ'

interface Step {
  highlight: MakhrajRegion[]
  title: Bilingual
  letters: string
  note: Bilingual
  /** How long the step stays, in ms (longer for longer letter lists). */
  ms: number
}

const STEPS: Step[] = [
  {
    highlight: ['jawf'],
    title: { ar: 'الجوف', en: 'Al-jawf: the empty space of the mouth and throat' },
    letters: MADD,
    note: {
      ar: 'حروف المد الثلاثة: الألف، والواو الساكنة بعد ضم، والياء الساكنة بعد كسر.',
      en: 'The three madd letters: alif, waw sakinah after a damma, and ya sakinah after a kasra.',
    },
    ms: 3200,
  },
  {
    highlight: ['halq-deepest'],
    title: { ar: 'أقصى الحلق', en: 'Al-halq: the deepest part of the throat' },
    letters: HALQ_DEEPEST,
    note: { ar: 'أبعد الحلق عن الفم.', en: 'The part farthest from the mouth.' },
    ms: 2400,
  },
  {
    highlight: ['halq-middle'],
    title: { ar: 'وسط الحلق', en: 'Al-halq: the middle of the throat' },
    letters: HALQ_MIDDLE,
    note: { ar: 'بين أقصى الحلق وأدناه.', en: 'Between the deepest and the nearest parts.' },
    ms: 2400,
  },
  {
    highlight: ['halq-closest'],
    title: { ar: 'أدنى الحلق', en: 'Al-halq: the nearest part of the throat' },
    letters: HALQ_CLOSEST,
    note: { ar: 'أقرب الحلق إلى الفم.', en: 'The part nearest to the mouth.' },
    ms: 2400,
  },
  {
    highlight: ['lisan'],
    title: { ar: 'اللسان', en: 'Al-lisan: the tongue' },
    letters: LISAN,
    note: {
      ar: 'ثمانية عشر حرفًا، من أقصى اللسان إلى طرفه.',
      en: 'Eighteen letters, from the back of the tongue to its tip.',
    },
    ms: 4200,
  },
  {
    highlight: ['lip-lower', 'teeth-upper'],
    title: { ar: 'الشفتان', en: 'Ash-shafatan: the lips' },
    letters: FA,
    note: {
      ar: 'بطن الشفة السفلى مع أطراف الثنايا العليا.',
      en: 'The inside of the lower lip against the tips of the upper front teeth.',
    },
    ms: 3000,
  },
  {
    highlight: ['shafatan'],
    title: { ar: 'الشفتان', en: 'Ash-shafatan: the lips' },
    letters: BOTH_LIPS,
    note: {
      ar: 'بين الشفتين: تنطبقان في الباء والميم، وتنضمّان دون انطباق في الواو.',
      en: 'Both lips: they close for the ba and the meem, and round without closing for the waw.',
    },
    ms: 3000,
  },
  {
    highlight: ['khayshum'],
    title: { ar: 'الخيشوم', en: 'Al-khayshum: the nose' },
    letters: GHUNNAH,
    note: {
      ar: 'مخرج الغنة في النون والميم.',
      en: 'Where the ghunnah (the nasal hum) of noon and meem comes from.',
    },
    ms: 3000,
  },
]

/** The five main areas, shown as a static list when motion is reduced. */
const AREAS: [MakhrajRegion, string][] = [
  ['jawf', MADD],
  ['halq', `${HALQ_DEEPEST} ${HALQ_MIDDLE} ${HALQ_CLOSEST}`],
  ['lisan', LISAN],
  ['shafatan', `${FA} ${BOTH_LIPS}`],
  ['khayshum', GHUNNAH],
]

/** Tours the five articulation areas on the mouth diagram, lighting each with its letters. */
export function MakharijTour() {
  const { t } = useLocale()
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (reduce) return
    const timer = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEPS[step].ms)
    return () => clearTimeout(timer)
  }, [reduce, step])

  if (reduce) {
    return (
      <div className="makharij-tour">
        <MouthDiagram labels={AREAS.map(([region]) => region)} />
        <ul className="makharij-list">
          {AREAS.map(([region, letters]) => (
            <li key={region}>
              <span>{t(MAKHRAJ_REGION_NAMES[region])}</span>
              <span className="makharij-letters" lang="ar" dir="rtl">
                {letters}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const current = STEPS[step]
  return (
    <div className="makharij-tour" data-step={step}>
      <MouthDiagram highlight={current.highlight} labels={current.highlight} />
      <motion.div
        key={step}
        className="makharij-caption"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <strong>{t(current.title)}</strong>
        <span className="makharij-letters" lang="ar" dir="rtl">
          {current.letters}
        </span>
        <span>{t(current.note)}</span>
      </motion.div>
    </div>
  )
}
