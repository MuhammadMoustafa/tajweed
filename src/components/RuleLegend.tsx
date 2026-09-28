import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { TAJWEED_RULES, type TajweedRuleId } from '../tajweed/rules'

/** Color is never the only signal: every colored rule is named here. */
export function RuleLegend({ rules }: { rules: readonly TajweedRuleId[] }) {
  const { t } = useLocale()
  return (
    <aside className="legend" aria-label={t(ui.legend)}>
      <h3>{t(ui.legend)}</h3>
      <ul>
        {rules.map((id) => {
          const rule = TAJWEED_RULES[id]
          return (
            <li key={id}>
              <span className="swatch" style={{ background: `var(--tj-${rule.color})` }} aria-hidden="true" />
              {t(rule.name)}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
