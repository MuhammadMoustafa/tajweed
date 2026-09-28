import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { COUNT_MS, MADD_READY_MS, MADD_STOP_MS } from './MaddBar'
import { maddMunfasil, maddMuttasil } from './MaddObligatory'
import type { Clip } from './player/clip'

afterEach(() => localStorage.clear())

const renderStep = (clip: Clip, index: number, progress: number) =>
  render(<LocaleProvider>{clip.steps[index].render(progress)}</LocaleProvider>)

// Both clips (L14): get ready, count 1-4 (start marker on 1, end marker on 4), then stop — the
// same shape as natural-madd (#34) but at 4 counts, on the "madd-obligatory" token (not the
// count's own default, madd-permissible, which is L16's).
describe.each([
  ['muttasil', maddMuttasil, false],
  ['munfasil', maddMunfasil, true],
] as const)('%s clip (src/animations/MaddObligatory.tsx)', (_name, clip, expectAfterGap) => {
  it('has 6 steps: get ready, four counts, stop', () => {
    expect(clip.steps).toHaveLength(6)
    expect(clip.steps.map((step) => step.duration)).toEqual([
      MADD_READY_MS,
      COUNT_MS,
      COUNT_MS,
      COUNT_MS,
      COUNT_MS,
      MADD_STOP_MS,
    ])
  })

  it('captions and labels every step in both languages', () => {
    for (const step of clip.steps) {
      expect(step.caption?.ar.trim()).not.toBe('')
      expect(step.caption?.en.trim()).not.toBe('')
      expect(step.label?.ar.trim()).not.toBe('')
      expect(step.label?.en.trim()).not.toBe('')
    }
  })

  it('mentions both 4 and 5 counts in the ready caption, and both in the last count caption', () => {
    expect(clip.steps[0].caption?.en).toMatch(/four/i)
    expect(clip.steps[4].caption?.en).toMatch(/four/i)
    expect(clip.steps[4].caption?.en).toMatch(/five/i)
  })

  it('step 1 (get ready) shows an empty bar, both markers, no pulse, colored madd-obligatory', () => {
    const { container } = renderStep(clip, 0, 0)
    expect(container.querySelector('.madd-bar-fill')).toHaveAttribute('width', '0')
    expect(container.querySelector('[data-marker="start"]')).not.toBeNull()
    expect(container.querySelector('[data-marker="end"]')).toHaveAttribute('data-beat', '4')
    expect(container.querySelector('.madd-bar-pulse')).toBeNull()
  })

  it('the last count (step 4) ends with the bar full and the pulse on the end marker (beat 4)', () => {
    const { container } = renderStep(clip, 4, 1)
    expect(container.querySelector('.madd-bar-fill')).toHaveAttribute('width', '200')
    expect(container.querySelector('.madd-bar-pulse')).toHaveAttribute('data-beat', '4')
  })

  it('step 6 (stop) shows the bar full and stopped', () => {
    const { container } = renderStep(clip, 5, 0)
    expect(container.querySelector('.madd-bar-fill')).toHaveAttribute('width', '200')
    expect(container.querySelector('[data-stopped]')).not.toBeNull()
  })

  it('every step shows the madd letter and the hamza that causes it (the "cause")', () => {
    for (let step = 0; step < clip.steps.length; step += 1) {
      const { container } = renderStep(clip, step, 1)
      const texts = [...container.querySelectorAll('text')].map((t) => t.textContent)
      expect(texts).toContain('ا')
      expect(container.querySelector('.madd-bar-after')?.textContent?.trim()).not.toBe('')
    }
  })

  it(`draws the hamza with${expectAfterGap ? '' : ' no'} a word gap (muttasil: same word, munfasil: new word)`, () => {
    const { container } = renderStep(clip, 0, 0)
    const after = container.querySelector('.madd-bar-after')!
    const letter = [...container.querySelectorAll('text.anim-letter')].find((t) => t.textContent === 'ا')!
    const gap = Number(letter.getAttribute('x')) - Number(after.getAttribute('x'))
    // No gap: ~22 (LETTER_HALF_WIDTH); with a gap: ~38 (LETTER_HALF_WIDTH + 16).
    if (expectAfterGap) expect(gap).toBeGreaterThan(30)
    else expect(gap).toBeLessThan(30)
  })
})
