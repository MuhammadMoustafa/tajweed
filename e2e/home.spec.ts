import { expect, test } from '@playwright/test'
import { LESSONS } from '../src/lessons'

// Iterates LESSONS so a newly added lesson is covered automatically.
test.describe('home page', () => {
  for (const lesson of LESSONS) {
    test(`links to and opens "${lesson.id}"`, async ({ page }) => {
      await page.goto('/')
      const link = page.locator(`a[href="#/lesson/${lesson.id}"]`)
      await expect(link).toBeVisible()

      await link.click()
      await expect(page).toHaveURL(new RegExp(`#/lesson/${lesson.id}$`))

      const lang = await page.locator('html').getAttribute('lang')
      const expectedTitle = lesson.title[lang === 'ar' ? 'ar' : 'en']
      await expect(page.getByRole('heading', { level: 2 })).toHaveText(expectedTitle)
    })
  }
})
