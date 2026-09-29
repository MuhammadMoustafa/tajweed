import { describe, expect, it } from 'vitest'
import { getVerseMarkup } from '../data/quran'
import { matnLineCount } from '../data/mutoon'
import { readFileSync } from 'node:fs'
import { LOCALES, type Bilingual } from '../i18n/bilingual'
import { ui } from '../i18n/ui'
import { applyMarks } from '../tajweed/marks'
import { parseTajweed } from '../tajweed/parse'
import { CUSTOM_RULES, TAJWEED_RULES } from '../tajweed/rules'
import { LESSONS } from '.'
import { tapCorrectIndices } from './quiz'
import type { MatnId } from '../mutoon/types'
import type { QuizChoiceQuestion, QuizTapQuestion } from './types'

const MATN_IDS: MatnId[] = ['tuhfa', 'jazariyya']

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
      for (const text of MATN_IDS) {
        const coverage = lesson.mutoon?.[text]
        if (!coverage || coverage === 'not-covered') continue
        coverage.forEach((p, i) => expectBothLanguages(p.note, `${id}.mutoon.${text}[${i}].note`))
      }
    })

    // A lesson with a matn panel always shows both poems (one section each, 'not-covered' when a
    // poem has no section on the rule) so a reader never sees just one poem without the other
    // having been considered.
    it('mutoon, if present, has both tuhfa and jazariyya', () => {
      if (!lesson.mutoon) return
      for (const text of MATN_IDS) expect(lesson.mutoon, `${id}.mutoon.${text}`).toHaveProperty(text)
    })

    it.each(MATN_IDS.flatMap((text) => (lesson.mutoon?.[text] === 'not-covered' ? [] : (lesson.mutoon?.[text] ?? []).map((p) => [text, p] as const))))(
      'mutoon passage in %s %o is in range',
      (text, p) => {
        const count = matnLineCount(text)
        expect(p.from).toBeGreaterThanOrEqual(1)
        expect(p.from).toBeLessThanOrEqual(count)
        if (p.to !== undefined) {
          expect(p.to).toBeGreaterThanOrEqual(p.from)
          expect(p.to).toBeLessThanOrEqual(count)
        }
      },
    )

    it('mutoon passages within the same poem do not overlap', () => {
      for (const text of MATN_IDS) {
        const coverage = lesson.mutoon?.[text]
        if (!coverage || coverage === 'not-covered') continue
        const sorted = coverage.map((p) => ({ from: p.from, to: p.to ?? p.from })).sort((a, b) => a.from - b.from)
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i].from, `${id}.mutoon.${text} ranges overlap: ${JSON.stringify(sorted)}`).toBeGreaterThan(sorted[i - 1].to)
        }
      }
    })

    it.each(lesson.examples.map((e) => [e.verseKey, e] as const))(
      'example %s is in quran.json (run `npm run fetch-quran`), has marks in range, and shows a focus rule if the lesson has any',
      (key, example) => {
        const markup = getVerseMarkup(key)
        expect(markup).toBeDefined()
        const parsed = parseTajweed(markup!)
        // Throws loudly if a mark's word/letter is out of range for this verse.
        const segments = example.marks?.length ? applyMarks(parsed.segments, example.marks) : parsed.segments
        // A lesson without focus rules (e.g. makharij) shows its examples uncolored.
        if (lesson.focusRules.length === 0) return
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
      'tap question verse is in quran.json and yields at least one correct letter',
      (q) => {
        const markup = getVerseMarkup(q.verseKey)
        expect(markup).toBeDefined()
        // Covers custom-rule questions too: `marks` (if any) are applied before deriving letters.
        expect(tapCorrectIndices(markup!, q.rule, q.marks).length).toBeGreaterThan(0)
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

describe('hamzat-wasl lesson (L17)', () => {
  const lesson = LESSONS.find((l) => l.id === 'hamzat-wasl')!
  const rulesOf = (key: `${number}:${number}`) =>
    new Set(parseTajweed(getVerseMarkup(key)!).segments.map((s) => s.rule))

  it('is lesson 8.1 of the stopping unit, with a clip per teaching section', () => {
    expect(lesson.order).toBe(8.1)
    expect(lesson.unit).toBe('stopping')
    expect(lesson.animation).toBe('hamzat-wasl')
    expect(lesson.sections.map((s) => s.animation)).toEqual([undefined, 'hamzat-wasl-vowel', 'silent-letters'])
  })

  it('colors the wasl hamza and the silent alif in its examples', () => {
    expect(rulesOf('96:1').has('ham_wasl')).toBe(true)
    for (const key of ['2:208', '72:20', '83:30'] as const) expect(rulesOf(key).has('slnt')).toBe(true)
  })

  it('cites the Jazariyyah chapter on hamzat al-wasl and says Tuhfa has none', () => {
    expect(lesson.mutoon?.tuhfa).toBe('not-covered')
    expect(lesson.mutoon?.jazariyya).toMatchObject([{ from: 101, to: 103 }])
  })
})
