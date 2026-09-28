/** A source of numbers in [0, 1), like `Math.random`. Quiz code takes one so tests can seed it. */
export type Rng = () => number

/** A seeded generator (mulberry32): the same seed always yields the same sequence. */
export function createRng(seed: number): Rng {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A fresh seed for a new quiz attempt; the only place quiz code reads `Math.random`. */
export const randomSeed = (): number => Math.floor(Math.random() * 2 ** 32)

/** A shuffled copy of `items` (Fisher–Yates). */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** One item of a non-empty list. */
export const pick = <T>(items: readonly T[], rng: Rng): T => items[Math.floor(rng() * items.length)]
