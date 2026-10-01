# Code review and validation — 2026-10-01

Branch: `codex/code-review-2026-10-01`.
Initial revision: `58cbe937632084df456f24437e8ad00c5c9ad252`.
The shared checkout advanced during the review to `cd24a5a` (iPhone safe-area
changes committed by another session). Those changes were preserved; the final
unit run includes its two new tests. This is a review of an actively changing
checkout, not an immutable release certification.

The baseline lint, unit tests, type checks and production build passed. Eight
new expected-failure tests reproduce six open findings. Passing the existing
suite therefore does not mean the boundary and recovery paths below are safe.
Application defects were reported, not fixed, on this branch.

## Scope and evidence

Reviewed app composition/routing, locale and progress state, quiz generation
and scoring, Quran markup/import boundaries, animation/audio lifecycle,
updates/versioning, Android/release/iOS build tooling, test configuration,
GitHub workflows, README, CLAUDE.md, roadmap, and the three local task-agent
Markdown definitions. Inspected representative content/animation modules and
their tests; this was not a line-by-line review of every authored lesson.

P1 means a user-facing crash or loss of a core capability; P2 means an
incorrect or unreliable supported behavior; P3 means a narrower correctness
or maintenance issue. Test evidence and code-inspection evidence are
distinguished below. No external API regeneration, release, push, or issue
creation was performed. Quran and matn data were not edited.

## Findings

| ID | Priority | Finding | Evidence |
| :--- | :--- | :--- | :--- |
| R1 | P1 | Invalid persisted attempt data can crash the progress page | Two automated reproductions; renderer inspected |
| R2 | P2 | Reset restores old progress when storage removal fails | Automated reproduction |
| R3 | P2 | Mounted progress views miss changes from another tab | Automated reproduction |
| R4 | P2 | iOS passes the Android APK update gate | Automated reproduction |
| R5 | P3 | Prerelease versions are ordered lexically | Automated reproduction |
| R6 | P2 | Quran import boundaries accept missing text and duplicate chapter IDs | Two automated reproductions |
| R7 | P2 | A failed Quran refresh can leave a partially updated dataset | Code inspection |
| R8 | P2 | A persistent lazy-import failure has no React recovery boundary | Code inspection |
| R9 | P2 | Ayah playback rejects without handling or user feedback | Code inspection |

### R1 — Validate persisted attempt semantics before rendering

