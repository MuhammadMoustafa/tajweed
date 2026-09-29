import { foundations } from './foundations'
import { foundationsBasmala } from './foundations-basmala'
import { foundationsHarakat } from './foundations-harakat'
import { foundationsShaddahTanween } from './foundations-shaddah-tanween'
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
import { maddWhenStopping } from './other-madd'
import { maddBadalSilah } from './badal-silah'
import { lamRules } from './lam-rules'
import { qalqalah } from './qalqalah'
import { waqf } from './waqf'
import { sifat } from './sifat'
import { practiceFatiha } from './practice-fatiha'
import { practiceIkhlasFalaq } from './practice-ikhlas-falaq'
import { practiceNas } from './practice-nas'
import { practiceAsrKawthar } from './practice-asr-kawthar'
import { tafkhimLevels } from './finer-tafkhim'
import { ghunnahLevels } from './finer-ghunnah'
import { idghamNaqis } from './finer-idgham'
import { saktat } from './saktat'
import { imalahTashilIshmam } from './imalah-tashil-ishmam'
import { sadSeen } from './sad-seen'
import { hafsTwoWays } from './hafs-two-ways'
import type { Lesson } from './types'

/** Register new lessons here; they are shown in `order`. */
export const LESSONS: Lesson[] = [foundations, foundationsBasmala, foundationsHarakat, foundationsShaddahTanween, heavyLight, ghunnahLesson, ra, maddLazim, izhar, idgham, iqlab, ikhfa, hamzatWasl, idghamLetters, makharij, makharijHalq, makharijJawf, makharijKhayshum, makharijLisan, makharijShafatan, meemSakinah, muttasilMunfasil, naturalMadd, maddWhenStopping, maddBadalSilah, lamRules, qalqalah, waqf, sifat, practiceFatiha, practiceIkhlasFalaq, practiceNas, practiceAsrKawthar, tafkhimLevels, ghunnahLevels, idghamNaqis, saktat, imalahTashilIshmam, sadSeen, hafsTwoWays].sort(
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
