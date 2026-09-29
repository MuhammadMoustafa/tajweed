import { expect, test } from '@playwright/test'
import { LESSONS } from '../src/lessons'
import { UNITS } from '../src/lessons/units'

// Iterates LESSONS so a newly added lesson is covered automatically.
test.describe('home page', () => {
  for (const lesson of LESSONS) {
    test(`links to and opens "${lesson.id}"`, async ({ page }) => {
      await page.goto('/')
      const link = page.locator(`a[href="#/lesson/${lesson.id}"]`)
      // Only the unit holding the next lesson starts open: open this lesson's unit first.
      const unit = page.locator(`.lesson-unit[data-unit="${lesson.unit}"] details`)
      if ((await unit.getAttribute('open')) === null) await unit.locator('summary').click()
      await expect(link).toBeVisible()

      await link.click()
      await expect(page).toHaveURL(new RegExp(`#/lesson/${lesson.id}$`))

      const lang = await page.locator('html').getAttribute('lang')
      const expectedTitle = lesson.title[lang === 'ar' ? 'ar' : 'en']
      await expect(page.getByRole('heading', { level: 2 })).toHaveText(expectedTitle)
    })
  }
})

// Each unit (src/lessons/units.ts) is a collapsible group: a summary with its number and title, and its lessons' links nested under it.
test.describe('home page units', () => {
  for (const [unitId, unit] of Object.entries(UNITS)) {
    test(`shows the "${unitId}" unit heading with its chapters under it`, async ({ page }) => {
      await page.goto('/')
      const lang = (await page.locator('html').getAttribute('lang')) === 'ar' ? 'ar' : 'en'
      const group = page.locator(`.lesson-unit[data-unit="${unitId}"]`)
      await expect(group.locator('summary .lesson-unit-title')).toHaveText(unit.title[lang])
      await group.locator('summary').click() // whatever its start state, one click toggles it
      const open = (await group.locator('details').getAttribute('open')) !== null
      await expect(group.locator('.lesson-card-main').first()).toBeVisible({ visible: open })
      const chapters = LESSONS.filter((l) => l.unit === unitId)
      await expect(group.locator('.lesson-card-main')).toHaveCount(chapters.length)
      for (const [i, chapter] of chapters.entries()) {
        await expect(group.locator('.lesson-card-main').nth(i)).toHaveAttribute('href', `#/lesson/${chapter.id}`)
      }
    })
  }
})
