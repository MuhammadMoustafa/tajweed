import { describe, expect, it } from 'vitest'
import { stepIndexAt, stepStarts, type Clip } from './clip'
import {
  STEP_BACK_GRACE,
  currentStep,
  initialPlayerState,
  isEnded,
  playerReducer,
  stepProgress,
  type PlayerAction,
  type PlayerState,
} from './state'

const step = (duration: number) => ({ duration, render: () => null })
const clip: Clip = { title: { ar: 'مقطع', en: 'Clip' }, steps: [step(1000), step(2000), step(1000)] }

const run = (...actions: PlayerAction[]): PlayerState =>
  actions.reduce(playerReducer, initialPlayerState(clip))

describe('clip timing', () => {
  it('lists step starts and finds the step at a time, the end belonging to the last step', () => {
    const starts = stepStarts(clip)
    expect(starts).toEqual([0, 1000, 3000])
    expect([0, 999, 1000, 2999, 3000, 4000].map((time) => stepIndexAt(starts, time))).toEqual([0, 0, 1, 1, 2, 2])
  })
})

describe('playerReducer', () => {
  it('starts paused at the first step at 1× (clips never autoplay)', () => {
    const state = initialPlayerState(clip)
    expect(state).toMatchObject({ time: 0, playing: false, speed: 1, total: 4000 })
    expect(currentStep(state)).toBe(0)
  })

  it('advances only while playing, scaled by speed', () => {
    expect(run({ type: 'tick', elapsed: 500 }).time).toBe(0)
    expect(run({ type: 'play' }, { type: 'tick', elapsed: 500 }).time).toBe(500)
    expect(run({ type: 'speed', speed: 0.5 }, { type: 'play' }, { type: 'tick', elapsed: 500 }).time).toBe(250)
  })

  it('pauses and resumes where it stopped', () => {
    const paused = run({ type: 'play' }, { type: 'tick', elapsed: 1500 }, { type: 'toggle' }, { type: 'tick', elapsed: 500 })
    expect(paused).toMatchObject({ time: 1500, playing: false })
    expect(currentStep(paused)).toBe(1)
    expect(stepProgress(clip, paused)).toBe(0.25)
    expect(playerReducer(paused, { type: 'toggle' })).toMatchObject({ time: 1500, playing: true })
  })

  it('stops at the end, and playing again starts over', () => {
    const ended = run({ type: 'play' }, { type: 'tick', elapsed: 5000 })
    expect(ended).toMatchObject({ time: 4000, playing: false })
    expect(isEnded(ended)).toBe(true)
    expect(currentStep(ended)).toBe(2)
    expect(stepProgress(clip, ended)).toBe(1)
    expect(playerReducer(ended, { type: 'play' })).toMatchObject({ time: 0, playing: true })
  })

  it('replays from the start at any point', () => {
    expect(run({ type: 'seek', time: 2500 }, { type: 'replay' })).toMatchObject({ time: 0, playing: true })
  })

  it('seeks within the clip, clamped, keeping play state until the end', () => {
    expect(run({ type: 'seek', time: 2500 })).toMatchObject({ time: 2500, playing: false })
    expect(run({ type: 'seek', time: -10 }).time).toBe(0)
    expect(run({ type: 'play' }, { type: 'seek', time: 2500 })).toMatchObject({ time: 2500, playing: true })
    expect(run({ type: 'play' }, { type: 'seek', time: 9999 })).toMatchObject({ time: 4000, playing: false })
  })

  it('steps forward to the next step start, and from the last step to the end', () => {
    expect(run({ type: 'step', by: 1 }).time).toBe(1000)
    expect(run({ type: 'seek', time: 1200 }, { type: 'step', by: 1 }).time).toBe(3000)
    expect(run({ type: 'seek', time: 3200 }, { type: 'step', by: 1 }).time).toBe(4000)
  })

  it('steps back to the current step start, or to the previous one right after a step starts', () => {
    expect(run({ type: 'seek', time: 1000 + STEP_BACK_GRACE + 1 }, { type: 'step', by: -1 }).time).toBe(1000)
    expect(run({ type: 'seek', time: 1000 + STEP_BACK_GRACE }, { type: 'step', by: -1 }).time).toBe(0)
    expect(run({ type: 'step', by: -1 }).time).toBe(0)
    expect(run({ type: 'seek', time: 4000 }, { type: 'step', by: -1 }).time).toBe(3000)
  })
})
