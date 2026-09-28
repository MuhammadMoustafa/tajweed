import { expect, test } from '@playwright/test'
import { LESSONS } from '../src/lessons'

test('toggling language sets html lang/dir and persists across reload', async ({ page }) => {
  await page.goto('/')
  const html = page.locator('html')
  const initialLang = await html.getAttribute('lang')
  await expect(html).toHaveAttribute('dir', initialLang === 'ar' ? 'rtl' : 'ltr')

  await page.locator('.lang-toggle').click()
  const newLang = initialLang === 'ar' ? 'en' : 'ar'
  await expect(html).toHaveAttribute('lang', newLang)
  await expect(html).toHaveAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')

  await page.reload()
  await expect(html).toHaveAttribute('lang', newLang)
  await expect(html).toHaveAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')
})

// Iterates LESSONS x both locales so a newly added lesson is covered automatically.
test.describe('lesson titles render in both languages', () => {
  for (const lesson of LESSONS) {
    for (const locale of ['ar', 'en'] as const) {
      test(`${lesson.id} title renders in ${locale}`, async ({ page }) => {
        await page.goto(`/#/lesson/${lesson.id}`)
        const html = page.locator('html')
        const currentLang = await html.getAttribute('lang')
        if (currentLang !== locale) {
          await page.locator('.lang-toggle').click()
          await expect(html).toHaveAttribute('lang', locale)
        }

        expect(lesson.title[locale].trim()).not.toBe('')
        await expect(page.getByRole('heading', { level: 2 })).toHaveText(lesson.title[locale])
      })
    }
  }
})
