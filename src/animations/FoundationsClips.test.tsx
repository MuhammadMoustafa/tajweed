import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { VOWELS } from '../lessons/vowels'
import { foundationsHarakat, foundationsShadda, foundationsSukun, foundationsTanween, MARKS } from './FoundationsClips'

const CLIPS = { foundationsHarakat, foundationsShadda, foundationsSukun, foundationsTanween }

describe('foundations clips (src/animations/FoundationsClips.tsx)', () => {
  it('has 3 + 1 + 1 + 3 steps, each labelled in both languages', () => {
    expect(foundationsHarakat.steps).toHaveLength(3)
    expect(foundationsSukun.steps).toHaveLength(1)
    expect(foundationsShadda.steps).toHaveLength(1)
    expect(foundationsTanween.steps).toHaveLength(3)
    for (const clip of Object.values(CLIPS))
      for (const s of clip.steps) {
        expect(s.label?.ar).toBeTruthy()
        expect(s.label?.en).toBeTruthy()
      }
  })

  it('ends each step with the mark landed on the letter and its sound shown', () => {
    for (const clip of Object.values(CLIPS))
      for (const s of clip.steps) {
        const { container } = render(<>{s.render(1)}</>)
        const svg = container.querySelector('svg')!
        const mark = svg.getAttribute('data-mark') as keyof typeof MARKS
        expect(container.querySelector('[data-landed]')?.textContent).toContain(MARKS[mark])
        expect(container.querySelector('[data-sound]')?.textContent).toBeTruthy()
      }
  })

  it('shows the mark still travelling at the start of a step', () => {
    const { container } = render(<>{foundationsHarakat.steps[0].render(0)}</>)
    expect(container.querySelector('[data-landed]')).toBeNull()
  })

  it('shows a distinct mouth shape per haraka, with syllable, word and IPA at the end of the step', () => {
    const shapes = foundationsHarakat.steps.map((s, i) => {
      const { container } = render(<>{s.render(1)}</>)
      const sound = container.querySelector('[data-sound]')!.textContent!
      for (const part of [VOWELS[i].syllable, VOWELS[i].word, VOWELS[i].ipa]) expect(sound).toContain(part)
      return container.querySelector('[data-mouth]')!.getAttribute('data-mouth')
    })
    expect(shapes).toEqual(['open', 'round', 'lowered'])
  })

  it('gives IPA, never a bare Latin sound, for the sukun and tanween', () => {
    for (const clip of [foundationsSukun, foundationsTanween])
      for (const s of clip.steps) {
        const { container } = render(<>{s.render(1)}</>)
        expect(container.querySelector('[data-sound]')!.textContent).toMatch(/\/[a-z]+\//)
      }
  })
})
