import { render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LessonView } from './LessonView'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { TAJWEED_RULES } from '../tajweed/rules'
import { LESSONS } from '../lessons'
import { otherMadd } from '../lessons/other-madd'

afterEach(() => localStorage.clear())

const renderLesson = (locale: 'ar' | 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  return render(
    <LocaleProvider>
      <LessonView lesson={otherMadd} />
    </LocaleProvider>,
  ).container
}

/** The example card for `verseKey`, found by its visible verse key. */
const example = (container: HTMLElement, verseKey: string) =>
  [...container.querySelectorAll<HTMLElement>('.example')].find(
    (card) => card.querySelector('.verse-key')?.textContent === verseKey,
  )!

/** Colored rule spans in an example's Quran text, as `title` (the rule's name) per span. */
const ruleTitles = (card: HTMLElement, locale: 'ar' | 'en') =>
  [...card.querySelectorAll<HTMLElement>('.quran span[title]')].map((span) => span.title).filter(Boolean).map(
    (title) => Object.values(TAJWEED_RULES).find((rule) => rule.name[locale] === title)?.id,
  )

describe('other-madd lesson (L16)', () => {
  it('is registered as lesson 16', () => {
    expect(LESSONS.find((l) => l.id === 'other-madd')).toBe(otherMadd)
    expect(otherMadd.order).toBe(6.3)
    expect(otherMadd.reviewed).toBe(false)
  })

  it('gives each of the five kinds its own section clip, and the lesson none of its own', () => {
    expect(otherMadd.animation).toBeUndefined()
    expect(otherMadd.sections.map((s) => s.animation)).toEqual([
      undefined,
      'madd-arid',
      'madd-leen',
      'madd-badal',
      'madd-iwad',
      'madd-silah',
    ])
  })

  it.each(['ar', 'en'] as const)('renders in %s with the page direction set and every section clip', (locale) => {
    const container = renderLesson(locale)
    expect(document.documentElement).toHaveAttribute('lang', locale)
    expect(document.documentElement).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    const screen = within(container)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(otherMadd.title[locale])
    for (const section of otherMadd.sections.slice(1)) {
      expect(screen.getByText(section.body[locale])).toBeInTheDocument()
    }
    expect(container.querySelectorAll('.section-animation .player')).toHaveLength(5)
    for (const quran of container.querySelectorAll('.quran')) {
      expect(quran).toHaveAttribute('lang', 'ar')
      expect(quran).toHaveAttribute('dir', 'rtl')
    }
  })

  it('colors what the API tags: ʿarid and leen as permissible, silah sughra as natural, silah kubra as obligatory', () => {
    const container = renderLesson('en')
    expect(ruleTitles(example(container, '1:4'), 'en')).toContain('madda_permissible')
    expect(ruleTitles(example(container, '106:1'), 'en')).toContain('madda_permissible')
    expect(ruleTitles(example(container, '106:4'), 'en')).toEqual(['madda_obligatory', 'madda_permissible'])
    expect(ruleTitles(example(container, '110:3'), 'en')).toEqual(['madda_normal'])
    expect(ruleTitles(example(container, '104:3'), 'en')).toEqual(['madda_obligatory'])
    const permissible = example(container, '106:1').querySelector('[style*="--tj-madd-permissible"]')
    expect(permissible).not.toBeNull()
  })

  it('leaves badal and ʿiwad uncolored (the API never tags them): 78:6 shows only its natural madd', () => {
    const container = renderLesson('ar')
    expect(ruleTitles(example(container, '78:6'), 'ar')).toEqual(['madda_normal'])
  })

  it('cites both poems', () => {
    expect(otherMadd.mutoon?.tuhfa).toHaveLength(2)
    expect(otherMadd.mutoon?.jazariyya).toHaveLength(3)
  })
})
