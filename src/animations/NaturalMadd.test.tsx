import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { maddFilled, maddStepDuration } from './MaddBar'
import { naturalMadd } from './NaturalMadd'

afterEach(() => localStorage.clear())

const renderStep = (index: number, progress: number, locale: 'ar' | 'en' = 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  return render(<LocaleProvider>{naturalMadd.steps[index].render(progress)}</LocaleProvider>)
}

describe('maddFilled/maddStepDuration (src/animations/MaddBar.ts)', () => {
  it('holds the bar full for a trailing pause after a step of counts*1s', () => {
    expect(maddStepDuration(2)).toBe(2600) // 2 * 1000ms/count + 600ms hold
  })

  it('grows one count per second, then caps at counts through the hold', () => {
    expect(maddFilled(2, 0)).toBe(0)
    expect(maddFilled(2, 0.5)).toBeCloseTo(1.3) // 1300ms elapsed of a 2600ms step
    expect(maddFilled(2, 1)).toBe(2)
    // The beat where count 1 begins: 1000ms into the step.
    expect(maddFilled(2, 1000 / maddStepDuration(2))).toBeCloseTo(1)
    // Bar finishes counting at 2000ms, then holds full through the remaining 600ms.
    expect(maddFilled(2, 2000 / maddStepDuration(2))).toBeCloseTo(2)
    expect(maddFilled(2, 2300 / maddStepDuration(2))).toBe(2)
  })
})

describe('natural-madd clip (src/animations/NaturalMadd.tsx)', () => {
  it('has one step per madd letter, each lasting a 2-count bar plus its hold', () => {
    expect(naturalMadd.steps).toHaveLength(3)
    for (const step of naturalMadd.steps) {
      expect(step.duration).toBe(maddStepDuration(2))
    }
  })

  it('captions each step with both languages, naming the letter and its 2 counts', () => {
    const captions = naturalMadd.steps.map((step) => step.caption)
    expect(captions[0]).toMatchObject({ en: expect.stringContaining('Alif') })
    expect(captions[1]).toMatchObject({ en: expect.stringContaining('Waw') })
    expect(captions[2]).toMatchObject({ en: expect.stringContaining('Ya') })
    for (const caption of captions) {
      expect(caption?.ar.trim()).not.toBe('')
      expect(caption?.en).toMatch(/2 counts/)
    }
  })

  it.each([
    [0, 'ا'],
    [1, 'و'],
    [2, 'ي'],
  ])('step %i points its arrow and bar at the madd letter %s, before the harakah beside it', (index, letter) => {
    const { container } = renderStep(index, 0)
    const texts = [...container.querySelectorAll('text')].map((t) => t.textContent)
    expect(texts).toContain(letter)
    expect(container.querySelector('.madd-bar-arrow')).not.toBeNull()
    expect(container.querySelector('[data-current]')).not.toBeNull()
  })

  it('starts a step with an empty bar and no count shown', () => {
    const { container } = renderStep(0, 0)
    expect(container.querySelector('.madd-bar-fill')).toHaveAttribute('width', '0')
    expect(container.querySelector('.madd-bar-count')).toBeNull()
  })

  it('fills the bar and shows the running count partway through a step', () => {
    const { container } = renderStep(0, 0.5) // 1300ms of 2600ms: 1 count begun, filling toward 2
    const fill = container.querySelector('.madd-bar-fill')!
    expect(Number(fill.getAttribute('width'))).toBeCloseTo(130) // 1.3/2 * 200
    expect(container.querySelector('.madd-bar-count')).toHaveTextContent('2')
  })

  it('ends a step with the bar full at count 2, holding through the pause', () => {
    const { container } = renderStep(0, 1)
    expect(container.querySelector('.madd-bar-fill')).toHaveAttribute('width', '200')
    expect(container.querySelector('.madd-bar-count')).toHaveTextContent('2')
  })
})
