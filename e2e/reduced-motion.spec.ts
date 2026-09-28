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

// The makharij tour lights one area at a time; with reduced motion it is one labeled diagram.
test.describe('makharij tour and reduced motion', () => {
  for (const lesson of LESSONS.filter((l) => l.animation === 'makharij-tour')) {
    test(`${lesson.id} tour lights an area and names its letters by default`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)
      const tour = page.locator('.animation .makharij-tour')
      await expect(tour).toHaveAttribute('data-step', /\d+/)
      await expect(tour.locator('[data-lit="true"]').first()).toBeAttached()
      await expect(tour.locator('.makharij-caption .makharij-letters')).not.toBeEmpty()
      await expect(tour.locator('.makharij-list')).toHaveCount(0)
    })

    test(`${lesson.id} tour is a static labeled diagram with reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/#/lesson/${lesson.id}`)
      const tour = page.locator('.animation .makharij-tour')
      await expect(tour.locator('.makharij-list li')).toHaveCount(5)
      await expect(tour).not.toHaveAttribute('data-step')
      await expect(tour.locator('[data-label]')).toHaveCount(5)
      await expect(tour.locator('[data-lit="true"]')).toHaveCount(0)
    })
  }
})
