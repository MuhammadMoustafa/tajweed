import { describe, expect, it } from 'vitest'
import { createRng, pick, shuffle } from './random'

describe('createRng', () => {
  it('repeats the same sequence for the same seed, in [0, 1)', () => {
    const a = createRng(42)
    const b = createRng(42)
    const seqA = Array.from({ length: 20 }, a)
    expect(Array.from({ length: 20 }, b)).toEqual(seqA)
    expect(seqA.every((x) => x >= 0 && x < 1)).toBe(true)
  })

  it('differs between seeds', () => {
    expect(createRng(1)()).not.toBe(createRng(2)())
  })
})

describe('shuffle / pick', () => {
  it('returns a permutation without touching the input', () => {
    const items = [1, 2, 3, 4, 5, 6]
    const out = shuffle(items, createRng(7))
    expect([...out].sort()).toEqual(items)
    expect(items).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('picks an item of the list', () => {
    expect(['a', 'b', 'c']).toContain(pick(['a', 'b', 'c'], createRng(3)))
  })
})
