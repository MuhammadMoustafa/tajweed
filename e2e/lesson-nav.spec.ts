import { expect, test } from '@playwright/test'
import { LESSONS } from '../src/lessons'

// Iterates LESSONS so a newly added lesson (and its position in the order) is covered
// automatically, including once there is more than one lesson to navigate between.
test.describe('lesson prev/next navigation', () => {
  LESSONS.forEach((lesson, index) => {
    const prev = LESSONS[index - 1]
    const next = LESSONS[index + 1]

    test(`"${lesson.id}" shows the nav links its position allows`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)

      const prevLink = page.locator('.lesson-nav-prev')
      const nextLink = page.locator('.lesson-nav-next')

      if (prev) {
        await expect(prevLink).toBeVisible()
        await expect(prevLink).toHaveAttribute('href', `#/lesson/${prev.id}`)
      } else {
        await expect(prevLink).toHaveCount(0)
      }

      if (next) {
        await expect(nextLink).toBeVisible()
        await expect(nextLink).toHaveAttribute('href', `#/lesson/${next.id}`)
      } else {
        await expect(nextLink).toHaveCount(0)
      }
    })

    if (next) {
      test(`"${lesson.id}" next link opens "${next.id}"`, async ({ page }) => {
        await page.goto(`/#/lesson/${lesson.id}`)
        await page.locator('.lesson-nav-next').click()
        await expect(page).toHaveURL(new RegExp(`#/lesson/${next.id}$`))

        const lang = await page.locator('html').getAttribute('lang')
        await expect(page.getByRole('heading', { level: 2 })).toHaveText(next.title[lang === 'ar' ? 'ar' : 'en'])
      })
    }

    if (prev) {
      test(`"${lesson.id}" previous link opens "${prev.id}"`, async ({ page }) => {
        await page.goto(`/#/lesson/${lesson.id}`)
        await page.locator('.lesson-nav-prev').click()
        await expect(page).toHaveURL(new RegExp(`#/lesson/${prev.id}$`))

        const lang = await page.locator('html').getAttribute('lang')
        await expect(page.getByRole('heading', { level: 2 })).toHaveText(prev.title[lang === 'ar' ? 'ar' : 'en'])
      })
    }
  })
})

test.describe('lesson progress ("mark as learned")', () => {
  const lesson = LESSONS[0]

  test('toggling learned state persists across reload', async ({ page }) => {
    await page.goto(`/#/lesson/${lesson.id}`)
    const toggle = page.locator('.learned-toggle')
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await page.reload()
    await expect(page.locator('.learned-toggle')).toHaveAttribute('aria-pressed', 'true')
  })

  test('learned lessons show a check in the lesson list', async ({ page }) => {
    await page.goto(`/#/lesson/${lesson.id}`)
    await page.locator('.learned-toggle').click()

    await page.goto('/')
    await expect(page.locator(`a[href="#/lesson/${lesson.id}"] .learned-check`)).toBeVisible()
  })
})
