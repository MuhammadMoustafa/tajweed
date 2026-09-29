import type { ReactNode } from 'react'
import { getWord } from '../data/quran'
import type { Bilingual } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'
import type { Clip, ClipStep } from './player/clip'
import { CLIP_WORDS } from './words'

/**
 * Clips for the Hafs special words unit (L23): sakt, imalah, tas-hil, ishmam/rawm, sad/seen and
 * starting at the word of 49:11. Letters are drawn one by one as generic letters and the mushaf's
 * small signs as typographic marks, never Quran text; the "Listen" steps show a word from the
 * fetched data (CLIP_WORDS) recited by al-Husary. The letter each step is about is colored with
 * the lesson's rule color (`--tj-hafs-special`).
 */

const VIEW_W = 500
const VIEW_H = 230
const LETTER_Y = 105
const SOUND_Y = 205
/** Step lengths, in ms (exported for the tests). */
export const EXPLAIN_MS = 4500
export const LISTEN_MS = 2500

const SPECIAL = 'var(--tj-hafs-special)'
const TEXT = 'var(--text)'
const MUTED = 'var(--muted)'

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t)

// eslint-disable-next-line react/only-export-components
function Say({ text, y = SOUND_Y }: { text: Bilingual; y?: number }) {
  const { t } = useLocale()
  return (
    <text x={VIEW_W / 2} y={y} textAnchor="middle" className="hafs-sound">
      {t(text)}
    </text>
  )
}

interface Glyph {
  text: string
  x: number
  y?: number
  color?: string
  opacity?: number
  /** Marks the glyph for the tests, e.g. `data-glyph="special"`. */
  role?: string
}

const glyph = ({ text, x, y = LETTER_Y, color = TEXT, opacity = 1, role }: Glyph, key: number) => (
  <text key={key} x={x} y={y} textAnchor="middle" className="anim-letter" fill={color} opacity={opacity} data-glyph={role}>
    {text}
  </text>
)

/** An arrow from right to left (reading order) between `from` and `to`, at the letters' height. */
const arrow = (from: number, to: number, crossed = false) => (
  <g data-arrow={crossed ? 'blocked' : 'reads-as'}>
    <path d={`M${from} ${LETTER_Y - 20} L${to} ${LETTER_Y - 20}`} stroke={MUTED} strokeWidth={3} fill="none" />
    <path d={`M${to + 10} ${LETTER_Y - 28} L${to} ${LETTER_Y - 20} L${to + 10} ${LETTER_Y - 12}`} stroke={MUTED} strokeWidth={3} fill="none" />
    {crossed && (
      <path
        d={`M${(from + to) / 2 - 12} ${LETTER_Y - 32} L${(from + to) / 2 + 12} ${LETTER_Y - 8} M${(from + to) / 2 + 12} ${LETTER_Y - 32} L${(from + to) / 2 - 12} ${LETTER_Y - 8}`}
        stroke="var(--tj-quiz-wrong)"
        strokeWidth={4}
      />
    )}
  </g>
)

/** A frame of separate letters/signs (never joined into a word), optional extras, and a sound line. */
const letters = (glyphs: Glyph[], say: Bilingual, extra?: ReactNode) => () => (
  <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" className="anim-svg hafs-frame">
    {glyphs.map(glyph)}
    {extra}
    <Say text={say} />
  </svg>
)

/**
 * A scale between two sounds (right: where the vowel starts, left: where it leans to) with a marker
 * that slides from the start to `to` (0-1 of the way) as the step plays.
 */
const scaleFrame =
  (ends: { from: string; to: string }, to: number, names: { from: Bilingual; to: Bilingual }, say: Bilingual) =>
  (progress: number) => {
    const [right, left] = [410, 90]
    const x = lerp(right, left, to * progress)
    return (
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" className="anim-svg hafs-frame">
        {glyph({ text: ends.from, x: right, y: 80 }, 0)}
        {glyph({ text: ends.to, x: left, y: 80 }, 1)}
        <line x1={left} y1={115} x2={right} y2={115} stroke={MUTED} strokeWidth={4} strokeLinecap="round" />
        <circle cx={x} cy={115} r={12} fill={SPECIAL} data-lean={Math.round(to * progress * 100)} />
        <SayEnds from={names.from} to={names.to} left={left} right={right} />
        <Say text={say} />
      </svg>
    )
  }

