import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import {
  makharijHalq,
  makharijJawf,
  makharijKhayshum,
  makharijLisan,
  makharijShafatan,
} from './MakharijClips'
import type { Clip } from './player/clip'

afterEach(() => localStorage.clear())

/** Every `data-region` element the frame lights (own highlight, or a child via MouthDiagram's parent map). */
const litRegions = (clip: Clip, stepIndex: number): string[] => {
  const { container } = render(
    <LocaleProvider>{clip.steps[stepIndex].render(1)}</LocaleProvider>,
  )
  return [...container.querySelectorAll('[data-lit="true"]')].map((el) => el.getAttribute('data-region')!).sort()
}

describe.each([
  ['al-jawf', makharijJawf, [['jawf'], ['jawf'], ['jawf']]],
  ['al-halq', makharijHalq, [['halq-deepest'], ['halq-middle'], ['halq-closest']]],
  [
    'al-lisan',
    makharijLisan,
    [
      ['palate', 'tongue-back'],
      ['palate', 'tongue-back'],
      ['palate', 'tongue-middle'],
      ['teeth-upper', 'tongue-sides'],
      ['tongue-sides', 'tongue-tip'],
      ['tongue-tip'],
      ['teeth-upper', 'tongue-tip'],
      ['teeth-upper', 'tongue-tip'],
      ['teeth-upper', 'tongue-tip'],
    ],
  ],
  ['ash-shafatan', makharijShafatan, [['lip-lower', 'teeth-upper'], ['lip-lower', 'lip-upper']]],
  ['al-khayshum', makharijKhayshum, [['khayshum']]],
] as const)('%s clip', (_name, clip, expectedRegions) => {
  it('has one step per area/point it teaches, at least 2.5s each', () => {
    expect(clip.steps).toHaveLength(expectedRegions.length)
    for (const step of clip.steps) expect(step.duration).toBeGreaterThanOrEqual(2500)
  })

  it.each(expectedRegions.map((regions, i) => [i, regions] as const))('step %i lights %o', (i, regions) => {
    expect(litRegions(clip, i)).toEqual([...regions].sort())
  })

  it('shows non-empty letters and a bilingual caption at every step', () => {
    for (const step of clip.steps) {
      const { container } = render(<LocaleProvider>{step.render(1)}</LocaleProvider>)
      expect(container.querySelector('.makharij-letters')?.textContent?.trim()).not.toBe('')
      expect(step.caption?.ar.trim()).not.toBe('')
      expect(step.caption?.en.trim()).not.toBe('')
    }
  })

  it('has a bilingual timeline label naming the area at every step', () => {
    for (const step of clip.steps) {
      expect(step.label?.ar.trim()).not.toBe('')
      expect(step.label?.en.trim()).not.toBe('')
    }
  })
})
