/**
 * Shared network/IO helpers for the data-fetching scripts (fetch-quran.ts, fetch-mutoon.ts), so
 * neither one keeps its own copy of "fetch and throw on a bad status" / "write pretty JSON".
 */
import { writeFile } from 'node:fs/promises'

// Alukah (and some other Arabic sites) vary their response by User-Agent; send a normal browser
// one so we get the same page a person would see.
export const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/** GETs `url` and parses the body as JSON, throwing with the URL and status on a non-2xx response. */
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  return (await res.json()) as T
}

/** GETs `url` as a normal browser would (see BROWSER_USER_AGENT) and returns the response text. */
export async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': BROWSER_USER_AGENT } })
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  return await res.text()
}

/** Writes `data` as pretty-printed JSON with a trailing newline, matching the repo's committed style. */
export async function writeJsonFile(url: URL, data: unknown): Promise<void> {
  await writeFile(url, JSON.stringify(data, null, 2) + '\n', 'utf8')
}
