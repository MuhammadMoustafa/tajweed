import { expect, test } from '@playwright/test'
import { LESSONS } from '../src/lessons'

// A lesson with mutoon refs (e.g. qalqalah) shows the panel closed by default.
const lessonsWithMutoon = LESSONS.filter((l) => l.mutoon && l.mutoon.length > 0)

test.describe('matn panel', () => {
  for (const lesson of lessonsWithMutoon) {
    test(`${lesson.id} shows a closed matn panel`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)
      const panel = page.locator('details.matn-panel')
      await expect(panel).toBeAttached()
      await expect(panel).not.toHaveJSProperty('open', true)

      // Opening it reveals at least one line with both halves.
      await panel.locator('summary').click()
      await expect(panel).toHaveJSProperty('open', true)
      await expect(panel.locator('.matn-line').first()).toBeVisible()
      await expect(panel.locator('.matn-sadr').first()).not.toBeEmpty()
      await expect(panel.locator('.matn-ajuz').first()).not.toBeEmpty()
    })
  }
})
