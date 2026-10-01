/**
 * Publishes a release of the Android app:  npm run release -- <patch|minor|major|x.y.z> [--dry-run]
 *
 * Refuses unless on main, with a clean tree, main equal to origin/main, the tag new and
 * android/keystore.properties present. Then: bumps package.json and package-lock.json (skipped
 * when releasing the version already there), runs `npm run check`, builds the signed APK
 * (scripts/lib/android.ts) to apk/tajweed-<version>.apk, commits "Release v<version>", tags
 * v<version>, pushes main and the tag, and creates the GitHub release with the APK uploaded as
 * tajweed.apk and notes from the commit subjects since the previous v* tag. The APK is its only
 * upload (the notes go in as text); the tag push also starts .github/workflows/ios.yml, which adds
 * the unsigned tajweed.ipa to the same release a few minutes later.
 *
 * --dry-run runs only read-only git queries and prints every step and command instead of running it.
 */
import { existsSync } from 'node:fs'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { APK_ASSET_NAME, LATEST_APK_URL } from '../src/update/releases.ts'
import { nextVersion, versionCode } from '../src/update/version.ts'
import { ANDROID_DIR, APK_OUT_DIR, assembleTask, buildApk, gradlew } from './lib/android.ts'
import {
  parseReleaseArgs,
  preflightProblems,
  releaseCommitMessage,
  releaseNotes,
  releaseTitle,
} from './lib/release.ts'
import { capture, rootPath, run } from './lib/run.ts'

const { request, dryRun } = parseReleaseArgs(process.argv.slice(2))
const git = (...args: string[]) => capture('git', args)

/** A step that changes something: printed, and run unless this is a dry run. */
async function step(label: string, command: string, action: () => Promise<unknown>) {
  console.log(`\n${dryRun ? '[dry-run] would run' : '>'} ${label}\n    ${command}`)
  if (!dryRun) await action()
}

const current = (JSON.parse(await readFile(rootPath('package.json'), 'utf8')) as { version: string }).version
const version = nextVersion(current, request)
const tag = `v${version}`
console.log(`Release ${tag} (package.json is ${current}; Android versionCode ${versionCode(version)})`)

// The checks: read-only, run in a dry run too (which skips the fetch and compares with the
// origin/main already known locally).
if (dryRun) console.log('\n[dry-run] would run  git fetch origin --tags')
else await run('git', ['fetch', 'origin', '--tags'], { shell: false })
const problems = preflightProblems(
  {
    branch: await git('rev-parse', '--abbrev-ref', 'HEAD'),
    status: await git('status', '--porcelain'),
    head: await git('rev-parse', 'HEAD'),
    originHead: await git('rev-parse', 'origin/main'),
    tagExists: (await git('tag', '--list', tag)) !== '',
    hasKeystore: existsSync(join(ANDROID_DIR, 'keystore.properties')),
  },
  tag,
)
if (problems.length > 0) {
  const list = problems.map((p) => `  - ${p}`).join('\n')
  if (!dryRun) throw new Error(`Refusing to release:\n${list}`)
  console.log(`\n[dry-run] a real run would refuse now:\n${list}\n[dry-run] continuing to show the remaining steps`)
}

// Notes from the commits since the previous release tag (all commits when there is none yet).
const previousTag = (await git('tag', '--list', 'v*', '--merged', 'HEAD', '--sort=-creatordate')).split('\n')[0]
const range = previousTag ? [`${previousTag}..HEAD`] : ['HEAD']
const subjects = (await git('log', '--no-merges', '--reverse', '--format=%s', ...range)).split('\n')
const notes = releaseNotes(subjects)
console.log(`\nRelease notes (commits since ${previousTag || 'the first commit'}):\n${notes}`)

const apkPath = join(APK_OUT_DIR, `tajweed-${version}.apk`)
const uploadDir = join(APK_OUT_DIR, 'upload')
const uploadApk = join(uploadDir, APK_ASSET_NAME)
const notesFile = join(uploadDir, 'notes.md')
const bumps = version !== current

try {
  if (bumps) {
    await step('bump the version', `npm version ${version} --no-git-tag-version`, () =>
      run('npm', ['version', version, '--no-git-tag-version']),
    )
  } else {
    console.log(`\npackage.json is already ${version}: no bump, no release commit`)
  }
  await step('run the checks (lint, tests, build)', 'npm run check', () => run('npm', ['run', 'check']))
  await step('build the signed APK', `npx cap sync android && ${gradlew()} ${assembleTask('release')} -> ${apkPath}`, () =>
    buildApk({ variant: 'release', outPath: apkPath, skipWebBuild: true }),
  )
  if (bumps) {
    await step('commit the version', `git commit -m "${releaseCommitMessage(version)}" package.json package-lock.json`, () =>
      run('git', ['commit', '-m', releaseCommitMessage(version), 'package.json', 'package-lock.json'], { shell: false }),
    )
  }
  await step('tag it', `git tag -a ${tag} -m "${releaseTitle(version)}"`, () =>
    run('git', ['tag', '-a', tag, '-m', releaseTitle(version)], { shell: false }),
  )
  await step('push main and the tag', `git push --atomic origin main ${tag}`, () =>
    run('git', ['push', '--atomic', 'origin', 'main', tag], { shell: false }),
  )
  await step(
    'publish the GitHub release',
    `gh release create ${tag} ${uploadApk} --title "${releaseTitle(version)}" --notes-file ${notesFile} --verify-tag --latest`,
    async () => {
      await mkdir(uploadDir, { recursive: true })
      await copyFile(apkPath, uploadApk)
      await writeFile(notesFile, notes, 'utf8')
      await run(
        'gh',
        ['release', 'create', tag, uploadApk, '--title', releaseTitle(version), '--notes-file', notesFile, '--verify-tag', '--latest'],
        { shell: false },
      )
    },
  )
} catch (error) {
  if (bumps) {
    console.error(`\nRelease stopped. If nothing was pushed yet, undo the bump with:  git checkout package.json package-lock.json`)
  }
  throw error
}

console.log(dryRun ? '\n[dry-run] nothing was changed.' : `\nReleased ${tag}. Latest APK: ${LATEST_APK_URL}`)
