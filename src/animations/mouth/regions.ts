import type { Bilingual } from '../../i18n/bilingual'

/**
 * Parts of the speech organs a lesson can point at. The five main areas of the makharij are
 * `jawf`, `halq`, `lisan`, `shafatan` and `khayshum`; `halq`, `lisan`, `shafatan` and `teeth` also
 * light up all of their parts.
 */
export type MakhrajRegion =
  | 'jawf'
  | 'halq'
  | 'halq-deepest'
  | 'halq-middle'
  | 'halq-closest'
  | 'lisan'
  | 'tongue-back'
  | 'tongue-middle'
  | 'tongue-sides'
  | 'tongue-tip'
  | 'palate'
  | 'teeth'
  | 'teeth-upper'
  | 'teeth-lower'
  | 'shafatan'
  | 'lip-upper'
  | 'lip-lower'
  | 'khayshum'

/** Short names, used for the diagram's labels and its accessible description. */
export const MAKHRAJ_REGION_NAMES: Record<MakhrajRegion, Bilingual> = {
  jawf: { ar: 'الجوف', en: 'Jawf' },
  halq: { ar: 'الحلق', en: 'Throat' },
  'halq-deepest': { ar: 'أقصى الحلق', en: 'Throat: deepest' },
  'halq-middle': { ar: 'وسط الحلق', en: 'Throat: middle' },
  'halq-closest': { ar: 'أدنى الحلق', en: 'Throat: nearest' },
  lisan: { ar: 'اللسان', en: 'Tongue' },
  'tongue-back': { ar: 'أقصى اللسان', en: 'Back of tongue' },
  'tongue-middle': { ar: 'وسط اللسان', en: 'Middle of tongue' },
  'tongue-sides': { ar: 'حافتا اللسان', en: 'Sides of tongue' },
  'tongue-tip': { ar: 'طرف اللسان', en: 'Tip of tongue' },
  palate: { ar: 'الحنك', en: 'Palate' },
  teeth: { ar: 'الأسنان', en: 'Teeth' },
  'teeth-upper': { ar: 'الأسنان العليا', en: 'Upper teeth' },
  'teeth-lower': { ar: 'الأسنان السفلى', en: 'Lower teeth' },
  shafatan: { ar: 'الشفتان', en: 'Lips' },
  'lip-upper': { ar: 'الشفة العليا', en: 'Upper lip' },
  'lip-lower': { ar: 'الشفة السفلى', en: 'Lower lip' },
  khayshum: { ar: 'الخيشوم', en: 'Nose' },
}
