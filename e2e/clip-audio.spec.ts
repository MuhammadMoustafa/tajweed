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

test('pressing play on a step with audio requests that ayah file (blocked here), then moves on', async ({ page }) => {
  await page.goto(`/#/lesson/${lessonWith('qalqalah-bounce').id}`)
  const player = page.locator('.animation .player')
  await player.getByRole('button', { name: 'Play', exact: true }).click()
  // The blocked file fails to load, which ends the word, so the step runs its own 2 s.
  await expect(player).toHaveAttribute('data-step', '1', { timeout: 5000 })
  expect(audioRequests.map((url) => url.split('#')[0])).toContain(getWord(CLIP_WORDS.qalqalahQaf)!.audio.url)
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
    'Recited by Sheikh Mahmoud Khalil al-Husary · surah 1, ayah 1, word 3',
  )

  await mute.click()
  await expect(mute).toHaveAttribute('aria-pressed', 'true')
  expect(audioRequests, 'no audio is fetched without pressing play').toEqual([])
})

test('the qalqalah clip plays a word only on the letters that have one', async ({ page }) => {
  await page.goto(`/#/lesson/${lessonWith('qalqalah-bounce').id}`)
  const player = page.locator('.animation .player')
  await expect(player).toHaveAttribute('data-audio-src', spanUrl('qalqalahQaf'))
  await expect(player.locator('.anim-word')).toHaveText(getWord(CLIP_WORDS.qalqalahQaf)!.text)
  await expect(player.getByRole('button', { name: 'Mute the reciter' })).toBeVisible()

  await player.getByRole('button', { name: 'Next step' }).click()
  await expect(player).toHaveAttribute('data-step', '1')
  await expect(player).not.toHaveAttribute('data-audio-src')
  await expect(player.locator('.anim-word')).toHaveCount(0)

  await player.getByRole('button', { name: 'Dal', exact: true }).click()
  await expect(player).toHaveAttribute('data-audio-src', spanUrl('qalqalahDal'))
  expect(audioRequests, 'no audio is fetched without pressing play').toEqual([])
})
