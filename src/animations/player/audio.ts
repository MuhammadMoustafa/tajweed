import { getWord, splitWordKey, type QuranWord } from '../../data/quran'
import type { ClipAudio } from './clip'

/** Part of an audio file to play: `url` from `start` to `end`, in ms. */
export type AudioSpan = QuranWord['audio']

/**
 * What AnimationPlayer plays step audio with. Tests inject a fake one so no real audio (or
 * network) is involved; the app uses `createHtmlAudioDriver()`.
 */
export interface AudioDriver {
  /**
   * Plays `span` and calls `onEnd` once when it has finished — or failed, or could not load, so a
   * clip never waits forever on audio. The returned function stops it early, without `onEnd`.
   * Starting a new span stops the previous one.
   */
  play: (span: AudioSpan, onEnd: () => void) => () => void
  /**
   * Called from a user gesture (a click or key press on the player), before any audio is due:
   * browsers that only let media start from a gesture (iOS Safari, Android WebView) then allow
   * this driver's later `play` calls, which run from the player's clock instead.
   */
  unlock?: () => void
}

/** The playable span for a step's audio, or undefined if its data is missing (see words.test.ts). */
export function clipAudioSpan(audio: ClipAudio): AudioSpan | undefined {
  return getWord(audio.word)?.audio
}

/** Where a step's audio comes from, for the player's credit line: the word's surah, ayah and position. */
export function clipAudioRef(audio: ClipAudio): { surah: number; ayah: number; word: number } {
  const { verseKey, position } = splitWordKey(audio.word)
  const [surah, ayah] = verseKey.split(':').map(Number)
  return { surah, ayah, word: position }
}

/** `span` as a Media Fragments URL (`…/001001.mp3#t=1.19,2.34`): the browser starts there. */
export const mediaFragmentUrl = ({ url, start, end }: AudioSpan): string => `${url}#t=${start / 1000},${end / 1000}`

/**
 * Longest wait (ms), beyond the span's own length, for a span to load and finish before giving up
 * (offline and not cached yet, or a stalled connection), so the clip carries on without it.
 */
export const AUDIO_GIVE_UP_MS = 10_000

/**
 * Plays spans on one reused audio element (created on first use), so a gesture that unlocked it
 * still counts for later spans. The browser starts at the span via its Media Fragment; the stop at
 * `end` is checked every animation frame (and on `timeupdate`, which still fires in a hidden tab),
 * since browsers only enforce a fragment's end about every 250 ms — long enough to hear the start
 * of the next word. `createElement` is injectable for tests.
 */
export function createHtmlAudioDriver(createElement: () => HTMLAudioElement = () => new Audio()): AudioDriver {
  let element: HTMLAudioElement | undefined
  let unlocked = false
  let stopCurrent: (() => void) | undefined
  const audioElement = () => (element ??= createElement())

  return {
    unlock() {
      if (unlocked) return
      unlocked = true
      // load() inside a gesture is what lifts the per-element gesture requirement (WebKit, Chromium).
      audioElement().load()
    },
    play(span, onEnd) {
      stopCurrent?.()
      const audio = audioElement()
      const endAt = span.end / 1000
      let done = false
      let frame = 0
      const reachedEnd = () => audio.currentTime >= endAt
      const finish = (notify: boolean) => {
        if (done) return
        done = true
        cancelAnimationFrame(frame)
        clearTimeout(giveUp)
        audio.removeEventListener('playing', watch)
        audio.removeEventListener('timeupdate', onTimeUpdate)
        audio.removeEventListener('ended', onStop)
        audio.removeEventListener('error', onStop)
        audio.pause()
        if (notify) onEnd()
      }
      function watch() {
        cancelAnimationFrame(frame)
        if (reachedEnd()) finish(true)
        else frame = requestAnimationFrame(watch)
      }
      const onTimeUpdate = () => {
        if (reachedEnd()) finish(true)
      }
      const onStop = () => finish(true)

      audio.addEventListener('playing', watch)
      audio.addEventListener('timeupdate', onTimeUpdate)
      audio.addEventListener('ended', onStop)
      audio.addEventListener('error', onStop)
      const giveUp = setTimeout(onStop, AUDIO_GIVE_UP_MS + span.end - span.start)
      audio.src = mediaFragmentUrl(span)
      audio.play().catch(onStop)
      stopCurrent = () => finish(false)
      return stopCurrent
    },
  }
}
