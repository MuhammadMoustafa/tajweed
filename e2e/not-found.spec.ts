import { expect, test } from '@playwright/test'
import { ui } from '../src/i18n/ui'

test('an unknown lesson id shows the not-found message', async ({ page }) => {
  await page.goto('/#/lesson/does-not-exist')
  const lang = await page.locator('html').getAttribute('lang')
  const expected = ui.lessonNotFound[lang === 'ar' ? 'ar' : 'en']
  await expect(page.getByText(expected)).toBeVisible()
})
