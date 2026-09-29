import type { Bilingual } from '../../i18n/bilingual'

/**
 * Parts of the speech organs a lesson can point at. The five main areas of the makharij are
 * `jawf`, `halq`, `lisan`, `shafatan` and `khayshum`; `halq`, `lisan`, `shafatan` and `teeth` also
 * light up all of their parts. `gums` is the ridge behind the upper front teeth (ن ل ر), and
 * `molars-upper` the back teeth the side of the tongue presses on for ض.
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
  | 'gums'
  | 'teeth'
  | 'teeth-upper'
  | 'teeth-lower'
  | 'molars-upper'
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
  gums: { ar: 'اللثة', en: 'Gum ridge' },
  teeth: { ar: 'الأسنان', en: 'Teeth' },
  'teeth-upper': { ar: 'الأسنان العليا', en: 'Upper teeth' },
  'teeth-lower': { ar: 'الأسنان السفلى', en: 'Lower teeth' },
  'molars-upper': { ar: 'الأضراس العليا', en: 'Upper molars' },
  shafatan: { ar: 'الشفتان', en: 'Lips' },
  'lip-upper': { ar: 'الشفة العليا', en: 'Upper lip' },
  'lip-lower': { ar: 'الشفة السفلى', en: 'Lower lip' },
  khayshum: { ar: 'الخيشوم', en: 'Nose' },
}

/** MouthDiagram's label text position (y) and the point it points at, per region; left labels end at x=22. */
export const LABELS: Record<MakhrajRegion, { side: 'left' | 'right'; y: number; to: [number, number] }> = {
  gums: { side: 'left', y: 84, to: [70, 145] },
  khayshum: { side: 'left', y: 104, to: [62, 132] },
  teeth: { side: 'left', y: 128, to: [59, 156] },
  'teeth-upper': { side: 'left', y: 128, to: [59, 156] },
  'lip-upper': { side: 'left', y: 150, to: [44, 158] },
  shafatan: { side: 'left', y: 170, to: [42, 168] },
  'lip-lower': { side: 'left', y: 190, to: [44, 180] },
  'teeth-lower': { side: 'left', y: 210, to: [59, 180] },
  'tongue-tip': { side: 'left', y: 230, to: [70, 180] },
  lisan: { side: 'left', y: 250, to: [110, 190] },
  'tongue-sides': { side: 'left', y: 270, to: [118, 175] },
  jawf: { side: 'right', y: 96, to: [150, 153] },
  palate: { side: 'right', y: 116, to: [128, 144] },
  'tongue-back': { side: 'right', y: 136, to: [168, 176] },
  'tongue-middle': { side: 'right', y: 156, to: [120, 164] },
  'molars-upper': { side: 'right', y: 176, to: [110, 154] },
  'halq-closest': { side: 'right', y: 194, to: [201, 192] },
  halq: { side: 'right', y: 236, to: [214, 236] },
  'halq-middle': { side: 'right', y: 236, to: [201, 236] },
  'halq-deepest': { side: 'right', y: 284, to: [201, 282] },
}

/** Where a region is on the diagram, in the head coordinates an `overlay` draws in. */
export const regionPoint = (region: MakhrajRegion): readonly [number, number] => LABELS[region].to
