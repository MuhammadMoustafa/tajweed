import { describe, expect, it } from "vitest";
import { LESSONS } from ".";
import type { Lesson } from "./types";
import {
  groupByUnit,
  nextLesson,
  splitByLevel,
  UNITS,
  type UnitId,
} from "./units";

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
});

describe("groupByUnit", () => {
  it("gathers consecutive lessons of a unit under it and leaves the others on their own", () => {
    const [a, b, c, d] = [
      stub("a", 1),
      stub("b", 2, "makharij"),
      stub("c", 2.1, "makharij"),
      stub("d", 3),
    ];
    expect(groupByUnit([a, b, c, d])).toEqual([
      { lessons: [a] },
      { unit: "makharij", lessons: [b, c] },
      { lessons: [d] },
    ]);
  });

  it("keeps every lesson, in order", () => {
    expect(groupByUnit(LESSONS).flatMap((g) => g.lessons)).toEqual(LESSONS);
  });

  it("shows each unit once, as one run of lessons", () => {
    const units = groupByUnit(LESSONS).flatMap((g) => (g.unit ? [g.unit] : []));
    expect(new Set(units).size).toBe(units.length);
  });
});

describe("learning path", () => {
  it("puts every lesson in a unit, and every unit has lessons", () => {
    expect(
      LESSONS.filter((l) => l.unit === undefined).map((l) => l.id),
    ).toEqual([]);
    for (const id of Object.keys(UNITS))
      expect(LESSONS.some((l) => l.unit === id)).toBe(true);
  });

  it("gives every unit a level, core units before advanced ones", () => {
    const units = Object.values(UNITS).sort((a, b) => a.order - b.order);
    for (const u of units) expect(["core", "advanced"]).toContain(u.level);
    const levels = units.map((u) => u.level);
    expect(levels).toEqual(
      [...levels].sort((a, b) => (a === b ? 0 : a === "core" ? -1 : 1)),
    );
  });

  it("numbers units in increasing order, each lesson N, N.1, N.2 ... within its unit", () => {
    const orders = Object.values(UNITS).map((u) => u.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(new Set(orders).size).toBe(orders.length);
    for (const [id, unit] of Object.entries(UNITS)) {
      const orders = LESSONS.filter((l) => l.unit === id).map((l) => l.order);
      expect(orders).toEqual(
        orders.map((_, i) => Math.round((unit.order + i / 10) * 10) / 10),
      );
    }
  });
});

describe.each(Object.entries(UNITS))("unit %s", (id, unit) => {
  const lessons = LESSONS.filter((l) => l.unit === id);

  it("is titled in both languages", () => {
    expect(unit.title.ar.trim()).not.toBe("");
    expect(unit.title.en.trim()).not.toBe("");
  });

  // A unit may be declared before its lessons land (e.g. noon-sakinah while L4–L7 are written).
  it("starts at the unit's number, and its lessons are consecutive in the learning path", () => {
    if (lessons.length === 0) return;
    expect(Math.min(...lessons.map((l) => l.order))).toBe(unit.order);
    const positions = lessons.map((l) => LESSONS.indexOf(l));
    expect(positions).toEqual(positions.map((_, i) => positions[0] + i));
  });
});

describe("nextLesson", () => {
  const { core, advanced } = splitByLevel(LESSONS);

  it("stays in core while any core lesson is unlearned", () => {
    expect(nextLesson(LESSONS, () => false)?.id).toBe(core[0].id);
    const learned = new Set(
      [...core.slice(0, -1), ...advanced].map((l) => l.id),
    );
    expect(nextLesson(LESSONS, (id) => learned.has(id))?.id).toBe(
      core[core.length - 1].id,
    );
  });

  it("enters advanced once every core lesson is learned, then runs out", () => {
    const coreIds = new Set(core.map((l) => l.id));
    expect(nextLesson(LESSONS, (id) => coreIds.has(id))?.id).toBe(
      advanced[0].id,
    );
    expect(nextLesson(LESSONS, () => true)).toBeUndefined();
  });
});
