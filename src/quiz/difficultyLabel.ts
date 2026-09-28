import { ui } from '../i18n/ui'
import type { Difficulty } from './pool'

/** Bilingual label for each difficulty (src/quiz/pool.ts): the quiz page's selector and a recorded
 *  attempt's level on the progress page both read from here. */
export const DIFFICULTY_LABEL = {
  easy: ui.difficultyEasy,
  medium: ui.difficultyMedium,
  hard: ui.difficultyHard,
} as const satisfies Record<Difficulty, unknown>
