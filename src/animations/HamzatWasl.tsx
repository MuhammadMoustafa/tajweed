import type { ReactNode } from 'react'
import { getWord } from '../data/quran'
import type { Bilingual } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'
import type { Clip, ClipStep } from './player/clip'
import { CLIP_WORDS } from './words'

/**
 * Clips for the hamzat al-wasl and silent-letters lesson (L17). The syllables drawn are single
 * letters and generic patterns, never Quran text; the "Listen" steps show a word from the fetched
 * data (CLIP_WORDS) recited by al-Husary. The letter each step is about sits under a caret.
 */

const VIEW_WIDTH = 500
const WORD_Y = 110
const CARET_Y = 132
/** Where the wasla alif and the letters after it sit; the alif is its own glyph (a non-joining
 * letter, so splitting it off never breaks letter joining), the rest stays one run. */
const WASLA_X = 300
const REST_X = 215
const PREFIX_X = 372
const SOUND_Y = 200
/** Step lengths, in ms (exported for the tests). */
export const EXPLAIN_MS = 4500
export const LISTEN_MS = 2500

/** An upward triangle under `x`, pointing at the letter above it. */
const caret = (x: number) => `M${x - 9} ${CARET_Y + 16} L${x} ${CARET_Y} L${x + 9} ${CARET_Y + 16} Z`

// eslint-disable-next-line react/only-export-components
function Sound({ text }: { text: Bilingual }) {
  const { t } = useLocale()
  return (
    <text x={VIEW_WIDTH / 2} y={SOUND_Y} textAnchor="middle" className="hw-sound">
      {t(text)}
    </text>
  )
}

interface WordFrameProps {
  /** The letters after the alif, as one run so they keep joining. */
  rest: ReactNode
  /** The syllable read before the alif, when the word is joined to what came before. */
  prefix?: string
  /** True: the alif is pronounced (start); false: it is skipped, struck out and faded. */
  pronounced: boolean
  /** What the reader says, under the word. */
  sound: Bilingual
}

/** A word whose first letter is the wasla alif, with a caret under it. */
// eslint-disable-next-line react/only-export-components
function WordFrame({ rest, prefix, pronounced, sound }: WordFrameProps) {
  return (
    <svg viewBox={`0 0 ${VIEW_WIDTH} 230`} aria-hidden="true" className="anim-svg hw-frame">
      {prefix && (
        <text x={PREFIX_X} y={WORD_Y} textAnchor="middle" className="anim-letter hw-plain">
          {prefix}
        </text>
      )}
      <text
        x={WASLA_X}
        y={WORD_Y}
        textAnchor="middle"
        className="anim-letter"
        fill={pronounced ? 'var(--text)' : 'var(--tj-silent)'}
        opacity={pronounced ? 1 : 0.4}
        data-wasla={pronounced ? 'pronounced' : 'skipped'}
      >
        {'ٱ'}
      </text>
      <text x={REST_X} y={WORD_Y} textAnchor="middle" className="anim-letter hw-plain">
        {rest}
      </text>
      {!pronounced && (
        <line x1={WASLA_X - 18} y1={WORD_Y - 24} x2={WASLA_X + 18} y2={WORD_Y - 24} stroke="var(--tj-silent)" strokeWidth={4} data-strike />
      )}
      <path d={caret(WASLA_X)} fill="var(--tj-silent)" data-caret="wasla" />
      <Sound text={sound} />
    </svg>
  )
}

/** A step showing a recited Quran word (its text comes from the fetched data), with a note under it. */
const listenFrame = (key: (typeof CLIP_WORDS)[keyof typeof CLIP_WORDS], sound: Bilingual) => () => (
  <svg viewBox={`0 0 ${VIEW_WIDTH} 230`} aria-hidden="true" className="anim-svg hw-frame">
    <text x={VIEW_WIDTH / 2} y={WORD_Y} textAnchor="middle" className="anim-word">
      {getWord(key)?.text}
    </text>
    <Sound text={sound} />
  </svg>
)

const FATHA_A: Bilingual = { ar: 'أَ  (فتحة)', en: 'a  (fatha)' }
const DAMMA_U: Bilingual = { ar: 'أُ  (ضمة)', en: 'u  (damma)' }
const KASRA_I: Bilingual = { ar: 'إِ  (كسرة)', en: 'i  (kasra)' }

