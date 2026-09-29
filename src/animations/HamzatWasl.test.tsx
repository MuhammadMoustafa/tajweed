import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { getWord } from '../data/quran'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { EXPLAIN_MS, hamzatWasl, hamzatWaslVowel, LISTEN_MS, silentLetters } from './HamzatWasl'
import { labelSpans, type Clip } from './player/clip'
import { CLIP_WORDS } from './words'

afterEach(() => localStorage.clear())

const draw = (clip: Clip, index: number, locale: 'ar' | 'en' = 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  return render(<LocaleProvider>{clip.steps[index].render(1)}</LocaleProvider>).container
}

describe('hamzat-wasl clip (src/animations/HamzatWasl.tsx)', () => {
  it('starts with it, joins it, then listens to both cases', () => {
    expect(hamzatWasl.steps.map((s) => s.duration)).toEqual([EXPLAIN_MS, EXPLAIN_MS, LISTEN_MS, LISTEN_MS])
    expect(hamzatWasl.steps.map((s) => s.audio?.word)).toEqual([undefined, undefined, CLIP_WORDS.waslStart, CLIP_WORDS.waslJoined])
  })

  it('points at the alif: pronounced when starting, faded and struck out when joined', () => {
    const start = draw(hamzatWasl, 0)
    expect(start.querySelector('[data-wasla="pronounced"]')).not.toBeNull()
    expect(start.querySelector('[data-caret="wasla"]')).not.toBeNull()
    expect(start.querySelector('[data-strike]')).toBeNull()
    const joined = draw(hamzatWasl, 1)
    expect(joined.querySelector('[data-wasla="skipped"]')).toHaveAttribute('opacity', '0.4')
    expect(joined.querySelector('[data-strike]')).not.toBeNull()
  })

  it('shows the recited words from the fetched data', () => {
    expect(getWord(CLIP_WORDS.waslStart)?.text).toBeTruthy()
    expect(draw(hamzatWasl, 2)).toHaveTextContent(getWord(CLIP_WORDS.waslStart)!.text)
    expect(draw(hamzatWasl, 3, 'ar')).toHaveTextContent(getWord(CLIP_WORDS.waslJoined)!.text)
  })
})

describe('hamzat-wasl-vowel clip', () => {
  it('has one labeled step per case, in both languages', () => {
    expect(labelSpans(hamzatWaslVowel).map((s) => s.label.en)).toEqual([
      'With al-',
      'Verb: third letter has damma',
      'Verb: third letter has fatha or kasra',
      'A few listed nouns',
    ])
    labelSpans(hamzatWaslVowel).forEach((s) => expect(s.label.ar.trim()).not.toBe(''))
  })

  it('names the vowel read: fatha, damma, kasra, kasra', () => {
    const sounds = hamzatWaslVowel.steps.map((_, i) => draw(hamzatWaslVowel, i).querySelector('.hw-sound')?.textContent)
    expect(sounds).toEqual(['a  (fatha)', 'u  (damma)', 'i  (kasra)', 'i  (kasra)'])
  })
})

describe('silent-letters clip', () => {
  it('shows the alif written, then not read', () => {
    expect(draw(silentLetters, 0).querySelector('[data-silent="written"]')).not.toBeNull()
    const read = draw(silentLetters, 1)
    expect(read.querySelector('[data-silent="skipped"]')).not.toBeNull()
    expect(read.querySelector('[data-strike]')).not.toBeNull()
    expect(silentLetters.steps).toHaveLength(2)
  })
})
