import { mkdtemp, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchJson, jsonText, writeJsonFiles, writeTextFiles, type StagingFs } from './fetch.ts'

afterEach(() => vi.unstubAllGlobals())

describe('fetchJson', () => {
  it('returns what the validator returns, and names the URL when it rejects the body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ n: 1 }) }))
    expect(await fetchJson('https://example.test/a', (body) => (body as { n: number }).n + 1)).toBe(2)
    const reject = () => {
      throw new Error('bad body')
    }
    await expect(fetchJson('https://example.test/a', reject)).rejects.toThrow('https://example.test/a: bad body')
  })

  it('throws with the URL and status on a non-2xx response, without validating', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }))
    const parse = vi.fn()
    await expect(fetchJson('https://example.test/b', parse)).rejects.toThrow('https://example.test/b: HTTP 404')
    expect(parse).not.toHaveBeenCalled()
  })
})

describe('writeTextFiles (R7)', () => {
  let dir: string
  const url = (name: string) => pathToFileURL(join(dir, name))
  const snapshot = async () =>
    Object.fromEntries(await Promise.all((await readdir(dir)).sort().map(async (f) => [f, await readFile(join(dir, f), 'utf8')])))

  /** The real file operations, with `fail` deciding which call throws instead. */
  const faultyFs = (fail: (op: keyof StagingFs, args: string[]) => boolean): StagingFs => ({
    writeFile: async (path, text) => {
      if (fail('writeFile', [path])) throw new Error('injected write failure')
      await writeFile(path, text, 'utf8')
    },
    rename: async (from, to) => {
      if (fail('rename', [from, to])) throw new Error('injected rename failure')
      await rename(from, to)
    },
    remove: async (path) => {
      if (fail('remove', [path])) throw new Error('injected remove failure')
      await rm(path, { force: true })
    },
  })

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'staged-write-'))
    await writeFile(join(dir, 'a.json'), 'old a\n')
    await writeFile(join(dir, 'b.json'), 'old b\n')
  })
  afterEach(() => rm(dir, { recursive: true, force: true }))

  it('replaces every file, creates new ones and leaves no temporary or backup files', async () => {
    await writeJsonFiles([
      { url: url('a.json'), data: { a: 1 } },
      { url: url('b.json'), data: { b: 2 } },
      { url: url('c.json'), data: [3] },
    ])
    expect(await snapshot()).toEqual({ 'a.json': jsonText({ a: 1 }), 'b.json': jsonText({ b: 2 }), 'c.json': jsonText([3]) })
  })

  it('leaves every destination unchanged when staging a temporary file fails', async () => {
    const fs = faultyFs((op, [path]) => op === 'writeFile' && path.includes('b.json'))
    await expect(
      writeTextFiles([{ url: url('a.json'), text: 'new a' }, { url: url('b.json'), text: 'new b' }], fs),
    ).rejects.toThrow('injected write failure')
    expect(await snapshot()).toEqual({ 'a.json': 'old a\n', 'b.json': 'old b\n' })
  })

  it('rolls back replaced and newly created files when a later rename fails', async () => {
    const fs = faultyFs((op, [from, to]) => op === 'rename' && from.endsWith('.tmp') && to.endsWith('b.json'))
    await expect(
      writeTextFiles(
        [
          { url: url('a.json'), text: 'new a' },
          { url: url('c.json'), text: 'new c' },
          { url: url('b.json'), text: 'new b' },
        ],
        fs,
      ),
    ).rejects.toThrow(/every destination was restored: injected rename failure/)
    expect(await snapshot()).toEqual({ 'a.json': 'old a\n', 'b.json': 'old b\n' })
  })

  it('keeps and names the backup it could not restore', async () => {
    const fs = faultyFs(
      (op, [from, to]) =>
        op === 'rename' && ((from.endsWith('.tmp') && to.endsWith('b.json')) || (from.endsWith('.bak') && to.endsWith('a.json'))),
    )
    const error = writeTextFiles([{ url: url('a.json'), text: 'new a' }, { url: url('b.json'), text: 'new b' }], fs)
    await expect(error).rejects.toThrow(/could not restore .*a\.json \(original kept at .*a\.json\..*\.bak\)/)
    const files = await snapshot()
    expect(files['b.json']).toBe('old b\n')
    expect(Object.entries(files).find(([name]) => name.endsWith('.bak'))?.[1]).toBe('old a\n')
  })

  it('refuses a destination listed twice before touching anything', async () => {
    await expect(writeTextFiles([{ url: url('a.json'), text: '1' }, { url: url('a.json'), text: '2' }])).rejects.toThrow(/twice/)
    expect(await snapshot()).toEqual({ 'a.json': 'old a\n', 'b.json': 'old b\n' })
  })
})
