import type { Bilingual } from '../i18n/bilingual'
import { MaddBar, type MaddCount } from './MaddBar'
import { maddCountingSteps, type MaddPassBar } from './maddCounting'
import type { Clip, ClipStep } from './player/clip'

// The other-madd lesson (L16): one clip per section — ʿarid lis-sukun, leen, badal, ʿiwad, silah.
// Every clip shows practice syllables (a consonant + harakah, never Quran text) on MaddBar, starts
// by pointing at the madd's cause where it has one, then counts one "say it with me" pass per
// allowed length (maddCountingSteps), each pass under one timeline label.

/** How long a static "look at the cause" step holds before counting starts. */
export const CAUSE_MS = 2500

const CAUSE_LABEL: Bilingual = { ar: 'السبب', en: 'The cause' }

/** A static step showing the syllable with an empty bar and its cause pointed at, before counting. */
const causeStep = (bar: MaddPassBar, caption: Bilingual, label: Bilingual = CAUSE_LABEL, counts: MaddCount = 2): ClipStep => ({
  duration: CAUSE_MS,
  label,
  caption,
  render: () => <MaddBar {...bar} counts={counts} filled={0} current />,
})

/** The three lengths a reader may choose between for ʿarid lis-sukun and leen, as timeline labels. */
const CHOICES: { counts: MaddCount; label: Bilingual; ready: Bilingual }[] = [
  {
    counts: 2,
    label: { ar: 'القصر: حركتان', en: 'Qasr: 2 counts' },
    ready: { ar: 'الوجه الأول، القصر: قل معي وعُدّ حركتين.', en: 'First choice, qasr: say it with me and count 2.' },
  },
  {
    counts: 4,
    label: { ar: 'التوسط: ٤ حركات', en: 'Tawassut: 4 counts' },
    ready: { ar: 'الوجه الثاني، التوسط: قل معي وعُدّ أربع حركات.', en: 'Second choice, tawassut: say it with me and count 4.' },
  },
  {
    counts: 6,
    label: { ar: 'الطول: ٦ حركات', en: 'Tul: 6 counts' },
    ready: { ar: 'الوجه الثالث، الطول: قل معي وعُدّ ستّ حركات.', en: 'Third choice, tul: say it with me and count 6.' },
  },
]

/** One counting pass per allowed length (2, 4, 6), all in the permissible-madd color. */
const choicePasses = (bar: MaddPassBar, stop: Bilingual): ClipStep[] =>
  CHOICES.flatMap(({ counts, label, ready }) =>
    maddCountingSteps({ counts, bar: { ...bar, label, token: 'madd-permissible' }, ready, stop, label }),
  )

const ARID: MaddPassBar = { before: 'بَ', letter: 'ا', after: 'نْ', cause: 'after', token: 'madd-permissible' }

/** Madd ʿarid lis-sukun: stopping makes the last letter sakin after a madd letter; 2, 4 or 6. */
export const maddArid: Clip = {
  title: { ar: 'المد العارض للسكون: اختر ٢ أو ٤ أو ٦', en: 'Madd ʿarid lis-sukun: choose 2, 4 or 6' },
  steps: [
    causeStep(
      { ...ARID, label: { ar: 'الوقف يُسكِّن الحرف الأخير', en: 'Stopping: the last letter is sakin' } },
      {
        ar: 'عند الوقف يسكن الحرف الأخير، وقبله حرف مدّ. هذا السكون عارض بسبب الوقف، وهو سبب هذا المدّ.',
        en: 'When you stop, the last letter becomes sakin, right after a madd letter. That sukun comes only from stopping, and it is the cause of this madd.',
      },
      CAUSE_LABEL,
      6,
    ),
    ...choicePasses(ARID, {
      ar: 'قف. أيّ وجه اخترتَه فالتزمه في كل وقف.',
      en: 'Stop. Whichever length you choose, keep it at every stop.',
    }),
  ],
}

// Waw rather than ya: the isolated ya in the Quran font is drawn without its dots, like alif maqsurah.
const LEEN: MaddPassBar = { before: 'بَ', letter: 'وْ', after: 'تْ', cause: 'after', token: 'madd-permissible' }

/** Madd al-leen: waw/ya sakinah after a fatha, stretched only when stopping; 2, 4 or 6. */
export const maddLeen: Clip = {
  title: { ar: 'مد اللين عند الوقف: اختر ٢ أو ٤ أو ٦', en: 'Madd al-leen when stopping: choose 2, 4 or 6' },
  steps: [
    causeStep(
      { ...LEEN, label: { ar: 'واو ساكنة بعد فتحة، ثم وقف', en: 'Waw sakinah after fatha, then a stop' } },
      {
        ar: 'الواو أو الياء الساكنة بعد فتحة حرفُ لين. لا يُمدّ في الوصل، فإذا وقفتَ وسكن الحرف بعده جاز مدّه.',
        en: 'A waw or ya sakinah after a fatha is a leen letter. It is not stretched when you read on; when you stop and the letter after it becomes sakin, it may be.',
      },
      CAUSE_LABEL,
      6,
    ),
    ...choicePasses(LEEN, {
      ar: 'قف. ولا تجعل اللين أطول من العارض للسكون في قراءتك.',
      en: 'Stop. Never make leen longer than the ʿarid lis-sukun length you read with.',
    }),
  ],
}

const BADAL: MaddPassBar = { before: 'ءَ', letter: 'ا', cause: 'before' }

