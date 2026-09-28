import type { Bilingual } from '../i18n/bilingual'
import type { Lesson } from './types'

/** A group of lessons taught together (e.g. the makharij intro and its five chapters). */
export type UnitId = 'makharij'

export interface Unit {
  title: Bilingual
  /** The unit's number on the learning path: its lessons' orders are this number or a fraction
   *  above it (2, 2.1 … 2.5), so the lessons around it keep theirs. */
  order: number
}

export const UNITS: Record<UnitId, Unit> = {
  makharij: { title: { ar: 'مخارج الحروف', en: 'Makharij (where letters come from)' }, order: 2 },
}

/** One entry of the home list: a lesson on its own, or a unit with its lessons (chapters). */
export type LessonGroup = { unit?: undefined; lessons: [Lesson] } | { unit: UnitId; lessons: Lesson[] }

/**
 * `lessons` (already in order) as the home list shows them: consecutive lessons of one unit are
 * gathered under it, every other lesson stands alone. Prev/next still walks the flat order.
 */
export function groupByUnit(lessons: readonly Lesson[]): LessonGroup[] {
  const groups: LessonGroup[] = []
  for (const lesson of lessons) {
    const last = groups[groups.length - 1]
    if (lesson.unit === undefined) groups.push({ lessons: [lesson] })
    else if (last?.unit === lesson.unit) last.lessons.push(lesson)
    else groups.push({ unit: lesson.unit, lessons: [lesson] })
  }
  return groups
}
