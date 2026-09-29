import { describe, expect, it } from 'vitest'
import { LETTER_NAMES, type ArabicLetter } from '../../tajweed/letters'
import { makhrajOfLetter } from './makharij'
import { LETTER_SIFAT, lettersOfPhrase, lettersWith, OPPOSITE_SIFAT, SIFAT, SINGLE_SIFAT, type SifahId } from './sifat'

const LETTERS = Object.keys(LETTER_NAMES) as ArabicLetter[]

/**
 * Each quality's letters, written out independently of the data (al-Muqaddimah al-Jazariyyah,
 * lines 20–26, and the standard tajweed tables). A quality's opposite holds every other letter.
 */
const EXPECTED: Partial<Record<SifahId, string>> = {
  hams: 'ف ح ث ه ش خ ص س ك ت',
  shiddah: 'ء ج د ق ط ب ك ت',
  tawassut: 'ل ن ع م ر',
  istila: 'خ ص ض غ ط ق ظ',
  itbaq: 'ص ض ط ظ',
  idhlaq: 'ف ر م ن ل ب',
  safir: 'ص ز س',
  qalqalah: 'ق ط ب ج د',
  lin: 'و ي',
  inhiraf: 'ل ر',
  takrir: 'ر',
  tafashshi: 'ش',
  istitalah: 'ض',
}
const OPPOSITE_OF: Partial<Record<SifahId, SifahId[]>> = {
  jahr: ['hams'],
  rakhawah: ['shiddah', 'tawassut'],
  istifal: ['istila'],
  infitah: ['itbaq'],
  ismat: ['idhlaq'],
}

const expectedLetters = (id: SifahId): string[] => {
  const others = OPPOSITE_OF[id]
  if (others) return LETTERS.filter((l) => !others.some((o) => EXPECTED[o]!.split(' ').includes(l))).sort()
  return EXPECTED[id]!.split(' ').sort()
}

const ALL_SIFAT: SifahId[] = [...OPPOSITE_SIFAT.flat(), ...SINGLE_SIFAT]

describe('sifat al-huruf', () => {
  it('are 17 on Ibn al-Jazari’s count: five pairs of opposites (tawassut between shiddah and rakhawah) and seven singles', () => {
    expect(OPPOSITE_SIFAT.map((group) => group.length)).toEqual([2, 3, 2, 2, 2])
    expect(SINGLE_SIFAT).toHaveLength(7)
    expect(ALL_SIFAT.filter((id) => id !== 'tawassut')).toHaveLength(17)
    expect(new Set(ALL_SIFAT).size).toBe(ALL_SIFAT.length)
    expect(Object.keys(SIFAT).sort()).toEqual([...ALL_SIFAT].sort())
  })

  it('cover all 29 letters in the table', () => {
    expect(Object.keys(LETTER_SIFAT).sort()).toEqual([...LETTERS].sort())
  })

  it.each(LETTERS)('%s has exactly one quality from each opposite group, then only single qualities', (letter) => {
    const qualities = LETTER_SIFAT[letter]
    for (const group of OPPOSITE_SIFAT) {
      expect(qualities.filter((q) => group.includes(q)), `${letter}: ${group.join('/')}`).toHaveLength(1)
    }
    expect(qualities.slice(0, OPPOSITE_SIFAT.length).map((q) => OPPOSITE_SIFAT.findIndex((g) => g.includes(q)))).toEqual([
      0, 1, 2, 3, 4,
    ])
    expect(qualities.slice(OPPOSITE_SIFAT.length).every((q) => SINGLE_SIFAT.includes(q))).toBe(true)
  })

  it.each(ALL_SIFAT)('%s holds exactly its letters', (id) => {
    expect([...lettersWith(id)].sort()).toEqual(expectedLetters(id))
    expect(LETTERS.filter((l) => LETTER_SIFAT[l].includes(id)).sort()).toEqual(expectedLetters(id))
  })

  it('counts each group as the classical texts do', () => {
    const counts = Object.fromEntries(ALL_SIFAT.map((id) => [id, lettersWith(id).length]))
    expect(counts).toMatchObject({
      hams: 10,
      jahr: 19,
      shiddah: 8,
      tawassut: 5,
      rakhawah: 16,
      istila: 7,
      istifal: 22,
      itbaq: 4,
      infitah: 25,
      idhlaq: 6,
      ismat: 23,
    })
  })

  it('reads a mnemonic’s letters in order, the hamzah included', () => {
    expect(lettersOfPhrase(SIFAT.shiddah.mnemonic!)).toEqual(['ء', 'ج', 'د', 'ق', 'ط', 'ب', 'ك', 'ت'])
    expect(lettersOfPhrase(SIFAT.hams.mnemonic!)).toEqual(['ف', 'ح', 'ث', 'ه', 'ش', 'خ', 'ص', 'س', 'ك', 'ت'])
  })

  it.each(ALL_SIFAT)('%s is named and explained in both languages', (id) => {
    for (const text of [SIFAT[id].name, SIFAT[id].meaning]) {
      expect(text.ar.trim()).not.toBe('')
      expect(text.en.trim()).not.toBe('')
    }
  })
})

describe('makhrajOfLetter', () => {
  it('takes a letter’s consonant makhraj, not the jawf or the khayshum', () => {
    expect(makhrajOfLetter('و').area).toBe('shafatan')
    expect(makhrajOfLetter('ي').regions).toContain('tongue-middle')
    expect(makhrajOfLetter('ن').area).toBe('lisan')
    expect(makhrajOfLetter('م').area).toBe('shafatan')
    expect(makhrajOfLetter('ا').area).toBe('jawf')
    expect(makhrajOfLetter('ق').regions).toEqual(['tongue-back', 'palate'])
  })
})
