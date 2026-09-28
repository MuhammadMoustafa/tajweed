import type { Bilingual } from '../i18n/bilingual'
import type { Clip, ClipStep } from './player/clip'

// Single letters (not Quran text), right to left in reading order. `label` is the letter's bare
// name, shown above the seek bar (AnimationPlayer); `caption` is the fuller sentence under the
// stage.
const LETTERS: { letter: string; label: Bilingual; caption: Bilingual }[] = [
  {
    letter: 'ق',
    label: { ar: 'القاف', en: 'Qaf' },
    caption: { ar: 'القاف: يرتدّ صوتها إذا سكنت', en: 'Qaf: its sound bounces when it has a sukun' },
  },
  {
    letter: 'ط',
    label: { ar: 'الطاء', en: 'Ta' },
    caption: { ar: 'الطاء: يرتدّ صوتها إذا سكنت', en: 'Ta (the heavy t): its sound bounces when it has a sukun' },
  },
  {
    letter: 'ب',
    label: { ar: 'الباء', en: 'Ba' },
    caption: { ar: 'الباء: يرتدّ صوتها إذا سكنت', en: 'Ba: its sound bounces when it has a sukun' },
  },
  {
    letter: 'ج',
    label: { ar: 'الجيم', en: 'Jeem' },
    caption: { ar: 'الجيم: يرتدّ صوتها إذا سكنت', en: 'Jeem: its sound bounces when it has a sukun' },
  },
  {
    letter: 'د',
    label: { ar: 'الدال', en: 'Dal' },
    caption: { ar: 'الدال: يرتدّ صوتها إذا سكنت', en: 'Dal: its sound bounces when it has a sukun' },
  },
]

const STEP_MS = 2000
const Y = 80
/** Part of the step (0–1) the letter spends bouncing, and when each echo ring starts/how long it grows. */
const BOUNCE = 0.35
const RINGS = [0.1, 0.3]
const RING_SPAN = 0.55

const letterX = (i: number) => 420 - i * 85

/** Frame for the `current` letter: it bounces and sends out echo rings; the others wait, dimmed. */
function frame(current: number, progress: number) {
  const bounce = progress < BOUNCE ? -16 * Math.sin((Math.PI * progress) / BOUNCE) : 0
  const cx = letterX(current)
  return (
    <svg viewBox="0 0 500 160" aria-hidden="true" className="anim-svg qalqalah-frame">
      {RINGS.map((start) => {
        const grown = (progress - start) / RING_SPAN
        if (grown <= 0 || grown >= 1) return null
        return (
          <circle
            key={start}
            cx={cx}
            cy={Y}
            r={22 + 36 * grown}
            fill="none"
            stroke="var(--tj-qalqalah)"
            strokeWidth={3}
            opacity={0.9 * (1 - grown)}
          />
        )
      })}
      {LETTERS.map(({ letter }, i) => (
        <text
          key={letter}
          x={letterX(i)}
          y={Y + (i === current ? bounce : 0)}
          textAnchor="middle"
          dominantBaseline="central"
          className="anim-letter"
          fill="var(--tj-qalqalah)"
          opacity={i === current ? 1 : 0.3}
          data-current={i === current || undefined}
        >
          {letter}
        </text>
      ))}
      {/* Points at the letter this step is about. */}
      <path d={`M${cx - 9} 150 L${cx} 138 L${cx + 9} 150 Z`} fill="var(--tj-qalqalah)" />
    </svg>
  )
}

/** Each qalqalah letter in turn bounces and echoes (L10). */
export const qalqalahBounce: Clip = {
  title: { ar: 'حروف القلقلة الخمسة', en: 'The five qalqalah letters' },
  steps: LETTERS.map(
    ({ label, caption }, i): ClipStep => ({
      duration: STEP_MS,
      caption,
      label,
      render: (progress) => frame(i, progress),
    }),
  ),
}
