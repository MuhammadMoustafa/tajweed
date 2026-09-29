import { render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LessonView } from './LessonView'
import { getVerseMarkup } from '../data/quran'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { ui } from '../i18n/ui'
import { LESSONS } from '../lessons'
import { parseTajweed } from '../tajweed/parse'
import { ALL_RULES, type RuleId } from '../tajweed/rules'

afterEach(() => localStorage.clear())

const PRACTICE = LESSONS.filter((l) => l.unit === 'practice')

const renderLesson = (lesson: (typeof PRACTICE)[number], locale: 'ar' | 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  return render(
    <LocaleProvider>
      <LessonView lesson={lesson} />
    </LocaleProvider>,
  ).container
}

/** The rule id whose name (in `locale`) is `title`. */
const ruleNamed = (title: string, locale: 'ar' | 'en') =>
  (Object.keys(ALL_RULES) as RuleId[]).find((id) => ALL_RULES[id].name[locale] === title)

describe.each(PRACTICE.map((l) => [l.id, l] as const))('practice lesson %s (L22)', (_, lesson) => {
  it.each(['ar', 'en'] as const)('renders in %s: direction, prose, a legend naming every focus rule, a quiz link', (locale) => {
    const container = renderLesson(lesson, locale)
    expect(document.documentElement).toHaveAttribute('lang', locale)
    expect(document.documentElement).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    const screen = within(container)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(lesson.title[locale])
    for (const section of lesson.sections) {
      expect(screen.getByText(section.body[locale])).toBeInTheDocument()
      if (section.heading) expect(screen.getByRole('heading', { name: section.heading[locale] })).toBeInTheDocument()
    }
    const legend = [...container.querySelectorAll<HTMLElement>('.legend li')].map((li) => li.textContent?.trim())
    expect(legend).toEqual(lesson.focusRules.map((rule) => ALL_RULES[rule].name[locale]))
    expect(screen.getByRole('link', { name: new RegExp(ui.testYourself[locale]) })).toHaveAttribute(
      'href',
      `#/lesson/${lesson.id}/quiz`,
    )
  })

  it.each(['ar', 'en'] as const)('colors every rule the API tags in each ayah, with its note, in %s', (locale) => {
    const container = renderLesson(lesson, locale)
    const cards = [...container.querySelectorAll<HTMLElement>('.example')]
    expect(cards).toHaveLength(lesson.examples.length)
    lesson.examples.forEach((example, i) => {
      const card = cards[i]
      expect(card.querySelector('.verse-key')).toHaveTextContent(example.verseKey)
      expect(within(card).getByText(example.note[locale])).toBeInTheDocument()
      const quran = card.querySelector('.quran')!
      expect(quran).toHaveAttribute('lang', 'ar')
      expect(quran).toHaveAttribute('dir', 'rtl')
      const shown = [...quran.querySelectorAll<HTMLElement>('span[title]')].map((span) => ruleNamed(span.title, locale))
      const tagged = parseTajweed(getVerseMarkup(example.verseKey)!).segments.flatMap((s) => (s.rule ? [s.rule] : []))
      expect(shown.length, example.verseKey).toBeGreaterThan(0)
      expect(shown, example.verseKey).toEqual(tagged)
      for (const rule of shown) expect(lesson.focusRules).toContain(rule)
    })
  })
})
