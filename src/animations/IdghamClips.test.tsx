import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { idghamGhunnah, idghamWoGhunnah } from './IdghamClips'
import type { Clip } from './player/clip'

afterEach(() => localStorage.clear())

const draw = (clip: Clip, step: number, progress: number) =>
  render(<LocaleProvider>{clip.steps[step].render(progress)}</LocaleProvider>).container

describe.each([
  ['with ghunnah', idghamGhunnah, true],
  ['without ghunnah', idghamWoGhunnah, false],
] as const)('idgham clip %s', (_name, clip, withGhunnah) => {
  it('has three labelled, bilingual steps: the pair, the merge, the ending', () => {
    expect(clip.steps).toHaveLength(3)
    for (const step of clip.steps) {
      expect(step.label?.ar).toBeTruthy()
      expect(step.label?.en).toBeTruthy()
      expect(step.caption?.ar).toBeTruthy()
      expect(step.caption?.en).toBeTruthy()
    }
  })

  it('points at both letters in the first step', () => {
    const c = draw(clip, 0, 1)
    expect(c.querySelector('[data-part="noon-caret"]')).not.toBeNull()
    expect(c.querySelector('[data-part="target-caret"]')).not.toBeNull()
    expect(c.querySelector('[data-part="target"]')?.textContent).not.toContain('ّ')
  })

  it('merges the noon into the doubled letter, fading the noon out', () => {
    expect(draw(clip, 1, 0).querySelector('[data-part="noon"]')).toHaveAttribute('opacity', '1')
    const end = draw(clip, 1, 1)
    expect(end.querySelector('[data-part="noon"]')).toHaveAttribute('opacity', '0')
    expect(end.querySelector('[data-part="target"]')?.textContent).toContain('ّ')
  })

  it(withGhunnah ? 'ends with a 2-count ghunnah bar that fills' : 'ends with no ghunnah bar', () => {
    const end = draw(clip, 2, 1)
    expect(end.querySelector('[data-part="target"]')?.textContent).toContain('ّ')
    if (withGhunnah) {
      expect(end.querySelector('[data-part="ghunnah-bar"]')).not.toBeNull()
      expect(end.querySelector('[data-fill]')).toHaveAttribute('data-fill', '1')
      expect(clip.steps[2].duration).toBe(2000)
    } else {
      expect(end.querySelector('[data-part="ghunnah-bar"]')).toBeNull()
      expect(end.querySelector('[data-part="no-ghunnah"]')).not.toBeNull()
    }
  })
})
