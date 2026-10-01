import { describe, expect, it } from 'vitest'
import { buildReport } from './report'

const ctx = { version: '1.2.3', hash: '#/lesson/qalqalah?x=1&y=2', locale: 'ar', platform: 'APK' } as const

describe('buildReport', () => {
  it('carries version, page, language and platform in the GitHub URL', () => {
    const url = new URL(buildReport(ctx).githubUrl)
    expect(url.origin + url.pathname).toBe('https://github.com/MuhammadMoustafa/tajweed/issues/new')
    expect(url.searchParams.get('title')).toBe('Issue report')
    const body = url.searchParams.get('body')!
    expect(body).toContain('App version: 1.2.3')
    expect(body).toContain('Page: /lesson/qalqalah?x=1&y=2')
    expect(body).toContain('Language: ar')
    expect(body).toContain('Platform: APK')
    expect(body).toContain('describe the problem')
  })

  it('encodes the mailto with the same body, spaces as %20', () => {
    const r = buildReport(ctx)
    expect(r.mailtoUrl.startsWith('mailto:muhammadmoustafa22@gmail.com?subject=')).toBe(true)
    expect(r.mailtoUrl).not.toContain('+')
    const params = new URLSearchParams(r.mailtoUrl.split('?')[1])
    expect(params.get('body')).toBe(r.body)
    expect(params.get('subject')).toContain(r.title)
  })

  it('names the home page "/" and recomputes per route', () => {
    const a = buildReport({ ...ctx, hash: '', platform: 'web', locale: 'en' })
    expect(a.body).toContain('Page: /')
    expect(a.body).toContain('Platform: web')
    expect(buildReport({ ...ctx, hash: '#/progress' }).body).toContain('Page: /progress')
  })
})
