import type { Bilingual } from '../i18n/bilingual'
import type { Lesson } from './types'

/** A group of lessons taught together (the nine units of the learning path, in the order of Tuhfat al-Atfal). */
export type UnitId =
  | 'foundations'
  | 'makharij'
  | 'noon-sakinah'
  | 'ghunnah-meem'
  | 'lam-merging'
  | 'madd'
  | 'heavy-light'
  | 'stopping'
  | 'deeper'

export interface Unit {
  title: Bilingual
  /** The unit's number on the learning path (1-9), also its first lesson's order; its other lessons
   *  follow as N.1, N.2 … (makharij: 2, 2.1 … 2.5). */
  order: number
}

export const UNITS: Record<UnitId, Unit> = {
  foundations: { title: { ar: 'البداية: الأساسيات', en: 'Getting started: foundations' }, order: 1 },
  makharij: { title: { ar: 'مخارج الحروف', en: 'Makharij (where letters come from)' }, order: 2 },
  'noon-sakinah': { title: { ar: 'أحكام النون الساكنة والتنوين', en: 'Noon sakinah and tanween' }, order: 3 },
  'ghunnah-meem': { title: { ar: 'الغنة والميم الساكنة', en: 'Ghunnah and meem sakinah' }, order: 4 },
  'lam-merging': { title: { ar: 'اللام وإدغام الحروف', en: 'Lam and merging letters' }, order: 5 },
  madd: { title: { ar: 'المدود', en: 'Madd (lengthening)' }, order: 6 },
  'heavy-light': { title: { ar: 'التفخيم والترقيق والقلقلة', en: 'Heavy and light letters' }, order: 7 },
  stopping: { title: { ar: 'الوقف والابتداء', en: 'Stopping and starting' }, order: 8 },
  deeper: { title: { ar: 'التعمّق: صفات الحروف', en: 'Going deeper: sifat al-huruf' }, order: 9 },
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