// eslint-disable-next-line react/only-export-components
function SayEnds({ from, to, left, right }: { from: Bilingual; to: Bilingual; left: number; right: number }) {
  const { t } = useLocale()
  return (
    <>
      <text x={right} y={150} textAnchor="middle" className="hafs-sound">
        {t(from)}
      </text>
      <text x={left} y={150} textAnchor="middle" className="hafs-sound">
        {t(to)}
      </text>
    </>
  )
}

/** A step showing a recited Quran word (its text comes from the fetched data), with a note under it. */
const listenFrame = (key: (typeof CLIP_WORDS)[keyof typeof CLIP_WORDS], say: Bilingual) => () => (
  <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" className="anim-svg hafs-frame">
    <text x={VIEW_W / 2} y={LETTER_Y} textAnchor="middle" className="anim-word">
      {getWord(key)?.text}
    </text>
    <Say text={say} />
  </svg>
)

const LISTEN: Bilingual = { ar: 'استمع', en: 'Listen' }

/* ---------------------------------------------------------------- sakt */

/** The small high seen (U+06DC), the mushaf's sakt sign, and also the "read with seen" sign over a sad. */
const SMALL_SEEN_ABOVE = 'ۜ'
/** The small low seen (U+06E3): under a sad, "either way, sad first". */
const SMALL_SEEN_BELOW = 'ۣ'

/**
 * Two runs of voice with a gap between them (reading order right to left). The gap grows to its
 * length as the step plays; `breath` marks a stop (waqf) instead of a sakt.
 */
const voiceGap = (breath: boolean) => (progress: number) => {
  const gap = (breath ? 170 : 80) * clamp01(progress)
  const firstStart = 470
  const firstEnd = 300
  const secondStart = firstEnd - gap
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" className="anim-svg hafs-frame">
      <rect x={firstEnd} y={80} width={firstStart - firstEnd} height={36} rx={18} fill={TEXT} opacity={0.75} />
      <rect x={Math.max(30, secondStart - 140)} y={80} width={Math.min(140, secondStart - 30)} height={36} rx={18} fill={TEXT} opacity={0.75} />
      <rect
        x={secondStart}
        y={80}
        width={gap}
        height={36}
        fill="none"
        stroke={breath ? MUTED : SPECIAL}
        strokeWidth={3}
        strokeDasharray="6 6"
        data-gap={breath ? 'waqf' : 'sakt'}
      />
      <Say
        y={155}
        text={
          breath
            ? { ar: 'وقف: الصوت ينقطع وتتنفّس', en: 'Stop: the voice ends and you breathe' }
            : { ar: 'سكت: نحو حركتين، بلا نفَس', en: 'Sakt: about two counts, no breath' }
        }
      />
      <Say
        text={
          breath
            ? { ar: 'ثم تبدأ من جديد', en: 'then you start again' }
            : { ar: 'ثم تُكمل بالنفَس نفسه', en: 'then carry on with the same breath' }
        }
      />
    </svg>
  )
}

