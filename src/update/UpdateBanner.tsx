import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import { formatTemplate, ui } from '../i18n/ui'
import { APP_VERSION } from './appVersion'
import { browserStorage, dismissVersion, startupUpdateCheck, type Release } from './check'
import { DownloadLink } from './DownloadLink'
import { isAndroidApp } from './platform'

/**
 * "A new version is available" with Download and Later, shown at startup in the Android APK only when
 * the daily check (src/update/check.ts) finds a newer release that was not put off with Later.
 * Renders nothing in a browser, the PWA or the iOS app, and nothing while offline or on any error.
 */
export function UpdateBanner() {
  const { locale, t } = useLocale()
  const [release, setRelease] = useState<Release>()

  useEffect(() => {
    if (!isAndroidApp()) return
    let live = true
    void startupUpdateCheck(APP_VERSION, { storage: browserStorage() }).then((found) => {
      if (live) setRelease(found)
    })
    return () => {
      live = false
    }
  }, [])

  if (!release) return null

  const later = () => {
    dismissVersion(release.version, browserStorage())
    setRelease(undefined)
  }

  return (
    <div className="update-banner" role="status">
      <p>{formatTemplate(locale, ui.updateAvailable, { version: release.version })}</p>
      <div className="update-banner-actions">
        <DownloadLink url={release.downloadUrl} />
        <button type="button" className="update-later" onClick={later}>
          {t(ui.updateLater)}
        </button>
      </div>
    </div>
  )
}
