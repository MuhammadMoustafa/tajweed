import { expect, test } from '@playwright/test'
import { LESSONS } from '../src/lessons'

// Every lesson in this app currently carries a matn panel (both poems, 'not-covered' where a poem
// doesn't have a section on the rule); iterating LESSONS keeps this test covering a newly added
// lesson automatically.
const lessonsWithMutoon = LESSONS.filter((l) => l.mutoon)
/** Lessons where at least one poem cites lines (foundations cites none: neither poem teaches harakat). */
const citesLines = (l: (typeof LESSONS)[number]) => Object.values(l.mutoon ?? {}).some((c) => c !== 'not-covered')

test.describe('matn panel', () => {
  for (const lesson of lessonsWithMutoon) {
    test(`${lesson.id} shows a closed matn panel with both poems, Tuhfa before Jazariyya`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)
      const panel = page.locator('details.matn-panel')
      await expect(panel).toBeAttached()
      await expect(panel).not.toHaveJSProperty('open', true)

      await panel.locator('summary').click()
      await expect(panel).toHaveJSProperty('open', true)

      // Both poems always get a section, Tuhfa first.
      const poems = panel.locator('.matn-poem')
      await expect(poems).toHaveCount(2)
      await expect(poems.nth(0)).toHaveClass(/matn-poem-tuhfa/)
      await expect(poems.nth(1)).toHaveClass(/matn-poem-jazariyya/)

      // Wherever lines are shown, both halves of the bayt are non-empty.
      if (!citesLines(lesson)) {
        await expect(panel.locator('.matn-line')).toHaveCount(0)
        return
      }
      await expect(panel.locator('.matn-line').first()).toBeVisible()
      await expect(panel.locator('.matn-sadr').first()).not.toBeEmpty()
      await expect(panel.locator('.matn-ajuz').first()).not.toBeEmpty()
    })
  }

  // Layout: at phone width, a bayt's sadr and ajuz sit on the same row (their bounding boxes
  // share a top) in both languages — they must never stack even on a narrow screen.
  for (const lang of ['ar', 'en'] as const) {
    test(`sadr and ajuz share a row at 375px in ${lang}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 })
      const lesson = lessonsWithMutoon.find(citesLines)!
      await page.goto(`/#/lesson/${lesson.id}`)

      const html = page.locator('html')
      if ((await html.getAttribute('lang')) !== lang) {
        await page.locator('.lang-toggle').click()
        await expect(html).toHaveAttribute('lang', lang)
      }

      const panel = page.locator('details.matn-panel')
      await panel.locator('summary').click()
      const firstLine = panel.locator('.matn-line').first()
      await expect(firstLine).toBeVisible()

      const sadrBox = await firstLine.locator('.matn-sadr').boundingBox()
      const ajuzBox = await firstLine.locator('.matn-ajuz').boundingBox()
      expect(sadrBox).not.toBeNull()
      expect(ajuzBox).not.toBeNull()
      // Same row, not stacked: their tops are within a couple of pixels of each other (a stacked
      // layout would differ by a full line height, tens of pixels).
      expect(Math.abs(sadrBox!.y - ajuzBox!.y)).toBeLessThan(3)
    })
  }
})
