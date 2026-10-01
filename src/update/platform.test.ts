import { afterEach, describe, expect, it, vi } from 'vitest'
import { Capacitor } from '@capacitor/core'
import { appBuild, isAndroidApp } from './platform'

afterEach(() => vi.restoreAllMocks())

describe('isAndroidApp', () => {
  it.each([
    ['android', true],
    ['ios', false],
    ['web', false],
  ])('R4: %s -> %s', (name, expected) => {
    vi.spyOn(Capacitor, 'getPlatform').mockReturnValue(name)
    expect(isAndroidApp()).toBe(expected)
  })
})

describe('appBuild', () => {
  it.each([
    ['android', 'APK'],
    ['ios', 'iOS app'],
    ['web', 'web'],
  ])('names %s as %s', (name, expected) => {
    vi.spyOn(Capacitor, 'getPlatform').mockReturnValue(name)
    expect(appBuild()).toBe(expected)
  })
})
