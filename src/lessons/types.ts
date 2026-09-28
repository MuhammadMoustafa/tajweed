import type { Bilingual } from '../i18n/bilingual'
import type { Mark } from '../tajweed/marks'
import type { RuleId } from '../tajweed/rules'
import type { AnimationId } from '../animations/ids'
import type { MatnId } from '../mutoon/types'

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
  /** A clip played under this section, e.g. one makharij area per section. */
  animation?: AnimationId
}

/**
 * "Tap the letters that have `rule` in `verseKey`." The correct answers are never listed here —
 * they are derived from `parseTajweed(getVerseMarkup(verseKey))` (plus `marks`, when given), so
 * the verse text itself stays out of lesson data (see src/lessons/quiz.ts).
 */
export interface QuizTapQuestion {
  kind: 'tap'
  prompt: Bilingual
  verseKey: VerseKey
  /** Any rule id — an API class or a custom one. A custom rule needs `marks` to place it. */
  rule: RuleId
  /** Hand-placed highlights needed to answer a custom-rule question; see src/tajweed/marks.ts. */
  marks?: Mark[]
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
  /** The lesson's main clip, shown beside the text (first on phones); sections can add their own. */
  animation?: AnimationId
  /** Rules colored in this lesson's examples; everything else renders uncolored. */
  focusRules: RuleId[]
  examples: LessonExample[]
  /** Set true only after a qualified teacher has checked both languages. */
  reviewed: boolean
  /** Authored questions for the lesson's quiz page (#/lesson/<id>/quiz), drawn alongside questions
   *  generated from the examples and the whole-Quran pool (src/quiz/draw.ts). */
  quiz?: QuizQuestion[]
  /** Lines from a classical poem (src/data/mutoon.json) that state this lesson's rule, shown in a
   * collapsed panel after the examples. Line numbers are found in the fetched data, never guessed. */
  mutoon?: { text: MatnId; from: number; to?: number; note: Bilingual }[]
}