[progress.ts:125](../src/progress.ts#L125) accepts every string as a `RuleId`.
[progress.ts:131](../src/progress.ts#L131) accepts any date string and any
numeric score, without validating its range or agreement with `results`.
[ProgressPage.tsx:87](../src/components/ProgressPage.tsx#L87) dereferences
`ALL_RULES[stat.rule].name`; an unknown stored rule makes this undefined and
throws. [bilingual.ts:24](../src/i18n/bilingual.ts#L24) formats the stored date;
an invalid date throws a `RangeError`. App has no error boundary to contain it.

Trigger: put a version-1 attempt for `qalqalah` in
`tajweed.progress.attempts` with `results: [{rule: 'unknown-rule', correct: true}]`,
or `date: 'invalid-date'`, then open progress. A corrupt, stale or externally
modified record is enough; no invalid API response is required.

Fix: validate known rule IDs, valid date values, nonnegative integer counts,
positive totals and score/results consistency at the storage boundary. Keep
the documented per-record recovery policy, and test that valid siblings
remain usable. Also validate the learned-ID array: `parseIds` currently relies
on a cast and accepts a JSON string as an iterable of characters.

Reproduction: the two R1 tests in
[progress.review.test.ts](../src/progress.review.test.ts).

### R2 — A failed reset resurrects cached data

[progress.ts:279](../src/progress.ts#L279) clears in-memory values and sets
their raw cache baselines to null *before* removing the two storage keys. If
`removeItem` throws but reads still work, the next snapshot sees the old
non-null JSON and reparses it, restoring both attempts and learned flags.
This contradicts the reset's documented session behavior.

Trigger: persist an attempt, make storage removal fail, reset, then read the
store. The reproduction observes old data again immediately, not only after
a page reload.

Fix: preserve the last successfully read baseline when removal fails, using
the same principle as the existing write-failure handling. Test failures for
each key independently as well as both together. Clearly distinguish a
session reset from a successful persisted reset when removal is blocked.

Reproduction: R2 in [progress.review.test.ts](../src/progress.review.test.ts).

### R3 — Cross-tab writes do not notify React subscribers

[progress.ts:26](../src/progress.ts#L26) subscribes only to an in-module Set.
There is no `storage` listener. A change made by another tab updates browser
storage, but does not notify `useSyncExternalStore`; a mounted home/progress
page can retain stale learned flags, scores and next-lesson suggestions.

Fix: subscribe to relevant storage events (including a clear event), notify
the store and clean up the event listener. A subsequent unrelated render is
not a substitute for a notification. Test learned flags, attempts and reset
across two mounted views or browser contexts.

Reproduction: R3 in [progress.review.test.ts](../src/progress.review.test.ts).

### R4 — iOS is offered Android updates

[platform.ts:5](../src/update/platform.ts#L5) uses
`Capacitor.isNativePlatform()`, which is also true on native iOS. Both
UpdateBanner and UpdateStatus use that gate, while
[check.ts:71](../src/update/check.ts#L71) selects `tajweed.apk`.
The new iOS wrapper can therefore offer a file it cannot install. The
existing tests mock a boolean native gate, so they miss the platform split.

Fix: make the APK gate explicitly Android-specific, or implement a separate
iOS update flow. Cover Android, iOS and browser behavior for both components.

Reproduction: R4 in
[platform.review.test.ts](../src/update/platform.review.test.ts), with native
true and `getPlatform()` returning `ios`.

### R5 — Prerelease comparisons can reverse version order

[version.ts:42](../src/update/version.ts#L42) compares the whole prerelease
suffix lexically. It treats `1.0.0-beta.2` as newer than `1.0.0-beta.10`.
`nextVersion` and update checks share this comparison. Stable versions are
unaffected, so this is a narrower issue while normal releases remain stable.

Fix: compare dot-separated prerelease identifiers with numeric identifiers
ordered numerically, or explicitly reject prereleases if they are unsupported.
Add format validation and comparison tests around the chosen contract.

Reproduction: R5 in
[platform.review.test.ts](../src/update/platform.review.test.ts).

### R6 — Static types conceal incomplete API validation

[quran-api.ts:26](../scripts/lib/quran-api.ts#L26) checks that a requested key
exists, but not that its text is a nonempty string. A response containing
only `verse_key` is accepted with an undefined value; JSON serialization
then drops that entry. [quran-api.ts:118](../scripts/lib/quran-api.ts#L118)
checks chapter array length, but not unique IDs 1–114 or nonempty bilingual
names. An array of 114 duplicate ID-1 chapters becomes a single-entry map.
[fetch.ts:13](../scripts/lib/fetch.ts#L13) returns a type cast, not runtime
schema validation. This is failure to validate imports, not evidence that
the committed text is currently wrong.

Fix: validate required fields, verse-key identity, unique chapter IDs and
complete coverage before returning trusted domain data. Errors should name
the endpoint/key and offending value. Extend word/timing checks with finite
numbers and response identity checks as part of the same boundary review.

Reproduction: R6 tests in
[quran-api.test.ts](../scripts/lib/quran-api.test.ts) (fixed in T32). Fixtures
contain no invented Quran text and make no network calls.

### R7 — Quran refresh is not transactional

[fetch-quran.ts:40](../scripts/fetch-quran.ts#L40) overwrites `quran.json`
before downloading word data. It writes `quran-words.json` at line 53 before
fetching chapter names at line 56. A later failed request leaves earlier
outputs changed and later ones old. [fetch.ts:27](../scripts/lib/fetch.ts#L27)
writes destination files directly, so an interrupted write can also truncate
a previously valid output.

Fix: fetch and validate all three datasets first; stage writes in temporary
files and use a replacement strategy with rollback for a failed multi-file
commit. Renaming each file alone does not make the entire set atomic. Add
fault-injection tests after the first download and during replacement that
assert destination bytes remain unchanged. No live refresh was run here.

### R8 — Persistent route import errors can blank the app

[App.tsx:82](../src/App.tsx#L82) provides Suspense, but no error boundary.
[reloadOnFailedImport.ts:29](../src/reloadOnFailedImport.ts#L29) deliberately
rejects after a recent failed reload, or if its sessionStorage guard cannot
be used. A rejected `React.lazy` import throws during rendering; Suspense
handles loading, not rejected imports. An uncached route while offline or a
still-missing chunk after deployment can unmount the React tree.

Fix: place a bilingual error/retry boundary around routed content, retaining
navigation. Test a first missing chunk, a guarded second failure and blocked
sessionStorage against the production build. Avoid automatic reload loops.
The existing helper unit tests cover rejection, but not app-level recovery.

### R9 — Failed example playback produces an unhandled rejection

[AyahExample.tsx:27](../src/components/AyahExample.tsx#L27) discards the
promise from `HTMLMediaElement.play()` with `void`; that does not catch
rejection. There is also no media error handler or failure message. A learner
pressing Listen offline before the ayah is cached, or when playback is
blocked, receives no explanation and the browser reports an unhandled
rejection. The animation audio driver already catches playback failure,
making the behavior inconsistent.

Fix: catch playback failures, reset UI state and expose a bilingual,
accessible failure/retry message. Test rejected play and media error events
without real network or elapsed-time assertions.

## Validation results

| Check | Result |
| :--- | :--- |
| Initial `npm run check` | Passed: lint, 82 files / 2,221 tests, TypeScript projects, Vite production build and PWA generation |
| Focused progress/platform reproductions | 6 expected failures in 2 files; all targeted defects reproduced |
| Final `npm run check` | Passed: lint, 86 files, 2,223 ordinary passes and 8 expected failures (2,231 total), TypeScript, production/PWA build |
| Full Chromium suite, port 4185, 2 workers | 422 passed, 2 failed out of 424; failed title cases described below |
| Isolated rerun of those two cases, port 4186, 1 worker | 2 passed; not a replacement for the full-run result |
| Full isolated Chromium suite, port 4187, 4 workers | 424 passed out of 424; no overlapping review builds |
| `npm run apk` | Passed outside sandbox: debug APK produced, 93 Gradle tasks (27 executed, 66 up-to-date) |
| `git diff --check` | Passed |

The first browser run inside the sandbox could not launch Chromium
(`browserType.launch: spawn EPERM`). A single-file diagnostic confirmed that
environment problem; the stalled runs were terminated by their verified
PIDs and rerun outside the sandbox. They are not counted as 424 application
failures. A diagnostic on port 4173 also refused because the first review
server was still using that port; subsequent runs used distinct ports.

The successful-launch full run failed `lam-rules title renders in en`
(missing language-toggle control, 30-second timeout) and
`idgham-letters title renders in ar` (missing h2, 5-second timeout), both in
`e2e/language.spec.ts:24`. Both subsequently passed alone. Production output
was rebuilt by the Android check while this full suite was running; other
development/checks also shared the checkout. Replacement of served `dist`
is a plausible source of the blank pages, **not a proven diagnosis**. The
clean full rerun passed all 424 cases, so these failures did not reproduce
without that overlap. This does not prove the exact cause or justify hiding
the original failures as unconditional passes.

Environment: Windows PowerShell, Node `v24.21.0`, npm `11.19.0`, repository
version `0.2.0`. Unit diagnostics include jsdom's unimplemented `scrollTo`
and media `load`, despite a successful test exit. Browser logs include the
`NO_COLOR`/`FORCE_COLOR` warning. The Android check initially failed before
build startup inside the sandbox with `uv_os_get_passwd ENOMEM`; outside it,
the debug build succeeded. Native warnings remain: Node DEP0190 from the
shell-enabled process helper, Gradle `flatDir` repositories and deprecated
features incompatible with Gradle 9. These are maintenance observations,
not evidence that the generated APK failed.

Local detailed logs (gitignored): `review-check.log`,
`review-check-final.log`, `review-reproductions.log`,
`review-ui-confirmed.log`, `review-ui-followup.log`,
`review-ui-isolated.log` and `review-apk-confirmed.log`.
Browser failure context is under `logs/review-ui-results/` (also gitignored).
Keep these with the local checkout if further failure diagnosis is needed.

Not run: an iOS/Xcode build on this Windows host, signed release generation,
installation on physical devices, a controlled offline/deploy update matrix,
fresh live Quran/matn regeneration, dependency advisory scanning, or
qualified-teacher content certification. Android debug compilation and
Chromium success cannot certify Safari, native iOS playback or real-device
installation. Existing browser tests cover both locales, phone layout,
reduced motion, lesson/navigation/quiz/progress and reciter-audio behavior;
they do not exhaustively cover the failure paths in R1–R9.

## Coding-instruction review and changes

Added [AGENTS.md](../AGENTS.md) as an agent-neutral entry point to the existing
instructions. Added **Code quality** to [CLAUDE.md](../CLAUDE.md#code-quality),
including ownership, runtime validation, transactional content generation,
error recovery, limits, lifecycle cleanup, bilingual/accessibility rules,
platform coverage, meaningful tests, release traceability and process safety.
Each rule names actual checks or explicitly says review; nonexistent
XPPAUT/C++ tools are not represented as available enforcement.

The imported blanket ban on fallbacks was adapted: this app intentionally
supports session-only progress and unavailable offline audio. Required
content must not silently disappear, but optional failures can degrade when
documented and tested. TypeScript aliases are legitimate; the useful rule
here is a single canonical domain vocabulary. Model/Session references,
`extern "C"`, sanitizers, numerical golden outputs, XPPAUT extensions and its
paper findings file are irrelevant to this repository.

Existing instruction gaps:

- **Enforcement differs from the gate prose.** `npm run check` does not run
  Playwright or native builds. Deploy CI runs check only on main/manual
  dispatch; no pull-request workflow is present. iOS CI builds but does not
  run lint/unit tests or verify rendered bilingual lesson content. Consider
  a PR validation workflow and targeted production-browser coverage.
- **No general quality section or AGENTS entry point existed.** The module
  ownership rule lived under Task agents; the new section makes it apply to
  direct work too. Task-card worktree/commit constraints remain scoped to
  assigned cards; direct maintainer authorization controls external writes.
- **Data tests do not prove semantic religious correctness.** Bilingual
  presence, references and colors are checked, but tajweed explanations and
  makharij require qualified-teacher review. Existing review notices remain
  necessary; this audit does not certify the content.
- **Warning-free claims need precise scope.** Lint reports zero warnings,
  but test environment diagnostics and native-toolchain warnings exist.
  Fix or account for these in their owner rather than suppressing real
  defects or describing all native gates as warning-free.

## Suggested fix order and remaining checks

1. Fix R1 and R8 together to reject corrupt state and contain route errors.
2. Fix R2/R3 and the Android/iOS gate R4.
3. Harden imports and generation as one change (R6/R7), with fault injection.
4. Add ayah playback failure UX (R9) and correct prerelease comparisons (R5).
5. Add platform and offline failure coverage to CI, retaining explicit
   manual teacher/device review where automated checks cannot substitute.

With each fix, remove `.fails` from its corresponding reproduction and run
the regular gates. Eight `it.fails` cases are intentional, visible evidence
on this review branch; they are not eight successfully functioning behaviors.
Their unexpected passes fail Vitest so repaired defects cannot go unnoticed.

All review-owned background runs were closed; none of this review's entries
remain in `.claude/background-tasks.md`. Other sessions' entries were retained.
