import { expect, test } from '@playwright/test'
import { LESSONS } from '../src/lessons'
import { blockReciterAudio } from './reciter-audio'

// The player itself (src/animations/player/AnimationPlayer.tsx), on the qalqalah clip: five steps
// of 2 s each, each stopping when done (pauseAfter). Per-clip frame checks live in reduced-motion.spec.ts.
const lesson = LESSONS.find((l) => l.animation === 'qalqalah-bounce')!

test.describe('animation player', () => {
  // The qalqalah clip's first step plays a recited word; keep the timing off the network.
  test.use({ serviceWorkers: 'block' })
  test.beforeEach(({ page }) => blockReciterAudio(page))

  test('starts paused, then plays, pauses, steps and seeks', async ({ page }) => {
    await page.goto(`/#/lesson/${lesson.id}`)
    const player = page.locator('.animation .player')
    await expect(player).toHaveAttribute('data-step', '0')
    await expect(player).toHaveAttribute('data-playing', 'false')
    await expect(player.locator('.player-big-play')).toBeVisible()
    await expect(player.getByText('Step 1 of 5')).toBeVisible()

    await player.getByRole('button', { name: 'Play', exact: true }).click()
    await expect(player).toHaveAttribute('data-playing', 'true')
    await expect(player.locator('.player-big-play')).toHaveCount(0)
    // The first letter stops when done; Play goes on to the next.
    await expect(player).toHaveAttribute('data-playing', 'false', { timeout: 5000 })
    await expect(player).toHaveAttribute('data-step', '0')
    await player.getByRole('button', { name: 'Play', exact: true }).click()
    await expect(player).toHaveAttribute('data-step', '1')

    await player.getByRole('button', { name: 'Pause' }).click()
    await expect(player).toHaveAttribute('data-playing', 'false')
    const paused = Number(await player.getAttribute('data-step'))

    await player.getByRole('button', { name: 'Next step' }).click()
    await expect(player).toHaveAttribute('data-step', String(paused + 1))
    await player.getByRole('button', { name: 'Previous step' }).click()
    await expect(player).toHaveAttribute('data-step', String(paused))

    const seek = player.getByRole('slider', { name: 'Animation position' })
    await seek.fill('5000')
    await expect(player).toHaveAttribute('data-step', '2')
    await expect(seek).toHaveAttribute('aria-valuetext', 'Step 3 of 5')
    await seek.press('End')
    await expect(player).toHaveAttribute('data-step', '4')
    await seek.press('Home')
    await expect(player).toHaveAttribute('data-step', '0')
  })

  test('plays or pauses on Space and steps with the arrow keys', async ({ page }) => {
    await page.goto(`/#/lesson/${lesson.id}`)
    const player = page.locator('.animation .player')
    await player.focus()
    await page.keyboard.press('ArrowRight')
    await expect(player).toHaveAttribute('data-step', '1')
    await page.keyboard.press('ArrowLeft')
    await expect(player).toHaveAttribute('data-step', '0')
    await page.keyboard.press('Space')
    await expect(player).toHaveAttribute('data-playing', 'true')
    await page.keyboard.press('Space')
    await expect(player).toHaveAttribute('data-playing', 'false')
  })

  test('offers half speed and marks the chosen speed', async ({ page }) => {
    await page.goto(`/#/lesson/${lesson.id}`)
    const player = page.locator('.animation .player')
    const half = player.getByRole('button', { name: '0.5×' })
    await expect(player.getByRole('button', { name: '1×' })).toHaveAttribute('aria-pressed', 'true')
    await half.click()
    await expect(half).toHaveAttribute('aria-pressed', 'true')
  })
})
