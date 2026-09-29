import { describe, expect, it } from 'vitest'
import { labelSpans, stepIndexAt, stepStarts, type Clip } from './clip'
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

  it('merges consecutive steps with the same label into one label span, skipping unlabeled steps', () => {
    const a = { ar: 'أ', en: 'A' }
    const b = { ar: 'ب', en: 'B' }
    const labeled: Clip = {
      title: clip.title,
      steps: [a, a, undefined, a, b, b].map((label) => ({ ...step(1000), label })),
    }
    expect(labelSpans(labeled)).toEqual([
      { label: a, first: 0, last: 1, start: 0, duration: 2000 },
      { label: a, first: 3, last: 3, start: 3000, duration: 1000 },
      { label: b, first: 4, last: 5, start: 4000, duration: 2000 },
    ])
    expect(labelSpans(clip)).toEqual([])
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

describe('playerReducer step audio', () => {
  const withAudio: Clip = {
    title: { ar: 'مقطع', en: 'Clip' },
    steps: [step(1000), { ...step(1000), audio: { word: '1:1:3' } }],
  }
  const from = (...actions: PlayerAction[]): PlayerState => actions.reduce(playerReducer, initialPlayerState(withAudio))

  it('starts a step’s audio only when that step starts playing', () => {
    expect(from({ type: 'step', by: 1 }).audio).toBeUndefined()
    expect(from({ type: 'play' }).audio).toBeUndefined()
    expect(from({ type: 'play' }, { type: 'tick', elapsed: 1000 }).audio).toEqual({ step: 1, run: 1 })
    expect(from({ type: 'step', by: 1 }, { type: 'play' }).audio).toEqual({ step: 1, run: 1 })
  })

  it('does not end a clip whose last step’s audio is still sounding, then ends once it has', () => {
    const holding = from({ type: 'play' }, ...Array.from({ length: 30 }, () => ({ type: 'tick' as const, elapsed: 100 })))
    expect(holding.playing).toBe(true)
    expect(isEnded(holding)).toBe(false)
    expect(currentStep(holding)).toBe(1)
    const ended = [{ type: 'audioEnd', run: 1 } as const, { type: 'tick', elapsed: 100 } as const].reduce(
      playerReducer,
      holding,
    )
    expect(isEnded(ended)).toBe(true)
    expect(ended.playing).toBe(false)
  })
})

describe('playerReducer pauseAfter', () => {
  const pausing: Clip = {
    title: { ar: 'مقطع', en: 'Clip' },
    steps: [{ ...step(1000), pauseAfter: true }, { ...step(1000), audio: { word: '1:1:3' }, pauseAfter: true }, step(1000)],
  }
  const from = (...actions: PlayerAction[]): PlayerState => actions.reduce(playerReducer, initialPlayerState(pausing))
  const tick = (elapsed: number) => ({ type: 'tick', elapsed }) as const

  it('pauses at the end of the step, still on it', () => {
    const state = from({ type: 'play' }, tick(600), tick(600))
    expect(state.playing).toBe(false)
    expect(currentStep(state)).toBe(0)
    expect(stepProgress(pausing, state)).toBeGreaterThan(0.99)
  })

  it('goes on to the next step, with its audio, when played again or stepped', () => {
    const paused = from({ type: 'play' }, tick(2000))
    const played = playerReducer(paused, { type: 'play' })
    expect(currentStep(played)).toBe(1)
    expect(played.playing).toBe(true)
    expect(played.audio).toEqual({ step: 1, run: 1 })
    const stepped = playerReducer(paused, { type: 'step', by: 1 })
    expect(currentStep(stepped)).toBe(1)
    expect(stepped.audio).toBeUndefined()
  })

  it('waits for the step’s audio before pausing', () => {
    const playing = from({ type: 'step', by: 1 }, { type: 'play' }, tick(5000))
    expect(playing.playing).toBe(true)
    expect(currentStep(playing)).toBe(1)
    const done = [{ type: 'audioEnd', run: 1 } as const, tick(10)].reduce(playerReducer, playing)
    expect(done.playing).toBe(false)
    expect(currentStep(done)).toBe(1)
  })

  it('steps back to replay the step just heard, paused', () => {
    const back = playerReducer(from({ type: 'play' }, tick(2000)), { type: 'step', by: -1 })
    expect(back.time).toBe(0)
    expect(back.playing).toBe(false)
  })

  it('does not pause the last step: the clip ends', () => {
    const state = from({ type: 'step', by: 1 }, { type: 'step', by: 1 }, { type: 'play' }, tick(1000))
    expect(isEnded(state)).toBe(true)
  })
})
