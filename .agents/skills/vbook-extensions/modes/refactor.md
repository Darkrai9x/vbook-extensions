# REFACTOR mode

Align a working extension with current conventions without changing behavior. Read
`reference/runtime.md`, `reference/type-contracts.md`, relevant API sections,
`reference/cli.md`, and `reference/verify-checklist.md`. Broken behavior belongs in FIX.

## 1. Capture baseline

Run TEST mode's complete real-input chain first. Save each script's fields, representative
values, hosts, and array counts. Record pre-existing failures; do not silently repair
them during refactoring.

## 2. Build a template diff

Compare with `templates/<type>/` and list only convention gaps, including:

- hardcoded fallback BASE_URL plus optional DOMAIN override
- shared normalizeUrl on site-URL inputs
- guarded fetch responses and string pagination tokens
- current detail/type/format fields
- correct chap→track chain and playback order
- manifest/file consistency, `metadata.encrypt: true`, and current config shapes
- Rhino compatibility and removal of teaching comments

Keep legitimate site-specific request, selector, player, signing, and pagination logic.
Adding new data or capability is a feature and requires approval.

## 3. Change and prove parity

Apply one concern at a time. After every runtime-path change, rerun the same baseline
input. Fields, equivalent values, counts, and URL hosts must match except for an explicit
contract-only correction. Revert unintended divergence. Shared-config edits require the
whole dependent chain to be retested.

## 4. Finish

Bump `metadata.version` once, summarize the convention changes and baseline parity, then
ask before build/install.

Done means output behavior matches the baseline and current template/runtime conventions
hold.
