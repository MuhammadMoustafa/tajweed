import { clipDuration, stepIndexAt, stepStarts, type Clip } from './clip'

/** Playback speeds offered to the learner; never faster than 1×. */
export const SPEEDS = [0.5, 1] as const
export type Speed = (typeof SPEEDS)[number]

/**
 * Step back within this much clip time (ms) after a step starts goes to the previous step;
 * later, it goes back to the start of the current step (as a music player's "previous" does).
 */
export const STEP_BACK_GRACE = 500

/**
 * While a step's audio is still sounding, playback holds this much clip time (ms) before the step's
 * end, so the step stays current (drawn at progress ≈ 1) until the audio ends.
 */
export const AUDIO_HOLD = 1

export interface PlayerState {
  /** Start time of each step (ms); fixed for the clip. */
  starts: readonly number[]
  /** Clip length at 1× (ms); fixed for the clip. */
  total: number
  /** Position in the clip, in ms of clip time (0 … total). */
  time: number
  playing: boolean
  speed: Speed
  /** Whether each step has audio (ClipStep.audio); fixed for the clip. */
  withAudio: readonly boolean[]
  /** Whether each step pauses playback when done (ClipStep.pauseAfter); fixed for the clip. */
  pauseAfter: readonly boolean[]
  /**
   * The step audio that should be sounding now: set when a step with audio starts playing, cleared
   * when it ends (`audioEnd`), on pause, and when playback moves to another step. While set,
   * playback holds at the end of that step instead of advancing. `run` is new each time audio
   * (re)starts, so AnimationPlayer restarts it and ignores a stale `audioEnd`.
   */
  audio?: { step: number; run: number }
  /** How many times step audio has started, for `audio.run`. */
  audioRuns: number
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
  /** The audio started as `run` has finished (or failed, or is muted). */
  | { type: 'audioEnd'; run: number }

/** A clip starts paused at its first step, at normal speed: clips never autoplay. */
export const initialPlayerState = (clip: Clip): PlayerState => ({
  starts: stepStarts(clip),
  total: clipDuration(clip),
  time: 0,
  playing: false,
  speed: 1,
  withAudio: clip.steps.map((step) => step.audio !== undefined),
  audioRuns: 0,
  pauseAfter: clip.steps.map((step) => step.pauseAfter === true),
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

/** Starts the current step's audio, if it has any and the clip is playing; otherwise none sounds. */
function startAudio(state: PlayerState): PlayerState {
  const step = currentStep(state)
  if (!state.playing || !state.withAudio[step]) return state.audio ? { ...state, audio: undefined } : state
  const run = state.audioRuns + 1
  return { ...state, audio: { step, run }, audioRuns: run }
}

/**
 * After a jump (seek, step) from `before`: a step starts playing — and gets its audio — when the
 * jump lands in another step or exactly on a step's start while playing. Elsewhere in the same
 * step, whatever audio is sounding carries on; paused, none sounds.
 */
function afterJump(before: PlayerState, after: PlayerState): PlayerState {
  if (!after.playing) return after.audio ? { ...after, audio: undefined } : after
  const step = currentStep(after)
  return step !== currentStep(before) || after.time === after.starts[step] ? startAudio(after) : after
}

/** Clip time up to which playback may run while `state.audio` sounds: just before its step ends. */
function audioHoldAt(state: PlayerState, step: number): number {
  const end = step < state.starts.length - 1 ? state.starts[step + 1] : state.total
  return end - AUDIO_HOLD
}

/** Whether the clip is paused at the end of a `pauseAfter` step (not the last), waiting to go on. */
function waitingAfterStep(state: PlayerState): boolean {
  const step = currentStep(state)
  return state.pauseAfter[step] && step < state.starts.length - 1 && state.time >= audioHoldAt(state, step)
}

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'play':
      // Playing an ended clip starts it over. Resuming a step with audio replays it from its start;
      // playing after a `pauseAfter` step goes on to the next step.
      if (waitingAfterStep(state)) {
        return startAudio({ ...state, time: state.starts[currentStep(state) + 1], playing: true })
      }
      return startAudio(isEnded(state) ? { ...state, time: 0, playing: true } : { ...state, playing: true })
    case 'pause':
      return { ...state, playing: false, audio: undefined }
    case 'toggle':
      return playerReducer(state, { type: state.playing ? 'pause' : 'play' })
    case 'replay':
      return startAudio({ ...state, time: 0, playing: true })
    case 'tick': {
      if (!state.playing) return state
      let time = state.time + action.elapsed * state.speed
      if (state.audio) time = Math.min(time, Math.max(state.time, audioHoldAt(state, state.audio.step)))
      // A `pauseAfter` step, once its audio is done too, stops playback at its end.
      const step = currentStep(state)
      const last = step === state.starts.length - 1
      if (state.pauseAfter[step] && !last && !state.audio && time >= audioHoldAt(state, step)) {
        return { ...state, time: Math.max(state.time, audioHoldAt(state, step)), playing: false }
      }
      const next = at(state, time)
      // Reaching the next step (or the end) during playback starts that step.
      return currentStep(next) !== currentStep(state) || !next.playing ? afterJump(state, next) : next
    }
    case 'seek':
      return afterJump(state, at(state, action.time))
    case 'step': {
      const index = currentStep(state)
      if (action.by === 1) {
        return afterJump(state, at(state, index < state.starts.length - 1 ? state.starts[index + 1] : state.total))
      }
      const intoStep = state.time - state.starts[index]
      return afterJump(
        state,
        at(state, intoStep > STEP_BACK_GRACE ? state.starts[index] : state.starts[Math.max(0, index - 1)]),
      )
    }
    case 'speed':
      return { ...state, speed: action.speed }
    case 'audioEnd':
      return state.audio?.run === action.run ? { ...state, audio: undefined } : state
  }
}
