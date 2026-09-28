/**
 * Parses an Alukah.net matn (classical poem) page — the same layout for both Tuhfat al-Atfal
 * and al-Muqaddimah al-Jazariyyah — into numbered lines grouped by section heading.
 *
 * We never render this markup as HTML; this is the only place it is interpreted. See
 * scripts/fetch-mutoon.ts, the only caller that has network access.
 */

export interface MatnLine {
  /** 1-based position in the poem, assigned by where the line sits in the page, never by the
   * printed digit next to it: the source has at least one known mislabeled line (see parse.test.ts). */
  n: number
  /** First half of the line (sadr), the printed number stripped off. */
  sadr: string
  /** Second half of the line (ajuz). */
  ajuz: string
}

export interface MatnSection {
  /** The heading printed just above this group of lines, e.g. "باب مخارج الحروف". Undefined for
   * a run of lines with no heading directly above it. */
  heading?: string
  lines: MatnLine[]
}

export interface ParsedMatn {
  /** The page's own title heading, e.g. "متن تحفة الأطفال". */
  title: string
  sections: MatnSection[]
}

// Alukah wraps the poem text (and only the poem text) in <span itemprop='articleBody'>...</span>;
// everything before it (nav, author bio) and after it (comments, related articles) is ignored.
const ARTICLE_BODY = /itemprop=(['"])articleBody\1/

// Each section heading, and each "line table" (a <table class="POEM">, one per section) appear in
// document order inside the article body; alternation over one regex keeps that order.
const BLOCK = /<h2\b[^>]*>([\s\S]*?)<\/h2>|<table[^>]*\bclass="POEM"[^>]*>([\s\S]*?)<\/table>/g

// Inside a POEM table, each half-line is its own <div style="padding-right: ...">text<img .../></div>;
// two in a row (first carries the printed line number, second does not) make one full line.
const HALF_LINE = /<div style="padding-right:[^"]*">([\s\S]*?)<img[^>]*\/>\s*<\/div>/g

const LEADING_NUMBER = /^\s*\d+\s*-\s*/

/** Strips a footnote marker (Alukah's endnote links), then all remaining tags, then decodes the
 * handful of entities the site uses, then collapses whitespace. Never touches the Arabic text itself. */
function stripMarkup(html: string): string {
  return html
    .replace(/<a\s+name="_ftnref\d+"[^>]*>[\s\S]*?<\/a>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Parses one Alukah matn page. `expectedCount` is the known line count for that poem (61 for
 * Tuhfat al-Atfal, 109 for al-Muqaddimah al-Jazariyyah); the function throws if the page's own
 * numbered lines don't add up to it, so a layout change or a bad fetch fails loudly instead of
 * silently writing a short poem.
 */
export function parseMutoonHtml(html: string, expectedCount: number): ParsedMatn {
  const bodyStart = html.search(ARTICLE_BODY)
  if (bodyStart === -1) throw new Error('article body not found (itemprop="articleBody" is missing)')
  const body = html.slice(bodyStart)

  let title: string | null = null
  let pendingHeading: string | undefined
  const sections: MatnSection[] = []
  let n = 0

  for (const block of body.matchAll(BLOCK)) {
    const [, headingHtml, tableHtml] = block
    if (headingHtml !== undefined) {
      const text = stripMarkup(headingHtml)
      if (!text) continue // e.g. the empty "<br/>"-only heading between the title and the author line
      if (title === null) {
        title = text
        continue
      }
      pendingHeading = text
      continue
    }

    const halves: string[] = []
    for (const half of tableHtml!.matchAll(HALF_LINE)) halves.push(stripMarkup(half[1]))

    const lines: MatnLine[] = []
    for (let i = 0; i + 1 < halves.length; i += 2) {
      n++
      lines.push({ n, sadr: halves[i].replace(LEADING_NUMBER, '').trim(), ajuz: halves[i + 1].trim() })
    }
    if (lines.length === 0) continue
    sections.push({ heading: pendingHeading, lines })
    pendingHeading = undefined
  }

  if (title === null) throw new Error('no title heading found')
  if (n !== expectedCount) throw new Error(`expected ${expectedCount} numbered lines, found ${n}`)

  return { title, sections }
}
