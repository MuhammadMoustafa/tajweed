import type { Bilingual } from '../i18n/bilingual'
import type { Mark } from '../tajweed/marks'
import type { RuleId } from '../tajweed/rules'
import type { AnimationId } from '../animations/ids'
import type { MatnId } from '../mutoon/types'
import type { UnitId } from './units'

/** `surah:ayah`, e.g. `112:1`. Text is looked up in src/data/quran.json — never written inline. */
export type VerseKey = `${number}:${number}`

/**
 * `surah:ayah:word`, the word's 1-based position in the ayah, e.g. `1:1:3`. Its text and recited
 * audio are looked up in src/data/quran-words.json (see `getWord` in src/data/quran.ts).
 */
export type WordKey = `${number}:${number}:${number}`

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
  /** Lesson number on docs/roadmap.md (the learning path in CLAUDE.md, split into single-rule lessons).
   *  A unit's chapters take fractions of the unit's number (2, 2.1 … 2.5; see units.ts). */
  order: number
  /** The unit this lesson is a chapter of; the home list nests it under the unit's heading. */
  unit?: UnitId
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
  /** Both classical poems' coverage of this lesson's rule (src/data/mutoon.json), shown in a
   * collapsed panel after the examples as two always-present, clearly separated sections — Tuhfa
   * first, then Jazariyya, each with its own heading and meaning note(s). Line numbers are found
   * in the fetched data, never guessed; every line the poem gives the rule is cited (whole
   * passages, not a sample). A poem with no section on the rule gets `'not-covered'`, which still
   * renders its section (with a "doesn't cover this" line) instead of omitting the poem. When a
   * lesson has a matn panel at all, both `tuhfa` and `jazariyya` are required (lessons.test.ts
   * enforces this) so no lesson can drift to showing only one poem. */
  mutoon?: MatnRefs
}

/** One contiguous range of a poem's lines that states part of a lesson's rule, plus the plain
 * meaning of that passage. A poem's coverage of a rule may need more than one (e.g. qalqalah's
 * letters and, several lines later, how to sound them — see src/lessons/qalqalah.ts). */
export interface MatnPassage {
  from: number
  to?: number
  note: Bilingual
}

/** A poem's coverage of one lesson's rule: the passages that state it, or `'not-covered'` when
 * the poem has no section on it. */
export type MatnCoverage = MatnPassage[] | 'not-covered'

export type MatnRefs = Record<MatnId, MatnCoverage>
