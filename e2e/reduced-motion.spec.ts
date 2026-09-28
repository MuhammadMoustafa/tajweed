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

// Makharij clips (src/animations/MakharijClips.tsx): one step per makhraj, lighting its point;
// within a step each letter shows on its own in turn, and the end frame (all a reduced-motion
// learner sees) shows the makhraj's letters all together. Expected regions per step mirror the
// unit test in src/animations/MakharijClips.test.tsx.
const MAKHARIJ_CLIPS = [
  { id: 'makharij-areas', firstRegions: ['jawf'], secondRegions: ['halq-closest', 'halq-deepest', 'halq-middle'] },
  { id: 'makharij-jawf', firstRegions: ['jawf'] },
  { id: 'makharij-halq', firstRegions: ['halq-deepest'], secondRegions: ['halq-middle'] },
  { id: 'makharij-lisan', firstRegions: ['palate', 'tongue-back'], secondRegions: ['palate', 'tongue-back'] },
  { id: 'makharij-shafatan', firstRegions: ['lip-lower', 'teeth-upper'], secondRegions: ['lip-lower', 'lip-upper'] },
  { id: 'makharij-khayshum', firstRegions: ['khayshum'] },
] as const

test.describe('makharij clips and reduced motion', () => {
  for (const clip of MAKHARIJ_CLIPS) {
    for (const lesson of [...withClip(clip.id), ...withSectionClip(clip.id)]) {
      for (const reduced of [false, true]) {
        const suffix = reduced ? ' with reduced motion' : ''
        test(`${lesson.id} ${clip.id} player lights its own region(s)${suffix}`, async ({ page }) => {
          if (reduced) await page.emulateMedia({ reducedMotion: 'reduce' })
          await page.goto(`/#/lesson/${lesson.id}`)
          const player = page.getByRole('group', { name: ANIMATIONS[clip.id].title.en })
          const litRegions = () =>
            player
              .locator('[data-lit="true"]')
              .evaluateAll((els) => els.map((el) => el.getAttribute('data-region')).sort())
          const letters = player.locator('.makharij-caption .makharij-letter')
          await expect(letters.first()).not.toBeEmpty()
          await expect.poll(litRegions).toEqual([...clip.firstRegions].sort())
          // A chapter clip starts on its first letter alone; reduced motion shows them all at once.
          if (clip.id !== 'makharij-areas') {
            const current = player.locator('.makharij-letter[data-current]')
            await expect(current).toHaveCount(reduced ? await letters.count() : 1)
            await expect(player.locator('.makharij-letter-name')).not.toBeEmpty()
          }

          if ('secondRegions' in clip) {
            await player.getByRole('button', { name: 'Next step' }).click()
            await expect(player).toHaveAttribute('data-step', '1')
            await expect.poll(litRegions).toEqual([...clip.secondRegions].sort())
          }
        })
      }
    }
  }

  // The unit (src/lessons/makharij*.ts): the intro plays the five-areas overview under its section;
  // each chapter plays its own clip beside the text, with no section players.
  test('the makharij intro shows the overview and each chapter one clip of its own', async ({ page }) => {
    for (const lesson of LESSONS.filter((l) => l.unit === 'makharij')) {
      await page.goto(`/#/lesson/${lesson.id}`)
      const [sectionPlayers, lessonPlayers] = lesson.animation ? [0, 1] : [1, 0]
      await expect(page.locator('.section-animation .player')).toHaveCount(sectionPlayers)
      await expect(page.locator('.card.animation .player')).toHaveCount(lessonPlayers)
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
