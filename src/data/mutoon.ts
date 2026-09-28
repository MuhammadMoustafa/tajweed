import mutoon from './mutoon.json'
import type { MatnId } from '../mutoon/types'

export interface MatnLine {
  n: number
  sadr: string
  ajuz: string
}

interface MatnSection {
  heading?: string
  lines: MatnLine[]
}

interface MatnText {
  url: string
  title: string
  author: string
  sections: MatnSection[]
}

const TEXTS = (mutoon as { texts: Record<MatnId, MatnText> }).texts

export const MUTOON_SOURCE = { publisher: mutoon.publisher, fetchedAt: mutoon.fetchedAt }

/** Poem-level metadata (url, title, author) — never the line text itself. */
export function getMatnMeta(text: MatnId): { url: string; title: string; author: string } {
  const { url, title, author } = TEXTS[text]
  return { url, title, author }
}

/** Total number of lines in `text`, for validating a lesson's `from`/`to` refs. */
export function matnLineCount(text: MatnId): number {
  return TEXTS[text].sections.reduce((n, s) => n + s.lines.length, 0)
}

/**
 * Lines `from`..`to` (inclusive; `to` defaults to `from`), plus the section heading in force at
 * `from` (the heading of the last section that starts at or before it). Returns an empty `lines`
 * array if the range is out of bounds; lessons.test.ts checks every lesson ref is in range.
 */
export function getMatnLines(text: MatnId, from: number, to: number = from): { heading?: string; lines: MatnLine[] } {
  const sections = TEXTS[text].sections
  const lines = sections.flatMap((s) => s.lines).filter((l) => l.n >= from && l.n <= to)
  const heading = sections.find((s) => s.lines.some((l) => l.n === from))?.heading

  return { heading, lines }
}
