import type { ComponentType } from 'react'
import type { AnimationId } from './ids'
import { QalqalahBounce } from './QalqalahBounce'

/** Animations take no props; the lesson view remounts them (via `key`) to replay. */
export const ANIMATIONS: Record<AnimationId, ComponentType> = {
  'qalqalah-bounce': QalqalahBounce,
}
