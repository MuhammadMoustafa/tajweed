import { useMemo } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import { parseTajweed } from '../tajweed/parse'
import { TAJWEED_RULES, type TajweedRuleId } from '../tajweed/rules'

interface Props {
  markup: string
  /** Only these rules are colored; omit to color every rule. */
  highlight?: readonly TajweedRuleId[]
}

/**
 * Renders Quran text with tajweed coloring. Rule spans change ONLY `color` — any font, size,
 * spacing or padding change inside a word breaks Arabic letter joining.
 */
export function TajweedText({ markup, highlight }: Props) {
  const { t } = useLocale()
  const { segments, ayahNumber } = useMemo(() => parseTajweed(markup), [markup])

  return (
    <p className="quran" lang="ar" dir="rtl">
      {segments.map((seg, i) => {
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