/** Madd al-badal: a hamza before the madd letter; 2 counts in Hafs. */
export const maddBadal: Clip = {
  title: { ar: 'مد البدل: حركتان في حفص', en: 'Madd al-badal: 2 counts in Hafs' },
  steps: [
    causeStep(
      { ...BADAL, label: { ar: 'همزة قبل حرف المدّ', en: 'A hamza before the madd letter' } },
      {
        ar: 'جاءت الهمزة قبل حرف المدّ، لا بعده: هذا مدّ البدل.',
        en: 'The hamza comes before the madd letter, not after it: this is madd al-badal.',
      },
    ),
    ...maddCountingSteps({
      counts: 2,
      bar: { ...BADAL, label: { ar: 'البدل: حركتان', en: 'Badal: 2 counts' } },
      label: { ar: 'حركتان في حفص', en: '2 counts in Hafs' },
      ready: {
        ar: 'قل معي: انطق الهمزة ثم الألف، وعُدّ حركتين فقط كالمدّ الطبيعي.',
        en: 'Say it with me: the hamza, then the alif, counting just 2, like natural madd.',
      },
      stop: { ar: 'قف: حركتان فقط في رواية حفص.', en: 'Stop: only 2 counts in Hafs.' },
    }),
  ],
}

/** Madd al-ʿiwad: stopping on tanween fath reads an alif of 2 counts in its place. */
export const maddIwad: Clip = {
  title: { ar: 'مد العوض: ألف بدل التنوين عند الوقف', en: 'Madd al-ʿiwad: an alif for the tanween when stopping' },
  steps: [
    causeStep(
      // The alif is silent while reading on, so it is drawn in the silent-letter gray here.
      { before: 'بً', letter: 'ا', token: 'silent', label: { ar: 'في الوصل: الألف لا تُنطق', en: 'Reading on: the alif is silent' } },
      {
        ar: 'في الوصل يُنطق التنوين نونًا ساكنة، والألف بعده لا تُنطق.',
        en: 'When you read on into the next word, the tanween sounds as a sakin noon and the alif after it is silent.',
      },
      { ar: 'الوصل', en: 'Reading on' },
    ),
    ...maddCountingSteps({
      counts: 2,
      bar: { before: 'بَ', letter: 'ا', label: { ar: 'الوقف: ألف بدل التنوين', en: 'Stopping: an alif for the tanween' } },
      label: { ar: 'الوقف: حركتان', en: 'Stopping: 2 counts' },
      ready: {
        ar: 'عند الوقف يُحذف التنوين وتُنطق الألف مكانه: قل معي وعُدّ حركتين.',
        en: 'When you stop, the tanween drops and the alif is read in its place: say it with me and count 2.',
      },
      stop: { ar: 'قف: حركتان، ولا نون بعد الألف.', en: 'Stop: 2 counts, with no noon sound after the alif.' },
    }),
  ],
}

const SILAH_BEFORE = 'بَهُ'

/** Madd al-silah: the pronoun ha between two moving letters; sughra 2 counts, kubra (a hamza next) 4 or 5. */
export const maddSilah: Clip = {
  title: { ar: 'مد الصلة: الصغرى والكبرى', en: 'Madd al-silah: sughra and kubra' },
  steps: [
    ...maddCountingSteps({
      counts: 2,
      bar: {
        before: SILAH_BEFORE,
        letter: 'و',
        after: 'بَ',
        cause: 'after',
        label: { ar: 'بعدها متحرّك: صلة صغرى', en: 'A moving letter next: sughra' },
      },
      label: { ar: 'الصغرى: حركتان', en: 'Sughra: 2 counts' },
      ready: {
        ar: 'هاء الضمير بين متحرّكين، فتُوصل ضمّتها بواو. والحرف بعدها ليس همزة: قل معي وعُدّ حركتين.',
        en: 'The pronoun ha sits between two moving letters, so its damma is drawn out into a waw. The next letter is not a hamza: say it with me and count 2.',
      },
      stop: { ar: 'قف: الصلة الصغرى حركتان كالمدّ الطبيعي.', en: 'Stop: silah sughra is 2 counts, like natural madd.' },
    }),
    ...([4, 5] as const).flatMap((counts) =>
      maddCountingSteps({
        counts,
        bar: {
          before: SILAH_BEFORE,
          letter: 'و',
          after: 'أَ',
          cause: 'after',
          token: 'madd-obligatory',
          label: { ar: 'بعدها همزة: صلة كبرى', en: 'A hamza next: kubra' },
        },
        label: counts === 4 ? { ar: 'الكبرى: ٤ حركات', en: 'Kubra: 4 counts' } : { ar: 'الكبرى: ٥ حركات', en: 'Kubra: 5 counts' },
        ready:
          counts === 4
            ? {
                ar: 'الآن بعد الهاء همزة: الصلة الكبرى، تُمدّ كالمنفصل. الوجه الأول: قل معي وعُدّ أربع حركات.',
                en: 'Now a hamza follows the ha: silah kubra, stretched like munfasil. First choice: say it with me and count 4.',
              }
            : {
                ar: 'الوجه الثاني: قل معي وعُدّ خمس حركات.',
                en: 'Second choice: say it with me and count 5.',
              },
        stop: {
          ar: 'قف. امدد الكبرى بالمقدار الذي تمدّ به المنفصل، في كل مرة.',
          en: 'Stop. Give kubra the same length you give munfasil, every time.',
        },
      }),
    ),
  ],
}
