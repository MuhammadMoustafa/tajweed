import type { Bilingual } from '../i18n/bilingual'
import { LETTER_NAMES } from '../tajweed/letters'
import { letterTourFrame as frame } from './MakharijClips'
import type { Clip, ClipStep } from './player/clip'

/** Each step is one still frame: long enough to read, and the learner controls the pace. */
export const RA_STEP_MS = 4500

const FATHA = 'َ'
const DAMMA = 'ُ'
const KASRA = 'ِ'
const SUKUN = 'ْ'
const RA = 'ر'

// Placeholder letters (not Quran words) to show what comes before the ra.
const FA = 'ف'
const QAF = 'ق'
const KAF = 'ك'
const JEEM = 'ج'
const BA = 'ب'
const YA = 'ي'
const NOON = 'ن'
const ALIF = 'ا'
const ALIF_WASL = 'ٱ'

const HEAVY_HEADING: Bilingual = { ar: 'الراء مفخَّمة: أقصى اللسان يرتفع', en: 'Heavy ra: the back of the tongue rises' }
const LIGHT_HEADING: Bilingual = { ar: 'الراء مرقَّقة: اللسان منخفض', en: 'Light ra: the tongue stays low' }
const RA_NAME = LETTER_NAMES.ر

interface RaStepProps {
  label: Bilingual
  caption: Bilingual
  /** The letters row; the ra is the one at `raIndex`, the letter or vowel before it is what decides. */
  letters: readonly string[]
  raIndex: number
  heavy: boolean
}

/** One still step: the tongue raised (heavy) or low (light), with the ra picked out in its row. */
const raStep = ({ label, caption, letters, raIndex, heavy }: RaStepProps): ClipStep => ({
  duration: RA_STEP_MS,
  label,
  caption,
  render: () =>
    frame({
      tongue: heavy ? 'raised-back' : 'rest',
      heading: heavy ? HEAVY_HEADING : LIGHT_HEADING,
      highlight: heavy ? ['tongue-back', 'palate'] : ['tongue-tip'],
      letters,
      current: raIndex,
      names: RA_NAME,
    }),
})

/** Ra with its own vowel: fatha or damma heavy, kasra light. */
export const raVowel: Clip = {
  title: { ar: 'الراء المتحركة', en: 'Ra with a vowel' },
  steps: [
    raStep({
      label: { ar: 'راء مفتوحة', en: 'Ra with fatha' },
      caption: {
        ar: 'الراء المفتوحة مفخَّمة: انظر إلى الفتحة على الراء نفسها، فيرتفع أقصى اللسان ويمتلئ الفم.',
        en: 'A ra with fatha is heavy: look at the fatha on the ra itself. The back of the tongue rises and the mouth fills.',
      },
      letters: [`${RA}${FATHA}`],
      raIndex: 0,
      heavy: true,
    }),
    raStep({
      label: { ar: 'راء مضمومة', en: 'Ra with damma' },
      caption: {
        ar: 'والراء المضمومة مفخَّمة كذلك: الضمة على الراء نفسها تُفخِّمها.',
        en: 'A ra with damma is heavy too: the damma on the ra itself makes it heavy.',
      },
      letters: [`${RA}${DAMMA}`],
      raIndex: 0,
      heavy: true,
    }),
    raStep({
      label: { ar: 'راء مكسورة', en: 'Ra with kasra' },
      caption: {
        ar: 'والراء المكسورة مرقَّقة: الكسرة على الراء تُبقي اللسان منخفضًا فيخرج الصوت رقيقًا.',
        en: 'A ra with kasra is light: the kasra on the ra keeps the tongue low, so the sound comes out thin.',
      },
      letters: [`${RA}${KASRA}`],
      raIndex: 0,
      heavy: false,
    }),
  ],
}

