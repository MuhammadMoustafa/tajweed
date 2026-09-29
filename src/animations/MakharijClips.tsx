import { joinBilingual, type Bilingual } from '../i18n/bilingual'
import { Localized } from '../i18n/LocaleProvider'
import { MAKHARIJ_AREAS, makharijOf, type MakharijArea, type Makhraj } from './mouth/makharij'
import { MouthDiagram, type MouthDiagramProps } from './mouth/MouthDiagram'
import type { Clip, ClipStep } from './player/clip'

/** How long each letter of a makhraj stays on its own, and the closing "all together" view, in ms. */
export const LETTER_MS = 2200
/** The shortest step, so a one-letter makhraj still leaves time to read its description. */
const MIN_STEP_MS = 3000

/** A step shows each of its `count` letters in turn, then (with more than one) all of them together. */
export const phasesOf = (count: number): number => (count > 1 ? count + 1 : 1)

/**
 * Which of a step's `count` letters it shows on its own at `progress` (0–1), `undefined` for the
 * closing phase that shows them all together, and how far into that phase it is (0–1). One letter
 * is always shown on its own. The end frame (progress 1, as with reduced motion) is therefore the
 * whole group at once, fully drawn.
 */
export function letterInTurn(count: number, progress: number): { current?: number; local: number } {
  const phases = phasesOf(count)
  const at = Math.min(Math.max(progress, 0), 1) * phases
  const phase = Math.min(Math.floor(at), phases - 1)
  return { current: phase < count ? phase : undefined, local: Math.min(at - phase, 1) }
}

/** Index of the letter a makhraj's step shows on its own at `progress` (see `letterInTurn`). */
export const currentLetter = (makhraj: Makhraj, progress: number): number | undefined =>
  letterInTurn(makhraj.letters.length, progress).current

export interface LetterTourFrameProps {
  heading: Bilingual
  highlight: Makhraj['regions']
  /** Passed on to MouthDiagram (see its props). */
  tongue?: MouthDiagramProps['tongue']
  overlay?: MouthDiagramProps['overlay']
  /** Texts in the letters row; `current` (when set) is the one marked as shown now. */
  letters: readonly string[]
  current?: number
  /** The line under the letters: the current letter's name, or every name. */
  names?: Bilingual
}

/**
 * A step's frame: the lit point on the diagram, with its name, its letters and their names. Also
 * the sifat clips' frame (SifatClips.tsx), which add the tongue's position and an overlay.
 */
export const letterTourFrame = ({ heading, highlight, tongue, overlay, letters, current, names }: LetterTourFrameProps) => (
  <div className="makharij-tour">
    <MouthDiagram highlight={highlight} labels={highlight} tongue={tongue} overlay={overlay} />
    <div className="makharij-caption">
      <strong>
        <Localized text={heading} />
      </strong>
      <span className="makharij-letters" lang="ar" dir="rtl">
        {letters.map((text, i) => (
          <span
            key={text}
            className="makharij-letter"
            data-current={current === undefined || current === i ? true : undefined}
          >
            {text}
          </span>
        ))}
      </span>
      {names && (
        <span className="makharij-letter-name">
          <Localized text={names} />
        </span>
      )}
    </div>
  </div>
)

const makhrajStep = (makhraj: Makhraj): ClipStep => ({
  duration: Math.max(MIN_STEP_MS, phasesOf(makhraj.letters.length) * LETTER_MS),
  caption: makhraj.description,
  // Same short name as the frame's heading, so the timeline label matches what's on screen.
  label: makhraj.name,
  render: (progress) => {
    const current = currentLetter(makhraj, progress)
    return letterTourFrame({
      heading: makhraj.name,
      highlight: makhraj.regions,
      letters: makhraj.letters.map((l) => l.text),
      current,
      names: current === undefined ? joinBilingual(makhraj.letters.map((l) => l.name)) : makhraj.letters[current].name,
    })
  },
})

/** A chapter's clip: one step per makhraj of `area`, in teaching order. */
const areaClip = (area: MakharijArea, title: Bilingual): Clip => ({ title, steps: makharijOf(area).map(makhrajStep) })

export const AREA_TITLES: Record<MakharijArea, Bilingual> = {
  jawf: { ar: 'الجوف', en: 'Al-jawf' },
  halq: { ar: 'الحلق', en: 'Al-halq' },
  lisan: { ar: 'اللسان', en: 'Al-lisan' },
  shafatan: { ar: 'الشفتان', en: 'Ash-shafatan' },
  khayshum: { ar: 'الخيشوم', en: 'Al-khayshum' },
}

/** What the overview says under each area: how many makharij it holds and what comes from it. */
const AREA_CAPTIONS: Record<MakharijArea, Bilingual> = {
  jawf: {
    ar: 'الجوف: فراغ الحلق والفم. مخرج واحد لحروف المد الثلاثة.',
    en: 'The jawf: the empty space of the throat and mouth. One makhraj, for the three madd letters.',
  },
  halq: {
    ar: 'الحلق: ثلاثة مخارج لستة حروف.',
    en: 'The throat: three makharij, for six letters.',
  },
  lisan: {
    ar: 'اللسان: عشرة مخارج لثمانية عشر حرفًا.',
    en: 'The tongue: ten makharij, for eighteen letters.',
  },
  shafatan: {
    ar: 'الشفتان: مخرجان لأربعة حروف.',
    en: 'The lips: two makharij, for four letters.',
  },
  khayshum: {
    ar: 'الخيشوم: مخرج واحد، للغنة التي تصحب النون والميم.',
    en: 'The khayshum (nose): one makhraj, for the ghunnah that goes with noon and meem.',
  },
}

/** Makharij intro (L2): the five areas one per step, each with every letter it holds. */
export const makharijAreas: Clip = {
  title: { ar: 'المواضع الخمسة', en: 'The five areas' },
  steps: MAKHARIJ_AREAS.map(
    (area): ClipStep => ({
      duration: MIN_STEP_MS,
      caption: AREA_CAPTIONS[area],
      label: AREA_TITLES[area],
      render: () =>
        letterTourFrame({
          heading: AREA_TITLES[area],
          highlight: [area],
          letters: makharijOf(area).flatMap((m) => m.letters.map((l) => l.text)),
        }),
    }),
  ),
}

/** Al-jawf (L2.1): one makhraj, the three madd letters in turn. */
export const makharijJawf: Clip = areaClip('jawf', AREA_TITLES.jawf)

/** Al-halq (L2.2): deepest → middle → nearest, two letters each. */
export const makharijHalq: Clip = areaClip('halq', AREA_TITLES.halq)

/** Al-lisan (L2.3): the tongue's ten makharij, back to tip. */
export const makharijLisan: Clip = areaClip('lisan', AREA_TITLES.lisan)

/** Ash-shafatan (L2.4): fa, then the letters made with both lips. */
export const makharijShafatan: Clip = areaClip('shafatan', AREA_TITLES.shafatan)

/** Al-khayshum (L2.5): the ghunnah of noon and meem. */
export const makharijKhayshum: Clip = areaClip('khayshum', AREA_TITLES.khayshum)
