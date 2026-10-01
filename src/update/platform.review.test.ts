import { afterEach, describe, expect, it, vi } from 'vitest'
import { Capacitor } from '@capacitor/core'
import { isNativeApp } from './platform'
import { compareVersions } from './version'

afterEach(() => vi.restoreAllMocks())

// Known defects assert the intended contract; remove `.fails` with the corresponding fix.
describe('2026-10-01 review: native updates', () => {
  it.fails('R4: the APK update gate excludes iOS', () => {
    vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true)
    vi.spyOn(Capacitor, 'getPlatform').mockReturnValue('ios')
    expect(isNativeApp()).toBe(false)
  })

  it.fails('R5: prerelease numeric identifiers compare numerically', () => {
    expect(compareVersions('1.0.0-beta.2', '1.0.0-beta.10')).toBeLessThan(0)
  })
})
