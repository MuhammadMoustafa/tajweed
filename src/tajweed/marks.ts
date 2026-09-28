import { splitGraphemes } from './graphemes'
import type { TajweedSegment } from './parse'
import type { CustomRuleId, RuleId } from './rules'

/**
 * A hand-placed highlight for a tajweed point the API markup does not tag (izhar, lam
 * qamariyyah, tafkhim/tarqiq, waqf signs). Lives on `LessonExample.marks`.
 */
export interface Mark {
  /** 1-based index over the verse's words (split on spaces; the ayah number from `<span class=end>` is excluded). */
  word: number
  /** 1-based grapheme index within the word (via `Intl.Segmenter`, so a letter keeps its harakat). Omit to mark the whole word. */
  letter?: number
  rule: CustomRuleId
}

export interface MarkedSegment {
  text: string
  rule?: RuleId
}

interface Range {
  start: number
  end: number
}

interface Part extends Range {
  rule?: RuleId
}

/** Word ranges (character offsets into `text`) split on literal spaces, skipping empty runs. */
function wordRanges(text: string): Range[] {
  const ranges: Range[] = []
  let start = 0
  for (let i = 0; i <= text.length; i++) {
    if (i === text.length || text[i] === ' ') {
      if (i > start) ranges.push({ start, end: i })
      start = i + 1
    }
  }
  return ranges
}

/** Splits `part` around `[overlapStart, overlapEnd)` and tags the overlap, unless it is already ruled. */
function applyRangeToParts(parts: Part[], target: Range, rule: CustomRuleId): Part[] {
  const result: Part[] = []
  for (const part of parts) {
    const overlapStart = Math.max(part.start, target.start)
    const overlapEnd = Math.min(part.end, target.end)
    // No overlap, or the letters here already carry a rule (an API class, or an earlier mark) — API/earlier wins.
    if (overlapStart >= overlapEnd || part.rule !== undefined) {
      result.push(part)
      continue
    }
    if (part.start < overlapStart) result.push({ start: part.start, end: overlapStart, rule: undefined })
    result.push({ start: overlapStart, end: overlapEnd, rule })
    if (overlapEnd < part.end) result.push({ start: overlapEnd, end: part.end, rule: undefined })
  }
  return result
}

/**
 * Applies hand-placed marks to segments already produced by `parseTajweed`, splitting segments
 * as needed. The underlying text is never retyped — only sliced. Letters an API rule already
 * tags keep that rule: a mark never overwrites one.
 *
 * Throws when a mark's `word` or `letter` falls outside the verse.
 */
export function applyMarks(segments: readonly TajweedSegment[], marks: readonly Mark[]): MarkedSegment[] {
  const fullText = segments.map((s) => s.text).join('')

  let parts: Part[] = []
  let pos = 0
  for (const seg of segments) {
    parts.push({ start: pos, end: pos + seg.text.length, rule: seg.rule })
    pos += seg.text.length
  }

  if (marks.length > 0) {
    const words = wordRanges(fullText)

    for (const mark of marks) {
      const word = words[mark.word - 1]
      if (!word) {
        throw new Error(`Mark word ${mark.word} is out of range: the verse has ${words.length} word(s).`)
      }

      let target: Range = word
      if (mark.letter !== undefined) {
        const wordText = fullText.slice(word.start, word.end)
        const graphemes = splitGraphemes(wordText)
        const grapheme = graphemes[mark.letter - 1]
        if (!grapheme) {
          throw new Error(
            `Mark word ${mark.word} letter ${mark.letter} is out of range: the word has ${graphemes.length} letter(s).`,
          )
        }
        target = { start: word.start + grapheme.index, end: word.start + grapheme.index + grapheme.segment.length }
      }

      parts = applyRangeToParts(parts, target, mark.rule)
    }
  }

  const merged: Part[] = []
  for (const part of parts) {
    if (part.start === part.end) continue
    const prev = merged.at(-1)
    if (prev && prev.end === part.start && prev.rule === part.rule) prev.end = part.end
    else merged.push({ ...part })
  }

  return merged.map((p) => (p.rule ? { text: fullText.slice(p.start, p.end), rule: p.rule } : { text: fullText.slice(p.start, p.end) }))
}
