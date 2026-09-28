import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { LETTER_NAMES } from '../tajweed/letters'
import {
  LETTER_MS,
  makharijAreas,
  makharijHalq,
  makharijJawf,
  makharijKhayshum,
  makharijLisan,
  makharijShafatan,
} from './MakharijClips'
import { MAKHARIJ, MAKHARIJ_AREAS, makharijOf, type MakharijArea } from './mouth/makharij'
import { labelSpans, type Clip } from './player/clip'

afterEach(() => localStorage.clear())

/**
 * Ibn al-Jazari's seventeen makharij, written out independently of the data (al-Muqaddimah
 * al-Jazariyyah, lines 9–19): per area, each makhraj's letters in the order the clip shows them,
 * and the MouthDiagram regions it lights. ن, ل and ر are three separate points.
 */
const EXPECTED: Record<MakharijArea, { letters: string[]; lit: string[] }[]> = {
  jawf: [{ letters: ['ا', 'و', 'ي'], lit: ['jawf'] }],
  halq: [
    { letters: ['ء', 'ه'], lit: ['halq-deepest'] },
    { letters: ['ع', 'ح'], lit: ['halq-middle'] },
    { letters: ['غ', 'خ'], lit: ['halq-closest'] },
  ],
  lisan: [
    { letters: ['ق'], lit: ['palate', 'tongue-back'] },
    { letters: ['ك'], lit: ['palate', 'tongue-back'] },
    { letters: ['ج', 'ش', 'ي'], lit: ['palate', 'tongue-middle'] },
    { letters: ['ض'], lit: ['molars-upper', 'tongue-sides'] },
    { letters: ['ل'], lit: ['gums', 'tongue-sides', 'tongue-tip'] },
    { letters: ['ن'], lit: ['gums', 'tongue-tip'] },
    { letters: ['ر'], lit: ['gums', 'tongue-tip'] },
    { letters: ['ط', 'د', 'ت'], lit: ['teeth-upper', 'tongue-tip'] },
    { letters: ['ص', 'ز', 'س'], lit: ['teeth-lower', 'tongue-tip'] },
    { letters: ['ظ', 'ذ', 'ث'], lit: ['teeth-upper', 'tongue-tip'] },
  ],
  shafatan: [
    { letters: ['ف'], lit: ['lip-lower', 'teeth-upper'] },
    { letters: ['ب', 'م', 'و'], lit: ['lip-lower', 'lip-upper'] },
  ],
  khayshum: [{ letters: ['ن', 'م'], lit: ['khayshum'] }],
}

const CLIPS: Record<MakharijArea, Clip> = {
  jawf: makharijJawf,
  halq: makharijHalq,
  lisan: makharijLisan,
  shafatan: makharijShafatan,
  khayshum: makharijKhayshum,
}

const renderFrame = (clip: Clip, stepIndex: number, progress: number) =>
  render(<LocaleProvider>{clip.steps[stepIndex].render(progress)}</LocaleProvider>).container

/** Every `data-region` element the frame lights (own highlight, or a child via MouthDiagram's parent map). */
const litRegions = (container: HTMLElement): string[] =>
  [...container.querySelectorAll('[data-lit="true"]')].map((el) => el.getAttribute('data-region')!).sort()

const shownLetters = (container: HTMLElement) =>
  [...container.querySelectorAll('.makharij-letter')].map((el) => el.textContent)
const currentLetters = (container: HTMLElement) =>
  [...container.querySelectorAll('.makharij-letter[data-current]')].map((el) => el.textContent)
const letterName = (container: HTMLElement) => container.querySelector('.makharij-letter-name')?.textContent

