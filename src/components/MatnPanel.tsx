import { getMatnLines, getMatnMeta } from '../data/mutoon'
import type { Bilingual } from '../i18n/bilingual'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import type { Lesson } from '../lessons/types'
import type { MatnId } from '../mutoon/types'

const POEM_NAME: Record<MatnId, Bilingual> = {
  tuhfa: ui.matnTuhfaTitle,
  jazariyya: ui.matnJazariyyaTitle,
}

/**
 * Optional reference material: the classical-poem lines (src/data/mutoon.json) that state a
 * lesson's rule, in a panel closed by default. The Arabic here is UI text, not Quran text, so it
 * renders in the Arabic UI font (`:lang(ar)` → --font-ui-ar), never --font-quran.
 */
export function MatnPanel({ refs }: { refs: NonNullable<Lesson['mutoon']> }) {
  const { t, n } = useLocale()
  if (refs.length === 0) return null

  return (
    <details className="matn-panel">
      <summary>{t(ui.matnPanelSummary)}</summary>
      {refs.map((ref, i) => {
        const { heading, lines } = getMatnLines(ref.text, ref.from, ref.to)
        const meta = getMatnMeta(ref.text)
        return (
          <div className="matn-ref" key={i}>
            <p className="matn-note">{t(ref.note)}</p>
            <p className="matn-ref-heading">
              <span className="matn-poem-name">{t(POEM_NAME[ref.text])}</span>
              {heading && (
                <span className="matn-section-heading" lang="ar" dir="rtl">
                  {' — '}
                  {heading}
                </span>
              )}
            </p>
            {lines.map((line) => (
              <div className="matn-line" lang="ar" dir="rtl" key={line.n}>
                <span className="matn-line-number">
                  {t(ui.matnLine)} {n(line.n)}
                </span>
                <span className="matn-sadr">{line.sadr}</span>
                <span className="matn-ajuz">{line.ajuz}</span>
              </div>
            ))}
            <a className="matn-source" href={meta.url} target="_blank" rel="noreferrer">
              {t(ui.matnSource)}: {meta.url}
            </a>
          </div>
        )
      })}
    </details>
  )
}
