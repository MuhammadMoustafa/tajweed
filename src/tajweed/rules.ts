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
 * Color families follow the color-coded (Dar al-Maarifah style) mushaf so learners can move
 * to a printed tajweed mushaf: madd = reds (darker = longer), ghunnah = green,
 * qalqalah = blue, not pronounced = gray. The actual colors live in CSS as `--tj-<token>`.
 */
export type ColorToken =
  | 'madd-necessary'
  | 'madd-obligatory'
  | 'madd-permissible'
  | 'madd-normal'
  | 'ghunnah'
  | 'qalqalah'
  | 'silent'

export interface TajweedRule {
  id: TajweedRuleId
  color: ColorToken
  name: Bilingual
}

export const TAJWEED_RULES: Record<TajweedRuleId, TajweedRule> = {
  madda_necessary: {
    id: 'madda_necessary',
    color: 'madd-necessary',
    name: { ar: 'مد لازم (٦ حركات)', en: 'Necessary madd (6 counts)' },
  },
  madda_obligatory: {
    id: 'madda_obligatory',
    color: 'madd-obligatory',
    name: { ar: 'مد واجب متصل (٤–٥ حركات)', en: 'Obligatory connected madd (4–5 counts)' },
  },
  madda_permissible: {
    id: 'madda_permissible',
    color: 'madd-permissible',
    name: { ar: 'مد جائز (٢ أو ٤ أو ٦)', en: 'Permissible madd (2, 4 or 6 counts)' },
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