const SAKT_STEPS: ClipStep[] = [
  {
    duration: EXPLAIN_MS,
    label: { ar: 'العلامة', en: 'The sign' },
    caption: {
      ar: 'السين الصغيرة فوق آخر الكلمة في المصحف تعني: اسكت هنا سكتة لطيفة.',
      en: 'In the mushaf, a small seen over the end of a word means: make a short pause here.',
    },
    render: letters([{ text: SMALL_SEEN_ABOVE, x: VIEW_W / 2, color: SPECIAL, role: 'special' }], {
      ar: 'علامة السكت',
      en: 'The sakt sign',
    }),
  },
  {
    duration: EXPLAIN_MS,
    label: { ar: 'السكت', en: 'Sakt' },
    caption: {
      ar: 'يقطع القارئ صوته قليلًا — نحو حركتين — ولا يتنفّس، ثم يُكمل.',
      en: 'The reciter cuts the voice briefly — about two counts — without breathing, then carries on.',
    },
    render: voiceGap(false),
  },
  {
    duration: EXPLAIN_MS,
    label: { ar: 'الفرق عن الوقف', en: 'Not a stop' },
    caption: {
      ar: 'الوقف أطول ومعه تنفّس. أما السكت فقصير بلا نفَس.',
      en: 'A stop is longer and comes with a breath. A sakt is short, with no breath.',
    },
    render: voiceGap(true),
  },
  {
    duration: EXPLAIN_MS,
    label: { ar: 'لا إدغام', en: 'No merging' },
    caption: {
      ar: 'في القيامة ٢٧: تُنطق النون الساكنة واضحة، ثم سكتة، ثم الراء — فلا تُدغم النون في الراء.',
      en: 'In al-Qiyamah 27: say the sakin noon clearly, pause, then the ra — the noon does not merge into the ra.',
    },
    render: letters(
      [
        { text: 'نْ', x: 330, color: SPECIAL, role: 'special' },
        { text: 'رَ', x: 170 },
      ],
      { ar: 'نْ … (سكتة) … رَ', en: 'n … (pause) … ra' },
      arrow(290, 210, true),
    ),
  },
  {
    duration: EXPLAIN_MS,
    label: { ar: 'لا إدغام', en: 'No merging' },
    caption: {
      ar: 'وفي المطففين ١٤: تُنطق اللام الساكنة واضحة، ثم سكتة، ثم الراء — فلا تُدغم اللام في الراء.',
      en: 'In al-Mutaffifin 14: say the sakin lam clearly, pause, then the ra — the lam does not merge into the ra.',
    },
    render: letters(
      [
        { text: 'لْ', x: 330, color: SPECIAL, role: 'special' },
        { text: 'رَ', x: 170 },
      ],
      { ar: 'لْ … (سكتة) … رَ', en: 'l … (pause) … ra' },
      arrow(290, 210, true),
    ),
  },
]

/** The four saktat of Hafs: the sign, what a sakt is, how it differs from a stop, and the merges it prevents. */
export const hafsSakt: Clip = {
  title: { ar: 'السكت: سكتة لطيفة بلا نفَس', en: 'Sakt: a short pause without a breath' },
  steps: SAKT_STEPS,
}

/* ---------------------------------------------------------------- imalah */

/** The small low diamond (U+06EA) the mushaf puts under the ra of Hud 41. */
const IMALAH_SIGN = '۪'

/** Hafs's one imalah: the sign under the ra, then the fatha leaning toward a kasra. */
export const hafsImalah: Clip = {
  title: { ar: 'الإمالة: الفتحة تميل نحو الكسرة', en: 'Imalah: the fatha leans toward a kasra' },
  steps: [
    {
      duration: EXPLAIN_MS,
      label: { ar: 'العلامة', en: 'The sign' },
      caption: {
        ar: 'في هود ٤١ تحت الراء معيَّن صغير: علامة الإمالة، الوحيدة في رواية حفص.',
        en: 'In Hud 41 a small diamond sits under the ra: the imalah sign, the only one in the Hafs reading.',
      },
      render: letters([{ text: 'ر' + IMALAH_SIGN, x: VIEW_W / 2, color: SPECIAL, role: 'special' }], {
        ar: 'راء عليها علامة الإمالة',
        en: 'A ra with the imalah sign',
      }),
    },
    {
      duration: EXPLAIN_MS,
      label: { ar: 'الميل', en: 'The lean' },
      caption: {
        ar: 'تميل بالفتحة نحو الكسرة وبالألف نحو الياء: صوت قريب من الكسر دون أن يصير كسرة خالصة. والراء هنا مرقّقة.',
        en: 'Lean the fatha toward a kasra and the alif toward a ya: a sound close to "i" without becoming a pure "i". The ra is light here.',
      },
      render: scaleFrame(
        { from: 'رَا', to: 'رِي' },
        0.7,
        { from: { ar: 'فتح', en: 'a' }, to: { ar: 'كسر', en: 'i' } },
        { ar: 'الإمالة: بين الفتح والكسر، أقرب إلى الكسر', en: 'Imalah: between a and i, nearer to i' },
      ),
    },
  ],
}

/* ---------------------------------------------------------------- tas-hil */

