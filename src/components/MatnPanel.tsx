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

// Fixed display order: Tuhfat al-Atfal (the beginner text) always before al-Muqaddimah
// al-Jazariyyah, in every lesson's panel — never sorted by data.
const POEM_ORDER: MatnId[] = ['tuhfa', 'jazariyya']

/**
 * Optional reference material: both classical poems' coverage of a lesson's rule
 * (src/data/mutoon.json), in a panel closed by default. Each poem always gets its own clearly
 * separated section (heading, meaning note(s), lines or a "doesn't cover this" line), Tuhfa
 * first, so a reader never sees just one poem without knowing the other was considered. The
 * Arabic here is UI text, not Quran text, so it renders in the Arabic UI font (`:lang(ar)` →
 * --font-ui-ar), never --font-quran.
 */
export function MatnPanel({ refs }: { refs: Lesson['mutoon'] }) {
  const { t, n } = useLocale()
  if (!refs) return null

  return (
    <details className="matn-panel">
      <summary>{t(ui.matnPanelSummary)}</summary>
      {POEM_ORDER.map((poemId) => {
        const coverage = refs[poemId]
        const meta = getMatnMeta(poemId)
        return (
          <div className={`matn-poem matn-poem-${poemId}`} key={poemId}>
            <p className="matn-poem-heading">
              <span className="matn-poem-name">{t(POEM_NAME[poemId])}</span>
              <span className="matn-poem-author">{meta.author}</span>
            </p>
            {coverage === 'not-covered' ? (
              <p className="matn-not-covered">{t(ui.matnNotCovered)}</p>
            ) : (
              coverage.map((passage, i) => {
                const { heading, lines } = getMatnLines(poemId, passage.from, passage.to)
                return (
                  <div className="matn-passage" key={i}>
                    <p className="matn-note">{t(passage.note)}</p>
                    {heading && (
                      <p className="matn-section-heading" lang="ar" dir="rtl">
                        {heading}
                      </p>
                    )}
                    {lines.map((line) => (
                      <div className="matn-line" lang="ar" dir="rtl" key={line.n}>
                        <span className="matn-line-number">
                          {t(ui.matnLine)} {n(line.n)}
                        </span>
                        <span className="matn-sadr">{line.sadr}</span>
                        <span className="matn-ajuz">{line.ajuz}</span>
                      </div>
                    ))}
                  </div>
                )
              })
            )}
            {coverage !== 'not-covered' && (
              <a className="matn-source" href={meta.url} target="_blank" rel="noreferrer">
                {t(ui.matnSource)}: {meta.url}
              </a>
            )}
          </div>
        )
      })}
    </details>
  )
}
