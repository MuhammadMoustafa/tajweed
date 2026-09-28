import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { COUNT_MS, MADD_READY_MS, MADD_STOP_MS, maddBeatFilled } from './MaddBar'
import { getWord } from '../data/quran'
import { LISTEN_MS, naturalMadd } from './NaturalMadd'
import { CLIP_WORDS } from './words'

afterEach(() => localStorage.clear())

const renderStep = (index: number, progress: number, locale: 'ar' | 'en' = 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  return render(<LocaleProvider>{naturalMadd.steps[index].render(progress)}</LocaleProvider>)
}

describe('maddBeatFilled (src/animations/MaddBar.tsx)', () => {
  it('grows from beat-1 to beat across a single count', () => {
    expect(maddBeatFilled(1, 0)).toBe(0)
    expect(maddBeatFilled(1, 0.5)).toBeCloseTo(0.5)
    expect(maddBeatFilled(1, 1)).toBe(1)
    expect(maddBeatFilled(2, 0)).toBe(1)
    expect(maddBeatFilled(2, 0.5)).toBeCloseTo(1.5)
    expect(maddBeatFilled(2, 1)).toBe(2)
  })

  it('clamps progress to 0…1', () => {
    expect(maddBeatFilled(1, -1)).toBe(0)
    expect(maddBeatFilled(1, 2)).toBe(1)
  })
})

// natural-madd (MaddBar, src/animations/MaddBar.tsx): one counting demonstration on بَا — get
// ready, count one, count two (the end marker), then stop (#34) — then listen to a Quran word (#35).
describe('natural-madd clip (src/animations/NaturalMadd.tsx)', () => {
  it('has 5 steps: get ready, count one, count two, stop, listen', () => {
    expect(naturalMadd.steps).toHaveLength(5)
    expect(naturalMadd.steps.map((step) => step.duration)).toEqual([
      MADD_READY_MS,
      COUNT_MS,
      COUNT_MS,
      MADD_STOP_MS,
      LISTEN_MS,
    ])
  })

  it('only step 5 (listen) plays audio: the reciter saying its Quran word, whose text it shows', () => {
    expect(naturalMadd.steps.map((step) => step.audio)).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      { word: CLIP_WORDS.naturalMadd },
    ])
    const { container } = renderStep(4, 1)
    expect(container.querySelector('.anim-word')).toHaveTextContent(getWord(CLIP_WORDS.naturalMadd)!.text)
    // The word is shown plain, over a full 2-count bar; no arrow at a letter.
    expect(container.querySelector('.madd-bar-arrow')).toBeNull()
    expect(container.querySelector('.madd-bar-fill')).toHaveAttribute('width', '200')
    expect(container.querySelector('[data-marker="end"]')).toHaveAttribute('data-beat', '2')
  })

  it('captions each step in both languages', () => {
    const captions = naturalMadd.steps.map((step) => step.caption)
    for (const caption of captions) {
      expect(caption?.ar.trim()).not.toBe('')
      expect(caption?.en?.trim()).not.toBe('')
    }
    expect(captions[0]).toMatchObject({ en: expect.stringContaining('بَا') })
    expect(captions[1]).toMatchObject({ en: expect.stringMatching(/count one/i) })
    expect(captions[2]).toMatchObject({ en: expect.stringMatching(/count two/i) })
    expect(captions[3]).toMatchObject({ en: expect.stringMatching(/stop/i) })
  })

  it('step 1 (get ready) shows an empty bar with both start and end markers, no pulse yet', () => {
    const { container } = renderStep(0, 0)
    expect(container.querySelector('.madd-bar-fill')).toHaveAttribute('width', '0')
    expect(container.querySelector('[data-marker="start"]')).not.toBeNull()
    expect(container.querySelector('[data-marker="end"]')).not.toBeNull()
    expect(container.querySelector('[data-marker="end"]')).toHaveAttribute('data-beat', '2')
    expect(container.querySelector('.madd-bar-pulse')).toBeNull()
    expect(container.querySelector('[data-stopped]')).toBeNull()
  })

  it('step 2 (count one) fills toward the first count and lands the pulse on beat 1 at its end', () => {
    const mid = renderStep(1, 0.5)
    expect(Number(mid.container.querySelector('.madd-bar-fill')!.getAttribute('width'))).toBeCloseTo(50) // 0.5/2 * 200
    mid.unmount()

    const { container } = renderStep(1, 1)
    expect(Number(container.querySelector('.madd-bar-fill')!.getAttribute('width'))).toBeCloseTo(100) // 1/2 * 200
    const pulse = container.querySelector('.madd-bar-pulse')
    expect(pulse).not.toBeNull()
    expect(pulse).toHaveAttribute('data-beat', '1')
  })

  it('step 3 (count two) ends with the bar full and the pulse landed on the end marker (beat 2)', () => {
    const { container } = renderStep(2, 1)
    expect(container.querySelector('.madd-bar-fill')).toHaveAttribute('width', '200')
    const pulse = container.querySelector('.madd-bar-pulse')
    expect(pulse).not.toBeNull()
    expect(pulse).toHaveAttribute('data-beat', '2')
  })

  it('step 4 (stop) shows the bar full, stopped, with no running pulse', () => {
    const { container } = renderStep(3, 0)
    expect(container.querySelector('.madd-bar-fill')).toHaveAttribute('width', '200')
    expect(container.querySelector('[data-stopped]')).not.toBeNull()
    expect(container.querySelector('.madd-bar-pulse')).toBeNull()
  })

  it('every step anchors the arrow and bar at the same letter (بَا)', () => {
    for (let step = 0; step < 4; step += 1) {
      const { container } = renderStep(step, 1)
      const texts = [...container.querySelectorAll('text')].map((t) => t.textContent)
      expect(texts).toContain('ا')
      expect(container.querySelector('.madd-bar-arrow')).not.toBeNull()
      expect(container.querySelector('[data-current]')).not.toBeNull()
    }
  })
})
