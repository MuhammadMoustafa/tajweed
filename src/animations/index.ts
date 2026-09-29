import type { AnimationId } from './ids'
import {
  makharijAreas,
  makharijHalq,
  makharijJawf,
  makharijKhayshum,
  makharijLisan,
  makharijShafatan,
} from './MakharijClips'
import { foundationsHarakat, foundationsSukunShadda, foundationsTanween } from './FoundationsClips'
import { lamAllah, lamQamariyyah, lamShamsiyyah } from './LamClips'
import { idghamGhunnah, idghamWoGhunnah } from './IdghamClips'
import { iqlabMeem } from './IqlabMeem'
import { ikhfaHidden } from './IkhfaClip'
import { heavyLight } from './HeavyLight'
import { ghunnah } from './Ghunnah'
import { raSakinah, raVowel, raWaqf } from './RaClips'
import { maddLazimBar, maddLazimCause } from './MaddLazim'
import { maddMunfasil, maddMuttasil } from './MaddObligatory'
import { izharClip } from './IzharClip'
import { hamzatWasl, hamzatWaslVowel, silentLetters } from './HamzatWasl'
import { naturalMadd } from './NaturalMadd'
import { maddArid, maddBadal, maddIwad, maddLeen, maddSilah } from './OtherMadd'
import type { Clip } from './player/clip'
import { qalqalahBounce } from './QalqalahBounce'

/** Clips by id, played by AnimationPlayer (src/animations/player) for a lesson or one of its sections. */
export const ANIMATIONS: Record<AnimationId, Clip> = {
  'qalqalah-bounce': qalqalahBounce,
  'ikhfa-hidden': ikhfaHidden,
  'makharij-areas': makharijAreas,
  'makharij-jawf': makharijJawf,
  'makharij-halq': makharijHalq,
  'makharij-lisan': makharijLisan,
  'makharij-shafatan': makharijShafatan,
  'makharij-khayshum': makharijKhayshum,
  'foundations-harakat': foundationsHarakat, 'foundations-sukun-shadda': foundationsSukunShadda, 'foundations-tanween': foundationsTanween,
  'idgham-ghunnah': idghamGhunnah, 'idgham-wo-ghunnah': idghamWoGhunnah,
  'heavy-light': heavyLight,
  'ra-vowel': raVowel, 'ra-sakinah': raSakinah, 'ra-waqf': raWaqf,
  'natural-madd': naturalMadd,
  ghunnah,
  'madd-muttasil': maddMuttasil,
  'madd-munfasil': maddMunfasil,
  'madd-lazim-bar': maddLazimBar,
  'madd-lazim-cause': maddLazimCause,
  'izhar-clip': izharClip,
  'iqlab-meem': iqlabMeem,
  'madd-arid': maddArid, 'madd-leen': maddLeen, 'madd-badal': maddBadal, 'madd-iwad': maddIwad, 'madd-silah': maddSilah,
  'lam-shamsiyyah': lamShamsiyyah, 'lam-qamariyyah': lamQamariyyah, 'lam-allah': lamAllah,
  'hamzat-wasl': hamzatWasl, 'hamzat-wasl-vowel': hamzatWaslVowel, 'silent-letters': silentLetters,
}
