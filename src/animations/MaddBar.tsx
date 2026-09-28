import type { Bilingual } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'
import type { ColorToken } from '../tajweed/rules'

/** Beats a madd can be stretched to. Natural madd (L13) is always 2; the later madd lessons
 * (L14-L16) reuse this component for 4 (jaiz), 5 (wajib) and 6 (lazim) counts. */
export type MaddCount = 2 | 4 | 5 | 6

/**
 * Default color token per count, matching the rule that most commonly holds that many counts
 * (see src/tajweed/rules.ts for the actual `--tj-<token>` colors). A lesson whose rule shares a
 * count with another (e.g. permissible madd shown at 4 or 6) can pass `token` to override.
 */
const DEFAULT_TOKEN: Record<MaddCount, ColorToken> = {
  2: 'madd-normal',
  4: 'madd-permissible',
  5: 'madd-obligatory',
  6: 'madd-necessary',
}

const BAR_WIDTH = 200
const BAR_HEIGHT = 24
const VIEW_WIDTH = 260
const VIEW_HEIGHT = 170
const BAR_X = 20
const BAR_Y = 82

export interface MaddBarProps {
  /** How many counts (harakat) the bar stretches to. */
  counts: MaddCount
  /**
   * How many counts are filled so far, 0 … `counts` (fractional while a clip step tweens it);
   * defaults to full. The running count shows the counts begun, hidden while empty.
   */
  filled?: number
  /** Marks the bar the current clip step is about; the others are dimmed. */
  current?: boolean
  /** The madd letter with its preceding harakah, e.g. "ـَا"; shown above the bar. */
  letter?: string
  /** Optional bilingual caption shown under the bar. */
  label?: Bilingual
  /** Overrides the count's default color token (see DEFAULT_TOKEN). */
  token?: ColorToken
}

/**
 * A bar filled up to `filled` of its `counts`, with the running count shown beside it, colored
 * with the madd token matching `counts` (or an explicit `token`). It holds no timer: a clip step
 * (src/animations/player) drives `filled` from its progress. Reused by every madd lesson (L13-L16)
 * so learners see the same "how long" cue at every length.
 */
export function MaddBar({ counts, filled = counts, current, letter, label, token }: MaddBarProps) {
  const { t, n } = useLocale()
  const color = `var(--tj-${token ?? DEFAULT_TOKEN[counts]})`
  const shown = Math.min(counts, Math.max(0, filled))
  const begun = Math.ceil(shown)

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      aria-hidden="true"
      className="anim-svg madd-bar"
      data-current={current || undefined}
    >
      {letter && (
        <text x={VIEW_WIDTH / 2} y={44} textAnchor="middle" className="anim-letter" fill={color}>
          {letter}
        </text>
      )}
      <rect
        x={BAR_X}
        y={BAR_Y}
        width={BAR_WIDTH}
        height={BAR_HEIGHT}
        rx={BAR_HEIGHT / 2}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={0.35}
      />
      <rect
        className="madd-bar-fill"
        x={BAR_X}
        y={BAR_Y}
        width={(shown / counts) * BAR_WIDTH}
        height={BAR_HEIGHT}
        rx={BAR_HEIGHT / 2}
        fill={color}
      />
      {begun > 0 && (
        <text
          x={BAR_X + BAR_WIDTH + 14}
          y={BAR_Y + BAR_HEIGHT / 2}
          dominantBaseline="central"
          textAnchor="start"
          className="madd-bar-count"
          fill={color}
        >
          {n(begun)}
        </text>
      )}
      {label && (
        <text x={VIEW_WIDTH / 2} y={BAR_Y + BAR_HEIGHT + 30} textAnchor="middle" className="madd-bar-label">
          {t(label)}
        </text>
      )}
    </svg>
  )
}