/** Ra with a sukun: it follows the vowel before it, with two cases that keep it heavy after a kasra. */
export const raSakinah: Clip = {
  title: { ar: 'الراء الساكنة', en: 'Ra with a sukun' },
  steps: [
    raStep({
      label: { ar: 'بعد فتحة أو ضمة', en: 'After fatha or damma' },
      caption: {
        ar: 'الراء الساكنة تتبع الحركة التي قبلها. الفتحة أو الضمة قبلها تجعلها مفخَّمة.',
        en: 'A ra with a sukun follows the vowel before it. A fatha or damma before it makes it heavy.',
      },
      letters: [`${FA}${FATHA}`, `${RA}${SUKUN}`],
      raIndex: 1,
      heavy: true,
    }),
    raStep({
      label: { ar: 'بعد كسرة أصلية', en: 'After an original kasra' },
      caption: {
        ar: 'والكسرة الأصلية في الكلمة نفسها قبلها تجعلها مرقَّقة.',
        en: 'An original kasra before it, in the same word, makes it light.',
      },
      letters: [`${FA}${KASRA}`, `${RA}${SUKUN}`],
      raIndex: 1,
      heavy: false,
    }),
    raStep({
      label: { ar: 'حرف استعلاء بعدها', en: 'Istiʿla letter after it' },
      caption: {
        ar: 'لكنها تُفخَّم رغم الكسرة إذا جاء بعدها في الكلمة نفسها حرف استعلاء، لأن اللسان يرتفع إليه.',
        en: 'But despite the kasra it stays heavy when an istiʿla letter follows it in the same word, because the tongue is already rising for that letter.',
      },
      letters: [`${FA}${KASRA}`, `${RA}${SUKUN}`, QAF],
      raIndex: 1,
      heavy: true,
    }),
    raStep({
      label: { ar: 'كسرة همزة وصل', en: 'Kasra of a hamzat wasl' },
      caption: {
        ar: 'وتُفخَّم كذلك إذا كانت الكسرة قبلها كسرة همزة وصل، لأنها كسرة عارضة وليست أصلية في الكلمة.',
        en: 'It is also heavy when the kasra before it belongs to a hamzat wasl, because that kasra is not original to the word.',
      },
      letters: [ALIF_WASL, `${RA}${SUKUN}`],
      raIndex: 1,
      heavy: true,
    }),
  ],
}

/** Stopping on a ra: the letter before it decides (a ya sakinah or kasra light, a fatha-type sound heavy). */
export const raWaqf: Clip = {
  title: { ar: 'الوقف على الراء', en: 'Stopping on a ra' },
  steps: [
    raStep({
      label: { ar: 'قبلها فتحة أو ضمة أو مدّ', en: 'Fatha, damma or madd before' },
      caption: {
        ar: 'عند الوقف تسكن الراء وينظر إلى الحرف الذي قبلها. إن كان قبلها فتحة أو ضمة أو ألف أو واو ساكنة فهي مفخَّمة.',
        en: 'When you stop, the ra takes a sukun and you look at what is before it. A fatha, a damma, an alif or a waw sakinah before it makes it heavy.',
      },
      letters: [`${NOON}${FATHA}${ALIF}`, `${RA}${SUKUN}`],
      raIndex: 1,
      heavy: true,
    }),
    raStep({
      label: { ar: 'قبلها كسرة', en: 'Kasra before' },
      caption: {
        ar: 'وإن كانت قبلها كسرة فهي مرقَّقة.',
        en: 'A kasra before it makes it light.',
      },
      letters: [`${BA}${KASRA}`, `${RA}${SUKUN}`],
      raIndex: 1,
      heavy: false,
    }),
    raStep({
      label: { ar: 'قبلها ياء ساكنة', en: 'Ya sakinah before' },
      caption: {
        ar: 'وإن كانت قبلها ياء ساكنة فهي مرقَّقة كذلك، ولو كانت الراء مضمومة أو مفتوحة في الوصل.',
        en: 'A ya sakinah before it also makes it light, even if the ra carries fatha or damma when you read on.',
      },
      letters: [`${YA}${SUKUN}`, `${RA}${SUKUN}`],
      raIndex: 1,
      heavy: false,
    }),
    raStep({
      label: { ar: 'قبلها ساكن بعد كسرة', en: 'A sakin letter after a kasra' },
      caption: {
        ar: 'وإن كان قبلها حرف ساكن غير الياء نظرنا إلى ما قبله: فإن كانت قبله كسرة رُقِّقت.',
        en: 'If a sakin letter other than ya is before it, look at what is before that letter: a kasra there makes the ra light.',
      },
      letters: [`${FA}${KASRA}`, `${KAF}${SUKUN}`, `${RA}${SUKUN}`],
      raIndex: 2,
      heavy: false,
    }),
    raStep({
      label: { ar: 'قبلها ساكن بعد فتحة', en: 'A sakin letter after a fatha' },
      caption: {
        ar: 'وإن كانت قبله فتحة أو ضمة فُخِّمت. وكذلك إذا كان الحرف الساكن قبلها حرف استعلاء.',
        en: 'A fatha or damma there makes it heavy. It is heavy too when the sakin letter before it is an istiʿla letter.',
      },
      letters: [`${FA}${FATHA}`, `${JEEM}${SUKUN}`, `${RA}${SUKUN}`],
      raIndex: 2,
      heavy: true,
    }),
  ],
}
