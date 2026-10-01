import { Capacitor } from '@capacitor/core'
import { CONTACT_EMAIL, GITHUB_PROFILE_URL, SOURCE_CODE_URL } from '../about/links'
import { buildReport } from '../about/report'
import { APP_VERSION } from '../about/version'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { useHash } from '../useHashRoute'

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const

/**
 * The report and contact links (footer and About page share this one component): "Report an issue"
 * opens a prefilled GitHub issue, with an email fallback carrying the same details, then the
 * maintainer's email, GitHub profile and the source code. Recomputed for the current route.
 */
export function ContactLinks() {
  const { locale, t } = useLocale()
  const hash = useHash()
  const report = buildReport({
    version: APP_VERSION,
    hash,
    locale,
    platform: Capacitor.isNativePlatform() ? 'APK' : 'web',
  })
  return (
    <ul className="contact-links">
      <li>
        <a href={report.githubUrl} {...EXTERNAL}>
          {t(ui.reportIssue)}
        </a>{' '}
        (<a href={report.mailtoUrl}>{t(ui.reportByEmail)}</a>)
      </li>
      <li>
        {t(ui.contactEmail)}:{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr">
          {CONTACT_EMAIL}
        </a>
      </li>
      <li>
        <a href={GITHUB_PROFILE_URL} {...EXTERNAL}>
          {t(ui.githubProfile)}
        </a>
      </li>
      <li>
        <a href={SOURCE_CODE_URL} {...EXTERNAL}>
          {t(ui.sourceCode)}
        </a>
      </li>
    </ul>
  )
}
