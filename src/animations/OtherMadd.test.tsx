import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { COUNT_MS, MADD_READY_MS, MADD_STOP_MS } from './MaddBar'
import { CAUSE_MS, maddArid, maddBadal, maddIwad, maddLeen, maddSilah } from './OtherMadd'
import { labelSpans, type Clip } from './player/clip'

afterEach(() => localStorage.clear())

const drawStep = (clip: Clip, index: number, progress = 1, locale: 'ar' | 'en' = 'en') => {
  localStorage.setItem('tajweed.locale', locale)
  return render(<LocaleProvider>{clip.steps[index].render(progress)}</LocaleProvider>).container
}

const texts = (container: Element) => [...container.querySelectorAll('text')].map((t) => t.textContent)

/** A pass of `counts` is get ready + one step per count + stop. */
const pass = (counts: number) => [MADD_READY_MS, ...Array<number>(counts).fill(COUNT_MS), MADD_STOP_MS]

/** Index of the stop step ending each pass, given the durations. */
const stopSteps = (clip: Clip) => clip.steps.flatMap((s, i) => (s.caption?.en.startsWith('Stop') ? [i] : []))

describe.each([
  ['madd-arid', maddArid, 'نْ'],
  ['madd-leen', maddLeen, 'تْ'],
])('%s clip (src/animations/OtherMadd.tsx): the cause, then 2, 4 and 6 as choices', (_id, clip, stopped) => {
  it('points at the stopped letter after the madd letter first, then counts one pass per length', () => {
    expect(clip.steps.map((s) => s.duration)).toEqual([CAUSE_MS, ...pass(2), ...pass(4), ...pass(6)])
    const cause = drawStep(clip, 0)
    expect(cause.querySelector('[data-cause="after"]')).not.toBeNull()
    expect(cause.querySelector('.madd-bar-after')).toHaveTextContent(stopped)
    expect(cause.querySelector('.madd-bar-fill')).toHaveAttribute('width', '0')
  })

  it('shows one timeline label per choice, in order', () => {
    expect(labelSpans(clip).map((s) => s.label.en)).toEqual(['The cause', 'Qasr: 2 counts', 'Tawassut: 4 counts', 'Tul: 6 counts'])
    expect(labelSpans(clip).map((s) => s.label.ar)).toEqual(['السبب', 'القصر: حركتان', 'التوسط: ٤ حركات', 'الطول: ٦ حركات'])
  })

  it('ends each pass with a full, stopped bar at its end marker, in the permissible-madd color', () => {
    const stops = stopSteps(clip)
    expect(stops).toHaveLength(3)
    stops.forEach((index, i) => {
      const frame = drawStep(clip, index)
      expect(frame.querySelector('[data-marker="end"]')).toHaveAttribute('data-beat', String([2, 4, 6][i]))
      expect(frame.querySelector('.madd-bar-fill')).toHaveAttribute('width', '200')
      expect(frame.querySelector('.madd-bar-fill')).toHaveAttribute('fill', 'var(--tj-madd-permissible)')
      expect(frame.querySelector('[data-stopped]')).not.toBeNull()
    })
  })
})

describe('madd-badal clip', () => {
  it('points at the hamza before the madd letter, then counts 2', () => {
    expect(maddBadal.steps.map((s) => s.duration)).toEqual([CAUSE_MS, ...pass(2)])
    const cause = drawStep(maddBadal, 0)
    expect(cause.querySelector('[data-cause="before"]')).not.toBeNull()
    expect(cause.querySelector('.madd-bar-before')).toHaveTextContent('ءَ')
    const stop = drawStep(maddBadal, maddBadal.steps.length - 1)
    expect(stop.querySelector('[data-marker="end"]')).toHaveAttribute('data-beat', '2')
  })
})

describe('madd-iwad clip', () => {
  it('shows the tanween with a silent alif while reading on, then an alif of 2 counts when stopping', () => {
    expect(maddIwad.steps.map((s) => s.duration)).toEqual([CAUSE_MS, ...pass(2)])
    const joined = drawStep(maddIwad, 0)
    expect(texts(joined)).toContain('بً')
    expect(joined.querySelector('.madd-bar-fill')).toHaveAttribute('fill', 'var(--tj-silent)')
    const stop = drawStep(maddIwad, maddIwad.steps.length - 1)
    expect(texts(stop)).toContain('بَ')
    expect(stop.querySelector('.madd-bar-fill')).toHaveAttribute('fill', 'var(--tj-madd-normal)')
    expect(stop.querySelector('[data-marker="end"]')).toHaveAttribute('data-beat', '2')
  })
})

describe('madd-silah clip', () => {
  it('counts sughra 2 before a moving letter, then kubra 4 or 5 before a hamza', () => {
    expect(maddSilah.steps.map((s) => s.duration)).toEqual([...pass(2), ...pass(4), ...pass(5)])
    expect(labelSpans(maddSilah).map((s) => s.label.en)).toEqual(['Sughra: 2 counts', 'Kubra: 4 counts', 'Kubra: 5 counts'])
    const [sughra, kubra4, kubra5] = stopSteps(maddSilah).map((index) => drawStep(maddSilah, index))
    expect(sughra.querySelector('.madd-bar-after')).toHaveTextContent('بَ')
    expect(sughra.querySelector('.madd-bar-fill')).toHaveAttribute('fill', 'var(--tj-madd-normal)')
    for (const [frame, counts] of [[kubra4, '4'], [kubra5, '5']] as const) {
      expect(frame.querySelector('.madd-bar-after')).toHaveTextContent('أَ')
      expect(frame.querySelector('[data-cause="after"]')).not.toBeNull()
      expect(frame.querySelector('[data-marker="end"]')).toHaveAttribute('data-beat', counts)
      expect(frame.querySelector('.madd-bar-fill')).toHaveAttribute('fill', 'var(--tj-madd-obligatory)')
    }
  })

  it('labels the passes in Arabic with Arabic-Indic digits', () => {
    expect(labelSpans(maddSilah).map((s) => s.label.ar)).toEqual(['الصغرى: حركتان', 'الكبرى: ٤ حركات', 'الكبرى: ٥ حركات'])
    const frame = drawStep(maddSilah, 0, 1, 'ar')
    expect(texts(frame)).toContain('بعدها متحرّك: صلة صغرى')
  })
})
