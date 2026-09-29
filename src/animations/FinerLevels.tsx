import { joinBilingual, type Bilingual } from '../i18n/bilingual'
import { LETTER_NAMES, type ArabicLetter } from '../tajweed/letters'
import { withNose } from './Ghunnah'
import { MaddBar } from './MaddBar'
import { letterTourFrame as frame } from './MakharijClips'
import type { Clip, ClipStep } from './player/clip'

/** Each step is one still frame, long enough to read; the learner sets the pace. */
export const FINER_STEP_MS = 4500

/** The four letters of itbaq, where the tongue is pressed against the palate. */
export const ITBAQ_LETTERS: readonly ArabicLetter[] = ['ص', 'ض', 'ط', 'ظ']

const HEAVY_REGIONS = ['tongue-back', 'palate'] as const
const SAD = LETTER_NAMES['ص']

/**
 * The five levels of tafkhim by the letter's haraka, strongest first. The syllable shown is a bare
 * sad with each haraka (not Quran text); the last frame is the kasra, which is still heavy.
 */
const LEVELS: { syllable: string; label: Bilingual; caption: Bilingual }[] = [
  {
    syllable: 'صَا',
    label: { ar: '١. فتحة بعدها ألف', en: '1. Fatha, then an alif' },
    caption: {
      ar: 'أقوى التفخيم: الحرف المفتوح وبعده ألف. الفتحة والألف كلاهما يفتحان الفم، فيمتلئ بالصوت أكثر ما يمكن.',
      en: 'The strongest tafkhim: a heavy letter with a fatha and an alif after it. Both open the mouth, so the sound fills it most.',
    },
  },
  {
    syllable: 'صَ',
    label: { ar: '٢. فتحة', en: '2. Fatha' },
    caption: {
      ar: 'ثم الحرف المفتوح دون ألف بعده: تفخيم قوي، لكنه دون الأول.',
      en: 'Next, a heavy letter with a fatha and no alif after it: still strong, but below the first level.',
    },
  },
  {
    syllable: 'صُ',
    label: { ar: '٣. ضمة', en: '3. Damma' },
    caption: {
      ar: 'ثم المضموم: تجتمع الشفتان قليلًا مع ارتفاع أقصى اللسان، فينقص التفخيم عن الفتح.',
      en: 'Then a damma: the lips round a little while the back of the tongue rises, so it is a step below the fatha.',
    },
  },
  {
    syllable: 'صْ',
    label: { ar: '٤. سكون', en: '4. Sukun' },
    caption: {
      ar: 'ثم الساكن: يُنطق الحرف مفخَّمًا بلا حركة، وتتأثر قوته بحركة ما قبله.',
      en: 'Then a sukun: the letter is heavy with no vowel of its own, and its strength follows the vowel before it.',
    },
  },
  {
    syllable: 'صِ',
    label: { ar: '٥. كسرة', en: '5. Kasra' },
    caption: {
      ar: 'أضعفها المكسور، لكنه يبقى تفخيمًا لا ترقيقًا: أقصى اللسان يظل مرتفعًا، وإنما تنقص قوة الصوت.',
      en: 'The weakest is the kasra, yet it is still tafkhim, not tarqiq: the back of the tongue stays raised, only the fullness is less.',
    },
  },
]

const levelStep = ({ syllable, label, caption }: (typeof LEVELS)[number]): ClipStep => ({
  duration: FINER_STEP_MS,
  label,
  caption,
  render: () =>
    frame({
      tongue: 'raised-back',
      heading: label,
      highlight: [...HEAVY_REGIONS],
      letters: [syllable],
      names: SAD,
    }),
})

/** The tafkhim clip: the five levels, then where the four itbaq letters sit among them. */
export const tafkhimLevels: Clip = {
  title: { ar: 'مراتب التفخيم', en: 'The levels of tafkhim' },
  steps: [
    ...LEVELS.map(levelStep),
    {
      duration: FINER_STEP_MS,
      label: { ar: 'حروف الإطباق', en: 'The itbaq letters' },
      caption: {
        ar: 'الصاد والضاد والطاء والظاء ينطبق اللسان فيها على الحنك (الإطباق)، فهي أمكن تفخيمًا من الخاء والغين والقاف في كل مرتبة من المراتب الخمس.',
        en: 'For sad, dad, ta and za the tongue closes against the palate (itbaq), so in every one of the five levels they are fuller than kha, ghayn and qaf.',
      },
      render: () =>
        frame({
          tongue: 'sealed',
          heading: { ar: 'اللسان مطبَق على الحنك', en: 'Tongue closed on the palate' },
          highlight: [...HEAVY_REGIONS],
          letters: ITBAQ_LETTERS,
          names: joinBilingual(ITBAQ_LETTERS.map((l) => LETTER_NAMES[l])),
        }),
    },
  ],
}

