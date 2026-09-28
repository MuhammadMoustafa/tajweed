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
 * grapheme, so each letter — not each rule run — can be its own quiz tap target. Graphemes are
 * taken over the whole verse, not per segment: the API sometimes tags a letter but leaves its
 * harakah in the next segment (112:1 tags د but not its tanween), and splitting per segment would
 * make that lone mark its own target. A letter takes the rule of its base character. Spaces stay
 * in the list, in order, so rendering can reproduce them exactly, but are flagged `isSpace` and
 * never get a `tapIndex`.
 */
export function segmentsToLetters(segments: readonly RuledSegment[]): LetterGrapheme[] {
  const ruleAt: (RuleId | undefined)[] = []
  for (const seg of segments) for (let i = 0; i < seg.text.length; i++) ruleAt.push(seg.rule)
  const text = segments.map((seg) => seg.text).join('')

  const letters: LetterGrapheme[] = []
  let tapIndex = 0
  for (const { segment, index } of splitGraphemes(text)) {
    const isSpace = segment === ' '
    const rule = ruleAt[index]
    letters.push({ text: segment, ...(rule ? { rule } : {}), isSpace, tapIndex: isSpace ? undefined : tapIndex++ })
  }
  return letters
}
