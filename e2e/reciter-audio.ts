import type { Page } from '@playwright/test'

/**
 * Blocks the reciter's audio host (clip steps' ClipStep.audio, src/data/quran-words.json) for this
 * page, so a test that presses Play never depends on the network: the player's audio driver treats
 * the failed load as the word having ended. Returns the URLs that were requested (and blocked).
 * Needs `test.use({ serviceWorkers: 'block' })`: page.route never sees a request the app's service
 * worker handles, and it handles this host (vite.config.ts, runtime caching).
 */
export async function blockReciterAudio(page: Page): Promise<string[]> {
  const requested: string[] = []
  await page.route(/quranicaudio\.com/, (route) => {
    requested.push(route.request().url())
    return route.abort()
  })
  return requested
}
