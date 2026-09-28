import type { ComponentType } from 'react'
import type { AnimationId } from './ids'
import { MakharijTour } from './MakharijTour'
import { NaturalMadd } from './NaturalMadd'
import { QalqalahBounce } from './QalqalahBounce'

/** Animations take no props; the lesson view remounts them (via `key`) to replay. */
export const ANIMATIONS: Record<AnimationId, ComponentType> = {
  'qalqalah-bounce': QalqalahBounce,
  'makharij-tour': MakharijTour,
  'natural-madd': NaturalMadd,
}
