import type { Bilingual } from '../i18n/bilingual'

/**
 * Rule ids are exactly the class names used by the Quran Foundation API's
 * `text_uthmani_tajweed` field (`<tajweed class=...>`), so imported text needs no renaming.
 */
export const TAJWEED_RULE_IDS = [
  'madda_necessary',
  'madda_obligatory',
  'madda_permissible',
  'madda_normal',
  'ghunnah',
  'ikhafa',
  'ikhafa_shafawi',
  'idgham_ghunnah',
  'idgham_shafawi',
  'iqlab',
  'idgham_wo_ghunnah',
  'idgham_mutajanisayn',
  'idgham_mutaqaribayn',
  'qalaqah',
  'ham_wasl',
  'laam_shamsiyah',
  'slnt',
] as const

export type TajweedRuleId = (typeof TAJWEED_RULE_IDS)[number]

/**
 * Rule ids for tajweed points the API markup does not annotate (izhar, lam qamariyyah,
 * tafkhim/tarqiq, waqf signs). Kept apart from `TAJWEED_RULE_IDS` (the API's own class names) so
 * `isTajweedRuleId` keeps meaning "an API class" for the parser. Applied to text via
 * `src/tajweed/marks.ts`, never by the API markup.
 */
export const CUSTOM_RULE_IDS = ['izhar', 'izhar_shafawi', 'laam_qamariyah', 'tafkheem', 'tarqeeq', 'waqf_sign'] as const

export type CustomRuleId = (typeof CUSTOM_RULE_IDS)[number]

/** Every rule id highlighting/focusRules/marks can reference: the API's classes plus the custom ones above. */
export type RuleId = TajweedRuleId | CustomRuleId

/**
 * Color families follow the color-coded (Dar al-Maarifah style) mushaf so learners can move
 * to a printed tajweed mushaf: madd = reds (darker = longer), ghunnah = green,
 * qalqalah = blue, not pronounced = gray, tafkhim = dark blue. The actual colors live in CSS
 * as `--tj-<token>`.
 */
export type ColorToken =
  | 'madd-necessary'
  | 'madd-obligatory'
  | 'madd-permissible'
  | 'madd-normal'
  | 'ghunnah'
  | 'qalqalah'
  | 'silent'
  | 'izhar'
  | 'laam-qamariyah'
  | 'tafkheem'
  | 'tarqeeq'
  | 'waqf'

export interface TajweedRule<Id extends RuleId = RuleId> {
  id: Id
  color: ColorToken
  name: Bilingual
}

export const TAJWEED_RULES: Record<TajweedRuleId, TajweedRule<TajweedRuleId>> = {
  madda_necessary: {
    id: 'madda_necessary',
    color: 'madd-necessary',
    name: { ar: 'مد لازم (٦ حركات)', en: 'Necessary madd (6 counts)' },
  },
  madda_obligatory: {
    id: 'madda_obligatory',
    color: 'madd-obligatory',
    // The API uses this class for both muttasil and munfasil: 4–5 counts in Hafs (red in the mushaf).
    name: { ar: 'مد متصل أو منفصل (٤–٥ حركات)', en: 'Connected or separated madd (4–5 counts)' },
  },
  madda_permissible: {
    id: 'madda_permissible',
    color: 'madd-permissible',
    // ʿArid lis-sukun and similar madd whose length is a choice.
    name: { ar: 'مد عارض للسكون ونحوه (٢ أو ٤ أو ٦)', en: 'Madd ʿarid lis-sukun and similar (2, 4 or 6 counts)' },
  },
  madda_normal: {
    id: 'madda_normal',
    color: 'madd-normal',
    name: { ar: 'مد طبيعي (حركتان)', en: 'Natural madd (2 counts)' },
  },
  ghunnah: {
    id: 'ghunnah',
    color: 'ghunnah',
    name: { ar: 'غنّة (نون أو ميم مشدّدة)', en: 'Ghunnah (doubled noon or meem)' },
  },
  ikhafa: {
    id: 'ikhafa',
    color: 'ghunnah',
    name: { ar: 'إخفاء', en: 'Ikhfa (hiding)' },
  },
  ikhafa_shafawi: {
    id: 'ikhafa_shafawi',
    color: 'ghunnah',
    name: { ar: 'إخفاء شفوي', en: 'Labial ikhfa' },
  },
  idgham_ghunnah: {
    id: 'idgham_ghunnah',
    color: 'ghunnah',
    name: { ar: 'إدغام بغنّة', en: 'Idgham with ghunnah' },
  },
  idgham_shafawi: {
    id: 'idgham_shafawi',
    color: 'ghunnah',
    name: { ar: 'إدغام شفوي', en: 'Labial idgham' },
  },
  iqlab: {
    id: 'iqlab',
    color: 'ghunnah',
    name: { ar: 'إقلاب', en: 'Iqlab (conversion)' },
  },
  idgham_wo_ghunnah: {
    id: 'idgham_wo_ghunnah',
    color: 'silent',
    name: { ar: 'إدغام بلا غنّة', en: 'Idgham without ghunnah' },
  },
  idgham_mutajanisayn: {
    id: 'idgham_mutajanisayn',
    color: 'silent',
    name: { ar: 'إدغام متجانسين', en: 'Idgham of same-origin letters' },
  },
  idgham_mutaqaribayn: {
    id: 'idgham_mutaqaribayn',
    color: 'silent',
    name: { ar: 'إدغام متقاربين', en: 'Idgham of close letters' },
  },
  qalaqah: {
    id: 'qalaqah',
    color: 'qalqalah',
    name: { ar: 'قلقلة', en: 'Qalqalah (echo)' },
  },
  ham_wasl: {
    id: 'ham_wasl',
    color: 'silent',
    name: { ar: 'همزة وصل', en: 'Connecting hamza' },
  },
  laam_shamsiyah: {
    id: 'laam_shamsiyah',
    color: 'silent',
    name: { ar: 'لام شمسية', en: 'Sun lam (silent)' },
  },
  slnt: {
    id: 'slnt',
    color: 'silent',
    name: { ar: 'حرف لا يُنطق', en: 'Silent letter' },
  },
}

