import { expect, test, type Page } from '@playwright/test'
import { LESSONS } from '../src/lessons'
import { hasQuiz } from '../src/lessons/quiz'

// Iterates LESSONS so a newly added lesson's quiz page is covered automatically.
test.describe('quiz page', () => {
  for (const lesson of LESSONS.filter(hasQuiz)) {
    test(`"${lesson.id}" links to its quiz page and back`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)
      // The quiz lives on its own page now, not at the end of the lesson.
      await expect(page.locator('.quiz')).toHaveCount(0)

      await page.locator('.test-yourself').click()
      await expect(page).toHaveURL(new RegExp(`#/lesson/${lesson.id}/quiz$`))
      await expect(page.locator('.quiz-question').first()).toBeVisible()

      await page.locator('.quiz-page .back').click()
      await expect(page).toHaveURL(new RegExp(`#/lesson/${lesson.id}$`))
      await expect(page.locator('.test-yourself')).toBeVisible()
    })
  }

  test('flags unanswered questions, then scores a full attempt', async ({ page }) => {
    const lesson = LESSONS.find((l) => l.focusRules.length > 0)!
    await page.goto(`/#/lesson/${lesson.id}/quiz`)
    const questions = page.locator('.quiz-question')
    await expect(questions.first()).toBeVisible()
    const count = await questions.count()

    const check = page.locator('.quiz-actions button')
    await check.click()
    await expect(page.locator('.quiz-actions [role="status"]')).toBeVisible()
    await expect(page.locator('.quiz-question.unanswered')).toHaveCount(count)
    await expect(page.locator('.quiz-score')).toHaveCount(0)

    await answerAll(page)
    await check.click()
    await expect(page.locator('.quiz-question.unanswered')).toHaveCount(0)
    await expect(page.locator('.quiz-feedback')).toHaveCount(count)
    await expect(page.locator('.quiz-score')).toBeVisible()
  })

  test('the difficulty selector changes the drawn questions', async ({ page }) => {
    const lesson = LESSONS.find((l) => l.focusRules.length > 0)!
    await page.goto(`/#/lesson/${lesson.id}/quiz`)
    const verses = () =>
      page.locator('.quiz-question[data-verse]').evaluateAll((els) => els.map((el) => el.getAttribute('data-verse')))
    await expect(page.locator('.quiz-question').first()).toBeVisible()
    const easy = await verses()

    const hard = page.locator('.difficulty [role="radio"]').nth(2)
    await hard.click()
    await expect(hard).toHaveAttribute('aria-checked', 'true')
    // Tiers never share a verse for a rule, so the pool questions must change.
    await expect.poll(verses).not.toEqual(easy)
  })
})

/** Taps the first letter of every tap question and picks the first option of every other one. */
async function answerAll(page: Page) {
  for (const question of await page.locator('.quiz-question').all()) {
    const kind = await question.getAttribute('data-kind')
    await question.locator(kind === 'tap' ? '.tap' : '.quiz-option').first().click()
  }
}
