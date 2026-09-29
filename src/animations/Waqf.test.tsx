import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { labelSpans, type Clip } from './player/clip'
import { waqfRestart, waqfSigns, waqfStop, WAQF_SIGNS } from './Waqf'

afterEach(() => localStorage.clear())

const draw = (clip: Clip, index: number, progress = 1, locale: 'ar' | 'en' = 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  return render(<LocaleProvider>{clip.steps[index].render(progress)}</LocaleProvider>).container
}

describe('waqf clips (src/animations/Waqf.tsx)', () => {
  it('points at each stop sign in turn, the pair drawn twice', () => {
    expect(waqfSigns.steps).toHaveLength(6)
    const glyphs = Object.values(WAQF_SIGNS)
    waqfSigns.steps.forEach((_step, i) => {
      const frame = draw(waqfSigns, i)
      const drawn = [...frame.querySelectorAll('[data-glyph]')].map((g) => g.textContent)
      expect(drawn).toHaveLength(i === 5 ? 2 : 1)
      for (const d of drawn) expect(d).toContain(glyphs[i])
    })
  })

  it('names each sign in the current language', () => {
    expect(draw(waqfSigns, 0, 1, 'en').querySelector('[data-sign-label]')).toHaveTextContent('Required stop')
    expect(draw(waqfSigns, 0, 1, 'ar').querySelector('[data-sign-label]')).toHaveTextContent('وقف لازم')
  })

  it('shows before and after forms, the after form fully drawn at the end and dimmed at the start', () => {
    expect(waqfStop.steps).toHaveLength(4)
    const end = draw(waqfStop, 2, 1)
    expect(end.querySelector('[data-before]')).not.toBeNull()
    expect(end.querySelector('[data-after]')).toHaveAttribute('opacity', '1')
    expect(draw(waqfStop, 2, 0).querySelector('[data-after]')).toHaveAttribute('opacity', '0.25')
  })

  it('labels each stopping change and each restart step in both languages', () => {
    for (const clip of [waqfStop, waqfRestart, waqfSigns]) {
      for (const span of labelSpans(clip)) {
        expect(span.label.ar.trim()).not.toBe('')
        expect(span.label.en.trim()).not.toBe('')
      }
    }
    expect(labelSpans(waqfStop).map((s) => s.label.en)).toEqual([
      'A vowel becomes sukun',
      'Tanween damma or kasra',
      'Tanween fatha becomes alif',
      'Ta marbuta becomes ha',
    ])
  })

  it('marks the stop after the third word and restarts at the fourth, or further back after a forced stop', () => {
    expect(draw(waqfRestart, 1).querySelector('[data-stop]')).toHaveAttribute('data-stop', '2')
    expect(draw(waqfRestart, 2).querySelector('[data-restart]')).toHaveAttribute('data-restart', '3')
    const forced = draw(waqfRestart, 3)
    expect(forced.querySelector('[data-stop]')).toHaveAttribute('data-stop', '3')
    expect(forced.querySelector('[data-restart]')).toHaveAttribute('data-restart', '1')
  })
})
