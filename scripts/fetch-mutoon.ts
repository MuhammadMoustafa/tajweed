/**
 * Downloads the two classical tajweed poems referenced by lesson `mutoon` refs (Tuhfat al-Atfal
 * and al-Muqaddimah al-Jazariyyah) from Alukah.net and writes them to src/data/mutoon.json. The
 * JSON is committed so the app builds and runs offline; poem text is never typed or "fixed" by
 * hand, only ever produced by this script (see the HTML→lines parser in src/mutoon/parse.ts).
 *
 * Run after adding a lesson `mutoon` ref that needs a poem not yet fetched, or to refresh both:
 *   npm run fetch-mutoon
 */
import { parseMutoonHtml } from '../src/mutoon/parse.ts'
import type { MatnId } from '../src/mutoon/types.ts'
import { fetchHtml, writeJsonFile } from './lib/fetch.ts'

const OUT = new URL('../src/data/mutoon.json', import.meta.url)
const PUBLISHER = 'Alukah (alukah.net)'

// Author names are well-known attributions for these two texts, not text drawn from the page.
const POEMS: { id: MatnId; url: string; expectedCount: number; author: string }[] = [
  {
    id: 'tuhfa',
    url: 'https://www.alukah.net/sharia/0/57837/',
    expectedCount: 61,
    author: 'سليمان بن حسين الجمزوري',
  },
  {
    id: 'jazariyya',
    url: 'https://www.alukah.net/sharia/0/58168/',
    expectedCount: 109,
    author: 'محمد بن محمد بن الجزري',
  },
]

const fetchedAt = new Date().toISOString().slice(0, 10)
const texts: Record<string, unknown> = {}

for (const poem of POEMS) {
  const html = await fetchHtml(poem.url)
  const parsed = parseMutoonHtml(html, poem.expectedCount)
  texts[poem.id] = {
    url: poem.url,
    title: parsed.title,
    author: poem.author,
    sections: parsed.sections,
  }
  console.log(`${poem.id}: ${poem.expectedCount} lines across ${parsed.sections.length} sections`)
}

await writeJsonFile(OUT, { publisher: PUBLISHER, fetchedAt, texts })
console.log('Wrote src/data/mutoon.json')
