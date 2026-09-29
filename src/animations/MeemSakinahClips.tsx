import type { Bilingual } from '../i18n/bilingual'
import { ALL_RULES, type RuleId } from '../tajweed/rules'
import { MouthDiagram, type MakhrajRegion } from './mouth/MouthDiagram'
import type { Clip, ClipStep } from './player/clip'

// Single letters (not Quran text): a meem with a sukun and the letter after it, drawn apart so each
// can be pointed at. Reading order is right to left, so the meem sits on the right.
const MEEM = 'مْ'
const BA = 'بَ'
const NEXT_MEEM = 'مَ'
const MERGED_MEEM = 'مّ'
const OTHER = 'سَ'
const WAW = 'وَ'

const STEP_MS = 4500
const LIPS: MakhrajRegion[] = ['shafatan']
const LIPS_AND_NOSE: MakhrajRegion[] = ['shafatan', 'khayshum']

interface FrameProps {
  rule: RuleId
  highlight: MakhrajRegion[]
  /** The meem (right) and the letter after it (left); `gap` is how far apart they sit (0 touching, 1 apart). */
  first: string
  second?: string
  gap?: number
  /** Which letter the pointer sits under. */
  point?: 'first' | 'second'
  /** A letter shown faded, while the other one is the subject. */
  dim?: 'first' | 'second'
}

const CX = 250
const ROW_Y = 56

/** A frame: the lips (and nose, for ghunnah) lit on the diagram, and the letter pair pointed at. */
function frame({ rule, highlight, first, second, gap = 1, point, dim }: FrameProps) {
  const color = `var(--tj-${ALL_RULES[rule].color})`
  const half = second ? 26 + 34 * gap : 0
  const x1 = CX + half
  const x2 = CX - half
  const pointer = (x: number) => <path d={`M${x - 9} 104 L${x} 92 L${x + 9} 104 Z`} fill={color} data-pointer />
  const letter = (which: 'first' | 'second', x: number, text: string) => (
    <text
      x={x}
      y={ROW_Y}
      textAnchor="middle"
      dominantBaseline="central"
      className="anim-letter"
      fill={color}
      opacity={dim === which ? 0.3 : 1}
      data-letter={which}
    >
      {text}
    </text>
  )
  return (
    <div className="meem-sakinah-frame">
      <MouthDiagram highlight={highlight} labels={LIPS} />
      <svg viewBox="0 0 500 120" aria-hidden="true" className="anim-svg meem-letters" direction="ltr">
        {letter('first', x1, first)}
        {second && letter('second', x2, second)}
        {point === 'first' && pointer(x1)}
        {point === 'second' && second && pointer(x2)}
      </svg>
    </div>
  )
}

const step = (label: Bilingual, caption: Bilingual, render: ClipStep['render']): ClipStep => ({
  duration: STEP_MS,
  label,
  caption,
  render,
})

const IKHFA = 'ikhafa_shafawi'
const IDGHAM = 'idgham_shafawi'
const IZHAR = 'izhar_shafawi'

/** Ikhfa shafawi: meem sakinah before ba is hidden with a ghunnah, the lips barely touching. */
export const meemIkhfaShafawi: Clip = {
  title: { ar: 'الإخفاء الشفوي', en: 'Labial ikhfa' },
  steps: [
    step(
      { ar: 'ميم ساكنة', en: 'Meem with a sukun' },
      {
        ar: 'هذه ميم ساكنة، والحرف الذي بعدها هو الباء.',
        en: 'This is a meem with a sukun, and the letter right after it is ba.',
      },
      () => frame({ rule: IKHFA, highlight: LIPS, first: MEEM, second: BA, point: 'first' }),
    ),
    step(
      { ar: 'الباء بعدها', en: 'Ba follows' },
      {
        ar: 'إذا جاءت الباء بعد الميم الساكنة فحكمها الإخفاء الشفوي.',
        en: 'When ba comes after a meem with a sukun, the rule is labial ikhfa.',
      },
      () => frame({ rule: IKHFA, highlight: LIPS, first: MEEM, second: BA, point: 'second' }),
    ),
    step(
      { ar: 'أخفِ الميم بغنّة', en: 'Hide the meem with ghunnah' },
      {
        ar: 'أطبق الشفتين برفق دون ضغط، وأخفِ الميم بغنّة من الأنف بمقدار حركتين، ثم انطق الباء.',
        en: 'Close the lips gently, without pressing, and hide the meem in a ghunnah from the nose for about two counts, then say the ba.',
      },
      () => frame({ rule: IKHFA, highlight: LIPS_AND_NOSE, first: MEEM, second: BA, dim: 'first', point: 'second' }),
    ),
  ],
}

