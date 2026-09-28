import { useMemo } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import type { SegmentState } from '../lessons/quiz'
import { parseTajweed } from '../tajweed/parse'
import { TAJWEED_RULES, type TajweedRuleId } from '../tajweed/rules'

const STATE_COLOR_TOKEN: Record<SegmentState, string> = {
  selected: 'quiz-selected',
  correct: 'quiz-correct',
  wrong: 'quiz-wrong',
}

interface InteractiveProps {
  /** Segment indices currently tapped. */
  selected: ReadonlySet<number>
  onToggle: (index: number) => void
  /** Overrides the plain "selected" color once an answer is checked (correct/wrong per segment). */
  stateOf?: (index: number) => SegmentState | undefined
}

interface Props {
  markup: string
  /** Only these rules are colored; omit to color every rule. Ignored when `interactive` is set. */
  highlight?: readonly TajweedRuleId[]
  /**
   * Quiz tap mode: every segment becomes tappable. Color shows selection/correct/wrong state only
   * — never the underlying rule, so the answer isn't given away before checking.
   */
  interactive?: InteractiveProps
}

/**
 * Renders Quran text with tajweed coloring. Rule spans change ONLY `color` — any font, size,
 * spacing or padding change inside a word breaks Arabic letter joining.
 */
export function TajweedText({ markup, highlight, interactive }: Props) {
  const { t } = useLocale()
  const { segments, ayahNumber } = useMemo(() => parseTajweed(markup), [markup])

  return (
    <p className="quran" lang="ar" dir="rtl">
      {segments.map((seg, i) => {
        if (interactive) {
          const state = interactive.stateOf?.(i) ?? (interactive.selected.has(i) ? 'selected' : undefined)
          return (
            <span
              key={i}
              role="button"
              tabIndex={0}
              aria-pressed={interactive.selected.has(i)}
              className="tap"
              style={state ? { color: `var(--tj-${STATE_COLOR_TOKEN[state]})` } : undefined}
              onClick={() => interactive.onToggle(i)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return
                e.preventDefault()
                interactive.onToggle(i)
              }}
            >
              {seg.text}
            </span>
          )
        }
        if (!seg.rule || (highlight && !highlight.includes(seg.rule))) return seg.text
        const rule = TAJWEED_RULES[seg.rule]
        return (
          <span key={i} style={{ color: `var(--tj-${rule.color})` }} title={t(rule.name)}>
            {seg.text}
          </span>
        )
      })}
      {ayahNumber && <span className="ayah-number"> ﴿{ayahNumber}﴾</span>}
    </p>
  )
}
