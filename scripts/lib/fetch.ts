/**
 * Shared network/IO helpers for the data-fetching scripts (fetch-quran.ts, fetch-mutoon.ts,
 * build-quiz-pool.ts), so none keeps its own copy of "fetch and throw on a bad status" or
 * "replace the generated files without leaving a half-written set behind".
 */
import { rename, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// Alukah (and some other Arabic sites) vary their response by User-Agent; send a normal browser
// one so we get the same page a person would see.
export const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/**
 * GETs `url`, parses the body as JSON and hands it to `parse`, which must check it at runtime and
 * return the typed data (or throw). Throws with the URL on a non-2xx response or a rejected body;
 * there is no unchecked variant, so no caller can treat an API response as typed by a cast.
 */
export async function fetchJson<T>(url: string, parse: (body: unknown) => T): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  const body: unknown = await res.json()
  try {
    return parse(body)
  } catch (error) {
    throw new Error(`${url}: ${(error as Error).message}`, { cause: error })
  }
}

/** GETs `url` as a normal browser would (see BROWSER_USER_AGENT) and returns the response text. */
export async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': BROWSER_USER_AGENT } })
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  return await res.text()
}

/** Pretty-printed JSON with a trailing newline, matching the repo's committed style. */
export const jsonText = (data: unknown, indent = 2): string => JSON.stringify(data, null, indent) + '\n'

/** The file operations writeTextFiles uses, injectable so tests can make one of them fail. */
export interface StagingFs {
  writeFile(path: string, text: string): Promise<void>
  /** Replaces `to` if it exists. */
  rename(from: string, to: string): Promise<void>
  /** Removes `path`; no error if it is already gone. */
  remove(path: string): Promise<void>
}

const nodeFs: StagingFs = {
  writeFile: (path, text) => writeFile(path, text, 'utf8'),
  rename,
  remove: (path) => rm(path, { force: true }),
}

const isMissing = (error: unknown) => (error as NodeJS.ErrnoException).code === 'ENOENT'

/**
 * Replaces every file in `files` as one set: all are first written to temporary files next to
 * their destinations; then each destination is moved to a backup and its temporary file moved
 * into place. If any step fails, every destination already replaced gets its original back (or is
 * removed if it had none), the temporary files are removed and the error is rethrown, so the set
 * is either all new or all old. Backups are removed only once every rename has succeeded.
 */
export async function writeTextFiles(files: { url: URL; text: string }[], fs: StagingFs = nodeFs): Promise<void> {
  const stamp = `${process.pid}-${Date.now()}`
  const staged = files.map(({ url, text }) => {
    const dest = fileURLToPath(url)
    return { dest, text, tmp: `${dest}.${stamp}.tmp`, backup: `${dest}.${stamp}.bak`, hadOriginal: false, movedAway: false, replaced: false }
  })
  const dests = new Set(staged.map((s) => s.dest))
  if (dests.size !== staged.length) throw new Error(`writeTextFiles: a destination is listed twice`)

  const removeTemporaries = () => Promise.allSettled(staged.map((s) => fs.remove(s.tmp)))
  try {
    for (const s of staged) await fs.writeFile(s.tmp, s.text)
  } catch (error) {
    await removeTemporaries()
    throw error
  }

  try {
    for (const s of staged) {
      try {
        await fs.rename(s.dest, s.backup)
        s.hadOriginal = true
      } catch (error) {
        if (!isMissing(error)) throw error
      }
      s.movedAway = true
      await fs.rename(s.tmp, s.dest)
      s.replaced = true
    }
  } catch (error) {
    const unrestored: string[] = []
    for (const s of staged.filter((x) => x.movedAway).reverse()) {
      try {
        if (s.hadOriginal) await fs.rename(s.backup, s.dest)
        else if (s.replaced) await fs.remove(s.dest)
      } catch {
        unrestored.push(s.hadOriginal ? `${s.dest} (original kept at ${s.backup})` : s.dest)
      }
    }
    await removeTemporaries()
    const detail = unrestored.length
      ? `; could not restore ${unrestored.join(', ')}`
      : '; every destination was restored'
    throw new Error(`replacing ${staged.map((s) => s.dest).join(', ')} failed${detail}: ${(error as Error).message}`, {
      cause: error,
    })
  }

  for (const s of staged) {
    if (!s.hadOriginal) continue
    try {
      await fs.remove(s.backup)
    } catch (error) {
      console.warn(`${s.dest} was replaced, but its backup ${s.backup} could not be removed: ${(error as Error).message}`)
    }
  }
}

/** writeTextFiles for JSON data, each pretty-printed with jsonText. */
export const writeJsonFiles = (files: { url: URL; data: unknown }[], fs?: StagingFs): Promise<void> =>
  writeTextFiles(files.map(({ url, data }) => ({ url, text: jsonText(data) })), fs)
