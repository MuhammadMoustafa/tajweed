import type { Locale } from '../i18n/bilingual'
import type { AppBuild } from '../update/platform'
import { CONTACT_EMAIL, NEW_ISSUE_URL } from './links'

export interface ReportContext {
  version: string
  /** The hash route, e.g. `#/lesson/qalqalah` (empty for home). */
  hash: string
  locale: Locale
  platform: AppBuild
}

export interface Report {
  title: string
  body: string
  /** A new GitHub issue with `title` and `body` prefilled. */
  githubUrl: string
  /** The same subject and body by email, for people without a GitHub account. */
  mailtoUrl: string
}

/**
 * The "Report an issue" links for the current page. Written in English (the maintainer reads it);
 * holds only the app version, page, language and platform: nothing personal.
 */
export function buildReport({ version, hash, locale, platform }: ReportContext): Report {
  const page = hash.replace(/^#/, '') || '/'
  const title = 'Issue report'
  const body = [
    'Please describe the problem here:',
    '',
    '',
    '---',
    `App version: ${version}`,
    `Page: ${page}`,
    `Language: ${locale}`,
    `Platform: ${platform}`,
  ].join('\n')
  const query = `title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
  return {
    title,
    body,
    githubUrl: `${NEW_ISSUE_URL}?${query}`,
    mailtoUrl: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Tajweed app: ${title}`)}&body=${encodeURIComponent(body)}`,
  }
}
