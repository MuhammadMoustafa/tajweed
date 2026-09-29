import type { Bilingual } from "../i18n/bilingual";
import type { Lesson } from "./types";

/** A group of lessons taught together (the units of the learning path, in the order of Tuhfat al-Atfal). */
export type UnitId =
  | "foundations"
  | "makharij"
  | "noon-sakinah"
  | "ghunnah-meem"
  | "lam-merging"
  | "madd"
  | "heavy-light"
  | "stopping"
  | "practice"
  | "deeper";

/** `core` units are the course proper; `advanced` ones are extra depth, shown after it on the home page. */
export type UnitLevel = "core" | "advanced";

export interface Unit {
  level: UnitLevel;
  title: Bilingual;
  /** The unit's number on the learning path (1, 2 …), also its first lesson's order; its other lessons
   *  follow as N.1, N.2 … (makharij: 2, 2.1 … 2.5). */
  order: number;
}

export const UNITS: Record<UnitId, Unit> = {
  foundations: {
    level: "core",
    title: { ar: "البداية: الأساسيات", en: "Getting started: foundations" },
    order: 1,
  },
  makharij: {
    level: "core",
    title: { ar: "مخارج الحروف", en: "Makharij (where letters come from)" },
    order: 2,
  },
  "noon-sakinah": {
    level: "core",
    title: {
      ar: "أحكام النون الساكنة والتنوين",
      en: "Noon sakinah and tanween",
    },
    order: 3,
  },
  "ghunnah-meem": {
    level: "core",
    title: { ar: "الغنة والميم الساكنة", en: "Ghunnah and meem sakinah" },
    order: 4,
  },
  "lam-merging": {
    level: "core",
    title: { ar: "اللام وإدغام الحروف", en: "Lam and merging letters" },
    order: 5,
  },
  madd: {
    level: "core",
    title: { ar: "المدود", en: "Madd (lengthening)" },
    order: 6,
  },
  "heavy-light": {
    level: "core",
    title: { ar: "التفخيم والترقيق والقلقلة", en: "Heavy and light letters" },
    order: 7,
  },
  stopping: {
    level: "core",
    title: { ar: "الوقف والابتداء", en: "Stopping and starting" },
    order: 8,
  },
  practice: {
    level: "core",
    title: { ar: 'التطبيق والمراجعة', en: 'Practice & review' },
    order: 9,
  },
  deeper: {
    level: "advanced",
    title: { ar: "التعمّق: صفات الحروف", en: "Going deeper: sifat al-huruf" },
    order: 10,
  },
};

/** One entry of the home list: a lesson on its own, or a unit with its lessons (chapters). */
export type LessonGroup =
  { unit?: undefined; lessons: [Lesson] } | { unit: UnitId; lessons: Lesson[] };

/**
 * `lessons` (already in order) as the home list shows them: consecutive lessons of one unit are
 * gathered under it, every other lesson stands alone. Prev/next still walks the flat order.
 */
export function groupByUnit(lessons: readonly Lesson[]): LessonGroup[] {
  const groups: LessonGroup[] = [];
  for (const lesson of lessons) {
    const last = groups[groups.length - 1];
    if (lesson.unit === undefined) groups.push({ lessons: [lesson] });
    else if (last?.unit === lesson.unit) last.lessons.push(lesson);
    else groups.push({ unit: lesson.unit, lessons: [lesson] });
  }
  return groups;
}

/** Whether a lesson belongs to an advanced unit (a lesson outside any unit is core). */
export function isAdvanced(lesson: Lesson): boolean {
  return lesson.unit !== undefined && UNITS[lesson.unit].level === "advanced";
}

/** `lessons` split into the core course and the advanced section, each keeping its order. */
export function splitByLevel(lessons: readonly Lesson[]): {
  core: Lesson[];
  advanced: Lesson[];
} {
  return {
    core: lessons.filter((l) => !isAdvanced(l)),
    advanced: lessons.filter(isAdvanced),
  };
}

/** The lesson to take next: the first not-learned core lesson, and only when all core lessons are
 *  learned the first not-learned advanced one. */
export function nextLesson(
  lessons: readonly Lesson[],
  isLearned: (id: string) => boolean,
): Lesson | undefined {
  const { core, advanced } = splitByLevel(lessons);
  return (
    core.find((l) => !isLearned(l.id)) ?? advanced.find((l) => !isLearned(l.id))
  );
}
