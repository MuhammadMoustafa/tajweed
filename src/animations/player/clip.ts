import type { ReactNode } from 'react'
import type { Bilingual } from '../../i18n/bilingual'

/**
 * One step of a clip: a frame shown for `duration` ms (at 1× speed) with an optional caption.
 *
 * `render(progress)` draws the frame, where `progress` runs from 0 at the step's start to 1 at its
 * end, so a frame can tween within its step (e.g. a bar growing) or ignore it and stay static.
 * With reduced motion the player always passes 1, so the step's end state must read on its own;
 * a paused player shows the frame at whatever progress it stopped on, so 0 should read too.
 * `render` is a plain function, not a component: it must not call hooks (return elements that do).
 */
export interface ClipStep {
  /** How long the step plays at 1× speed, in ms. */
  duration: number
  /** Shown under the frame while this step is current; Arabic-Indic digits belong in `ar`. */
  caption?: Bilingual
  render: (progress: number) => ReactNode
}

/**
 * An animation drawn in the app and played by AnimationPlayer: a timeline of steps the learner
 * can play, pause, step through and seek. Registered by id in src/animations/index.ts.
 */
export interface Clip {
  /** Accessible name of the player, e.g. "The five qalqalah letters". */
  title: Bilingual
  steps: readonly ClipStep[]
}

/** Total length of a clip at 1× speed, in ms. */
export const clipDuration = (clip: Clip): number => clip.steps.reduce((sum, step) => sum + step.duration, 0)

/** Start time of each step, in ms: `[0, d0, d0 + d1, …]`. */
export const stepStarts = (clip: Clip): number[] => {
  const starts: number[] = []
  let at = 0
  for (const step of clip.steps) {
    starts.push(at)
    at += step.duration
  }
  return starts
}

/** Index of the step playing at `time`, given `stepStarts`; the clip's end belongs to the last step. */
export function stepIndexAt(starts: readonly number[], time: number): number {
  let index = 0
  while (index < starts.length - 1 && time >= starts[index + 1]) index += 1
  return index
}
