import type { Bilingual } from '../i18n/bilingual'
import type { TajweedRuleId } from '../tajweed/rules'
import type { AnimationId } from '../animations/ids'

/** `surah:ayah`, e.g. `112:1`. Text is looked up in src/data/quran.json — never written inline. */
export type VerseKey = `${number}:${number}`

export interface LessonExample {
  verseKey: VerseKey
  note: Bilingual
}

export interface LessonSection {
  heading?: Bilingual
  body: Bilingual
}

export interface Lesson {
  /** URL slug: #/lesson/<id> */
  id: string
  /** Lesson number on docs/roadmap.md (the learning path in CLAUDE.md, split into single-rule lessons). */
  order: number
  title: Bilingual
  summary: Bilingual
  sections: LessonSection[]
  animation?: AnimationId
  /** Rules colored in this lesson's examples; everything else renders uncolored. */
  focusRules: TajweedRuleId[]
  examples: LessonExample[]
  /** Set true only after a qualified teacher has checked both languages. */
  reviewed: boolean
}
