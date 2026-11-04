## 2026-11-01 — Preserve concurrent saved-message updates

- Objective and starting point: product idea #1685; overlapping successful Save for Later requests replace the entire bookmark list from stale snapshots.
- Checkpoint 1 — Investigation: reproduced two successful requests finishing in reverse order on staging 579004d; B disappears when A completes. Channel messages, threads and replies share the affected hook. Previous persistence fix #1484 has a different scope.
- Planned implementation: organisation-scoped, per-message reducer updates, shared pending-operation protection, and rollback that preserves unrelated mutations.
- Outcome: partial; implementation, verification and Ziki idea approval pending. PR target staging approved by the owner.

## 2026-11-02 — Implementation and verification checkpoint

- Idea #1685 received three good votes and became Ziki issue #2232; our reproduction-backed confirmation was recorded. Assignment remains gated on remaining confirmations.
- Implemented targeted reducer mutations, per-message in-flight protection, targeted rollback, list-load revisions and organisation generation checks. Organisation switches clear bookmark state; switching away and back still invalidates older completions.
- Six controlled hook regression tests pass: reverse response order, failed/thrown save, save plus failed removal, duplicate clicks, organisation return and stale initial load. Full formatting/lint passed (120 warnings, zero lint errors); type checking passed with locked dependencies.
- Dependency-junction verification initially failed; installed dependencies locally with the unchanged lockfile. Production build verification remains in progress.
- Added consistency/verification documentation and README link. Outcome: implementation prepared; final build, manual workflow verification and PR pending.
- Checkpoint 3 — Final verification: production build and type check pass with locked dependencies; six hook regressions pass. Changes to shared organisation switching were included in those checks. No authenticated production account was mutated; live signed-in/end-to-end verification is still outstanding.
- Outcome: code and documentation ready for a draft PR against staging; final Ziki confirmation and assignment still pending. No production deployment is claimed.
- Checkpoint 4 — Remote CI: draft PR #1422 exposed an existing message-delivery test loader that only resolved the reducer's Actions import; our added helper import could not resolve from its data URL. Extended that loader to compile the real bookmark helper too. Vercel separately reports deployment authorization is required; no permissions were changed.

## 2026-11-01 — Preserve cohort planner curriculum topics

- Objective and starting point: marketing idea #1686; mixed plain and explicit week lines silently overwrote topics in the public planner.
- Checkpoint 1 — Investigation: reproduced against staging 579004d with the actual parser. Screen, Markdown and print share the generated plan. Existing planner feature reports do not cover collisions.
- Checkpoint 2 — Implementation: reserve explicit weeks before filling remaining slots; retain the first duplicate week and show a specific conflict notice. No data collection or backend changes.
- Outcome: partial; regression and workflow verification pending, Ziki idea approval pending. PR target staging approved by the owner.

## 2026-11-02 — Verification checkpoint

- Idea #1686 received three good votes and became Ziki issue #2233; our reproduction-backed confirmation was recorded. Assignment remains gated on the remaining confirmations.
- Focused parser regressions passed. Full formatting and lint passed (120 warnings, no lint errors). Type checking passed after a frozen-lockfile dependency install.
- Initial reuse of an older dependency junction failed type/build checks because dependencies were missing and Turbopack rejects an external node_modules link. Replaced only the junction with a local locked installation; production build verification is in progress.
- Documentation: added weekly-topic input/conflict rules and linked them from README. Outcome: implementation prepared; final build, browser checks and PR pending.
- Checkpoint 3 — Final verification: four parser/export regressions pass; type check and production build pass after locked installation. Browser generation and the actual downloaded Markdown preserve HTML, Introduction and JavaScript and include the duplicate-week warning. Inspected 375px phone and 1280px desktop layouts in light mode without horizontal overflow. Screenshots/download are session artifacts outside the repository. Clipboard contents and dark-theme rendering were not verified.
- Outcome: code and documentation ready for a draft PR against staging; final Ziki confirmation and assignment still pending. No production deployment is claimed.

## 2026-11-02 — Rebase planner PR #1423

- Objective and starting point: maintainer closed PR #1423 because it conflicted with current staging.
- Checkpoint 1 — Investigation: staging ada8f4e includes the saved-message fix and its documentation. Only README and this work log conflict; planner implementation and tests apply cleanly.
- Checkpoint 2 — Resolution: preserved both feature guides and both existing work histories. Rebased the original planner commit onto staging; verification pending.
