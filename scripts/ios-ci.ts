/**
 * Helpers for the iOS build on GitHub Actions (.github/workflows/ios.yml); the logic is in
 * scripts/lib/ios.ts. Run with tsx:
 *
 *   npx tsx scripts/ios-ci.ts env              # KEY=value lines for $GITHUB_ENV: APP_VERSION,
 *                                              # MARKETING_VERSION, CURRENT_PROJECT_VERSION, IPA_NAME
 *   xcrun simctl list devices available --json | npx tsx scripts/ios-ci.ts pick-simulator
 *                                              # prints the newest iPhone simulator's UDID
 */
import { readFile } from 'node:fs/promises'
import { iosBuildEnv, pickSimulator, type SimDeviceList } from './lib/ios.ts'
import { rootPath } from './lib/run.ts'

async function readStdin(): Promise<string> {
  let text = ''
  process.stdin.setEncoding('utf8')
  for await (const chunk of process.stdin) text += chunk
  return text
}

const command = process.argv[2]
if (command === 'env') {
  const { version } = JSON.parse(await readFile(rootPath('package.json'), 'utf8')) as { version: string }
  console.log(iosBuildEnv(version))
} else if (command === 'pick-simulator') {
  const picked = pickSimulator(JSON.parse(await readStdin()) as SimDeviceList)
  // The UDID alone on stdout (for $(...)); what was picked goes to the log on stderr.
  console.error(`Picked simulator: ${picked.name} (${picked.runtime}) ${picked.udid}`)
  console.log(picked.udid)
} else {
  console.error('Usage: npx tsx scripts/ios-ci.ts <env|pick-simulator>')
  process.exit(2)
}
