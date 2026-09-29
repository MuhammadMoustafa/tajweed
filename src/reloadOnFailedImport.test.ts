import { describe, expect, it, vi } from 'vitest'
import { RELOAD_GUARD_MS, reloadOnFailedImport, type ReloadEnv } from './reloadOnFailedImport'

const fakeEnv = (start = 1_000_000) => {
  const store = new Map<string, string>()
  let now = start
  const env: ReloadEnv = {
    storage: () => ({ getItem: (k) => store.get(k) ?? null, setItem: (k, v) => void store.set(k, v) }),
    reload: vi.fn(),
    now: () => now,
  }
  return { env, advance: (ms: number) => (now += ms) }
}

const settled = async (promise: Promise<unknown>) => {
  let state = 'pending'
  promise.then(
    () => (state = 'resolved'),
    () => (state = 'rejected'),
  )
  await new Promise((r) => setTimeout(r, 0))
  return state
}

describe('reloadOnFailedImport', () => {
  it('passes a successful import through without reloading', async () => {
    const { env } = fakeEnv()
    await expect(reloadOnFailedImport(() => Promise.resolve('page'), env)).resolves.toBe('page')
    expect(env.reload).not.toHaveBeenCalled()
  })

  it('reloads once when an import fails (a page older than the deploy), and stays pending', async () => {
    const { env } = fakeEnv()
    const result = reloadOnFailedImport(() => Promise.reject(new Error('chunk gone')), env)
    expect(await settled(result)).toBe('pending')
    expect(env.reload).toHaveBeenCalledTimes(1)
  })

  it('passes the error on, without reloading again, when it fails again soon after that reload', async () => {
    const { env, advance } = fakeEnv()
    void reloadOnFailedImport(() => Promise.reject(new Error('chunk gone')), env)
    await new Promise((r) => setTimeout(r, 0))
    advance(RELOAD_GUARD_MS - 1)
    await expect(reloadOnFailedImport(() => Promise.reject(new Error('offline')), env)).rejects.toThrow('offline')
    expect(env.reload).toHaveBeenCalledTimes(1)
  })

  it('reloads again for a later deploy, once the guard has passed', async () => {
    const { env, advance } = fakeEnv()
    void reloadOnFailedImport(() => Promise.reject(new Error('chunk gone')), env)
    await new Promise((r) => setTimeout(r, 0))
    advance(RELOAD_GUARD_MS)
    void reloadOnFailedImport(() => Promise.reject(new Error('chunk gone')), env)
    await new Promise((r) => setTimeout(r, 0))
    expect(env.reload).toHaveBeenCalledTimes(2)
  })

  it('passes the error on when there is no storage to guard a reload loop with', async () => {
    const { env } = fakeEnv()
    env.storage = () => {
      throw new Error('storage blocked')
    }
    await expect(reloadOnFailedImport(() => Promise.reject(new Error('chunk gone')), env)).rejects.toThrow('chunk gone')
    expect(env.reload).not.toHaveBeenCalled()
  })
})
