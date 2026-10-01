import { act, fireEvent, render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { LATEST_RELEASE_API } from './releases'
import { UpdateBanner } from './UpdateBanner'

const platform = vi.hoisted(() => ({ value: 'android' }))
vi.mock('@capacitor/core', () => ({ Capacitor: { getPlatform: () => platform.value } }))

const APK_URL = 'https://github.com/MuhammadMoustafa/tajweed/releases/download/v99.0.0/tajweed.apk'
const fetchMock = vi.fn(async () => ({
  ok: true,
  json: async () => ({
    tag_name: 'v99.0.0',
    html_url: 'https://github.com/MuhammadMoustafa/tajweed/releases/tag/v99.0.0',
    assets: [{ name: 'tajweed.apk', browser_download_url: APK_URL }],
  }),
}))

async function renderBanner(locale: 'ar' | 'en') {
  localStorage.setItem('tajweed.locale', locale)
  const view = render(
    <LocaleProvider>
      <UpdateBanner />
    </LocaleProvider>,
  )
  await act(async () => {})
  return { ...view, screen: within(view.container) }
}

beforeEach(() => {
  localStorage.clear()
  platform.value = 'android'
  fetchMock.mockClear()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
  localStorage.clear()
})

describe('UpdateBanner', () => {
  it('in the APK, offers a newer release with Download and Later, in English', async () => {
    const { container, screen } = await renderBanner('en')
    expect(fetchMock).toHaveBeenCalledWith(LATEST_RELEASE_API, expect.anything())
    expect(document.documentElement).toHaveAttribute('lang', 'en')
    expect(document.documentElement).toHaveAttribute('dir', 'ltr')
    expect(container.querySelector('.update-banner')).toHaveTextContent('A new version is available: 99.0.0')
    const download = screen.getByRole('link', { name: 'Download' })
    expect(download).toHaveAttribute('href', APK_URL)
    expect(download).not.toHaveAttribute('target')
    expect(screen.getByRole('button', { name: 'Later' })).toBeInTheDocument()
  })

  it('in Arabic too', async () => {
    const { container, screen } = await renderBanner('ar')
    expect(document.documentElement).toHaveAttribute('lang', 'ar')
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
    expect(container.querySelector('.update-banner')).toHaveTextContent('يتوفّر إصدار جديد: 99.0.0')
    expect(screen.getByRole('link', { name: 'تنزيل' })).toHaveAttribute('href', APK_URL)
    expect(screen.getByRole('button', { name: 'لاحقًا' })).toBeInTheDocument()
  })

  it('Later hides it and keeps that version hidden at the next check', async () => {
    const { container, screen, unmount } = await renderBanner('en')
    fireEvent.click(screen.getByRole('button', { name: 'Later' }))
    expect(container.querySelector('.update-banner')).toBeNull()
    expect(localStorage.getItem('tajweed.update.dismissed')).toBe('99.0.0')
    unmount()

    localStorage.removeItem('tajweed.update.lastCheck') // as if a day had passed
    const again = await renderBanner('en')
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(again.container.querySelector('.update-banner')).toBeNull()
  })

  it('is silent when the check fails', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    const { container } = await renderBanner('en')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.update-banner')).toBeNull()
  })

  it.each(['web', 'ios'])('R4: never calls the API or offers the APK on %s', async (name) => {
    platform.value = name
    const { container } = await renderBanner('en')
    expect(fetchMock).not.toHaveBeenCalled()
    expect(container.querySelector('.update-banner')).toBeNull()
  })
})
