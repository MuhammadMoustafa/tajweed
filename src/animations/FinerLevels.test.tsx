import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { FINER_STEP_MS, ghunnahLevels, idghamNaqis, ITBAQ_LETTERS, tafkhimLevels } from './FinerLevels'
import type { Clip } from './player/clip'

afterEach(() => localStorage.clear())

const renderStep = (clip: Clip, index: number, progress = 1) => {
  localStorage.setItem('tajweed.locale', 'en')
  return render(<LocaleProvider>{clip.steps[index].render(progress)}</LocaleProvider>)
}
const lit = (container: HTMLElement) =>
  [...container.querySelectorAll('[data-lit="true"]')].map((el) => el.getAttribute('data-region'))

describe.each([
  ['tafkhim levels', tafkhimLevels, 6],
  ['ghunnah levels', ghunnahLevels, 4],
  ['idgham complete and incomplete', idghamNaqis, 3],
])('%s clip', (_name, clip, steps) => {
  it('has slow, labelled, bilingual steps that never autoplay audio', () => {
    expect(clip.steps).toHaveLength(steps)
    for (const step of clip.steps) {
      expect(step.duration).toBe(FINER_STEP_MS)
      expect(step.label?.ar.trim()).not.toBe('')
      expect(step.label?.en.trim()).not.toBe('')
      expect(step.caption?.ar.trim()).not.toBe('')
      expect(step.caption?.en.trim()).not.toBe('')
      expect(step.audio).toBeUndefined()
    }
  })
})

describe('tafkhim levels', () => {
  it('raises the back of the tongue at every level, then closes it on the palate for the itbaq letters', () => {
    for (let i = 0; i < 5; i++) expect(lit(renderStep(tafkhimLevels, i).container)).toEqual(expect.arrayContaining(['tongue-back']))
    const last = renderStep(tafkhimLevels, 5).container
    expect(lit(last)).toContain('palate')
    expect([...last.querySelectorAll('.makharij-letter')].map((el) => el.textContent)).toEqual([...ITBAQ_LETTERS])
  })

  it('lists the five levels in order: fatha with alif, fatha, damma, sukun, kasra', () => {
    const shown = [0, 1, 2, 3, 4].map((i) => renderStep(tafkhimLevels, i).container.querySelector('.makharij-letter')!.textContent!)
    expect(shown.map((s) => s.slice(1))).toEqual(['َا', 'َ', 'ُ', 'ْ', 'ِ'])
  })
})

describe('ghunnah levels', () => {
  it('fills the two-count bar as the step runs, ending full, with the nose lit', () => {
    for (const i of [0, 1, 2]) {
      expect(renderStep(ghunnahLevels, i, 0.5).container.querySelector('.madd-bar-fill')).toHaveAttribute('width', '100')
      const end = renderStep(ghunnahLevels, i, 1).container
      expect(end.querySelector('.madd-bar-fill')).toHaveAttribute('width', '200')
      expect(lit(end)).toEqual(['khayshum'])
    }
  })

  it('shows no counting bar for izhar', () => {
    expect(renderStep(ghunnahLevels, 3).container.querySelector('.madd-bar-fill')).toBeNull()
  })
})
