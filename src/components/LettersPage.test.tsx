import { fireEvent, render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { letterClip } from '../animations/LetterClip'
import { AREA_TITLES } from '../animations/MakharijClips'
import { makhrajOfLetter } from '../animations/mouth/makharij'
import { LETTER_SIFAT, SIFAT } from '../animations/mouth/sifat'
import { getWord } from '../data/quran'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { findLesson } from '../lessons'
import { LETTER_CARDS, letterName, letterWord } from '../letters/letters'
import { LettersPage } from './LettersPage'
import { LetterView } from './LetterView'

afterEach(() => localStorage.clear())

const renderIn = (locale: 'ar' | 'en', page: React.ReactNode) => {
  localStorage.setItem('tajweed.locale', locale)
  return within(render(<LocaleProvider>{page}</LocaleProvider>).container)
}

describe.each(['ar', 'en'] as const)('letters page in %s', (locale) => {
  it('lists every letter, in order, as a link to its card with an action label', () => {
    const screen = renderIn(locale, <LettersPage />)
    expect(document.documentElement).toHaveAttribute('lang', locale)
    expect(document.documentElement).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(ui.lettersTitle[locale])
    const links = screen.getAllByRole('link').filter((a) => a.getAttribute('href')?.startsWith('#/letters/'))
    expect(links.map((a) => a.getAttribute('href'))).toEqual(LETTER_CARDS.map((c) => `#/letters/${c.id}`))
    LETTER_CARDS.forEach((card, i) => {
      expect(links[i]).toHaveAccessibleName(`${ui.openLetterAction[locale]}: ${letterName(card)[locale]}`)
      expect(links[i]).toHaveTextContent(ui.openLetterAction[locale])
      const glyph = links[i].querySelector('.letter-card-glyph')
      expect(glyph).toHaveTextContent(card.letter)
      expect(glyph).toHaveAttribute('lang', 'ar')
      expect(glyph).toHaveAttribute('dir', 'rtl')
    })
  })
})

describe.each(LETTER_CARDS.map((c) => [c.id, c] as const))('letter card %s', (_id, card) => {
  it.each(['ar', 'en'] as const)('renders in %s: makhraj, qualities, clip and links', (locale) => {
    const screen = renderIn(locale, <LetterView letter={card.letter} />)
    expect(document.documentElement).toHaveAttribute('lang', locale)
    expect(document.documentElement).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent(letterName(card)[locale])
    expect(heading.querySelector('[lang="ar"][dir="rtl"]')).toHaveTextContent(card.letter)
    expect(screen.getByText(card.tip[locale])).toBeInTheDocument()
    expect(screen.getByRole('link', { name: ui.backToLetters[locale] })).toHaveAttribute('href', '#/letters')
    expect(screen.getByText(ui.lettersNotReviewed[locale])).toBeInTheDocument()

    const makhraj = makhrajOfLetter(card.letter)
    const section = screen.getByRole('heading', { name: ui.letterMakhraj[locale] }).closest('section')!
    expect(section).toHaveTextContent(AREA_TITLES[makhraj.area][locale])
    expect(section).toHaveTextContent(makhraj.description[locale])
    expect(within(section).getByRole('link')).toHaveAttribute('href', `#/lesson/makharij-${makhraj.area}`)

    const sifat = screen.getByRole('heading', { name: ui.letterSifat[locale] }).closest('section')!
    const listed = [...sifat.querySelectorAll('[data-sifah]')]
    expect(listed.map((li) => li.getAttribute('data-sifah'))).toEqual(LETTER_SIFAT[card.letter])
    for (const li of listed) {
      const sifah = SIFAT[li.getAttribute('data-sifah') as keyof typeof SIFAT]
      expect(li).toHaveTextContent(sifah.name[locale])
      expect(li).toHaveTextContent(sifah.brief[locale])
    }
    expect(within(sifat).getByRole('link')).toHaveAttribute('href', '#/lesson/sifat')
    expect(findLesson('sifat')).toBeDefined()
    expect(findLesson(`makharij-${makhraj.area}`)).toBeDefined()

    // The clip's player: one timeline label per step; the last one plays and shows the letter's word.
    const clip = letterClip(card)
    const player = screen.getByRole('group', { name: clip.title[locale] })
    const labels = [...player.querySelectorAll('.player-label')]
    expect(labels.map((b) => b.textContent)).toEqual(clip.steps.map((s) => s.label![locale]))
    fireEvent.click(labels[labels.length - 1])
    const word = getWord(letterWord(card))!
    expect(player.querySelector(`[data-word="${letterWord(card)}"]`)).toHaveTextContent(word.text)
    expect(player).toHaveTextContent(ui.recitedBy[locale])
  })
})
