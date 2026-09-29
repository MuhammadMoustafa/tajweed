import { render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LessonView } from './LessonView'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { CUSTOM_RULES } from '../tajweed/rules'
import { LESSONS } from '../lessons'
import { UNITS } from '../lessons/units'
import { hafsTwoWays } from '../lessons/hafs-two-ways'
import { imalahTashilIshmam } from '../lessons/imalah-tashil-ishmam'
import { sadSeen } from '../lessons/sad-seen'
import { saktat } from '../lessons/saktat'
import type { Lesson } from '../lessons/types'

afterEach(() => localStorage.clear())

const renderLesson = (lesson: Lesson, locale: 'ar' | 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  return render(
    <LocaleProvider>
      <LessonView lesson={lesson} />
    </LocaleProvider>,
  ).container
}

/** The example card for `verseKey`, found by its visible verse key. */
const example = (container: HTMLElement, verseKey: string) =>
  [...container.querySelectorAll<HTMLElement>('.example')].find(
    (card) => card.querySelector('.verse-key')?.getAttribute('data-verse-key') === verseKey,
  )!

/**
 * What each example's colored spans must hold, as the code points the verse text carries at the
 * marked letter (the mushaf's small sign, or the letter itself) — never the verse text.
 */
const COLORED: Record<string, RegExp[]> = {
  // Sakt: the small high seen on the last letter of the word paused on.
  '18:1': [/^اۜ$/],
  '36:52': [/^اۜ/],
  '75:27': [/^نْۜ$/], // the noon, although the API tags it as merged into the ra
  '83:14': [/^لْۜ$/],
  // Imalah: the ra with the low diamond; tas-hil: the second hamza's seat; ishmam: the letter with the diamond.
  '11:41': [/^ر۪$/],
  '41:44': [/^ا/],
  '12:11': [/۫/],
  // Sad or seen: small seen above, above, below, none.
  '2:245': [/^صۜ/],
  '7:69': [/^صۜ/],
  '52:37': [/^صۣ/],
  '88:22': [/^ص[ً-ْ]*$/],
  // Two ways: the kasra lam, the three dads, the small ya.
  '49:11': [/^لِ$/],
  '30:54': [/^ض/, /^ض/, /^ض/],
  '27:36': [/^ۦ/],
}

const UNIT_LESSONS = [saktat, imalahTashilIshmam, sadSeen, hafsTwoWays]

describe('Hafs special words unit (L23)', () => {
  it('registers four lessons, 11 to 11.3, under a bilingual unit 11', () => {
    expect(UNITS['hafs-special'].order).toBe(11)
    expect(UNITS['hafs-special'].title.ar.trim()).not.toBe('')
    expect(UNITS['hafs-special'].title.en.trim()).not.toBe('')
    expect(LESSONS.filter((l) => l.unit === 'hafs-special')).toEqual(UNIT_LESSONS)
    expect(UNIT_LESSONS.map((l) => l.order)).toEqual([11, 11.1, 11.2, 11.3])
    for (const lesson of UNIT_LESSONS) {
      expect(lesson.focusRules).toEqual(['hafs_special'])
      expect(lesson.reviewed).toBe(false)
      expect(lesson.mutoon?.tuhfa).toBe('not-covered')
    }
  })

  it('covers every place the card lists, each with a colored letter', () => {
    expect(UNIT_LESSONS.flatMap((l) => l.examples.map((e) => e.verseKey)).sort()).toEqual(Object.keys(COLORED).sort())
  })

  it('gives each teaching section of imalah, tas-hil and ishmam its own clip', () => {
    expect(imalahTashilIshmam.sections.map((s) => s.animation)).toEqual(['hafs-imalah', 'hafs-tashil', 'hafs-ishmam'])
  })

  describe.each(UNIT_LESSONS.map((l) => [l.id, l] as const))('%s', (_id, lesson) => {
    it.each(['ar', 'en'] as const)('renders in %s with the direction set and its colored letters', (locale) => {
      const container = renderLesson(lesson, locale)
      expect(document.documentElement).toHaveAttribute('lang', locale)
      expect(document.documentElement).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
      const screen = within(container)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(lesson.title[locale])
      for (const section of lesson.sections) expect(screen.getByText(section.body[locale])).toBeInTheDocument()

      for (const { verseKey, note } of lesson.examples) {
        const card = example(container, verseKey)
        expect(card, verseKey).toBeDefined()
        expect(card).toHaveTextContent(note[locale])
        const quran = card.querySelector('.quran')!
        expect(quran).toHaveAttribute('lang', 'ar')
        expect(quran).toHaveAttribute('dir', 'rtl')
        const colored = [...quran.querySelectorAll<HTMLElement>('span[title]')]
        // Only this unit's rule is colored, named in the page's language.
        colored.forEach((span) => expect(span.title).toBe(CUSTOM_RULES.hafs_special.name[locale]))
        const texts = colored.map((span) => span.textContent ?? '')
        expect(texts, verseKey).toHaveLength(COLORED[verseKey].length)
        COLORED[verseKey].forEach((pattern, i) => expect(texts[i], verseKey).toMatch(pattern))
      }
    })
  })
})
