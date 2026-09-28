import { expect, test } from '@playwright/test'
import { LESSONS } from '../src/lessons'

// Per-clip frame checks: each clip tweens within a step by default and shows each step's end
// state, untweened, with reduced motion, while the player's controls keep working.
const withClip = (id: string) => LESSONS.filter((l) => l.animation === id)

test.describe('qalqalah clip and reduced motion', () => {
  for (const lesson of withClip('qalqalah-bounce')) {
    test(`${lesson.id} clip points at a letter and sends echo circles while playing`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)
      const player = page.locator('.animation .player')
      await expect(player.locator('.qalqalah-frame [data-current]')).toHaveCount(1)
      await player.getByRole('button', { name: 'Play', exact: true }).click()
      await expect(player.locator('.qalqalah-frame circle').first()).toBeVisible()
    })

    test(`${lesson.id} clip steps without echo circles with reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/#/lesson/${lesson.id}`)
      const player = page.locator('.animation .player')
      await player.getByRole('button', { name: 'Next step' }).click()
      await expect(player).toHaveAttribute('data-step', '1')
      await expect(player.locator('.qalqalah-frame [data-current]')).toHaveCount(1)
      await player.getByRole('button', { name: 'Play', exact: true }).click()
      await expect(player).toHaveAttribute('data-step', '2', { timeout: 5000 })
      await expect(player.locator('.qalqalah-frame circle')).toHaveCount(0)
    })
  }
})

// natural-madd (MaddBar, src/animations/MaddBar.tsx): three bars, the current one filling.
test.describe('natural madd clip and reduced motion', () => {
  for (const lesson of withClip('natural-madd')) {
    test(`${lesson.id} clip fills the current bar while playing`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)
      const player = page.locator('.animation .player')
      await expect(player.locator('.madd-bar')).toHaveCount(3)
      const fill = player.locator('.madd-bar[data-current] .madd-bar-fill')
      await expect(fill).toHaveAttribute('width', '0')
      await player.getByRole('button', { name: 'Play', exact: true }).click()
      await expect(fill).not.toHaveAttribute('width', '0')
    })

    test(`${lesson.id} clip shows each bar full, untweened, with reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/#/lesson/${lesson.id}`)
      const player = page.locator('.animation .player')
      await expect(player.locator('.madd-bar[data-current] .madd-bar-fill')).toHaveAttribute('width', '200')
      await player.getByRole('button', { name: 'Next step' }).click()
      const fills = player.locator('.madd-bar-fill')
      await expect(fills.nth(0)).toHaveAttribute('width', '200')
      await expect(fills.nth(1)).toHaveAttribute('width', '200')
      await expect(fills.nth(2)).toHaveAttribute('width', '0')
    })
  }
})

// The makharij tour lights one area per step and names its letters.
test.describe('makharij clip and reduced motion', () => {
  for (const lesson of withClip('makharij-tour')) {
    for (const reduced of [false, true]) {
      const suffix = reduced ? ' with reduced motion' : ''
      test(`${lesson.id} clip lights an area per step${suffix}`, async ({ page }) => {
        if (reduced) await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.goto(`/#/lesson/${lesson.id}`)
        const player = page.locator('.animation .player')
        const lit = player.locator('[data-lit="true"]')
        await expect(lit.first()).toBeAttached()
        await expect(player.locator('.makharij-caption .makharij-letters')).not.toBeEmpty()
        const firstArea = await lit.first().getAttribute('data-region')
        await player.getByRole('button', { name: 'Next step' }).click()
        await expect(player).toHaveAttribute('data-step', '1')
        await expect(lit.first()).not.toHaveAttribute('data-region', firstArea ?? '')
      })
    }
  }
})
