/**
 * The app's version strings (semver `major.minor.patch`, optionally `-prerelease`): parsing,
 * comparing, bumping, the Android versionCode and the iOS version numbers. Pure, shared by the
 * update check (src/update/), the release script (scripts/release.ts) and the iOS build
 * (scripts/ios-ci.ts). package.json's `version` is the only source of the version itself: Vite
 * defines it as `__APP_VERSION__` (src/update/appVersion.ts), android/app/build.gradle reads it for
 * versionName/versionCode, and .github/workflows/ios.yml passes iosBuildSettings to xcodebuild.
 */

export interface Version {
  major: number
  minor: number
  patch: number
  /** The part after `-` (e.g. `preview` in `0.1.0-preview`), or '' for a release. */
  prerelease: string
}

const VERSION_PATTERN = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/

/** Parses `1.2.3`, `v1.2.3` or `1.2.3-preview`; undefined for anything else. */
export function parseVersion(text: string): Version | undefined {
  const match = VERSION_PATTERN.exec(text.trim())
  if (!match) return undefined
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]), prerelease: match[4] ?? '' }
}

export const formatVersion = (v: Version): string =>
  `${v.major}.${v.minor}.${v.patch}${v.prerelease ? `-${v.prerelease}` : ''}`

/**
 * Negative when `a` is older than `b`, 0 when equal, positive when newer. A prerelease is older
 * than its release (`0.2.0-preview` < `0.2.0`). Throws on a string that is not a version.
 */
export function compareVersions(a: string, b: string): number {
  const va = mustParse(a)
  const vb = mustParse(b)
  const byNumber = va.major - vb.major || va.minor - vb.minor || va.patch - vb.patch
  if (byNumber !== 0) return byNumber
  if (va.prerelease === vb.prerelease) return 0
  if (!va.prerelease) return 1
  if (!vb.prerelease) return -1
  return comparePrerelease(va.prerelease, vb.prerelease)
}

/** Semver precedence: dot-separated identifiers left to right; numeric ones compare as numbers and
 *  rank below alphanumeric ones (compared as text); when all shared identifiers are equal the
 *  shorter list is older. */
function comparePrerelease(a: string, b: string): number {
  const ia = a.split('.')
  const ib = b.split('.')
  for (let i = 0; i < Math.min(ia.length, ib.length); i++) {
    const x = ia[i]
    const y = ib[i]
    if (x === y) continue
    const xNumeric = /^\d+$/.test(x)
    const yNumeric = /^\d+$/.test(y)
    if (xNumeric && yNumeric) return Number(x) < Number(y) ? -1 : 1
    if (xNumeric !== yNumeric) return xNumeric ? -1 : 1
    return x < y ? -1 : 1
  }
  return ia.length - ib.length
}

/** True when `candidate` is a valid version newer than `current`; false for anything unparsable. */
export function isNewerVersion(candidate: string, current: string): boolean {
  if (!parseVersion(candidate) || !parseVersion(current)) return false
  return compareVersions(candidate, current) > 0
}

export type BumpKind = 'patch' | 'minor' | 'major'

/**
 * The version a release of `current` gets: `patch`/`minor`/`major` bump it (dropping any
 * prerelease), an explicit `x.y.z` must not be older than `current` (equal releases the current
 * version as it is, e.g. the first release after package.json was set by hand).
 */
export function nextVersion(current: string, request: BumpKind | string): string {
  const v = mustParse(current)
  let next: Version
  if (request === 'patch') next = { ...v, patch: v.prerelease ? v.patch : v.patch + 1, prerelease: '' }
  else if (request === 'minor') next = { major: v.major, minor: v.minor + 1, patch: 0, prerelease: '' }
  else if (request === 'major') next = { major: v.major + 1, minor: 0, patch: 0, prerelease: '' }
  else {
    const explicit = parseVersion(request)
    if (!explicit || request.startsWith('v')) {
      throw new Error(`Expected patch, minor, major or a version like 1.2.3, got "${request}"`)
    }
    if (compareVersions(request, current) < 0) {
      throw new Error(`Version ${request} is older than the current ${current}`)
    }
    next = explicit
  }
  versionCode(formatVersion(next)) // validates the range
  return formatVersion(next)
}

/** Android's versionCode, mirroring android/app/build.gradle: major*10000 + minor*100 + patch. */
export function versionCode(version: string): number {
  const v = mustParse(version)
  if (v.minor > 99 || v.patch > 99) {
    throw new Error(`Version ${version}: minor and patch must stay below 100 (Android versionCode is major*10000 + minor*100 + patch)`)
  }
  return v.major * 10000 + v.minor * 100 + v.patch
}

/**
 * The iOS app's version as xcodebuild build settings, which ios/App/App/Info.plist reads:
 * MARKETING_VERSION is CFBundleShortVersionString (digits and dots only, so a prerelease suffix is
 * dropped) and CURRENT_PROJECT_VERSION is CFBundleVersion, the same number as Android's versionCode.
 */
export function iosBuildSettings(version: string): { MARKETING_VERSION: string; CURRENT_PROJECT_VERSION: string } {
  const v = mustParse(version)
  return { MARKETING_VERSION: `${v.major}.${v.minor}.${v.patch}`, CURRENT_PROJECT_VERSION: String(versionCode(version)) }
}

function mustParse(text: string): Version {
  const v = parseVersion(text)
  if (!v) throw new Error(`Not a version: "${text}"`)
  return v
}
