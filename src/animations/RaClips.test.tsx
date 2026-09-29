import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { raSakinah, raVowel, raWaqf } from './RaClips'

afterEach(() => localStorage.clear())

const renderStep = (clip: typeof raVowel, index: number) => {
  localStorage.setItem('tajweed.locale', 'ar')
  return render(<LocaleProvider>{clip.steps[index].render(1)}</LocaleProvider>)
}

describe.each([
  ['ra-vowel', raVowel],
  ['ra-sakinah', raSakinah],
  ['ra-waqf', raWaqf],
])('%s clip', (_id, clip) => {
  it('labels every step in both languages and points at the ra', () => {
    for (const [i, step] of clip.steps.entries()) {
      expect(step.label?.ar.trim()).toBeTruthy()
      expect(step.label?.en.trim()).toBeTruthy()
      const { container, unmount } = renderStep(clip, i)
      expect(container.querySelectorAll('.makharij-letter[data-current]')).toHaveLength(1)
      expect(container.querySelector('.makharij-letter[data-current]')?.textContent).toContain('\u0631')
      unmount()
    }
  })
})

describe('ra-vowel clip', () => {
  it('goes fatha (heavy), damma (heavy), kasra (light)', () => {
    const heavy = [0, 1, 2].map((i) => {
      const { container, unmount } = renderStep(raVowel, i)
      const isHeavy = container.querySelector('[data-label="tongue-back"]') !== null
      unmount()
      return isHeavy
    })
    expect(heavy).toEqual([true, true, false])
  })
})
