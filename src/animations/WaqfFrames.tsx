import type { Bilingual } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'

// The frames of the waqf clips (Waqf.tsx), split out so this file only exports components.

const BASE = 'ـ'

export interface SignInfo {
  glyph: string
  label: Bilingual
  caption: Bilingual
  /** Draws the glyph twice, joined by a dashed arc: a muʿanaqah pair. */
  pair?: boolean
}

export interface StopChange {
  /** Practice syllables (a consonant + harakah or tanween), never Quran text. */
  before: string
  after: string
  label: Bilingual
  caption: Bilingual
}

/** A sign drawn large in the waqf color, under a pointer; a pair is joined by a dashed arc. */
export function SignFrame({ sign }: { sign: SignInfo }) {
  const { t } = useLocale()
  const xs = sign.pair ? [340, 160] : [250]
  return (
    <svg viewBox="0 0 500 230" aria-hidden="true" className="anim-svg waqf-sign-frame">
      {sign.pair && <path d="M340 62 Q250 12 160 62" fill="none" stroke="var(--tj-waqf)" strokeWidth={3} strokeDasharray="6 6" />}
      {xs.map((x) => (
        <g key={x}>
          <text x={x} y={110} textAnchor="middle" dominantBaseline="central" className="anim-letter" fill="var(--tj-waqf)" data-glyph>
            {BASE + sign.glyph}
          </text>
          <path d={`M${x - 9} 160 L${x} 148 L${x + 9} 160 Z`} fill="var(--tj-waqf)" />
        </g>
      ))}
      <text x={250} y={200} textAnchor="middle" dominantBaseline="central" fill="var(--text)" fontSize={22} data-sign-label>
        {t(sign.label)}
      </text>
    </svg>
  )
}

/** Before, an arrow, after: the arrow and the after form grow in as the step plays (the end frame shows both). */
export function ChangeFrame({ change, progress }: { change: StopChange; progress: number }) {
  const { t } = useLocale()
  const p = Math.min(1, Math.max(0, progress))
  return (
    <svg viewBox="0 0 500 230" aria-hidden="true" className="anim-svg waqf-stop-frame">
      <text x={350} y={90} textAnchor="middle" dominantBaseline="central" className="anim-letter" fill="var(--text)" data-before>
        {change.before}
      </text>
      <path d={`M300 90 L${300 - 100 * p} 90`} stroke="var(--tj-waqf)" strokeWidth={4} strokeLinecap="round" />
      <path d="M200 90 L212 80 M200 90 L212 100" stroke="var(--tj-waqf)" strokeWidth={4} strokeLinecap="round" opacity={p} />
      <text x={130} y={90} textAnchor="middle" dominantBaseline="central" className="anim-letter" fill="var(--tj-waqf)" opacity={0.25 + 0.75 * p} data-after>
        {change.after}
      </text>
      <text x={250} y={195} textAnchor="middle" dominantBaseline="central" fill="var(--text)" fontSize={22}>
        {t(change.label)}
      </text>
    </svg>
  )
}

const WORDS = 5
const BOX_W = 70
const boxX = (i: number) => 430 - i * 85

export interface RestartProps {
  /** Boxes 0…readTo are filled: read so far. */
  readTo: number
  stopAt?: number
  restartAt?: number
}

/** Plain word boxes, right to left, with a stop bar after box `stopAt` and an arrow under the restart box. */
export function RestartFrame({ readTo, stopAt, restartAt }: RestartProps) {
  const { t, n } = useLocale()
  return (
    <svg viewBox="0 0 500 230" aria-hidden="true" className="anim-svg waqf-restart-frame">
      {Array.from({ length: WORDS }, (_, i) => (
        <g key={i}>
          <rect
            x={boxX(i) - BOX_W / 2}
            y={70}
            width={BOX_W}
            height={50}
            rx={10}
            fill={i <= readTo ? 'var(--tj-waqf)' : 'none'}
            fillOpacity={0.25}
            stroke="var(--tj-waqf)"
            strokeWidth={2}
            data-read={i <= readTo || undefined}
          />
          <text x={boxX(i)} y={96} textAnchor="middle" dominantBaseline="central" fill="var(--text)" fontSize={20}>
            {n(i + 1)}
          </text>
        </g>
      ))}
      {stopAt !== undefined && (
        <g data-stop={stopAt}>
          <path
            d={`M${boxX(stopAt) - BOX_W / 2 - 8} 55 L${boxX(stopAt) - BOX_W / 2 - 8} 135`}
            stroke="var(--tj-waqf)"
            strokeWidth={5}
            strokeLinecap="round"
          />
          <text x={boxX(stopAt) - BOX_W / 2 - 8} y={152} textAnchor="middle" dominantBaseline="central" fill="var(--tj-waqf)" fontSize={18}>
            {t({ ar: 'وقف', en: 'stop' })}
          </text>
        </g>
      )}
      {restartAt !== undefined && (
        <g data-restart={restartAt}>
          <path d={`M${boxX(restartAt) - 9} 143 L${boxX(restartAt)} 131 L${boxX(restartAt) + 9} 143 Z`} fill="var(--tj-waqf)" />
          <text x={boxX(restartAt)} y={170} textAnchor="middle" dominantBaseline="central" fill="var(--tj-waqf)" fontSize={18}>
            {t({ ar: 'ابتدئ', en: 'restart' })}
          </text>
        </g>
      )}
    </svg>
  )
}

