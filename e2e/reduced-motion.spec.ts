import { expect, test } from '@playwright/test'
import { ANIMATIONS } from '../src/animations'
import { LESSONS } from '../src/lessons'
import { blockReciterAudio } from './reciter-audio'

// Per-clip frame checks: each clip tweens within a step by default and shows each step's end
// state, untweened, with reduced motion, while the player's controls keep working.
const withClip = (id: string) => LESSONS.filter((l) => l.animation === id)
const withSectionClip = (id: string) => LESSONS.filter((l) => l.sections.some((s) => s.animation === id))

test.describe('qalqalah clip and reduced motion', () => {
  // Its first step plays a recited word; keep the timing off the network.
  test.use({ serviceWorkers: 'block' })
  test.beforeEach(({ page }) => blockReciterAudio(page))

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

// natural-madd (MaddBar, src/animations/MaddBar.tsx): one syllable per step, its arrow pointing at
// the madd letter and its bar anchored underneath, filling one count at a time then holding at 2.
test.describe('natural madd clip and reduced motion', () => {
  // Its last step plays a recited word; keep the timing off the network.
  test.use({ serviceWorkers: 'block' })
  test.beforeEach(({ page }) => blockReciterAudio(page))

  for (const lesson of withClip('natural-madd')) {
    test(`${lesson.id} clip points an arrow at the madd letter, shows start/end markers, and fills its bar while playing`, async ({
      page,
    }) => {
      await page.goto(`/#/lesson/${lesson.id}`)
      const player = page.locator('.animation .player')
      await expect(player.locator('.madd-bar[data-current]')).toHaveCount(1)
      await expect(player.locator('.madd-bar-arrow')).toHaveCount(1)
      await expect(player.locator('[data-marker="start"]')).toHaveCount(1)
      await expect(player.locator('[data-marker="end"]')).toHaveAttribute('data-beat', '2')
      const fill = player.locator('.madd-bar-fill')
      await expect(fill).toHaveAttribute('width', '0')
      await player.getByRole('button', { name: 'Play', exact: true }).click()
      await expect(fill).not.toHaveAttribute('width', '0')
    })

    // Step 1 gets ready (empty bar), steps 2-3 count one/two (landing the pulse on beat 1, then
    // beat 2 at the end marker), step 4 stops (full bar, no running pulse) — see #34.
    test(`${lesson.id} clip steps through get-ready, count one, count two and stop, with reduced motion`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`/#/lesson/${lesson.id}`)
      const player = page.locator('.animation .player')

      await expect(player).toHaveAttribute('data-step', '0')
      await expect(player.locator('.madd-bar-fill')).toHaveAttribute('width', '0')
      await expect(player.locator('.madd-bar-pulse')).toHaveCount(0)

      await player.getByRole('button', { name: 'Next step' }).click()
      await expect(player).toHaveAttribute('data-step', '1')
      await expect(player.locator('.madd-bar-pulse')).toHaveAttribute('data-beat', '1')

      await player.getByRole('button', { name: 'Next step' }).click()
      await expect(player).toHaveAttribute('data-step', '2')
      await expect(player.locator('.madd-bar-fill')).toHaveAttribute('width', '200')
      await expect(player.locator('.madd-bar-count')).toHaveText('2')
      await expect(player.locator('.madd-bar-pulse')).toHaveAttribute('data-beat', '2')

      await player.getByRole('button', { name: 'Next step' }).click()
      await expect(player).toHaveAttribute('data-step', '3')
      await expect(player.locator('.madd-bar-fill')).toHaveAttribute('width', '200')
      await expect(player.locator('[data-stopped]')).toHaveCount(1)
      await expect(player.locator('.madd-bar-pulse')).toHaveCount(0)
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

// madd-muttasil / madd-munfasil (src/animations/MaddObligatory.tsx, L14): the same MaddBar
// counting demo as natural-madd, but 4 counts, colored madd-obligatory, and with the hamza that
// causes the madd shown next to the letter — adjacent for muttasil, with a gap for munfasil.
test.describe('madd-obligatory clips and reduced motion', () => {
  for (const [id, expectAfterGap] of [
    ['madd-muttasil', false],
    ['madd-munfasil', true],
  ] as const) {
    for (const lesson of withSectionClip(id)) {
      test(`${lesson.id} ${id} section player shows the hamza${expectAfterGap ? ', with a word gap,' : ''} and counts to 4`, async ({
        page,
      }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.goto(`/#/lesson/${lesson.id}`)
        const player = page.getByRole('group', { name: ANIMATIONS[id].title.en })
        await expect(player.locator('[data-marker="end"]')).toHaveAttribute('data-beat', '4')
        await expect(player.locator('.madd-bar-after')).not.toBeEmpty()

        for (let i = 0; i < 4; i += 1) await player.getByRole('button', { name: 'Next step' }).click()
        await expect(player).toHaveAttribute('data-step', '4')
        await expect(player.locator('.madd-bar-fill')).toHaveAttribute('width', '200')
        await expect(player.locator('.madd-bar-pulse')).toHaveAttribute('data-beat', '4')
      })
    }
  }
})
