import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { findLesson } from '../lessons'
import { MatnPanel } from './MatnPanel'

// qalqalah carries two jazariyya refs (see src/lessons/qalqalah.ts); real lesson data so the test
// also exercises the real src/data/mutoon.json.
const refs = findLesson('qalqalah')!.mutoon!

const renderPanel = () =>
  render(
    <LocaleProvider>
      <MatnPanel refs={refs} />
    </LocaleProvider>,
  )

describe('MatnPanel', () => {
  it('renders nothing for an empty ref list', () => {
    const { container } = render(
      <LocaleProvider>
        <MatnPanel refs={[]} />
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

  it('shows a source link per ref', () => {
    const { container } = renderPanel()
    const links = container.querySelectorAll('a.matn-source')
    expect(links.length).toBe(refs.length)
    links.forEach((link) => expect(link.getAttribute('href')).toMatch(/^https:\/\/www\.alukah\.net\//))
  })
})
