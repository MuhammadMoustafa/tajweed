import { describe, expect, it } from 'vitest'
import { parseReleaseArgs, preflightProblems, releaseNotes, type RepoState } from './release'

const ready: RepoState = {
  branch: 'main',
  status: '',
  head: 'abc',
  originHead: 'abc',
  tagExists: false,
  hasKeystore: true,
}

describe('parseReleaseArgs', () => {
  it('takes one version request and an optional --dry-run', () => {
    expect(parseReleaseArgs(['minor'])).toEqual({ request: 'minor', dryRun: false })
    expect(parseReleaseArgs(['--dry-run', '0.2.0'])).toEqual({ request: '0.2.0', dryRun: true })
    expect(() => parseReleaseArgs([])).toThrow(/Usage/)
    expect(() => parseReleaseArgs(['patch', 'minor'])).toThrow(/Usage/)
    expect(() => parseReleaseArgs(['--force'])).toThrow(/Usage/)
  })
})

describe('preflightProblems', () => {
  it('lets a clean, pushed main with a new tag and the key release', () => {
    expect(preflightProblems(ready, 'v0.2.0')).toEqual([])
  })

  it('names every reason to refuse', () => {
    const problems = preflightProblems(
      { branch: 'task/T27', status: ' M package.json', head: 'abc', originHead: 'def', tagExists: true, hasKeystore: false },
      'v0.2.0',
    )
    expect(problems).toHaveLength(5)
    expect(problems.join('\n')).toMatch(/Not on main/)
    expect(problems.join('\n')).toMatch(/uncommitted/)
    expect(problems.join('\n')).toMatch(/origin\/main/)
    expect(problems.join('\n')).toMatch(/v0\.2\.0 already exists/)
    expect(problems.join('\n')).toMatch(/keystore\.properties/)
  })
})

describe('releaseNotes', () => {
  it('lists the commit subjects without roadmap or release commits, then the install note', () => {
    const notes = releaseNotes(['T26: lips that open', 'Roadmap: T26 done', 'Release v0.1.9', '', 'T27: update check'])
    expect(notes).toMatch(/^## Changes\n\n- T26: lips that open\n- T27: update check\n\n## Install/)
    expect(notes).not.toMatch(/Roadmap|Release v0\.1\.9/)
    expect(notes).toMatch(/tajweed\.apk/)
    expect(notes).toMatch(/Uninstall it first/)
  })

  it('tells iPhone users to add the web app from Safari and says the .ipa is unsigned and comes later', () => {
    const notes = releaseNotes(['T29: iOS build'])
    expect(notes).toMatch(/\*\*Android:\*\* download \*\*tajweed\.apk\*\*/)
    expect(notes).toMatch(/\*\*iPhone:\*\* open the web app https:\/\/muhammadmoustafa\.github\.io\/tajweed\/ in Safari, then Share, then Add to Home Screen/)
    expect(notes).toMatch(/\*\*tajweed\.ipa\*\* is unsigned, for testers who sideload it with their own Apple ID/)
    expect(notes).toMatch(/7 days/)
    expect(notes).toMatch(/appears here a few minutes after the release/)
  })

  it('still says something when only roadmap commits happened', () => {
    expect(releaseNotes(['Roadmap: T28'])).toMatch(/- Maintenance release/)
  })
})