/** Hamzat al-wasl: read when you start with it, dropped when it is joined to what came before. */
const WASL_STEPS: ClipStep[] = [
  {
    duration: EXPLAIN_MS,
    label: { ar: 'عند الابتداء', en: 'Starting with it' },
    caption: {
      ar: 'إذا ابتدأتَ بالكلمة نطقتَ همزة الوصل: الحرف الذي تحته السهم يُنطق بحركة.',
      en: 'If you start with the word, the wasl hamza is read: the letter under the arrow is pronounced, with a vowel.',
    },
    render: () => <WordFrame rest="لْقَ" pronounced sound={{ ar: 'تبدأ: أَ …', en: 'You begin: a …' }} />,
  },
  {
    duration: EXPLAIN_MS,
    label: { ar: 'عند الوصل', en: 'Joining it' },
    caption: {
      ar: 'إذا وصلتَ الكلمة بما قبلها سقطت همزة الوصل: لا تُنطق، ويتصل الصوت بالحرف الذي بعدها.',
      en: 'If you join the word to what came before it, the wasl hamza drops: it is not read, and the sound before it runs straight into the letter after it.',
    },
    render: () => <WordFrame prefix="وَ" rest="لْقَ" pronounced={false} sound={{ ar: 'تصل: وَلْ … (لا أَ)', en: 'You join: wa-l … (no a)' }} />,
  },
  {
    duration: LISTEN_MS,
    label: { ar: 'استمع: الابتداء', en: 'Listen: starting' },
    caption: {
      ar: 'استمع إلى أول كلمة من الآية الأولى في سورة العلق: هي بداية القراءة، فتُنطق همزة الوصل فيها.',
      en: 'Hear the first word of 96:1: it starts the recitation, so its wasl hamza is pronounced.',
    },
    audio: { word: CLIP_WORDS.waslStart },
    render: listenFrame(CLIP_WORDS.waslStart, { ar: 'همزة الوصل تُنطق', en: 'The wasl hamza is read' }),
  },
  {
    duration: LISTEN_MS,
    label: { ar: 'استمع: الوصل', en: 'Listen: joining' },
    caption: {
      ar: 'ثم الكلمة التالية: فيها همزة وصل، لكنها موصولة بما قبلها، فلا تسمع الهمزة.',
      en: 'Then the next word: it also has a wasl hamza, but it is joined to the word before it, so you hear no hamza.',
    },
    audio: { word: CLIP_WORDS.waslJoined },
    render: listenFrame(CLIP_WORDS.waslJoined, { ar: 'همزة الوصل تسقط', en: 'The wasl hamza drops' }),
  },
]

/** With which vowel do you start? Al-: fatha; a verb: by its third letter; the listed nouns: kasra. */
const VOWEL_STEPS: ClipStep[] = [
  {
    duration: EXPLAIN_MS,
    label: { ar: 'مع «أل»', en: 'With al-' },
    caption: {
      ar: 'في «أل» التعريف نبدأ بالفتح: أَلْ.',
      en: 'In the article al- we start with a fatha: al-.',
    },
    render: () => <WordFrame rest="لْقَ" pronounced sound={FATHA_A} />,
  },
  {
    duration: EXPLAIN_MS,
    label: { ar: 'فعل: الثالث مضموم', en: 'Verb: third letter has damma' },
    caption: {
      ar: 'في الفعل ننظر إلى حرفه الثالث (الهمزة أول حرف، ثم الفاء، ثم العين): إن كان مضمومًا ضممنا عند الابتداء.',
      en: 'In a verb, look at its third letter (the alif is the first, then fa, then ʿayn): if that letter has a damma, start with a damma.',
    },
    render: () => (
      <WordFrame
        rest={
          <>
            {'فْ'}
            <tspan fill="var(--accent)">{'عُ'}</tspan>
            {'لْ'}
          </>
        }
        pronounced
        sound={DAMMA_U}
      />
    ),
  },
  {
    duration: EXPLAIN_MS,
    label: { ar: 'فعل: الثالث غير مضموم', en: 'Verb: third letter has fatha or kasra' },
    caption: {
      ar: 'وإن كان الحرف الثالث مفتوحًا أو مكسورًا كسرنا عند الابتداء.',
      en: 'If the third letter has a fatha or a kasra, start with a kasra.',
    },
    render: () => (
      <WordFrame
        rest={
          <>
            {'فْ'}
            <tspan fill="var(--accent)">{'عِ'}</tspan>
            {'لْ'}
          </>
        }
        pronounced
        sound={KASRA_I}
      />
    ),
  },
  {
    duration: EXPLAIN_MS,
    label: { ar: 'أسماء معدودة', en: 'A few listed nouns' },
    caption: {
      ar: 'وفي الأسماء المعدودة في بيت الجزرية (وليست «أل») نبدأ بالكسر دائمًا.',
      en: 'In the few nouns the Jazariyyah lists (not al-), we always start with a kasra.',
    },
    render: () => <WordFrame rest="···" pronounced sound={KASRA_I} />,
  },
]