describe('the seventeen makharij', () => {
  it('are 17: 1 in the jawf, 3 in the throat, 10 on the tongue, 2 at the lips, 1 in the nose', () => {
    expect(MAKHARIJ).toHaveLength(17)
    expect(MAKHARIJ_AREAS.map((area) => makharijOf(area).length)).toEqual([1, 3, 10, 2, 1])
  })

  it.each(MAKHARIJ_AREAS)('%s: each makhraj holds exactly its letters, in order', (area) => {
    expect(makharijOf(area).map((m) => m.letters.map((l) => l.letter))).toEqual(EXPECTED[area].map((e) => e.letters))
  })

  it('give every letter but alif exactly one point in the throat, tongue or lips', () => {
    const letters = MAKHARIJ.filter((m) => ['halq', 'lisan', 'shafatan'].includes(m.area)).flatMap((m) =>
      m.letters.map((l) => l.letter),
    )
    expect([...letters].sort()).toEqual(Object.keys(LETTER_NAMES).filter((l) => l !== 'ا').sort())
  })

  it('are named and described in both languages, with a name for every letter', () => {
    for (const m of MAKHARIJ) {
      for (const text of [m.name, m.description, ...m.letters.map((l) => l.name)]) {
        expect(text.ar.trim()).not.toBe('')
        expect(text.en.trim()).not.toBe('')
      }
    }
  })
})

describe.each(MAKHARIJ_AREAS)('the %s clip', (area) => {
  const clip = CLIPS[area]
  const expected = EXPECTED[area]

  it('has one step per makhraj of the area, each labelled with its own name', () => {
    expect(clip.steps).toHaveLength(expected.length)
    expect(clip.steps.map((s) => s.label)).toEqual(makharijOf(area).map((m) => m.name))
    // No two neighbours share a label, so the timeline shows one label per makhraj.
    expect(labelSpans(clip)).toHaveLength(expected.length)
  })

  it.each(expected.map((e, i) => [i, e] as const))('step %i lights its point and names it', (i, { lit }) => {
    const container = renderFrame(clip, i, 1)
    expect(litRegions(container)).toEqual([...lit].sort())
    expect([...container.querySelectorAll('[data-label]')].map((el) => el.getAttribute('data-label')).sort()).toEqual(
      [...makharijOf(area)[i].regions].sort(),
    )
    expect(container.querySelector('.makharij-caption strong')).toHaveTextContent(makharijOf(area)[i].name.en)
    expect(clip.steps[i].caption).toEqual(makharijOf(area)[i].description)
  })

  it.each(expected.map((e, i) => [i, e] as const))(
    'step %i shows each letter in turn with its name, then all together',
    (i, { letters }) => {
      const makhraj = makharijOf(area)[i]
      const texts = makhraj.letters.map((l) => l.text)
      const phases = letters.length > 1 ? letters.length + 1 : 1
      // Slow enough to read: each letter (and the closing view) gets its own stretch of time.
      expect(clip.steps[i].duration).toBeGreaterThanOrEqual(Math.max(3000, phases * LETTER_MS))

      makhraj.letters.forEach((letter, k) => {
        const container = renderFrame(clip, i, (k + 0.5) / phases)
        expect(shownLetters(container)).toEqual(texts)
        expect(currentLetters(container)).toEqual([letter.text])
        expect(letterName(container)).toBe(letter.name.en)
      })

      // The end frame (and the reduced-motion frame) shows the whole makhraj at once.
      const end = renderFrame(clip, i, 1)
      expect(currentLetters(end)).toEqual(texts)
      for (const letter of makhraj.letters) expect(letterName(end)).toContain(letter.name.en)
    },
  )

  it('names the letters in Arabic when the locale is Arabic', () => {
    localStorage.setItem('tajweed.locale', 'ar')
    const container = renderFrame(clip, 0, 0)
    expect(letterName(container)).toBe(makharijOf(area)[0].letters[0].name.ar)
    expect(container.querySelector('.makharij-letters')).toHaveAttribute('lang', 'ar')
    expect(container.querySelector('.makharij-letters')).toHaveAttribute('dir', 'rtl')
  })
})

describe('the five-areas overview clip', () => {
  it('lights one whole area per step, in teaching order, with all of its letters', () => {
    const lit = [['jawf'], ['halq-closest', 'halq-deepest', 'halq-middle'], ['lisan'], ['lip-lower', 'lip-upper'], ['khayshum']]
    expect(makharijAreas.steps).toHaveLength(5)
    MAKHARIJ_AREAS.forEach((area, i) => {
      const container = renderFrame(makharijAreas, i, 1)
      expect(litRegions(container)).toEqual(lit[i])
      expect(shownLetters(container)).toEqual(makharijOf(area).flatMap((m) => m.letters.map((l) => l.text)))
      expect(makharijAreas.steps[i].label?.en.trim()).not.toBe('')
      expect(makharijAreas.steps[i].caption?.ar.trim()).not.toBe('')
    })
  })
})
