import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { readFileSync } from 'node:fs'
import { LOCALES, type Bilingual } from '../i18n/bilingual'
import { ui } from '../i18n/ui'
import { parseTajweed } from '../tajweed/parse'
import { TAJWEED_RULES } from '../tajweed/rules'
import { LESSONS } from '.'

const expectBothLanguages = (text: Bilingual, where: string) => {
  for (const locale of LOCALES) expect(text[locale].trim(), `${where} [${locale}]`).not.toBe('')
}

describe('lessons', () => {
  it('have unique ids and orders', () => {
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(LESSONS.length)
    expect(new Set(LESSONS.map((l) => l.order)).size).toBe(LESSONS.length)
  })

  describe.each(LESSONS.map((l) => [l.id, l] as const))('%s', (id, lesson) => {
    it('is written in both Arabic and English', () => {
      expectBothLanguages(lesson.title, `${id}.title`)
      expectBothLanguages(lesson.summary, `${id}.summary`)
      lesson.sections.forEach((s, i) => {
        if (s.heading) expectBothLanguages(s.heading, `${id}.sections[${i}].heading`)
        expectBothLanguages(s.body, `${id}.sections[${i}].body`)
      })
      lesson.examples.forEach((e) => expectBothLanguages(e.note, `${id} example ${e.verseKey}`))
    })

    it.each(lesson.examples.map((e) => e.verseKey))(
      'example %s is in quran.json (run `npm run fetch-quran`) and shows a focus rule',
      (key) => {
        const markup = getVerseMarkup(key)
        expect(markup).toBeDefined()
        const rules = parseTajweed(markup!).segments.map((s) => s.rule)
        expect(lesson.focusRules.some((r) => rules.includes(r))).toBe(true)
      },
    )
  })
})

describe('ui strings', () => {
  it.each(Object.entries(ui))('%s is written in both languages', (key, text) => expectBothLanguages(text, key))
})

describe('tajweed colors', () => {
  const css = readFileSync('src/styles.css', 'utf8')
  it.each(Object.values(TAJWEED_RULES).map((r) => [r.id, r.color]))('%s uses a defined color --tj-%s', (_, color) => {
    // Once in the light block and once in the dark block.
    expect(css.split(`--tj-${color}:`).length - 1).toBe(2)
  })
})
