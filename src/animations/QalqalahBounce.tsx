import { getWord } from '../data/quran'
import type { Bilingual } from '../i18n/bilingual'
import type { WordKey } from '../lessons/types'
import type { Clip, ClipStep } from './player/clip'
import { CLIP_WORDS } from './words'

// Single letters (not Quran text), right to left in reading order. `label` is the letter's bare
// name, shown above the seek bar (AnimationPlayer); `caption` is the fuller sentence under the
// stage. `word`, where a lesson verse has one, is a Quran word with that letter's qalqalah: the
// step shows it (text from the fetched data) and plays it, recited by al-Husary (T12/#35).
const LETTERS: { letter: string; label: Bilingual; caption: Bilingual; word?: WordKey }[] = [
  {
    letter: 'ق',
    label: { ar: 'القاف', en: 'Qaf' },
    caption: {
      ar: 'القاف: يرتدّ صوتها إذا سكنت. استمع إليها في آخر الآية الأولى من سورة الفلق، حيث يسكّنها الوقف.',
      en: 'Qaf: its sound bounces when it has a sukun. Hear it at the end of 113:1, where stopping gives it one.',
    },
    word: CLIP_WORDS.qalqalahQaf,
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
    caption: {
      ar: 'الدال: يرتدّ صوتها إذا سكنت. استمع إليها ساكنةً في وسط الآية الثالثة من سورة الإخلاص.',
      en: 'Dal: its sound bounces when it has a sukun. Hear it, with its sukun, in the middle of 112:3.',
    },
    word: CLIP_WORDS.qalqalahDal,
  },
]

const STEP_MS = 2000
const Y = 80
/** Part of the step (0–1) the letter spends bouncing, and when each echo ring starts/how long it grows. */
const BOUNCE = 0.35
const RINGS = [0.1, 0.3]
const RING_SPAN = 0.55

const letterX = (i: number) => 420 - i * 85

/** Where a step's Quran word sits, under the letters and their pointer (every frame keeps the room). */
const WORD_Y = 195

/**
 * Frame for the `current` letter: it bounces and sends out echo rings; the others wait, dimmed.
 * With `word`, that Quran word (the one the step plays) is shown underneath.
 */
function frame(current: number, progress: number, word?: WordKey) {
  const bounce = progress < BOUNCE ? -16 * Math.sin((Math.PI * progress) / BOUNCE) : 0
  const cx = letterX(current)
  const wordText = word && getWord(word)?.text
  return (
    <svg viewBox="0 0 500 230" aria-hidden="true" className="anim-svg qalqalah-frame">
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
      {wordText && (
        <text x={250} y={WORD_Y} textAnchor="middle" dominantBaseline="central" className="anim-word" data-word={word}>
          {wordText}
        </text>
      )}
    </svg>
  )
}

/** Each qalqalah letter in turn bounces and echoes (L10); with a Quran word, the reciter says it. */
export const qalqalahBounce: Clip = {
  title: { ar: 'حروف القلقلة الخمسة', en: 'The five qalqalah letters' },
  steps: LETTERS.map(
    ({ label, caption, word }, i): ClipStep => ({
      duration: STEP_MS,
      caption,
      label,
      audio: word ? { word } : undefined,
      render: (progress) => frame(i, progress, word),
    }),
  ),
}
