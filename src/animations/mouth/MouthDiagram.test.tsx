import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../../i18n/LocaleProvider'
import { MouthDiagram, type MouthDiagramProps } from './MouthDiagram'

const renderDiagram = (props: MouthDiagramProps, locale: 'ar' | 'en' = 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  const { container } = render(
    <LocaleProvider>
      <MouthDiagram {...props} />
    </LocaleProvider>,
  )
  return container
}

const litRegions = (container: HTMLElement) =>
  [...container.querySelectorAll('[data-lit="true"]')].map((el) => el.getAttribute('data-region'))

afterEach(() => localStorage.clear())

describe('MouthDiagram', () => {
  it('is an image named by its title and describing what is highlighted', () => {
    const container = renderDiagram({ highlight: ['halq-middle'] })
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('role', 'img')
    const [titleId, descId] = svg.getAttribute('aria-labelledby')!.split(' ')
    expect(container.querySelector(`[id="${titleId}"]`)).toHaveTextContent('Side view of the mouth, throat and nose')
    expect(container.querySelector(`[id="${descId}"]`)).toHaveTextContent('Highlighted: Throat: middle')
  })

  it('lights only the requested regions', () => {
    const container = renderDiagram({ highlight: ['tongue-back', 'khayshum'] })
    expect(litRegions(container).sort()).toEqual(['khayshum', 'tongue-back'])
  })

  it('lights every part of a whole area', () => {
    const container = renderDiagram({ highlight: ['halq', 'shafatan'] })
    expect(litRegions(container).sort()).toEqual([
      'halq-closest',
      'halq-deepest',
      'halq-middle',
      'lip-lower',
      'lip-upper',
    ])
  })

  it('has the gum ridge (ن ل ر) and the upper molars (ض) as their own regions, each labelled', () => {
    const container = renderDiagram({ highlight: ['gums', 'molars-upper'], labels: ['gums', 'molars-upper'] })
    expect(litRegions(container).sort()).toEqual(['gums', 'molars-upper'])
    expect([...container.querySelectorAll('[data-label] text')].map((el) => el.textContent)).toEqual([
      'Gum ridge',
      'Upper molars',
    ])
    // The molars are teeth: lighting all the teeth lights them too.
    expect(litRegions(renderDiagram({ highlight: ['teeth'] })).sort()).toEqual([
      'molars-upper',
      'teeth-lower',
      'teeth-upper',
    ])
  })

  it('lights nothing by default', () => {
    expect(litRegions(renderDiagram({}))).toEqual([])
  })

  it('labels the requested regions in the current language', () => {
    const en = renderDiagram({ labels: ['jawf', 'halq', 'lisan', 'shafatan', 'khayshum'] })
    expect([...en.querySelectorAll('[data-label] text')].map((el) => el.textContent)).toEqual([
      'Jawf',
      'Throat',
      'Tongue',
      'Lips',
      'Nose',
    ])

    const ar = renderDiagram({ labels: ['halq-deepest'], highlight: ['halq-deepest'] }, 'ar')
    expect(ar.querySelector('[data-label="halq-deepest"] text')).toHaveTextContent('أقصى الحلق')
    expect(ar.querySelector('title')).toHaveTextContent('رسم جانبي للفم والحلق والأنف')
  })

  it('draws the nasal cloud and the tongue pointer only when asked, moving with progress', () => {
    expect(renderDiagram({}).querySelector('.anat-nasal-cloud, .anat-pointer')).toBeNull()
    const start = renderDiagram({ nasal: 0.5, pointer: { from: 'gums', to: 'tongue-back', progress: 0 } })
    expect(start.querySelector('.anat-nasal-cloud')).toHaveAttribute('data-nasal', '0.5')
    const x = (c: HTMLElement) => Number(c.querySelector('.anat-pointer')!.getAttribute('cx'))
    const end = renderDiagram({ pointer: { from: 'gums', to: 'tongue-back', progress: 1 } })
    expect(x(end)).toBeGreaterThan(x(start))
  })
})
