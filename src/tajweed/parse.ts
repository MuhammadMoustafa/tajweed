import { isTajweedRuleId, type TajweedRuleId } from './rules'

export interface TajweedSegment {
  text: string
  /** Innermost rule wins when tags are nested (the API nests e.g. `slnt` inside `madda_obligatory`). */
  rule?: TajweedRuleId
}

export interface ParsedAyah {
  segments: TajweedSegment[]
  /** Ayah number as printed in Arabic-Indic digits, from `<span class=end>`. */
  ayahNumber?: string
}

const TAG = /<(\/?)(tajweed|span)(?:\s+class=([\w-]+))?>/g

/**
 * Parse the Quran Foundation `text_uthmani_tajweed` markup into plain segments.
 * We never render the API string as HTML; this is the only place its markup is interpreted.
 */
export function parseTajweed(markup: string): ParsedAyah {
  const segments: TajweedSegment[] = []
  const stack: (TajweedRuleId | null)[] = []
  let inEnd = false
  let ayahNumber: string | undefined
  let last = 0

  const push = (text: string) => {
    if (!text) return
    if (inEnd) {
      ayahNumber = (ayahNumber ?? '') + text
      return
    }
    const rule = [...stack].reverse().find((r): r is TajweedRuleId => r !== null)
    const prev = segments.at(-1)
    if (prev && prev.rule === rule) prev.text += text
    else segments.push(rule ? { text, rule } : { text })
  }

  for (const match of markup.matchAll(TAG)) {
    push(markup.slice(last, match.index))
    last = match.index + match[0].length
    const [, closing, tag, cls] = match
    if (tag === 'span') {
      inEnd = !closing && cls === 'end'
    } else if (closing) {
      stack.pop()
    } else {
      stack.push(cls && isTajweedRuleId(cls) ? cls : null)
    }
  }
  push(markup.slice(last))

  const tail = segments.at(-1)
  if (tail && !tail.rule) {
    tail.text = tail.text.trimEnd()
    if (!tail.text) segments.pop()
  }
  return { segments, ayahNumber: ayahNumber?.trim() }
}
