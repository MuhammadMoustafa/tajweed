import { render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { ANIMATIONS } from '.'
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
