import { useId } from 'react'
import type { Bilingual } from '../i18n/bilingual'
import { SOUNDS, soundText, VOWELS, type MouthShape, type Vowel } from '../lessons/vowels'
import type { Clip, ClipStep } from './player/clip'

/** Combining marks, by Unicode code point (not Quran text): a mark drawn on the bare letter ب. */
export const MARKS = {
  fatha: '\u064E',
  damma: '\u064F',
  kasra: '\u0650',
  sukun: '\u0652',
  shadda: '\u0651',
  fathatan: '\u064B',
  dammatan: '\u064C',
  kasratan: '\u064D',
} as const
export type MarkName = keyof typeof MARKS

const LETTER = 'ب'
/** A mark below the letter (kasra, kasratan) lands from underneath; every other one from above. */
const BELOW: readonly MarkName[] = ['kasra', 'kasratan']
export const STEP_MS = 3500
/** Share of a step the mark spends travelling before it settles on the letter. */
const LAND = 0.5

/**
 * Frame: the bare letter with the mark's own glyph (on a dotted circle) travelling onto it; once
 * it lands the letter is drawn with the mark and the sound it gives (the syllable and its IPA)
 * shows underneath. A haraka's frame also draws the mouth shape beside the letter, with the
 * everyday word under the letter and the IPA under the mouth. At progress 1 (reduced motion) only
 * the landed letter, the mouth and the sound remain.
 */
function frame(mark: MarkName, sound: string, extra?: string, mouth?: { shape: MouthShape; word: string; ipa: string }) {
  const cx = mouth ? 150 : 250
  return (step: number) => {
    const t = Math.min(1, step / LAND)
    const from = BELOW.includes(mark) ? 70 : -70
    const landed = step >= LAND
    return (
      <svg viewBox="0 0 500 230" aria-hidden="true" className="anim-svg foundations-frame" data-mark={mark}>
        {mouth && <Mouth shape={mouth.shape} t={t} />}
        {landed ? (
          <text x={cx} y={110} textAnchor="middle" dominantBaseline="central" className="anim-letter" fill="var(--accent)" data-landed>
            {LETTER + MARKS[mark]}
          </text>
        ) : (
          <>
            <text x={cx} y={110} textAnchor="middle" dominantBaseline="central" className="anim-letter" fill="var(--text)">
              {LETTER}
            </text>
            <text
              x={cx}
              y={110 + from * (1 - t)}
              textAnchor="middle"
              dominantBaseline="central"
              className="anim-letter"
              fill="var(--accent)"
              opacity={0.4 + 0.6 * t}
            >
              {'\u25CC' + MARKS[mark]}
            </text>
          </>
        )}
        {landed && mouth && (
          // Two texts, not one line: a line mixing Arabic and Latin would reorder under bidi.
          <g data-sound fontSize={28} fill="var(--text)" textAnchor="middle">
            <text x={cx} y={205}>{mouth.word}</text>
            <text x={380} y={205} direction="ltr">{mouth.ipa}</text>
          </g>
        )}
        {landed && !mouth && (
          <text x={250} y={200} textAnchor="middle" fontSize={30} fill="var(--text)" data-sound>
            {sound}
            {extra ? `  ${extra}` : ''}
          </text>
        )}
      </svg>
    )
  }
}

const step = (
  mark: MarkName,
  sound: string,
  label: Bilingual,
  caption: Bilingual,
  extra?: string,
): ClipStep => {
  const draw = frame(mark, sound, extra)
  return { duration: STEP_MS, label, caption, render: draw }
}

/** Half-width and half-height of the opening between the lips, the lips' thickness, and whether
 *  the jaw drops (an arrow under the chin). Closed is where every shape starts. */
const MOUTHS: Record<MouthShape | 'closed', { w: number; h: number; lip: number; jaw?: boolean }> = {
  closed: { w: 42, h: 1, lip: 9 },
  open: { w: 40, h: 36, lip: 9 },
  round: { w: 17, h: 17, lip: 15 },
  lowered: { w: 58, h: 12, lip: 8, jaw: true },
}

/** A lens through (-w, 0) and (w, 0), bulging h above and below. */
const lens = (w: number, h: number) =>
  `M ${-w} 0 C ${-w / 2} ${-h * 1.33} ${w / 2} ${-h * 1.33} ${w} 0 C ${w / 2} ${h * 1.33} ${-w / 2} ${h * 1.33} ${-w} 0 Z`

/**
 * A front view of the lips, opening from closed into the haraka's shape as `t` goes 0 to 1: wide
 * open (fatha), gathered and rounded (damma), spread with the jaw lowered (kasra).
 */