/** The second of two hamzas eased: first in full, then between a hamza and an alif. */
export const hafsTashil: Clip = {
  title: { ar: 'التسهيل: همزة بين الهمزة والألف', en: 'Tas-hil: a hamza between a hamza and an alif' },
  steps: [
    {
      duration: EXPLAIN_MS,
      label: { ar: 'همزتان', en: 'Two hamzas' },
      caption: {
        ar: 'في فصلت ٤٤ همزتان متتاليتان: الأولى تُنطق محقَّقة كاملة، والثانية (الملوّنة) تُسهَّل.',
        en: 'Fussilat 44 has two hamzas in a row: the first is said in full, the second (colored) is eased.',
      },
      render: letters(
        [
          { text: 'ءَ', x: 320 },
          { text: 'ءَ', x: 180, color: SPECIAL, role: 'special' },
        ],
        { ar: 'الأولى محقَّقة، والثانية مسهَّلة', en: 'The first in full, the second eased' },
      ),
    },
    {
      duration: EXPLAIN_MS,
      label: { ar: 'التسهيل', en: 'Easing' },
      caption: {
        ar: 'تُنطق الثانية بين الهمزة والألف: بلا نبرة الهمزة، ولا تُمدّ ألفًا.',
        en: 'Say the second between a hamza and an alif: without the hamza’s catch, and without stretching it into an alif.',
      },
      render: scaleFrame(
        { from: 'ء', to: 'ا' },
        0.5,
        { from: { ar: 'همزة', en: 'hamza' }, to: { ar: 'ألف', en: 'alif' } },
        { ar: 'بين بين: في المنتصف', en: 'Halfway between the two' },
      ),
    },
  ],
}

/* ---------------------------------------------------------------- ishmam and rawm */

/** Front view of the lips, rounding (narrower, rounder) as `round` goes from 0 to 1. */
const lips = (round: number) => {
  const rx = lerp(70, 30, round)
  const ry = lerp(14, 26, round)
  return (
    <ellipse cx={VIEW_W / 2} cy={70} rx={rx} ry={ry} fill="none" stroke={SPECIAL} strokeWidth={6} data-lips={round >= 1 ? 'rounded' : 'opening'} />
  )
}

export const hafsIshmam: Clip = {
  title: { ar: 'الإشمام والروم', en: 'Ishmam and rawm' },
  steps: [
    {
      duration: EXPLAIN_MS,
      label: { ar: 'نونان', en: 'Two noons' },
      caption: {
        ar: 'أصل الكلمة في يوسف ١١ نونان: الأولى مضمومة والثانية مفتوحة. في الإشمام تُدغم الأولى في الثانية فتصيران نونًا مشدّدة.',
        en: 'The word in Yusuf 11 is built on two noons: the first with a damma, the second with a fatha. With ishmam the first merges into the second, making one doubled noon.',
      },
      render: (progress) =>
        letters(
          [
            { text: 'نُ', x: lerp(330, 250, progress), opacity: 1 - clamp01(progress) },
            { text: 'نَ', x: lerp(170, 250, progress), opacity: 1 - clamp01(progress) },
            { text: 'نَّ', x: 250, opacity: clamp01(progress), color: SPECIAL, role: 'special' },
          ],
          { ar: 'نُ + نَ ← نَّ', en: 'nu + na → nna' },
        )(),
    },
    {
      duration: EXPLAIN_MS,
      label: { ar: 'الإشمام', en: 'Ishmam' },
      caption: {
        ar: 'مع الإدغام تضمّ شفتيك إشارةً إلى الضمة المحذوفة، ولا يخرج لذلك صوت: يُرى ولا يُسمع. وهو الوجه الأشهر.',
        en: 'As you merge, round your lips to point at the lost damma, with no sound from it: it is seen, not heard. This is the more common way.',
      },
      render: (progress) => (
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" className="anim-svg hafs-frame">
          {lips(clamp01(progress))}
          {glyph({ text: 'نَّ', x: VIEW_W / 2, y: 160, color: SPECIAL, role: 'special' }, 0)}
          <Say text={{ ar: 'ضمّ الشفتين بلا صوت', en: 'Lips rounded, no sound' }} />
        </svg>
      ),
    },
    {
      duration: EXPLAIN_MS,
      label: { ar: 'الروم', en: 'Rawm' },
      caption: {
        ar: 'الوجه الآخر: تنطق النون الأولى ببعض الضمة (نحو ثلثها) بصوت خفيّ، ثم النون الثانية، فلا يتمّ الإدغام.',
        en: 'The other way: say the first noon with part of its damma (about a third), softly, then the second noon, so the merge is not complete.',
      },
      render: letters(
        [
          { text: 'نُ', x: 320, color: SPECIAL, opacity: 0.45, role: 'rawm' },
          { text: 'نَ', x: 180 },
        ],
        { ar: 'بعض الضمة بصوت خفيّ، ثم نَ', en: 'part of the damma, softly, then na' },
      ),
    },
  ],
}

