import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { compareVersions, iosBuildSettings, isNewerVersion, nextVersion, parseVersion, versionCode } from './version'

describe('parseVersion', () => {
  it('reads plain, v-prefixed and prerelease versions', () => {
    expect(parseVersion('0.2.0')).toEqual({ major: 0, minor: 2, patch: 0, prerelease: '' })
    expect(parseVersion('v1.10.3')).toEqual({ major: 1, minor: 10, patch: 3, prerelease: '' })
    expect(parseVersion('v0.1.0-preview')).toEqual({ major: 0, minor: 1, patch: 0, prerelease: 'preview' })
  })

  it('rejects anything else', () => {
    for (const text of ['', '1.2', '1.2.3.4', 'latest', '1.2.x']) expect(parseVersion(text)).toBeUndefined()
  })
})

describe('compareVersions', () => {
  it('orders by major, then minor, then patch, numerically', () => {
    expect(compareVersions('0.2.0', '0.10.0')).toBeLessThan(0)
    expect(compareVersions('1.0.0', '0.99.99')).toBeGreaterThan(0)
    expect(compareVersions('0.2.1', '0.2.0')).toBeGreaterThan(0)
    expect(compareVersions('v0.2.0', '0.2.0')).toBe(0)
  })

  it('puts a prerelease before its release', () => {
    expect(compareVersions('0.1.0-preview', '0.1.0')).toBeLessThan(0)
    expect(compareVersions('0.2.0', '0.2.0-preview')).toBeGreaterThan(0)
  })
})

describe('R5: prerelease precedence', () => {
  it('compares numeric identifiers numerically and ranks them below alphanumeric ones', () => {
    expect(compareVersions('1.0.0-beta.2', '1.0.0-beta.10')).toBeLessThan(0)
    expect(compareVersions('1.0.0-alpha', '1.0.0-beta')).toBeLessThan(0)
    expect(compareVersions('1.0.0-1', '1.0.0-alpha')).toBeLessThan(0)
  })
  it('puts a shorter prefix-equal list first, and a prerelease before its release', () => {
    expect(compareVersions('1.0.0-alpha', '1.0.0-alpha.1')).toBeLessThan(0)
    expect(compareVersions('1.0.0-alpha.1', '1.0.0-alpha')).toBeGreaterThan(0)
    expect(compareVersions('0.2.0-preview', '0.2.0')).toBeLessThan(0)
  })
  it('rejects empty identifiers', () => {
    expect(parseVersion('1.0.0-beta..2')).toBeUndefined()
    expect(parseVersion('1.0.0-beta.')).toBeUndefined()
    expect(parseVersion('1.0.0-.beta')).toBeUndefined()
  })
})

describe('isNewerVersion', () => {
  it('is true only for a strictly newer valid version', () => {
    expect(isNewerVersion('v0.3.0', '0.2.0')).toBe(true)
    expect(isNewerVersion('v0.2.0', '0.2.0')).toBe(false)
    expect(isNewerVersion('v0.1.0-preview', '0.2.0')).toBe(false)
    expect(isNewerVersion('garbage', '0.2.0')).toBe(false)
  })
})

describe('nextVersion', () => {
  it('bumps patch, minor and major', () => {
    expect(nextVersion('0.2.0', 'patch')).toBe('0.2.1')
    expect(nextVersion('0.2.5', 'minor')).toBe('0.3.0')
    expect(nextVersion('0.2.5', 'major')).toBe('1.0.0')
  })

  it('takes an explicit version that is not older, including the current one', () => {
    expect(nextVersion('0.2.0', '0.2.0')).toBe('0.2.0')
    expect(nextVersion('0.2.0', '1.4.2')).toBe('1.4.2')
    expect(() => nextVersion('0.2.0', '0.1.9')).toThrow(/older/)
    expect(() => nextVersion('0.2.0', 'v0.3.0')).toThrow(/Expected/)
    expect(() => nextVersion('0.2.0', 'huge')).toThrow(/Expected/)
  })

  it('refuses a version whose versionCode would collide', () => {
    expect(() => nextVersion('0.99.0', 'minor')).toThrow(/below 100/)
  })
})

describe('versionCode', () => {
  it('is major*10000 + minor*100 + patch', () => {
    expect(versionCode('0.2.0')).toBe(200)
    expect(versionCode('1.4.12')).toBe(10412)
    expect(versionCode('0.2.1')).toBeGreaterThan(versionCode('0.2.0'))
    expect(versionCode('0.3.0')).toBeGreaterThan(versionCode('0.2.99'))
  })

  it('matches the formula android/app/build.gradle uses, reading package.json', () => {
    const gradle = readFileSync(new URL('../../android/app/build.gradle', import.meta.url), 'utf8')
    expect(gradle).toMatch(/\.\.\/\.\.\/package\.json/)
    expect(gradle).toMatch(/major \* 10000 \+ minor \* 100 \+ patch/)
  })
})

describe('iosBuildSettings', () => {
  it('gives the marketing version without a prerelease and the versionCode as the build number', () => {
    expect(iosBuildSettings('0.2.0')).toEqual({ MARKETING_VERSION: '0.2.0', CURRENT_PROJECT_VERSION: '200' })
    expect(iosBuildSettings('1.4.12-preview')).toEqual({ MARKETING_VERSION: '1.4.12', CURRENT_PROJECT_VERSION: '10412' })
  })

  it('is what ios/App/App/Info.plist reads', () => {
    const plist = readFileSync(new URL('../../ios/App/App/Info.plist', import.meta.url), 'utf8')
    expect(plist).toMatch(/<key>CFBundleShortVersionString<\/key>\s*<string>\$\(MARKETING_VERSION\)<\/string>/)
    expect(plist).toMatch(/<key>CFBundleVersion<\/key>\s*<string>\$\(CURRENT_PROJECT_VERSION\)<\/string>/)
  })
})
