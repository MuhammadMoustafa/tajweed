import type { Bilingual } from '../i18n/bilingual'
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
 * it lands the letter is drawn with the mark and the sound it gives (Latin transliteration) shows
 * underneath. At progress 1 (reduced motion) only the landed letter and the sound remain.
 */
function frame(mark: MarkName, sound: string, extra?: string) {
  return (step: number) => {
    const t = Math.min(1, step / LAND)
    const from = BELOW.includes(mark) ? 70 : -70
    const landed = step >= LAND
    return (
      <svg viewBox="0 0 500 230" aria-hidden="true" className="anim-svg foundations-frame" data-mark={mark}>
        {landed ? (
          <text x={250} y={110} textAnchor="middle" dominantBaseline="central" className="anim-letter" fill="var(--tj-qalqalah)" data-landed>
            {LETTER + MARKS[mark]}
          </text>
        ) : (
          <>
            <text x={250} y={110} textAnchor="middle" dominantBaseline="central" className="anim-letter" fill="var(--text)">
              {LETTER}
            </text>
            <text
              x={250}
              y={110 + from * (1 - t)}
              textAnchor="middle"
              dominantBaseline="central"
              className="anim-letter"
              fill="var(--tj-qalqalah)"
              opacity={0.4 + 0.6 * t}
            >
              {'\u25CC' + MARKS[mark]}
            </text>
          </>
        )}
        {landed && (
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

export const foundationsHarakat: Clip = {
  title: { ar: 'الحركات الثلاث', en: 'The three harakat' },
  steps: [
    step('fatha', 'ba', { ar: 'الفتحة', en: 'Fatha' }, {
      ar: 'الفتحة: خط صغير مائل فوق الحرف، وتعطيه صوت «a» القصير: بَ.',
      en: 'Fatha: a small slanted stroke above the letter. It gives the short "a" sound: ba.',
    }),
    step('damma', 'bu', { ar: 'الضمة', en: 'Damma' }, {
      ar: 'الضمة: واو صغيرة فوق الحرف، وتعطيه صوت «u» القصير: بُ.',
      en: 'Damma: a small waw-like curl above the letter. It gives the short "u" sound: bu.',
    }),
    step('kasra', 'bi', { ar: 'الكسرة', en: 'Kasra' }, {
      ar: 'الكسرة: خط صغير مائل تحت الحرف، وتعطيه صوت «i» القصير: بِ.',
      en: 'Kasra: a small slanted stroke below the letter. It gives the short "i" sound: bi.',
    }),
  ],
}

export const foundationsSukunShadda: Clip = {
  title: { ar: 'السكون والشدّة', en: 'Sukun and shaddah' },
  steps: [
    step('sukun', 'b', { ar: 'السكون', en: 'Sukun' }, {
      ar: 'السكون: دائرة صغيرة فوق الحرف، معناها أنه بلا حركة؛ يُنطق الحرف وحده ويلتصق بما قبله، مثل «ab».',
      en: 'Sukun: a small circle above the letter. It means no vowel: the letter is said on its own, joined to the vowel before it, like "ab".',
    }),
    step('shadda', 'b + b', { ar: 'الشدّة', en: 'Shaddah' }, {
      ar: 'الشدّة: علامة كرأس السين فوق الحرف، معناها حرفان: الأول ساكن والثاني متحرك. تضغط على الحرف كأنك تنطقه مرتين.',
      en: 'Shaddah: a small mark shaped like a "w" above the letter. It means the letter is doubled: the first has a sukun, the second a vowel. Press on it as if saying it twice.',
    }),
  ],
}

export const foundationsTanween: Clip = {
  title: { ar: 'التنوين', en: 'Tanween' },
  steps: [
    step('fathatan', 'ban', { ar: 'تنوين الفتح', en: 'Tanween fath' }, {
      ar: 'تنوين الفتح: فتحتان فوق الحرف، وصوتهما «an»: نون ساكنة تُنطق ولا تُكتب.',
      en: 'Tanween fath: two fathas above the letter, giving "an": a noon sakinah that is pronounced but not written.',
    }),
    step('dammatan', 'bun', { ar: 'تنوين الضم', en: 'Tanween damm' }, {
      ar: 'تنوين الضم: ضمتان فوق الحرف، وصوتهما «un».',
      en: 'Tanween damm: two dammas above the letter, giving "un".',
    }),
    step('kasratan', 'bin', { ar: 'تنوين الكسر', en: 'Tanween kasr' }, {
      ar: 'تنوين الكسر: كسرتان تحت الحرف، وصوتهما «in».',
      en: 'Tanween kasr: two kasras below the letter, giving "in".',
    }),
  ],
}
