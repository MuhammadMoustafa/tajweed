import { useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useReducer, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { surahName, WORD_RECITATION } from '../../data/quran'
import { dirOf } from '../../i18n/bilingual'
import { useLocale } from '../../i18n/LocaleProvider'
import { formatTemplate, ui } from '../../i18n/ui'
import { clipAudioRef, clipAudioSpan, createHtmlAudioDriver, mediaFragmentUrl, type AudioDriver } from './audio'
import { labelSpans, type Clip } from './clip'
import { frameClock, type PlayerClock } from './clock'
import { SPEEDS, currentStep, initialPlayerState, playerReducer, stepProgress } from './state'

export interface AnimationPlayerProps {
  clip: Clip
  /** Time source; tests inject a manual one. Defaults to animation frames. */
  clock?: PlayerClock
  /** Plays the steps' audio (ClipStep.audio); tests inject a fake one. Defaults to an audio element. */
  audio?: AudioDriver
}

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="player-icon">
    <path d={d} fill="currentColor" />
  </svg>
)
// Icon paths from Material Icons (Apache License 2.0): play_arrow, pause, skip_previous,
// skip_next, replay.
const PLAY = 'M8 5v14l11-7z'
const PAUSE = 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'
const STEP_BACK = 'M6 6h2v12H6zm3.5 6l8.5 6V6z'
const STEP_FORWARD = 'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z'
const REPLAY = 'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z'
// volume_up, volume_off (Material Icons, Apache License 2.0).
const SOUND_ON =
  'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'
const SOUND_OFF =
  'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'

/**
 * Plays a clip like a video the learner controls: paused at step 1 until they press play, with
 * play/pause, replay, step back/forward, a seek bar marked at each step, 0.5×/1× speed and the
 * current step's caption. Space plays or pauses; the arrow keys step (reversed in RTL, where the
 * timeline runs right to left). With reduced motion every step shows its end state, untweened.
 * A step with audio (ClipStep.audio) plays it as the step starts playing and holds until it ends;
 * such a clip gets a mute toggle and, on those steps, a line naming the reciter and the word.
 */
