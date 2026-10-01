import { act, render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from '../App'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { AboutPage } from './AboutPage'
import { Footer } from './Footer'

afterEach(() => {
  localStorage.clear()
  window.location.hash = ''
})

const renderIn = (locale: 'ar' | 'en', node: React.ReactNode) => {
  localStorage.setItem('tajweed.locale', locale)
  const { container } = render(<LocaleProvider>{node}</LocaleProvider>)
  return within(container)
}

describe('Footer', () => {
  for (const locale of ['ar', 'en'] as const) {
    it(`links About, report, email, GitHub and source (${locale})`, () => {
      const screen = renderIn(locale, <Footer />)
      const href = (label: string) => screen.getByRole('link', { name: label }).getAttribute('href')
      expect(href(ui.aboutTitle[locale])).toBe('#/about')
      const report = screen.getByRole('link', { name: ui.reportIssue[locale] })
      expect(report.getAttribute('href')).toMatch(/^https:\/\/github\.com\/MuhammadMoustafa\/tajweed\/issues\/new\?title=/)
      expect(decodeURIComponent(report.getAttribute('href')!)).toContain(`Language: ${locale}`)
      expect(report.getAttribute('target')).toBe('_blank')
      expect(report.getAttribute('rel')).toBe('noopener noreferrer')
      expect(href(ui.reportByEmail[locale])).toMatch(/^mailto:muhammadmoustafa22@gmail\.com\?subject=/)
      expect(href('muhammadmoustafa22@gmail.com')).toBe('mailto:muhammadmoustafa22@gmail.com')
      expect(href(ui.githubProfile[locale])).toBe('https://github.com/MuhammadMoustafa')
      expect(href(ui.sourceCode[locale])).toBe('https://github.com/MuhammadMoustafa/tajweed')
      for (const label of [ui.githubProfile[locale], ui.sourceCode[locale]]) {
        expect(screen.getByRole('link', { name: label }).getAttribute('rel')).toBe('noopener noreferrer')
      }
      expect(document.documentElement.lang).toBe(locale)
      expect(document.documentElement.dir).toBe(locale === 'ar' ? 'rtl' : 'ltr')
    })
  }

  it('recomputes the report for the current route', () => {
    window.location.hash = '#/progress'
    const screen = renderIn('en', <Footer />)
    const link = screen.getByRole('link', { name: 'Report an issue' }).getAttribute('href')!
    expect(decodeURIComponent(link)).toContain('Page: /progress')
    expect(decodeURIComponent(link)).toContain('Platform: web')
  })
})

describe('AboutPage', () => {
  for (const locale of ['ar', 'en'] as const) {
    it(`renders its sections and source links (${locale})`, () => {
      const screen = renderIn(locale, <AboutPage />)
      for (const key of ['aboutWhatTitle', 'aboutSourcesTitle', 'aboutReviewTitle', 'aboutVersionTitle', 'aboutContactTitle'] as const) {
        expect(screen.getByRole('heading', { name: ui[key][locale] })).toBeInTheDocument()
      }
      const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'))
      expect(hrefs).toEqual(
        expect.arrayContaining([
          'https://quran.com',
          'https://everyayah.com',
          'https://www.alukah.net/sharia/0/57837/',
          'https://www.alukah.net/sharia/0/58168/',
          'https://github.com/MuhammadMoustafa/tajweed',
        ]),
      )
      expect(hrefs.filter((h) => h?.includes('/@fontsource/'))).toHaveLength(3)
      expect(screen.getByText('dev')).toBeInTheDocument()
    })
  }

  it('is reached from the footer route and titles the page', async () => {
    const screen = renderIn('en', <App />)
    act(() => {
      window.location.hash = '#/about'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(await screen.findByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument()
    expect(document.title).toContain('About')
  })
})
