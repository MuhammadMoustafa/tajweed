import { useId } from 'react'
import { joinBilingual, type Bilingual } from '../../i18n/bilingual'
import { useLocale } from '../../i18n/LocaleProvider'
import { MAKHRAJ_REGION_NAMES, type MakhrajRegion } from './regions'

export type { MakhrajRegion } from './regions'

const PARENT: Partial<Record<MakhrajRegion, MakhrajRegion>> = {
  'halq-deepest': 'halq',
  'halq-middle': 'halq',
  'halq-closest': 'halq',
  'teeth-upper': 'teeth',
  'teeth-lower': 'teeth',
  'molars-upper': 'teeth',
  'lip-upper': 'shafatan',
  'lip-lower': 'shafatan',
}

const TITLE: Bilingual = {
  ar: 'رسم جانبي للفم والحلق والأنف',
  en: 'Side view of the mouth, throat and nose',
}
const HIGHLIGHTED: Bilingual = { ar: 'المواضع المضيئة: ', en: 'Highlighted: ' }

/*
 * Geometry, in the head's own coordinates (the face looks left, the throat is on the right; the
 * group is shifted right to leave room for labels on both sides).
 */
const OFFSET_X = 104
const VIEW_W = 474
const VIEW_Y = 10
const VIEW_H = 310

const HEAD =
  'M150 18 C98 18 62 46 58 88 L52 108 L30 136 L46 144 L50 150 C60 190 62 214 78 222 ' +
  'C104 230 132 230 150 236 L156 320 L262 320 L256 244 C292 206 304 132 284 82 C266 40 214 18 150 18 Z'
const NASAL = 'M40 139 C56 118 140 108 196 116 L214 128 L214 141 L188 141 C150 136 96 138 46 146 Z'
const JAWF =
  'M62 160 C92 148 128 146 156 150 C174 153 184 148 188 141 L214 141 L214 306 L188 306 L188 226 ' +
  'C150 222 100 204 62 184 Z'
const THROAT = { x: 188, y: 141, w: 26, h: 165 }
const THROAT_PARTS: [MakhrajRegion, number, number][] = [
  ['halq-closest', 170, 214],
  ['halq-middle', 214, 258],
  ['halq-deepest', 258, 306],
]
const TONGUE = {
  rest:
    'M64 176 C70 166 90 160 115 158 C140 156 164 160 176 174 C186 188 186 206 182 222 ' +
    'L150 224 C120 216 90 202 70 192 C62 188 60 182 64 176 Z',
  'raised-back':
    'M64 176 C70 166 90 160 115 158 C136 156 150 148 166 150 C182 154 188 176 184 222 ' +
    'L150 224 C120 216 90 202 70 192 C62 188 60 182 64 176 Z',
}
const TONGUE_PARTS: [MakhrajRegion, number, number][] = [
  ['tongue-tip', 55, 90],
  ['tongue-middle', 96, 142],
  ['tongue-back', 148, 190],
]
const TONGUE_SIDES = 'M82 182 C102 174 130 172 152 178'
const PALATE = 'M64 152 C90 144 120 141 142 144 C160 147 172 154 178 168'
/** The gum ridge just behind the upper front teeth, where the palate starts. */
const GUMS = 'M60 148 C63 141 74 139 83 144 C77 148 70 150 64 155 Z'
/** Upper molars, along the side of the palate (drawn dashed: they sit beside the cut, not on it). */
const MOLARS_UPPER = 'M88 149 h9 v6 q-4.5 3 -9 0 Z M100 148 h9 v6 q-4.5 3 -9 0 Z M112 147 h9 v6 q-4.5 3 -9 0 Z'
const TEETH_UPPER = 'M54 147 L66 148 L65 165 Q60 169 55 165 Z'
const TEETH_LOWER = 'M55 190 L65 189 L65 172 Q60 168 55 172 Z'
const LIP_UPPER = 'M50 145 C33 149 30 164 41 168 L57 166 L57 148 Z'
const LIP_LOWER = 'M41 170 C30 175 33 192 50 195 L57 192 L57 171 Z'

