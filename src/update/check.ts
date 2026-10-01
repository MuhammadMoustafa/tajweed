/**
 * The APK's update check: reads the newest GitHub release (src/update/releases.ts) and compares
 * it with the running version (src/update/version.ts). The startup check runs at most once a day
 * and stays silent on any failure; "Later" hides that one version's banner. Only the APK calls
 * this (src/update/platform.ts): the PWA updates itself through its service worker.
 *
 * Pure apart from its injectable fetch, clock and storage, which tests replace.
 */
import { APK_ASSET_NAME, LATEST_RELEASE_API } from './releases'
import { isNewerVersion, parseVersion } from './version'

export interface Release {
  /** Without the tag's `v`, e.g. `0.3.0`. */
  version: string
  /** The `tajweed.apk` asset, or the release page when the asset is missing. */
  downloadUrl: string
}

export type CheckResult = { kind: 'up-to-date' } | { kind: 'available'; release: Release } | { kind: 'failed' }

/** The subset of Storage the check uses (localStorage in the app). */
export type UpdateStorage = Pick<Storage, 'getItem' | 'setItem'>

export interface CheckDeps {
  fetch?: typeof fetch
  /** Milliseconds since the epoch. */
  now?: () => number
  /** Undefined when storage is unavailable: then every startup may check. */
  storage?: UpdateStorage
}

const LAST_CHECK_KEY = 'tajweed.update.lastCheck'
const DISMISSED_KEY = 'tajweed.update.dismissed'
export const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000

/** localStorage, or undefined where touching it throws (private mode, blocked site data). */
export function browserStorage(): UpdateStorage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage
  } catch {
    return undefined
  }
}

function read(storage: UpdateStorage | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null
  } catch {
    return null
  }
}

function write(storage: UpdateStorage | undefined, key: string, value: string) {
  try {
    storage?.setItem(key, value)
  } catch {
    // Storage full or blocked: the check just runs again next time.
  }
}

/** The release in a `releases/latest` API response, or undefined when it has no usable version. */
export function releaseFromApi(json: unknown): Release | undefined {
  if (!json || typeof json !== 'object') return undefined
  const { tag_name: tag, html_url: page, assets } = json as {
    tag_name?: unknown
    html_url?: unknown
    assets?: unknown
  }
  if (typeof tag !== 'string' || !parseVersion(tag)) return undefined
  const asset = Array.isArray(assets)
    ? (assets as { name?: unknown; browser_download_url?: unknown }[]).find((a) => a?.name === APK_ASSET_NAME)
    : undefined
  const downloadUrl =
    typeof asset?.browser_download_url === 'string' ? asset.browser_download_url : typeof page === 'string' ? page : undefined
  if (!downloadUrl) return undefined
  return { version: tag.replace(/^v/, ''), downloadUrl }
}

/** Asks GitHub for the newest release and compares it with `current`; never throws. */
export async function checkForUpdate(current: string, deps: CheckDeps = {}): Promise<CheckResult> {
  const fetchFn = deps.fetch ?? globalThis.fetch
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return { kind: 'failed' }
  try {
    const response = await fetchFn(LATEST_RELEASE_API, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store',
    })
    if (!response.ok) return { kind: 'failed' }
    const release = releaseFromApi(await response.json())
    if (!release) return { kind: 'failed' }
    write(deps.storage, LAST_CHECK_KEY, String((deps.now ?? Date.now)()))
    return isNewerVersion(release.version, current) ? { kind: 'available', release } : { kind: 'up-to-date' }
  } catch {
    return { kind: 'failed' }
  }
}

/** True when no successful check happened in the last day (or the clock went backwards). */
export function isCheckDue(now: number, storage: UpdateStorage | undefined): boolean {
  const last = Number(read(storage, LAST_CHECK_KEY))
  if (!Number.isFinite(last) || last <= 0) return true
  return now - last >= CHECK_INTERVAL_MS || now < last
}

/** "Later" on a version's banner: that version's banner stays hidden; a newer one shows again. */
export function dismissVersion(version: string, storage: UpdateStorage | undefined) {
  write(storage, DISMISSED_KEY, version)
}

export const isDismissed = (version: string, storage: UpdateStorage | undefined) =>
  read(storage, DISMISSED_KEY) === version

/**
 * The startup check: at most once a day, silent on failure, skipping a dismissed version.
 * Resolves with the release for the banner, or undefined for no banner.
 */
export async function startupUpdateCheck(current: string, deps: CheckDeps = {}): Promise<Release | undefined> {
  const now = (deps.now ?? Date.now)()
  if (!isCheckDue(now, deps.storage)) return undefined
  const result = await checkForUpdate(current, { ...deps, now: () => now })
  if (result.kind !== 'available' || isDismissed(result.release.version, deps.storage)) return undefined
  return result.release
}
