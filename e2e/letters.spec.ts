import { expect, test } from '@playwright/test'
import { LETTER_WORDS } from '../src/animations/words'
import { getWord } from '../src/data/quran'
import { LETTER_IDS } from '../src/letters/ids'
import { blockReciterAudio } from './reciter-audio'

// L25 (#52): the letters page and a card per letter. Unit tests cover each card's data; this checks
// the pages in the browser: reached from the header, every letter a link, a card's qualities and
// clip, in both languages at phone width without sideways scrolling.
const letters = Object.keys(LETTER_IDS) as (keyof typeof LETTER_IDS)[]

test.use({ serviceWorkers: 'block' })
test.beforeEach(({ page }) => blockReciterAudio(page))

test('the header links to the letters page, which lists every letter as a card link', async ({ page }) => {
  await page.goto('/')
  await page.locator('.letters-link').click()
  await expect(page).toHaveURL(/#\/letters$/)
  const cards = page.locator('.letter-grid a.letter-card')
  await expect(cards).toHaveCount(letters.length)
  for (const letter of letters) {
    await expect(page.locator(`.letter-grid a[href="#/letters/${LETTER_IDS[letter]}"]`)).toHaveCount(1)
  }
})

test('no letter on the letters page reaches into its name (tails of ج ح خ ع غ م ي)', async ({ page }) => {
  await page.goto('/#/letters')
  await expect(page.locator('.letter-grid a.letter-card')).toHaveCount(letters.length)
  await page.evaluate(() => document.fonts.ready)
  // A span's box is its line box, not its ink: measure each glyph's ink with the font it is drawn in.
  const clashes = await page.evaluate(() => {
    const ctx = document.createElement('canvas').getContext('2d')!
    return [...document.querySelectorAll('.letter-card')].flatMap((card) => {
      const glyph = card.querySelector<HTMLElement>('.letter-card-glyph')!
      const style = getComputedStyle(glyph)
      ctx.font = `${style.fontSize} ${style.fontFamily}`
      const ink = ctx.measureText(glyph.textContent!.trim())
      const lineHeight = parseFloat(style.lineHeight)
      const box = glyph.getBoundingClientRect()
      const baseline =
        box.top + parseFloat(style.paddingTop) + (lineHeight - ink.fontBoundingBoxAscent - ink.fontBoundingBoxDescent) / 2 + ink.fontBoundingBoxAscent
      const nameTop = card.querySelector('strong')!.getBoundingClientRect().top
      const cardTop = card.getBoundingClientRect().top
      const clash = baseline + ink.actualBoundingBoxDescent > nameTop || baseline - ink.actualBoundingBoxAscent < cardTop
      return clash ? [glyph.textContent!.trim()] : []
    })
  })
  expect(clashes).toEqual([])
})

for (const lang of ['ar', 'en'] as const) {
  test(`a letter card shows its qualities and a clip ending on its word, at 375px in ${lang}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/#/letters')
    const html = page.locator('html')
    if ((await html.getAttribute('lang')) !== lang) {
      await page.locator('.lang-toggle').click()
      await expect(html).toHaveAttribute('lang', lang)
    }

    await page.locator('a[href="#/letters/ba"]').click()
    await expect(page).toHaveURL(/#\/letters\/ba$/)
    await expect(page.locator('.letter-sifat li').first()).toBeVisible()

    const player = page.locator('.animation .player')
    await player.getByRole('slider', { name: /./ }).press('End')
    await expect(player.locator('.anim-word')).toHaveText(getWord(LETTER_WORDS['ب'])!.text)
    await expect(player).toHaveAttribute('data-audio-src', /\.mp3#t=/)

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
}
