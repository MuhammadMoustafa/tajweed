import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { COUNT_MS, MADD_READY_MS, MADD_STOP_MS, MaddBar } from './MaddBar'
import { maddCountingSteps } from './maddCounting'
import type { ClipStep } from './player/clip'

afterEach(() => localStorage.clear())

const draw = (node: ReactNode) => {
  localStorage.setItem('tajweed.locale', 'en')
  return render(<LocaleProvider>{node}</LocaleProvider>).container
}
const drawStep = (step: ClipStep, progress: number) => draw(step.render(progress))

describe('MaddBar after/cause (src/animations/MaddBar.tsx)', () => {
  it('shows the letter after the madd letter in plain text, and points a caret at the cause', () => {
    const container = draw(<MaddBar counts={4} before="بَ" letter="ا" after="نْ" cause="after" />)
    expect(container.querySelector('.madd-bar-after')).toHaveTextContent('نْ')
    expect(container.querySelector('.madd-bar-before')).toHaveTextContent('بَ')
    expect(container.querySelector('[data-cause="after"]')).not.toBeNull()
    expect(container.querySelector('.madd-bar-arrow')).not.toBeNull()
  })

  it('draws no cause caret when the cause text is missing, and nothing new by default', () => {
    expect(draw(<MaddBar counts={2} before="بَ" letter="ا" cause="after" />).querySelector('.madd-bar-cause')).toBeNull()
    const plain = draw(<MaddBar counts={2} before="بَ" letter="ا" />)
    expect(plain.querySelector('.madd-bar-after')).toBeNull()
    expect(plain.querySelector('.madd-bar-cause')).toBeNull()
  })
})

describe('maddCountingSteps (src/animations/maddCounting.tsx)', () => {
  const pass = {
    counts: 4 as const,
    bar: { before: 'بَ', letter: 'ا', after: 'نْ', cause: 'after' as const, token: 'madd-permissible' as const },
    ready: { ar: 'استعد', en: 'Get ready' },
    stop: { ar: 'قف', en: 'Stop' },
  }

  it('builds get ready, one step per count, and stop, at the shared madd pace', () => {
    const steps = maddCountingSteps(pass)
    expect(steps.map((s) => s.duration)).toEqual([MADD_READY_MS, COUNT_MS, COUNT_MS, COUNT_MS, COUNT_MS, MADD_STOP_MS])
    expect(steps[1].caption).toEqual({ ar: 'الحركة الأولى.', en: 'Count one.' })
    expect(steps[4].caption).toEqual({ ar: 'الحركة الرابعة — علامة النهاية.', en: 'Count four — the end marker.' })
    expect(steps.map((s) => s.label?.en)).toEqual(['Get ready', 'Count 1', 'Count 2', 'Count 3', 'Count 4', 'Stop'])
    expect(steps[2].label?.ar).toBe('الحركة ٢')
  })

  it('labels every step of the pass the same when given one label', () => {
    const label = { ar: 'توسط', en: 'Tawassut' }
    expect(maddCountingSteps({ ...pass, label }).every((s) => s.label === label)).toBe(true)
  })

  it('fills the bar beat by beat to the end marker, then stops', () => {
    const steps = maddCountingSteps(pass)
    const ready = drawStep(steps[0], 1)
    expect(ready.querySelector('.madd-bar-fill')).toHaveAttribute('width', '0')
    expect(ready.querySelector('[data-marker="end"]')).toHaveAttribute('data-beat', '4')
    expect(ready.querySelector('[data-cause="after"]')).not.toBeNull()

    const second = drawStep(steps[2], 1)
    expect(second.querySelector('.madd-bar-fill')).toHaveAttribute('width', '100') // 2/4 * 200
    expect(second.querySelector('.madd-bar-pulse')).toHaveAttribute('data-beat', '2')

    const stop = drawStep(steps[5], 0)
    expect(stop.querySelector('.madd-bar-fill')).toHaveAttribute('width', '200')
    expect(stop.querySelector('[data-stopped]')).not.toBeNull()
    expect(stop.querySelector('.madd-bar-pulse')).toBeNull()
    expect(stop.querySelector('.madd-bar-fill')).toHaveAttribute('fill', 'var(--tj-madd-permissible)')
  })
})
