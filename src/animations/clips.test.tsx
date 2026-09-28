import { render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { getWord } from '../data/quran'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { ANIMATIONS } from '.'
import { CLIP_WORDS } from './words'
import { AnimationPlayer } from './player/AnimationPlayer'

afterEach(() => localStorage.clear())

describe.each(Object.entries(ANIMATIONS))('clip %s', (_id, clip) => {
  it('is titled and captioned in both languages, with timed steps', () => {
    expect(clip.title.ar.trim()).not.toBe('')
    expect(clip.title.en.trim()).not.toBe('')
    expect(clip.steps.length).toBeGreaterThan(0)
    for (const step of clip.steps) {
      expect(step.duration).toBeGreaterThan(0)
      if (step.caption) {
        expect(step.caption.ar.trim()).not.toBe('')
        expect(step.caption.en.trim()).not.toBe('')
      }
    }
  })

  it.each(['ar', 'en'] as const)('plays in %s, paused at step 1 with its caption', (locale) => {
    localStorage.setItem('tajweed.locale', locale)
    const { container } = render(
      <LocaleProvider>
        <AnimationPlayer clip={clip} />
      </LocaleProvider>,
    )
    const player = within(container).getByRole('group', { name: clip.title[locale] })
    expect(player).toHaveAttribute('data-step', '0')
    expect(player).toHaveAttribute('data-playing', 'false')
    const caption = clip.steps[0].caption
    if (caption) expect(player.querySelector('.player-caption-text')).toHaveTextContent(caption[locale])
  })

  // A word a step plays must be fetched (listed in words.ts, present in quran-words.json), and the
  // step must show that word's text while it plays.
  it('plays only fetched Quran words, showing the word it plays', () => {
    const listed: readonly string[] = Object.values(CLIP_WORDS)
    localStorage.setItem('tajweed.locale', 'en')
    for (const step of clip.steps) {
      if (!step.audio) continue
      expect(listed, `${step.audio.word}: add it to src/animations/words.ts`).toContain(step.audio.word)
      const word = getWord(step.audio.word)
      expect(word, `${step.audio.word}: run npm run fetch-quran`).toBeDefined()
      const { container, unmount } = render(<LocaleProvider>{step.render(1)}</LocaleProvider>)
      expect(container).toHaveTextContent(word!.text)
      unmount()
    }
  })

  it('draws every step at its start and its end', () => {
    localStorage.setItem('tajweed.locale', 'en')
    for (const step of clip.steps) {
      for (const progress of [0, 1]) {
        const { container, unmount } = render(<LocaleProvider>{step.render(progress)}</LocaleProvider>)
        expect(container.firstElementChild).not.toBeNull()
        unmount()
      }
    }
  })
})
