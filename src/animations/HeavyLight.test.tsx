import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { HEAVY_LETTERS, heavyLight } from './HeavyLight'

afterEach(() => localStorage.clear())

const renderStep = (index: number, locale: 'ar' | 'en' = 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  return render(<LocaleProvider>{heavyLight.steps[index].render(1)}</LocaleProvider>)
}

describe('heavy-light clip (src/animations/HeavyLight.tsx)', () => {
  it('names the seven letters of isti\u02bfla', () => {
    expect(HEAVY_LETTERS).toHaveLength(7)
    expect(new Set(HEAVY_LETTERS).size).toBe(7)
  })

  it('has three labeled steps: light, heavy, the seven', () => {
    expect(heavyLight.steps).toHaveLength(3)
    for (const step of heavyLight.steps) {
      expect(step.label?.ar.trim()).toBeTruthy()
      expect(step.label?.en.trim()).toBeTruthy()
    }
  })

  it('draws the tongue low for a light letter and raised, pointing at its back, for a heavy one', () => {
    const light = renderStep(0)
    const lightPath = light.container.querySelector('.anat-tongue')?.getAttribute('d')
    light.unmount()
    const heavy = renderStep(1)
    expect(heavy.container.querySelector('.anat-tongue')?.getAttribute('d')).not.toBe(lightPath)
    expect(heavy.container.querySelector('[data-label="tongue-back"]')).not.toBeNull()
    heavy.unmount()
  })

  it('shows all seven letters in the last step', () => {
    const { container } = renderStep(2, 'ar')
    for (const letter of HEAVY_LETTERS) expect(container).toHaveTextContent(letter)
  })
})
