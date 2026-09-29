import { render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LessonView } from './LessonView'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { TAJWEED_RULES } from '../tajweed/rules'
import { LESSONS } from '../lessons'
import type { Lesson } from '../lessons/types'
import { maddWhenStopping } from '../lessons/other-madd'
import { maddBadalSilah } from '../lessons/badal-silah'

afterEach(() => localStorage.clear())

const renderLesson = (locale: 'ar' | 'en', lesson: Lesson = maddWhenStopping) => {
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

/** Colored rule spans in an example's Quran text, as `title` (the rule's name) per span. */
const ruleTitles = (card: HTMLElement, locale: 'ar' | 'en') =>
  [...card.querySelectorAll<HTMLElement>('.quran span[title]')].map((span) => span.title).filter(Boolean).map(
    (title) => Object.values(TAJWEED_RULES).find((rule) => rule.name[locale] === title)?.id,
  )

describe('madd when stopping lesson (L16, L16b)', () => {
  const lesson = maddWhenStopping
  it('is registered as 6.3 and keeps the id other-madd', () => {
    expect(LESSONS.find((l) => l.id === 'other-madd')).toBe(lesson)
    expect(lesson.order).toBe(6.3)
    expect(lesson.reviewed).toBe(false)
  })

  it('gives ʿarid, leen and ʿiwad each a section clip, and the lesson none of its own', () => {
    expect(lesson.animation).toBeUndefined()
    expect(lesson.sections.map((s) => s.animation)).toEqual([undefined, 'madd-arid', 'madd-leen', 'madd-iwad', undefined])
  })

  it.each(['ar', 'en'] as const)('renders in %s with the page direction set and every section clip', (locale) => {
    const container = renderLesson(locale)
    expect(document.documentElement).toHaveAttribute('lang', locale)
    expect(document.documentElement).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    const screen = within(container)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(lesson.title[locale])
    for (const section of lesson.sections.slice(1)) {
      expect(screen.getByText(section.body[locale])).toBeInTheDocument()
    }
    expect(container.querySelectorAll('.section-animation .player')).toHaveLength(3)
    for (const quran of container.querySelectorAll('.quran')) {
      expect(quran).toHaveAttribute('lang', 'ar')
      expect(quran).toHaveAttribute('dir', 'rtl')
    }
  })

  it('colors ʿarid and leen as permissible', () => {
    const container = renderLesson('en')
    expect(ruleTitles(example(container, '1:4'), 'en')).toContain('madda_permissible')
    expect(ruleTitles(example(container, '106:1'), 'en')).toContain('madda_permissible')
    expect(ruleTitles(example(container, '106:4'), 'en')).toEqual(['madda_obligatory', 'madda_permissible'])
    const permissible = example(container, '106:1').querySelector('[style*="--tj-madd-permissible"]')
    expect(permissible).not.toBeNull()
  })

  it('leaves ʿiwad uncolored (the API never tags it): 78:6 shows only its natural madd', () => {
    const container = renderLesson('ar')
    expect(ruleTitles(example(container, '78:6'), 'ar')).toEqual(['madda_normal'])
  })

  it('cites both poems', () => {
    expect(lesson.mutoon?.tuhfa).toHaveLength(2)
    expect(lesson.mutoon?.jazariyya).toHaveLength(3)
  })
})

describe('badal and silah lesson (L16b)', () => {
  const lesson = maddBadalSilah
  it('is registered as 6.4 right after madd when stopping', () => {
    expect(LESSONS.find((l) => l.id === 'badal-silah')).toBe(lesson)
    expect(lesson.order).toBe(6.4)
    expect(lesson.unit).toBe('madd')
    expect(lesson.reviewed).toBe(false)
  })

  it('gives badal and silah each a section clip', () => {
    expect(lesson.animation).toBeUndefined()
    expect(lesson.sections.map((s) => s.animation)).toEqual([undefined, 'madd-badal', 'madd-silah', undefined])
  })

  it.each(['ar', 'en'] as const)('renders in %s with the page direction set and both clips', (locale) => {
    const container = renderLesson(locale, lesson)
    expect(document.documentElement).toHaveAttribute('lang', locale)
    expect(document.documentElement).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    expect(within(container).getByRole('heading', { level: 2 })).toHaveTextContent(lesson.title[locale])
    expect(container.querySelectorAll('.section-animation .player')).toHaveLength(2)
  })

  it('colors silah sughra as natural and silah kubra as obligatory; badal stays uncolored', () => {
    const container = renderLesson('en', lesson)
    expect(ruleTitles(example(container, '110:3'), 'en')).toEqual(['madda_normal'])
    expect(ruleTitles(example(container, '104:3'), 'en')).toEqual(['madda_obligatory'])
    expect(ruleTitles(example(container, '106:4'), 'en')).toEqual(['madda_obligatory'])
  })

  it('shows both poems: the Tuhfa line on badal, the Jazariyya not covered', () => {
    expect(lesson.mutoon?.tuhfa).toHaveLength(1)
    expect(lesson.mutoon?.jazariyya).toBe('not-covered')
  })
})
