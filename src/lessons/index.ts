import { qalqalah } from './qalqalah'
import type { Lesson } from './types'

/** Register new lessons here; they are shown in `order`. */
export const LESSONS: Lesson[] = [qalqalah].sort((a, b) => a.order - b.order)

export const findLesson = (id: string): Lesson | undefined => LESSONS.find((l) => l.id === id)
