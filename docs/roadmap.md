# Roadmap

One row per card. Status: `blocked` (a blocker is not done), `ready`,
`in-progress`, `done`. A card records the maintainer's decisions with their
dates; its issue has the same text and every later decision as a comment.

Standing decisions (maintainer, 2026-09-28): web-first PWA, one codebase; a
sideloaded Android APK via Capacitor is secondary; no app-store publishing;
audience is family and friends. Cards without blockers may run in any
order (maintainer, 2026-09-28). The coordinator may push once the
pre-push tier is green (maintainer, 2026-09-28).

Lesson cards (L*) share one definition of done: a lesson file in
src/lessons/ with `order` = the card's number, bilingual prose, a
reduced-motion-safe animation (or reuse of an existing one), 2–4 examples
from Juz 'Amma / Al-Fatiha by verse key (`npm run fetch-quran`), a quiz
(T2), `reviewed: false`, and tests from lessons.test.ts passing. Difficulty
in brackets picks the agent.

| ID | Issue | Card | Blocked by | Status |
|----|-------|------|------------|--------|
| T1 | #1 | [task] Lesson navigation and progress: previous/next links on a lesson, "mark as learned" kept per device (localStorage, try/catch), progress shown in the lesson list. Done when routes/links and progress have tests. | none | done |
| T2 | #2 | [task] Practice quiz: a `quiz` field on Lesson with (a) "tap the letters that have <rule> in this ayah" (answers come from parsed segments, not typed text) and (b) bilingual multiple choice; Quiz component after the examples; a quiz for the qalqalah lesson. Done when scoring is tested. | none | done |
| T3 | #3 | [task] Playwright UI suite (`npm run test:ui`): every lesson route renders, the language toggle sets `<html lang dir>`, examples contain colored rule spans, reduced motion shows a static animation. Checks data, not pixels. Becomes the heavy-tier "full UI suite". | none | done |
| T4 | #4 | [task] Android APK with Capacitor: @capacitor/core/cli/android, capacitor.config.ts, `npm run apk` (debug APK), instructions in CLAUDE.md. Toolchain installed (maintainer, 2026-09-28): SDK at %LOCALAPPDATA%/Android/Sdk, JDK in Android Studio's jbr; no ANDROID_HOME/JAVA_HOME set. | T3 (package.json) | in-progress |
| T5 | #5 | [task-easy] Deploy the PWA to a free static host from GitHub Actions on push to main. Host: GitHub Pages, source = GitHub Actions (maintainer, 2026-09-28) → https://muhammadmoustafa.github.io/tajweed/ | none | done |
| T6 | #6 | [task] Highlights for rules the API does not annotate (izhar, lam qamariyyah, tafkhim/tarqiq, ra, stop signs): lesson examples mark letters by word/letter index into the fetched text (never retyped); new color tokens (e.g. dark blue for tafkhim) in both themes. Design by the coordinator (maintainer allowed any order, 2026-09-28): `marks` on examples by word/letter index, applied after parsing; see the issue. | none | done |
| T7 | #27 | [task] Tap quiz by letter: split verses into graphemes (one shared helper with T6's marks.ts) so each letter is tappable, not each rule run; tap questions may use custom rules (marks applied first). Found reviewing T2 (coordinator, 2026-09-28). | none | done |
| L1 | #7 | [task] Foundations: letters, harakat, sukun, shadda, tanween, istiʿadha and basmala. Animation: marks landing on a letter with their sound. Allows lessons with no focus rule (adjust lessons.test.ts). | T2 | ready |
| L2 | #8 | [task-hard] Makharij: a reusable MouthDiagram SVG (side view: jawf, halq, lisan, shafatan, khayshum) with highlightable regions, used by later lessons. | T2 | in-progress |
| L3 | #9 | [task] Heavy and light letters (tafkhim/tarqiq basics, خص ضغط قظ), reusing MouthDiagram. | L2, T6 | blocked |
| L4 | #10 | [task] Noon sakinah/tanween 1: izhar halqi. | T2, T6 | ready |
| L5 | #11 | [task] Noon sakinah/tanween 2: idgham with and without ghunnah (`idgham_ghunnah`, `idgham_wo_ghunnah`). Animation: the noon merging into the next letter. | T2 | ready |
| L6 | #12 | [task] Noon sakinah/tanween 3: iqlab (`iqlab`). Animation: noon turning into meem. | T2 | ready |
| L7 | #13 | [task] Noon sakinah/tanween 4: ikhfa (`ikhafa`). Animation: noon hidden in a nasal cloud. | T2 | ready |
| L8 | #14 | [task] Meem sakinah: ikhfa, idgham and izhar shafawi (`ikhafa_shafawi`, `idgham_shafawi`), lips on MouthDiagram. | L2, T6 | blocked |
| L9 | #15 | [task] Ghunnah on mushaddad noon/meem (`ghunnah`), nose on MouthDiagram, 2 counts. | L2 | blocked |
| L10 | #16 | Qalqalah — sample lesson from the scaffold. Quiz added by T2. | — | done |
| L11 | #17 | [task] Lam rules: lam shamsiyyah (`laam_shamsiyah`) and qamariyyah, lam in the name of Allah. | T2, T6 | ready |
| L12 | #18 | [task] Ra: tafkhim and tarqiq. | L3, T6 | blocked |
| L13 | #19 | [task] Natural madd (`madda_normal`): a reusable MaddBar animation (2/4/5/6 counts) used by L14–L16. | T2 | in-progress |
| L14 | #20 | [task] Madd muttasil and munfasil (`madda_obligatory`, `madda_permissible`), reusing MaddBar. | L13 | blocked |
| L15 | #21 | [task] Madd lazim (`madda_necessary`), reusing MaddBar. | L13 | blocked |
| L16 | #22 | [task] Other madd: ʿarid lis-sukun, leen, badal, silah, reusing MaddBar. | L13 | blocked |
| L17 | #23 | [task] Hamzat al-wasl and silent letters (`ham_wasl`, `slnt`). | T2 | ready |
| L18 | #24 | [task] Idgham of letters: mithlayn, mutajanisayn, mutaqaribayn (`idgham_mutajanisayn`, `idgham_mutaqaribayn`). | T2 | ready |
| L19 | #25 | [task] Waqf and ibtida: the stop signs in the mushaf. | T2, T6 | ready |
| L20 | #26 | [task-hard] Sifat al-huruf in depth, reusing MouthDiagram. | L2 | blocked |
