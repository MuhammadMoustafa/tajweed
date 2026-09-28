import { expect, test } from '@playwright/test'

// L16 (src/lessons/other-madd.ts, src/animations/OtherMadd.tsx): one clip per section on MaddBar.
// The ʿarid lis-sukun clip points at its cause, then offers 2, 4 and 6 counts as labeled choices;
// clicking a choice's label jumps to that pass, whose end marker sits at its length.
test.describe('other madd clips', () => {
  test('the ʿarid clip starts on its cause and jumps to each length from its label', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/#/lesson/other-madd')
    const player = page.getByRole('group', { name: 'Madd ʿarid lis-sukun: choose 2, 4 or 6' })
    await expect(player.locator('[data-cause="after"]')).toHaveCount(1)
    await expect(player.locator('.madd-bar-fill')).toHaveAttribute('width', '0')

    for (const [label, counts] of [
      ['Qasr: 2 counts', '2'],
      ['Tawassut: 4 counts', '4'],
      ['Tul: 6 counts', '6'],
    ] as const) {
      await player.getByRole('button', { name: label }).click()
      await expect(player.getByRole('button', { name: label })).toHaveAttribute('data-current')
      await expect(player.locator('[data-marker="end"]')).toHaveAttribute('data-beat', counts)
    }
  })

  test('every section plays its own clip, in Arabic too', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('tajweed.locale', 'ar'))
    await page.goto('/#/lesson/other-madd')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.locator('.section-animation .player')).toHaveCount(5)
    const silah = page.getByRole('group', { name: 'مد الصلة: الصغرى والكبرى' })
    await silah.getByRole('button', { name: 'الكبرى: ٥ حركات' }).click()
    await expect(silah.locator('[data-marker="end"]')).toHaveAttribute('data-beat', '5')
    await expect(silah.locator('.madd-bar-after')).toHaveText('أَ')
  })
})
