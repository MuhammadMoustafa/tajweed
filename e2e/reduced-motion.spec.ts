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

// natural-madd (MaddBar, src/animations/MaddBar.tsx): three bars, one per madd letter.
const lessonsWithMaddBar = LESSONS.filter((l) => l.animation === 'natural-madd')

test.describe('madd bar and reduced motion', () => {
  for (const lesson of lessonsWithMaddBar) {
    test(`${lesson.id} animation shows three madd bars`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)
      await expect(page.locator('.animation .madd-bar')).toHaveCount(3)
    })

    test(`${lesson.id} animation shows each bar full and static with reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/#/lesson/${lesson.id}`)
      const fills = page.locator('.animation .madd-bar-fill')
      await expect(fills).toHaveCount(3)
      for (const fill of await fills.all()) {
        // Motion serializes the animated SVG "width" attribute with a "px" suffix.
        await expect(fill).toHaveAttribute('width', '200px')
      }
    })
  }
})