/* ---------------------------------------------------------------- sad and seen */

const HEAVY = 'var(--tj-tafkheem)'
const LIGHT = 'var(--tj-tarqeeq)'

export const hafsSadSeen: Clip = {
  title: { ar: 'الصاد والسين', en: 'Sad or seen' },
  steps: [
    {
      duration: EXPLAIN_MS,
      label: { ar: 'حرفان متقاربان', en: 'Two close letters' },
      caption: {
        ar: 'الصاد والسين من مخرج واحد وكلاهما صفير، لكن الصاد مفخّمة والسين مرقّقة.',
        en: 'Sad and seen come from the same place and both whistle, but sad is heavy and seen is light.',
      },
      render: letters(
        [
          { text: 'ص', x: 320, color: HEAVY },
          { text: 'س', x: 180, color: LIGHT },
        ],
        { ar: 'صاد مفخّمة — سين مرقّقة', en: 'Sad: heavy — seen: light' },
      ),
    },
    {
      duration: EXPLAIN_MS,
      label: { ar: 'سين فوقها', en: 'Seen above' },
      caption: {
        ar: 'سين صغيرة فوق الصاد: تُقرأ سينًا فقط (البقرة ٢٤٥، الأعراف ٦٩).',
        en: 'A small seen over the sad: read it as a seen only (al-Baqarah 245, al-Aʿraf 69).',
      },
      render: letters(
        [
          { text: 'ص' + SMALL_SEEN_ABOVE, x: 340, color: SPECIAL, role: 'special' },
          { text: 'س', x: 160, color: LIGHT, role: 'read' },
        ],
        { ar: 'تُقرأ: سين', en: 'Read: seen' },
        arrow(300, 200),
      ),
    },
    {
      duration: EXPLAIN_MS,
      label: { ar: 'سين تحتها', en: 'Seen below' },
      caption: {
        ar: 'سين صغيرة تحت الصاد: يجوز الوجهان، والصاد أشهر (الطور ٣٧).',
        en: 'A small seen under the sad: either way is allowed, sad being the more common (at-Tur 37).',
      },
      render: letters(
        [
          { text: 'ص' + SMALL_SEEN_BELOW, x: 360, color: SPECIAL, role: 'special' },
          { text: 'ص', x: 190, color: HEAVY, role: 'read' },
          { text: 'س', x: 110, color: LIGHT, role: 'read' },
        ],
        { ar: 'تُقرأ: صاد (أشهر) أو سين', en: 'Read: sad (more common) or seen' },
        arrow(320, 230),
      ),
    },
    {
      duration: EXPLAIN_MS,
      label: { ar: 'بلا علامة', en: 'No sign' },
      caption: {
        ar: 'صاد بلا علامة: تُقرأ صادًا فقط (الغاشية ٢٢).',
        en: 'A sad with no sign: read it as a sad only (al-Ghashiyah 22).',
      },
      render: letters(
        [
          { text: 'ص', x: 340, color: SPECIAL, role: 'special' },
          { text: 'ص', x: 160, color: HEAVY, role: 'read' },
        ],
        { ar: 'تُقرأ: صاد', en: 'Read: sad' },
        arrow(300, 200),
      ),
    },
    {
      duration: LISTEN_MS,
      label: LISTEN,
      caption: {
        ar: 'استمع إلى الكلمة الرابعة عشرة من البقرة ٢٤٥: كُتبت بالصاد وتُقرأ بالسين.',
        en: 'Hear the fourteenth word of al-Baqarah 245: written with a sad, read with a seen.',
      },
      audio: { word: CLIP_WORDS.readSeen },
      render: listenFrame(CLIP_WORDS.readSeen, { ar: 'تُقرأ بالسين', en: 'Read with a seen' }),
    },
    {
      duration: LISTEN_MS,
      label: LISTEN,
      caption: {
        ar: 'ثم الكلمة الثالثة من الغاشية ٢٢: تُقرأ بالصاد.',
        en: 'Then the third word of al-Ghashiyah 22: read with a sad.',
      },
      audio: { word: CLIP_WORDS.readSad },
      render: listenFrame(CLIP_WORDS.readSad, { ar: 'تُقرأ بالصاد', en: 'Read with a sad' }),
    },
  ],
}

