import { describe, expect, it } from "vitest";
import { LESSONS } from ".";
import { getVerseMarkup } from "../data/quran";
import { applyMarks } from "../tajweed/marks";
import { parseTajweed } from "../tajweed/parse";
import type { RuleId } from "../tajweed/rules";
import type { VerseKey } from "./types";

const lesson = LESSONS.find((l) => l.id === "idgham-letters")!;

/** The rule-colored letters of an example, as the page renders them (API rules plus marks). */
const coloredLetters = (verseKey: VerseKey) => {
  const example = lesson.examples.find((e) => e.verseKey === verseKey)!;
  const parsed = parseTajweed(getVerseMarkup(verseKey)!);
  const segments = example.marks?.length
    ? applyMarks(parsed.segments, example.marks)
    : parsed.segments;
  return segments
    .filter((s) => s.rule && lesson.focusRules.includes(s.rule))
    .map((s) => [s.rule, s.text] as [RuleId, string]);
};

describe("idgham-letters lesson (L18, unit 5)", () => {
  it("is lesson 5.1, teaches the three kinds, and has one clip per kind, each in its own section", () => {
    expect(lesson.order).toBe(5.1);
    expect(lesson.unit).toBe('lam-merging');
    expect(lesson.focusRules).toEqual([
      "idgham_mithlayn",
      "idgham_mutajanisayn",
      "idgham_mutaqaribayn",
    ]);
    expect(lesson.sections.map((s) => s.animation).filter(Boolean)).toEqual([
      "idgham-mithlayn",
      "idgham-mutajanisayn",
      "idgham-mutaqaribayn",
    ]);
  });

  it.each<[VerseKey, string, string]>([
    ["2:16", "idgham_mithlayn", "ت"],
    ["2:60", "idgham_mithlayn", "ب"],
    ["27:28", "idgham_mithlayn", "ب"],
    ["109:4", "idgham_mutajanisayn", "د"],
    ["74:14", "idgham_mutajanisayn", "د"],
    ["11:42", "idgham_mutajanisayn", "ب"],
    ["23:93", "idgham_mutaqaribayn", "ل"],
    ["77:20", "idgham_mutaqaribayn", "ق"],
  ])(
    "%s colors exactly one letter as %s: the first letter (%s)",
    (verseKey, rule, letter) => {
      const colored = coloredLetters(verseKey);
      expect(colored.map(([r]) => r)).toEqual([rule]);
      expect(colored[0][1]).toContain(letter);
    },
  );

  it("cites Tuhfa (30-34) and the Jazariyya (50-51) in both languages", () => {
    const { tuhfa, jazariyya } = lesson.mutoon!;
    expect(tuhfa).not.toBe("not-covered");
    expect(jazariyya).not.toBe("not-covered");
    const lines = (c: typeof tuhfa) =>
      c === "not-covered" ? [] : c.flatMap((p) => [p.from, p.to ?? p.from]);
    expect(lines(tuhfa)).toEqual([30, 32, 33, 34]);
    expect(lines(jazariyya)).toEqual([50, 51]);
    for (const c of [tuhfa, jazariyya]) {
      if (c === "not-covered") continue;
      for (const p of c) {
        expect(p.note.ar.trim()).not.toBe("");
        expect(p.note.en.trim()).not.toBe("");
      }
    }
  });
});
