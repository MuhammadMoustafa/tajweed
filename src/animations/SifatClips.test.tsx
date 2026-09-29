import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { ANIMATIONS } from '.'
import { makhrajOfLetter } from './mouth/makharij'
import { lettersWith, OPPOSITE_SIFAT, SIFAT, SINGLE_SIFAT } from './mouth/sifat'
import type { Clip } from './player/clip'
import { LOOK_ALIKES, sifatCompare, sifatHamsJahr, sifatItbaqInfitah, sifatIstilaIstifal, sifahStep } from './SifatClips'

afterEach(() => localStorage.clear())

const renderFrame = (node: React.ReactNode, locale: 'ar' | 'en' = 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  return render(<LocaleProvider>{node}</LocaleProvider>).container
}

const litRegions = (container: HTMLElement): string[] =>
  [...container.querySelectorAll('[data-lit="true"]')].map((el) => el.getAttribute('data-region')!).sort()
const shownLetters = (container: HTMLElement) =>
  [...container.querySelectorAll('.makharij-letter')].map((el) => el.textContent)
const currentLetters = (container: HTMLElement) =>
  [...container.querySelectorAll('.makharij-letter[data-current]')].map((el) => el.textContent)
const tongue = (container: HTMLElement) => container.querySelector('.anat-tongue')!.getAttribute('d')

const SECTION_CLIPS = [
  'sifat-hams-jahr',
  'sifat-shiddah-rakhawah',
  'sifat-istila-istifal',
  'sifat-itbaq-infitah',
  'sifat-idhlaq-ismat',
  'sifat-safir-qalqalah-lin',
  'sifat-inhiraf-istitalah',
] as const

describe('sifat clips', () => {
  it('step through every quality once, a clip per group, each step labeled with its quality', () => {
    const labels = SECTION_CLIPS.map((id) => ANIMATIONS[id].steps.map((s) => s.label?.en))
    expect(labels).toEqual(
      [...OPPOSITE_SIFAT, SINGLE_SIFAT.slice(0, 3), SINGLE_SIFAT.slice(3)].map((group) =>
        group.map((id) => SIFAT[id].name.en),
      ),
    )
    expect(ANIMATIONS['sifat-compare']).toBe(sifatCompare)
  })

  it('show a mnemonic group one letter at a time, lighting that letter’s makhraj, then all together', () => {
    const [hams] = sifatHamsJahr.steps
    const first = renderFrame(hams.render(0))
    expect(shownLetters(first)).toEqual(lettersWith('hams'))
    expect(currentLetters(first)).toEqual(['ف'])
    expect(litRegions(first)).toEqual([...makhrajOfLetter('ف').regions].sort())
    expect(first.querySelector('.makharij-letter-name')).toHaveTextContent('Fa')

    const end = renderFrame(hams.render(1))
    expect(currentLetters(end)).toEqual(lettersWith('hams'))
    expect(end.querySelector('.makharij-letter-name')).toHaveTextContent(SIFAT.hams.mnemonic!)
    // Breath flowing out: drawn fully in the end frame.
    expect(end.querySelector('.sifat-breath:not(.sifat-halo)')).not.toBeNull()
  })

  it('show "the rest of the letters" all at once', () => {
    const jahr = sifatHamsJahr.steps[1]
    const start = renderFrame(jahr.render(0))
    expect(currentLetters(start)).toEqual(lettersWith('jahr'))
    expect(start.querySelector('.makharij-letter-name')).toHaveTextContent('The rest of the letters')
    const end = renderFrame(jahr.render(1), 'ar')
    expect(end.querySelector('.makharij-letter-name')).toHaveTextContent('بقية الحروف')
    expect(end.querySelector('.sifat-barrier')).not.toBeNull()
  })

  it('stop the sound of a shiddah letter at its makhraj, and let a rakhawah letter’s run out', () => {
    expect(renderFrame(sifahStep('shiddah').render(1)).querySelector('.sifat-barrier')).not.toBeNull()
    const soft = renderFrame(sifahStep('rakhawah').render(1))
    expect(soft.querySelector('.sifat-barrier')).toBeNull()
    expect(soft.querySelector('.sifat-sound:not(.sifat-halo)')).not.toBeNull()
  })

  it('raise the tongue for istiʿla and seal it against the palate for itbaq', () => {
    const [raised, lowered] = sifatIstilaIstifal.steps.map((s) => renderFrame(s.render(1)))
    const [sealed, open] = sifatItbaqInfitah.steps.map((s) => renderFrame(s.render(1)))
    expect(tongue(raised)).not.toBe(tongue(lowered))
    expect(tongue(sealed)).not.toBe(tongue(open))
    expect(tongue(sealed)).not.toBe(tongue(raised))
    expect(tongue(lowered)).toBe(tongue(open))
    expect(litRegions(sealed)).toContain('palate')
  })

  it('shows the letters as Arabic, right to left, in both locales', () => {
    for (const locale of ['ar', 'en'] as const) {
      const letters = renderFrame(sifahStep('safir').render(1), locale).querySelector('.makharij-letters')!
      expect(letters).toHaveAttribute('lang', 'ar')
      expect(letters).toHaveAttribute('dir', 'rtl')
      expect(letters).toHaveTextContent('صزس')
    }
  })
})

describe('look-alike letters clip', () => {
  const clip: Clip = sifatCompare

  it('compares letters that share a makhraj', () => {
    for (const { letters } of LOOK_ALIKES) {
      expect(makhrajOfLetter(letters[0])).toBe(makhrajOfLetter(letters[1]))
    }
    expect(clip.steps.map((s) => s.label?.en)).toEqual(['Ta and ṭa', 'Seen and ṣad', 'Dhal and ẓa', 'Hamzah and ha'])
  })

  it('marks (in bold, not only by color) the qualities the two letters do not share', () => {
    const end = renderFrame(clip.steps[0].render(1))
    const differs = (letter: string) =>
      [...end.querySelectorAll(`[data-letter="${letter}"] li[data-differs]`)].map((li) => li.getAttribute('data-sifah'))
    expect(differs('ت')).toEqual(['hams', 'istifal', 'infitah'])
    expect(differs('ط')).toEqual(['jahr', 'istila', 'itbaq', 'qalqalah'])
    expect(end.querySelectorAll('li[data-differs] strong')).toHaveLength(7)
    expect(end.querySelectorAll('.sifat-compare-letter[data-current]')).toHaveLength(2)
  })

  it('shows one letter first, in Arabic as well', () => {
    const start = renderFrame(clip.steps[1].render(0), 'ar')
    const current = start.querySelectorAll('.sifat-compare-letter[data-current]')
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveAttribute('data-letter', 'س')
    expect(current[0]).toHaveTextContent('الهمس')
  })
})
