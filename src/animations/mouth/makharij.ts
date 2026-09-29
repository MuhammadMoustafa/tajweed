import type { Bilingual } from '../../i18n/bilingual'
import { LETTER_NAMES, type ArabicLetter } from '../../tajweed/letters'
import type { ContactMarker, MakhrajRegion } from './regions'

/**
 * The seventeen makharij on Ibn al-Jazari's count (al-Muqaddimah al-Jazariyyah, lines 9–19), each
 * with the letters that come from it and where MouthDiagram points for it. The makharij unit's
 * clips (src/animations/MakharijClips.tsx) step through these: one step per makhraj, each of its
 * letters in turn. React-free data; single letters, not Quran text.
 */

/** The five general areas, in the order the unit teaches them (one chapter each). */
export type MakharijArea = 'jawf' | 'halq' | 'lisan' | 'shafatan' | 'khayshum'

export const MAKHARIJ_AREAS: readonly MakharijArea[] = ['jawf', 'halq', 'lisan', 'shafatan', 'khayshum']

/** One letter of a makhraj as a clip shows it. */
export interface MakhrajLetter {
  letter: ArabicLetter
  /** What the frame shows: the bare letter, or a practice syllable where the letter needs its
   *  context (a madd letter after its harakah) or a shaddah (the ghunnah letters). */
  text: string
  name: Bilingual
}

export interface Makhraj {
  area: MakharijArea
  /** Short name of the point: the clip step's timeline label and its frame's heading. */
  name: Bilingual
  /** Where exactly, shown under the stage while the step plays. */
  description: Bilingual
  /** What MouthDiagram lights (and labels) for this point. */
  regions: MakhrajRegion[]
  /** Where exactly the articulators meet, drawn over the lit regions (see ContactMarker). */
  contact: ContactMarker
  /** In the order the step shows them. */
  letters: MakhrajLetter[]
}

const plain = (letter: ArabicLetter): MakhrajLetter => ({ letter, text: letter, name: LETTER_NAMES[letter] })

