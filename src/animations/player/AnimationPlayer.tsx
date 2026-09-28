import { useReducedMotion } from 'motion/react'
import { useEffect, useReducer, type KeyboardEvent } from 'react'
import { dirOf } from '../../i18n/bilingual'
import { useLocale } from '../../i18n/LocaleProvider'
import { formatTemplate, ui } from '../../i18n/ui'
import type { Clip } from './clip'
import { frameClock, type PlayerClock } from './clock'
import { SPEEDS, currentStep, initialPlayerState, playerReducer, stepProgress } from './state'

export interface AnimationPlayerProps {
  clip: Clip
  /** Time source; tests inject a manual one. Defaults to animation frames. */
  clock?: PlayerClock
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

/**
 * Plays a clip like a video the learner controls: paused at step 1 until they press play, with
 * play/pause, replay, step back/forward, a seek bar marked at each step, 0.5×/1× speed and the
 * current step's caption. Space plays or pauses; the arrow keys step (reversed in RTL, where the
 * timeline runs right to left). With reduced motion every step shows its end state, untweened.
 */
export function AnimationPlayer({ clip, clock = frameClock }: AnimationPlayerProps) {
  const { locale, t, n } = useLocale()
  const reduce = useReducedMotion()
  const [state, dispatch] = useReducer(playerReducer, clip, initialPlayerState)
  const { playing, speed, time, total, starts } = state

  useEffect(() => {
    if (!playing) return
    return clock.start((elapsed) => dispatch({ type: 'tick', elapsed }))
  }, [playing, clock])

  const index = currentStep(state)
  const step = clip.steps[index]
  const stepLabel = formatTemplate(locale, ui.stepOf, { step: index + 1, total: clip.steps.length })
  const isRtl = dirOf(locale) === 'rtl'
  const atStart = time === 0 && !playing
  const hasLabels = clip.steps.some((s) => s.label)

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
      onKeyDown={onKeyDown}
      data-step={index}
      data-playing={playing}
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
      </p>

      {hasLabels && (
        <div className="player-labels">
          {clip.steps.map((clipStep, i) =>
            clipStep.label ? (
              <button
                key={i}
                type="button"
                className="player-label"
                data-current={i === index || undefined}
                aria-current={i === index ? 'step' : undefined}
                style={{
                  insetInlineStart: `${(starts[i] / total) * 100}%`,
                  inlineSize: `${(clipStep.duration / total) * 100}%`,
                }}
                onClick={() => dispatch({ type: 'seek', time: starts[i] })}
              >
                {t(clipStep.label)}
              </button>
            ) : null,
          )}
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
      </div>
    </div>
  )
}
