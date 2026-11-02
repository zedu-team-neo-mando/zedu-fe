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
