import { describe, expect, it, vi } from 'vitest'
import {
  CHECK_INTERVAL_MS,
  checkForUpdate,
  dismissVersion,
  isCheckDue,
  releaseFromApi,
  startupUpdateCheck,
  type UpdateStorage,
} from './check'
import { LATEST_RELEASE_API } from './releases'

const APK_URL = 'https://github.com/MuhammadMoustafa/tajweed/releases/download/v0.3.0/tajweed.apk'
const PAGE_URL = 'https://github.com/MuhammadMoustafa/tajweed/releases/tag/v0.3.0'
const latest = (tag = 'v0.3.0') => ({
  tag_name: tag,
  html_url: PAGE_URL,
  assets: [
    { name: 'notes.txt', browser_download_url: 'https://example.invalid/notes.txt' },
    { name: 'tajweed.apk', browser_download_url: APK_URL },
  ],
})

function memoryStorage(): UpdateStorage & { data: Map<string, string> } {
  const data = new Map<string, string>()
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) }
}

const answering = (body: unknown, ok = true) =>
  vi.fn(async () => ({ ok, json: async () => body }) as Response) as unknown as typeof fetch & ReturnType<typeof vi.fn>

const DAY = CHECK_INTERVAL_MS
const T0 = Date.UTC(2026, 9, 1, 8)

describe('releaseFromApi', () => {
  it('takes the version without its v and the tajweed.apk asset', () => {
    expect(releaseFromApi(latest())).toEqual({ version: '0.3.0', downloadUrl: APK_URL })
  })

  it('falls back to the release page when the APK asset is missing', () => {
    expect(releaseFromApi({ ...latest(), assets: [] })).toEqual({ version: '0.3.0', downloadUrl: PAGE_URL })
  })

  it('rejects a response without a version tag or any link', () => {
    expect(releaseFromApi({ ...latest(), tag_name: 'nightly' })).toBeUndefined()
    expect(releaseFromApi({ tag_name: 'v0.3.0' })).toBeUndefined()
    expect(releaseFromApi(null)).toBeUndefined()
    expect(releaseFromApi('v0.3.0')).toBeUndefined()
  })
})

describe('checkForUpdate', () => {
  it('asks the latest-release API and reports a newer version', async () => {
    const fetch = answering(latest())
    expect(await checkForUpdate('0.2.0', { fetch })).toEqual({
      kind: 'available',
      release: { version: '0.3.0', downloadUrl: APK_URL },
    })
    expect(fetch).toHaveBeenCalledWith(LATEST_RELEASE_API, expect.objectContaining({ cache: 'no-store' }))
  })

  it('is up to date on the same or an older release', async () => {
    expect(await checkForUpdate('0.3.0', { fetch: answering(latest()) })).toEqual({ kind: 'up-to-date' })
    expect(await checkForUpdate('0.4.0', { fetch: answering(latest()) })).toEqual({ kind: 'up-to-date' })
  })

  it('fails, never throws, when offline, on an HTTP error or on a bad body', async () => {
    const offline = vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    }) as unknown as typeof fetch
    expect(await checkForUpdate('0.2.0', { fetch: offline })).toEqual({ kind: 'failed' })
    expect(await checkForUpdate('0.2.0', { fetch: answering({ message: 'rate limited' }, false) })).toEqual({ kind: 'failed' })
    expect(await checkForUpdate('0.2.0', { fetch: answering({ message: 'Not Found' }) })).toEqual({ kind: 'failed' })
  })
})

describe('isCheckDue', () => {
  it('is due with no record, a day after the last check, or when the clock went back', () => {
    const storage = memoryStorage()
    expect(isCheckDue(T0, storage)).toBe(true)
    storage.setItem('tajweed.update.lastCheck', String(T0))
    expect(isCheckDue(T0 + DAY - 1, storage)).toBe(false)
    expect(isCheckDue(T0 + DAY, storage)).toBe(true)
    expect(isCheckDue(T0 - 1, storage)).toBe(true)
  })

  it('is due when storage is missing or throws', () => {
    const throwing: UpdateStorage = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    }
    expect(isCheckDue(T0, undefined)).toBe(true)
    expect(isCheckDue(T0, throwing)).toBe(true)
    expect(() => dismissVersion('0.3.0', throwing)).not.toThrow()
  })
})

describe('startupUpdateCheck', () => {
  it('checks at most once a day', async () => {
    const storage = memoryStorage()
    const fetch = answering(latest())
    expect(await startupUpdateCheck('0.2.0', { fetch, storage, now: () => T0 })).toEqual({ version: '0.3.0', downloadUrl: APK_URL })
    expect(await startupUpdateCheck('0.2.0', { fetch, storage, now: () => T0 + DAY / 2 })).toBeUndefined()
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(await startupUpdateCheck('0.2.0', { fetch, storage, now: () => T0 + DAY })).toBeDefined()
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('tries again at the next startup after a failed check', async () => {
    const storage = memoryStorage()
    const failing = answering({}, false)
    expect(await startupUpdateCheck('0.2.0', { fetch: failing, storage, now: () => T0 })).toBeUndefined()
    const fetch = answering(latest())
    expect(await startupUpdateCheck('0.2.0', { fetch, storage, now: () => T0 + 1000 })).toBeDefined()
  })

  it('hides a version put off with Later, but shows a newer one', async () => {
    const storage = memoryStorage()
    dismissVersion('0.3.0', storage)
    expect(await startupUpdateCheck('0.2.0', { fetch: answering(latest()), storage, now: () => T0 })).toBeUndefined()
    expect(await startupUpdateCheck('0.2.0', { fetch: answering(latest('v0.4.0')), storage, now: () => T0 + DAY })).toEqual({
      version: '0.4.0',
      downloadUrl: APK_URL,
    })
  })

  it('shows nothing when already on the latest version', async () => {
    expect(await startupUpdateCheck('0.3.0', { fetch: answering(latest()), storage: memoryStorage(), now: () => T0 })).toBeUndefined()
  })
})
