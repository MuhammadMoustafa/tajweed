import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { readFileSync } from 'node:fs'
import { LOCALES, type Bilingual } from '../i18n/bilingual'
import { ui } from '../i18n/ui'
import { applyMarks } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import { CUSTOM_RULES, TAJWEED_RULES } from '../tajweed/rules'
import { LESSONS } from '.'
import type { QuizChoiceQuestion, QuizTapQuestion } from './types'

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

    it.each(lesson.examples.map((e) => [e.verseKey, e] as const))(
      'example %s is in quran.json (run `npm run fetch-quran`), has marks in range, and shows a focus rule',
      (key, example) => {
        const markup = getVerseMarkup(key)
        expect(markup).toBeDefined()
        const parsed = parseTajweed(markup!)
        // Throws loudly if a mark's word/letter is out of range for this verse.
        const segments = example.marks?.length ? applyMarks(parsed.segments, example.marks) : parsed.segments
        const rules = segments.map((s) => s.rule)
        expect(lesson.focusRules.some((r) => rules.includes(r))).toBe(true)
      },
    )

    it('quiz questions are written in both languages', () => {
      lesson.quiz?.forEach((q, i) => {
        expectBothLanguages(q.prompt, `${id} quiz[${i}].prompt`)
        if (q.kind === 'choice') {
          q.options.forEach((o, oi) => expectBothLanguages(o, `${id} quiz[${i}].options[${oi}]`))
          if (q.explanation) expectBothLanguages(q.explanation, `${id} quiz[${i}].explanation`)
        }
      })
    })

    it.each((lesson.quiz ?? []).filter((q): q is QuizTapQuestion => q.kind === 'tap'))(
      'tap question verse is in quran.json and contains its rule',
      (q) => {
        const markup = getVerseMarkup(q.verseKey)
        expect(markup).toBeDefined()
        const rules = parseTajweed(markup!).segments.map((s) => s.rule)
        expect(rules).toContain(q.rule)
      },
    )

    it.each((lesson.quiz ?? []).filter((q): q is QuizChoiceQuestion => q.kind === 'choice'))(
      'choice question correct index is in range',
      (q) => {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(q.options.length)
      },
    )
  })
})

describe('ui strings', () => {
  it.each(Object.entries(ui))('%s is written in both languages', (key, text) => expectBothLanguages(text, key))
})

describe('tajweed colors', () => {
  const css = readFileSync('src/styles.css', 'utf8')
  const rules = [...Object.values(TAJWEED_RULES), ...Object.values(CUSTOM_RULES)]
  it.each(rules.map((r) => [r.id, r.color]))('%s uses a defined color --tj-%s', (_, color) => {
    // Once in the light block and once in the dark block.
    expect(css.split(`--tj-${color}:`).length - 1).toBe(2)
  })
})
