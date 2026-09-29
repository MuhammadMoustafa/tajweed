import type { Bilingual } from '../../i18n/bilingual'
import { LETTER_NAMES, type ArabicLetter } from '../../tajweed/letters'
import type { MakhrajRegion } from './regions'

/**
 * Sifat al-huruf, the letters' qualities, on Ibn al-Jazari's count (al-Muqaddimah al-Jazariyyah,
 * lines 20–26): five groups of opposite qualities, of which every letter has exactly one each
 * (shiddah and rakhawah with tawassut between them), and seven single qualities only some letters
 * have. `LETTER_SIFAT` is the letter → qualities table; each quality's `mnemonic` (the classical
 * phrase gathering its letters) is checked against it in sifat.test.ts. The sifat lesson's clips
 * (src/animations/SifatClips.tsx) step through these. React-free data; single letters and
 * mnemonic phrases, not Quran text.
 */

export type SifahId =
  | 'hams'
  | 'jahr'
  | 'shiddah'
  | 'tawassut'
  | 'rakhawah'
  | 'istila'
  | 'istifal'
  | 'itbaq'
  | 'infitah'
  | 'idhlaq'
  | 'ismat'
  | 'safir'
  | 'qalqalah'
  | 'lin'
  | 'inhiraf'
  | 'takrir'
  | 'tafashshi'
  | 'istitalah'

/** The five groups of opposites, in the lesson's order; every letter has exactly one quality of each. */
export const OPPOSITE_SIFAT: readonly (readonly SifahId[])[] = [
  ['hams', 'jahr'],
  ['shiddah', 'tawassut', 'rakhawah'],
  ['istila', 'istifal'],
  ['itbaq', 'infitah'],
  ['idhlaq', 'ismat'],
]

/** The seven qualities with no opposite, in the order al-Jazariyyah names them. */
export const SINGLE_SIFAT: readonly SifahId[] = ['safir', 'qalqalah', 'lin', 'inhiraf', 'takrir', 'tafashshi', 'istitalah']

export interface Sifah {
  /** Short name: a clip step's timeline label and its frame's heading. */
  name: Bilingual
  /** What it is and how it sounds, shown under the stage while the step plays. */
  meaning: Bilingual
  /**
   * The phrase that gathers its letters, when it has one (vowelled; `أ` stands for the hamzah).
   * A quality with many letters (the other side of a pair) is taught as "the rest" instead.
   */
  mnemonic?: string
  /** What MouthDiagram lights for the quality itself; without it, each letter's own makhraj. */
  regions?: MakhrajRegion[]
}

