import { describe, expect, it } from 'vitest'
import { ANIMATIONS } from '../animations'
import type { Bilingual } from '../i18n/bilingual'
import { LESSONS } from './index'
import { foundationsShaddahTanween } from './foundations-shaddah-tanween'
import { naturalMadd } from './natural-madd'
import { SOUNDS, VOWELS } from './vowels'

/** Every `{ ar, en }` string pair in a lesson or clip (prose, notes, quiz, captions), wherever it sits. */
function bilinguals(value: unknown, found: Bilingual[] = []): Bilingual[] {
  if (Array.isArray(value)) value.forEach((v) => bilinguals(v, found))
  else if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>
    if (typeof o.ar === 'string' && typeof o.en === 'string') found.push(o as unknown as Bilingual)
    else Object.values(o).forEach((v) => bilinguals(v, found))
  }
  return found
}

/** Latin letters left once IPA (between slashes) is taken out. */
const latinOutsideIpa = (text: string) => text.replace(/\/[^/\s]+\//g, '').match(/[A-Za-z]+/g) ?? []

describe('sounds are given as an Arabic syllable or word plus IPA, never as Latin letters (T26)', () => {
  it.each(LESSONS.map((l) => [l.id, l] as const))('no Arabic text in %s (prose, notes, quiz) has Latin letters', (_, lesson) => {
    for (const { ar } of bilinguals(lesson)) expect(latinOutsideIpa(ar), ar).toEqual([])
  })

  it('no Arabic clip caption or step label has Latin letters', () => {
    for (const { ar } of bilinguals(Object.values(ANIMATIONS))) expect(latinOutsideIpa(ar), ar).toEqual([])
  })

  it('the tanween lesson gives each tanween as its syllable and IPA, in its text and its quiz', () => {
    const [section] = foundationsShaddahTanween.sections.filter((s) => s.heading?.en === 'Tanween')
    const quiz = foundationsShaddahTanween.quiz!.find((q) => q.prompt.en.includes('tanween kasr'))!
    for (const s of [SOUNDS.fathatan, SOUNDS.dammatan, SOUNDS.kasratan]) {
      for (const text of [section.body.ar, section.body.en]) expect(text).toContain(`${s.syllable} ${s.ipa}`)
      expect(quiz.kind === 'choice' && quiz.options.some((o) => o.ar.includes(s.syllable) && o.en.includes(s.ipa))).toBe(true)
    }
  })

  it("the madd letters' section gives each long vowel as its syllable, IPA and word, in both languages", () => {
    const section = naturalMadd.sections.find((s) => s.heading?.en === 'The madd letters')!
    for (const { long } of VOWELS) {
      for (const text of [section.body.ar, section.body.en]) {
        for (const part of [long.syllable, long.ipa, long.word]) expect(text).toContain(part)
      }
      expect(section.body.en).toContain(long.englishLike)
    }
  })
})
