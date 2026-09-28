import { act, render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { formatNumber } from '../i18n/bilingual'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { LESSONS } from '../lessons'
import { setLessonLearned } from '../progress'
import { LessonList } from './LessonList'

const renderList = () => {
  const { container } = render(
    <LocaleProvider>
      <LessonList />
    </LocaleProvider>,
  )
  return { container, screen: within(container) }
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

describe('LessonList', () => {
  it('shows a "0 of N learned" summary with nothing learned yet', () => {
    const { screen } = renderList()
    expect(screen.getByText(`0 of ${LESSONS.length} learned`)).toBeInTheDocument()
  })

  it('shows a check plus accessible text, and updates the count, once a lesson is marked learned', () => {
    const lesson = LESSONS[0]
    const { screen, container } = renderList()

    act(() => {
      setLessonLearned(lesson.id, true)
    })

    expect(screen.getByText(`1 of ${LESSONS.length} learned`)).toBeInTheDocument()
    // Not color alone: a check glyph plus screen-reader text name the state.
    expect(container.querySelector('.learned-check')).not.toBeNull()
    expect(screen.getByText('Learned', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('formats the count with Arabic-Indic digits in Arabic', () => {
    localStorage.setItem('tajweed.locale', 'ar')
    const { screen } = renderList()
    const expectedTotal = formatNumber('ar', LESSONS.length)
    expect(screen.getByText(`٠ من ${expectedTotal} تم تعلّمها`)).toBeInTheDocument()
  })
})
