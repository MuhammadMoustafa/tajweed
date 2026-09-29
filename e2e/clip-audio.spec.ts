import { expect, test } from '@playwright/test'
import { mediaFragmentUrl } from '../src/animations/player/audio'
import { CLIP_WORDS } from '../src/animations/words'
import { getWord } from '../src/data/quran'
import { LESSONS } from '../src/lessons'
import { blockReciterAudio } from './reciter-audio'

// T12 (#35): clip steps with reciter audio (ClipStep.audio) expose the word's audio span and a mute
// toggle. Nothing is ever played: the audio host is blocked, and until Play is pressed it must not
// even be requested.
const lessonWith = (animation: string) => LESSONS.find((l) => l.animation === animation)!
const spanUrl = (key: keyof typeof CLIP_WORDS) => mediaFragmentUrl(getWord(CLIP_WORDS[key])!.audio)

let audioRequests: string[]

test.use({ serviceWorkers: 'block' })

test.beforeEach(async ({ page }) => {
  audioRequests = await blockReciterAudio(page)
})

test('pressing play on a step with audio requests that ayah file (blocked here), stops after it, then goes on', async ({
  page,
}) => {
  await page.goto(`/#/lesson/${lessonWith('qalqalah-bounce').id}`)
  const player = page.locator('.animation .player')
  await player.getByRole('button', { name: 'Play', exact: true }).click()
  await expect(player).toHaveAttribute('data-playing', 'true')
  // The blocked file fails to load, which ends the word, so the step runs its own 2 s; each
  // qalqalah letter then waits (pauseAfter) on its own step until the learner goes on.
  await expect(player).toHaveAttribute('data-playing', 'false', { timeout: 5000 })
  await expect(player).toHaveAttribute('data-step', '0')
  expect(audioRequests.map((url) => url.split('#')[0])).toContain(getWord(CLIP_WORDS.qalqalahQaf)!.audio.url)

  await player.getByRole('button', { name: 'Play', exact: true }).click()
  await expect(player).toHaveAttribute('data-step', '1')
  await expect(player).toHaveAttribute('data-playing', 'true')
})

test('the natural madd clip ends on a recited Quran word, with its source, credit and a mute toggle', async ({
  page,
}) => {
  await page.goto(`/#/lesson/${lessonWith('natural-madd').id}`)
  const player = page.locator('.animation .player')
  await expect(player).not.toHaveAttribute('data-audio-src')

  const mute = player.getByRole('button', { name: 'Mute the reciter' })
  await expect(mute).toHaveAttribute('aria-pressed', 'false')

  await player.getByRole('button', { name: 'Listen', exact: true }).click()
  await expect(player).toHaveAttribute('data-step', '4')
  await expect(player).toHaveAttribute('data-playing', 'false')
  await expect(player).toHaveAttribute('data-audio-src', spanUrl('naturalMadd'))
  await expect(player.locator('.anim-word')).toHaveText(getWord(CLIP_WORDS.naturalMadd)!.text)
  await expect(player.locator('.player-audio-credit')).toHaveText(
    'Recited by Sheikh Mahmoud Khalil al-Husary · Al-Fatihah (1), ayah 1, word 3',
  )

  await mute.click()
  await expect(mute).toHaveAttribute('aria-pressed', 'true')
  expect(audioRequests, 'no audio is fetched without pressing play').toEqual([])
})

test('the qalqalah clip plays a word on each of its five letters', async ({ page }) => {
  await page.goto(`/#/lesson/${lessonWith('qalqalah-bounce').id}`)
  const player = page.locator('.animation .player')
  await expect(player.getByRole('button', { name: 'Mute the reciter' })).toBeVisible()

  const words = ['qalqalahQaf', 'qalqalahTa', 'qalqalahBa', 'qalqalahJeem', 'qalqalahDal'] as const
  for (const [i, key] of words.entries()) {
    if (i > 0) await player.getByRole('button', { name: 'Next step' }).click()
    await expect(player).toHaveAttribute('data-step', String(i))
    await expect(player).toHaveAttribute('data-audio-src', spanUrl(key))
    await expect(player.locator('.anim-word')).toHaveText(getWord(CLIP_WORDS[key])!.text)
  }
  expect(audioRequests, 'no audio is fetched without pressing play').toEqual([])
})
