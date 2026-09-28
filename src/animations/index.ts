import type { AnimationId } from './ids'
import {
  makharijHalq,
  makharijJawf,
  makharijKhayshum,
  makharijLisan,
  makharijShafatan,
} from './MakharijClips'
import { maddLazimBar, maddLazimCause } from './MaddLazim'
import { maddMunfasil, maddMuttasil } from './MaddObligatory'
import { naturalMadd } from './NaturalMadd'
import { maddArid, maddBadal, maddIwad, maddLeen, maddSilah } from './OtherMadd'
import type { Clip } from './player/clip'
import { qalqalahBounce } from './QalqalahBounce'

/** Clips by id, played by AnimationPlayer (src/animations/player) for a lesson or one of its sections. */
export const ANIMATIONS: Record<AnimationId, Clip> = {
  'qalqalah-bounce': qalqalahBounce,
  'makharij-jawf': makharijJawf,
  'makharij-halq': makharijHalq,
  'makharij-lisan': makharijLisan,
  'makharij-shafatan': makharijShafatan,
  'makharij-khayshum': makharijKhayshum,
  'natural-madd': naturalMadd,
  'madd-muttasil': maddMuttasil,
  'madd-munfasil': maddMunfasil,
  'madd-lazim-bar': maddLazimBar,
  'madd-lazim-cause': maddLazimCause,
  'madd-arid': maddArid, 'madd-leen': maddLeen, 'madd-badal': maddBadal, 'madd-iwad': maddIwad, 'madd-silah': maddSilah,
}
