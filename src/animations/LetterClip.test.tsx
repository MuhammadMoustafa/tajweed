import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { getWord } from '../data/quran'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { LETTER_CARDS, letterWord, splitAtLetter } from '../letters/letters'
import { letterClip } from './LetterClip'
import { makharijOf, makhrajOfLetter } from './mouth/makharij'
import type { Clip } from './player/clip'

afterEach(() => localStorage.clear())

const renderFrame = (clip: Clip, step: number, progress: number) =>
  render(<LocaleProvider>{clip.steps[step].render(progress)}</LocaleProvider>).container

describe.each(LETTER_CARDS.map((c) => [c.id, c] as const))('letter clip %s', (_id, card) => {
  const clip = letterClip(card)
  const makhraj = makhrajOfLetter(card.letter)

  it('labels and captions every step in both languages', () => {
    for (const lang of ['ar', 'en'] as const) {
      expect(clip.title[lang].trim()).not.toBe('')
      for (const step of clip.steps) {
        expect(step.label?.[lang].trim()).toBeTruthy()
        expect(step.caption?.[lang].trim()).toBeTruthy()
        expect(step.duration).toBeGreaterThanOrEqual(2500)
      }
    }
  })

  it('draws the area (when it holds several makharij), then the exact contact point', () => {
    const withArea = makharijOf(makhraj.area).length > 1
    expect(clip.steps).toHaveLength(withArea ? 3 : 2)
    const point = clip.steps.length - 2
    expect(clip.steps[point].label).toEqual(makhraj.name)
    expect(clip.steps[point].caption).toEqual(makhraj.description)
    for (const progress of [0, 1]) {
      const frame = renderFrame(clip, point, progress)
      expect(frame.querySelector(`[data-contact="${makhraj.contact.kind}"]`)).not.toBeNull()
      for (const region of makhraj.regions) expect(frame.querySelector(`[data-label="${region}"]`)).not.toBeNull()
      expect(frame.querySelector(`[data-lit="true"]`)).not.toBeNull()
    }
    if (withArea) expect(renderFrame(clip, 0, 1).querySelector(`[data-label="${makhraj.area}"]`)).not.toBeNull()
  })

  it('ends by playing its word, shown from the data with the letter colored', () => {
    const listen = clip.steps[clip.steps.length - 1]
    const key = letterWord(card)
    expect(listen.audio).toEqual({ word: key })
    const text = getWord(key)!.text
    for (const progress of [0, 1]) {
      const frame = renderFrame(clip, clip.steps.length - 1, progress)
      const word = frame.querySelector(`[data-word="${key}"]`)
      expect(word?.textContent).toBe(text)
      expect(word?.querySelector('[data-letter]')?.textContent).toBe(splitAtLetter(text, card.letter)!.at)
    }
  })
})
