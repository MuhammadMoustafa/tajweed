import type { RuleId } from './rules'

const GRAPHEMES = new Intl.Segmenter('ar', { granularity: 'grapheme' })

export interface TextGrapheme {
  /** The grapheme cluster's text (a base letter plus any harakat/shadda/sukun it carries). */
  segment: string
  /** Character offset into the source text. */
  index: number
}

/**
 * Splits `text` into grapheme clusters via `Intl.Segmenter`, so a letter stays joined with any
 * harakat/shadda/sukun it carries as a single unit. The only place this app calls
 * `Intl.Segmenter` — everything that needs grapheme boundaries (hand-placed marks, letter-level
 * quiz targets) goes through this function.
 */
export function splitGraphemes(text: string): TextGrapheme[] {
  return [...GRAPHEMES.segment(text)]
}

interface RuledSegment {
  text: string
  rule?: RuleId
}

export interface LetterGrapheme {
  /** The letter's text (with any harakat), or a single space. */
  text: string
  rule?: RuleId
  /** A literal space between words — always rendered, never a tap target. */
  isSpace: boolean
  /** 0-based index among only the non-space letters; `undefined` for a space. This is the id a
   *  "tap the letters" quiz question uses for selection/correctness — spaces never get one. */
  tapIndex?: number
}

/**
 * Splits already-ruled segments (from `parseTajweed` and/or `applyMarks`) into one entry per
 * grapheme, so each letter — not each rule run — can be its own quiz tap target. Spaces stay in
 * the list, in order, so rendering can reproduce them exactly, but are flagged `isSpace` and never
 * get a `tapIndex`.
 */
export function segmentsToLetters(segments: readonly RuledSegment[]): LetterGrapheme[] {
  const letters: LetterGrapheme[] = []
  let tapIndex = 0
  for (const seg of segments) {
    for (const { segment } of splitGraphemes(seg.text)) {
      const isSpace = segment === ' '
      letters.push({ text: segment, rule: seg.rule, isSpace, tapIndex: isSpace ? undefined : tapIndex++ })
    }
  }
  return letters
}
