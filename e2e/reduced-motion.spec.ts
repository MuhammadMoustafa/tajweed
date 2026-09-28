import { expect, test } from '@playwright/test'
import { LESSONS } from '../src/lessons'

// The echo circles are specific to the qalqalah animation; each new animation adds its own
// reduced-motion check here.
const lessonsWithAnimation = LESSONS.filter((l) => l.animation === 'qalqalah-bounce')

test.describe('animation and reduced motion', () => {
  for (const lesson of lessonsWithAnimation) {
    test(`${lesson.id} animation shows echo circles by default`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)
      const svg = page.locator('.animation svg')
      await expect(svg).toBeVisible()
      await expect(svg.locator('circle').first()).toBeVisible()
    })

    test(`${lesson.id} animation omits echo circles with reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/#/lesson/${lesson.id}`)
      const svg = page.locator('.animation svg')
      await expect(svg).toBeVisible()
      await expect(svg.locator('circle')).toHaveCount(0)
    })
  }
})
