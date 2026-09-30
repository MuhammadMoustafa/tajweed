import type { Bilingual } from '../i18n/bilingual'
import { SOUND_IPA, VOWELS, type MouthShape, type Vowel } from '../lessons/vowels'
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
        {mouth && <Mouth shape={mouth.shape} />}
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

/** A front view of the mouth: wide open, lips gathered and rounded, or jaw lowered with lips spread. */
// eslint-disable-next-line react/only-export-components
function Mouth({ shape }: { shape: MouthShape }) {
  const face = { stroke: 'var(--text)', strokeWidth: 4 } as const
  return (
    <g data-mouth={shape} transform="translate(380 105)">
      {shape === 'open' && <ellipse rx={38} ry={44} fill="var(--accent)" fillOpacity={0.35} {...face} />}
      {shape === 'round' && (
        <>
          <circle r={20} fill="var(--accent)" fillOpacity={0.35} {...face} />
          <circle r={34} fill="none" {...face} strokeDasharray="4 6" />
        </>
      )}
      {shape === 'lowered' && (
        <>
          <path d="M -58 -10 Q 0 -22 58 -10 Q 0 34 -58 -10 Z" fill="var(--accent)" fillOpacity={0.35} {...face} />
          <path d="M -30 46 Q 0 58 30 46" fill="none" {...face} strokeDasharray="4 6" />
        </>
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
    step('sukun', `أَبْ ${SOUND_IPA.ab}`, { ar: 'السكون', en: 'Sukun' }, {
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
    step('fathatan', `بً ${SOUND_IPA.an}`, { ar: 'تنوين الفتح', en: 'Tanween fath' }, {
      ar: 'تنوين الفتح: فتحتان فوق الحرف، وصوتهما /an/: نون ساكنة تُنطق ولا تُكتب.',
      en: 'Tanween fath: two fathas above the letter, giving /an/: a noon sakinah that is pronounced but not written.',
    }),
    step('dammatan', `بٌ ${SOUND_IPA.un}`, { ar: 'تنوين الضم', en: 'Tanween damm' }, {
      ar: 'تنوين الضم: ضمتان فوق الحرف، وصوتهما /un/.',
      en: 'Tanween damm: two dammas above the letter, giving /un/.',
    }),
    step('kasratan', `بٍ ${SOUND_IPA.in}`, { ar: 'تنوين الكسر', en: 'Tanween kasr' }, {
      ar: 'تنوين الكسر: كسرتان تحت الحرف، وصوتهما /in/.',
      en: 'Tanween kasr: two kasras below the letter, giving /in/.',
    }),
  ],
}