export const SIFAT: Record<SifahId, Sifah> = {
  hams: {
    name: { ar: 'الهمس', en: 'Hams (whisper)' },
    meaning: {
      ar: 'جريان النَّفَس مع الحرف لضعف اعتماده على مخرجه، فيُسمع معه هواء خفيف. حروفه عشرة: «فَحَثَّهُ شَخْصٌ سَكَتْ».',
      en: 'The breath keeps flowing with the letter, because it presses only lightly on its makhraj, so a little air is heard with it. Its ten letters are gathered in the phrase "faḥaththahu shakhṣun sakat".',
    },
    mnemonic: 'فَحَثَّهُ شَخْصٌ سَكَتْ',
  },
  jahr: {
    name: { ar: 'الجهر', en: 'Jahr (voiced)' },
    meaning: {
      ar: 'انحباس النَّفَس مع الحرف لقوة اعتماده على مخرجه، فيخرج الصوت قويًّا واضحًا. حروفه التسعة عشر الباقية.',
      en: 'The breath is held back with the letter, because it presses firmly on its makhraj, so the voice comes out strong and clear. It has the other nineteen letters.',
    },
  },
  shiddah: {
    name: { ar: 'الشدة', en: 'Shiddah (strength)' },
    meaning: {
      ar: 'انحباس الصوت عند مخرج الحرف إذا سكن، فلا يجري معه. حروفها ثمانية: «أَجِدْ قَطٍ بَكَتْ».',
      en: 'The sound stops at the letter’s makhraj when it has a sukun and does not flow on. Its eight letters are gathered in the phrase "ajid qaṭin bakat".',
    },
    mnemonic: 'أَجِدْ قَطٍ بَكَتْ',
  },
  tawassut: {
    name: { ar: 'التوسط', en: 'Tawassut (in between)' },
    meaning: {
      ar: 'بين الشدة والرخاوة: لا ينحبس الصوت كله ولا يجري كله. حروفه خمسة: «لِنْ عُمَرْ».',
      en: 'Between shiddah and rakhawah: the sound neither stops completely nor flows completely. Its five letters are gathered in the phrase "lin ʿumar".',
    },
    mnemonic: 'لِنْ عُمَرْ',
  },
  rakhawah: {
    name: { ar: 'الرخاوة', en: 'Rakhawah (softness)' },
    meaning: {
      ar: 'جريان الصوت مع الحرف إذا سكن، فيمكن مدّه. حروفها الستة عشر الباقية.',
      en: 'The sound keeps flowing with the letter when it has a sukun, so it can be drawn out. It has the other sixteen letters.',
    },
  },
  istila: {
    name: { ar: 'الاستعلاء', en: 'Istiʿla (raising)' },
    meaning: {
      ar: 'ارتفاع أقصى اللسان إلى الحنك الأعلى عند النطق بالحرف، فيخرج مفخَّمًا ممتلئًا. حروفه سبعة: «خُصَّ ضَغْطٍ قِظْ».',
      en: 'The back of the tongue rises toward the palate as the letter is said, so it comes out heavy and full. Its seven letters are gathered in the phrase "khuṣṣa ḍaghṭin qiẓ".',
    },
    mnemonic: 'خُصَّ ضَغْطٍ قِظْ',
    regions: ['tongue-back', 'palate'],
  },
  istifal: {
    name: { ar: 'الاستفال', en: 'Istifal (lowering)' },
    meaning: {
      ar: 'انخفاض أقصى اللسان عن الحنك عند النطق بالحرف، فيخرج مرقَّقًا. حروفه الاثنان والعشرون الباقية.',
      en: 'The back of the tongue stays low, away from the palate, as the letter is said, so it comes out light. It has the other twenty-two letters.',
    },
    regions: ['tongue-back'],
  },
  itbaq: {
    name: { ar: 'الإطباق', en: 'Itbaq (sealing)' },
    meaning: {
      ar: 'انطباق اللسان على الحنك الأعلى وانحصار الصوت بينهما، فتكون أقوى الحروف تفخيمًا. حروفه أربعة: ص ض ط ظ.',
      en: 'The tongue presses up against the palate and the sound is enclosed between them. Its four letters, ص ض ط ظ, are the heaviest of all.',
    },
    mnemonic: 'ص ض ط ظ',
    regions: ['lisan', 'palate'],
  },
  infitah: {
    name: { ar: 'الانفتاح', en: 'Infitah (opening)' },
    meaning: {
      ar: 'انفتاح ما بين اللسان والحنك، فيخرج الهواء من بينهما. حروفه الخمسة والعشرون الباقية.',
      en: 'The space between the tongue and the palate stays open, so the air passes between them. It has the other twenty-five letters.',
    },
  },
  idhlaq: {
    name: { ar: 'الإذلاق', en: 'Idhlaq (fluency)' },
    meaning: {
      ar: 'خفة الحرف وسرعة النطق به، لخروجه من طرف اللسان أو من الشفتين. حروفه ستة: «فِرَّ مِنْ لُبٍّ».',
      en: 'The letter is light and quick to say, because it comes from the tip of the tongue or from the lips. Its six letters are gathered in the phrase "firra min lubb".',
    },
    mnemonic: 'فِرَّ مِنْ لُبٍّ',
    regions: ['tongue-tip', 'shafatan'],
  },
  ismat: {
    name: { ar: 'الإصمات', en: 'Ismat (restraint)' },
    meaning: {
      ar: 'ثقل الحرف لخروجه بعيدًا عن طرف اللسان والشفتين؛ ولذلك لا تكاد تُبنى كلمة عربية من أربعة أصول أو خمسة من هذه الحروف وحدها. حروفه الثلاثة والعشرون الباقية.',
      en: 'The letter is heavier to say, as it comes from away from the tip of the tongue and the lips; that is why an Arabic root of four or five letters is hardly ever built from these letters alone. It has the other twenty-three letters.',
    },
  },
  safir: {
    name: { ar: 'الصفير', en: 'Safir (whistle)' },
    meaning: {
      ar: 'صوت زائد يشبه صفير الطائر يخرج مع الحرف من بين طرف اللسان والثنايا. حروفه ثلاثة: ص ز س.',
      en: 'An extra sound like a bird’s whistle that comes with the letter, between the tip of the tongue and the front teeth. Its three letters, ص ز س, share one makhraj.',
    },
    mnemonic: 'ص ز س',
  },
  qalqalah: {
    name: { ar: 'القلقلة', en: 'Qalqalah (echo)' },
    meaning: {
      ar: 'اضطراب المخرج عند النطق بالحرف ساكنًا حتى يُسمع له نبرة قوية. حروفها خمسة: «قُطْبُ جَدٍّ».',
      en: 'The makhraj is shaken as the letter is said with a sukun, so it is heard with a strong little bounce. Its five letters are gathered in the phrase "quṭbu jadd".',
    },
    mnemonic: 'قُطْبُ جَدٍّ',
  },
  lin: {
    name: { ar: 'اللين', en: 'Lin (ease)' },
    meaning: {
      ar: 'خروج الحرف في لين وسهولة بلا كلفة. حرفاه الواو والياء إذا سكنتا وقبلهما فتح.',
      en: 'The letter comes out softly and easily, without effort. Its two letters are waw and ya, when they have a sukun after a fatha.',
    },
    mnemonic: 'و ي',
  },
  inhiraf: {
    name: { ar: 'الانحراف', en: 'Inhiraf (leaning)' },
    meaning: {
      ar: 'ميل الحرف بعد خروجه من مخرجه نحو مخرج غيره: اللام تميل إلى طرف اللسان، والراء إلى ظهره وقليلًا نحو اللام. حرفاه اللام والراء.',
      en: 'After leaving its makhraj, the letter leans toward another: lam toward the tip of the tongue, ra toward its top and a little toward lam. Its two letters are lam and ra.',
    },
    mnemonic: 'ل ر',
  },
  takrir: {
    name: { ar: 'التكرير', en: 'Takrir (repetition)' },
    meaning: {
      ar: 'ارتعاد طرف اللسان عند النطق بالراء. يُعرف ليُجتنب: تُنطق الراء بطرقة واحدة، وخاصة إذا كانت مشددة.',
      en: 'The tip of the tongue tends to trill on ra. It is learned in order to avoid it: say ra with a single tap, especially when it has a shaddah.',
    },
    mnemonic: 'ر',
    regions: ['tongue-tip', 'gums'],
  },
  tafashshi: {
    name: { ar: 'التفشي', en: 'Tafashshi (spreading)' },
    meaning: {
      ar: 'انتشار الهواء في الفم عند النطق بالشين حتى يملأه. حرفه الشين.',
      en: 'The air spreads through the mouth, filling it, as sheen is said. Its letter is sheen.',
    },
    mnemonic: 'ش',
    regions: ['tongue-middle', 'palate'],
  },
  istitalah: {
    name: { ar: 'الاستطالة', en: 'Istitalah (lengthening)' },
    meaning: {
      ar: 'امتداد الصوت على حافة اللسان من أولها إلى آخرها عند النطق بالضاد. حرفها الضاد.',
      en: 'The sound stretches along the side of the tongue, from its back to its front, as ḍad is said. Its letter is ḍad.',
    },
    mnemonic: 'ض',
    regions: ['tongue-sides', 'molars-upper'],
  },
}