/** Label text position (y) and the point it points at, per region; left labels end at x=22. */
const LABELS: Record<MakhrajRegion, { side: 'left' | 'right'; y: number; to: [number, number] }> = {
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
const LEFT_X = 22
const RIGHT_X = 226

export interface MouthDiagramProps {
  /** Regions to light up (a whole area, e.g. `halq`, lights all of its parts). */
  highlight?: readonly MakhrajRegion[]
  /** Regions to name with a label and a pointer line. */
  labels?: readonly MakhrajRegion[]
  /** `raised-back` lifts the back of the tongue toward the soft palate (heavy letters). */
  tongue?: keyof typeof TONGUE
  className?: string
}

/**
 * A friendly side view (sagittal section) of the head showing where letters are articulated.
 * Shapes are deliberately simple; colors come from the `--anat-*` tokens in src/styles.css.
 */
export function MouthDiagram({ highlight = [], labels = [], tongue = 'rest', className }: MouthDiagramProps) {
  const { t } = useLocale()
  const id = useId().replace(/[^\w-]/g, '')
  const lit = (region: MakhrajRegion) => {
    const parent = PARENT[region]
    return highlight.includes(region) || (parent !== undefined && highlight.includes(parent))
  }
  const state = (region: MakhrajRegion) => ({ 'data-region': region, 'data-lit': lit(region) })
  const tonguePath = TONGUE[tongue]

  return (
    <svg
      viewBox={`0 ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
      className={['mouth-diagram', className].filter(Boolean).join(' ')}
      direction="ltr"
    >
      <title id={`${id}-title`}>{t(TITLE)}</title>
      <desc id={`${id}-desc`}>
        {highlight.length > 0 &&
          t(HIGHLIGHTED) + t(joinBilingual(highlight.map((r) => MAKHRAJ_REGION_NAMES[r])))}
      </desc>
      <defs>
        <clipPath id={`${id}-throat`}>
          <rect x={THROAT.x} y={THROAT.y} width={THROAT.w} height={THROAT.h} rx={10} />
        </clipPath>
        <clipPath id={`${id}-tongue`}>
          <path d={tonguePath} />
        </clipPath>
      </defs>

      <g transform={`translate(${OFFSET_X} 0)`} aria-hidden="true">
        <path d={HEAD} className="anat-skin" />
        <path d="M78 64 Q92 56 106 62" className="anat-line" />
        <circle cx={92} cy={80} r={5} className="anat-eye" />
        <path d="M244 96 C262 92 268 124 250 132" className="anat-line" />

        <path d={NASAL} className="anat-nasal" {...state('khayshum')} />
        <path d={JAWF} className="anat-cavity" {...state('jawf')} />
        <g clipPath={`url(#${id}-throat)`}>
          {THROAT_PARTS.map(([region, y0, y1]) => (
            <rect
              key={region}
              x={THROAT.x}
              y={y0}
              width={THROAT.w}
              height={y1 - y0}
              className="anat-overlay"
              {...state(region)}
            />
          ))}
        </g>
        {THROAT_PARTS.slice(1).map(([region, y]) => (
          <line key={region} x1={THROAT.x} x2={THROAT.x + THROAT.w} y1={y} y2={y} className="anat-divider" />
        ))}

        <path d={tonguePath} className="anat-tongue" {...state('lisan')} />
        <g clipPath={`url(#${id}-tongue)`}>
          {TONGUE_PARTS.map(([region, x0, x1]) => (
            <rect
              key={region}
              x={x0}
              y={140}
              width={x1 - x0}
              height={90}
              className="anat-overlay"
              {...state(region)}
            />
          ))}
        </g>
        <path d={TONGUE_SIDES} className="anat-tongue-sides" {...state('tongue-sides')} />

        <path d={PALATE} className="anat-palate" {...state('palate')} />
        <path d={MOLARS_UPPER} className="anat-teeth anat-molars" {...state('molars-upper')} />
        <path d={GUMS} className="anat-gums" {...state('gums')} />
        <path d={TEETH_UPPER} className="anat-teeth" {...state('teeth-upper')} />
        <path d={TEETH_LOWER} className="anat-teeth" {...state('teeth-lower')} />
        <path d={LIP_UPPER} className="anat-lip" {...state('lip-upper')} />
        <path d={LIP_LOWER} className="anat-lip" {...state('lip-lower')} />

        {labels.map((region) => {
          const { side, y, to } = LABELS[region]
          const x = side === 'left' ? LEFT_X : RIGHT_X
          const lineStart = side === 'left' ? x + 3 : x - 3
          return (
            <g key={region} className="anat-label" data-label={region}>
              <line x1={lineStart} y1={y - 5} x2={to[0]} y2={to[1]} className="anat-leader" />
              <circle cx={to[0]} cy={to[1]} r={2.5} className="anat-leader-dot" />
              <text x={x} y={y} textAnchor={side === 'left' ? 'end' : 'start'}>
                {t(MAKHRAJ_REGION_NAMES[region])}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
