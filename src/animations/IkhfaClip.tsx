import type { Bilingual } from '../i18n/bilingual'
import { MAKHARIJ } from './mouth/makharij'
import { MouthDiagram, type MakhrajRegion } from './mouth/MouthDiagram'
import type { Clip, ClipStep } from './player/clip'

/** The regions MouthDiagram lights for `letter`'s makhraj (from the makharij table, never retyped). */
const regionsOf = (letter: string): MakhrajRegion[] =>
  MAKHARIJ.find((m) => m.letters.some((l) => l.letter === letter))?.regions ?? []

/** The fifteen ikhfa letters, in the order of the mnemonic that gathers them (Tuhfa, line 16). */
export const IKHFA_LETTERS = ['ص', 'ذ', 'ث', 'ك', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ'] as const

/** Noon's own makhraj: the tip of the tongue at the gums. */
const NOON_REGIONS = regionsOf('ن')

interface FrameProps {
  /** How strongly the noon still sounds (1 = fully), 0–1. */
  noon: number
  nasal: number
  /** The next letter shown beside the noon, lit on the diagram, with the tongue heading to it. */
  next?: { letter: string; to: MakhrajRegion; progress: number }
  /** Letters shown instead of a noon + next letter pair. */
  letters?: readonly string[]
  highlight?: MakhrajRegion[]
}

const frame = ({ noon, nasal, next, letters, highlight = [] }: FrameProps) => (
  <div className="makharij-tour">
    <MouthDiagram
      highlight={[...highlight, ...(nasal > 0 ? (['khayshum'] as const) : [])]}
      labels={nasal > 0 ? ['khayshum'] : []}
      nasal={nasal}
      pointer={next && { from: 'gums', to: next.to, progress: next.progress }}
    />
    <div className="makharij-caption">
      <span className="makharij-letters" lang="ar" dir="rtl">
        {letters ? (
          letters.map((text) => (
            <span key={text} className="makharij-letter" data-current>
              {text}
            </span>
          ))
        ) : (
          <>
            <span className="makharij-letter" data-current style={{ opacity: 0.25 + 0.75 * noon }}>
              نْ
            </span>
            {next && (
              <span className="makharij-letter" data-current>
                {next.letter}
              </span>
            )}
          </>
        )}
      </span>
    </div>
  </div>
)

const STEP_MS = 5000

const step = (label: Bilingual, caption: Bilingual, render: ClipStep['render'], duration = STEP_MS): ClipStep => ({
  duration,
  label,
  caption,
  render,
})

const nextStep = (letter: string, to: MakhrajRegion, label: Bilingual, caption: Bilingual): ClipStep =>
  step(label, caption, (p) =>
    frame({ noon: 0, nasal: 1, next: { letter, to, progress: p }, highlight: regionsOf(letter) }),
  6000)

/**
 * Ikhfa haqiqi (L7): the noon is neither pronounced clearly nor merged. It fades into a nasal
 * cloud (the ghunnah, held 2 counts) while the tongue moves toward the next letter's makhraj
 * without touching it. Shown with a near letter and a far one.
 */
export const ikhfaHidden: Clip = {
  title: { ar: 'الإخفاء: النون تختفي في غنة', en: 'Ikhfa: the noon hides in a nasal sound' },
  steps: [
    step(
      { ar: 'النون في مخرجها', en: 'Noon in its place' },
      {
        ar: 'النون الساكنة الواضحة تخرج من طرف اللسان مع اللثة. هذا هو الإظهار، وليس ما نريده هنا.',
        en: 'A clear noon sakinah comes from the tip of the tongue at the gums. That is izhar, not what we want here.',
      },
      () => frame({ noon: 1, nasal: 0, highlight: NOON_REGIONS }),
    ),
    step(
      { ar: 'النون تخفت', en: 'The noon fades' },
      {
        ar: 'قبل حروف الإخفاء تخفّ النون: لا يلمس اللسان مخرجها، ويبقى صوت الغنة في الخيشوم.',
        en: 'Before an ikhfa letter the noon fades: the tongue does not touch its spot, and the ghunnah sound stays in the nose.',
      },
      (p) => frame({ noon: 1 - p, nasal: p }),
    ),
    nextStep(
      'ت',
      'teeth-upper',
      { ar: 'اللسان يتهيأ (قريب)', en: 'The tongue prepares (near)' },
      {
        ar: 'وفي هذا الوقت يتجه اللسان إلى مخرج الحرف التالي، ولا يلمسه. هنا الحرف قريب من مخرج النون.',
        en: 'Meanwhile the tongue heads toward the next letter’s makhraj without touching it. Here that letter is close to the noon’s own spot.',
      },
    ),
    nextStep(
      'ق',
      'tongue-back',
      { ar: 'اللسان يتهيأ (بعيد)', en: 'The tongue prepares (far)' },
      {
        ar: 'وهنا الحرف بعيد: يتجه اللسان إلى أقصاه. في الحالتين تدوم الغنة حركتين.',
        en: 'Here the next letter is far back: the tongue heads to its back part. In both cases the ghunnah lasts 2 counts.',
      },
    ),
    step(
      { ar: 'الحروف الخمسة عشر', en: 'The fifteen letters' },
      {
        ar: 'هذه حروف الإخفاء الخمسة عشر، وهي بقية الحروف بعد حروف الإظهار والإدغام والإقلاب.',
        en: 'These are the fifteen ikhfa letters: all the letters left after those of izhar, idgham and iqlab.',
      },
      () => frame({ noon: 0, nasal: 1, letters: IKHFA_LETTERS }),
    ),
  ],
}
