import { act, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { surahName } from '../data/quran'
import { formatNumber } from '../i18n/bilingual'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import type { LessonExample } from '../lessons/types'
import { AyahExample } from './AyahExample'

afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

const example: LessonExample = { verseKey: '112:1', note: { ar: 'ملاحظة', en: 'A note' } }

describe('AyahExample', () => {
  it.each(['ar', 'en'] as const)('names and numbers the surah, and numbers the ayah, in %s', (locale) => {
    localStorage.setItem('tajweed.locale', locale)
    const { container } = render(
      <LocaleProvider>
        <AyahExample example={example} highlight={[]} />
      </LocaleProvider>,
    )
    const ref = container.querySelector('.verse-key')!
    expect(ref).toHaveAttribute('data-verse-key', '112:1')
    expect(ref.textContent).toContain(surahName(112)[locale])
    expect(ref.textContent).toContain(`(${formatNumber(locale, 112)})`)
    expect(ref.textContent).toContain(formatNumber(locale, 1))
  })
})

describe('AyahExample playback failure', () => {
  const setup = (locale: 'ar' | 'en') => {
    localStorage.setItem('tajweed.locale', locale)
    const view = render(
      <LocaleProvider>
        <AyahExample example={example} highlight={[]} />
      </LocaleProvider>,
    )
    const audio = view.container.querySelector('audio')!
    const button = view.container.querySelector<HTMLButtonElement>('button.play')!
    return { audio, button, container: view.container }
  }

  it.each(['ar', 'en'] as const)('explains a rejected play() in %s and resets the button', async (locale) => {
    const { audio, button, container } = setup(locale)
    vi.spyOn(audio, 'play').mockRejectedValue(new Error('blocked'))
    fireEvent.play(audio)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    await act(async () => {
      fireEvent.click(button)
    })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(container.querySelector('[role="alert"]')).toHaveTextContent(ui.audioFailed[locale])
  })

  it.each(['ar', 'en'] as const)('explains a media error event in %s, and clears it on the next play', (locale) => {
    const { audio, button, container } = setup(locale)
    fireEvent.play(audio)
    fireEvent.error(audio)
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(container.querySelector('[role="alert"]')).toHaveTextContent(ui.audioFailed[locale])
    fireEvent.play(audio)
    expect(container.querySelector('[role="alert"]')).toBeNull()
  })
})