/**
 * Every letter's qualities: one of each group of opposites, in `OPPOSITE_SIFAT` order, then its
 * single qualities, if any. Alif is the madd alif; waw and ya take lin only with a sukun after a
 * fatha.
 */
export const LETTER_SIFAT: Record<ArabicLetter, readonly SifahId[]> = {
  'ء': ['jahr', 'shiddah', 'istifal', 'infitah', 'ismat'],
  'ا': ['jahr', 'rakhawah', 'istifal', 'infitah', 'ismat'],
  'ب': ['jahr', 'shiddah', 'istifal', 'infitah', 'idhlaq', 'qalqalah'],
  'ت': ['hams', 'shiddah', 'istifal', 'infitah', 'ismat'],
  'ث': ['hams', 'rakhawah', 'istifal', 'infitah', 'ismat'],
  'ج': ['jahr', 'shiddah', 'istifal', 'infitah', 'ismat', 'qalqalah'],
  'ح': ['hams', 'rakhawah', 'istifal', 'infitah', 'ismat'],
  'خ': ['hams', 'rakhawah', 'istila', 'infitah', 'ismat'],
  'د': ['jahr', 'shiddah', 'istifal', 'infitah', 'ismat', 'qalqalah'],
  'ذ': ['jahr', 'rakhawah', 'istifal', 'infitah', 'ismat'],
  'ر': ['jahr', 'tawassut', 'istifal', 'infitah', 'idhlaq', 'inhiraf', 'takrir'],
  'ز': ['jahr', 'rakhawah', 'istifal', 'infitah', 'ismat', 'safir'],
  'س': ['hams', 'rakhawah', 'istifal', 'infitah', 'ismat', 'safir'],
  'ش': ['hams', 'rakhawah', 'istifal', 'infitah', 'ismat', 'tafashshi'],
  'ص': ['hams', 'rakhawah', 'istila', 'itbaq', 'ismat', 'safir'],
  'ض': ['jahr', 'rakhawah', 'istila', 'itbaq', 'ismat', 'istitalah'],
  'ط': ['jahr', 'shiddah', 'istila', 'itbaq', 'ismat', 'qalqalah'],
  'ظ': ['jahr', 'rakhawah', 'istila', 'itbaq', 'ismat'],
  'ع': ['jahr', 'tawassut', 'istifal', 'infitah', 'ismat'],
  'غ': ['jahr', 'rakhawah', 'istila', 'infitah', 'ismat'],
  'ف': ['hams', 'rakhawah', 'istifal', 'infitah', 'idhlaq'],
  'ق': ['jahr', 'shiddah', 'istila', 'infitah', 'ismat', 'qalqalah'],
  'ك': ['hams', 'shiddah', 'istifal', 'infitah', 'ismat'],
  'ل': ['jahr', 'tawassut', 'istifal', 'infitah', 'idhlaq', 'inhiraf'],
  'م': ['jahr', 'tawassut', 'istifal', 'infitah', 'idhlaq'],
  'ن': ['jahr', 'tawassut', 'istifal', 'infitah', 'idhlaq'],
  'ه': ['hams', 'rakhawah', 'istifal', 'infitah', 'ismat'],
  'و': ['jahr', 'rakhawah', 'istifal', 'infitah', 'ismat', 'lin'],
  'ي': ['jahr', 'rakhawah', 'istifal', 'infitah', 'ismat', 'lin'],
}

const ALL_LETTERS = Object.keys(LETTER_NAMES) as ArabicLetter[]

const isLetter = (ch: string): ch is ArabicLetter => Object.hasOwn(LETTER_NAMES, ch)

/** The letters of a phrase, in order: harakat and spaces dropped, `أ` read as the hamzah. */
export const lettersOfPhrase = (phrase: string): ArabicLetter[] =>
  [...phrase].map((ch) => (ch === 'أ' ? 'ء' : ch)).filter(isLetter)

/**
 * The letters with quality `id`, as a lesson shows them: in its mnemonic's order when it has one,
 * otherwise ("the rest") in alphabetical order.
 */
export function lettersWith(id: SifahId): ArabicLetter[] {
  const { mnemonic } = SIFAT[id]
  return mnemonic ? lettersOfPhrase(mnemonic) : ALL_LETTERS.filter((l) => LETTER_SIFAT[l].includes(id))
}
