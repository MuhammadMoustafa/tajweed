import { describe, expect, it } from 'vitest'
import { LESSONS } from '.'
import type { Lesson } from './types'
import { groupByUnit, UNITS, type UnitId } from './units'

const stub = (id: string, order: number, unit?: UnitId): Lesson => ({
  id,
  order,
  unit,
  title: { ar: id, en: id },
  summary: { ar: id, en: id },
  sections: [],
  focusRules: [],
  examples: [],
  reviewed: true,
})

describe('groupByUnit', () => {
  it('gathers consecutive lessons of a unit under it and leaves the others on their own', () => {
    const [a, b, c, d] = [stub('a', 1), stub('b', 2, 'makharij'), stub('c', 2.1, 'makharij'), stub('d', 3)]
    expect(groupByUnit([a, b, c, d])).toEqual([
      { lessons: [a] },
      { unit: 'makharij', lessons: [b, c] },
      { lessons: [d] },
    ])
  })

  it('keeps every lesson, in order', () => {
    expect(groupByUnit(LESSONS).flatMap((g) => g.lessons)).toEqual(LESSONS)
  })

  it('shows each unit once, as one run of lessons', () => {
    const units = groupByUnit(LESSONS).flatMap((g) => (g.unit ? [g.unit] : []))
    expect(new Set(units).size).toBe(units.length)
  })
})

describe('learning path', () => {
  it('puts every lesson in a unit, and every unit has lessons', () => {
    expect(LESSONS.filter((l) => l.unit === undefined).map((l) => l.id)).toEqual([])
    for (const id of Object.keys(UNITS)) expect(LESSONS.some((l) => l.unit === id)).toBe(true)
  })

  it('numbers units 1-9 in order, each lesson N, N.1, N.2 ... within its unit', () => {
    expect(Object.values(UNITS).map((u) => u.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    for (const [id, unit] of Object.entries(UNITS)) {
      const orders = LESSONS.filter((l) => l.unit === id).map((l) => l.order)
      expect(orders).toEqual(orders.map((_, i) => Math.round((unit.order + i / 10) * 10) / 10))
    }
  })
})

describe.each(Object.entries(UNITS))('unit %s', (id, unit) => {
  const lessons = LESSONS.filter((l) => l.unit === id)

  it('is titled in both languages', () => {
    expect(unit.title.ar.trim()).not.toBe('')
    expect(unit.title.en.trim()).not.toBe('')
  })

  // A unit may be declared before its lessons land (e.g. noon-sakinah while L4–L7 are written).
  it("starts at the unit's number, and its lessons are consecutive in the learning path", () => {
    if (lessons.length === 0) return
    expect(Math.min(...lessons.map((l) => l.order))).toBe(unit.order)
    const positions = lessons.map((l) => LESSONS.indexOf(l))
    expect(positions).toEqual(positions.map((_, i) => positions[0] + i))
  })
})
