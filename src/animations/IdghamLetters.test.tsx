import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { idghamMithlayn, idghamMutajanisayn, idghamMutaqaribayn } from './IdghamLetters'
import type { Clip } from './player/clip'

afterEach(() => localStorage.clear())

const renderStep = (clip: Clip, index: number, progress: number) =>
  render(<LocaleProvider>{clip.steps[index].render(progress)}</LocaleProvider>)

const lit = (container: HTMLElement) =>
  [...container.querySelectorAll('[data-lit="true"]')].map((el) => el.getAttribute('data-region')).sort()

// One clip per kind (L18). Mithlayn and mutajanisayn letters share a place (one "where" step);
// mutaqaribayn are made at different places, so the lam and the ra each get their own step.
describe.each([
  ['mithlayn', idghamMithlayn, 3, ['lip-lower', 'lip-upper']],
  ['mutajanisayn', idghamMutajanisayn, 3, ['teeth-upper', 'tongue-tip']],
  ['mutaqaribayn', idghamMutaqaribayn, 4, ['gums', 'tongue-tip']],
] as const)('%s clip (src/animations/IdghamLetters.tsx)', (_name, clip, steps, secondLit) => {
  it(`has ${steps} labelled, captioned steps in both languages`, () => {
    expect(clip.steps).toHaveLength(steps)
    for (const step of clip.steps) {
      for (const text of [step.label, step.caption]) {
        expect(text?.ar.trim()).not.toBe('')
        expect(text?.en.trim()).not.toBe('')
      }
    }
  })

  it('shows both letters at the start and only the doubled letter at its end frame', () => {
    const start = renderStep(clip, 0, 0).container
    expect(start.querySelector('[data-part="first"]')).not.toBeNull()
    expect(start.querySelector('[data-part="second"]')).not.toBeNull()
    expect(start.querySelector('[data-part="result"]')).toBeNull()
    const merge = clip.steps.length - 2
    const mid = renderStep(clip, merge, 0.5).container
    expect(mid.querySelector('[data-part="first"]')?.getAttribute('x')).toBe('150')
    const end = renderStep(clip, merge, 1).container
    expect(end.querySelector('[data-part="first"]')?.getAttribute('opacity')).toBe('0')
    expect(end.querySelector('[data-part="result"]')?.getAttribute('opacity')).toBe('1')
  })

  it('lights the second letter’s place on the mouth diagram while they merge', () => {
    expect(lit(renderStep(clip, clip.steps.length - 2, 1).container)).toEqual(secondLit)
  })
})
