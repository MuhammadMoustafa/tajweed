import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../../i18n/LocaleProvider'
import { MouthDiagram, type MouthDiagramProps } from './MouthDiagram'
import { inDiagramView } from './regions'

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

  it('draws the exact contact only when asked, above everything else', () => {
    expect(renderDiagram({ highlight: ['gums'] }).querySelector('.anat-contact')).toBeNull()

    const point = renderDiagram({ highlight: ['gums', 'tongue-tip'], labels: ['gums'], contact: { kind: 'point', at: [70, 151] } })
    const mark = point.querySelector('.anat-contact')!
    expect(mark).toHaveAttribute('data-contact', 'point')
    expect(mark.querySelector('.anat-contact-dot')).toHaveAttribute('cx', '70')
    expect(mark.querySelector('.anat-contact-ring')).toHaveAttribute('cy', '151')
    // The last thing drawn, so no part or label covers it.
    expect(mark.parentElement!.lastElementChild).toBe(mark)

    const edge = renderDiagram({ contact: { kind: 'edge', from: [88, 157], to: [122, 155] } })
    expect(edge.querySelector('[data-contact="edge"] .anat-contact-line')).toHaveAttribute('d', 'M88 157 L122 155')

    const flow = renderDiagram({ contact: { kind: 'flow', path: [[201, 296], [201, 176], [24, 169]] } })
    expect(flow.querySelector('[data-contact="flow"] .anat-contact-line')).toHaveAttribute('d', 'M201 296 L201 176 L24 169')
    // The breath leaves through the lips: an arrowhead at the end of the path.
    expect(flow.querySelector('[data-contact="flow"] .anat-contact-dot')?.getAttribute('d')).toMatch(/^M24 169 /)
  })

  it('knows which points fall inside its viewBox', () => {
    expect(inDiagramView([0, 150])).toBe(true)
    expect(inDiagramView([-110, 150])).toBe(false)
    expect(inDiagramView([380, 150])).toBe(false)
    expect(inDiagramView([100, 5])).toBe(false)
    expect(inDiagramView([100, 330])).toBe(false)
  })
})
