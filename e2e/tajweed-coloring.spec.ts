import { expect, test } from '@playwright/test'
import { LESSONS } from '../src/lessons'

// Iterates LESSONS so a newly added lesson is covered automatically.
test.describe('tajweed rule coloring', () => {
  for (const lesson of LESSONS) {
    test(`${lesson.id} examples render colored rule spans`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)
      // Scoped to example cards: quizzes and other sections may render Quran text too.
      const quranBlocks = page.locator('.example .quran')
      await expect(quranBlocks).toHaveCount(lesson.examples.length)

      // A lesson without focus rules (e.g. makharij) shows its examples uncolored and no legend.
      if (lesson.focusRules.length === 0) {
        await expect(page.locator('.example .quran span[title]')).toHaveCount(0)
        await expect(page.locator('.legend')).toHaveCount(0)
        return
      }

      for (let i = 0; i < lesson.examples.length; i++) {
        const block = quranBlocks.nth(i)
        const ruleSpan = block.locator('span[title]').first()
        await expect(ruleSpan).toBeVisible()
        const style = await ruleSpan.getAttribute('style')
        expect(style).toMatch(/color:\s*var\(--tj-[\w-]+\)/)
      }
    })
  }
})