export function isTajweedRuleId(value: string): value is TajweedRuleId {
  return Object.hasOwn(TAJWEED_RULES, value)
}

/**
 * Rules for points the API markup never tags. These are never produced by `parseTajweed`;
 * they only reach a segment via `src/tajweed/marks.ts`, which reads a lesson example's
 * `marks` field.
 */
export const CUSTOM_RULES: Record<CustomRuleId, TajweedRule<CustomRuleId>> = {
  izhar: {
    id: 'izhar',
    color: 'izhar',
    name: { ar: 'إظهار', en: 'Izhar (clear pronunciation)' },
  },
  izhar_shafawi: {
    id: 'izhar_shafawi',
    color: 'izhar',
    name: { ar: 'إظهار شفوي', en: 'Labial izhar' },
  },
  laam_qamariyah: {
    id: 'laam_qamariyah',
    color: 'laam-qamariyah',
    name: { ar: 'لام قمرية', en: 'Moon lam (pronounced)' },
  },
  tafkheem: {
    id: 'tafkheem',
    color: 'tafkheem',
    name: { ar: 'تفخيم', en: 'Tafkhim (heavy letter)' },
  },
  tarqeeq: {
    id: 'tarqeeq',
    color: 'tarqeeq',
    name: { ar: 'ترقيق', en: 'Tarqiq (light letter)' },
  },
  waqf_sign: {
    id: 'waqf_sign',
    color: 'waqf',
    name: { ar: 'علامة وقف', en: 'Waqf sign (stopping mark)' },
  },
}

export function isCustomRuleId(value: string): value is CustomRuleId {
  return Object.hasOwn(CUSTOM_RULES, value)
}

/** Every rule (API + custom), keyed by id — the single lookup for rendering colors/names. */
export const ALL_RULES: Record<RuleId, TajweedRule> = { ...TAJWEED_RULES, ...CUSTOM_RULES }

export function isRuleId(value: string): value is RuleId {
  return Object.hasOwn(ALL_RULES, value)
}

/**
 * Groups of API rules a learner easily mixes up, used for the "which rule is on this letter?"
 * quiz options (and to pick hard quiz verses, where a look-alike rule sits near the target). A
 * rule's confusables are every other member of the groups it belongs to, so the relation is
 * symmetric by construction. Note the API's madd classes: `madda_obligatory` covers both
 * muttasil and munfasil (4–5 counts in Hafs), `madda_permissible` is ʿarid lis-sukun and similar,
 * `madda_normal` is natural madd and `madda_necessary` is lazim.
 */
const CONFUSABLE_GROUPS: readonly (readonly TajweedRuleId[])[] = [
  // Noon sakinah / tanween: what the next letter does to the noon.
  ['ikhafa', 'idgham_ghunnah', 'idgham_wo_ghunnah', 'iqlab'],
  // Meem sakinah: before ب (ikhfa shafawi) vs before م (idgham shafawi); iqlab also ends in a
  // hidden meem before ب.
  ['ikhafa_shafawi', 'idgham_shafawi', 'iqlab'],
  ['ikhafa', 'ikhafa_shafawi'],
  // A nasal held for two counts: doubled noon/meem vs a merge into noon/meem.
  ['ghunnah', 'idgham_shafawi', 'idgham_ghunnah'],
  // The four madd classes: the length depends on what follows the madd letter.
  ['madda_normal', 'madda_obligatory', 'madda_permissible', 'madda_necessary'],
  // A sakin qalqalah letter merged into the next letter is not echoed (the dal in 2:256, the qaf
  // in 77:20).
  ['qalaqah', 'idgham_mutajanisayn', 'idgham_mutaqaribayn'],
  // Letters merged into the next one.
  ['idgham_mutajanisayn', 'idgham_mutaqaribayn', 'idgham_wo_ghunnah'],
  // Written but not pronounced.
  ['ham_wasl', 'laam_shamsiyah', 'slnt'],
]

/** Rules easily confused with `rule` (never `rule` itself), in group order; empty for a custom rule. */
export function confusableRules(rule: RuleId): TajweedRuleId[] {
  const out = new Set<TajweedRuleId>()
  for (const group of CONFUSABLE_GROUPS) {
    if (!(group as readonly RuleId[]).includes(rule)) continue
    for (const other of group) if (other !== rule) out.add(other)
  }
  return [...out]
}
