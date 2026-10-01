import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'

/**
 * The APK download. A plain link with no target: in the APK, Capacitor's WebView hands any
 * navigation to another host to Android as an ACTION_VIEW intent (Bridge.launchIntent, called from
 * BridgeWebViewClient.shouldOverrideUrlLoading), so the system browser downloads the file and the
 * app stays where it was.
 */
export function DownloadLink({ url }: { url: string }) {
  const { t } = useLocale()
  return (
    <a className="update-download" href={url} rel="noopener">
      {t(ui.updateDownload)}
    </a>
  )
}