// eslint-disable-next-line react/only-export-components
function Mouth({ shape, t }: { shape: MouthShape; t: number }) {
  const [from, to] = [MOUTHS.closed, MOUTHS[shape]]
  const [w, h, lip] = [from.w + (to.w - from.w) * t, from.h + (to.h - from.h) * t, from.lip + (to.lip - from.lip) * t]
  const clip = useId()
  return (
    <g data-mouth={shape} transform="translate(380 95)">
      <path d={lens(w + lip, h + lip)} fill="var(--anat-lip)" stroke="var(--anat-edge)" strokeWidth={3} />
      <clipPath id={clip}>
        <path d={lens(w, h)} />
      </clipPath>
      {/* The inside of the mouth, with the upper teeth showing at its top. */}
      <path d={lens(w, h)} fill="var(--anat-cavity)" />
      <rect x={-w} y={-h * 1.2} width={2 * w} height={h * 0.55} fill="var(--anat-teeth)" clipPath={`url(#${clip})`} />
      <path d={lens(w, h)} fill="none" stroke="var(--anat-edge)" strokeWidth={2} />
      {to.jaw && t > 0 && (
        <path d={`M 0 ${h + lip + 10} v ${22 * t} m -8 -8 l 8 8 l 8 -8`} fill="none" stroke="var(--accent)" strokeWidth={3} />
      )}
    </g>
  )
}

const harakaStep = (v: Vowel): ClipStep => ({
  duration: STEP_MS,
  label: v.label,
  caption: {
    ar: `${v.label.ar}: ${v.mouthDoes.ar}، وتعطي الحرف صوتًا قصيرًا ${v.ipa}: ${v.syllable}، كما تسمعه في ${v.word}.`,
    en: `${v.label.en}: ${v.mouthDoes.en}. It gives the letter the short sound ${v.ipa}: ${v.syllable}, as in ${v.word}, close to ${v.englishLike} (approximate).`,
  },
  render: frame(v.name, v.syllable, undefined, { shape: v.mouth, word: v.word, ipa: v.ipa }),
})

export const foundationsHarakat: Clip = {
  title: { ar: 'الحركات الثلاث', en: 'The three harakat' },
  steps: VOWELS.map(harakaStep),
}

export const foundationsSukun: Clip = {
  title: { ar: 'السكون', en: 'Sukun' },
  steps: [
    step('sukun', soundText(SOUNDS.sukun), { ar: 'السكون', en: 'Sukun' }, {
      ar: 'السكون: دائرة صغيرة فوق الحرف، معناها أنه بلا حركة؛ يُنطق الحرف وحده ويلتصق بما قبله، مثل أَبْ /ab/.',
      en: 'Sukun: a small circle above the letter. It means no vowel: the letter is said on its own, joined to the vowel before it, like /ab/.',
    }),
  ],
}

export const foundationsShadda: Clip = {
  title: { ar: 'الشدّة', en: 'Shaddah' },
  steps: [
    step('shadda', 'b + b', { ar: 'الشدّة', en: 'Shaddah' }, {
      ar: 'الشدّة: علامة كرأس السين فوق الحرف، معناها حرفان: الأول ساكن والثاني متحرك. تضغط على الحرف كأنك تنطقه مرتين.',
      en: 'Shaddah: a small mark shaped like a "w" above the letter. It means the letter is doubled: the first has a sukun, the second a vowel. Press on it as if saying it twice.',
    }),
  ],
}

export const foundationsTanween: Clip = {
  title: { ar: 'التنوين', en: 'Tanween' },
  steps: [
    step('fathatan', soundText(SOUNDS.fathatan), { ar: 'تنوين الفتح', en: 'Tanween fath' }, {
      ar: 'تنوين الفتح: فتحتان فوق الحرف، وصوتهما بً /an/: نون ساكنة تُنطق ولا تُكتب.',
      en: 'Tanween fath: two fathas above the letter, giving /an/: a noon sakinah that is pronounced but not written.',
    }),
    step('dammatan', soundText(SOUNDS.dammatan), { ar: 'تنوين الضم', en: 'Tanween damm' }, {
      ar: 'تنوين الضم: ضمتان فوق الحرف، وصوتهما بٌ /un/.',
      en: 'Tanween damm: two dammas above the letter, giving /un/.',
    }),
    step('kasratan', soundText(SOUNDS.kasratan), { ar: 'تنوين الكسر', en: 'Tanween kasr' }, {
      ar: 'تنوين الكسر: كسرتان تحت الحرف، وصوتهما بٍ /in/.',
      en: 'Tanween kasr: two kasras below the letter, giving /in/.',
    }),
  ],
}