export function AnimationPlayer({ clip, clock = frameClock, audio }: AnimationPlayerProps) {
  const { locale, t, n } = useLocale()
  const reduce = useReducedMotion()
  const [state, dispatch] = useReducer(playerReducer, clip, initialPlayerState)
  const { playing, speed, time, total, starts } = state
  const [driver] = useState(() => audio ?? createHtmlAudioDriver())
  const [muted, setMuted] = useState(false)
  const hasAudio = state.withAudio.includes(true)

  useEffect(() => {
    if (!playing) return
    return clock.start((elapsed) => dispatch({ type: 'tick', elapsed }))
  }, [playing, clock])

  // Plays the sounding step's audio; a new `run` restarts it. Muted (or with its data missing), the
  // audio counts as finished at once, so the step just runs its own duration.
  const audioRun = state.audio?.run
  const audioStep = state.audio?.step
  useEffect(() => {
    if (audioRun === undefined || audioStep === undefined) return
    const stepAudio = clip.steps[audioStep].audio
    const span = stepAudio && clipAudioSpan(stepAudio)
    const end = () => dispatch({ type: 'audioEnd', run: audioRun })
    if (muted || !span) {
      end()
      return
    }
    return driver.play(span, end)
  }, [audioRun, audioStep, muted, clip, driver])

  const index = currentStep(state)
  const step = clip.steps[index]
  const stepLabel = formatTemplate(locale, ui.stepOf, { step: index + 1, total: clip.steps.length })
  const isRtl = dirOf(locale) === 'rtl'
  const atStart = time === 0 && !playing
  const spans = useMemo(() => labelSpans(clip), [clip])
  const hasLabels = spans.length > 0
  const stepSpan = step.audio && clipAudioSpan(step.audio)
  // Where the step's word is, for the credit line: the surah by name, ayah and word by number.
  const stepRef = step.audio && clipAudioRef(step.audio)

  const onKeyDown = (event: KeyboardEvent) => {
    const onButton = event.target instanceof HTMLButtonElement
    if (event.key === ' ') {
      // A focused button already acts on Space.
      if (onButton) return
      event.preventDefault()
      dispatch({ type: 'toggle' })
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const forward = (event.key === 'ArrowRight') !== isRtl
      dispatch({ type: 'step', by: forward ? 1 : -1 })
    }
  }

  return (
    <div
      className="player"
      role="group"
      aria-label={t(clip.title)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (hasAudio) driver.unlock?.()
        onKeyDown(event)
      }}
      onClick={hasAudio ? () => driver.unlock?.() : undefined}
      data-step={index}
      data-playing={playing}
      data-audio-src={stepSpan && mediaFragmentUrl(stepSpan)}
    >
      <div className="player-stage">
        <div className="player-frame">{step.render(reduce ? 1 : stepProgress(clip, state))}</div>
        {atStart && (
          // A large target over the frame; the Play button below is the accessible control.
          <button
            type="button"
            className="player-big-play"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => dispatch({ type: 'play' })}
          >
            <Icon d={PLAY} />
          </button>
        )}
      </div>

      <p className="player-caption" aria-live="polite">
        <span className="player-step-count">{stepLabel}</span>
        {step.caption && <span className="player-caption-text">{t(step.caption)}</span>}
        {step.audio && (
          <span className="player-audio-credit">
            {t(ui.recitedBy)} {t(WORD_RECITATION.reciter)} · {stepRef && formatTemplate(locale, ui.wordRef, { ...stepRef, surah: t(surahName(stepRef.surah)), number: stepRef.surah })}
          </span>
        )}
      </p>

      {hasLabels && (
        <div className="player-labels">
          {spans.map((span) => {
            const current = index >= span.first && index <= span.last
            return (
              <button
                key={span.first}
                type="button"
                className="player-label"
                data-current={current || undefined}
                aria-current={current ? 'step' : undefined}
                // Custom properties, not inline position/size, so the narrow-screen CSS can give the
                // current label the full row instead of its (by then very narrow) segment.
                style={
                  {
                    '--label-start': `${(span.start / total) * 100}%`,
                    '--label-size': `${(span.duration / total) * 100}%`,
                  } as CSSProperties
                }
                onClick={() => dispatch({ type: 'seek', time: span.start })}
              >
                {t(span.label)}
              </button>
            )
          })}
        </div>
      )}

      <div className="player-seek">
        <input
          type="range"
          min={0}
          max={total}
          step={1}
          value={Math.round(time)}
          aria-label={t(ui.seek)}
          aria-valuetext={stepLabel}
          onChange={(event) => dispatch({ type: 'seek', time: Number(event.target.value) })}
        />
        <div className="player-markers" aria-hidden="true">
          {starts.slice(1).map((start) => (
            <span key={start} style={{ insetInlineStart: `${(start / total) * 100}%` }} />
          ))}
        </div>
      </div>

      <div className="player-controls">
        <button type="button" aria-label={t(ui.replay)} onClick={() => dispatch({ type: 'replay' })}>
          <Icon d={REPLAY} />
        </button>
        <button
          type="button"
          className="player-directional"
          aria-label={t(ui.stepBack)}
          onClick={() => dispatch({ type: 'step', by: -1 })}
        >
          <Icon d={STEP_BACK} />
        </button>
        <button
          type="button"
          className="player-play"
          aria-label={t(playing ? ui.pause : ui.play)}
          onClick={() => dispatch({ type: 'toggle' })}
        >
          <Icon d={playing ? PAUSE : PLAY} />
        </button>
        <button
          type="button"
          className="player-directional"
          aria-label={t(ui.stepForward)}
          onClick={() => dispatch({ type: 'step', by: 1 })}
        >
          <Icon d={STEP_FORWARD} />
        </button>
        <div className="player-speed" role="group" aria-label={t(ui.speed)}>
          {SPEEDS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={speed === option}
              onClick={() => dispatch({ type: 'speed', speed: option })}
            >
              {n(option)}×
            </button>
          ))}
        </div>
        {hasAudio && (
          <button
            type="button"
            className="player-mute"
            aria-label={t(ui.muteReciter)}
            aria-pressed={muted}
            onClick={() => setMuted((m) => !m)}
          >
            <Icon d={muted ? SOUND_OFF : SOUND_ON} />
          </button>
        )}
      </div>
    </div>
  )
}
