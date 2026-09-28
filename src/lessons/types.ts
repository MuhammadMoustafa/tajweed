import type { Bilingual } from '../i18n/bilingual'
import type { Mark } from '../tajweed/marks'
import type { RuleId } from '../tajweed/rules'
import type { AnimationId } from '../animations/ids'

/** `surah:ayah`, e.g. `112:1`. Text is looked up in src/data/quran.json — never written inline. */
export type VerseKey = `${number}:${number}`

export interface LessonExample {
  verseKey: VerseKey
  note: Bilingual
  /** Hand-placed highlights for rules the API markup doesn't tag; see src/tajweed/marks.ts. */
  marks?: Mark[]
}

export interface LessonSection {
  heading?: Bilingual
  body: Bilingual
}

/**
 * "Tap the letters that have `rule` in `verseKey`." The correct answers are never listed here —
 * they are derived from `parseTajweed(getVerseMarkup(verseKey))`, so the verse text itself stays
 * out of lesson data (see src/lessons/quiz.ts).
 */
export interface QuizTapQuestion {
  kind: 'tap'
  prompt: Bilingual
  verseKey: VerseKey
  rule: TajweedRuleId
}

export interface QuizChoiceQuestion {
  kind: 'choice'
  prompt: Bilingual
  options: Bilingual[]
  /** Index into `options`. */
  correctIndex: number
  explanation?: Bilingual
}

export type QuizQuestion = QuizTapQuestion | QuizChoiceQuestion

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
  focusRules: RuleId[]
  examples: LessonExample[]
  /** Set true only after a qualified teacher has checked both languages. */
  reviewed: boolean
  /** Practice quiz shown after the examples. */
  quiz?: QuizQuestion[]
}
