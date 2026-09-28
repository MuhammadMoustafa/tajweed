import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { ALL_RULES, type RuleId } from '../tajweed/rules'

/** Color is never the only signal: every colored rule is named here. */
export function RuleLegend({ rules }: { rules: readonly RuleId[] }) {
  const { t } = useLocale()
  return (
    <aside className="legend" aria-label={t(ui.legend)}>
      <h3>{t(ui.legend)}</h3>
      <ul>
        {rules.map((id) => {
          const rule = ALL_RULES[id]
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
