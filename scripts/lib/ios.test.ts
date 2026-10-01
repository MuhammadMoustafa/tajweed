import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { iosBuildEnv, pickSimulator, type SimDeviceList } from './ios'

const RUNTIME = 'com.apple.CoreSimulator.SimRuntime.'

describe('iosBuildEnv', () => {
  it('gives the version, its iOS build settings and the .ipa name as KEY=value lines', () => {
    expect(iosBuildEnv('0.3.1').split('\n')).toEqual([
      'APP_VERSION=0.3.1',
      'MARKETING_VERSION=0.3.1',
      'CURRENT_PROJECT_VERSION=301',
      'IPA_NAME=tajweed.ipa',
    ])
  })
})

describe('pickSimulator', () => {
  const list: SimDeviceList = {
    devices: {
      [`${RUNTIME}iOS-18-5`]: [
        { udid: 'old-17', name: 'iPhone 17 Pro', isAvailable: true },
        { udid: 'old-ipad', name: 'iPad Air 11-inch (M3)', isAvailable: true },
      ],
      [`${RUNTIME}iOS-26-0`]: [
        { udid: 'air', name: 'iPhone Air', isAvailable: true },
        { udid: 'p17', name: 'iPhone 17 Pro', isAvailable: true },
        { udid: 'p16e', name: 'iPhone 16e', isAvailable: true },
        { udid: 'ipad', name: 'iPad Pro 13-inch (M5)', isAvailable: true },
      ],
      [`${RUNTIME}iOS-26-1`]: [{ udid: 'gone', name: 'iPhone 18', isAvailable: false }],
      [`${RUNTIME}watchOS-26-0`]: [{ udid: 'watch', name: 'Apple Watch Series 11 (46mm)', isAvailable: true }],
    },
  }

  it('takes the newest iOS runtime that has an available iPhone, then the highest model on it', () => {
    expect(pickSimulator(list)).toMatchObject({ udid: 'p17', name: 'iPhone 17 Pro', runtime: `${RUNTIME}iOS-26-0` })
  })

  it('compares runtime versions as numbers, not strings', () => {
    const picked = pickSimulator({
      devices: {
        [`${RUNTIME}iOS-9-3`]: [{ udid: 'nine', name: 'iPhone 6s' }],
        [`${RUNTIME}iOS-18-2-1`]: [{ udid: 'eighteen', name: 'iPhone 16' }],
      },
    })
    expect(picked.udid).toBe('eighteen')
  })

  it('fails naming the runtimes it saw when there is no iPhone', () => {
    expect(() => pickSimulator({ devices: { [`${RUNTIME}iOS-26-0`]: [{ udid: 'ipad', name: 'iPad mini (A17 Pro)' }] } })).toThrow(
      /No available iPhone simulator\. Runtimes listed: .*iOS-26-0/,
    )
    expect(() => pickSimulator({ devices: {} })).toThrow(/Runtimes listed: none/)
  })
})

describe('.github/workflows/ios.yml', () => {
  // CRLF on a Windows checkout (core.autocrlf): compare as LF.
  const workflow = readFileSync(new URL('../../.github/workflows/ios.yml', import.meta.url), 'utf8').replace(/\r\n/g, '\n')

  it('takes the version and the .ipa name from scripts/ios-ci.ts, never typed in', () => {
    expect(workflow).toMatch(/lines=\$\(npx tsx scripts\/ios-ci\.ts env\)/)
    expect(workflow).toMatch(/echo "\$lines" >> "\$GITHUB_ENV"/)
    expect(workflow).toMatch(/MARKETING_VERSION="\$MARKETING_VERSION"/)
    expect(workflow).toMatch(/CURRENT_PROJECT_VERSION="\$CURRENT_PROJECT_VERSION"/)
    expect(workflow).not.toMatch(/tajweed\.ipa/)
  })

  it('picks the simulator by script and fails a step on any error', () => {
    expect(workflow).toMatch(/scripts\/ios-ci\.ts pick-simulator/)
    expect(workflow).toMatch(/shell: bash --noprofile --norc -euo pipefail \{0\}/)
  })

  it('touches releases only on a tag push, with write access only in that job', () => {
    expect(workflow).toMatch(/^permissions:\n {2}contents: read$/m)
    expect(workflow).toMatch(/if: github\.event_name == 'push' && startsWith\(github\.ref, 'refs\/tags\/v'\)/)
    expect(workflow.match(/contents: write/g)).toHaveLength(1)
    expect(workflow).toMatch(/gh release upload "\$TAG" "upload\/\$IPA_NAME" --clobber/)
  })
})
