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

/** One count lasts about a second at 1×; matched by every madd lesson (L13c-L16) for one shared pace. */
export const COUNT_MS = 1000
/** How long the "get ready" step holds before the first count begins. */
export const MADD_READY_MS = 700
/** How long the "stop" step holds at the end, showing the letter must not be stretched further. */
export const MADD_STOP_MS = 700

/**
 * How many counts are filled at `progress` (0…1) through the single-count (`COUNT_MS`) step for
 * `beat` (1 = the first count, 2 = the second, …): grows from `beat - 1` to `beat`. A madd clip
 * builds one `ClipStep` per count this way (see NaturalMadd.tsx) so every madd lesson (L13c-L16)
 * counts at the same pace and MaddBar can land its metronome pulse and markers on the same beats.
 */
// eslint-disable-next-line react/only-export-components
export const maddBeatFilled = (beat: number, progress: number): number => beat - 1 + Math.min(1, Math.max(0, progress))

/** Fraction of a count over which the metronome-style landing pulse grows, ending exactly when
 * that count completes (see MaddBar's `markers`). */
const PULSE_SPAN = 0.5

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
  /**
   * Show a numbered marker at the first count and one at the last (`counts`) — "the idea is to
   * count the 2 movements", so only the start and end need a marker, never one per letter/count in
   * between (maintainer, #34). Also draws a metronome-like pulse that lands on whichever count
   * `filled` is completing. Every madd lesson (L13c-L16) passes this so 2/4/5/6-count bars all
   * teach the same "start … end" cue.
   */
  markers?: boolean
  /** Show that counting has stopped and the letter must not be stretched further: mutes the
   * running pulse and caps the bar with a stop tick past the end marker. */
  stopped?: boolean
  /**
   * Text right after the madd letter — the hamza (with its own harakah) that turns a natural madd
   * into a secondary one, shown in the same plain text color as `before` so only the madd letter
   * itself carries the rule's color (L14: muttasil/munfasil, reusing this bar at 4/5 counts).
   */
  after?: string
  /** With `after` set: draws it with a visible gap from the letter, showing a new word starts
   * there (munfasil) rather than continuing the same word (muttasil, the default, no gap). */
  afterGap?: boolean
}

/**
 * A bar filled up to `filled` of its `counts`, anchored under `letter` with an arrow pointing at
 * it, colored with the madd token matching `counts` (or an explicit `token`). It holds no timer: a
 * clip step (src/animations/player) drives `filled` from its progress, typically via
 * `maddBeatFilled`. The letter, arrow and bar all share one fixed x (`ANCHOR_X`) so `before` can
 * sit beside the letter without moving the bar. Reused by every madd lesson (L13c-L16) so learners
 * see the same "how long, and which letter" cue, with start/end markers, at every length.
 */
export function MaddBar({
  counts,
  filled = counts,
  current,
  before,
  letter,
  label,
  token,
  markers,
  stopped,
  after,
  afterGap,
}: MaddBarProps) {
  const { t, n } = useLocale()
  const color = `var(--tj-${token ?? DEFAULT_TOKEN[counts]})`
  const shown = Math.min(counts, Math.max(0, filled))
  const begun = Math.ceil(shown)
  const markerY = BAR_Y + BAR_HEIGHT / 2

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
      {letter && after && (
        // Reads to the letter's left (pronounced after it); `afterGap` pushes it further away to
        // show a new word starts there (munfasil) instead of continuing the same word (muttasil).
        <text
          x={ANCHOR_X - LETTER_HALF_WIDTH - (afterGap ? 16 : 0)}
          y={LETTER_Y}
          textAnchor="end"
          className="anim-letter madd-bar-after"
        >
          {after}
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
      {markers && (
        <>
          {/* The two ends of the count, per #34: a marker at the first movement and one at the
              last — never one per count in between, since every madd letter holds the same pace. */}
          <circle cx={BAR_X} cy={markerY} r={5} fill={color} data-marker="start" data-beat={1} />
          <text x={BAR_X} y={BAR_Y - 8} textAnchor="middle" className="madd-bar-marker-label" fill={color}>
            {n(1)}
          </text>
          <circle
            cx={BAR_X + BAR_WIDTH}
            cy={markerY}
            r={5}
            fill={color}
            data-marker="end"
            data-beat={counts}
          />
          <text x={BAR_X + BAR_WIDTH} y={BAR_Y - 8} textAnchor="middle" className="madd-bar-marker-label" fill={color}>
            {n(counts)}
          </text>
          {!stopped &&
            // A metronome-like pulse that grows into each count as it lands, one ring per beat
            // (never more than one visible at once, since each spans the last half of its count).
            Array.from({ length: counts }, (_, i) => i + 1).map((beat) => {
              const local = shown - (beat - 1) // 0 at the count's start, 1 when it lands
              if (local <= 1 - PULSE_SPAN || local > 1) return null
              const grown = Math.min(1, (local - (1 - PULSE_SPAN)) / PULSE_SPAN)
              const bx = BAR_X + (beat / counts) * BAR_WIDTH
              return (
                <circle
                  key={beat}
                  cx={bx}
                  cy={markerY}
                  r={5 + 9 * grown}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  opacity={0.9 * grown}
                  className="madd-bar-pulse"
                  data-beat={beat}
                />
              )
            })}
          {stopped && (
            <line
              x1={BAR_X + BAR_WIDTH + 10}
              y1={BAR_Y - 6}
              x2={BAR_X + BAR_WIDTH + 10}
              y2={BAR_Y + BAR_HEIGHT + 6}
              stroke={color}
              strokeWidth={3}
              className="madd-bar-stop"
              data-stopped="true"
            />
          )}
        </>
      )}
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
