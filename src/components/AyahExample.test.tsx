import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { surahName } from '../data/quran'
import { formatNumber } from '../i18n/bilingual'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { AyahExample } from './AyahExample'

afterEach(() => localStorage.clear())

describe('AyahExample', () => {
  it.each(['ar', 'en'] as const)('names and numbers the surah, and numbers the ayah, in %s', (locale) => {
    localStorage.setItem('tajweed.locale', locale)
    const { container } = render(
      <LocaleProvider>
        <AyahExample example={{ verseKey: '112:1', note: { ar: 'ملاحظة', en: 'A note' } }} highlight={[]} />
      </LocaleProvider>,
    )
    const ref = container.querySelector('.verse-key')!
    expect(ref).toHaveAttribute('data-verse-key', '112:1')
    expect(ref.textContent).toContain(surahName(112)[locale])
    expect(ref.textContent).toContain(`(${formatNumber(locale, 112)})`)
    expect(ref.textContent).toContain(formatNumber(locale, 1))
  })
})
