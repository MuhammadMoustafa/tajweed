import { describe, expect, it } from 'vitest'
import { confusableRules, TAJWEED_RULE_IDS } from './rules'

describe('confusableRules', () => {
  it('never lists the rule itself or a duplicate', () => {
    for (const rule of TAJWEED_RULE_IDS) {
      const others = confusableRules(rule)
      expect(others, rule).not.toContain(rule)
      expect(new Set(others).size, rule).toBe(others.length)
    }
  })

  it('is symmetric', () => {
    for (const rule of TAJWEED_RULE_IDS) {
      for (const other of confusableRules(rule)) expect(confusableRules(other), `${other} / ${rule}`).toContain(rule)
    }
  })

  it('gives every API rule at least one look-alike', () => {
    for (const rule of TAJWEED_RULE_IDS) expect(confusableRules(rule).length, rule).toBeGreaterThan(0)
  })

  it('groups the noon sakinah rules and the four madd classes', () => {
    expect(confusableRules('ikhafa')).toEqual(expect.arrayContaining(['idgham_ghunnah', 'idgham_wo_ghunnah', 'iqlab']))
    expect(confusableRules('madda_normal')).toEqual(
      expect.arrayContaining(['madda_obligatory', 'madda_permissible', 'madda_necessary']),
    )
  })

  it('has none for a custom rule', () => {
    expect(confusableRules('izhar')).toEqual([])
  })
})
