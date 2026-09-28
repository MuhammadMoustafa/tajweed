import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { TajweedText } from './TajweedText'

const markup = 'قُلْ هُوَ <tajweed class=ham_wasl>ٱ</tajweed>للَّهُ أَحَ<tajweed class=qalaqah>د</tajweed>ٌ <span class=end>١</span>'

const renderText = (highlight?: Parameters<typeof TajweedText>[0]['highlight']) =>
  render(
    <LocaleProvider>
      <TajweedText markup={markup} highlight={highlight} />
    </LocaleProvider>,
  )

describe('TajweedText', () => {
  it('colors every rule by default', () => {
    const { container } = renderText()
    expect(container.querySelectorAll('span[title]')).toHaveLength(2)
  })

  it('colors only highlighted rules and keeps the rest as plain text', () => {
    const { container } = renderText(['qalaqah'])
    const colored = container.querySelectorAll('span[title]')
    expect(colored).toHaveLength(1)
    expect(colored[0]).toHaveTextContent('د')
    expect(colored[0]).toHaveStyle({ color: 'var(--tj-qalqalah)' })
    expect(container.querySelector('.quran')?.textContent).toContain('ٱللَّهُ')
  })

  it('shows the ayah number', () => {
    const { container } = renderText()
    expect(container.querySelector('.ayah-number')).toHaveTextContent('﴿١﴾')
  })
})
