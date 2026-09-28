import type { Bilingual } from '../i18n/bilingual'
import { Localized } from '../i18n/LocaleProvider'
import { MouthDiagram } from './mouth/MouthDiagram'
import type { MakhrajRegion } from './mouth/regions'
import type { Clip, ClipStep } from './player/clip'

// Single letters (not Quran text), in the order each area's lesson section teaches them. The madd
// letters are shown in the same practice syllables as the natural-madd lesson (بَا بُو بِي), so the
// harakah before each is visible on a real letter.
const MADD_A = 'بَا'
const MADD_U = 'بُو'
const MADD_I = 'بِي'
const HALQ_DEEPEST = 'ء ه'
const HALQ_MIDDLE = 'ع ح'
const HALQ_CLOSEST = 'غ خ'
const FA = 'ف'
const BOTH_LIPS = 'ب م و'
const GHUNNAH = 'نّ مّ'

interface Step {
  /** Region(s) the mouth diagram lights for this step; the same list is used for its labels. */
  highlight: MakhrajRegion[]
  /** Bold heading shown on the frame itself, naming the area or sub-point. */
  areaTitle: Bilingual
  letters: string
  /** Shown by AnimationPlayer under the stage while this step is current. */
  note: Bilingual
  /** How long the step stays, in ms (at least 2.5 s, longer for longer letter lists). */
  ms: number
}

/** A step's frame: the lit area on the diagram, with its name and letters. */
const frame = (step: Step) => (
  <div className="makharij-tour">
    <MouthDiagram highlight={step.highlight} labels={step.highlight} />
    <div className="makharij-caption">
      <strong>
        <Localized text={step.areaTitle} />
      </strong>
      <span className="makharij-letters" lang="ar" dir="rtl">
        {step.letters}
      </span>
    </div>
  </div>
)

const clipFrom = (title: Bilingual, steps: readonly Step[]): Clip => ({
  title,
  steps: steps.map((step): ClipStep => ({ duration: step.ms, caption: step.note, render: () => frame(step) })),
})

const JAWF_STEPS: Step[] = [
  {
    highlight: ['jawf'],
    areaTitle: { ar: 'الجوف', en: 'Al-jawf: the empty space of the mouth and throat' },
    letters: MADD_A,
    note: {
      ar: 'الألف الساكنة المفتوح ما قبلها. حرف مد لا موضع محقق له، ينتهي بانتهاء الهواء في الجوف.',
      en: 'Alif sakinah, after a fatha. A madd letter with no fixed spot; it ends when the breath in the jawf ends.',
    },
    ms: 3000,
  },
  {
    highlight: ['jawf'],
    areaTitle: { ar: 'الجوف', en: 'Al-jawf: the empty space of the mouth and throat' },
    letters: MADD_U,
    note: {
      ar: 'الواو الساكنة المضموم ما قبلها.',
      en: 'Waw sakinah, after a damma.',
    },
    ms: 3000,
  },
  {
    highlight: ['jawf'],
    areaTitle: { ar: 'الجوف', en: 'Al-jawf: the empty space of the mouth and throat' },
    letters: MADD_I,
    note: {
      ar: 'الياء الساكنة المكسور ما قبلها. الحروف الثلاثة كلها تخرج من فراغ الجوف نفسه.',
      en: 'Ya sakinah, after a kasra. All three letters come from the same open space of the jawf.',
    },
    ms: 3000,
  },
]

const HALQ_STEPS: Step[] = [
  {
    highlight: ['halq-deepest'],
    areaTitle: { ar: 'أقصى الحلق', en: 'Al-halq: the deepest part of the throat' },
    letters: HALQ_DEEPEST,
    note: { ar: 'أبعد الحلق عن الفم.', en: 'The part of the throat farthest from the mouth.' },
    ms: 2600,
  },
  {
    highlight: ['halq-middle'],
    areaTitle: { ar: 'وسط الحلق', en: 'Al-halq: the middle of the throat' },
    letters: HALQ_MIDDLE,
    note: { ar: 'بين أقصى الحلق وأدناه.', en: 'Between the deepest and the nearest parts of the throat.' },
    ms: 2600,
  },
  {
    highlight: ['halq-closest'],
    areaTitle: { ar: 'أدنى الحلق', en: 'Al-halq: the nearest part of the throat' },
    letters: HALQ_CLOSEST,
    note: { ar: 'أقرب الحلق إلى الفم.', en: 'The part of the throat nearest to the mouth.' },
    ms: 2600,
  },
]