/** Idgham shafawi: meem sakinah before a meem folds into it, one meem with shadda and ghunnah. */
export const meemIdghamShafawi: Clip = {
  title: { ar: 'الإدغام الشفوي', en: 'Labial idgham' },
  steps: [
    step(
      { ar: 'ميم ساكنة', en: 'Meem with a sukun' },
      {
        ar: 'هذه ميم ساكنة، وبعدها ميم أخرى متحركة.',
        en: 'This is a meem with a sukun, and after it comes another meem that carries a vowel.',
      },
      () => frame({ rule: IDGHAM, highlight: LIPS, first: MEEM, second: NEXT_MEEM, point: 'first' }),
    ),
    step(
      { ar: 'ميم بعدها', en: 'A meem follows' },
      {
        ar: 'إذا جاءت ميم بعد الميم الساكنة فحكمها الإدغام الشفوي، ويسمى أيضًا إدغام مثلين صغير.',
        en: 'When a meem comes after the meem with a sukun, the rule is labial idgham, also called the small mithlayn idgham.',
      },
      () => frame({ rule: IDGHAM, highlight: LIPS, first: MEEM, second: NEXT_MEEM, point: 'second' }),
    ),
    step(
      { ar: 'الميمان تلتقيان', en: 'The two meems meet' },
      {
        ar: 'تدخل الميم الأولى في الثانية حتى تلتقيا.',
        en: 'The first meem moves into the second until they meet.',
      },
      (p) => frame({ rule: IDGHAM, highlight: LIPS_AND_NOSE, first: MEEM, second: NEXT_MEEM, gap: 1 - p, point: 'second' }),
    ),
    step(
      { ar: 'ميم واحدة مشددة', en: 'One doubled meem' },
      {
        ar: 'تصيران ميمًا واحدة مشددة بغنّة مقدارها حركتان، والشفتان مطبقتان.',
        en: 'They become one doubled meem with a ghunnah of two counts, and the lips are closed.',
      },
      () => frame({ rule: IDGHAM, highlight: LIPS_AND_NOSE, first: MERGED_MEEM }),
    ),
  ],
}

/** Izhar shafawi: meem sakinah before any other letter is said clearly, lips closed then opened, no ghunnah. */
export const meemIzharShafawi: Clip = {
  title: { ar: 'الإظهار الشفوي', en: 'Labial izhar' },
  steps: [
    step(
      { ar: 'ميم ساكنة', en: 'Meem with a sukun' },
      {
        ar: 'هذه ميم ساكنة، وبعدها أي حرف غير الباء والميم.',
        en: 'This is a meem with a sukun, followed by any letter except ba and meem.',
      },
      () => frame({ rule: IZHAR, highlight: LIPS, first: MEEM, second: OTHER, point: 'first' }),
    ),
    step(
      { ar: 'أظهر الميم', en: 'Say the meem clearly' },
      {
        ar: 'أطبق الشفتين وانطق الميم واضحة بلا غنّة زائدة، ثم افتح الشفتين وانطق الحرف التالي.',
        en: 'Close the lips and say the meem clearly, with no extra ghunnah, then open the lips and say the next letter.',
      },
      () => frame({ rule: IZHAR, highlight: LIPS, first: MEEM, second: OTHER, point: 'second' }),
    ),
    step(
      { ar: 'انتبه عند الواو والفاء', en: 'Take care before waw and fa' },
      {
        ar: 'الواو تخرج من الشفتين والفاء من الشفة السفلى مع أطراف الثنايا العليا، فيقرب مخرجهما من الميم، وقد يُخفي القارئ الميم عندهما. أطبق الشفتين وأظهرها كاملة.',
        en: 'Waw comes from the lips and fa from the lower lip with the upper teeth, so both sit close to the meem and a reader may hide it by mistake. Close the lips fully and keep the meem clear.',
      },
      () => frame({ rule: IZHAR, highlight: LIPS, first: MEEM, second: WAW, point: 'first' }),
    ),
  ],
}