export const MAKHARIJ: readonly Makhraj[] = [
  {
    area: 'jawf',
    name: { ar: 'الجوف', en: 'The jawf (empty space)' },
    description: {
      ar: 'فراغ الحلق والفم. منه حروف المد الثلاثة، وليس لها موضع محدد ينقطع عنده الصوت: تنتهي بانتهاء الهواء.',
      en: 'The empty space of the throat and mouth. The three madd letters come from it; they have no fixed spot where the sound stops: they end when the breath ends.',
    },
    regions: ['jawf'],
    contact: { kind: 'flow', path: [[201, 296], [201, 176], [190, 154], [150, 153], [100, 153], [66, 167], [24, 169]] },
    letters: [
      { letter: 'ا', text: 'بَا', name: { ar: 'الألف بعد فتح', en: 'Alif, after a fatha' } },
      { letter: 'و', text: 'بُو', name: { ar: 'الواو الساكنة بعد ضم', en: 'Waw sakinah, after a damma' } },
      { letter: 'ي', text: 'بِي', name: { ar: 'الياء الساكنة بعد كسر', en: 'Ya sakinah, after a kasra' } },
    ],
  },
  {
    area: 'halq',
    name: { ar: 'أقصى الحلق', en: 'Deepest part of the throat' },
    description: {
      ar: 'أبعد الحلق عن الفم، مما يلي الصدر.',
      en: 'The part of the throat farthest from the mouth, next to the chest.',
    },
    regions: ['halq-deepest'],
    contact: { kind: 'point', at: [201, 290] },
    letters: [plain('ء'), plain('ه')],
  },
  {
    area: 'halq',
    name: { ar: 'وسط الحلق', en: 'Middle of the throat' },
    description: { ar: 'وسط الحلق، بين أقصاه وأدناه.', en: 'The middle of the throat, between its deepest and nearest parts.' },
    regions: ['halq-middle'],
    contact: { kind: 'point', at: [201, 236] },
    letters: [plain('ع'), plain('ح')],
  },
  {
    area: 'halq',
    name: { ar: 'أدنى الحلق', en: 'Nearest part of the throat' },
    description: { ar: 'أقرب الحلق إلى الفم.', en: 'The part of the throat nearest to the mouth.' },
    regions: ['halq-closest'],
    contact: { kind: 'point', at: [201, 188] },
    letters: [plain('غ'), plain('خ')],
  },
  {
    area: 'lisan',
    name: { ar: 'أقصى اللسان', en: 'Back of the tongue' },
    description: {
      ar: 'أقصى اللسان مما يلي الحلق، مع ما فوقه من الحنك الأعلى.',
      en: 'The back of the tongue, next to the throat, against the palate above it.',
    },
    regions: ['tongue-back', 'palate'],
    contact: { kind: 'point', at: [175, 166] },
    letters: [plain('ق')],
  },
  {
    area: 'lisan',
    name: { ar: 'أقصى اللسان، أسفل قليلًا', en: 'Back of the tongue, a little lower' },
    description: {
      ar: 'أقصى اللسان أيضًا، أسفل من مخرج القاف قليلًا مما يلي الفم، مع ما فوقه من الحنك الأعلى.',
      en: "Also the back of the tongue, a little lower than qaf's point, toward the mouth, against the palate above it.",
    },
    regions: ['tongue-back', 'palate'],
    contact: { kind: 'point', at: [160, 156] },
    letters: [plain('ك')],
  },
  {
    area: 'lisan',
    name: { ar: 'وسط اللسان', en: 'Middle of the tongue' },
    description: {
      ar: 'وسط اللسان مع ما فوقه من وسط الحنك الأعلى. والياء هنا غير المدية.',
      en: 'The middle of the tongue against the middle of the palate above it. The ya here is one that is not a madd letter.',
    },
    regions: ['tongue-middle', 'palate'],
    contact: { kind: 'point', at: [128, 150] },
    letters: [plain('ج'), plain('ش'), { letter: 'ي', text: 'ي', name: { ar: 'الياء غير المدية', en: 'Ya (not a madd letter)' } }],
  },
  {
    area: 'lisan',
    name: { ar: 'حافة اللسان', en: 'Side of the tongue' },
    description: {
      ar: 'إحدى حافتي اللسان أو كلتاهما مع ما يليها من الأضراس العليا، ومن الحافة اليسرى أيسر وأكثر.',
      en: 'One side of the tongue, or both, against the upper molars next to it; the left side is the easier and more common.',
    },
    regions: ['tongue-sides', 'molars-upper'],
    contact: { kind: 'edge', from: [88, 157], to: [122, 155] },
    letters: [plain('ض')],
  },
  {
    area: 'lisan',
    name: { ar: 'حافة اللسان إلى طرفه', en: 'Side of the tongue to its tip' },
    description: {
      ar: 'أدنى حافة اللسان إلى منتهى طرفه، مع ما يحاذيها من لثة الأسنان العليا.',
      en: 'The front of the side of the tongue, up to its very tip, against the gums of the upper teeth.',
    },
    regions: ['tongue-sides', 'tongue-tip', 'gums'],
    contact: { kind: 'edge', from: [66, 154], to: [86, 150] },
    letters: [plain('ل')],
  },
  {
    area: 'lisan',
    name: { ar: 'طرف اللسان', en: 'Tip of the tongue' },
    description: {
      ar: 'طرف اللسان مع لثة الثنايا العليا، تحت مخرج اللام قليلًا.',
      en: "The tip of the tongue against the gums of the upper front teeth, a little below lam's point.",
    },
    regions: ['tongue-tip', 'gums'],
    contact: { kind: 'point', at: [70, 151] },
    letters: [plain('ن')],
  },
  {
    area: 'lisan',
    name: { ar: 'طرف اللسان وظهره', en: 'Tip of the tongue and its top' },
    description: {
      ar: 'قريب من مخرج النون، لكنه أدخل إلى ظهر اللسان قليلًا، مع لثة الثنايا العليا.',
      en: "Close to noon's point, but a little further in, onto the top of the tongue, against the gums of the upper front teeth.",
    },
    regions: ['tongue-tip', 'gums'],
    contact: { kind: 'point', at: [76, 148] },
    letters: [plain('ر')],
  },
  {
    area: 'lisan',
    name: { ar: 'طرف اللسان مع أصول الثنايا العليا', en: 'Tip of the tongue, roots of the upper front teeth' },
    description: {
      ar: 'طرف اللسان مع أصول الثنايا العليا، حيث تلتقي باللثة.',
      en: 'The tip of the tongue against the roots of the upper front teeth, where they meet the gums.',
    },
    regions: ['tongue-tip', 'teeth-upper'],
    contact: { kind: 'point', at: [65, 156] },
    letters: [plain('ط'), plain('د'), plain('ت')],
  },
  {
    area: 'lisan',
    name: { ar: 'طرف اللسان فوق الثنايا السفلى', en: 'Tip of the tongue, above the lower front teeth' },
    description: {
      ar: 'طرف اللسان فوق الثنايا السفلى، مع فُرجة قليلة بينه وبين الثنايا العليا يخرج منها الصفير.',
      en: 'The tip of the tongue just above the lower front teeth, with a small gap under the upper ones for the whistle of these letters.',
    },
    regions: ['tongue-tip', 'teeth-lower'],
    contact: { kind: 'point', at: [64, 171] },
    letters: [plain('ص'), plain('ز'), plain('س')],
  },
  {
    area: 'lisan',
    name: { ar: 'طرف اللسان مع أطراف الثنايا العليا', en: 'Tip of the tongue, edges of the upper front teeth' },
    description: {
      ar: 'طرف اللسان مع أطراف الثنايا العليا.',
      en: 'The tip of the tongue against the edges of the upper front teeth.',
    },
    regions: ['tongue-tip', 'teeth-upper'],
    contact: { kind: 'point', at: [60, 167] },
    letters: [plain('ظ'), plain('ذ'), plain('ث')],
  },
  {
    area: 'shafatan',
    name: { ar: 'بطن الشفة السفلى', en: 'Inside of the lower lip' },
    description: {
      ar: 'بطن الشفة السفلى مع أطراف الثنايا العليا.',
      en: 'The inside of the lower lip against the tips of the upper front teeth.',
    },
    regions: ['lip-lower', 'teeth-upper'],
    contact: { kind: 'point', at: [55, 170] },
    letters: [plain('ف')],
  },
  {
    area: 'shafatan',
    name: { ar: 'بين الشفتين', en: 'Both lips' },
    description: {
      ar: 'بين الشفتين: تنطبقان في الباء والميم، وتنضمّان دون انطباق في الواو غير المدية.',
      en: 'Both lips: they close for ba and meem, and round without closing for a waw that is not a madd letter.',
    },
    regions: ['shafatan'],
    contact: { kind: 'edge', from: [37, 169], to: [56, 169] },
    letters: [plain('ب'), plain('م'), { letter: 'و', text: 'و', name: { ar: 'الواو غير المدية', en: 'Waw (not a madd letter)' } }],
  },
  {
    area: 'khayshum',
    name: { ar: 'الخيشوم', en: 'The khayshum (nose)' },
    description: {
      ar: 'أعلى الأنف من الداخل: منه تخرج الغنة التي تصحب النون والميم، وأظهر ما تكون فيهما مشددتين.',
      en: 'The inner top of the nose: the ghunnah (nasal hum) of noon and meem comes from it, clearest when they carry a shaddah.',
    },
    regions: ['khayshum'],
    contact: { kind: 'point', at: [96, 126] },
    letters: [
      { letter: 'ن', text: 'نّ', name: { ar: 'غنة النون المشددة', en: 'Ghunnah of a noon with shaddah' } },
      { letter: 'م', text: 'مّ', name: { ar: 'غنة الميم المشددة', en: 'Ghunnah of a meem with shaddah' } },
    ],
  },
]

/** The makharij of one area, in teaching order. */
export const makharijOf = (area: MakharijArea): Makhraj[] => MAKHARIJ.filter((m) => m.area === area)

/**
 * A letter's own makhraj, where it is said as a consonant: waw and ya from the lips and the
 * tongue (not the jawf, their madd form), noon and meem from the tongue and lips (not the
 * khayshum, their ghunnah). Alif has only the jawf.
 */
export function makhrajOfLetter(letter: ArabicLetter): Makhraj {
  const holding = MAKHARIJ.filter((m) => m.letters.some((l) => l.letter === letter))
  return holding.find((m) => m.area !== 'jawf' && m.area !== 'khayshum') ?? holding[0]
}
