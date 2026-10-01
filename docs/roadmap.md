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
reduced-motion-safe animation as controllable clips on AnimationPlayer (T10), one per section where it helps (or reuse of an existing one), 2–4 examples
from Juz 'Amma / Al-Fatiha by verse key (`npm run fetch-quran`), a quiz
(T2), all matn lines on the rule, with both poems in every lesson (a 'not covered' line when one doesn't treat it) (T8, T13), `reviewed: false`, and tests from lessons.test.ts passing. Difficulty
in brackets picks the agent.

| ID | Issue | Card | Blocked by | Status |
|----|-------|------|------------|--------|
| T1 | #1 | [task] Lesson navigation and progress: previous/next links on a lesson, "mark as learned" kept per device (localStorage, try/catch), progress shown in the lesson list. Done when routes/links and progress have tests. | none | done |
| T2 | #2 | [task] Practice quiz: a `quiz` field on Lesson with (a) "tap the letters that have <rule> in this ayah" (answers come from parsed segments, not typed text) and (b) bilingual multiple choice; Quiz component after the examples; a quiz for the qalqalah lesson. Done when scoring is tested. | none | done |
| T3 | #3 | [task] Playwright UI suite (`npm run test:ui`): every lesson route renders, the language toggle sets `<html lang dir>`, examples contain colored rule spans, reduced motion shows a static animation. Checks data, not pixels. Becomes the heavy-tier "full UI suite". | none | done |
| T4 | #4 | [task] Android APK with Capacitor: @capacitor/core/cli/android, capacitor.config.ts, `npm run apk` (debug APK), instructions in CLAUDE.md. Toolchain installed (maintainer, 2026-09-28): SDK at %LOCALAPPDATA%/Android/Sdk, JDK in Android Studio's jbr; no ANDROID_HOME/JAVA_HOME set. | T3 (package.json) | done |
| T5 | #5 | [task-easy] Deploy the PWA to a free static host from GitHub Actions on push to main. Host: GitHub Pages, source = GitHub Actions (maintainer, 2026-09-28) → https://muhammadmoustafa.github.io/tajweed/ | none | done |
| T6 | #6 | [task] Highlights for rules the API does not annotate (izhar, lam qamariyyah, tafkhim/tarqiq, ra, stop signs): lesson examples mark letters by word/letter index into the fetched text (never retyped); new color tokens (e.g. dark blue for tafkhim) in both themes. Design by the coordinator (maintainer allowed any order, 2026-09-28): `marks` on examples by word/letter index, applied after parsing; see the issue. | none | done |
| T7 | #27 | [task] Tap quiz by letter: split verses into graphemes (one shared helper with T6's marks.ts) so each letter is tappable, not each rule run; tap questions may use custom rules (marks applied first). Found reviewing T2 (coordinator, 2026-09-28). | none | done |
| T8 | #28 | [task] Classical poem lines in a collapsed panel: Tuhfat al-Atfal (61) and al-Jazariyyah (109) fetched verbatim from Alukah by `npm run fetch-mutoon` into src/data/mutoon.json; lessons reference line ranges with a bilingual meaning (maintainer, 2026-09-28: yes, any trusted edition). | none | done |
| T9 | #29 | [task-hard] Quiz on its own page (#/lesson/<id>/quiz) with questions from the whole Quran: build-time pool by rule and difficulty, 'which rule is this letter' questions from a confusable-rules map, seeded draws (maintainer, 2026-09-28). | none | done |
| T10 | #30 | [task-hard] AnimationPlayer: timeline clips with video-style controls (play/pause, seek, step, speed, replay; no autoplay), per-section clips via `LessonSection.animation`; existing animations migrate (maintainer, 2026-09-28: madd too fast and points at nothing; makharij needs a controllable clip per section). | none | done |
| T11 | #33 | [task] Step labels above the clip timeline (click to seek; current label only on phones); labels for makharij, qalqalah, madd clips (maintainer, 2026-09-28). | none | done |
| T12 | #35 | [task] Reciter audio in clips: quran.com word-by-word audio by `surah:ayah:word`; isolated letters/syllables need recordings (maintainer asked for a qari per letter, 2026-09-28). | T11 | done |
| T13 | #36 | [task] Matn: each bayt on one line at every width; every line on the lesson's rule; both poems in every lesson, clearly separated, with a 'not covered' line when a poem doesn't treat the rule (maintainer, 2026-09-28). | none | done |
| T14 | #38 | [task] Progress page (#/progress): quiz attempts, best/last scores, per-rule accuracy with review links; home cards colored by state (learned/started/next/not started) with text badges (maintainer, 2026-09-28). | none | done |
| T15 | #39 | [task] Lesson cards: side panel with 'Take the quiz' or the grade + 'Retry quiz'; state tints clearly visible in both themes with an accent bar (maintainer, 2026-09-28). | none | done |
| T16 | #40 | [task] Vitest worker start-up timeouts: `npm test` intermittently fails with "Failed to start threads worker … Timeout waiting for worker to respond" (seen by most L-card agents and on merges, even with one other run; a single file took 54 s, 65% of it environment setup). Find the cause (jsdom environment cost, pool/worker settings) and fix it without raising timeouts to hide it; done when 5 consecutive `npm run check` runs pass while a second `npm test` runs in another worktree. | none | done |
| T17 | #41 | [task] Full tashkeel for the poem lines: a vetted fully-voweled source for Tuhfa and Jazariyya (never hand-added harakat), same line numbering or remapped lesson refs, fetch-mutoon + parser + fixture switched, attribution kept; bayt still on one row at 375px (maintainer, 2026-09-28). Result: no openly licensed source is fully voweled (Wikisource Tuhfa ~63%, its Jazariyya 0%; OpenITI strips harakat); a Shamela-based build is parked on branch hold/T17-shamela. Maintainer, 2026-09-28: stay unvoweled for now; voweling it ourselves would need a teacher and a change to the no-hand-typed-matn rule. | none | blocked |
| T18 | #42 | [task] Every lesson in one of 9 units in the conventional (Tuhfa) order — Getting started; Makharij; Noon sakinah & tanween; Ghunnah & meem sakinah; Lam & merging letters; Madd; Heavy & light letters (heavy & light, ra, qalqalah); Stopping & starting (waqf, hamzat al-wasl); Going deeper (sifat) — moving 5 lessons; home page units collapsible with a clear header and progress, the next lesson's unit open (maintainer, 2026-09-28). | none | done |
| T19 | #43 | [task] Lesson cards: an explicit primary action by state (Start lesson / Continue / Review, direction-aware arrow), the quiz action secondary, the whole card one clear tap target with hover/pressed/focus states; a tester didn't see that a card opens its lesson (maintainer, 2026-09-28). | none | done |
| T20 | #46 | [task] Unit levels core/advanced; home page shows core units, then a headed Advanced section (sifat moves to unit 10; units 11–12 from L23/L24); summary counts each; 'next' never points into Advanced while core is unlearned (maintainer, 2026-09-28). | none | done |
| T21 | #53 | [task-easy] Surah names instead of numbers in the clip audio credit and the examples' verse references; names from the API's chapters endpoint via fetch-quran (maintainer, 2026-09-29). | none | done |
| T22 | #54 | [task-easy] Blank page after a deploy while the app is open: a lazy page whose chunk the new service worker removed reloads once instead of rendering nothing (found 2026-09-29). | none | done |
| T23 | #55 | [task-easy] Letters page: letter tails (ج ح خ ع غ م ي) overlap the name under them; room below the glyph, UI test measuring each glyph's ink (maintainer, 2026-09-29). | none | done |
| T24 | #56 | [task-easy] Count 29 letters, hamzah and alif apart: the foundations lesson, its quiz and the letters intro say 29 and explain the count of 28; a test ties the count to the letter cards and sifat data (maintainer, 2026-09-29). | none | done |
| T25 | #57 | [task] Quiz flow: previous/next lesson links on the quiz page; a score of 80%+ marks the lesson learned; ✓/✗ beside the answer colors; a started card says 'Review lesson' (maintainer, 2026-09-29). | none | done |
| T26 | #58 | [task] Explain the vowels in both languages: each haraka by what the mouth does (fatha opens, damma rounds the lips, kasra lowers the jaw), the syllable بَ بُ بِ, an everyday word (not a Quran quote) and its IPA symbol; English adds an approximate English word; the harakat clip shows the mouth shape per haraka; no Latin letter stands for a sound (maintainer, 2026-09-30). | none | done |
| T27 | #59 | [task-hard] Versioned APK releases and an in-app update check: a new release key (keystore.properties, gitignored), `npm run release` (bump, build, tag, push, GitHub release with `tajweed.apk`), version from package.json, APK-only daily banner plus a 'Check for updates' button with the current version (maintainer, 2026-10-01). | none | in-progress |
| T28 | #60 | [task] About page (#/about: what the app is, sources and credits, review status, version and updates) and a footer on every page (About, Report an issue as a prefilled GitHub issue with an email fallback, email muhammadmoustafa22@gmail.com, GitHub profile, source code) (maintainer, 2026-10-01). The version and update button come from T27 at merge. | none | in-progress |
| L1 | #7 | [task] Foundations: letters, harakat, sukun, shadda, tanween, istiʿadha and basmala. Animation: marks landing on a letter with their sound. Allows lessons with no focus rule (adjust lessons.test.ts). | T2 | done |
| L2 | #8 | [task-hard] Makharij: a reusable MouthDiagram SVG (side view: jawf, halq, lisan, shafatan, khayshum) with highlightable regions, used by later lessons. | T2 | done |
| L2b | #31 | [task] One controllable makharij clip per section (jawf, halq, lisan, shafatan, khayshum) on MouthDiagram, slow enough to read captions. | T10 | done |
| L2c | #37 | [task-hard] Makharij as a unit: intro + five chapters (jawf, halq, lisan, shafatan, khayshum), one clip step per makhraj (17, ن/ل/ر separate) and each letter shown in turn; lesson list groups units (maintainer, 2026-09-28). | T13 | done |
| L2d | #45 | [task-hard] Exact contact markers per makhraj (17): a dot or edge line where the articulators meet, data beside the makharij table, drawn by MouthDiagram in the makharij clips (maintainer, 2026-09-28). | L2c | done |
| L3 | #9 | [task] Heavy and light letters (tafkhim/tarqiq basics, خص ضغط قظ), reusing MouthDiagram. | L2, T6, T10 | done |
| L4 | #10 | [task] Noon sakinah/tanween 1: izhar halqi. | T2, T6 | done |
| L5 | #11 | [task] Noon sakinah/tanween 2: idgham with and without ghunnah (`idgham_ghunnah`, `idgham_wo_ghunnah`). Animation: the noon merging into the next letter. | T2 | done |
| L6 | #12 | [task] Noon sakinah/tanween 3: iqlab (`iqlab`). Animation: noon turning into meem. | T2 | done |
| L7 | #13 | [task] Noon sakinah/tanween 4: ikhfa (`ikhafa`). Animation: noon hidden in a nasal cloud. | T2 | done |
| L8 | #14 | [task] Meem sakinah: ikhfa, idgham and izhar shafawi (`ikhafa_shafawi`, `idgham_shafawi`), lips on MouthDiagram. | L2, T6, T10 | done |
| L9 | #15 | [task] Ghunnah on mushaddad noon/meem (`ghunnah`), nose on MouthDiagram, 2 counts. | L2, T10 | done |
| L10 | #16 | Qalqalah — sample lesson from the scaffold. Quiz added by T2. | — | done |
| L10b | #51 | [task] Qalqalah clip: an al-Husary word for ط ب ج too (Juz ʿAmma/Fatiha, else surahs 58–77), and the player stops after each letter's step (a per-step option; other clips unchanged) (maintainer, 2026-09-29). | none | done |
| L11 | #17 | [task] Lam rules: lam shamsiyyah (`laam_shamsiyah`) and qamariyyah, lam in the name of Allah. | T2, T6 | done |
| L12 | #18 | [task] Ra: tafkhim and tarqiq. | L3, T6 | done |
| L13 | #19 | [task] Natural madd (`madda_normal`): a reusable MaddBar animation (2/4/5/6 counts) used by L14–L16. | T2 | done |
| L13b | #32 | [task] Natural-madd clip redone: real syllables بَا بُو بِي, arrow at the madd letter, bar growing ~1 s per count under it, captions. | T10 | done |
| L13c | #34 | [task] Natural madd as one counting demo: say-it-with-me, marker at the first count and at the end of the second, one syllable (the three take the same time) (maintainer, 2026-09-28). | none | done |
| L14 | #20 | [task] Madd muttasil and munfasil — the API marks both as `madda_obligatory` (4–5 counts in Hafs), reusing MaddBar. | L13c | done |
| L15 | #21 | [task] Madd lazim (`madda_necessary`), reusing MaddBar. | L13c | done |
| L16 | #22 | [task] Other madd: ʿarid lis-sukun (`madda_permissible`), leen, badal, silah, reusing MaddBar. | L13c | done |
| L16b | #44 | [task] Split Other madd into two lessons in the madd unit: madd when stopping (ʿarid, leen, ʿiwad) and badal and silah, content moved not rewritten (maintainer, 2026-09-28). | L16 | done |
| L17 | #23 | [task] Hamzat al-wasl and silent letters (`ham_wasl`, `slnt`). | T2 | done |
| L18 | #24 | [task] Idgham of letters: mithlayn, mutajanisayn, mutaqaribayn (`idgham_mutajanisayn`, `idgham_mutaqaribayn`). | T2 | done |
| L19 | #25 | [task] Waqf and ibtida: the stop signs in the mushaf. | T2, T6 | done |
| L20 | #26 | [task-hard] Sifat al-huruf in depth, reusing MouthDiagram. | L2, T10 | done |
| L21 | #47 | [task] Split Foundations into four lessons (letters; harakat and sukun; shaddah and tanween; istiʿadha and basmala), content moved, id `foundations` kept for the first (maintainer, 2026-09-28). | L1 | done |
| L22 | #48 | [task-hard] Unit 9 Practice & review: whole short surahs with every rule colored, full legend, mixed quiz on all taught rules (maintainer, 2026-09-28). | T18 | done |
| L23 | #49 | [task-hard] Unit 11 (advanced) Hafs special words: saktat, imalah, tas-hil, ishmam/rawm, sad/seen words, naql (maintainer, 2026-09-28). | T20 | done |
| L24 | #50 | [task] Unit 12 (advanced) Finer levels: tafkhim levels, ghunnah levels, complete/incomplete idgham (maintainer, 2026-09-28). | T20 | done |
| L25 | #52 | [task-hard] Letters page: a card per letter (28) with its makhraj animation (contact point, L2d) and sifat, and its sound as an al-Husary word where the letter is clearly heard, pointer on the letter (maintainer, 2026-09-29: Husary word per letter; ayat from Tabarak/Qad Samiʿa allowed; each card lists the letter's qualities, paired then single, from the sifat data). | none | done |
