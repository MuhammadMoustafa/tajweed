/**
 * Downloads the whole Quran's tajweed markup (Hafs) in one API call and picks quiz verses for
 * every rule and difficulty (src/quiz/pool.ts), writing src/data/quiz-pool.json. The JSON is
 * committed and precached so quizzes work offline; it must stay within BUDGET_BYTES.
 *
 * Run:  npm run build-quiz-pool
 */
import { buildQuizPool, DIFFICULTIES } from '../src/quiz/pool.ts'
import { jsonText, writeTextFiles } from './lib/fetch.ts'
import { fetchTajweedVerses, tajweedSource } from './lib/quran-api.ts'

const OUT = new URL('../src/data/quiz-pool.json', import.meta.url)
const BUDGET_BYTES = 400 * 1024
const PER_TIER = 8

// All 6,236 verses, each with nonempty markup (fetchTajweedVerses checks the response).
const all = await fetchTajweedVerses()

const pool = buildQuizPool(all, { perTier: PER_TIER, source: tajweedSource() })
const json = jsonText(pool, 1)
const bytes = Buffer.byteLength(json, 'utf8')

for (const [rule, tiers] of Object.entries(pool.rules)) {
  console.log(`${rule.padEnd(20)} ${DIFFICULTIES.map((d) => `${d} ${tiers[d].length}`).join(', ')}`)
}
console.log(`${Object.keys(pool.verses).length} verses, ${(bytes / 1024).toFixed(1)} KB (budget ${BUDGET_BYTES / 1024} KB)`)
if (bytes > BUDGET_BYTES) throw new Error('quiz pool is over budget: lower PER_TIER or the tier length limits')

await writeTextFiles([{ url: OUT, text: json }])
console.log('Wrote src/data/quiz-pool.json')
