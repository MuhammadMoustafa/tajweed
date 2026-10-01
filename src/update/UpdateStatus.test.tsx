import { act, fireEvent, render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { APP_VERSION } from './appVersion'
import { UpdateStatus } from './UpdateStatus'

const native = vi.hoisted(() => ({ value: true }))
vi.mock('./platform', () => ({ isNativeApp: () => native.value }))

const APK_URL = 'https://github.com/MuhammadMoustafa/tajweed/releases/download/v99.0.0/tajweed.apk'
const release = (tag: string) => ({
  ok: true,
  json: async () => ({
    tag_name: tag,
    html_url: `https://github.com/MuhammadMoustafa/tajweed/releases/tag/${tag}`,
    assets: [{ name: 'tajweed.apk', browser_download_url: APK_URL }],
  }),
})
const fetchMock = vi.fn()

function renderStatus(locale: 'ar' | 'en' = 'en') {
  localStorage.setItem('tajweed.locale', locale)
  const { container } = render(
    <LocaleProvider>
      <UpdateStatus />
    </LocaleProvider>,
  )
  return { container, screen: within(container) }
}

async function clickCheck(screen: ReturnType<typeof renderStatus>['screen']) {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Check for updates' }))
  })
}

beforeEach(() => {
  localStorage.clear()
  native.value = true
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
  localStorage.clear()
})

describe('UpdateStatus', () => {
  it('shows the version from package.json in both languages', () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/)
    const en = renderStatus('en')
    expect(en.container.querySelector('.app-version')).toHaveTextContent(`Version ${APP_VERSION}`)
    expect(document.documentElement).toHaveAttribute('dir', 'ltr')
    const ar = renderStatus('ar')
    expect(ar.container.querySelector('.app-version')).toHaveTextContent(`الإصدار ${APP_VERSION}`)
    expect(ar.screen.getByRole('button', { name: 'البحث عن تحديث' })).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
  })

  it('outside the APK shows only the version: no button, no API call', () => {
    native.value = false
    const { container, screen } = renderStatus()
    expect(container.querySelector('.app-version')).toHaveTextContent(`Version ${APP_VERSION}`)
    expect(screen.queryByRole('button')).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('says when the app is up to date, ignoring the daily limit', async () => {
    localStorage.setItem('tajweed.update.lastCheck', String(Date.now()))
    fetchMock.mockResolvedValue(release(`v${APP_VERSION}`))
    const { container, screen } = renderStatus()
    await clickCheck(screen)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.update-result')).toHaveTextContent('You have the latest version.')
  })

  it('offers a newer version with Download, even one put off with Later', async () => {
    localStorage.setItem('tajweed.update.dismissed', '99.0.0')
    fetchMock.mockResolvedValue(release('v99.0.0'))
    const { container, screen } = renderStatus()
    await clickCheck(screen)
    expect(container.querySelector('.update-result')).toHaveTextContent('A new version is available: 99.0.0')
    expect(screen.getByRole('link', { name: 'Download' })).toHaveAttribute('href', APK_URL)
  })

  it('says it could not check when offline', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    const { container, screen } = renderStatus()
    await clickCheck(screen)
    expect(container.querySelector('.update-result')).toHaveTextContent('Could not check for updates')
    expect(screen.getByRole('button', { name: 'Check for updates' })).toBeEnabled()
  })
})
