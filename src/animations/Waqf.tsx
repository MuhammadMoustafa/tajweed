import type { Clip, ClipStep } from './player/clip'
import { ChangeFrame, RestartFrame, SignFrame, type SignInfo, type StopChange } from './WaqfFrames'

// The waqf lesson (L19): one clip per section — the signs of the Madani mushaf, how to stop on a
// word, and where to restart. The sign glyphs are typographic marks (code points below, not Quran
// text); they sit on a tatweel so each mark has a letter-shaped base to hang from.

/** How long each step holds; the learner steps at their own pace (the player never autoplays). */
export const SIGN_MS = 3500
export const STOP_MS = 3500
export const RESTART_MS = 3500

/** The mushaf's stop signs by name (Unicode Arabic small high marks). */
export const WAQF_SIGNS = {
  lazim: 'ۘ', // small high meem: required stop
  mamnu: 'ۙ', // small high lam-alif: do not stop
  wasl: 'ۖ', // small high sad-lam-alef-maksura: permissible, continuing is better
  waqf: 'ۗ', // small high qaf-lam-alef-maksura: permissible, stopping is better
  jaiz: 'ۚ', // small high jeem: permissible, either way
  muanaqah: 'ۛ', // small high three dots: the paired muʿanaqah mark
} as const

const SIGNS: SignInfo[] = [
  {
    glyph: WAQF_SIGNS.lazim,
    label: { ar: 'وقف لازم', en: 'Required stop' },
    caption: {
      ar: 'علامة الميم: يلزم الوقف هنا، لأن الوصل قد يُغيّر المعنى.',
      en: 'The meem sign: stop here, because reading on could change the meaning.',
    },
  },
  {
    glyph: WAQF_SIGNS.mamnu,
    label: { ar: 'لا تقف', en: 'Do not stop' },
    caption: {
      ar: 'علامة «لا»: لا تقف عندها، بل صِل. فإن اضطررتَ لنَفَس فارجع قليلًا وابدأ من موضع يصحّ.',
      en: 'The lam-alif sign: do not stop here, read on. If you must breathe, go back a little and restart from a place that makes sense.',
    },
  },
  {
    glyph: WAQF_SIGNS.wasl,
    label: { ar: 'الوصل أولى', en: 'Continuing is better' },
    caption: { ar: 'الوقف جائز، لكن الوصل أولى.', en: 'Stopping is allowed, but continuing is better.' },
  },
  {
    glyph: WAQF_SIGNS.waqf,
    label: { ar: 'الوقف أولى', en: 'Stopping is better' },
    caption: { ar: 'الوصل جائز، لكن الوقف أولى.', en: 'Continuing is allowed, but stopping is better.' },
  },
  {
    glyph: WAQF_SIGNS.jaiz,
    label: { ar: 'جائز الوجهين', en: 'Either way' },
    caption: {
      ar: 'علامة الجيم: الوقف والوصل جائزان على السواء.',
      en: 'The jeem sign: stopping and continuing are equally fine.',
    },
  },
  {
    glyph: WAQF_SIGNS.muanaqah,
    label: { ar: 'المعانقة', en: 'The paired dots' },
    caption: {
      ar: 'ثلاث نقاط تأتي مرتين متقاربتين: قف عند إحداهما، ولا تقف عند الأخرى. اختر واحدة فقط.',
      en: 'Three dots that come twice close together: stop at one of them, not at both. Choose only one.',
    },
    pair: true,
  },
]

/** Each stop sign in turn, drawn large with its meaning (one step per sign). */
export const waqfSigns: Clip = {
  title: { ar: 'علامات الوقف في المصحف', en: 'The stop signs of the mushaf' },
  steps: SIGNS.map(
    (sign): ClipStep => ({
      duration: SIGN_MS,
      label: sign.label,
      caption: sign.caption,
      render: () => <SignFrame sign={sign} />,
    }),
  ),
}

