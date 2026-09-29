import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { getWord } from '../data/quran'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { ghunnah, LISTEN_MS } from './Ghunnah'
import { COUNT_MS, MADD_READY_MS, MADD_STOP_MS } from './MaddBar'
import { CLIP_WORDS } from './words'

afterEach(() => localStorage.clear())

const renderStep = (index: number, progress: number) => {
  localStorage.setItem('tajweed.locale', 'en')
  return render(<LocaleProvider>{ghunnah.steps[index].render(progress)}</LocaleProvider>)
}
const lit = (container: HTMLElement) =>
  [...container.querySelectorAll('[data-lit="true"]')].map((el) => el.getAttribute('data-region'))

describe('ghunnah clip (src/animations/Ghunnah.tsx)', () => {
  it('reuses the madd counting steps, then a listen step', () => {
    expect(ghunnah.steps.map((s) => s.duration)).toEqual([MADD_READY_MS, COUNT_MS, COUNT_MS, MADD_STOP_MS, LISTEN_MS])
    expect(ghunnah.steps.map((s) => s.audio)).toEqual([undefined, undefined, undefined, undefined, { word: CLIP_WORDS.ghunnah }])
    for (const step of ghunnah.steps) {
      expect(step.caption?.ar.trim()).not.toBe('')
      expect(step.caption?.en?.trim()).not.toBe('')
    }
  })

  it('lights the nose from the first count, not before', () => {
    expect(lit(renderStep(0, 0).container)).toEqual([])
    for (const i of [1, 2, 3, 4]) expect(lit(renderStep(i, 1).container)).toEqual(['khayshum'])
  })

  it('counts 2 on the green bar, marked at the first and the last count, under the doubled letter', () => {
    const { container } = renderStep(2, 1)
    expect(container.querySelector('.madd-bar-fill')).toHaveAttribute('width', '200')
    expect(container.querySelector('[data-marker="start"]')).toHaveAttribute('data-beat', '1')
    expect(container.querySelector('[data-marker="end"]')).toHaveAttribute('data-beat', '2')
    expect(container.querySelector('.anim-letter')).toHaveAttribute('fill', 'var(--tj-ghunnah)')
    expect(container.querySelector('.madd-bar-arrow')).not.toBeNull()
  })

  it('the listen step shows the recited word', () => {
    const { container } = renderStep(4, 1)
    expect(container.querySelector('.anim-word')).toHaveTextContent(getWord(CLIP_WORDS.ghunnah)!.text)
  })
})
