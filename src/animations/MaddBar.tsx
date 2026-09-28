import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
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

const EASTERN_ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

/** Arabic-Indic digits in the Arabic UI, plain digits otherwise. */
function localizeCount(n: number, locale: string): string {
  const digits = String(n)
  return locale === 'ar' ? digits.replace(/\d/g, (d) => EASTERN_ARABIC_DIGITS[Number(d)]) : digits
}

const BEAT_MS = 650
const PAUSE_MS = 900
const BAR_WIDTH = 200
const BAR_HEIGHT = 24
const VIEW_WIDTH = 260
const VIEW_HEIGHT = 170
const BAR_X = 20
const BAR_Y = 82

export interface MaddBarProps {
  /** How many counts (harakat) the bar stretches to. */
  counts: MaddCount
  /** The madd letter with its preceding harakah, e.g. "ـَا"; shown above the bar. */
  letter?: string
  /** Optional bilingual caption shown under the bar. */
  label?: Bilingual
  /** Overrides the count's default color token (see DEFAULT_TOKEN). */
  token?: ColorToken
}

/**
 * A bar that stretches one beat at a time up to `counts`, with the running count shown beside
 * it, colored with the madd token matching `counts` (or an explicit `token`). Reused by every
 * madd lesson (L13-L16) so learners see the same "how long" cue at every length.
 */
export function MaddBar({ counts, letter, label, token }: MaddBarProps) {
  const reduce = useReducedMotion()
  const { locale, t } = useLocale()
  const color = `var(--tj-${token ?? DEFAULT_TOKEN[counts]})`
  // Starts at the first beat unless reduced motion skips straight to the full bar (see render).
  const [beat, setBeat] = useState(() => (reduce ? counts : 1))

  useEffect(() => {
    if (reduce) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    let current = 1
    const step = () => {
      timer = setTimeout(() => {
        if (cancelled) return
        if (current < counts) {
          current += 1
          setBeat(current)
          step()
        } else {
          timer = setTimeout(() => {
            if (cancelled) return
            current = 1
            setBeat(1)
            step()
          }, PAUSE_MS)
        }
      }, BEAT_MS)
    }
    step()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [reduce, counts])

  const shownBeat = reduce ? counts : beat
  const widthFrac = shownBeat / counts

  return (
    <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} aria-hidden="true" className="anim-svg madd-bar">
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
      <motion.rect
        className="madd-bar-fill"
        x={BAR_X}
        y={BAR_Y}
        height={BAR_HEIGHT}
        rx={BAR_HEIGHT / 2}
        fill={color}
        initial={false}
        animate={{ width: widthFrac * BAR_WIDTH }}
        transition={reduce ? { duration: 0 } : { duration: BEAT_MS / 1000, ease: 'easeInOut' }}
      />
      <text
        x={BAR_X + BAR_WIDTH + 14}
        y={BAR_Y + BAR_HEIGHT / 2}
        dominantBaseline="central"
        textAnchor="start"
        className="madd-bar-count"
        fill={color}
      >
        {localizeCount(shownBeat, locale)}
      </text>
      {label && (
        <text x={VIEW_WIDTH / 2} y={BAR_Y + BAR_HEIGHT + 30} textAnchor="middle" className="madd-bar-label">
          {t(label)}
        </text>
      )}
    </svg>
  )
}
