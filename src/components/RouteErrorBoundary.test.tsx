import { act, fireEvent, render, within } from '@testing-library/react'
import { lazy, Suspense } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../App'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { RouteErrorBoundary } from './RouteErrorBoundary'

vi.mock('./AboutPage', () => {
  throw new Error('chunk missing')
})

afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  window.location.hash = ''
  vi.restoreAllMocks()
})

const go = (hash: string) =>
  act(() => {
    window.location.hash = hash
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })

const quiet = () => vi.spyOn(console, 'error').mockImplementation(() => {})

describe('RouteErrorBoundary', () => {
  it.each(['ar', 'en'] as const)('shows a retry message in %s for a rejected lazy import', async (locale) => {
    quiet()
    localStorage.setItem('tajweed.locale', locale)
    const Broken = lazy(() => Promise.reject(new Error('offline')))
    const onRetry = vi.fn()
    const screen = within(
      render(
        <LocaleProvider>
          <RouteErrorBoundary onRetry={onRetry}>
            <Suspense fallback={null}>
              <Broken />
            </Suspense>
          </RouteErrorBoundary>
        </LocaleProvider>,
      ).container,
    )
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(ui.pageLoadFailed[locale])
    expect(document.documentElement).toHaveAttribute('lang', locale)
    expect(document.documentElement).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    expect(screen.getByRole('link', { name: ui.backToLessons[locale] })).toHaveAttribute('href', '#/')
    fireEvent.click(screen.getByRole('button', { name: ui.retry[locale] }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})

describe('App with a page chunk that cannot load', () => {
  // The reload guard says we reloaded just now (or storage is blocked), so reloadOnFailedImport
  // rethrows instead of reloading, and the error reaches the boundary.
  const setup = async (blockStorage: boolean) => {
    quiet()
    if (blockStorage) {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked')
      })
    } else sessionStorage.setItem('tajweed.importReloadAt', String(Date.now()))
    const screen = within(render(<LocaleProvider><App /></LocaleProvider>).container)
    await go('#/about')
    return screen
  }

  it.each([false, true])('keeps navigation and recovers on route change (storage blocked: %s)', async (blocked) => {
    const screen = await setup(blocked)
    expect(await screen.findByRole('alert')).toHaveTextContent(ui.pageLoadFailed.en)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    await go('#/progress')
    expect(screen.queryByRole('alert')).toBeNull()
  })
})
