import { Component, type ReactNode } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'

function Failure({ onRetry }: { onRetry: () => void }) {
  const { t } = useLocale()
  return (
    <div className="card route-error" role="alert">
      <p>{t(ui.pageLoadFailed)}</p>
      <button type="button" className="play" onClick={onRetry}>
        {t(ui.retry)}
      </button>{' '}
      <a href="#/">{t(ui.backToLessons)}</a>
    </div>
  )
}

interface Props {
  children: ReactNode
  /** Retry reloads the page by the user's choice only (never automatically, so no reload loop). */
  onRetry?: () => void
}

/**
 * Catches a routed page that fails to render or whose lazy chunk cannot load (reloadOnFailedImport
 * rethrows a second failure), so the header, update banner and footer stay usable. The parent keys
 * it by route: navigating away mounts a fresh boundary.
 */
export class RouteErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return <Failure onRetry={this.props.onRetry ?? (() => window.location.reload())} />
    return this.props.children
  }
}
