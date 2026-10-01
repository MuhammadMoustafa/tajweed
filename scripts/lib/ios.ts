/**
 * The pure parts of the iOS build on GitHub Actions (.github/workflows/ios.yml, through
 * scripts/ios-ci.ts): the environment the xcodebuild steps read, and which simulator the smoke
 * test boots. Version arithmetic is src/update/version.ts, asset names src/update/releases.ts.
 */
import { IPA_ASSET_NAME } from '../../src/update/releases.ts'
import { iosBuildSettings } from '../../src/update/version.ts'

/** `KEY=value` lines for $GITHUB_ENV: the app version, its iOS build settings and the .ipa's name. */
export function iosBuildEnv(version: string): string {
  const env = { APP_VERSION: version, ...iosBuildSettings(version), IPA_NAME: IPA_ASSET_NAME }
  return Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
}

/** One device in `xcrun simctl list devices available --json`. */
export interface SimDevice {
  udid: string
  name: string
  isAvailable?: boolean
  state?: string
}

/** The whole `xcrun simctl list devices --json` output: devices keyed by runtime identifier. */
export interface SimDeviceList {
  devices: Record<string, SimDevice[]>
}

export interface PickedSimulator extends SimDevice {
  runtime: string
}

const IOS_RUNTIME = /SimRuntime\.iOS-(\d+)-(\d+)(?:-(\d+))?$/

/** [major, minor, patch] of an iOS runtime identifier, or undefined for watchOS/tvOS/visionOS. */
function iosRuntimeVersion(runtime: string): number[] | undefined {
  const match = IOS_RUNTIME.exec(runtime)
  return match ? [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)] : undefined
}

/** The model number in a device name ("iPhone 17 Pro" -> 17); 0 for names without one ("iPhone Air"). */
const modelNumber = (name: string) => Number(/^iPhone (\d+)/.exec(name)?.[1] ?? 0)

const compareNumbers = (a: number[], b: number[]) => a.reduce((diff, n, i) => diff || n - (b[i] ?? 0), 0)

/**
 * The newest available iPhone simulator: the newest iOS runtime that has one, then the highest
 * model number on it (ties broken by name, so the choice is stable). Never a hard-coded model, since
 * runner images change which devices they ship. Throws, listing the runtimes seen, when there is none.
 */
export function pickSimulator(list: SimDeviceList): PickedSimulator {
  const candidates: { device: PickedSimulator; version: number[] }[] = []
  for (const [runtime, devices] of Object.entries(list.devices)) {
    const version = iosRuntimeVersion(runtime)
    if (!version) continue
    for (const device of devices) {
      if (device.isAvailable === false || !device.name.startsWith('iPhone')) continue
      candidates.push({ device: { ...device, runtime }, version })
    }
  }
  candidates.sort(
    (a, b) =>
      compareNumbers(b.version, a.version) ||
      modelNumber(b.device.name) - modelNumber(a.device.name) ||
      a.device.name.localeCompare(b.device.name),
  )
  const best = candidates[0]
  if (!best) {
    const runtimes = Object.keys(list.devices).join(', ') || 'none'
    throw new Error(`No available iPhone simulator. Runtimes listed: ${runtimes}`)
  }
  return best.device
}