/* ---------------------------------------------------------------- starting at the word of 49:11 */

const WASLA = 'ٱ'

/** The word's pieces in reading order: the article's wasl hamza, the lam, the word's own wasl hamza. */
const ismPieces = (first: 'dropped' | 'fatha' | 'none') =>
  letters(
    [
      ...(first === 'none'
        ? []
        : [first === 'fatha' ? { text: 'أَ', x: 380, role: 'start' } : { text: WASLA, x: 380, color: MUTED, opacity: 0.4, role: 'dropped' }]),
      { text: 'لِ', x: 280, color: SPECIAL, role: 'special' },
      { text: WASLA, x: 190, color: MUTED, opacity: 0.4, role: 'dropped' },
      { text: '…', x: 110, color: MUTED },
    ],
    first === 'dropped'
      ? { ar: 'وصلًا: …ـلِ… (الهمزتان لا تُنطقان)', en: 'Reading on: …li… (neither hamza is said)' }
      : first === 'fatha'
        ? { ar: 'ابتداءً: أَلِ… (المقدَّم)', en: 'Starting: a-li… (preferred)' }
        : { ar: 'ابتداءً: لِ…', en: 'Starting: li…' },
  )

export const hafsIsm: Clip = {
  title: { ar: 'البدء بكلمة الحجرات ١١', en: 'Starting at the word in al-Hujurat 11' },
  steps: [
    {
      duration: EXPLAIN_MS,
      label: { ar: 'عند الوصل', en: 'Reading on' },
      caption: {
        ar: 'عند الوصل بما قبلها لا تُنطق همزتا الوصل (الباهتتان)، وتُقرأ اللام الملوّنة مكسورة.',
        en: 'Joined to the word before, neither wasl hamza (the faded ones) is said, and the colored lam is read with a kasra.',
      },
      render: ismPieces('dropped'),
    },
    {
      duration: EXPLAIN_MS,
      label: { ar: 'البدء: الوجه الأول', en: 'Starting: first way' },
      caption: {
        ar: 'إن بدأتَ بالكلمة: همزة مفتوحة ثم اللام المكسورة. وهو المقدَّم.',
        en: 'Starting at the word: a hamza with a fatha, then the lam with its kasra. This is the preferred way.',
      },
      render: ismPieces('fatha'),
    },
    {
      duration: EXPLAIN_MS,
      label: { ar: 'البدء: الوجه الثاني', en: 'Starting: second way' },
      caption: {
        ar: 'أو تبدأ باللام المكسورة مباشرة، بلا همزة.',
        en: 'Or begin straight on the lam with its kasra, with no hamza.',
      },
      render: ismPieces('none'),
    },
    {
      duration: LISTEN_MS,
      label: LISTEN,
      caption: {
        ar: 'استمع إلى الكلمة الثلاثين من الحجرات ١١ موصولةً بما قبلها: اللام المكسورة بلا همزة.',
        en: 'Hear the thirtieth word of al-Hujurat 11, joined to the word before: the lam with its kasra, no hamza.',
      },
      audio: { word: CLIP_WORDS.ismJoined },
      render: listenFrame(CLIP_WORDS.ismJoined, { ar: 'موصولة بما قبلها', en: 'Joined to the word before' }),
    },
  ],
}
