import { describe, expect, it } from 'vitest'
import { makhrajOfLetter } from '../animations/mouth/makharij'
import { LETTER_SIFAT, OPPOSITE_SIFAT, SIFAT, SINGLE_SIFAT, sifatOfLetter } from '../animations/mouth/sifat'
import { LETTER_WORDS } from '../animations/words'
import { getWord, splitWordKey } from '../data/quran'
import { LETTER_NAMES, writesLetter, type ArabicLetter } from '../tajweed/letters'
import { findLetterCard, LETTER_CARDS, letterWord, splitAtLetter } from './letters'

const LETTERS = Object.keys(LETTER_NAMES) as ArabicLetter[]

describe('letter cards (src/letters/letters.ts)', () => {
  it('has one card per letter of the makharij data, in alphabetical order, with a stable id', () => {
    expect(LETTER_CARDS.map((c) => c.letter)).toEqual(LETTERS)
    for (const letter of LETTERS) expect(makhrajOfLetter(letter).letters.some((l) => l.letter === letter)).toBe(true)
    const ids = LETTER_CARDS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const card of LETTER_CARDS) {
      expect(card.id).toMatch(/^[a-z]+$/)
      expect(findLetterCard(card.id)).toBe(card)
    }
  })

  it.each(LETTER_CARDS.map((c) => [c.id, c] as const))('%s: tip in both languages', (_id, card) => {
    expect(card.tip.ar.trim()).not.toBe('')
    expect(card.tip.en.trim()).not.toBe('')
    expect(card.tip.en).not.toMatch(/[؀-ۿ]/)
  })

  it.each(LETTER_CARDS.map((c) => [c.id, c] as const))('%s: its word (from the data) holds the letter, sakin unless alif', (_id, card) => {
    const key = letterWord(card)
    expect(key).toBe(LETTER_WORDS[card.letter])
    const surah = splitWordKey(key).verseKey.split(':').map(Number)[0]
    expect(surah === 1 || surah >= 58, `${key}: al-Fatiha, Juz ʿAmma or surahs 58–77`).toBe(true)
    const text = getWord(key)?.text
    expect(text, `${key}: run npm run fetch-quran`).toBeDefined()
    const split = splitAtLetter(text!, card.letter)
    expect(split, `${key} does not hold ${card.letter}`).toBeDefined()
    expect(writesLetter(split!.at, card.letter)).toBe(true)
    expect(split!.before + split!.at + split!.after).toBe(text)
    expect(split!.sakin).toBe(card.letter !== 'ا')
  })

  it.each(LETTERS)('%s: listed qualities match the sifat data', (letter) => {
    const { opposites, singles } = sifatOfLetter(letter)
    expect(opposites).toHaveLength(OPPOSITE_SIFAT.length)
    opposites.forEach((id, i) => expect(OPPOSITE_SIFAT[i]).toContain(id))
    for (const id of singles) expect(SINGLE_SIFAT).toContain(id)
    expect([...opposites, ...singles]).toEqual(LETTER_SIFAT[letter])
    for (const id of [...opposites, ...singles]) {
      expect(SIFAT[id].brief.ar.trim()).not.toBe('')
      expect(SIFAT[id].brief.en.trim()).not.toBe('')
    }
  })
})
