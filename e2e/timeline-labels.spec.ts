import { expect, test } from '@playwright/test'
import { LESSONS } from '../src/lessons'

// T11: labels above the seek bar (ClipStep.label / AnimationPlayer's .player-labels), placed over
// each step's segment, the current one highlighted; clicking one seeks. Narrow screens show only
// the current label. src/animations/player/AnimationPlayer.test.tsx covers the mechanics with a
// synthetic clip; this file checks the real makharij and qalqalah labels, in both languages.

const qalqalahLesson = LESSONS.find((l) => l.animation === 'qalqalah-bounce')!

test.describe('qalqalah timeline labels', () => {
  test('shows each letter label, the current one marked, and clicking one seeks', async ({ page }) => {
    await page.goto(`/#/lesson/${qalqalahLesson.id}`)
    const player = page.locator('.animation .player')
    const qaf = player.getByRole('button', { name: 'Qaf' })
    const ta = player.getByRole('button', { name: 'Ta' })
    await expect(qaf).toHaveAttribute('data-current')
    await expect(ta).not.toHaveAttribute('data-current')

    await ta.click()
    await expect(player).toHaveAttribute('data-step', '1')
    await expect(ta).toHaveAttribute('data-current')
    await expect(qaf).not.toHaveAttribute('data-current')
  })

  test('on a narrow screen, only the current label shows above the bar', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto(`/#/lesson/${qalqalahLesson.id}`)
    const player = page.locator('.animation .player')
    await expect(player.getByRole('button', { name: 'Qaf' })).toBeVisible()
    await expect(player.getByRole('button', { name: 'Ta' })).toBeHidden()

    await player.getByRole('button', { name: 'Next step' }).click()
    await expect(player.getByRole('button', { name: 'Ta' })).toBeVisible()
    await expect(player.getByRole('button', { name: 'Qaf' })).toBeHidden()
  })
})

test.describe('makharij timeline labels', () => {
  // Section order on the makharij lesson (src/lessons/makharij.ts): jawf, halq, lisan, shafatan,
  // khayshum; al-halq (index 1) has one label per step, distinct in both languages.
  test('al-halq step labels render in both languages; clicking one seeks', async ({ page }) => {
    await page.goto('/#/lesson/makharij')
    const player = page.locator('.section-animation .player').nth(1)
    await player.scrollIntoViewIfNeeded()

    const deepestEn = player.getByRole('button', { name: 'Al-halq: the deepest part of the throat' })
    const middleEn = player.getByRole('button', { name: 'Al-halq: the middle of the throat' })
    await expect(deepestEn).toHaveAttribute('data-current')
    await middleEn.click()
    await expect(player).toHaveAttribute('data-step', '1')
    await expect(middleEn).toHaveAttribute('data-current')

    await page.locator('.lang-toggle').click()
    const middleAr = player.getByRole('button', { name: 'وسط الحلق' })
    await expect(middleAr).toHaveAttribute('data-current')
    await expect(player.getByRole('button', { name: 'أقصى الحلق' })).not.toHaveAttribute('data-current')
  })
})
