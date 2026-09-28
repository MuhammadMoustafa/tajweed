import { expect, test } from '@playwright/test'
import { ANIMATIONS } from '../src/animations'
import { LESSONS } from '../src/lessons'

// Per-clip frame checks: each clip tweens within a step by default and shows each step's end
// state, untweened, with reduced motion, while the player's controls keep working.
const withClip = (id: string) => LESSONS.filter((l) => l.animation === id)
const withSectionClip = (id: string) => LESSONS.filter((l) => l.sections.some((s) => s.animation === id))

test.describe('qalqalah clip and reduced motion', () => {
  for (const lesson of withClip('qalqalah-bounce')) {
    test(`${lesson.id} clip points at a letter and sends echo circles while playing`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)
      const player = page.locator('.animation .player')
      await expect(player.locator('.qalqalah-frame [data-current]')).toHaveCount(1)
      await player.getByRole('button', { name: 'Play', exact: true }).click()
      await expect(player.locator('.qalqalah-frame circle').first()).toBeVisible()
    })

    test(`${lesson.id} clip steps without echo circles with reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/#/lesson/${lesson.id}`)
      const player = page.locator('.animation .player')
      await player.getByRole('button', { name: 'Next step' }).click()
      await expect(player).toHaveAttribute('data-step', '1')
      await expect(player.locator('.qalqalah-frame [data-current]')).toHaveCount(1)
      await player.getByRole('button', { name: 'Play', exact: true }).click()
      await expect(player).toHaveAttribute('data-step', '2', { timeout: 5000 })
      await expect(player.locator('.qalqalah-frame circle')).toHaveCount(0)
    })
  }
})

// natural-madd (MaddBar, src/animations/MaddBar.tsx): three bars, the current one filling.
test.describe('natural madd clip and reduced motion', () => {
  for (const lesson of withClip('natural-madd')) {
    test(`${lesson.id} clip fills the current bar while playing`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)
      const player = page.locator('.animation .player')
      await expect(player.locator('.madd-bar')).toHaveCount(3)
      const fill = player.locator('.madd-bar[data-current] .madd-bar-fill')
      await expect(fill).toHaveAttribute('width', '0')
      await player.getByRole('button', { name: 'Play', exact: true }).click()
      await expect(fill).not.toHaveAttribute('width', '0')
    })

    test(`${lesson.id} clip shows each bar full, untweened, with reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/#/lesson/${lesson.id}`)
      const player = page.locator('.animation .player')
      await expect(player.locator('.madd-bar[data-current] .madd-bar-fill')).toHaveAttribute('width', '200')
      await player.getByRole('button', { name: 'Next step' }).click()
      const fills = player.locator('.madd-bar-fill')
      await expect(fills.nth(0)).toHaveAttribute('width', '200')
      await expect(fills.nth(1)).toHaveAttribute('width', '200')
      await expect(fills.nth(2)).toHaveAttribute('width', '0')
    })
  }
})

// Each makharij area (src/animations/MakharijClips.tsx) gets its own section player the learner
// controls, so they can replay just the area being taught; expected regions per step mirror the
// unit test in src/animations/MakharijClips.test.tsx.
const MAKHARIJ_AREAS = [
  { id: 'makharij-jawf', firstRegions: ['jawf'], secondRegions: ['jawf'] },
  { id: 'makharij-halq', firstRegions: ['halq-deepest'], secondRegions: ['halq-middle'] },
  { id: 'makharij-lisan', firstRegions: ['palate', 'tongue-back'], secondRegions: ['palate', 'tongue-back'] },
  { id: 'makharij-shafatan', firstRegions: ['lip-lower', 'teeth-upper'], secondRegions: ['lip-lower', 'lip-upper'] },
  { id: 'makharij-khayshum', firstRegions: ['khayshum'] },
] as const

test.describe('makharij clips and reduced motion', () => {
  for (const area of MAKHARIJ_AREAS) {
    for (const lesson of withSectionClip(area.id)) {
      for (const reduced of [false, true]) {
        const suffix = reduced ? ' with reduced motion' : ''
        test(`${lesson.id} ${area.id} section player lights its own region(s)${suffix}`, async ({ page }) => {
          if (reduced) await page.emulateMedia({ reducedMotion: 'reduce' })
          await page.goto(`/#/lesson/${lesson.id}`)
          const player = page.getByRole('group', { name: ANIMATIONS[area.id].title.en })
          const litRegions = () =>
            player
              .locator('[data-lit="true"]')
              .evaluateAll((els) => els.map((el) => el.getAttribute('data-region')).sort())
          await expect(player.locator('.makharij-caption .makharij-letters')).not.toBeEmpty()
          await expect.poll(litRegions).toEqual([...area.firstRegions].sort())

          if ('secondRegions' in area) {
            await player.getByRole('button', { name: 'Next step' }).click()
            await expect(player).toHaveAttribute('data-step', '1')
            await expect.poll(litRegions).toEqual([...area.secondRegions].sort())
          }
        })
      }
    }
  }

  test('the makharij lesson gives each of the five areas its own player, all at once', async ({ page }) => {
    for (const lesson of withSectionClip('makharij-jawf')) {
      await page.goto(`/#/lesson/${lesson.id}`)
      await expect(page.locator('.section-animation .player')).toHaveCount(MAKHARIJ_AREAS.length)
      // No lesson-level clip alongside the per-section ones (see makharij.test.ts).
      await expect(page.locator('.lesson-body > .card.animation')).toHaveCount(0)
    }
  })
})
