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
/** Anchor: the x every madd lesson's letter, arrow and bar are centered on (see MaddBarProps). */
const ANCHOR_X = VIEW_WIDTH / 2
const LETTER_Y = 44
/** Half the width of one madd-letter glyph at the `.anim-letter` font size, so `before` sits
 * right next to the letter instead of overlapping or gapping it. Approximate (no DOM measurement,
 * matching how the other clips place letters, e.g. QalqalahBounce's fixed `letterX`). */
const LETTER_HALF_WIDTH = 22

/** One count lasts about a second at 1×; matched by every madd lesson (L13b-L16) for one shared pace. */
export const COUNT_MS = 1000
/** How long the filled bar holds at the end of a syllable/word before the clip moves on. */
export const MADD_HOLD_MS = 600

/** Total duration (ms, at 1×) of a step that counts up to `counts` and then holds. */
// eslint-disable-next-line react/only-export-components
export const maddStepDuration = (counts: MaddCount): number => counts * COUNT_MS + MADD_HOLD_MS

/**
 * How many counts are filled at `progress` (0…1) through a `maddStepDuration(counts)` step: grows
 * one count per `COUNT_MS`, then stays at `counts` for the trailing hold. Shared by every madd
 * clip (L13b-L16) so they all count at the same pace and pause the same way at the end.
 */
// eslint-disable-next-line react/only-export-components
export const maddFilled = (counts: MaddCount, progress: number): number => {
  const elapsed = Math.min(1, Math.max(0, progress)) * maddStepDuration(counts)
  return Math.min(counts, elapsed / COUNT_MS)
}

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
  /**
   * Text right before the madd letter (its harakah, e.g. "بَ"), shown in the plain text color so
   * only the madd letter itself carries the rule's color. Omit for a bare letter with no context.
   */
  before?: string
  /** The madd letter (or word) the bar is anchored under, e.g. "ا"; shown above the bar with an
   * arrow pointing at it, colored with the rule's token. */
  letter?: string
  /** Optional bilingual caption shown under the bar. */
  label?: Bilingual
  /** Overrides the count's default color token (see DEFAULT_TOKEN). */
  token?: ColorToken
}

/**
 * A bar filled up to `filled` of its `counts`, anchored under `letter` with an arrow pointing at
 * it, colored with the madd token matching `counts` (or an explicit `token`). It holds no timer: a
 * clip step (src/animations/player) drives `filled` from its progress, typically via `maddFilled`.
 * The letter, arrow and bar all share one fixed x (`ANCHOR_X`) so `before` can sit beside the
 * letter without moving the bar. Reused by every madd lesson (L13b-L16) so learners see the same
 * "how long, and which letter" cue at every length.
 */
export function MaddBar({ counts, filled = counts, current, before, letter, label, token }: MaddBarProps) {
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
        <text x={ANCHOR_X} y={LETTER_Y} textAnchor="middle" className="anim-letter" fill={color}>
          {letter}
        </text>
      )}
      {letter && before && (
        // Reads to the letter's right (its harakah is pronounced first, in Arabic's right-to-left order).
        <text x={ANCHOR_X + LETTER_HALF_WIDTH} y={LETTER_Y} textAnchor="start" className="anim-letter madd-bar-before">
          {before}
        </text>
      )}
      {letter && (
        // Points straight up at the madd letter, between it and the bar.
        <path d={`M${ANCHOR_X - 9} 74 L${ANCHOR_X} 58 L${ANCHOR_X + 9} 74 Z`} fill={color} className="madd-bar-arrow" />
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