const RUN_X = 285
const SILENT_ALIF_X = 195

/** The word run and the trailing alif; `read` draws the alif faded and struck out, and says the sound. */
const silentFrame = (read: boolean) => () => (
  <svg viewBox={`0 0 ${VIEW_WIDTH} 230`} aria-hidden="true" className="anim-svg hw-frame">
    <text x={RUN_X} y={WORD_Y} textAnchor="middle" className="anim-letter hw-plain">
      {'فَعَلُو'}
    </text>
    <text
      x={SILENT_ALIF_X}
      y={WORD_Y}
      textAnchor="middle"
      className="anim-letter"
      fill="var(--tj-silent)"
      opacity={read ? 0.4 : 1}
      data-silent={read ? 'skipped' : 'written'}
    >
      {'ا'}
    </text>
    {read && (
      <line x1={SILENT_ALIF_X - 8} y1={WORD_Y - 8} x2={SILENT_ALIF_X + 8} y2={WORD_Y - 40} stroke="var(--tj-silent)" strokeWidth={4} data-strike />
    )}
    <path d={caret(SILENT_ALIF_X)} fill="var(--tj-silent)" data-caret="silent" />
    <Sound
      text={
        read
          ? { ar: 'تُقرأ: فَعَلُو  (ينتهي الصوت بالواو)', en: 'You read: fa-ʿa-lu  (the sound ends on the waw)' }
          : { ar: 'مكتوبة بعد واو الجماعة', en: 'Written after the waw of the plural' }
      }
    />
  </svg>
)

/** Silent letters: written, not read. The clip shows the alif after the plural waw. */
const SILENT_STEPS: ClipStep[] = [
  {
    duration: EXPLAIN_MS,
    label: { ar: 'مكتوب', en: 'Written' },
    caption: {
      ar: 'في هذا الفعل ألف بعد واو الجماعة (تحت السهم): مكتوبة في المصحف.',
      en: 'In this verb there is an alif after the waw of the plural (under the arrow): it is written in the mushaf.',
    },
    render: silentFrame(false),
  },
  {
    duration: EXPLAIN_MS,
    label: { ar: 'غير مقروء', en: 'Not read' },
    caption: {
      ar: 'لكنها لا تُقرأ لا وصلًا ولا وقفًا: يقف الصوت عند الواو.',
      en: 'But it is not read, whether you continue or stop: the sound ends on the waw.',
    },
    render: silentFrame(true),
  },
]

export const hamzatWasl: Clip = {
  title: { ar: 'همزة الوصل: تُنطق في الابتداء وتسقط في الوصل', en: 'Hamzat al-wasl: read when starting, dropped when joining' },
  steps: WASL_STEPS,
}

export const hamzatWaslVowel: Clip = {
  title: { ar: 'بأي حركة نبتدئ بهمزة الوصل؟', en: 'Which vowel do we start a wasl hamza with?' },
  steps: VOWEL_STEPS,
}

export const silentLetters: Clip = {
  title: { ar: 'الحروف المكتوبة التي لا تُقرأ', en: 'Letters that are written but not read' },
  steps: SILENT_STEPS,
}
