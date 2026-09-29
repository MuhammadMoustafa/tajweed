import { act, render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { LocaleProvider } from './i18n/LocaleProvider'
import { ui } from './i18n/ui'
import { findLesson } from './lessons'
import { findLetterCard, letterName, LETTER_CARDS } from './letters/letters'
import { LETTER_IDS, letterOfId } from './letters/ids'
import { LessonView } from './components/LessonView'

afterEach(() => {
  localStorage.clear()
  window.location.hash = ''
})

const go = (hash: string) =>
  act(() => {
    window.location.hash = hash
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })

describe('letter ids (src/letters/ids.ts)', () => {
  it('are the card ids, and route back to their letter', () => {
    for (const card of LETTER_CARDS) {
      expect(card.id).toBe(LETTER_IDS[card.letter])
      expect(letterOfId(card.id)).toBe(card.letter)
    }
    expect(letterOfId('nope')).toBeUndefined()
  })
})

describe('letters page routes', () => {
  it('links the letters page from the header, next to progress', () => {
    const screen = within(render(<LocaleProvider><App /></LocaleProvider>).container)
    const header = screen.getByRole('banner')
    expect(within(header).getByRole('link', { name: ui.lettersTitle.en })).toHaveAttribute('href', '#/letters')
    expect(within(header).getByRole('link', { name: ui.progressTitle.en })).toBeInTheDocument()
  })

  it('opens the letters page and a letter card, lazily, and titles the document', async () => {
    const screen = within(render(<LocaleProvider><App /></LocaleProvider>).container)
    await go('#/letters')
    expect(await screen.findByRole('heading', { level: 2, name: ui.lettersTitle.en })).toBeInTheDocument()
    expect(document.title).toContain(ui.lettersTitle.en)
    await go('#/letters/qaf')
    const qaf = findLetterCard('qaf')!
    expect(await screen.findByRole('heading', { level: 2, name: new RegExp(letterName(qaf).en) })).toBeInTheDocument()
    expect(document.title).toContain(letterName(qaf).en)
    await go('#/letters/nope')
    expect(await screen.findByText(ui.letterNotFound.en)).toBeInTheDocument()
  })
})

describe.each(['foundations', 'makharij'])('lesson %s', (id) => {
  it.each(['ar', 'en'] as const)('links to the letters page in %s', (locale) => {
    localStorage.setItem('tajweed.locale', locale)
    const lesson = findLesson(id)!
    const link = lesson.sections.find((s) => s.link)?.link
    expect(link?.href).toBe('#/letters')
    const screen = within(render(<LocaleProvider><LessonView lesson={lesson} /></LocaleProvider>).container)
    expect(screen.getByRole('link', { name: new RegExp(link!.label[locale]) })).toHaveAttribute('href', '#/letters')
  })
})
