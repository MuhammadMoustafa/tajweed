/**
 * The pure parts of `npm run release` (scripts/release.ts): its arguments, the checks that must
 * pass before anything changes, and the release notes. Version arithmetic is src/update/version.ts,
 * the repo, asset names and web app URL src/update/releases.ts.
 */
import { APK_ASSET_NAME, IPA_ASSET_NAME, WEB_APP_URL } from '../../src/update/releases.ts'

export const releaseTitle = (version: string) => `Tajweed ${version}`
export const releaseCommitMessage = (version: string) => `Release v${version}`

export interface ReleaseArgs {
  /** patch | minor | major | x.y.z */
  request: string
  dryRun: boolean
}

export function parseReleaseArgs(argv: string[]): ReleaseArgs {
  const dryRun = argv.includes('--dry-run')
  const rest = argv.filter((a) => a !== '--dry-run')
  if (rest.length !== 1 || rest[0].startsWith('-')) {
    throw new Error('Usage: npm run release -- <patch|minor|major|x.y.z> [--dry-run]')
  }
  return { request: rest[0], dryRun }
}

export interface RepoState {
  branch: string
  /** `git status --porcelain` output: empty when the tree is clean. */
  status: string
  head: string
  originHead: string
  /** The tag this release would create already exists. */
  tagExists: boolean
  /** android/keystore.properties exists (release signing). */
  hasKeystore: boolean
}

/** Every reason the release must not start; empty when it may. */
export function preflightProblems(state: RepoState, tag: string): string[] {
  const problems: string[] = []
  if (state.branch !== 'main') problems.push(`Not on main (on ${state.branch}).`)
  if (state.status.trim()) problems.push('The working tree has uncommitted changes.')
  if (state.head !== state.originHead) problems.push('main is not equal to origin/main (pull or push first).')
  if (state.tagExists) problems.push(`Tag ${tag} already exists.`)
  if (!state.hasKeystore) {
    problems.push('android/keystore.properties is missing (see android/keystore.properties.example and CLAUDE.md, Distribution).')
  }
  return problems
}

const EXCLUDED_SUBJECTS = [/^Roadmap:/, /^Release v/]

export const INSTALL_NOTE = [
  '## Install',
  '',
  `**Android:** download **${APK_ASSET_NAME}** below on your phone and open it; allow installing apps from that source when asked.`,
  '',
  'Coming from the preview app (before v0.2.0)? Uninstall it first: releases are signed with a new key, so this one cannot install over the preview. From v0.2.0 on, every update installs over the previous one.',
  '',
  `**iPhone:** open the web app ${WEB_APP_URL} in Safari, then Share, then Add to Home Screen. It works offline and updates itself.`,
  '',
  `**${IPA_ASSET_NAME}** is unsigned, for testers who sideload it with their own Apple ID (e.g. Sideloadly or AltStore; a free Apple ID's install lasts 7 days). It is built on GitHub and appears here a few minutes after the release.`,
].join('\n')

/** The release notes: the commit subjects since the previous release (minus roadmap and release
 *  commits), oldest first as `git log --reverse` gives them, then the install note. */
export function releaseNotes(subjects: string[]): string {
  const changes = subjects.map((s) => s.trim()).filter((s) => s && !EXCLUDED_SUBJECTS.some((re) => re.test(s)))
  const list = changes.length > 0 ? changes.map((s) => `- ${s}`) : ['- Maintenance release']
  return ['## Changes', '', ...list, '', INSTALL_NOTE, ''].join('\n')
}
