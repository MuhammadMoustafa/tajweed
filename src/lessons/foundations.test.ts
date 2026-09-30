import { describe, expect, it } from 'vitest'
import { ANIMATIONS } from '../animations'
import { foundations } from './foundations'
import { foundationsBasmala } from './foundations-basmala'
import { foundationsHarakat } from './foundations-harakat'
import { foundationsShaddahTanween } from './foundations-shaddah-tanween'
import { findLesson, LESSONS } from './index'
import { VOWELS } from './vowels'
import { LETTER_CARDS } from '../letters/letters'
import { LETTER_SIFAT } from '../animations/mouth/sifat'

const UNIT = [foundations, foundationsHarakat, foundationsShaddahTanween, foundationsBasmala]

describe('foundations lessons', () => {
  it('are four lessons in the first unit, orders 1 to 1.3, with no focus rule; the first keeps its id', () => {
    expect(findLesson('foundations')).toBe(foundations)
    expect(UNIT.map((l) => l.order)).toEqual([1, 1.1, 1.2, 1.3])
    expect(LESSONS.filter((l) => l.unit === 'foundations')).toEqual(UNIT)
    for (const l of UNIT) expect(l.focusRules).toEqual([])
  })

  it('give each visual section its own clip', () => {
    const ids = (l: (typeof UNIT)[number]) => l.sections.flatMap((s) => (s.animation ? [s.animation] : []))
    expect(ids(foundationsHarakat)).toEqual(['foundations-harakat', 'foundations-sukun'])
    expect(ids(foundationsShaddahTanween)).toEqual(['foundations-shadda', 'foundations-tanween'])
    for (const id of [...ids(foundationsHarakat), ...ids(foundationsShaddahTanween)])
      expect(ANIMATIONS[id as keyof typeof ANIMATIONS].steps.length).toBeGreaterThan(0)
  })

  it('uses the basmala, verse 1:1, as the basmala lesson example', () => {
    expect(foundationsBasmala.examples[0].verseKey).toBe('1:1')
  })

  // The app counts 29 letters, hamzah and alif apart (maintainer, 2026-09-29): the lesson, its quiz,
  // the letters page and the sifat data must agree.
  it('counts the letters as the letters page and the sifat data do', () => {
    const count = LETTER_CARDS.length
    expect(count).toBe(29)
    expect(Object.keys(LETTER_SIFAT)).toHaveLength(count)
    expect(foundations.summary.en).toContain(String(count))
    expect(foundations.sections[0].body.en).toContain(`has ${count} letters`)
    const question = foundations.quiz!.find((q) => q.kind === 'choice' && q.options.some((o) => o.en === String(count)))
    expect(question?.kind === 'choice' && question.options[question.correctIndex].en).toBe(String(count))
  })

  it('name both poems, neither covering the basics', () => {
    for (const l of UNIT) expect(l.mutoon).toEqual({ tuhfa: 'not-covered', jazariyya: 'not-covered' })
  })

  it('teaches each short vowel by mouth, syllable, word and IPA, in both languages', () => {
    const sec = foundationsHarakat.sections[0].body
    for (const v of VOWELS)
      for (const lang of ['ar', 'en'] as const)
        for (const part of [v.syllable, v.word, v.ipa, v.mouthDoes[lang]]) expect(sec[lang]).toContain(part)
    expect(sec.en).toContain('approximate')
  })

  it('never gives a vowel as a bare Latin letter: Arabic quiz options carry no Latin letters', () => {
    for (const q of foundationsHarakat.quiz!)
      if (q.kind === 'choice') for (const o of q.options) expect(o.ar).not.toMatch(/[A-Za-z]/)
  })
})
