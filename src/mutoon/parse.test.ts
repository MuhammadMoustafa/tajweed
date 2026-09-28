import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseMutoonHtml } from './parse'

// A trimmed copy (title + first 3 sections, 26 lines) of the real page at
// https://www.alukah.net/sharia/0/58168/ (al-Muqaddimah al-Jazariyyah), saved verbatim.
const FIXTURE = readFileSync('src/test/fixtures/mutoon-jazariyya-sample.html', 'utf8')

describe('parseMutoonHtml', () => {
  it('extracts the title, section headings, and numbered lines in order', () => {
    const parsed = parseMutoonHtml(FIXTURE, 26)
    expect(parsed.title).toBe('متن الجزرية للإمام ابن الجزري - رحمه الله -')
    expect(parsed.sections.map((s) => [s.heading, s.lines.length])).toEqual([
      ['المقدمة', 8],
      ['باب مخارج الحروف', 11],
      ['باب الصفات', 7],
    ])
  })

  it('numbers lines by position, not by the printed digit', () => {
    // Line 1 of the fixture happens to be printed correctly; this just anchors n === position.
    const parsed = parseMutoonHtml(FIXTURE, 26)
    const all = parsed.sections.flatMap((s) => s.lines)
    expect(all.map((l) => l.n)).toEqual(Array.from({ length: 26 }, (_, i) => i + 1))
  })

  it('keeps parenthetical text verbatim but strips a footnote marker', () => {
    const parsed = parseMutoonHtml(FIXTURE, 26)
    const line23 = parsed.sections.flatMap((s) => s.lines).find((l) => l.n === 23)
    expect(line23?.sadr).toBe('وصاد ضاد طاء ظاء مطبقه')
    // The source wraps a word in parens with a footnote number right after it, as an HTML link
    // (<a name="_ftnref2">...<strong>[2]</strong>...</a>): the parens stay, the link's text doesn't.
    expect(line23?.ajuz).toContain('(')
    expect(line23?.ajuz).toContain(')')
    expect(line23?.ajuz).not.toContain('[2]')
    expect(line23?.ajuz).not.toContain('<')
    expect(line23?.ajuz.endsWith('الحروف المذلقه')).toBe(true)
  })

  it('finds the qalqalah letters line with its parenthetical gathering-word kept', () => {
    const parsed = parseMutoonHtml(FIXTURE, 26)
    const line24 = parsed.sections.flatMap((s) => s.lines).find((l) => l.n === 24)
    expect(line24?.ajuz).toBe('قلقلة (قطب جد) واللين')
  })

  it('throws when the numbered-line count does not match what was expected', () => {
    expect(() => parseMutoonHtml(FIXTURE, 61)).toThrow(/expected 61/)
  })

  it('throws when the article body cannot be found', () => {
    expect(() => parseMutoonHtml('<html><body>no article here</body></html>', 61)).toThrow(/article body/)
  })
})
