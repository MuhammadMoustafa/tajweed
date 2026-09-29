import { foundations } from './foundations'
import { heavyLight } from './heavy-light'
import { ghunnahLesson } from './ghunnah'
import { ra } from './ra'
import { maddLazim } from './madd-lazim'
import { izhar } from './izhar'
import { idgham } from './idgham'
import { iqlab } from './iqlab'
import { ikhfa } from './ikhfa'
import { hamzatWasl } from './hamzat-wasl'
import { idghamLetters } from './idgham-letters'
import { makharij } from './makharij'
import { makharijHalq } from './makharij-halq'
import { makharijJawf } from './makharij-jawf'
import { makharijKhayshum } from './makharij-khayshum'
import { makharijLisan } from './makharij-lisan'
import { makharijShafatan } from './makharij-shafatan'
import { meemSakinah } from './meem-sakinah'
import { muttasilMunfasil } from './muttasil-munfasil'
import { naturalMadd } from './natural-madd'
import { otherMadd } from './other-madd'
import { lamRules } from './lam-rules'
import { qalqalah } from './qalqalah'
import { waqf } from './waqf'
import { sifat } from './sifat'
import type { Lesson } from './types'

/** Register new lessons here; they are shown in `order`. */
export const LESSONS: Lesson[] = [foundations, makharij, makharijJawf, makharijHalq, makharijLisan, makharijShafatan, makharijKhayshum, qalqalah, naturalMadd, muttasilMunfasil, maddLazim, otherMadd, lamRules, izhar, idgham, iqlab, ikhfa, heavyLight, ghunnahLesson, ra, hamzatWasl, idghamLetters, waqf, sifat, meemSakinah].sort(
  (a, b) => a.order - b.order,
)

export const findLesson = (id: string): Lesson | undefined => LESSONS.find((l) => l.id === id)

/** The lesson immediately before/after `id` in `lessons` order (default LESSONS); undefined at either end. */
export function adjacentLessons(
  id: string,
  lessons: readonly Lesson[] = LESSONS,
): { prev?: Lesson; next?: Lesson } {
  const index = lessons.findIndex((l) => l.id === id)
  if (index === -1) return {}
  return { prev: lessons[index - 1], next: lessons[index + 1] }
}
