import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchSurahNames, fetchTajweedVerses } from './quran-api.ts'

afterEach(() => vi.unstubAllGlobals())

// Review-only expected failures: assert the desired validation, without contacting the API
// or inventing Quran text. Remove `.fails` when the corresponding validation is implemented.
describe('2026-10-01 review: imported data validation', () => {
  it.fails('R6: rejects a requested verse without its text field', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ verses: [{ verse_key: '1:1' }] }),
    }))
    await expect(fetchTajweedVerses('1:1')).rejects.toThrow()
  })

  it.fails('R6: rejects 114 duplicate chapter IDs instead of overwriting them', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ chapters: Array.from({ length: 114 }, () => ({
        id: 1, name_arabic: 'fixture-name', name_simple: 'fixture-name',
      })) }),
    }))
    await expect(fetchSurahNames()).rejects.toThrow()
  })
})
