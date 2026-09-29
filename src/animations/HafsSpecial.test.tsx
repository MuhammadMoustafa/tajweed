import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { getWord } from '../data/quran'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { EXPLAIN_MS, hafsImalah, hafsIsm, hafsIshmam, hafsSadSeen, hafsSakt, hafsTashil, LISTEN_MS } from './HafsSpecial'
import { labelSpans, type Clip } from './player/clip'
import { CLIP_WORDS } from './words'

afterEach(() => localStorage.clear())

const draw = (clip: Clip, index: number, progress = 1, locale: 'ar' | 'en' = 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  return render(<LocaleProvider>{clip.steps[index].render(progress)}</LocaleProvider>).container
}

const CLIPS = { hafsSakt, hafsImalah, hafsTashil, hafsIshmam, hafsSadSeen, hafsIsm }

describe('Hafs special words clips (src/animations/HafsSpecial.tsx)', () => {
  it.each(Object.entries(CLIPS))('%s labels every step in both languages', (_name, clip) => {
    for (const step of clip.steps) {
      expect(step.label?.ar.trim()).toBeTruthy()
      expect(step.label?.en.trim()).toBeTruthy()
      expect([EXPLAIN_MS, LISTEN_MS]).toContain(step.duration)
    }
  })

  it('sakt: the sign, a short gap with no breath, a longer stop, and the two merges it blocks', () => {
    expect(labelSpans(hafsSakt).map((s) => s.label.en)).toEqual(['The sign', 'Sakt', 'Not a stop', 'No merging'])
    expect(draw(hafsSakt, 0).querySelector('[data-glyph="special"]')).toHaveTextContent('ۜ')
    expect(draw(hafsSakt, 1).querySelector('[data-gap="sakt"]')).not.toBeNull()
    expect(draw(hafsSakt, 2).querySelector('[data-gap="waqf"]')).not.toBeNull()
    for (const i of [3, 4]) expect(draw(hafsSakt, i).querySelector('[data-arrow="blocked"]')).not.toBeNull()
    expect(draw(hafsSakt, 1, 1, 'ar')).toHaveTextContent('بلا نفَس')
  })

  it('imalah and tas-hil: the marker leans part of the way, from the start at progress 0', () => {
    expect(draw(hafsImalah, 0).querySelector('[data-glyph="special"]')).toHaveTextContent('۪')
    expect(draw(hafsImalah, 1, 0).querySelector('[data-lean]')).toHaveAttribute('data-lean', '0')
    expect(draw(hafsImalah, 1, 1).querySelector('[data-lean]')).toHaveAttribute('data-lean', '70')
    expect(draw(hafsTashil, 1, 1).querySelector('[data-lean]')).toHaveAttribute('data-lean', '50')
  })

  it('ishmam: the two noons merge, the lips round, and rawm shows the faint damma', () => {
    expect(draw(hafsIshmam, 0, 1).querySelector('[data-glyph="special"]')).toHaveAttribute('opacity', '1')
    expect(draw(hafsIshmam, 1, 1).querySelector('[data-lips="rounded"]')).not.toBeNull()
    expect(draw(hafsIshmam, 1, 0).querySelector('[data-lips="opening"]')).not.toBeNull()
    expect(draw(hafsIshmam, 2).querySelector('[data-glyph="rawm"]')).toHaveAttribute('opacity', '0.45')
  })

  it('sad or seen: seen above, seen below, no sign, then listens to a seen and a sad', () => {
    expect(draw(hafsSadSeen, 1).querySelector('[data-glyph="special"]')).toHaveTextContent('ۜ')
    expect(draw(hafsSadSeen, 2).querySelector('[data-glyph="special"]')).toHaveTextContent('ۣ')
    expect(draw(hafsSadSeen, 2).querySelectorAll('[data-glyph="read"]')).toHaveLength(2)
    expect(draw(hafsSadSeen, 3).querySelectorAll('[data-glyph="read"]')).toHaveLength(1)
    expect(hafsSadSeen.steps.map((s) => s.audio?.word).filter(Boolean)).toEqual([CLIP_WORDS.readSeen, CLIP_WORDS.readSad])
    expect(draw(hafsSadSeen, 4)).toHaveTextContent(getWord(CLIP_WORDS.readSeen)!.text)
  })

  it('starting at the word of 49:11: both hamzas dropped reading on, then the two ways to start', () => {
    expect(draw(hafsIsm, 0).querySelectorAll('[data-glyph="dropped"]')).toHaveLength(2)
    expect(draw(hafsIsm, 1).querySelector('[data-glyph="start"]')).not.toBeNull()
    expect(draw(hafsIsm, 2).querySelector('[data-glyph="start"]')).toBeNull()
    expect(draw(hafsIsm, 2).querySelectorAll('[data-glyph="dropped"]')).toHaveLength(1)
    expect(hafsIsm.steps.at(-1)?.audio?.word).toBe(CLIP_WORDS.ismJoined)
    expect(draw(hafsIsm, 3, 1, 'ar')).toHaveTextContent(getWord(CLIP_WORDS.ismJoined)!.text)
  })
})