const LISAN_STEPS: Step[] = [
  {
    highlight: ['tongue-back', 'palate'],
    areaTitle: { ar: 'أقصى اللسان (الأبعد)', en: 'Al-lisan: the very back of the tongue' },
    letters: 'ق',
    note: {
      ar: 'من أقصى اللسان مما يلي الحلق، مع ما يحاذيه من الحنك الأعلى.',
      en: 'From the very back of the tongue, next to the throat, against the soft palate above it.',
    },
    ms: 2600,
  },
  {
    highlight: ['tongue-back', 'palate'],
    areaTitle: { ar: 'أقصى اللسان (أسفل قليلًا)', en: 'Al-lisan: the back of the tongue, a little forward' },
    letters: 'ك',
    note: {
      ar: 'من أقصى اللسان أيضًا، لكن أسفل مخرج القاف قليلًا، مما يلي الفم.',
      en: 'Also from the back of the tongue, but a little lower than qaf, closer to the mouth.',
    },
    ms: 2600,
  },
  {
    highlight: ['tongue-middle', 'palate'],
    areaTitle: { ar: 'وسط اللسان', en: 'Al-lisan: the middle of the tongue' },
    letters: 'ج ش ي',
    note: {
      ar: 'من وسط اللسان مع ما يحاذيه من الحنك الأعلى؛ والياء هنا غير المدية.',
      en: 'From the middle of the tongue against the middle of the palate above it (a ya that is not a madd letter).',
    },
    ms: 3000,
  },
  {
    highlight: ['tongue-sides', 'teeth-upper'],
    areaTitle: { ar: 'حافة اللسان', en: 'Al-lisan: the side of the tongue' },
    letters: 'ض',
    note: {
      ar: 'من حافة اللسان (إحدى الحافتين أو كلتيهما) مع ما يليها من الأضراس العليا.',
      en: 'From the side of the tongue (one side, or both) against the upper molars next to it.',
    },
    ms: 2600,
  },
  {
    highlight: ['tongue-sides', 'tongue-tip'],
    areaTitle: { ar: 'حافة اللسان إلى طرفه', en: 'Al-lisan: the side of the tongue up to its tip' },
    letters: 'ل',
    note: {
      ar: 'من حافة اللسان، من أولها إلى طرفها، مع ما يحاذيها من الحنك الأعلى (اللثة).',
      en: "From the tongue's edge, from where dad is made up to the tip, against the gum ridge above it.",
    },
    ms: 2600,
  },
  {
    highlight: ['tongue-tip'],
    areaTitle: { ar: 'طرف اللسان', en: 'Al-lisan: the tip of the tongue' },
    letters: 'ن ر',
    note: {
      ar: 'من طرف اللسان مع اللثة (النون أقرب إلى ظهر اللسان قليلًا، والراء أدخل قليلًا وأقرب لمخرج اللام).',
      en: 'From the tip of the tongue against the gum ridge (noon a touch further back, ra a touch deeper, close to lam).',
    },
    ms: 2800,
  },
  {
    highlight: ['tongue-tip', 'teeth-upper'],
    areaTitle: { ar: 'طرف اللسان مع أصول الثنايا', en: 'Al-lisan: the tip of the tongue at the base of the front teeth' },
    letters: 'ط د ت',
    note: {
      ar: 'من طرف اللسان مع أصول الثنايا العليا.',
      en: 'From the tip of the tongue against the base of the upper front teeth.',
    },
    ms: 2800,
  },
  {
    highlight: ['tongue-tip', 'teeth-upper'],
    areaTitle: { ar: 'طرف اللسان بين الثنايا', en: 'Al-lisan: the tip of the tongue, close to both rows of front teeth' },
    letters: 'ص ز س',
    note: {
      ar: 'من طرف اللسان بينه وبين الثنايا العليا والسفلى، مع فُرجة يصفر منها الصوت.',
      en: 'From the tip of the tongue, close to both the upper and lower front teeth, with a whistling gap for the air.',
    },
    ms: 2800,
  },
  {
    highlight: ['tongue-tip', 'teeth-upper'],
    areaTitle: { ar: 'طرف اللسان بين طرفي الثنايا', en: 'Al-lisan: the tip of the tongue between both rows of front teeth' },
    letters: 'ظ ذ ث',
    note: {
      ar: 'من طرف اللسان بين طرفي الثنايا العليا والسفلى.',
      en: 'From the tip of the tongue between the edges of the upper and lower front teeth.',
    },
    ms: 2800,
  },
]

const SHAFATAN_STEPS: Step[] = [
  {
    highlight: ['lip-lower', 'teeth-upper'],
    areaTitle: { ar: 'الشفتان', en: 'Ash-shafatan: the lips' },
    letters: FA,
    note: {
      ar: 'بطن الشفة السفلى مع أطراف الثنايا العليا.',
      en: 'The inside of the lower lip against the tips of the upper front teeth.',
    },
    ms: 3000,
  },
  {
    highlight: ['shafatan'],
    areaTitle: { ar: 'الشفتان', en: 'Ash-shafatan: the lips' },
    letters: BOTH_LIPS,
    note: {
      ar: 'بين الشفتين: تنطبقان في الباء والميم، وتنضمّان دون انطباق في الواو.',
      en: 'Both lips: they close for the ba and the meem, and round without closing for the waw.',
    },
    ms: 3000,
  },
]

const KHAYSHUM_STEPS: Step[] = [
  {
    highlight: ['khayshum'],
    areaTitle: { ar: 'الخيشوم', en: 'Al-khayshum: the nose' },
    letters: GHUNNAH,
    note: {
      ar: 'مخرج الغنة في النون والميم المشددتين.',
      en: 'Where the ghunnah (the nasal hum) of a shaddah-carrying noon or meem comes from.',
    },
    ms: 3000,
  },
]

/** Al-jawf (L2): the three madd letters, each shown with its harakah, lighting the whole cavity. */
export const makharijJawf: Clip = clipFrom({ ar: 'الجوف', en: 'Al-jawf' }, JAWF_STEPS)

/** Al-halq (L2): deepest → middle → nearest, lighting each part in turn. */
export const makharijHalq: Clip = clipFrom({ ar: 'الحلق', en: 'Al-halq' }, HALQ_STEPS)

/** Al-lisan (L2): steps through the tongue's ten points, back to tip. */
export const makharijLisan: Clip = clipFrom({ ar: 'اللسان', en: 'Al-lisan' }, LISAN_STEPS)

/** Ash-shafatan (L2): fa first, then the letters made with both lips. */
export const makharijShafatan: Clip = clipFrom({ ar: 'الشفتان', en: 'Ash-shafatan' }, SHAFATAN_STEPS)

/** Al-khayshum (L2): the ghunnah on a shaddah-carrying noon or meem. */
export const makharijKhayshum: Clip = clipFrom({ ar: 'الخيشوم', en: 'Al-khayshum' }, KHAYSHUM_STEPS)
