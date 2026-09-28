import { clipDuration, stepIndexAt, stepStarts, type Clip } from './clip'

/** Playback speeds offered to the learner; never faster than 1×. */
export const SPEEDS = [0.5, 1] as const
export type Speed = (typeof SPEEDS)[number]

/**
 * Step back within this much clip time (ms) after a step starts goes to the previous step;
 * later, it goes back to the start of the current step (as a music player's "previous" does).
 */
export const STEP_BACK_GRACE = 500

export interface PlayerState {
  /** Start time of each step (ms); fixed for the clip. */
  starts: readonly number[]
  /** Clip length at 1× (ms); fixed for the clip. */
  total: number
  /** Position in the clip, in ms of clip time (0 … total). */
  time: number
  playing: boolean
  speed: Speed
}

export type PlayerAction =
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'toggle' }
  | { type: 'replay' }
  /** Real time elapsed since the last tick (ms); scaled by `speed`. */
  | { type: 'tick'; elapsed: number }
  | { type: 'seek'; time: number }
  | { type: 'step'; by: 1 | -1 }
  | { type: 'speed'; speed: Speed }

/** A clip starts paused at its first step, at normal speed: clips never autoplay. */
export const initialPlayerState = (clip: Clip): PlayerState => ({
  starts: stepStarts(clip),
  total: clipDuration(clip),
  time: 0,
  playing: false,
  speed: 1,
})

export const isEnded = (state: PlayerState): boolean => state.time >= state.total

/** Index of the step at the current time (the end of the clip belongs to the last step). */
export const currentStep = (state: PlayerState): number => stepIndexAt(state.starts, state.time)

/** How far through the current step the clip is, 0–1 (a zero-length step counts as done). */
export function stepProgress(clip: Clip, state: PlayerState): number {
  const index = currentStep(state)
  const { duration } = clip.steps[index]
  return duration > 0 ? Math.min(1, Math.max(0, (state.time - state.starts[index]) / duration)) : 1
}

/** Moves to `time` (clamped); reaching the end stops playback. */
function at(state: PlayerState, time: number): PlayerState {
  const clamped = Math.min(state.total, Math.max(0, time))
  return { ...state, time: clamped, playing: state.playing && clamped < state.total }
}

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'play':
      // Playing an ended clip starts it over.
      return isEnded(state) ? { ...state, time: 0, playing: true } : { ...state, playing: true }
    case 'pause':
      return { ...state, playing: false }
    case 'toggle':
      return playerReducer(state, { type: state.playing ? 'pause' : 'play' })
    case 'replay':
      return { ...state, time: 0, playing: true }
    case 'tick':
      return state.playing ? at(state, state.time + action.elapsed * state.speed) : state
    case 'seek':
      return at(state, action.time)
    case 'step': {
      const index = currentStep(state)
      if (action.by === 1) {
        return at(state, index < state.starts.length - 1 ? state.starts[index + 1] : state.total)
      }
      const intoStep = state.time - state.starts[index]
      return at(state, intoStep > STEP_BACK_GRACE ? state.starts[index] : state.starts[Math.max(0, index - 1)])
    }
    case 'speed':
      return { ...state, speed: action.speed }
  }
}
