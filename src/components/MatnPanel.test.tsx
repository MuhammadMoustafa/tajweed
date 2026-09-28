import { fireEvent, render, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ui } from '../i18n/ui'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { findLesson } from '../lessons'
import { MatnPanel } from './MatnPanel'

// qalqalah carries a 'not-covered' tuhfa entry plus two jazariyya passages (see
// src/lessons/qalqalah.ts); real lesson data so the test also exercises the real
// src/data/mutoon.json.
const refs = findLesson('qalqalah')!.mutoon!

const renderPanel = () =>
  render(
    <LocaleProvider>
      <MatnPanel refs={refs} />
    </LocaleProvider>,
  )

describe('MatnPanel', () => {
  it('renders nothing when the lesson has no matn panel', () => {
    const { container } = render(
      <LocaleProvider>
        <MatnPanel refs={undefined} />
      </LocaleProvider>,
    )
    expect(container.querySelector('.matn-panel')).toBeNull()
  })

  it('is closed by default', () => {
    const { container } = renderPanel()
    const details = container.querySelector('details.matn-panel')
    expect(details).not.toBeNull()
    expect((details as HTMLDetailsElement).open).toBe(false)
  })

  it('always renders one section per poem, both tuhfa and jazariyya', () => {
    const { container } = renderPanel()
    const poems = container.querySelectorAll('.matn-poem')
    expect(poems.length).toBe(2)
    expect(container.querySelector('.matn-poem-tuhfa')).not.toBeNull()
    expect(container.querySelector('.matn-poem-jazariyya')).not.toBeNull()
  })

  it('renders poems in order: tuhfa before jazariyya', () => {
    const { container } = renderPanel()
    const poems = [...container.querySelectorAll('.matn-poem')]
    expect(poems[0]).toHaveClass('matn-poem-tuhfa')
    expect(poems[1]).toHaveClass('matn-poem-jazariyya')
  })

  it('shows the matn lines once opened', () => {
    const { container } = renderPanel()
    const details = container.querySelector('details.matn-panel') as HTMLDetailsElement

    // No lines rendered while closed content is still in the DOM (details keeps its children),
    // but the panel itself must be closed; opening it is what a reader does to see the lines.
    expect(container.querySelectorAll('.matn-line').length).toBeGreaterThan(0)

    fireEvent.click(container.querySelector('summary')!)
    expect(details.open).toBe(true)
    expect(container.querySelectorAll('.matn-line').length).toBeGreaterThan(0)

    const firstLine = container.querySelector('.matn-line')!
    expect(firstLine).toHaveAttribute('lang', 'ar')
    expect(firstLine).toHaveAttribute('dir', 'rtl')
    expect(firstLine.querySelector('.matn-sadr')?.textContent).not.toBe('')
    expect(firstLine.querySelector('.matn-ajuz')?.textContent).not.toBe('')
  })

  it('shows a source link only for a poem that covers the rule', () => {
    const { container } = renderPanel()
    // qalqalah: tuhfa is 'not-covered' (no link), jazariyya has passages (one link).
    expect(container.querySelector('.matn-poem-tuhfa a.matn-source')).toBeNull()
    const jazariyyaLink = container.querySelector('.matn-poem-jazariyya a.matn-source')
    expect(jazariyyaLink?.getAttribute('href')).toMatch(/^https:\/\/www\.alukah\.net\//)
  })

  it('shows an empty-state line and no lines/source for a poem with no section on the rule', () => {
    const { container } = renderPanel()
    const tuhfaSection = container.querySelector('.matn-poem-tuhfa')!
    expect(tuhfaSection.querySelector('.matn-not-covered')?.textContent).not.toBe('')
    expect(tuhfaSection.querySelectorAll('.matn-line').length).toBe(0)
    expect(tuhfaSection.querySelector('a.matn-source')).toBeNull()
  })

  it('a poem with two passages (qalqalah/jazariyya) renders both, each with its own note', () => {
    const { container } = renderPanel()
    const passages = container.querySelectorAll('.matn-poem-jazariyya .matn-passage')
    expect(passages.length).toBe(2)
    passages.forEach((p) => expect(p.querySelector('.matn-note')?.textContent).not.toBe(''))
  })

  it('renders both poems (Tuhfa and Jazariyya) when a lesson cites both', () => {
    const bothRefs = findLesson('natural-madd')!.mutoon!
    expect(bothRefs.tuhfa).not.toBe('not-covered')
    expect(bothRefs.jazariyya).not.toBe('not-covered')

    const { container } = render(
      <LocaleProvider>
        <MatnPanel refs={bothRefs} />
      </LocaleProvider>,
    )
    // Whichever language the test environment resolves to, both titles render literally (they are
    // UI strings, not translated at runtime), so match either language's text. Scoped to this
    // render's own container: other tests in this file also render a MatnPanel, and this project's
    // test setup does not auto-cleanup the DOM between tests (see LessonView.test.tsx), so an
    // unscoped screen/getByText query would also match leftover DOM from earlier tests.
    const scoped = within(container)
    const tuhfaTitle = scoped.getByText(new RegExp(`^(${ui.matnTuhfaTitle.ar}|${ui.matnTuhfaTitle.en})$`))
    const jazariyyaTitle = scoped.getByText(new RegExp(`^(${ui.matnJazariyyaTitle.ar}|${ui.matnJazariyyaTitle.en})$`))

    const poemNames = [...container.querySelectorAll('.matn-poem-name')]
    expect(poemNames.indexOf(tuhfaTitle)).toBe(0)
    expect(poemNames.indexOf(jazariyyaTitle)).toBe(1)
  })
})
