import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')
const rule = (selector: string) => css.match(new RegExp(`\\n${selector.replace('.', '\\.')} \\{([^}]*)\\}`))?.[1] ?? ''

// The iOS app (and an iPhone home-screen web app) draws under the status bar and camera cutout:
// the first iOS build's screenshot showed the clock over the header (T29).
describe('the page keeps clear of the iPhone status bar, cutout and home indicator', () => {
  it('extends under them (viewport-fit=cover), so env(safe-area-inset-*) is set', () => {
    expect(html).toMatch(/<meta name="viewport" content="[^"]*viewport-fit=cover/)
  })

  it('pads the header by the top inset and the footer by the bottom inset', () => {
    expect(rule('.app-header')).toContain('env(safe-area-inset-top')
    expect(rule('.app-footer')).toContain('env(safe-area-inset-bottom')
  })
})
