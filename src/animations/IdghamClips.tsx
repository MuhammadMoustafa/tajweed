import type { Bilingual } from '../i18n/bilingual'
import type { ColorToken } from '../tajweed/rules'
import type { Clip, ClipStep } from './player/clip'

// Single letters, not Quran text. Arabic reads right to left: the noon ends the first word (right)
// and the idgham letter begins the second word (left).
const FATHA = 'َ'
const SUKUN = 'ْ'
const SHADDA = 'ّ'
const NOON = 'ن'

const NOON_X = 350
const TARGET_X = 150
const Y = 80
/** The ghunnah bar: two counts, each COUNT_W wide, under the merged letter. */
const BAR_Y = 165
const COUNT_W = 70
const BAR_H = 22

const PAIR_MS = 2500
const MERGE_MS = 3000
/** Two counts at about a second each (as COUNT_MS in MaddBar.tsx). */
const GHUNNAH_MS = 2000
const NONE_MS = 2000

interface Kind {
  /** The next word's first letter. */
  letter: string
  token: ColorToken
  withGhunnah: boolean
  title: Bilingual
  pair: { label: Bilingual; caption: Bilingual }
  merge: { label: Bilingual; caption: Bilingual }
  end: { label: Bilingual; caption: Bilingual }
}

/** Both letters (carets), the noon sliding into the target, its shadda and, with ghunnah, the 2-count bar. */
function frame(kind: Kind, stage: 'pair' | 'merge' | 'end', progress: number) {
  const merged = stage === 'merge' ? progress : stage === 'end' ? 1 : 0
  const shadda = merged >= 0.85
  const noonX = NOON_X + (TARGET_X - NOON_X) * merged
  const color = `var(--tj-${kind.token})`
  const bar = stage === 'end' && kind.withGhunnah ? progress : 0
  return (
    <svg viewBox="0 0 500 230" aria-hidden="true" className="anim-svg idgham-frame" data-stage={stage}>
      {/* The gap between the two words. */}
      <line x1={250} y1={30} x2={250} y2={135} stroke="currentColor" strokeWidth={2} strokeDasharray="4 6" opacity={0.35} />
      <text
        x={noonX}
        y={Y}
        textAnchor="middle"
        dominantBaseline="central"
        className="anim-letter"
        fill={color}
        opacity={1 - merged}
        data-part="noon"
      >
        {NOON + SUKUN}
      </text>
      <text
        x={TARGET_X}
        y={Y}
        textAnchor="middle"
        dominantBaseline="central"
        className="anim-letter"
        fill={color}
        data-part="target"
      >
        {kind.letter + (shadda ? SHADDA : '') + FATHA}
      </text>
      {stage === 'pair' && (
        <>
          <path d={`M${NOON_X - 9} 150 L${NOON_X} 138 L${NOON_X + 9} 150 Z`} fill={color} data-part="noon-caret" />
          <path d={`M${TARGET_X - 9} 150 L${TARGET_X} 138 L${TARGET_X + 9} 150 Z`} fill={color} data-part="target-caret" />
        </>
      )}
      {stage === 'end' && kind.withGhunnah && (
        <g data-part="ghunnah-bar">
          <rect x={TARGET_X - COUNT_W} y={BAR_Y} width={COUNT_W * 2} height={BAR_H} rx={6} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
          <rect x={TARGET_X - COUNT_W} y={BAR_Y} width={COUNT_W * 2 * bar} height={BAR_H} rx={6} fill={color} data-fill={bar} />
          <line x1={TARGET_X} y1={BAR_Y - 4} x2={TARGET_X} y2={BAR_Y + BAR_H + 4} stroke="currentColor" strokeWidth={2} opacity={0.5} />
        </g>
      )}
      {stage === 'end' && !kind.withGhunnah && (
        <line
          x1={TARGET_X - COUNT_W}
          y1={BAR_Y + BAR_H / 2}
          x2={TARGET_X + COUNT_W}
          y2={BAR_Y + BAR_H / 2}
          stroke={color}
          strokeWidth={3}
          strokeDasharray="4 6"
          opacity={0.5}
          data-part="no-ghunnah"
        />
      )}
    </svg>
  )
}

const build = (kind: Kind): Clip => {
  const steps: ClipStep[] = [
    { duration: PAIR_MS, ...kind.pair, render: () => frame(kind, 'pair', 1) },
    { duration: MERGE_MS, ...kind.merge, render: (progress) => frame(kind, 'merge', progress) },
    {
      duration: kind.withGhunnah ? GHUNNAH_MS : NONE_MS,
      ...kind.end,
      render: (progress) => frame(kind, 'end', progress),
    },
  ]
  return { title: kind.title, steps }
}

/** Ya after the noon (one of ينمو): the noon merges, the letter is doubled and a 2-count ghunnah stays. */
export const idghamGhunnah: Clip = build({
  letter: 'ي',
  token: 'ghunnah',
  withGhunnah: true,
  title: { ar: 'الإدغام بغنّة', en: 'Idgham with ghunnah' },
  pair: {
    label: { ar: 'الحرفان', en: 'The two letters' },
    caption: {
      ar: 'النون الساكنة في آخر الكلمة الأولى، والياء في أول الكلمة التالية. الياء واحدة من حروف «ينمو».',
      en: 'A noon with a sukun ends the first word, and the ya begins the next word. Ya is one of the letters of "ينمو".',
    },
  },
  merge: {
    label: { ar: 'تدخل النون في الحرف', en: 'The noon enters the letter' },
    caption: {
      ar: 'تنزلق النون إلى الياء، فيُنطق الحرفان حرفًا واحدًا مشدَّدًا.',
      en: 'The noon slips into the ya, and the two are said as one letter with a shadda.',
    },
  },
  end: {
    label: { ar: 'تبقى الغنّة', en: 'The ghunnah stays' },
    caption: {
      ar: 'يبقى صوت الخيشوم مع الحرف المشدَّد مقدار حركتين: عُدَّ واحدة، اثنتين.',
      en: 'The nasal hum stays with the doubled letter for two counts: count one, two.',
    },
  },
})

/** Lam after the noon: the noon disappears completely and the lam is doubled, with no ghunnah. */
export const idghamWoGhunnah: Clip = build({
  letter: 'ل',
  token: 'silent',
  withGhunnah: false,
  title: { ar: 'الإدغام بلا غنّة', en: 'Idgham without ghunnah' },
  pair: {
    label: { ar: 'الحرفان', en: 'The two letters' },
    caption: {
      ar: 'النون الساكنة في آخر الكلمة الأولى، واللام في أول الكلمة التالية. اللام والراء وحدهما يُدغَم فيهما بلا غنّة.',
      en: 'A noon with a sukun ends the first word, and the lam begins the next word. Only lam and ra take idgham without ghunnah.',
    },
  },
  merge: {
    label: { ar: 'تدخل النون في الحرف', en: 'The noon enters the letter' },
    caption: {
      ar: 'تختفي النون تمامًا في اللام، ويُنطق اللام مشدَّدًا.',
      en: 'The noon disappears completely into the lam, and the lam is said with a shadda.',
    },
  },
  end: {
    label: { ar: 'لا غنّة', en: 'No ghunnah' },
    caption: {
      ar: 'لا غنّة هنا: لا يبقى من النون أي صوت في الخيشوم، فلا حركتين للغنّة.',
      en: 'No ghunnah here: nothing of the noon stays in the nose, so there is no two-count hum.',
    },
  },
})