const CHANGES: StopChange[] = [
  {
    before: 'بُ',
    after: 'بْ',
    label: { ar: 'الحركة تصير سكونًا', en: 'A vowel becomes sukun' },
    caption: {
      ar: 'إذا وقفتَ على حرف متحرك سكّنتَه: تسقط الحركة ويبقى الحرف ساكنًا.',
      en: 'When you stop on a letter with a vowel, give it a sukun: the vowel drops and the letter is sakin.',
    },
  },
  {
    before: 'بٌ',
    after: 'بْ',
    label: { ar: 'تنوين الضم والكسر', en: 'Tanween damma or kasra' },
    caption: {
      ar: 'تنوين الضم والتنوين بالكسر يسقطان عند الوقف ويسكن الحرف.',
      en: 'Tanween damma and tanween kasra both drop when you stop, and the letter is sakin.',
    },
  },
  {
    before: 'بً',
    after: 'بَا',
    label: { ar: 'تنوين الفتح ألف', en: 'Tanween fatha becomes alif' },
    caption: {
      ar: 'تنوين الفتح يصير ألفًا عند الوقف، فتُمدّ حركتين.',
      en: 'Tanween fatha turns into a long alif when you stop, held for 2 counts.',
    },
  },
  {
    before: 'بَة',
    after: 'بَهْ',
    label: { ar: 'التاء المربوطة هاء', en: 'Ta marbuta becomes ha' },
    caption: {
      ar: 'التاء المربوطة في آخر الكلمة تُنطق هاءً ساكنة عند الوقف.',
      en: 'A ta marbuta at the end of a word is read as a sakin ha when you stop.',
    },
  },
]

/** How a word is stopped on, one change per step (sukun, tanween, alif, ha). */
export const waqfStop: Clip = {
  title: { ar: 'كيف نقف على الكلمة', en: 'How to stop on a word' },
  steps: CHANGES.map(
    (change): ClipStep => ({
      duration: STOP_MS,
      label: change.label,
      caption: change.caption,
      render: (progress) => <ChangeFrame change={change} progress={progress} />,
    }),
  ),
}

/** Restarting after a stop: at the next word, or a little earlier after a forced stop. */
export const waqfRestart: Clip = {
  title: { ar: 'أين نبدأ بعد الوقف', en: 'Where to restart after stopping' },
  steps: [
    {
      duration: RESTART_MS,
      label: { ar: 'اقرأ', en: 'Read' },
      caption: { ar: 'نقرأ كلمة بعد كلمة، ويتصل الكلام حتى موضع الوقف.', en: 'We read word after word, the sentence flowing until the place we stop.' },
      render: () => <RestartFrame readTo={2} />,
    },
    {
      duration: RESTART_MS,
      label: { ar: 'قف', en: 'Stop' },
      caption: { ar: 'نقف عند كلمة يتمّ عندها المعنى، وقد نأخذ نَفَسًا.', en: 'We stop after a word where the meaning is complete, and may take a breath.' },
      render: () => <RestartFrame readTo={2} stopAt={2} />,
    },
    {
      duration: RESTART_MS,
      label: { ar: 'ابتدئ', en: 'Restart' },
      caption: { ar: 'نبدأ من الكلمة التالية، فالمعنى تامّ والابتداء صحيح.', en: 'We restart from the next word: the meaning was complete, so the start is sound.' },
      render: () => <RestartFrame readTo={2} stopAt={2} restartAt={3} />,
    },
    {
      duration: RESTART_MS,
      label: { ar: 'وقف اضطراري', en: 'A forced stop' },
      caption: {
        ar: 'إن اضطررنا للوقف في موضع لا يتمّ عنده المعنى، رجعنا إلى كلمة قبله يصحّ أن نبدأ منها.',
        en: 'If we are forced to stop where the meaning is not yet complete, we go back to an earlier word that is a sound place to restart from.',
      },
      render: () => <RestartFrame readTo={3} stopAt={3} restartAt={1} />,
    },
  ],
}
