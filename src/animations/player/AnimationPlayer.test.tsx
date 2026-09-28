import { act, fireEvent, render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LocaleProvider } from '../../i18n/LocaleProvider'
import { AnimationPlayer } from './AnimationPlayer'
import type { Clip } from './clip'
import type { PlayerClock } from './clock'

const motion = vi.hoisted(() => ({ reduce: false }))
vi.mock('motion/react', () => ({ useReducedMotion: () => motion.reduce }))

const clip: Clip = {
  title: { ar: 'مقطع تجريبي', en: 'Test clip' },
  steps: [1000, 2000, 1000].map((duration, i) => ({
    duration,
    caption: { ar: `تعليق ${i + 1}`, en: `Caption ${i + 1}` },
    render: (progress: number) => <span data-testid="frame">{`${i}:${progress}`}</span>,
  })),
}

/** A clock the test advances by hand; no real timers run. */
function manualClock() {
  let onTick: ((elapsed: number) => void) | undefined
  const clock: PlayerClock = {
    start(tick) {
      onTick = tick
      return () => {
        onTick = undefined
      }
    },
  }
  return {
    clock,
    running: () => onTick !== undefined,
    advance: (ms: number) => act(() => onTick?.(ms)),
  }
}

const renderPlayer = (locale: 'ar' | 'en' = 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  const time = manualClock()
  const { container } = render(
    <LocaleProvider>
      <AnimationPlayer clip={clip} clock={time.clock} />
    </LocaleProvider>,
  )
  const screen = within(container)
  return { ...time, screen, player: screen.getByRole('group', { name: locale === 'ar' ? 'مقطع تجريبي' : 'Test clip' }) }
}

beforeEach(() => {
  motion.reduce = false
})

afterEach(() => localStorage.clear())

describe('AnimationPlayer', () => {
  it('starts paused at step 1 with its caption and a play button', () => {
    const { screen, player, running } = renderPlayer()
    expect(running()).toBe(false)
    expect(player).toHaveAttribute('data-playing', 'false')
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
    expect(screen.getByText('Caption 1')).toBeInTheDocument()
    expect(screen.getByTestId('frame')).toHaveTextContent('0:0')
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    expect(player.querySelector('.player-big-play')).not.toBeNull()
  })

  it('plays through steps on its clock, tweening the frame, and pauses', () => {
    const { screen, advance, running } = renderPlayer()
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    expect(running()).toBe(true)
    advance(1500)
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
    expect(screen.getByText('Caption 2')).toBeInTheDocument()
    expect(screen.getByTestId('frame')).toHaveTextContent('1:0.25')

    fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
    expect(running()).toBe(false)
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  })

  it('stops at the end, then replays from the start', () => {
    const { screen, player, advance, running } = renderPlayer()
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    advance(10_000)
    expect(running()).toBe(false)
    expect(screen.getByText('Step 3 of 3')).toBeInTheDocument()
    expect(screen.getByTestId('frame')).toHaveTextContent('2:1')

    fireEvent.click(screen.getByRole('button', { name: 'Replay animation' }))
    expect(player).toHaveAttribute('data-playing', 'true')
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
  })

  it('steps and seeks', () => {
    const { screen } = renderPlayer()
    fireEvent.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByText('Caption 2')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Previous step' }))
    expect(screen.getByText('Caption 1')).toBeInTheDocument()

    const seek = screen.getByRole('slider', { name: 'Animation position' })
    expect(seek).toHaveAttribute('max', '4000')
    fireEvent.change(seek, { target: { value: '3500' } })
    expect(seek).toHaveAttribute('aria-valuetext', 'Step 3 of 3')
    expect(screen.getByTestId('frame')).toHaveTextContent('2:0.5')
  })

  it('plays at half speed when chosen', () => {
    const { screen, advance } = renderPlayer()
    const half = screen.getByRole('button', { name: '0.5×' })
    expect(half).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: '1×' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(half)
    expect(half).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    advance(1500)
    expect(screen.getByTestId('frame')).toHaveTextContent('0:0.75')
  })

  it('plays or pauses on Space and steps with the arrow keys', () => {
    const { screen, player } = renderPlayer()
    fireEvent.keyDown(player, { key: ' ' })
    expect(player).toHaveAttribute('data-playing', 'true')
    fireEvent.keyDown(player, { key: ' ' })
    expect(player).toHaveAttribute('data-playing', 'false')
    fireEvent.keyDown(player, { key: 'ArrowRight' })
    expect(screen.getByText('Caption 2')).toBeInTheDocument()
    fireEvent.keyDown(player, { key: 'ArrowLeft' })
    expect(screen.getByText('Caption 1')).toBeInTheDocument()
  })

  it('in Arabic, reverses the arrow keys and shows Arabic-Indic digits', () => {
    const { screen, player } = renderPlayer('ar')
    expect(screen.getByText('الخطوة ١ من ٣')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '٠٫٥×' })).toBeInTheDocument()
    fireEvent.keyDown(player, { key: 'ArrowLeft' })
    expect(screen.getByText('الخطوة ٢ من ٣')).toBeInTheDocument()
    expect(screen.getByText('تعليق 2')).toBeInTheDocument()
    fireEvent.keyDown(player, { key: 'ArrowRight' })
    expect(screen.getByText('الخطوة ١ من ٣')).toBeInTheDocument()
  })

  it('shows each step at its end state with reduced motion, controls still working', () => {
    motion.reduce = true
    const { screen, advance } = renderPlayer()
    expect(screen.getByTestId('frame')).toHaveTextContent('0:1')
    fireEvent.click(screen.getByRole('button', { name: 'Play' }))
    advance(1200)
    expect(screen.getByTestId('frame')).toHaveTextContent('1:1')
    fireEvent.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByTestId('frame')).toHaveTextContent('2:1')
  })
})
