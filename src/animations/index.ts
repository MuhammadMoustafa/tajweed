import type { AnimationId } from './ids'
import { makharijTour } from './MakharijTour'
import { naturalMadd } from './NaturalMadd'
import type { Clip } from './player/clip'
import { qalqalahBounce } from './QalqalahBounce'

/** Clips by id, played by AnimationPlayer (src/animations/player) for a lesson or one of its sections. */
export const ANIMATIONS: Record<AnimationId, Clip> = {
  'qalqalah-bounce': qalqalahBounce,
  'makharij-tour': makharijTour,
  'natural-madd': naturalMadd,
}
