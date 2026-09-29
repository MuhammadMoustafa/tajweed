import { render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LessonView } from './LessonView'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { LESSONS } from '../lessons'
import { hasQuiz } from '../lessons/quiz'
import { sifat } from '../lessons/sifat'

afterEach(() => localStorage.clear())

const renderLesson = (locale: 'ar' | 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  return render(
    <LocaleProvider>
      <LessonView lesson={sifat} />
    </LocaleProvider>,
  ).container
}

describe('sifat lesson (L20)', () => {
  it('is registered as lesson 9, alone in its unit, awaiting review', () => {
    expect(LESSONS.find((l) => l.id === 'sifat')).toBe(sifat)
    expect(sifat.order).toBe(10)
    expect(sifat.unit).toBe('deeper')
    expect(sifat.reviewed).toBe(false)
    expect(LESSONS[LESSONS.length - 1]).toBe(sifat)
  })

  it('gives every section after the intro its own clip, and the lesson none of its own', () => {
    expect(sifat.animation).toBeUndefined()
    expect(sifat.sections.map((s) => s.animation)).toEqual([
      undefined,
      'sifat-hams-jahr',
      'sifat-shiddah-rakhawah',
      'sifat-istila-istifal',
      'sifat-itbaq-infitah',
      'sifat-idhlaq-ismat',
      'sifat-safir-qalqalah-lin',
      'sifat-inhiraf-istitalah',
      'sifat-compare',
    ])
  })

  // Like the makharij unit: the qualities are not API rules, so the notes point at letters instead.
  it('colors no rule, and still has a quiz of its own', () => {
    expect(sifat.focusRules).toEqual([])
    expect(hasQuiz(sifat)).toBe(true)
    expect(sifat.quiz?.length).toBeGreaterThanOrEqual(5)
  })

  it.each(['ar', 'en'] as const)('renders in %s: page direction, every section and clip, uncolored Arabic examples', (locale) => {
    const container = renderLesson(locale)
    expect(document.documentElement).toHaveAttribute('lang', locale)
    expect(document.documentElement).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    const screen = within(container)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(sifat.title[locale])
    for (const section of sifat.sections) {
      expect(screen.getByText(section.body[locale])).toBeInTheDocument()
    }
    expect(container.querySelectorAll('.section-animation .player')).toHaveLength(8)
    const verses = container.querySelectorAll('.quran')
    expect(verses).toHaveLength(sifat.examples.length)
    for (const quran of verses) {
      expect(quran).toHaveAttribute('lang', 'ar')
      expect(quran).toHaveAttribute('dir', 'rtl')
      expect(quran.querySelectorAll('span[title]')).toHaveLength(0)
    }
    for (const example of sifat.examples) {
      expect(screen.getByText(example.note[locale])).toBeInTheDocument()
    }
  })

  it('cites every line of al-Jazariyyah’s chapter on the qualities (20–26), and no Tuhfa line', () => {
    expect(sifat.mutoon?.tuhfa).toBe('not-covered')
    const passages = sifat.mutoon?.jazariyya
    if (!passages || passages === 'not-covered') throw new Error('no Jazariyya lines')
    const lines = passages.flatMap((p) => Array.from({ length: (p.to ?? p.from) - p.from + 1 }, (_, i) => p.from + i))
    expect(lines).toEqual([20, 21, 22, 23, 24, 25, 26])
  })
})
