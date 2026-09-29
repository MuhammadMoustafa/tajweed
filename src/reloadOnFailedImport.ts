/** When the last reload for a failed import happened (sessionStorage, so per tab). */
const RELOADED_AT = 'tajweed.importReloadAt'
/** A failure this soon after that reload is real (offline, or the file is gone), not a stale page. */
export const RELOAD_GUARD_MS = 30_000

export interface ReloadEnv {
  storage: () => Pick<Storage, 'getItem' | 'setItem'>
  reload: () => void
  now: () => number
}

const browserEnv: ReloadEnv = {
  storage: () => sessionStorage,
  reload: () => window.location.reload(),
  now: () => Date.now(),
}

/**
 * Runs an on-demand import (a lazy page, the quiz pool). A page left open across a deploy still
 * runs the old build: the new service worker has removed the old files from its cache and the
 * server no longer has them, so the old page's import fails and would leave a blank screen. Then
 * this reloads the page once, which loads the new build. A second failure within
 * `RELOAD_GUARD_MS` of that reload is passed on to the caller instead of reloading in a loop.
 */
export function reloadOnFailedImport<T>(load: () => Promise<T>, env: ReloadEnv = browserEnv): Promise<T> {
  return load().catch((error: unknown) => {
    try {
      const storage = env.storage()
      if (env.now() - Number(storage.getItem(RELOADED_AT) ?? 0) < RELOAD_GUARD_MS) throw error
      storage.setItem(RELOADED_AT, String(env.now()))
    } catch {
      // Recently reloaded already, or no storage to guard a loop with: give up.
      throw error
    }
    env.reload()
    // The reload replaces this page; until then, stay pending (a lazy page keeps its fallback).
    return new Promise<T>(() => {})
  })
}
