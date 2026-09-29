import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { getWord } from '../data/quran'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { iqlabMeem } from './IqlabMeem'
import { CLIP_WORDS } from './words'

afterEach(() => localStorage.clear())

const draw = (index: number, progress = 1) => {
  localStorage.setItem('tajweed.locale', 'en')
  return render(<LocaleProvider>{iqlabMeem.steps[index].render(progress)}</LocaleProvider>).container
}

describe('iqlab-meem clip (src/animations/IqlabMeem.tsx)', () => {
  it('points at the noon, then the meem it becomes, with the ba as the cause', () => {
    const noon = draw(0)
    expect(noon.querySelector('.madd-bar-arrow')).not.toBeNull()
    expect(noon.querySelector('[data-cause="after"]')).not.toBeNull()
    expect(noon.querySelector('[data-region="gums"]')).toHaveAttribute('data-lit', 'true')
    const meem = draw(1)
    expect(meem.querySelector('[data-region="lip-upper"]')).toHaveAttribute('data-lit', 'true')
    expect(meem.querySelector('[data-region="khayshum"]')).toHaveAttribute('data-lit', 'true')
    expect(meem.querySelector('.madd-bar-after')).not.toBeNull()
  })

  it('counts the ghunnah to two, then plays one Quran word', () => {
    const counted = draw(iqlabMeem.steps.length - 3)
    expect(counted.querySelector('.madd-bar-fill')).toHaveAttribute('width', '200')
    const last = iqlabMeem.steps.length - 1
    expect(iqlabMeem.steps[last].audio).toEqual({ word: CLIP_WORDS.iqlabAnbatna })
    expect(draw(last)).toHaveTextContent(getWord(CLIP_WORDS.iqlabAnbatna)!.text)
    expect(iqlabMeem.steps.filter((s) => s.audio)).toHaveLength(1)
  })
})
