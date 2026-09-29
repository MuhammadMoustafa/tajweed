import type { ReactNode } from 'react'
import type { Bilingual } from '../../i18n/bilingual'
import type { WordKey } from '../../lessons/types'

/**
 * A sound a step plays as it starts playing (see ClipStep.audio). For now only a Quran word, by
 * `surah:ayah:word` key, recited by WORD_RECITATION (src/data/quran.ts) and cut from the ayah's
 * audio by quran.com's per-word timings; the word must be listed in src/animations/words.ts so
 * `npm run fetch-quran` fetches it. A union so other sources (e.g. a teacher's recording of an
 * isolated letter) can be added as new members; player/audio.ts resolves each to a playable span.
 */
export type ClipAudio = { word: WordKey }

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
  /**
   * Short name for the section this step belongs to (e.g. "أقصى الحلق / Deepest throat"), shown by
   * AnimationPlayer above the seek bar over the step's segment; clicking it seeks there. A clip
   * whose steps have no labels gets no label row. Not every step needs one distinct from its
   * neighbors' — repeat the same label across steps that share a section: consecutive steps with
   * the same label show as one label over their combined segment (see `labelSpans`).
   */
  label?: Bilingual
  render: (progress: number) => ReactNode
  /**
   * Played when the step starts playing (reached during playback, or play pressed on it) — never
   * while paused or merely seeked to. The player then moves on only once both `duration` and the
   * audio have finished, so keep `duration` about as long as the sound. The frame should show what
   * is heard (e.g. the word's text from src/data/quran-words.json). Muted by the player's toggle.
   */
  audio?: ClipAudio
  /**
   * Playback pauses when the step has finished (its duration and its audio both done), still
   * showing the step's end frame, caption and label; playing again (or the next-step button) goes
   * on to the next step and plays it. Stepping back replays the step just heard. Ignored on the
   * last step, which ends the clip as usual. For clips that teach one item per step and want the
   * learner to choose when to hear the next (e.g. the five qalqalah letters).
   */
  pauseAfter?: boolean
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

/** One label over the timeline: a run of consecutive steps sharing the same `label`. */
export interface LabelSpan {
  label: Bilingual
  /** Index of the run's first and last step. */
  first: number
  last: number
  /** When the run starts and how long it lasts, in ms at 1× speed. */
  start: number
  duration: number
}

const sameLabel = (a: Bilingual | undefined, b: Bilingual | undefined): boolean =>
  a !== undefined && b !== undefined && a.ar === b.ar && a.en === b.en

/**
 * The clip's timeline labels: consecutive steps with the same `label` (e.g. every count of one
 * "4 counts" pass) share one span over their combined segment instead of repeating the label per
 * step; unlabeled steps get none.
 */
export function labelSpans(clip: Clip): LabelSpan[] {
  const starts = stepStarts(clip)
  const spans: LabelSpan[] = []
  clip.steps.forEach((step, i) => {
    if (!step.label) return
    const previous = spans[spans.length - 1]
    if (previous && previous.last === i - 1 && sameLabel(previous.label, step.label)) {
      previous.last = i
      previous.duration += step.duration
    } else {
      spans.push({ label: step.label, first: i, last: i, start: starts[i], duration: step.duration })
    }
  })
  return spans
}

/** Index of the step playing at `time`, given `stepStarts`; the clip's end belongs to the last step. */
export function stepIndexAt(starts: readonly number[], time: number): number {
  let index = 0
  while (index < starts.length - 1 && time >= starts[index + 1]) index += 1
  return index
}
