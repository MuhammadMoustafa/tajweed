import { expect, test, type Page } from '@playwright/test'
import { LESSONS } from '../src/lessons'
import { hasQuiz } from '../src/lessons/quiz'

/** Taps the first letter of every tap question and picks the first option of every other one. */
async function answerAll(page: Page) {
  for (const question of await page.locator('.quiz-question').all()) {
    const kind = await question.getAttribute('data-kind')
    await question.locator(kind === 'tap' ? '.tap' : '.quiz-option').first().click()
  }
}

test.describe('progress page', () => {
  test('the header links to it, and a new learner sees the empty state', async ({ page }) => {
    await page.goto('/')
    await page.locator('.progress-link').click()
    await expect(page).toHaveURL(/#\/progress$/)
    await expect(page.locator('.progress-empty')).toBeVisible()
    await expect(page.locator('.reset-progress')).toHaveCount(0)
  })

  test('taking a quiz shows the attempt on the progress page and starts the home card', async ({ page }) => {
    const lesson = LESSONS.find(hasQuiz)!

    await page.goto(`/#/lesson/${lesson.id}/quiz`)
    await expect(page.locator('.quiz-question').first()).toBeVisible()
    await answerAll(page)
    await page.locator('.quiz-actions button').click()
    await expect(page.locator('.quiz-score')).toBeVisible()

    await page.goto('/#/progress')
    const card = page.locator('.progress-lesson', { has: page.locator(`a[href="#/lesson/${lesson.id}"]`) })
    await expect(card).toContainText('1 attempts')
    await expect(card.locator('.progress-lesson-scores')).toBeVisible()

    await page.goto('/')
    const homeCard = page.locator(`a[href="#/lesson/${lesson.id}"]`)
    await expect(homeCard).toHaveClass(/is-started/)
    await expect(homeCard).not.toHaveClass(/is-learned/)
  })

  test('marking a lesson learned turns its card green and moves the "next" badge', async ({ page }) => {
    const first = LESSONS[0]
    const second = LESSONS[1]
    test.skip(!second, 'needs at least two lessons')

    await page.goto('/')
    await expect(page.locator(`a[href="#/lesson/${first.id}"]`)).toHaveClass(/is-next/)

    await page.goto(`/#/lesson/${first.id}`)
    await page.locator('.learned-toggle').click()
    await expect(page.locator('.learned-toggle')).toHaveAttribute('aria-pressed', 'true')

    await page.goto('/')
    await expect(page.locator(`a[href="#/lesson/${first.id}"]`)).toHaveClass(/is-learned/)
    await expect(page.locator(`a[href="#/lesson/${first.id}"]`)).not.toHaveClass(/is-next/)
    await expect(page.locator(`a[href="#/lesson/${second.id}"]`)).toHaveClass(/is-next/)

    await page.goto('/#/progress')
    const card = page.locator('.progress-lesson', { has: page.locator(`a[href="#/lesson/${first.id}"]`) })
    await expect(card).toContainText('Learned')
  })

  test('reset clears learned lessons and attempts after confirming', async ({ page }) => {
    const lesson = LESSONS[0]
    await page.goto(`/#/lesson/${lesson.id}`)
    await page.locator('.learned-toggle').click()

    await page.goto('/#/progress')
    await page.locator('.reset-progress').click()
    await expect(page.locator('.reset-confirm')).toBeVisible()

    await page.locator('.reset-confirm-yes').click()
    await expect(page.locator('.progress-empty')).toBeVisible()

    await page.goto(`/#/lesson/${lesson.id}`)
    await expect(page.locator('.learned-toggle')).toHaveAttribute('aria-pressed', 'false')
  })
})
