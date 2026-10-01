import { useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import { formatTemplate, ui } from '../i18n/ui'
import { APP_VERSION } from './appVersion'
import { browserStorage, checkForUpdate, type CheckResult } from './check'
import { DownloadLink } from './DownloadLink'
import { isNativeApp } from './platform'

/**
 * The app's version ("Version 0.2.0", everywhere) and, in the APK only, a "Check for updates"
 * button that ignores the daily limit and says: up to date, a new version with Download, or that
 * it could not check. Self-contained (no props), so any page can hold it.
 */
export function UpdateStatus() {
  const { locale, t } = useLocale()
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<CheckResult>()

  const check = async () => {
    setChecking(true)
    setResult(undefined)
    setResult(await checkForUpdate(APP_VERSION, { storage: browserStorage() }))
    setChecking(false)
  }

  return (
    <section className="update-status">
      <p className="app-version">{formatTemplate(locale, ui.appVersion, { version: APP_VERSION })}</p>
      {isNativeApp() && (
        <>
          <button type="button" className="check-updates" onClick={() => void check()} disabled={checking}>
            {t(checking ? ui.checkingForUpdates : ui.checkForUpdates)}
          </button>
          {result && (
            <div className="update-result" role="status" data-result={result.kind}>
              {result.kind === 'up-to-date' && <p>{t(ui.upToDate)}</p>}
              {result.kind === 'failed' && <p>{t(ui.updateCheckFailed)}</p>}
              {result.kind === 'available' && (
                <>
                  <p>{formatTemplate(locale, ui.updateAvailable, { version: result.release.version })}</p>
                  <DownloadLink url={result.release.downloadUrl} />
                </>
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}
