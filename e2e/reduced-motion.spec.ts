import { expect, test } from '@playwright/test'
import { LESSONS } from '../src/lessons'

// Only lessons that have an animation; iterates LESSONS so a new animated lesson is covered
// automatically.
const lessonsWithAnimation = LESSONS.filter((l) => l.animation)

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
