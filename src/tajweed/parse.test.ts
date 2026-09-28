import { describe, expect, it } from 'vitest'
import { parseTajweed } from './parse'

describe('parseTajweed', () => {
  it('splits rule-tagged letters and extracts the ayah number', () => {
    const markup =
      'لَمْ يَلِ<tajweed class=qalaqah>دْ</tajweed> وَلَمْ يُولَ<tajweed class=qalaqah>دْ</tajweed> <span class=end>٣</span>'
    expect(parseTajweed(markup)).toEqual({
      segments: [
        { text: 'لَمْ يَلِ' },
        { text: 'دْ', rule: 'qalaqah' },
        { text: ' وَلَمْ يُولَ' },
        { text: 'دْ', rule: 'qalaqah' },
      ],
      ayahNumber: '٣',
    })
  })

  it('gives nested tags the innermost rule and resumes the outer one after', () => {
    const markup = 'تَعْتَد<tajweed class=madda_obligatory>ُو<tajweed class=slnt>ا</tajweed>ٓ</tajweed>'
    expect(parseTajweed(markup).segments).toEqual([
      { text: 'تَعْتَد' },
      { text: 'ُو', rule: 'madda_obligatory' },
      { text: 'ا', rule: 'slnt' },
      { text: 'ٓ', rule: 'madda_obligatory' },
    ])
  })

  it('keeps text of unknown classes uncolored without losing it', () => {
    expect(parseTajweed('أ<tajweed class=future_rule>ب</tajweed>ت').segments).toEqual([{ text: 'أبت' }])
  })
})
