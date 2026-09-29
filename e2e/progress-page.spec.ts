import { expect, test, type Page } from '@playwright/test'
import { LESSONS } from '../src/lessons'
import { hasQuiz } from '../src/lessons/quiz'

/** Taps the first letter of every tap question and picks the first option of every other one. */
async function answerAll(page: Page) {
  // The quiz page is loaded on demand: wait for its questions before listing them.
  await expect(page.locator('.quiz-question').first()).toBeVisible()
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
    const homeCard = page.locator('.lesson-card', { has: page.locator(`a[href="#/lesson/${lesson.id}"]`) })
    await expect(homeCard).toHaveClass(/is-started/)
    await expect(homeCard).not.toHaveClass(/is-learned/)
  })

  test('marking a lesson learned turns its card green and moves the "next" badge', async ({ page }) => {
    const first = LESSONS[0]
    const second = LESSONS[1]
    test.skip(!second, 'needs at least two lessons')

    const cardFor = (id: string) => page.locator('.lesson-card', { has: page.locator(`a[href="#/lesson/${id}"]`) })

    await page.goto('/')
    await expect(cardFor(first.id)).toHaveClass(/is-next/)

    await page.goto(`/#/lesson/${first.id}`)
    await page.locator('.learned-toggle').click()
    await expect(page.locator('.learned-toggle')).toHaveAttribute('aria-pressed', 'true')

    await page.goto('/')
    await expect(cardFor(first.id)).toHaveClass(/is-learned/)
    await expect(cardFor(first.id)).not.toHaveClass(/is-next/)
    await expect(cardFor(second.id)).toHaveClass(/is-next/)

    await page.goto('/#/progress')
    const card = page.locator('.progress-lesson', { has: page.locator(`a[href="#/lesson/${first.id}"]`) })
    await expect(card).toContainText('Learned')
  })

  test('a new card\'s quiz side panel is a "Take the quiz" link to the quiz page', async ({ page }) => {
    const lesson = LESSONS.find(hasQuiz)!
    await page.goto('/')

    const card = page.locator('.lesson-card', { has: page.locator(`a[href="#/lesson/${lesson.id}"]`) })
    const quizLink = card.locator('.lesson-card-quiz-link')
    await expect(quizLink).toBeVisible()
    await expect(quizLink).toHaveAttribute('href', `#/lesson/${lesson.id}/quiz`)
  })

  test('after a quiz the card shows the grade and a "Retry quiz" link that opens the quiz page', async ({ page }) => {
    const lesson = LESSONS.find(hasQuiz)!

    await page.goto(`/#/lesson/${lesson.id}/quiz`)
    await answerAll(page)
    await page.locator('.quiz-actions button').click()
    await expect(page.locator('.quiz-score')).toBeVisible()

    await page.goto('/')
    const card = page.locator('.lesson-card', { has: page.locator(`a[href="#/lesson/${lesson.id}"]`) })
    await expect(card.locator('.lesson-card-quiz-link')).toHaveCount(0)
    await expect(card.locator('.lesson-card-grade-best')).toBeVisible()

    const retry = card.locator('.lesson-card-retry')
    await expect(retry).toHaveAttribute('href', `#/lesson/${lesson.id}/quiz`)
    await retry.click()
    await expect(page).toHaveURL(new RegExp(`#/lesson/${lesson.id}/quiz$`))
  })

  test('a learned card\'s computed background differs from a plain card\'s, in both color schemes', async ({ page }) => {
    const [first, second] = LESSONS
    test.skip(!second, 'needs at least two lessons')

    await page.goto(`/#/lesson/${first.id}`)
    await page.locator('.learned-toggle').click()

    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme })
      await page.goto('/')

      const learnedCard = page.locator('.lesson-card', { has: page.locator(`a[href="#/lesson/${first.id}"]`) })
      const plainCard = page.locator('.lesson-card', { has: page.locator(`a[href="#/lesson/${second.id}"]`) })
      const [learnedBg, plainBg] = await Promise.all([
        learnedCard.evaluate((el) => getComputedStyle(el).backgroundColor),
        plainCard.evaluate((el) => getComputedStyle(el).backgroundColor),
      ])
      expect(learnedBg).not.toBe(plainBg)
    }
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
