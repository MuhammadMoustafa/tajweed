import { describe, expect, it } from 'vitest'
import { getWord } from '../data/quran'
import { qalqalahBounce } from './QalqalahBounce'

// The five qalqalah letters in the clip's step order (single letters, not Quran text).
const LETTERS = ['ق', 'ط', 'ب', 'ج', 'د']

describe('qalqalah clip', () => {
  it('has a step per letter, each with a recited word and a pause after it', () => {
    expect(qalqalahBounce.steps).toHaveLength(LETTERS.length)
    for (const step of qalqalahBounce.steps) {
      expect(step.audio, 'every letter has a word').toBeDefined()
      expect(step.pauseAfter).toBe(true)
    }
  })

  it.each(LETTERS.map((letter, i) => [letter, i] as const))('the word of step %s contains that letter', (letter, i) => {
    const audio = qalqalahBounce.steps[i].audio
    expect(getWord(audio!.word)!.text).toContain(letter)
  })
})
