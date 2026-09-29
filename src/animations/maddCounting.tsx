import type { ReactNode } from 'react'
import { formatNumber, type Bilingual } from '../i18n/bilingual'
import { COUNT_MS, MADD_READY_MS, MADD_STOP_MS, MaddBar, maddBeatFilled, type MaddBarProps, type MaddCount } from './MaddBar'
import type { ClipStep } from './player/clip'

/** What MaddBar shows throughout one counting pass: the syllable, its cause, color and caption. */
export type MaddPassBar = Pick<MaddBarProps, 'before' | 'letter' | 'after' | 'cause' | 'token' | 'label'>

export interface MaddCountingPass {
  counts: MaddCount
  bar: MaddPassBar
  /** MaddBar's caption on the "get ready" step, when it should differ from `bar.label`. */
  readyBarLabel?: Bilingual
  /** Step captions: "get ready / say it with me" and "stop". Counts are captioned by the builder. */
  ready: Bilingual
  stop: Bilingual
  /**
   * One timeline label for every step of the pass (e.g. "4 counts"), shown once over the whole
   * pass. Omit for a label per step: get ready, count 1 … count N, stop.
   */
  label?: Bilingual
  /** Wraps each step's bar in a larger frame (e.g. beside a MouthDiagram); default: the bar alone. */
  frame?: (bar: ReactNode) => ReactNode
}

const ORDINALS: Bilingual[] = [
  { ar: 'الأولى', en: 'one' },
  { ar: 'الثانية', en: 'two' },
  { ar: 'الثالثة', en: 'three' },
  { ar: 'الرابعة', en: 'four' },
  { ar: 'الخامسة', en: 'five' },
  { ar: 'السادسة', en: 'six' },
]

/** "Count one." … and, on the last count, "Count N — the end marker." */
const countCaption = (beat: number, counts: number): Bilingual => {
  const end = beat === counts
  return {
    ar: `الحركة ${ORDINALS[beat - 1].ar}${end ? ' — علامة النهاية' : ''}.`,
    en: `Count ${ORDINALS[beat - 1].en}${end ? ' — the end marker' : ''}.`,
  }
}

const countLabel = (beat: number): Bilingual => ({
  ar: `الحركة ${formatNumber('ar', beat)}`,
  en: `Count ${beat}`,
})

/**
 * One "say it with me" counting pass on MaddBar, the shape every madd clip uses (L13c, #34):
 * a static "get ready" step with an empty bar and both start/end markers, one `COUNT_MS` step per
 * count (the bar filling to that beat, its pulse landing on it), then a static "stop" step. A
 * clip teaching a choice of lengths (e.g. 2, 4 or 6) chains one pass per length.
 */
export function maddCountingSteps(pass: MaddCountingPass): ClipStep[] {
  const { counts, bar, readyBarLabel, ready, stop, label, frame: wrap = (node) => node } = pass
  const frame = (filled: number, stopped = false, caption = bar.label) =>
    wrap(<MaddBar {...bar} label={caption} counts={counts} filled={filled} current markers stopped={stopped} />)
  const beats = Array.from({ length: counts }, (_, i) => i + 1)
  return [
    {
      duration: MADD_READY_MS,
      label: label ?? { ar: 'استعدّ', en: 'Get ready' },
      caption: ready,
      render: () => frame(0, false, readyBarLabel ?? bar.label),
    },
    ...beats.map(
      (beat): ClipStep => ({
        duration: COUNT_MS,
        label: label ?? countLabel(beat),
        caption: countCaption(beat, counts),
        render: (progress) => frame(maddBeatFilled(beat, progress)),
      }),
    ),
    {
      duration: MADD_STOP_MS,
      label: label ?? { ar: 'قف', en: 'Stop' },
      caption: stop,
      render: () => frame(counts, true),
    },
  ]
}
