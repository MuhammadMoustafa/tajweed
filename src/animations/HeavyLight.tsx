import { joinBilingual } from '../i18n/bilingual'
import { LETTER_NAMES, type ArabicLetter } from '../tajweed/letters'
import { letterTourFrame as frame } from './MakharijClips'
import type { Clip, ClipStep } from './player/clip'

/** The seven letters of isti'la, in the order of the mnemonic خُصَّ ضَغْطٍ قِظْ. */
export const HEAVY_LETTERS: readonly ArabicLetter[] = ['خ', 'ص', 'ض', 'غ', 'ط', 'ق', 'ظ']

/** Each step is one still frame: long enough to read, and the learner controls the pace. */
export const HEAVY_LIGHT_STEP_MS = 4500

const LIGHT_LETTER: ArabicLetter = 'س'
const HEAVY_LETTER: ArabicLetter = 'ص'

const STEPS: ClipStep[] = [
  {
    duration: HEAVY_LIGHT_STEP_MS,
    label: { ar: 'حرف مرقَّق', en: 'A light letter' },
    caption: {
      ar: 'السين حرف مرقَّق: يبقى اللسان منخفضًا، فيخرج الصوت رقيقًا.',
      en: 'Seen is a light letter: the tongue stays low, so the sound comes out thin.',
    },
    render: () =>
      frame({
        tongue: 'rest',
        heading: { ar: 'اللسان منخفض', en: 'Tongue stays low' },
        highlight: ['tongue-tip'],
        letters: [LIGHT_LETTER],
        names: LETTER_NAMES[LIGHT_LETTER],
      }),
  },
  {
    duration: HEAVY_LIGHT_STEP_MS,
    label: { ar: 'حرف مفخَّم', en: 'A heavy letter' },
    caption: {
      ar: 'الصاد حرف مفخَّم: يرتفع أقصى اللسان نحو الحنك، فيمتلئ الفم بالصوت ويخرج غليظًا.',
      en: 'Sad is a heavy letter: the back of the tongue rises toward the palate, the mouth fills with the sound and it comes out full.',
    },
    render: () =>
      frame({
        tongue: 'raised-back',
        heading: { ar: 'أقصى اللسان يرتفع', en: 'Back of the tongue rises' },
        highlight: ['tongue-back', 'palate'],
        letters: [HEAVY_LETTER],
        names: LETTER_NAMES[HEAVY_LETTER],
      }),
  },
  {
    duration: HEAVY_LIGHT_STEP_MS,
    label: { ar: 'حروف الاستعلاء', en: 'The seven heavy letters' },
    caption: {
      ar: 'سبعة حروف تُفخَّم دائمًا: خ ص ض غ ط ق ظ، يجمعها «خُصَّ ضَغْطٍ قِظْ». وكل ما عداها مرقَّق (إلا حروفًا تتغير كالراء واللام والألف).',
      en: 'Seven letters are always heavy: خ ص ض غ ط ق ظ, gathered in "khuṣṣa ḍaghṭin qiẓ". Every other letter is light (except a few that vary, such as ra, lam and alif).',
    },
    render: () =>
      frame({
        tongue: 'raised-back',
        heading: { ar: 'حروف الاستعلاء', en: 'The letters of isti\u02bfla' },
        highlight: ['tongue-back', 'palate'],
        letters: HEAVY_LETTERS,
        names: joinBilingual(HEAVY_LETTERS.map((l) => LETTER_NAMES[l])),
      }),
  },
]

/** Heavy vs. light (L3): the tongue low for a light letter, its back raised for a heavy one, then the seven. */
export const heavyLight: Clip = {
  title: { ar: 'الحروف المفخَّمة والمرقَّقة', en: 'Heavy and light letters' },
  steps: STEPS,
}
