import { expect, test } from '@playwright/test'

test('the footer reaches the About page from home', async ({ page }) => {
  await page.goto('/')
  await page.locator('.app-footer a[href="#/about"]').click()
  await expect(page).toHaveURL(/#\/about$/)
  await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
  await expect(page.locator('.about-page section')).toHaveCount(5)
})

for (const lang of ['ar', 'en'] as const) {
  for (const hash of ['', '#/about']) {
    test(`no horizontal overflow at 375px (${lang}, ${hash || 'home'})`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.addInitScript((l) => localStorage.setItem('tajweed.locale', l), lang)
      await page.goto(`/${hash}`)
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      await expect(page.locator('.app-footer')).toBeVisible()
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }
}
