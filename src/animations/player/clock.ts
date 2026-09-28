/**
 * The player's time source. `start` calls `onTick(elapsedMs)` with the real time since the
 * previous tick until the returned stop function is called. Tests inject a manual clock so no
 * real timers run; the app uses `frameClock`.
 */
export interface PlayerClock {
  start: (onTick: (elapsed: number) => void) => () => void
}

/**
 * Longest single tick (ms). After the tab was hidden or the device slept, the next frame arrives
 * much later; capping it keeps the clip from jumping ahead past steps the learner never saw.
 */
const MAX_TICK = 100

/** Ticks once per animation frame (requestAnimationFrame). */
export const frameClock: PlayerClock = {
  start(onTick) {
    let last: number | undefined
    let frame = requestAnimationFrame(function loop(now) {
      if (last !== undefined) onTick(Math.min(MAX_TICK, now - last))
      last = now
      frame = requestAnimationFrame(loop)
    })
    return () => cancelAnimationFrame(frame)
  },
}