/** The strong levels of ghunnah, fullest first; the bar's counts are those taught for Hafs. */
const GHUNNAH_LEVELS: { letter: string; nasal: number; label: Bilingual; heading: Bilingual; caption: Bilingual }[] = [
  {
    letter: 'نّ',
    nasal: 1,
    label: { ar: 'النون والميم المشددتان', en: 'Doubled noon and meem' },
    heading: { ar: 'أقوى الغنة: حركتان', en: 'Fullest ghunnah: 2 counts' },
    caption: {
      ar: 'أقوى مراتب الغنة: النون أو الميم المشددة، تظهر الغنة كاملة حركتين.',
      en: 'The strongest level: a noon or meem with a shaddah shows its ghunnah in full, for two counts.',
    },
  },
  {
    letter: 'نْ',
    nasal: 0.85,
    label: { ar: 'الإدغام بغنة', en: 'Idgham with ghunnah' },
    heading: { ar: 'إدغام بغنة: حركتان', en: 'Idgham with ghunnah: 2 counts' },
    caption: {
      ar: 'ثم الإدغام بغنة: تدخل النون في الحرف التالي وتبقى الغنة حركتين.',
      en: 'Then idgham with ghunnah: the noon enters the next letter and its ghunnah stays for two counts.',
    },
  },
  {
    letter: 'نْ',
    nasal: 0.7,
    label: { ar: 'الإخفاء والإقلاب', en: 'Ikhfa and iqlab' },
    heading: { ar: 'إخفاء وإقلاب: حركتان أخف', en: 'Ikhfa and iqlab: 2 counts, lighter' },
    caption: {
      ar: 'ثم الإخفاء والإقلاب: غنة في الحرف المخفى (نون أو ميم)، بمقدار حركتين، وهي دون غنة الإدغام في القوة.',
      en: 'Then ikhfa and iqlab: the ghunnah sits on the hidden letter (noon or meem) for about two counts, lighter than in idgham.',
    },
  },
]

const ghunnahStep = ({ letter, nasal, label, heading, caption }: (typeof GHUNNAH_LEVELS)[number]): ClipStep => ({
  duration: FINER_STEP_MS,
  label,
  caption,
  render: (progress) =>
    withNose(true, <MaddBar counts={2} filled={2 * progress} current markers token="ghunnah" letter={letter} label={heading} />, nasal),
})

/** The ghunnah clip: the bar fills to 2 counts for each of the three strong levels, then izhar shows none. */
export const ghunnahLevels: Clip = {
  title: { ar: 'مراتب الغنة', en: 'The levels of ghunnah' },
  steps: [
    ...GHUNNAH_LEVELS.map(ghunnahStep),
    {
      duration: FINER_STEP_MS,
      label: { ar: 'الإظهار', en: 'Izhar' },
      caption: {
        ar: 'وأضعفها الإظهار: لا تُمَدّ الغنة بل تبقى صفة طبيعية في النون والميم دون زيادة.',
        en: 'The lightest is izhar: the ghunnah is not stretched; it stays only as the natural quality of noon and meem.',
      },
      render: () =>
        frame({
          tongue: 'rest',
          nasal: 0.25,
          heading: { ar: 'إظهار: غنة طبيعية دون مدّ', en: 'Izhar: natural ghunnah, no stretching' },
          highlight: ['khayshum'],
          letters: ['نْ'],
          names: LETTER_NAMES['ن'],
        }),
    },
  ],
}

/** Complete versus incomplete idgham: what stays of the first letter after it enters the second. */
export const idghamNaqis: Clip = {
  title: { ar: 'الإدغام الكامل والناقص', en: 'Complete and incomplete idgham' },
  steps: [
    {
      duration: FINER_STEP_MS,
      label: { ar: 'إدغام ناقص: النون في الياء والواو', en: 'Incomplete: noon into ya and waw' },
      caption: {
        ar: 'النون تدخل في الياء أو الواو ويبقى أثرها: الغنة. فالإدغام ناقص لأن صفة الغنة باقية.',
        en: 'The noon enters ya or waw, but its trace stays: the ghunnah. The idgham is incomplete because that quality remains.',
      },
      render: () =>
        frame({
          tongue: 'rest',
          nasal: 0.9,
          heading: { ar: 'تبقى الغنة', en: 'The ghunnah remains' },
          highlight: ['khayshum'],
          letters: ['نْ', 'ي', 'و'],
          names: joinBilingual([LETTER_NAMES['ن'], LETTER_NAMES['ي'], LETTER_NAMES['و']]),
        }),
    },
    {
      duration: FINER_STEP_MS,
      label: { ar: 'إدغام ناقص: الطاء في التاء', en: 'Incomplete: ta (heavy) into ta' },
      caption: {
        ar: 'الطاء الساكنة تدخل في التاء ويبقى إطباقها: يظل اللسان مطبَقًا على الحنك ثم تخرج التاء.',
        en: 'A sakin heavy ta (ṭa) enters the light ta and its itbaq stays: the tongue stays closed on the palate, then the ta is released.',
      },
      render: () =>
        frame({
          tongue: 'sealed',
          heading: { ar: 'يبقى الإطباق', en: 'The itbaq remains' },
          highlight: [...HEAVY_REGIONS],
          letters: ['ط', 'ت'],
          names: joinBilingual([LETTER_NAMES['ط'], LETTER_NAMES['ت']]),
        }),
    },
    {
      duration: FINER_STEP_MS,
      label: { ar: 'إدغام كامل: النون في اللام والراء', en: 'Complete: noon into lam and ra' },
      caption: {
        ar: 'النون تدخل في اللام أو الراء دخولًا تامًّا: لا غنة ولا أثر للنون، فيُنطق حرف واحد مشدد.',
        en: 'The noon enters lam or ra completely: no ghunnah and no trace of the noon, so one doubled letter is heard.',
      },
      render: () =>
        frame({
          tongue: 'rest',
          nasal: 0,
          heading: { ar: 'لا غنة ولا أثر', en: 'No ghunnah, no trace' },
          highlight: ['tongue-tip'],
          letters: ['نْ', 'ل', 'ر'],
          names: joinBilingual([LETTER_NAMES['ن'], LETTER_NAMES['ل'], LETTER_NAMES['ر']]),
        }),
    },
  ],
}
